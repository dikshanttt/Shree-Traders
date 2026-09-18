"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ArrowRight, ShoppingBag, ArrowLeft, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, subtotal, totalItems } = useCart();
  const { language, formatPrice, t } = useLanguage();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">
          {language === "ne" ? "तपाईंको झोला खाली छ" : "Your Shopping Cart is Empty"}
        </h2>
        <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
          {language === "ne"
            ? "हाम्रो विशेष बनारसी साडी, डिजाइनर सिफन र ट्रेन्डिङ कुर्ताहरू हेर्नुहोस् र झोलामा थप्नुहोस्।"
            : "Explore our handpicked Banarasi sarees, party chiffons, and trending kurta sets in Damak."}
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-rose-600 text-white text-sm font-bold shadow-lg hover:bg-rose-700 transition"
        >
          <span>{language === "ne" ? "कलेक्सन हेर्नुहोस्" : "Browse Collections"}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            {t.cart} ({totalItems} {totalItems === 1 ? "item" : "items"})
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {language === "ne"
              ? "चेकआउट गर्दा यी सामानहरू ३० मिनेटको लागि सुरक्षित (रिजर्भ) हुनेछन्।"
              : "Items will be temporarily reserved for 30 minutes once checkout is initiated."}
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-gray-400 hover:text-rose-600 font-medium transition"
        >
          {language === "ne" ? "झोला खाली गर्नुहोस्" : "Clear Cart"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Cart items list */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => {
            const itemPrice =
              item.discountPrice && item.discountPrice > 0 ? item.discountPrice : item.price;
            const displayName =
              language === "ne" && item.nameNe ? item.nameNe : item.name;

            return (
              <div
                key={item.productVariantId}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 bg-white rounded-2xl border border-gray-100 shadow-sm gap-4"
              >
                {/* Thumbnail & Info */}
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                    <Image
                      src={item.image}
                      alt={displayName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <Link
                      href={`/product/${item.slug}`}
                      className="font-bold text-gray-900 hover:text-rose-600 transition text-sm sm:text-base line-clamp-1"
                    >
                      {displayName}
                    </Link>
                    <div className="text-xs text-gray-500 mt-1 space-x-2">
                      {item.colorName && <span>Color: {item.colorName}</span>}
                      {item.colorName && item.sizeName && <span>•</span>}
                      {item.sizeName && <span>Size: {item.sizeName}</span>}
                    </div>
                    <div className="text-sm font-black text-gray-900 mt-2">
                      {formatPrice(itemPrice)}
                    </div>
                  </div>
                </div>

                {/* Controls & Total */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  {/* Quantity */}
                  <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.productVariantId, item.quantity - 1)}
                      className="px-2.5 py-1 text-gray-600 hover:bg-gray-200 text-xs font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-bold text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productVariantId, item.quantity + 1)}
                      disabled={item.quantity >= item.maxStock}
                      className="px-2.5 py-1 text-gray-600 hover:bg-gray-200 disabled:opacity-30 text-xs font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal for item */}
                  <span className="text-sm font-black text-gray-900 min-w-[80px] text-right">
                    {formatPrice(itemPrice * item.quantity)}
                  </span>

                  {/* Remove item */}
                  <button
                    onClick={() => removeItem(item.productVariantId)}
                    className="p-2 text-gray-400 hover:text-red-600 transition rounded-lg hover:bg-red-50"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-xs font-bold text-rose-600 hover:text-rose-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === "ne" ? "थप सामान हेर्नुहोस्" : "Continue Shopping"}</span>
            </Link>
          </div>
        </div>

        {/* Order Summary & Proceed Box */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-200 p-6 shadow-md space-y-5">
          <h3 className="text-lg font-black text-gray-900 pb-3 border-b border-gray-100">
            {t.orderSummary}
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>{t.subtotal}</span>
              <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Estimated Delivery Fee</span>
              <span className="text-xs text-rose-600 font-medium">Calculated at Checkout</span>
            </div>
            <div className="pt-3 border-t border-gray-100 flex justify-between text-base font-black text-gray-900">
              <span>Estimated Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-lg hover:shadow-rose-600/30 transition flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <span>
              {language === "ne"
                ? "चेकआउट गर्दा तपाईंले इसेवा, फोनपे क्यूआर वा बैंकबाट सिधै भुक्तानी गरी रसिद अपलोड गर्न सक्नुहुन्छ।"
                : "Secure digital checkout via eSewa, Fonepay QR, and direct bank deposit with instant screenshot verification."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
