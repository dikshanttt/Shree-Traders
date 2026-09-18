"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Eye,
  Truck,
  Package,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import { confirmOrderAction, updateOrderStatusAction, cancelOrderAction } from "@/actions/adminActions";

interface OrderItemData {
  id: string;
  customerName: string;
  customerPhone: string;
  deliveryFee: number;
  subtotal: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  reservationExpiresAt: string | Date | null;
  shippingAddress: string | null;
  notes: string | null;
  createdAt: string | Date;
  deliveryZone?: { zoneName: string } | null;
  payment?: {
    id: string;
    screenshotUrl?: string | null;
    verificationStatus: string;
    referenceCode?: string | null;
  } | null;
  orderItems: {
    id: string;
    quantity: number;
    price: number;
    productVariant: {
      id: string;
      color?: { colorName: string } | null;
      size?: { sizeName: string } | null;
      product: { name: string; slug: string };
    };
  }[];
  reservations: { id: string; status: string; expiresAt: string | Date }[];
}

export default function AdminOrdersClient({ initialOrders }: { initialOrders: OrderItemData[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [activeScreenshot, setActiveScreenshot] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === "ALL") return true;
    return o.orderStatus === filterStatus;
  });

  const handleConfirm = async (orderId: string) => {
    if (!confirm("Confirm this order? This will mark the reservation as CONFIRMED and deduct product stock.")) return;
    setActionLoading(orderId);
    try {
      const res = await confirmOrderAction(orderId);
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId ? { ...o, orderStatus: "CONFIRMED", paymentStatus: "VERIFIED" } : o
          )
        );
      } else {
        alert(res.error || "Failed to confirm order");
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setActionLoading(orderId);
    try {
      const res = await updateOrderStatusAction(orderId, newStatus);
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (orderId: string) => {
    if (!confirm("Cancel this order? This will release reserved stock back to the store immediately.")) return;
    setActionLoading(orderId);
    try {
      const res = await cancelOrderAction(orderId);
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, orderStatus: "CANCELLED" } : o))
        );
      }
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
          {[
            { label: "All Orders", val: "ALL" },
            { label: "Payment Submitted", val: "PAYMENT_SUBMITTED" },
            { label: "Pending Payment", val: "PENDING" },
            { label: "Confirmed", val: "CONFIRMED" },
            { label: "Packed", val: "PACKED" },
            { label: "Shipped", val: "SHIPPED" },
            { label: "Delivered", val: "DELIVERED" },
            { label: "Cancelled", val: "CANCELLED" },
          ].map((item) => (
            <button
              key={item.val}
              onClick={() => setFilterStatus(item.val)}
              className={`px-3 py-1.5 rounded-full transition whitespace-nowrap ${
                filterStatus === item.val
                  ? "bg-rose-600 text-white shadow-sm"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-gray-500 font-medium">
          Showing {filteredOrders.length} orders
        </span>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-gray-200 text-xs text-gray-500">
          No orders found matching status: <strong>{filterStatus}</strong>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isLoading = actionLoading === order.id;

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition space-y-4"
              >
                {/* Top Row: ID, Time, Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-rose-600">
                      #{order.id.slice(-8).toUpperCase()}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs text-gray-500">
                      {formatDate(order.createdAt)}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-800">
                      {order.paymentMethod}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-black uppercase px-3 py-1 rounded-full ${
                        order.orderStatus === "CONFIRMED"
                          ? "bg-emerald-100 text-emerald-800"
                          : order.orderStatus === "PAYMENT_SUBMITTED"
                          ? "bg-blue-100 text-blue-800 animate-pulse"
                          : order.orderStatus === "CANCELLED"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Middle Grid: Customer info, Items, Delivery info */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
                  {/* Customer details */}
                  <div className="md:col-span-4 space-y-1.5">
                    <span className="text-gray-400 uppercase font-bold tracking-wider text-[10px]">
                      Customer Information:
                    </span>
                    <p className="font-bold text-sm text-gray-900">{order.customerName}</p>
                    <a
                      href={`tel:${order.customerPhone}`}
                      className="inline-flex items-center gap-1.5 font-bold text-rose-600 hover:underline bg-rose-50 px-2.5 py-1 rounded-lg"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{order.customerPhone} (Call)</span>
                    </a>
                    <p className="text-gray-600 mt-2">
                      <strong>Delivery Zone:</strong> {order.deliveryZone?.zoneName || "Damak Area"}
                    </p>
                    <p className="text-gray-500 leading-relaxed">{order.shippingAddress}</p>
                  </div>

                  {/* Items */}
                  <div className="md:col-span-5 space-y-1.5 border-t md:border-t-0 md:border-l md:border-r border-gray-100 md:px-4 pt-3 md:pt-0">
                    <span className="text-gray-400 uppercase font-bold tracking-wider text-[10px]">
                      Items Ordered:
                    </span>
                    <div className="space-y-2">
                      {order.orderItems.map((oi) => (
                        <div key={oi.id} className="flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold text-gray-900">
                              {oi.quantity}x {oi.productVariant?.product?.name}
                            </span>
                            <span className="text-gray-400 block text-[11px]">
                              {oi.productVariant?.color && `Color: ${oi.productVariant.color.colorName}`}{" "}
                              {oi.productVariant?.size && `• Size: ${oi.productVariant.size.sizeName}`}
                            </span>
                          </div>
                          <span className="font-bold text-gray-800">
                            {formatPrice(oi.price * oi.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex justify-between font-black text-sm text-gray-900">
                      <span>Total (inc. Delivery):</span>
                      <span className="text-rose-600">{formatPrice(order.totalAmount)}</span>
                    </div>
                  </div>

                  {/* Payment Screenshot & Verification */}
                  <div className="md:col-span-3 space-y-2 border-t md:border-t-0 border-gray-100 pt-3 md:pt-0">
                    <span className="text-gray-400 uppercase font-bold tracking-wider text-[10px]">
                      Payment Screenshot Proof:
                    </span>

                    {order.payment?.screenshotUrl ? (
                      <div className="space-y-2">
                        <button
                          onClick={() => setActiveScreenshot(order.payment?.screenshotUrl || null)}
                          className="relative w-full aspect-video rounded-xl overflow-hidden border border-gray-200 block group"
                        >
                          <Image
                            src={order.payment.screenshotUrl}
                            alt="Proof"
                            fill
                            className="object-cover group-hover:scale-105 transition"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-bold gap-1 text-xs">
                            <Eye className="w-3.5 h-3.5" />
                            <span>Zoom Screenshot</span>
                          </div>
                        </button>
                        {order.payment.referenceCode && (
                          <p className="text-[11px] text-gray-500 font-mono">
                            Ref: {order.payment.referenceCode}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-gray-50 text-gray-400 text-center text-xs">
                        No screenshot uploaded
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Action Controls */}
                <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {order.orderStatus === "PAYMENT_SUBMITTED" || order.orderStatus === "PENDING" ? (
                      <button
                        onClick={() => handleConfirm(order.id)}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Verify & Confirm Order (Deduct Stock)</span>
                      </button>
                    ) : null}

                    {order.orderStatus !== "CANCELLED" && order.orderStatus !== "DELIVERED" && (
                      <button
                        onClick={() => handleCancel(order.id)}
                        disabled={isLoading}
                        className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs transition flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel (Release Reservation)</span>
                      </button>
                    )}
                  </div>

                  {/* Status Progression Dropdown */}
                  {order.orderStatus !== "CANCELLED" && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-medium">Update Status:</span>
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        disabled={isLoading}
                        className="px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-800 bg-white"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PAYMENT_SUBMITTED">PAYMENT_SUBMITTED</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PACKED">PACKED</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Screenshot Zoom Modal */}
      {activeScreenshot && (
        <div
          onClick={() => setActiveScreenshot(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-pointer animate-in fade-in"
        >
          <div className="relative max-w-2xl w-full max-h-[85vh] aspect-auto bg-black rounded-2xl overflow-hidden p-2">
            <img
              src={activeScreenshot}
              alt="Payment Screenshot Zoom"
              className="w-full h-auto max-h-[80vh] object-contain mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}
