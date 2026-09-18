import React from "react";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import ContactButtons from "@/components/ContactButtons";
import { ArrowRight, Sparkles, Truck, ShieldCheck, Star, MapPin, Users, Package } from "lucide-react";

export const revalidate = 0;

export default async function HomePage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const featuredSarees = await prisma.product.findMany({
    where: { status: { not: "HIDDEN" }, category: { slug: "sarees" } },
    include: { images: true, category: true, variants: true },
    orderBy: [{ homepagePriority: "desc" }, { createdAt: "desc" }],
    take: 4,
  });

  const featuredKurtas = await prisma.product.findMany({
    where: { status: { not: "HIDDEN" }, category: { slug: "kurtas" } },
    include: { images: true, category: true, variants: true },
    orderBy: [{ homepagePriority: "desc" }, { createdAt: "desc" }],
    take: 4,
  });

  const featuredMens = await prisma.product.findMany({
    where: {
      status: { not: "HIDDEN" },
      OR: [{ category: { slug: "mens-wear" } }, { featuredCategory: "MENS" }],
    },
    include: { images: true, category: true, variants: true },
    orderBy: [{ homepagePriority: "desc" }, { createdAt: "desc" }],
    take: 4,
  });

  const featuredKids = await prisma.product.findMany({
    where: { status: { not: "HIDDEN" }, category: { slug: "kids-wear" } },
    include: { images: true, category: true, variants: true },
    orderBy: [{ homepagePriority: "desc" }, { createdAt: "desc" }],
    take: 4,
  });

  return (
    <div className="space-y-10 sm:space-y-16 pb-16 w-full max-w-full overflow-x-hidden">

      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden w-full">
        {/* Background gradient — warm saffron-orange matching business card */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900 via-orange-800 to-amber-900" />
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-300/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

            {/* Left: Copy */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-7 text-white">
              {/* Location badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-orange-100 text-xs font-semibold backdrop-blur-sm">
                <MapPin className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                <span>Thana Road, Lekhnath Chowk, Damak</span>
              </div>

              {/* Store name badge */}
              <div>
                <p className="text-amber-200 text-sm font-semibold tracking-widest uppercase mb-2">Shree Traders</p>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                  Find Your{" "}
                  <span className="text-amber-300 italic">perfect</span>{" "}
                  fit.
                </h1>
                <p className="text-orange-200 text-lg sm:text-2xl font-semibold mt-2 italic">
                  — Shop with Dipa
                </p>
              </div>

              <p className="text-sm sm:text-base text-orange-100 max-w-xl leading-relaxed">
                Your complete family fashion destination in Damak. Bridal Banarasi sarees, designer kurtas, men&apos;s fashion, and vibrant kids&apos; wear — curated with love.
              </p>

              {/* Category pills */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <Link
                  href="/products?category=sarees"
                  className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-white text-orange-800 hover:bg-orange-50 font-bold text-xs sm:text-sm transition shadow-lg flex items-center gap-1.5"
                >
                  👗 Sarees
                </Link>
                <Link
                  href="/products?category=kurtas"
                  className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold text-xs sm:text-sm transition shadow flex items-center gap-1.5"
                >
                  👘 Kurtas
                </Link>
                <Link
                  href="/products?category=mens-wear"
                  className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/30 font-bold text-xs sm:text-sm transition flex items-center gap-1.5"
                >
                  👔 Men&apos;s
                </Link>
                <Link
                  href="/products?category=kids-wear"
                  className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/30 font-bold text-xs sm:text-sm transition flex items-center gap-1.5"
                >
                  🧒 Kids&apos;
                </Link>
              </div>

              {/* CTA + WhatsApp */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="/products"
                  className="px-6 py-3 rounded-full bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm shadow-lg shadow-orange-900/40 flex items-center gap-2 transition"
                >
                  Shop Now <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="https://wa.me/9779842428714"
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg flex items-center gap-2 transition"
                >
                  WhatsApp Order
                </a>
              </div>
            </div>

            {/* Right: Hero image */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 aspect-[3/4] w-full">
                <Image
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=900"
                  alt="Shree Traders — Family Fashion, Damak"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-orange-950/90 via-orange-900/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="bg-orange-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider">
                    Festive Collection
                  </span>
                  <h4 className="text-base sm:text-lg font-bold mt-1.5">
                    Sarees · Kurtas · Men&apos;s · Kids&apos;
                  </h4>
                  <p className="text-[11px] text-orange-200 mt-0.5">Thana Road, Lekhnath Chowk, Damak</p>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -top-3 -right-3 bg-amber-400 text-gray-900 rounded-2xl px-3 py-2 text-center shadow-lg rotate-6">
                <p className="text-[10px] font-bold uppercase tracking-wide">Est. 2025</p>
                <p className="text-xs font-black">Damak&apos;s</p>
                <p className="text-[10px] font-bold">Fashion Store</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST / VALUES BADGES ── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-6 bg-white rounded-3xl border border-orange-100 shadow-sm">
          {[
            { icon: <Truck className="w-5 h-5" />, color: "text-orange-600 bg-orange-50", title: "Local Delivery", sub: "Damak & Jhapa area" },
            { icon: <Users className="w-5 h-5" />, color: "text-blue-600 bg-blue-50", title: "Whole Family", sub: "Women, Men & Kids" },
            { icon: <ShieldCheck className="w-5 h-5" />, color: "text-emerald-600 bg-emerald-50", title: "Digital Payments", sub: "eSewa & Fonepay QR" },
            { icon: <Star className="w-5 h-5" />, color: "text-amber-600 bg-amber-50", title: "Quality & Trust", sub: "Shop with Dipa" },
          ].map((b) => (
            <div key={b.title} className="flex items-center gap-2.5">
              <div className={`p-2 sm:p-2.5 rounded-xl flex-shrink-0 ${b.color}`}>
                {b.icon}
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-gray-900">{b.title}</h4>
                <p className="text-[10px] sm:text-xs text-gray-500">{b.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">Shop by Category</h2>
            <p className="text-xs text-gray-500 mt-0.5">Complete family fashion selection</p>
          </div>
          <Link href="/products" className="text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1">
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                <h3 className="font-bold text-xs sm:text-sm leading-tight group-hover:text-amber-300 transition">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED SAREES ── */}
      {featuredSarees.length > 0 && (
        <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 bg-orange-100 text-orange-700 rounded-md">
                  <Sparkles className="w-3.5 h-3.5" />
                </span>
                <h2 className="text-lg sm:text-2xl font-black text-gray-900">Featured Sarees</h2>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Bridal Banarasi silks, party wear chiffons & handloom cottons
              </p>
            </div>
            <Link href="/products?category=sarees" className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1">
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
      )}

      {/* ── FEATURED KURTAS ── */}
      {featuredKurtas.length > 0 && (
        <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 bg-amber-100 text-amber-800 rounded-md">
                  <Sparkles className="w-3.5 h-3.5" />
                </span>
                <h2 className="text-lg sm:text-2xl font-black text-gray-900">Trending Kurtas & Sets</h2>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Anarkalis, embroidered festive suits & everyday comfortable kurtis
              </p>
            </div>
            <Link href="/products?category=kurtas" className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1">
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
      )}

      {/* ── MEN'S FASHION ── */}
      {featuredMens.length > 0 && (
        <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 bg-blue-100 text-blue-800 rounded-md">
                  <Sparkles className="w-3.5 h-3.5" />
                </span>
                <h2 className="text-lg sm:text-2xl font-black text-gray-900">Men&apos;s Fashion</h2>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Cotton shirts, kurta pyjamas, leather belts & caps
              </p>
            </div>
            <Link href="/products?category=mens-wear" className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1">
              <span>All Men&apos;s</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {featuredMens.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ── KIDS' WEAR ── */}
      {featuredKids.length > 0 && (
        <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 bg-emerald-100 text-emerald-800 rounded-md">
                  <Sparkles className="w-3.5 h-3.5" />
                </span>
                <h2 className="text-lg sm:text-2xl font-black text-gray-900">Kids&apos; Wear</h2>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Boys kurta sets and girls embroidered frocks & lehengas
              </p>
            </div>
            <Link href="/products?category=kids-wear" className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1">
              <span>All Kids&apos;</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {featuredKids.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ── CONTACT BANNER ── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
        <ContactButtons variant="banner" />
      </div>
    </div>
  );
}
