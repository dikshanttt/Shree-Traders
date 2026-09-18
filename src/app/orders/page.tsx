import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/actions/authActions";
import { cleanExpiredReservations } from "@/actions/orderActions";
import { Package, ArrowRight, Search, Clock } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export const revalidate = 0;

interface OrdersPageProps {
  searchParams: Promise<{ phone?: string }>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const { phone } = await searchParams;
  const user = await getCurrentUser();

  await cleanExpiredReservations();

  let orders: any[] = [];

  if (user?.id) {
    orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        orderItems: {
          include: {
            productVariant: {
              include: { product: true },
            },
          },
        },
        deliveryZone: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } else if (phone) {
    orders = await prisma.order.findMany({
      where: { customerPhone: phone.trim() },
      include: {
        orderItems: {
          include: {
            productVariant: {
              include: { product: true },
            },
          },
        },
        deliveryZone: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
          My Orders & Reservations
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Track delivery progression and payment verification for your Damak store purchases.
        </p>
      </div>

      {/* Guest Phone Lookup Bar */}
      {!user && (
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm mb-8">
          <form method="GET" className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="tel"
                name="phone"
                defaultValue={phone || ""}
                placeholder="Enter your phone number (e.g. 98XXXXXXXX)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-orange-500"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow transition"
            >
              Find Orders
            </button>
          </form>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-800">No orders found</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            {user
              ? "You haven't placed any orders yet."
              : phone
              ? "No orders found matching this phone number."
              : "Enter your phone number above or log in to view your orders."}
          </p>
          <div className="mt-6">
            <Link
              href="/products"
              className="px-5 py-2.5 rounded-full bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition shadow"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm hover:border-orange-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-orange-600">
                    #{order.id.slice(-8).toUpperCase()}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                    {order.orderStatus}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-gray-900">
                  {order.customerName} ({order.customerPhone})
                </h4>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                  {order.orderItems
                    .map((oi: any) => `${oi.quantity}x ${oi.productVariant?.product?.name}`)
                    .join(", ")}
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                <div className="text-right">
                  <span className="text-xs text-gray-400 block">Total:</span>
                  <span className="text-sm font-black text-gray-900">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
                <Link
                  href={`/orders/${order.id}`}
                  className="px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-600 text-orange-700 hover:text-white text-xs font-bold transition flex items-center gap-1"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
