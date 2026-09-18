import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import OrderDetailClient from "@/components/OrderDetailClient";
import { cleanExpiredReservations } from "@/actions/orderActions";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ justPlaced?: string }>;
}

export default async function OrderDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { justPlaced } = await searchParams;

  // Clean any expired reservations first
  await cleanExpiredReservations();

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      deliveryZone: true,
      payment: true,
      orderItems: {
        include: {
          productVariant: {
            include: {
              color: true,
              size: true,
              product: {
                include: {
                  images: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return <OrderDetailClient order={order} justPlaced={justPlaced === "true"} />;
}
