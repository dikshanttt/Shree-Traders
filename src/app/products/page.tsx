import React from "react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { Filter, Search } from "lucide-react";

export const revalidate = 0;

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = await searchParams;
  const categorySlug = resolvedParams.category;
  const searchQuery = resolvedParams.search;
  const sort = resolvedParams.sort || "priority";

  // Build Prisma query filter
  const whereClause: any = {
    status: { not: "HIDDEN" },
  };

  if (categorySlug) {
    whereClause.category = { slug: categorySlug };
  }

  if (searchQuery) {
    whereClause.OR = [
      { name: { contains: searchQuery } },
      { nameNe: { contains: searchQuery } },
      { description: { contains: searchQuery } },
      { brand: { contains: searchQuery } },
    ];
  }

  let orderBy: any = [{ homepagePriority: "desc" }, { createdAt: "desc" }];
  if (sort === "price_asc") {
    orderBy = [{ price: "asc" }];
  } else if (sort === "price_desc") {
    orderBy = [{ price: "desc" }];
  } else if (sort === "newest") {
    orderBy = [{ createdAt: "desc" }];
  }

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: whereClause,
      include: {
        images: true,
        category: true,
        variants: true,
      },
      orderBy,
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  const activeCategory = categories.find((c) => c.slug === categorySlug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumbs & Title */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <Link href="/" className="hover:text-orange-600">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-orange-600">
            Catalog
          </Link>
          {activeCategory && (
            <>
              <span>/</span>
              <span className="text-gray-900 font-medium">{activeCategory.name}</span>
            </>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
          {activeCategory ? `${activeCategory.name} (${activeCategory.nameNe || ""})` : "All Collections"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Showing {products.length} {products.length === 1 ? "product" : "products"} available at Shree Traders Damak
        </p>
      </div>

      {/* Category Pills & Sorting Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 mb-8">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          <Link
            href="/products"
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              !categorySlug
                ? "bg-orange-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Items
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/products?category=${c.slug}${sort ? `&sort=${sort}` : ""}`}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                categorySlug === c.slug
                  ? "bg-orange-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {c.name} {c.nameNe ? `(${c.nameNe})` : ""}
            </Link>
          ))}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <span className="text-xs text-gray-500 font-medium">Sort by:</span>
          <div className="flex items-center gap-1 text-xs">
            <Link
              href={`/products?${categorySlug ? `category=${categorySlug}&` : ""}${searchQuery ? `search=${searchQuery}&` : ""}sort=priority`}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition ${
                sort === "priority" ? "bg-orange-100 text-orange-800" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Featured
            </Link>
            <Link
              href={`/products?${categorySlug ? `category=${categorySlug}&` : ""}${searchQuery ? `search=${searchQuery}&` : ""}sort=price_asc`}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition ${
                sort === "price_asc" ? "bg-orange-100 text-orange-800" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Price: Low
            </Link>
            <Link
              href={`/products?${categorySlug ? `category=${categorySlug}&` : ""}${searchQuery ? `search=${searchQuery}&` : ""}sort=price_desc`}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition ${
                sort === "price_desc" ? "bg-orange-100 text-orange-800" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Price: High
            </Link>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900">No products found</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
            We couldn't find any items matching your selected criteria. Try adjusting your filters or browse other categories.
          </p>
          <div className="mt-6">
            <Link
              href="/products"
              className="px-5 py-2.5 rounded-full bg-orange-600 text-white text-xs font-semibold hover:bg-orange-700 transition"
            >
              View All Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
