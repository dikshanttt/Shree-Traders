"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Package,
  Truck,
  UploadCloud,
  Phone,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { uploadPaymentProofAction } from "@/actions/orderActions";

interface OrderDetailProps {
  order: {
    id: string;
    customerName: string;
    customerPhone: string;
    deliveryFee: number;
    subtotal: number;
    totalAmount: number;
    paymentMethod: string;
    paymentStatus: string;
    orderStatus: string;
    reservationExpiresAt: Date | string | null;
    shippingAddress: string | null;
    notes: string | null;
    createdAt: Date | string;
    orderItems: {
      id: string;
      quantity: number;
      price: number;
      productVariant: {
        id: string;
        color?: { colorName: string } | null;
        size?: { sizeName: string } | null;
        product: {
          name: string;
          nameNe?: string | null;
          slug: string;
          images: { imageUrl: string }[];
        };
      };
    }[];
    payment?: {
      id: string;
      paymentMethod: string;
      screenshotUrl?: string | null;
      verificationStatus: string;
      referenceCode?: string | null;
    } | null;
    deliveryZone?: {
      zoneName: string;
    } | null;
  };
  justPlaced?: boolean;
}

export default function OrderDetailClient({ order, justPlaced = false }: OrderDetailProps) {
  const { language, formatPrice, t } = useLanguage();

  // Expiry countdown timer state
  const [timeLeft, setTimeLeft] = useState<{ minutes: number; seconds: number; isExpired: boolean }>({
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  const [screenshotBase64, setScreenshotBase64] = useState("");
  const [referenceCode, setReferenceCode] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    if (!order.reservationExpiresAt) return;

    const expiryTime = new Date(order.reservationExpiresAt).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = expiryTime - now;

      if (distance <= 0) {
        setTimeLeft({ minutes: 0, seconds: 0, isExpired: true });
      } else {
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft({ minutes, seconds, isExpired: false });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [order.reservationExpiresAt]);

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!screenshotBase64) return;
    setIsUploading(true);
    try {
      const res = await uploadPaymentProofAction(order.id, screenshotBase64, referenceCode);
      if (res.success) {
        setUploadSuccess(true);
        window.location.reload();
      } else {
        alert(res.error || "Failed to upload proof");
      }
    } catch (err: any) {
      alert(err.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  // Status mapping
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">{t.orderStatusPending}</span>;
      case "PAYMENT_SUBMITTED":
        return <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">{t.orderStatusPaymentSubmitted}</span>;
      case "CONFIRMED":
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">{t.orderStatusConfirmed}</span>;
      case "PACKED":
        return <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full">{t.orderStatusPacked}</span>;
      case "SHIPPED":
        return <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full">{t.orderStatusShipped}</span>;
      case "DELIVERED":
        return <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">{t.orderStatusDelivered}</span>;
      case "CANCELLED":
        return <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full">{t.orderStatusCancelled}</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs font-bold px-3 py-1 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {justPlaced && (
        <div className="mb-8 p-6 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-col sm:flex-row items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-emerald-900">{t.orderSuccessTitle}</h2>
            <p className="text-xs sm:text-sm text-emerald-800">{t.orderSuccessDesc}</p>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider text-gray-400 font-bold">
              {t.orderId}:
            </span>
            <span className="font-mono text-sm font-black text-rose-600">
              #{order.id.slice(-8).toUpperCase()}
            </span>
          </div>
          <h1 className="text-2xl font-black text-gray-900">
            Order & Reservation Details
          </h1>
          <p className="text-xs text-gray-500">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {getStatusBadge(order.orderStatus)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Reservation Timer, Order Items, Customer Info */}
        <div className="lg:col-span-7 space-y-6">
          {/* Reservation Countdown Alert Box */}
          {order.orderStatus !== "CONFIRMED" && order.orderStatus !== "DELIVERED" && (
            <div className={`p-5 rounded-2xl border ${timeLeft.isExpired || order.orderStatus === "CANCELLED" ? "bg-red-50 border-red-200 text-red-900" : "bg-rose-50 border-rose-200 text-rose-950"}`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-rose-600" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {t.reservationTimer}:
                  </span>
                </div>
                {timeLeft.isExpired || order.orderStatus === "CANCELLED" ? (
                  <span className="text-sm font-black text-red-600 uppercase">Expired / Cancelled</span>
                ) : (
                  <div className="flex items-center gap-1 font-mono font-black text-base sm:text-lg text-rose-600 bg-white px-3 py-1 rounded-xl shadow-sm border border-rose-200">
                    <span>{String(timeLeft.minutes).padStart(2, "0")}</span>
                    <span>:</span>
                    <span>{String(timeLeft.seconds).padStart(2, "0")}</span>
                  </div>
                )}
              </div>
              <p className="text-xs mt-2 text-gray-600">
                {timeLeft.isExpired
                  ? "This reservation has expired and the stock has been returned to the store inventory."
                  : "Single-piece Sarees and Kurtas are locked under reservation. Once our team verifies your payment screenshot, your order moves to Confirmed."}
              </p>
            </div>
          )}

          {/* Purchased Items */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 pb-2 border-b border-gray-100">
              Reserved Items
            </h3>
            <div className="space-y-3">
              {order.orderItems.map((item) => {
                const prod = item.productVariant?.product;
                const img = prod?.images[0]?.imageUrl || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800";
                return (
                  <div key={item.id} className="flex items-center justify-between text-sm py-2">
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image src={img} alt="" fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 line-clamp-1">{prod?.name}</p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity}{" "}
                          {item.productVariant?.color && `• ${item.productVariant.color.colorName}`}
                          {item.productVariant?.size && `• ${item.productVariant.size.sizeName}`}
                        </p>
                      </div>
                    </div>
                    <span className="font-extrabold text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Customer & Delivery Information */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-3 text-xs text-gray-700">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 pb-2 border-b border-gray-100">
              Delivery Information
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-gray-400 block">{t.customerName}:</span>
                <strong className="text-gray-900 text-sm">{order.customerName}</strong>
              </div>
              <div>
                <span className="text-gray-400 block">{t.customerPhone}:</span>
                <strong className="text-gray-900 text-sm">{order.customerPhone}</strong>
              </div>
            </div>
            <div>
              <span className="text-gray-400 block">{t.deliveryZone}:</span>
              <strong>{order.deliveryZone?.zoneName || "Damak Area"}</strong>
            </div>
            <div>
              <span className="text-gray-400 block">{t.deliveryAddress}:</span>
              <p className="text-gray-800 font-medium">{order.shippingAddress}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Payment Status & Screenshot Verification */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 pb-2 border-b border-gray-100">
              Payment & Verification
            </h3>

            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Payment Method:</span>
              <span className="font-bold text-gray-900">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Subtotal:</span>
              <span className="font-semibold">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">{t.deliveryFee}:</span>
              <span className="font-semibold">{formatPrice(order.deliveryFee)}</span>
            </div>
            <div className="pt-2 border-t border-gray-100 flex justify-between text-sm font-black text-gray-900">
              <span>{t.totalAmount}:</span>
              <span className="text-rose-600">{formatPrice(order.totalAmount)}</span>
            </div>

            {/* Uploaded Screenshot Preview */}
            {order.payment?.screenshotUrl ? (
              <div className="pt-4 border-t border-gray-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-700">Uploaded Payment Proof:</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    {order.payment.verificationStatus}
                  </span>
                </div>
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-gray-200">
                  <Image
                    src={order.payment.screenshotUrl}
                    alt="Payment Proof"
                    fill
                    className="object-contain bg-gray-900"
                  />
                </div>
                {order.payment.referenceCode && (
                  <p className="text-[11px] text-gray-500 font-mono">
                    Ref: {order.payment.referenceCode}
                  </p>
                )}
              </div>
            ) : (
              !timeLeft.isExpired && order.orderStatus !== "CANCELLED" && (
                <form onSubmit={handleUploadProof} className="pt-4 border-t border-gray-100 space-y-3">
                  <span className="text-xs font-bold text-rose-700 block">
                    Upload Payment Screenshot Now:
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={handleScreenshotChange}
                    className="block w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
                  />
                  <input
                    type="text"
                    value={referenceCode}
                    onChange={(e) => setReferenceCode(e.target.value)}
                    placeholder="Reference Code (Optional)"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300"
                  />
                  <button
                    type="submit"
                    disabled={isUploading || !screenshotBase64}
                    className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:bg-gray-300 text-white font-bold text-xs shadow transition"
                  >
                    {isUploading ? "Uploading..." : "Submit Proof & Confirm Reservation"}
                  </button>
                </form>
              )
            )}
          </div>

          {/* Quick Direct Inquiries */}
          <div className="bg-gradient-to-r from-rose-50 to-amber-50 rounded-3xl p-5 border border-rose-200 text-center space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Need Help With This Order?
            </h4>
            <p className="text-xs text-gray-600">
              Speak directly with our Damak store manager to expedite delivery or ask sizing questions.
            </p>
            <div className="flex justify-center gap-2 pt-1">
              <a
                href={`https://wa.me/9779800000000?text=${encodeURIComponent(`Hello Shree Traders Damak! I am inquiring about Order #${order.id.slice(-8).toUpperCase()}`)}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
              <a
                href="tel:+9779800000000"
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Store</span>
              </a>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-rose-600"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
