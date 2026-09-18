import React from "react";
import { prisma } from "@/lib/prisma";
import AdminProductsClient from "@/components/AdminProductsClient";

export const revalidate = 0;

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: {
        category: true,
        images: true,
        colors: true,
        sizes: true,
        variants: {
          include: {
            color: true,
            size: true,
          },
        },
      },
      orderBy: [
        { homepagePriority: "desc" },
        { createdAt: "desc" },
      ],
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            Catalog & Inventory Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Add new items, adjust stock, restock variants, and manage your Damak store catalog.
          </p>
        </div>
      </div>

      <AdminProductsClient products={products} categories={categories} />
    </div>
  );
}
