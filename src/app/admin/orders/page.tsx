import React from "react";
import { prisma } from "@/lib/prisma";
import AdminOrdersClient from "@/components/AdminOrdersClient";
import { cleanExpiredReservations } from "@/actions/orderActions";

export const revalidate = 0;

export default async function AdminOrdersPage() {
  await cleanExpiredReservations();

  const orders = await prisma.order.findMany({
    include: {
      deliveryZone: true,
      payment: true,
      reservations: true,
      orderItems: {
        include: {
          productVariant: {
            include: {
              color: true,
              size: true,
              product: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
          Order Fulfillment & Proof Verification
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Inspect customer payment screenshots, confirm reservations, and coordinate Damak delivery dispatch.
        </p>
      </div>

      <AdminOrdersClient initialOrders={orders} />
    </div>
  );
}
