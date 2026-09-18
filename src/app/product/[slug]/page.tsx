import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductDetailClient from "@/components/ProductDetailClient";
import type { Metadata } from "next";

export const revalidate = 0;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { images: true },
  });

  if (!product) {
    return {
      title: "Product Not Found | Shree Traders Damak",
    };
  }

  const primaryImage = product.images[0]?.imageUrl;

  return {
    title: `${product.name} | Shree Traders Damak`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} - Shree Traders Damak`,
      description: product.description.slice(0, 160),
      images: primaryImage ? [{ url: primaryImage }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: true,
      colors: true,
      sizes: true,
      variants: {
        include: {
          reservations: {
            where: {
              status: "ACTIVE",
            },
          },
        },
      },
    },
  });

  if (!product || product.status === "HIDDEN") {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
