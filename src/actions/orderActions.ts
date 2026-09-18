"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/actions/authActions";
import { revalidatePath } from "next/cache";

export interface CreateOrderInput {
  customerName: string;
  customerPhone: string;
  province: string;
  district: string;
  city: string;
  ward: string;
  street: string;
  deliveryZoneId: string;
  paymentMethod: string;
  screenshotBase64?: string;
  referenceCode?: string;
  notes?: string;
  items: {
    productVariantId: string;
    quantity: number;
    price: number;
  }[];
}

// Automatically release expired reservations before placing orders or calculating inventory
export async function cleanExpiredReservations() {
  try {
    const now = new Date();
    // Find expired active reservations
    const expiredReservations = await prisma.reservation.findMany({
      where: {
        status: "ACTIVE",
        expiresAt: { lt: now },
      },
      include: {
        order: true,
      },
    });

    if (expiredReservations.length > 0) {
      const reservationIds = expiredReservations.map((r) => r.id);
      await prisma.reservation.updateMany({
        where: { id: { in: reservationIds } },
        data: { status: "EXPIRED" },
      });

      // Also update pending orders that expired without payment
      for (const res of expiredReservations) {
        if (res.order && (res.order.orderStatus === "PENDING")) {
          await prisma.order.update({
            where: { id: res.order.id },
            data: {
              orderStatus: "CANCELLED",
              notes: (res.order.notes ? res.order.notes + " | " : "") + "Auto-cancelled: 30-minute reservation expired.",
            },
          });
        }
      }
    }
  } catch (error) {
    console.error("Error cleaning expired reservations:", error);
  }
}

export async function createOrderAction(input: CreateOrderInput) {
  try {
    // 1. Run cleanup of any expired reservations first
    await cleanExpiredReservations();

    const user = await getCurrentUser();

    if (!input.items || input.items.length === 0) {
      return { success: false, error: "Your cart is empty" };
    }

    if (!input.customerName || !input.customerPhone) {
      return { success: false, error: "Customer name and phone number are required" };
    }

    if (!input.deliveryZoneId) {
      return { success: false, error: "Please select a delivery zone" };
    }

    // 2. Fetch delivery zone
    const zone = await prisma.deliveryZone.findUnique({
      where: { id: input.deliveryZoneId },
    });

    if (!zone || !zone.active) {
      return { success: false, error: "Selected delivery zone is unavailable" };
    }

    // 3. Verify variant stock availability
    let subtotal = 0;
    const now = new Date();
    // Reservation window: 30 minutes from now
    const reservationExpiresAt = new Date(now.getTime() + 30 * 60 * 1000);

    for (const item of input.items) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.productVariantId },
        include: {
          reservations: {
            where: {
              status: "ACTIVE",
              expiresAt: { gt: now },
            },
          },
        },
      });

      if (!variant) {
        return { success: false, error: "One or more products in your cart are invalid" };
      }

      const activeReserved = variant.reservations.reduce((sum, r) => sum + r.quantity, 0);
      const effectiveStock = variant.stock - activeReserved;

      if (effectiveStock < item.quantity) {
        return {
          success: false,
          error: `Sorry, this item was just reserved by another customer or is out of stock.`,
        };
      }

      subtotal += item.price * item.quantity;
    }

    const deliveryFee = zone.deliveryFee;
    const totalAmount = subtotal + deliveryFee;

    const formattedAddress = `${input.street}, Ward ${input.ward}, ${input.city}, ${input.district}, ${input.province}`;

    // Create address if user is logged in
    let addressId: string | undefined = undefined;
    if (user?.id) {
      const savedAddress = await prisma.address.create({
        data: {
          userId: user.id,
          province: input.province,
          district: input.district,
          city: input.city,
          ward: input.ward,
          street: input.street,
        },
      });
      addressId = savedAddress.id;
    }

    const hasProof = Boolean(input.screenshotBase64);
    const initialPaymentStatus = hasProof ? "SUBMITTED" : "PENDING";
    const initialOrderStatus = hasProof ? "PAYMENT_SUBMITTED" : "PENDING";

    // 4. Create Order + OrderItems + Reservations in database transaction
    const createdOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: user?.id || null,
          customerName: input.customerName.trim(),
          customerPhone: input.customerPhone.trim(),
          addressId: addressId || null,
          deliveryZoneId: zone.id,
          deliveryFee,
          subtotal,
          totalAmount,
          paymentMethod: input.paymentMethod,
          paymentStatus: initialPaymentStatus,
          orderStatus: initialOrderStatus,
          reservationExpiresAt,
          shippingAddress: formattedAddress,
          notes: input.notes || null,
          orderItems: {
            create: input.items.map((i) => ({
              productVariantId: i.productVariantId,
              quantity: i.quantity,
              price: i.price,
            })),
          },
        },
      });

      // Create reservation records for each variant
      for (const item of input.items) {
        await tx.reservation.create({
          data: {
            variantId: item.productVariantId,
            orderId: order.id,
            quantity: item.quantity,
            expiresAt: reservationExpiresAt,
            status: "ACTIVE",
          },
        });
      }

      // Create payment record if method is digital
      if (input.paymentMethod !== "COD") {
        await tx.payment.create({
          data: {
            orderId: order.id,
            paymentMethod: input.paymentMethod,
            screenshotUrl: input.screenshotBase64 || null,
            referenceCode: input.referenceCode || null,
            verificationStatus: hasProof ? "PENDING" : "PENDING",
          },
        });
      }

      return order;
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/orders/${createdOrder.id}`);

    return {
      success: true,
      orderId: createdOrder.id,
      expiresAt: reservationExpiresAt.toISOString(),
    };
  } catch (error: any) {
    console.error("Order creation error:", error);
    return { success: false, error: error.message || "Failed to process order" };
  }
}

export async function uploadPaymentProofAction(orderId: string, screenshotBase64: string, referenceCode?: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    if (order.orderStatus === "CANCELLED") {
      return { success: false, error: "This order has already expired or been cancelled" };
    }

    if (order.payment) {
      await prisma.payment.update({
        where: { id: order.payment.id },
        data: {
          screenshotUrl: screenshotBase64,
          referenceCode: referenceCode || order.payment.referenceCode,
          verificationStatus: "PENDING",
        },
      });
    } else {
      await prisma.payment.create({
        data: {
          orderId: order.id,
          paymentMethod: order.paymentMethod,
          screenshotUrl: screenshotBase64,
          referenceCode: referenceCode || null,
          verificationStatus: "PENDING",
        },
      });
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: "SUBMITTED",
        orderStatus: "PAYMENT_SUBMITTED",
      },
    });

    revalidatePath(`/orders/${orderId}`);
    revalidatePath("/admin/orders");

    return { success: true };
  } catch (error: any) {
    console.error("Upload payment proof error:", error);
    return { success: false, error: error.message || "Failed to upload payment proof" };
  }
}
