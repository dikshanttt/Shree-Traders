import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/authActions";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  MapPin,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Admin Top Header */}
      <div className="bg-gray-900 text-white border-b border-gray-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center font-black text-sm">
              ST
            </div>
            <div>
              <span className="font-bold text-sm tracking-wide">
                Shree Traders Admin
              </span>
              <span className="text-[10px] text-orange-400 block -mt-1 font-mono">
                Damak, Jhapa
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400 hidden sm:inline">
              Logged in as <strong className="text-white">{user.name}</strong>
            </span>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Subnav links */}
        <div className="bg-gray-950 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-6 overflow-x-auto text-xs font-semibold py-2">
            <Link
              href="/admin"
              className="text-gray-300 hover:text-white py-1 flex items-center gap-1.5 whitespace-nowrap"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-orange-400" />
              <span>Sales Overview</span>
            </Link>
            <Link
              href="/admin/orders"
              className="text-gray-300 hover:text-white py-1 flex items-center gap-1.5 whitespace-nowrap"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              <span>Orders & Proof Verification</span>
            </Link>
            <Link
              href="/admin/products"
              className="text-gray-300 hover:text-white py-1 flex items-center gap-1.5 whitespace-nowrap"
            >
              <Package className="w-3.5 h-3.5 text-emerald-400" />
              <span>Products & Low Stock</span>
            </Link>
            <Link
              href="/admin/zones"
              className="text-gray-300 hover:text-white py-1 flex items-center gap-1.5 whitespace-nowrap"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>Delivery Zones</span>
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
