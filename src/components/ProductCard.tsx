"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { AlertCircle, ShoppingBag, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";

export interface ProductCardData {
  id: string;
  name: string;
  nameNe?: string | null;
  slug: string;
  price: number;
  discountPrice?: number | null;
  stock: number;
  lowStockLimit: number;
  status: string;
  images: { imageUrl: string }[];
  category?: { name: string; nameNe?: string | null };
  variants?: { id: string; stock: number }[];
}

export default function ProductCard({ product }: { product: ProductCardData }) {
  const { language, formatPrice, t } = useLanguage();
  const { addItem } = useCart();

  const isOutOfStock = product.status === "OUT_OF_STOCK" || product.stock <= 0;
  const isLowStock = !isOutOfStock && product.stock <= product.lowStockLimit;
  const imageUrl = product.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800";

  const discountPercent =
    product.discountPrice && product.discountPrice < product.price
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : null;

  const displayName = language === "ne" && product.nameNe ? product.nameNe : product.name;
  const categoryName = language === "ne" && product.category?.nameNe ? product.category.nameNe : product.category?.name;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;
    const defaultVariant = product.variants?.[0];
    addItem({
      productVariantId: defaultVariant?.id || product.id,
      productId: product.id,
      name: product.name,
      nameNe: product.nameNe,
      slug: product.slug,
      price: product.price,
      discountPrice: product.discountPrice,
      image: imageUrl,
      quantity: 1,
      maxStock: defaultVariant?.stock || product.stock,
    });
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Product Image Container */}
      <Link href={`/product/${product.slug}`} className="relative block aspect-[3/4] overflow-hidden bg-gray-100">
        <Image
          src={imageUrl}
          alt={displayName}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discountPercent && (
            <span className="bg-orange-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow">
              {discountPercent}% OFF
            </span>
          )}
          {isLowStock && (
            <span className="bg-amber-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow flex items-center gap-1 animate-pulse">
              <AlertCircle className="w-3 h-3" />
              {language === "ne" ? `स्टक कम: ${product.stock} मात्र` : `Low Stock: Only ${product.stock}`}
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-gray-800/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow">
              {t.outOfStock}
            </span>
          )}
        </div>
      </Link>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {categoryName && (
            <span className="text-[11px] uppercase tracking-wider text-orange-600 font-semibold mb-1 block">
              {categoryName}
            </span>
          )}
          <Link href={`/product/${product.slug}`}>
            <h3 className="text-sm sm:text-base font-bold text-gray-900 line-clamp-2 hover:text-orange-600 transition mb-2">
              {displayName}
            </h3>
          </Link>
        </div>

        <div>
          {/* Pricing */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base sm:text-lg font-extrabold text-gray-900">
              {formatPrice(product.discountPrice || product.price)}
            </span>
            {product.discountPrice && product.discountPrice < product.price && (
              <span className="text-xs sm:text-sm text-gray-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-2">
            <Link
              href={`/product/${product.slug}`}
              className="flex-1 py-2 px-3 rounded-xl bg-orange-50 hover:bg-orange-600 text-orange-700 hover:text-white text-xs sm:text-sm font-semibold transition text-center flex items-center justify-center gap-1 group/btn"
            >
              <span>{isOutOfStock ? t.viewAll : t.buyNow}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition" />
            </Link>
            {!isOutOfStock && (
              <button
                onClick={handleQuickAdd}
                className="p-2 rounded-xl bg-gray-100 hover:bg-orange-100 text-gray-700 hover:text-orange-600 transition"
                title={t.addToCart}
              >
                <ShoppingBag className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
