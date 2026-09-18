import React from "react";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import ContactButtons from "@/components/ContactButtons";
import { ArrowRight, Sparkles, Truck, ShieldCheck, RefreshCw, MapPin, Users, Heart } from "lucide-react";

export const revalidate = 0; // Dynamic data

export default async function HomePage() {
  // Query categories
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  // Query Featured Sarees
  const featuredSarees = await prisma.product.findMany({
    where: {
      status: { not: "HIDDEN" },
      category: { slug: "sarees" },
    },
    include: {
      images: true,
      category: true,
      variants: true,
    },
    orderBy: [
      { homepagePriority: "desc" },
      { createdAt: "desc" },
    ],
    take: 4,
  });

  // Query Featured Kurtas
  const featuredKurtas = await prisma.product.findMany({
    where: {
      status: { not: "HIDDEN" },
      category: { slug: "kurtas" },
    },
    include: {
      images: true,
      category: true,
      variants: true,
    },
    orderBy: [
      { homepagePriority: "desc" },
      { createdAt: "desc" },
    ],
    take: 4,
  });

  // Query Featured Men's Wear
  const featuredMens = await prisma.product.findMany({
    where: {
      status: { not: "HIDDEN" },
      OR: [
        { category: { slug: "mens-wear" } },
        { featuredCategory: "MENS" },
      ],
    },
    include: {
      images: true,
      category: true,
      variants: true,
    },
    orderBy: [
      { homepagePriority: "desc" },
      { createdAt: "desc" },
    ],
    take: 4,
  });

  // Query Featured Kids' Wear
  const featuredKids = await prisma.product.findMany({
    where: {
      status: { not: "HIDDEN" },
      category: { slug: "kids-wear" },
    },
    include: {
      images: true,
      category: true,
      variants: true,
    },
    orderBy: [
      { homepagePriority: "desc" },
      { createdAt: "desc" },
    ],
    take: 4,
  });

  return (
    <div className="space-y-10 sm:space-y-16 pb-16 w-full max-w-full overflow-x-hidden">
      {/* Hero Banner Section */}
      <section className="relative bg-gradient-to-br from-rose-900 via-rose-950 to-stone-900 text-white overflow-hidden py-10 sm:py-20 px-3 sm:px-6 lg:px-8 w-full">
        {/* Subtle background glow */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-semibold">
                <MapPin className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                <span className="truncate">Thana Road, Lekhnath Chowk, Damak</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Complete Family Fashion:{" "}
                <span className="text-amber-300">Women</span>,{" "}
                <span className="text-sky-300">Men</span> &{" "}
                <span className="text-rose-400">Kids</span>
              </h1>

              <p className="text-xs sm:text-base text-rose-100 max-w-xl leading-relaxed">
                Welcome to Shree Traders Damak. From bridal Banarasi sarees and designer kurtas to men's cotton shirts, kurta pyjamas, and vibrant kids' festive wear — discover quality clothing for the whole family!
              </p>

              {/* Quick Category Action Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Link
                  href="/products?category=sarees"
                  className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm transition shadow shadow-rose-600/30 flex items-center gap-1.5"
                >
                  <span>👗 Sarees (साडी)</span>
                </Link>
                <Link
                  href="/products?category=kurtas"
                  className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold text-xs sm:text-sm transition shadow flex items-center gap-1.5"
                >
                  <span>👘 Kurtas (कुर्ता)</span>
                </Link>
                <Link
                  href="/products?category=mens-wear"
                  className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition shadow flex items-center gap-1.5"
                >
                  <span>👔 Men's (पुरुष)</span>
                </Link>
                <Link
                  href="/products?category=kids-wear"
                  className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition shadow flex items-center gap-1.5"
                >
                  <span>🧒 Kids' (बालक/बालिका)</span>
                </Link>
              </div>

              {/* Direct Store Contact hint */}
              <div className="pt-2 flex items-center gap-3 text-xs text-rose-200">
                <span className="text-rose-300">Fast Order Assistance:</span>
                <a
                  href="https://wa.me/9779800000000"
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-300 hover:underline font-bold"
                >
                  WhatsApp: 9800000000
                </a>
              </div>
            </div>

            {/* Right Hero Image Collage */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm rounded-3xl overflow-hidden shadow-2xl border-4 border-rose-500/20 aspect-[3/4] w-full">
                <Image
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=900"
                  alt="Shree Traders Damak Family Fashion"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="bg-rose-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                    Festive Family Special
                  </span>
                  <h4 className="text-base sm:text-lg font-bold mt-1">
                    Sarees, Kurtas, Men's & Kids' Wear
                  </h4>
                  <p className="text-[11px] text-gray-200">Thana Road, Lekhnath Chowk, Damak</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="p-2 sm:p-2.5 bg-rose-50 text-rose-600 rounded-xl flex-shrink-0">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900">Local Delivery</h4>
              <p className="text-[10px] sm:text-xs text-gray-500">Damak & Jhapa area</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 sm:p-2.5 bg-blue-50 text-blue-600 rounded-xl flex-shrink-0">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900">Whole Family</h4>
              <p className="text-[10px] sm:text-xs text-gray-500">Women, Men & Kids</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 sm:p-2.5 bg-amber-50 text-amber-600 rounded-xl flex-shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900">Digital Payments</h4>
              <p className="text-[10px] sm:text-xs text-gray-500">eSewa & Fonepay QR</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 sm:p-2.5 bg-emerald-50 text-emerald-600 rounded-xl flex-shrink-0">
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900">Store Pickup</h4>
              <p className="text-[10px] sm:text-xs text-gray-500">Lekhnath Chowk</p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Showcase */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">Shop by Category</h2>
            <p className="text-xs text-gray-500 mt-0.5">Explore our complete family fashion selection</p>
          </div>
          <Link href="/products" className="text-xs sm:text-sm font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-gray-100 border border-gray-100 shadow-sm hover:shadow-md transition"
            >
              {cat.image ? (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                <h3 className="font-bold text-xs sm:text-sm leading-tight group-hover:text-amber-300 transition">
                  {cat.name}
                </h3>
                {cat.nameNe && (
                  <p className="text-[10px] text-gray-300 font-medium">{cat.nameNe}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 1. Featured Sarees Section */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 bg-rose-100 text-rose-700 rounded-md">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-gray-900">
                Featured Sarees (साडी कलेक्सन)
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Bridal Banarasi silks, party wear chiffons & handloom cottons
            </p>
          </div>
          <Link
            href="/products?category=sarees"
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
          >
            <span>All Sarees</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {featuredSarees.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 2. Featured Kurtas Section */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 bg-amber-100 text-amber-800 rounded-md">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-gray-900">
                Trending Kurtas & Sets (कुर्ताहरू)
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Anarkalis, embroidered festive suits & everyday comfortable kurtis
            </p>
          </div>
          <Link
            href="/products?category=kurtas"
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
          >
            <span>All Kurtas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {featuredKurtas.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 3. Featured Men's Wear Section */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 bg-blue-100 text-blue-800 rounded-md">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-gray-900">
                Men's Fashion & Shirts (पुरुष फेसन)
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Pure cotton casual shirts, traditional kurta pyjamas, leather belts & caps
            </p>
          </div>
          <Link
            href="/products?category=mens-wear"
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
          >
            <span>All Men's</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {featuredMens.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Featured Kids' Wear Section */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 bg-emerald-100 text-emerald-800 rounded-md">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-gray-900">
                Kids' Festive & Casual Wear (बालबालिकाका कपडा)
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Boys kurta sets and girls embroidered party frocks & lehengas
            </p>
          </div>
          <Link
            href="/products?category=kids-wear"
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
          >
            <span>All Kids'</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {featuredKids.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Contact Banner */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
        <ContactButtons variant="banner" />
      </div>
    </div>
  );
}
