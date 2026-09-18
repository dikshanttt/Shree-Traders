"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/actions/authActions";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }
  return user;
}

// Order Management Actions
export async function confirmOrderAction(orderId: string) {
  await requireAdmin();

  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: true,
        reservations: true,
        payment: true,
      },
    });

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    // 1. Deduct stock for each variant and update reservation to CONFIRMED
    for (const item of order.orderItems) {
      await tx.productVariant.update({
        where: { id: item.productVariantId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    // 2. Mark active reservations as CONFIRMED
    await tx.reservation.updateMany({
      where: { orderId: order.id, status: "ACTIVE" },
      data: { status: "CONFIRMED" },
    });

    // 3. Mark payment as VERIFIED if digital
    if (order.payment) {
      await tx.payment.update({
        where: { id: order.payment.id },
        data: {
          verificationStatus: "VERIFIED",
          verifiedAt: new Date(),
        },
      });
    }

    // 4. Update order status to CONFIRMED
    const updated = await tx.order.update({
      where: { id: order.id },
      data: {
        orderStatus: "CONFIRMED",
        paymentStatus: "VERIFIED",
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    revalidatePath(`/orders/${orderId}`);
    revalidatePath("/products");

    return { success: true, order: updated };
  });
}

export async function updateOrderStatusAction(orderId: string, newStatus: string) {
  await requireAdmin();

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { orderStatus: newStatus },
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/orders/${orderId}`);
  return { success: true, order: updated };
}

export async function cancelOrderAction(orderId: string, reason?: string) {
  await requireAdmin();

  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { reservations: true },
    });

    if (!order) return { success: false, error: "Order not found" };

    // Release all reservations back to store pool
    await tx.reservation.updateMany({
      where: { orderId: order.id },
      data: { status: "CANCELLED" },
    });

    // Update order status
    const updated = await tx.order.update({
      where: { id: order.id },
      data: {
        orderStatus: "CANCELLED",
        notes: (order.notes ? order.notes + " | " : "") + (reason ? `Cancelled by Admin: ${reason}` : "Cancelled by Admin"),
      },
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/orders/${orderId}`);
    return { success: true, order: updated };
  });
}

// Product Management Actions (Create, Update, Delete, Restock)

export async function createProductAction(formData: FormData): Promise<{ success: boolean; error?: string; product?: any }> {
  await requireAdmin();

  const name = (formData.get("name") as string)?.trim();
  const nameNe = (formData.get("nameNe") as string)?.trim() || null;
  const categoryId = formData.get("categoryId") as string;
  const brand = (formData.get("brand") as string)?.trim() || "Shree Traders";
  const price = parseFloat(formData.get("price") as string);
  const discountPriceStr = formData.get("discountPrice") as string;
  const discountPrice = discountPriceStr ? parseFloat(discountPriceStr) : null;
  const description = (formData.get("description") as string)?.trim() || name;
  const descriptionNe = (formData.get("descriptionNe") as string)?.trim() || null;
  const stock = parseInt(formData.get("stock") as string, 10) || 0;
  const lowStockLimit = parseInt(formData.get("lowStockLimit") as string, 10) || 5;
  const homepagePriority = parseInt(formData.get("homepagePriority") as string, 10) || 0;
  const featuredCategory = (formData.get("featuredCategory") as string)?.trim() || null;
  const status = (formData.get("status") as string) || "ACTIVE";

  const imageUrl = (formData.get("imageUrl") as string)?.trim() ||
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800";
  const additionalImagesStr = (formData.get("additionalImages") as string)?.trim() || "";

  const colorsInput = (formData.get("colors") as string)?.trim() || "";
  const sizesInput = (formData.get("sizes") as string)?.trim() || "";

  if (!name || !categoryId || isNaN(price)) {
    return { success: false, error: "Product name, category, and price are required." };
  }

  // Generate URL slug
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const slug = `${baseSlug}-${Date.now().toString(36)}`;

  // Parse images
  const allImages = [imageUrl];
  if (additionalImagesStr) {
    const extra = additionalImagesStr
      .split(/[\n,]+/)
      .map((url) => url.trim())
      .filter((url) => url.length > 0 && url !== imageUrl);
    allImages.push(...extra);
  }

  // Parse colors & sizes
  const colorsList = colorsInput
    ? colorsInput.split(",").map((c) => c.trim()).filter((c) => c.length > 0)
    : [];
  const sizesList = sizesInput
    ? sizesInput.split(",").map((s) => s.trim()).filter((s) => s.length > 0)
    : [];

  return await prisma.$transaction(async (tx) => {
    // 1. Create base product
    const product = await tx.product.create({
      data: {
        categoryId,
        name,
        nameNe,
        slug,
        description,
        descriptionNe,
        brand,
        price,
        discountPrice,
        stock,
        lowStockLimit,
        homepagePriority,
        featuredCategory,
        status: stock <= 0 ? "OUT_OF_STOCK" : status,
      },
    });

    // 2. Create product images
    for (let i = 0; i < allImages.length; i++) {
      await tx.productImage.create({
        data: {
          productId: product.id,
          imageUrl: allImages[i],
          isPrimary: i === 0,
        },
      });
    }

    // 3. Create colors if provided
    const createdColors = [];
    for (const c of colorsList) {
      const col = await tx.productColor.create({
        data: {
          productId: product.id,
          colorName: c,
        },
      });
      createdColors.push(col);
    }

    // 4. Create sizes if provided
    const createdSizes = [];
    for (const s of sizesList) {
      const sz = await tx.productSize.create({
        data: {
          productId: product.id,
          sizeName: s,
        },
      });
      createdSizes.push(sz);
    }

    // 5. Create variants
    if (createdColors.length > 0 && createdSizes.length > 0) {
      const variantStock = Math.max(1, Math.floor(stock / (createdColors.length * createdSizes.length)));
      for (const col of createdColors) {
        for (const sz of createdSizes) {
          await tx.productVariant.create({
            data: {
              productId: product.id,
              colorId: col.id,
              sizeId: sz.id,
              stock: variantStock,
            },
          });
        }
      }
    } else if (createdColors.length > 0) {
      const variantStock = Math.max(1, Math.floor(stock / createdColors.length));
      for (const col of createdColors) {
        await tx.productVariant.create({
          data: {
            productId: product.id,
            colorId: col.id,
            stock: variantStock,
          },
        });
      }
    } else if (createdSizes.length > 0) {
      const variantStock = Math.max(1, Math.floor(stock / createdSizes.length));
      for (const sz of createdSizes) {
        await tx.productVariant.create({
          data: {
            productId: product.id,
            sizeId: sz.id,
            stock: variantStock,
          },
        });
      }
    } else {
      // Default variant
      await tx.productVariant.create({
        data: {
          productId: product.id,
          stock,
        },
      });
    }

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");
    return { success: true, product };
  });
}

export async function updateProductAction(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id") as string;
  const status = formData.get("status") as string; // ACTIVE, OUT_OF_STOCK, HIDDEN, DISCONTINUED
  const lowStockLimit = parseInt(formData.get("lowStockLimit") as string, 10) || 5;
  const homepagePriority = parseInt(formData.get("homepagePriority") as string, 10) || 0;
  const featuredCategory = (formData.get("featuredCategory") as string) || null;
  const price = parseFloat(formData.get("price") as string);
  const discountPriceStr = formData.get("discountPrice") as string;
  const discountPrice = discountPriceStr ? parseFloat(discountPriceStr) : null;
  const name = (formData.get("name") as string)?.trim();
  const nameNe = (formData.get("nameNe") as string)?.trim() || null;

  const dataToUpdate: any = {
    status,
    lowStockLimit,
    homepagePriority,
    featuredCategory,
    price,
    discountPrice,
  };

  if (name) dataToUpdate.name = name;
  if (nameNe) dataToUpdate.nameNe = nameNe;

  await prisma.product.update({
    where: { id },
    data: dataToUpdate,
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  return { success: true };
}

export async function adjustStockAction(productId: string, variantId: string | null, newStockOrDelta: number, isDelta: boolean = false): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  return await prisma.$transaction(async (tx) => {
    if (variantId) {
      const variant = await tx.productVariant.findUnique({
        where: { id: variantId },
      });

      if (!variant) return { success: false, error: "Variant not found" };

      const targetStock = isDelta ? Math.max(0, variant.stock + newStockOrDelta) : Math.max(0, newStockOrDelta);

      await tx.productVariant.update({
        where: { id: variantId },
        data: { stock: targetStock },
      });

      // Recalculate total product stock from all variants
      const allVariants = await tx.productVariant.findMany({
        where: { productId },
      });
      const totalStock = allVariants.reduce((sum, v) => sum + (v.id === variantId ? targetStock : v.stock), 0);

      await tx.product.update({
        where: { id: productId },
        data: {
          stock: totalStock,
          status: totalStock === 0 ? "OUT_OF_STOCK" : "ACTIVE",
        },
      });
    } else {
      // Direct product stock adjustment
      const product = await tx.product.findUnique({
        where: { id: productId },
        include: { variants: true },
      });

      if (!product) return { success: false, error: "Product not found" };

      const targetStock = isDelta ? Math.max(0, product.stock + newStockOrDelta) : Math.max(0, newStockOrDelta);

      // Distribute to first variant or update all
      if (product.variants.length > 0) {
        await tx.productVariant.update({
          where: { id: product.variants[0].id },
          data: { stock: targetStock },
        });
      }

      await tx.product.update({
        where: { id: productId },
        data: {
          stock: targetStock,
          status: targetStock === 0 ? "OUT_OF_STOCK" : "ACTIVE",
        },
      });
    }

    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/products");
    revalidatePath("/");
    return { success: true };
  });
}

export async function deleteProductAction(productId: string): Promise<{ success: boolean; archived?: boolean; message?: string; error?: string }> {
  await requireAdmin();

  return await prisma.$transaction(async (tx) => {
    // Check if this product has any historical order items
    const orderItemCount = await tx.orderItem.count({
      where: {
        productVariant: {
          productId,
        },
      },
    });

    if (orderItemCount > 0) {
      // Product has been ordered before: SOFT DELETE / ARCHIVE to preserve orders and customer invoices
      await tx.product.update({
        where: { id: productId },
        data: {
          status: "HIDDEN",
          stock: 0,
        },
      });

      await tx.productVariant.updateMany({
        where: { productId },
        data: { stock: 0 },
      });

      revalidatePath("/admin/products");
      revalidatePath("/products");
      revalidatePath("/");

      return {
        success: true,
        archived: true,
        message: "Product has past orders. It was safely hidden and removed from the storefront while keeping customer invoices intact.",
      };
    }

    // No orders exist: SAFE HARD DELETE
    // 1. Delete cart items
    await tx.cartItem.deleteMany({
      where: {
        productVariant: {
          productId,
        },
      },
    });

    // 2. Delete reservations
    await tx.reservation.deleteMany({
      where: {
        variant: {
          productId,
        },
      },
    });

    // 3. Delete variants
    await tx.productVariant.deleteMany({
      where: { productId },
    });

    // 4. Delete colors, sizes, images
    await tx.productColor.deleteMany({ where: { productId } });
    await tx.productSize.deleteMany({ where: { productId } });
    await tx.productImage.deleteMany({ where: { productId } });

    // 5. Delete product
    await tx.product.delete({
      where: { id: productId },
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");

    return { success: true, archived: false, message: "Product permanently removed from store." };
  });
}

// Delivery Zone Actions
export async function saveDeliveryZoneAction(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id") as string;
  const zoneName = formData.get("zoneName") as string;
  const deliveryFee = parseFloat(formData.get("deliveryFee") as string) || 0;
  const active = formData.get("active") === "true";

  if (id) {
    await prisma.deliveryZone.update({
      where: { id },
      data: { zoneName, deliveryFee, active },
    });
  } else {
    await prisma.deliveryZone.create({
      data: { zoneName, deliveryFee, active },
    });
  }

  revalidatePath("/admin/zones");
  revalidatePath("/checkout");
  return { success: true };
}
