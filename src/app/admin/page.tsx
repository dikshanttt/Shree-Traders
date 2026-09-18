import React from "react";
import { prisma } from "@/lib/prisma";
import { cleanExpiredReservations } from "@/actions/orderActions";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  AlertTriangle,
  Calendar,
  Clock,
  ArrowRight,
  Package,
} from "lucide-react";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  await cleanExpiredReservations();

  const now = new Date();

  // 1. Daily Sales (last 24 hours)
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const dailyOrders = await prisma.order.findMany({
    where: {
      createdAt: { gte: oneDayAgo },
      orderStatus: { not: "CANCELLED" },
    },
  });
  const dailySalesTotal = dailyOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  // 2. Weekly Sales (last 7 days)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weeklyOrders = await prisma.order.findMany({
    where: {
      createdAt: { gte: sevenDaysAgo },
      orderStatus: { not: "CANCELLED" },
    },
  });
  const weeklySalesTotal = weeklyOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  // 3. Monthly Sales (last 30 days)
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const monthlyOrders = await prisma.order.findMany({
    where: {
      createdAt: { gte: thirtyDaysAgo },
      orderStatus: { not: "CANCELLED" },
    },
  });
  const monthlySalesTotal = monthlyOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  // 4. Pending Payment Verification Count
  const pendingVerificationCount = await prisma.order.count({
    where: { orderStatus: "PAYMENT_SUBMITTED" },
  });

  // 5. Low Stock Products (where stock <= lowStockLimit)
  const allProducts = await prisma.product.findMany({
    include: {
      category: true,
      variants: true,
    },
    orderBy: { stock: "asc" },
  });

  const lowStockProducts = allProducts.filter((p) => p.stock <= p.lowStockLimit);

  // 6. Top Selling Products
  const orderItems = await prisma.orderItem.findMany({
    where: {
      order: {
        orderStatus: { in: ["CONFIRMED", "PACKED", "SHIPPED", "DELIVERED"] },
      },
    },
    include: {
      productVariant: {
        include: {
          product: {
            include: { category: true },
          },
        },
      },
    },
  });

  // Aggregate by product
  const productSalesMap = new Map<
    string,
    { name: string; category: string; unitsSold: number; totalRevenue: number }
  >();

  for (const item of orderItems) {
    const prod = item.productVariant?.product;
    if (prod) {
      const existing = productSalesMap.get(prod.id) || {
        name: prod.name,
        category: prod.category?.name || "General",
        unitsSold: 0,
        totalRevenue: 0,
      };
      existing.unitsSold += item.quantity;
      existing.totalRevenue += item.price * item.quantity;
      productSalesMap.set(prod.id, existing);
    }
  }

  const topProducts = Array.from(productSalesMap.values())
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            Damak Store Sales Overview
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time daily, weekly, and monthly sales metrics for Shree Traders.
          </p>
        </div>

        {pendingVerificationCount > 0 && (
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md transition animate-pulse"
          >
            <Clock className="w-4 h-4" />
            <span>{pendingVerificationCount} Payments Pending Verification</span>
          </Link>
        )}
      </div>

      {/* Sales Summary Metrics Grid (Replacing charts) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Daily Sales */}
        <div className="p-6 bg-white rounded-3xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              Daily Sales
            </span>
            <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-gray-900">
              {formatPrice(dailySalesTotal)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {dailyOrders.length} {dailyOrders.length === 1 ? "order" : "orders"} placed in last 24 hours
            </p>
          </div>
        </div>

        {/* Weekly Sales */}
        <div className="p-6 bg-white rounded-3xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Weekly Sales
            </span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-gray-900">
              {formatPrice(weeklySalesTotal)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {weeklyOrders.length} orders in the last 7 days
            </p>
          </div>
        </div>

        {/* Monthly Sales */}
        <div className="p-6 bg-white rounded-3xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Monthly Sales
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-gray-900">
              {formatPrice(monthlySalesTotal)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {monthlyOrders.length} total orders this month
            </p>
          </div>
        </div>
      </div>

      {/* Two-Column Section: Top Products & Low Stock Warnings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Top Selling Products List */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="text-base font-black text-gray-900">
              Top Selling Products
            </h3>
            <span className="text-xs text-gray-400">By units sold</span>
          </div>

          {topProducts.length === 0 ? (
            <div className="py-10 text-center text-xs text-gray-500">
              No confirmed product sales yet. Confirmed orders will rank here automatically.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {topProducts.map((p, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-700 font-bold flex items-center justify-center text-[11px]">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-bold text-gray-900 line-clamp-1">{p.name}</p>
                      <p className="text-gray-400">{p.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-gray-900 block">
                      {p.unitsSold} units
                    </span>
                    <span className="text-gray-500">{formatPrice(p.totalRevenue)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Warning Table (Product.low_stock_limit) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2 text-orange-600">
              <AlertTriangle className="w-4 h-4" />
              <h3 className="text-base font-black text-gray-900">
                Low Stock Alerts
              </h3>
            </div>
            <Link
              href="/admin/products"
              className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
            >
              <span>Manage Stock</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="py-10 text-center text-xs text-gray-500">
              All products are adequately stocked above their configured low stock limit.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {lowStockProducts.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-gray-900 line-clamp-1">{p.name}</p>
                    <p className="text-gray-400">
                      Category: {p.category?.name} • Limit: {p.lowStockLimit}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        p.stock === 0
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {p.stock === 0 ? "Out of Stock" : `${p.stock} remaining`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
