import React from "react";
import { prisma } from "@/lib/prisma";
import CheckoutClient from "@/components/CheckoutClient";

export const revalidate = 0;

export default async function CheckoutPage() {
  const deliveryZones = await prisma.deliveryZone.findMany({
    where: { active: true },
    orderBy: { deliveryFee: "asc" },
  });

  return <CheckoutClient deliveryZones={deliveryZones} />;
}
