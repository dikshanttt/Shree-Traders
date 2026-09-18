import React from "react";
import { prisma } from "@/lib/prisma";
import AdminZonesClient from "@/components/AdminZonesClient";

export const revalidate = 0;

export default async function AdminZonesPage() {
  const zones = await prisma.deliveryZone.findMany({
    orderBy: { deliveryFee: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
          Delivery Zones & Rates
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Manage local Damak and Jhapa regional delivery charges applied dynamically during customer checkout.
        </p>
      </div>

      <AdminZonesClient initialZones={zones} />
    </div>
  );
}
