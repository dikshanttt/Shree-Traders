"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import ContactButtons from "@/components/ContactButtons";

interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    nameNe?: string | null;
    slug: string;
    description: string;
    descriptionNe?: string | null;
    brand?: string | null;
    price: number;
    discountPrice?: number | null;
    stock: number;
    lowStockLimit: number;
    status: string;
    images: { id: string; imageUrl: string; isPrimary: boolean }[];
    colors: { id: string; colorName: string; colorHex?: string | null }[];
    sizes: { id: string; sizeName: string }[];
    variants: {
      id: string;
      colorId?: string | null;
      sizeId?: string | null;
      stock: number;
      reservations?: { quantity: number; status: string; expiresAt: Date | string }[];
    }[];
    category: { name: string; nameNe?: string | null; slug: string };
  };
}

export default function ProductDetailClient({ product }: ProductDetailProps) {
  const { language, formatPrice, t } = useLanguage();
  const { addItem } = useCart();

  const [selectedImage, setSelectedImage] = useState(
    product.images[0]?.imageUrl ||
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800"
  );
  const [selectedColorId, setSelectedColorId] = useState(product.colors[0]?.id || "");
  const [selectedSizeId, setSelectedSizeId] = useState(product.sizes[0]?.id || "");
  const [quantity, setQuantity] = useState(1);
  const [addedAlert, setAddedAlert] = useState(false);

  // Find matching variant
  const currentVariant = product.variants.find((v) => {
    const matchColor = !product.colors.length || v.colorId === selectedColorId;
    const matchSize = !product.sizes.length || v.sizeId === selectedSizeId;
    return matchColor && matchSize;
  });

  // Calculate active reservations for this variant
  const activeReservedCount =
    currentVariant?.reservations
      ?.filter((r) => r.status === "ACTIVE" && new Date(r.expiresAt) > new Date())
      ?.reduce((sum, r) => sum + r.quantity, 0) || 0;

  const rawStock = currentVariant ? currentVariant.stock : product.stock;
  const effectiveAvailableStock = Math.max(0, rawStock - activeReservedCount);

  // Stock status
  const isOutOfStock =
    product.status === "OUT_OF_STOCK" || effectiveAvailableStock <= 0;
  const isReserved = activeReservedCount > 0 && effectiveAvailableStock === 0;
  const isLowStock =
    !isOutOfStock && effectiveAvailableStock <= product.lowStockLimit;

  const displayName =
    language === "ne" && product.nameNe ? product.nameNe : product.name;
  const displayDesc =
    language === "ne" && product.descriptionNe
      ? product.descriptionNe
      : product.description;
  const displayCategory =
    language === "ne" && product.category.nameNe
      ? product.category.nameNe
      : product.category.name;

  const selectedColorObj = product.colors.find((c) => c.id === selectedColorId);
  const selectedSizeObj = product.sizes.find((s) => s.id === selectedSizeId);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem({
      productVariantId: currentVariant?.id || product.id,
      productId: product.id,
      name: product.name,
      nameNe: product.nameNe,
      slug: product.slug,
      price: product.price,
      discountPrice: product.discountPrice,
      image: selectedImage,
      colorName: selectedColorObj?.colorName,
      sizeName: selectedSizeObj?.sizeName,
      quantity,
      maxStock: effectiveAvailableStock,
    });
    setAddedAlert(true);
    setTimeout(() => setAddedAlert(false), 3500);
  };

  const discountPercent =
    product.discountPrice && product.discountPrice < product.price
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-gray-100 border border-gray-200 shadow-md">
            <Image
              src={selectedImage}
              alt={displayName}
              fill
              priority
              className="object-cover object-center"
            />
            {discountPercent && (
              <span className="absolute top-4 left-4 bg-orange-600 text-white font-black text-xs px-3 py-1.5 rounded-full shadow">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.imageUrl)}
                  className={`relative w-20 h-24 rounded-xl overflow-hidden border-2 transition ${
                    selectedImage === img.imageUrl
                      ? "border-orange-600 shadow-md scale-105"
                      : "border-gray-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img.imageUrl}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md">
                {displayCategory}
              </span>
              {product.brand && (
                <span className="text-xs text-gray-400 font-medium">
                  {product.brand}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 leading-snug">
              {displayName}
            </h1>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-black text-gray-900">
                {formatPrice(product.discountPrice || product.price)}
              </span>
              {product.discountPrice && product.discountPrice < product.price && (
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
              {discountPercent && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Save {formatPrice(product.price - product.discountPrice!)}
                </span>
              )}
            </div>
          </div>

          {/* Inventory Reservation Status Banner */}
          <div className="p-4 rounded-2xl border bg-gray-50/70 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Availability & Stock Status:
              </span>
              {isReserved ? (
                <span className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                  <Clock className="w-3.5 h-3.5" />
                  Temporarily RESERVED ({activeReservedCount} pending payment)
                </span>
              ) : isOutOfStock ? (
                <span className="text-xs font-bold text-red-600 bg-red-100 px-2.5 py-1 rounded-full">
                  SOLD OUT / UNAVAILABLE
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  AVAILABLE ({effectiveAvailableStock} in stock)
                </span>
              )}
            </div>

            {isLowStock && (
              <p className="text-xs text-amber-600 font-medium flex items-center gap-1.5 pt-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>
                  {language === "ne"
                    ? `न्यून स्टक अलर्ट: केवल ${effectiveAvailableStock} थान बाँकी! छिटो रिजर्भ गर्नुहोस्।`
                    : `Low Stock Alert: Only ${effectiveAvailableStock} left! Reserve before it sells out.`}
                </span>
              </p>
            )}
            <p className="text-[11px] text-gray-500">
              {t.itemReservedNote}
            </p>
          </div>

          {/* Color Selector */}
          {product.colors.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Select Color:{" "}
                <span className="text-orange-600">
                  {selectedColorObj?.colorName}
                </span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedColorId(c.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition ${
                      selectedColorId === c.id
                        ? "border-orange-600 bg-orange-50 text-orange-700 ring-2 ring-orange-500/20"
                        : "border-gray-200 text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {c.colorHex && (
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-gray-300"
                        style={{ backgroundColor: c.colorHex }}
                      />
                    )}
                    <span>{c.colorName}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {product.sizes.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Select Size:{" "}
                <span className="text-orange-600">
                  {selectedSizeObj?.sizeName}
                </span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSizeId(s.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${
                      selectedSizeId === s.id
                        ? "border-orange-600 bg-orange-600 text-white shadow-sm"
                        : "border-gray-200 text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {s.sizeName}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Controls & Action Buttons */}
          <div className="space-y-3 pt-2">
            {!isOutOfStock && (
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Quantity:
                </span>
                <div className="flex items-center border border-gray-200 rounded-xl bg-white overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-sm font-bold text-gray-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(
                        Math.min(effectiveAvailableStock, quantity + 1)
                      )
                    }
                    disabled={quantity >= effectiveAvailableStock}
                    className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-orange-600/30 transition flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>{isOutOfStock ? t.sold : t.addToCart}</span>
              </button>
            </div>

            {addedAlert && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  {displayName} added to your cart! You can view it in the cart to complete reservation.
                </span>
              </div>
            )}
          </div>

          {/* Quick Direct Inquiries on Damak Store */}
          <div className="border-t border-gray-200 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Direct Assistance / Store Inquiry:
            </h4>
            <ContactButtons variant="compact" productName={displayName} />
          </div>

          {/* Description & Store Policy */}
          <div className="border-t border-gray-200 pt-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">
                Description & Fabric Details
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {displayDesc}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-gray-600">
              <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl">
                <Truck className="w-4 h-4 text-orange-600" />
                <span>Delivery in Damak within 24-48 hours</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Genuine Handpicked Fabric</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
