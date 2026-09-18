"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  QrCode,
  UploadCloud,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  User,
  AlertCircle,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { createOrderAction } from "@/actions/orderActions";

interface DeliveryZoneItem {
  id: string;
  zoneName: string;
  deliveryFee: number;
}

export default function CheckoutClient({
  deliveryZones,
}: {
  deliveryZones: DeliveryZoneItem[];
}) {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { language, formatPrice, t } = useLanguage();

  // Form State
  const [customerName, setCustomerName] = useState(user?.name || "");
  const [customerPhone, setCustomerPhone] = useState(user?.phone || "");
  const [province, setProvince] = useState("Koshi Province");
  const [district, setDistrict] = useState("Jhapa");
  const [city, setCity] = useState("Damak");
  const [ward, setWard] = useState("2");
  const [street, setStreet] = useState("Near Lekhnath Chowk, Thana Road");
  const [selectedZoneId, setSelectedZoneId] = useState(
    deliveryZones[0]?.id || ""
  );
  const [paymentMethod, setPaymentMethod] = useState("ESEWA"); // ESEWA, FONEPAY, BANK_TRANSFER, COD
  const [screenshotBase64, setScreenshotBase64] = useState<string>("");
  const [referenceCode, setReferenceCode] = useState("");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const selectedZone = deliveryZones.find((z) => z.id === selectedZoneId);
  const deliveryFee = selectedZone?.deliveryFee || 0;
  const totalAmount = subtotal + deliveryFee;

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert("File size should be under 8MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (items.length === 0) {
      setErrorMessage("Your cart is empty");
      return;
    }

    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMessage("Please provide customer name and phone number");
      return;
    }

    if (!selectedZoneId) {
      setErrorMessage("Please select your delivery zone");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerName,
        customerPhone,
        province,
        district,
        city,
        ward,
        street,
        deliveryZoneId: selectedZoneId,
        paymentMethod,
        screenshotBase64: screenshotBase64 || undefined,
        referenceCode: referenceCode || undefined,
        notes: notes || undefined,
        items: items.map((i) => ({
          productVariantId: i.productVariantId,
          quantity: i.quantity,
          price:
            i.discountPrice && i.discountPrice > 0 ? i.discountPrice : i.price,
        })),
      };

      const result = await createOrderAction(orderPayload);

      if (result.success && result.orderId) {
        clearCart();
        router.push(`/orders/${result.orderId}?justPlaced=true`);
      } else {
        setErrorMessage(result.error || "Failed to place order. Please try again.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center px-4">
        <h2 className="text-xl font-bold text-gray-800">Your cart is empty</h2>
        <p className="text-sm text-gray-500 mt-2">
          Please add items to your cart before proceeding to checkout.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
          {t.checkoutTitle}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {language === "ne"
            ? "दमक तथा सम्पूर्ण झापा जिल्लामा सिधै डेलिभरी। सामान अर्डर हुनासाथ ३० मिनेटको लागि रिजर्भ हुन्छ।"
            : "Complete your details for direct delivery across Damak and Jhapa. Products are locked under a 30-minute reservation."}
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Customer Info, Address, Delivery Zone, Payment Selection */}
          <div className="lg:col-span-8 space-y-8">
            {/* 1. Customer Contact */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-sm space-y-4">
              <h2 className="text-base font-black text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-100">
                <User className="w-5 h-5 text-rose-600" />
                <span>{t.customerInfo}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    {t.customerName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={t.customerNamePlaceholder}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    {t.customerPhone} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder={t.customerPhonePlaceholder}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm"
                  />
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    Our Damak delivery rider will call this number upon arrival.
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Nepali Address & Delivery Zone */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-sm space-y-4">
              <h2 className="text-base font-black text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-100">
                <MapPin className="w-5 h-5 text-rose-600" />
                <span>{t.deliveryAddress}</span>
              </h2>

              {/* Delivery Zone Dropdown */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  {t.deliveryZone} *
                </label>
                <select
                  value={selectedZoneId}
                  onChange={(e) => setSelectedZoneId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-rose-300 bg-rose-50/40 text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-rose-500"
                >
                  {deliveryZones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.zoneName} — {formatPrice(z.deliveryFee)} delivery fee
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    {t.province}
                  </label>
                  <input
                    type="text"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    {t.district}
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    {t.city}
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    {t.ward}
                  </label>
                  <input
                    type="text"
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  {t.street} *
                </label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder={t.streetPlaceholder}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
                />
              </div>
            </div>

            {/* 3. Payment Method & Screenshot Upload */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-sm space-y-6">
              <h2 className="text-base font-black text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-100">
                <QrCode className="w-5 h-5 text-rose-600" />
                <span>{t.paymentSelection}</span>
              </h2>

              {/* Payment Methods Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("ESEWA")}
                  className={`p-3.5 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                    paymentMethod === "ESEWA"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/30 font-bold"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
                    e
                  </div>
                  <span className="text-xs font-bold">{t.esewaPay}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("FONEPAY")}
                  className={`p-3.5 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                    paymentMethod === "FONEPAY"
                      ? "border-red-600 bg-red-50 text-red-900 ring-2 ring-red-500/30 font-bold"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-black text-xs">
                    F
                  </div>
                  <span className="text-xs font-bold">{t.fonepayPay}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("BANK_TRANSFER")}
                  className={`p-3.5 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                    paymentMethod === "BANK_TRANSFER"
                      ? "border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/30 font-bold"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs">
                    B
                  </div>
                  <span className="text-xs font-bold">{t.bankTransfer}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("COD")}
                  className={`p-3.5 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                    paymentMethod === "COD"
                      ? "border-amber-600 bg-amber-50 text-amber-900 ring-2 ring-amber-500/30 font-bold"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-black text-xs">
                    Rs
                  </div>
                  <span className="text-xs font-bold">{t.codPay}</span>
                </button>
              </div>

              {/* Payment Details Container */}
              {paymentMethod !== "COD" && (
                <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Simulated Scannable QR Code Box */}
                    <div className="w-36 h-36 bg-white p-2 rounded-xl border border-gray-300 shadow-sm flex flex-col items-center justify-center text-center flex-shrink-0">
                      <QrCode className="w-24 h-24 text-gray-800" />
                      <span className="text-[10px] font-black uppercase text-rose-600">
                        {paymentMethod === "ESEWA"
                          ? "Scan eSewa QR"
                          : paymentMethod === "FONEPAY"
                          ? "Scan Fonepay QR"
                          : "Bank Transfer"}
                      </span>
                    </div>

                    {/* Bank / eSewa details */}
                    <div className="text-xs text-gray-700 space-y-1.5 w-full">
                      <div className="font-bold text-sm text-gray-900 mb-1">
                        Shree Traders Store Account:
                      </div>
                      {paymentMethod === "ESEWA" && (
                        <>
                          <p>
                            <strong>eSewa ID:</strong>{" "}
                            <span className="text-emerald-700 font-mono font-bold text-sm">
                              9800000000
                            </span>
                          </p>
                          <p>
                            <strong>Name:</strong> SHREE TRADERS DAMAK
                          </p>
                          <p className="text-gray-500">
                            Please mention your name or phone number in remarks.
                          </p>
                        </>
                      )}
                      {paymentMethod === "FONEPAY" && (
                        <>
                          <p>
                            <strong>Fonepay Merchant:</strong>{" "}
                            <span className="text-red-700 font-mono font-bold text-sm">
                              SHREE TRADERS
                            </span>
                          </p>
                          <p>
                            <strong>Compatible Apps:</strong> Nabil Smart, NIC Asia MoBank, Global Smart, Prabhu, etc.
                          </p>
                        </>
                      )}
                      {paymentMethod === "BANK_TRANSFER" && (
                        <>
                          <p>
                            <strong>Bank Name:</strong> NIC Asia Bank Ltd.
                          </p>
                          <p>
                            <strong>Branch:</strong> Damak Branch, Jhapa
                          </p>
                          <p>
                            <strong>Account Name:</strong> SHREE TRADERS DAMAK
                          </p>
                          <p>
                            <strong>Account Number:</strong>{" "}
                            <span className="font-mono font-bold text-sm text-blue-700">
                              01234567890123
                            </span>
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Screenshot Upload Box */}
                  <div className="pt-3 border-t border-gray-200">
                    <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                      {t.paymentProofTitle}
                    </label>
                    <p className="text-xs text-gray-500 mb-3">
                      {t.paymentProofHelp}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <label className="flex-1 w-full border-2 border-dashed border-gray-300 hover:border-rose-500 rounded-2xl p-4 text-center cursor-pointer transition bg-white">
                        <UploadCloud className="w-8 h-8 text-rose-500 mx-auto mb-1" />
                        <span className="text-xs font-bold text-gray-700 block">
                          Upload Payment Screenshot
                        </span>
                        <span className="text-[10px] text-gray-400 block mt-0.5">
                          PNG, JPG, JPEG up to 8MB
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleScreenshotChange}
                          className="hidden"
                        />
                      </label>

                      {screenshotBase64 && (
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-emerald-500 flex-shrink-0 shadow">
                          <Image
                            src={screenshotBase64}
                            alt="Screenshot Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>

                    <div className="mt-3">
                      <input
                        type="text"
                        value={referenceCode}
                        onChange={(e) => setReferenceCode(e.target.value)}
                        placeholder="Transaction ID / Reference Code (Optional)"
                        className="w-full px-4 py-2 text-xs rounded-xl border border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Reservation Expiry Notice */}
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-900">
                <Clock className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold">
                    30-Minute Reservation Protection (३० मिनेट रिजर्भेसन नियम)
                  </p>
                  <p className="text-rose-800 leading-relaxed">
                    {t.reservationExpiryAlert} If proof is not provided within 30 minutes, the reserved item unlocks for other shoppers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Order Summary Sticky Card */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-md space-y-5 sticky top-28">
            <h3 className="text-lg font-black text-gray-900 pb-3 border-b border-gray-100">
              {t.orderSummary}
            </h3>

            {/* Itemized List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div
                  key={item.productVariantId}
                  className="flex items-center justify-between text-xs py-1"
                >
                  <div className="flex-1 pr-2">
                    <p className="font-bold text-gray-800 line-clamp-1">
                      {item.name}
                    </p>
                    <p className="text-gray-400">
                      Qty: {item.quantity}{" "}
                      {item.colorName ? `• ${item.colorName}` : ""}
                    </p>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(
                      (item.discountPrice && item.discountPrice > 0
                        ? item.discountPrice
                        : item.price) * item.quantity
                    )}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>{t.subtotal}</span>
                <span className="font-semibold text-gray-900">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{t.deliveryFee}</span>
                <span className="font-semibold text-gray-900">
                  {formatPrice(deliveryFee)}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-200 flex justify-between text-lg font-black text-gray-900">
                <span>{t.totalAmount}</span>
                <span className="text-rose-600">{formatPrice(totalAmount)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 disabled:bg-gray-300 text-white font-bold text-sm sm:text-base shadow-xl hover:shadow-rose-600/30 transition flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Processing Reservation...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{t.placeOrderBtn}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
