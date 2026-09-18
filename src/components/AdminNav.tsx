"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  MapPin,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { logoutAction } from "@/actions/authActions";
import { useAuth } from "@/context/AuthContext";

interface AdminNavProps {
  userName: string;
}

export default function AdminNav({ userName }: AdminNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { setUser } = useAuth();

  const handleLogout = async () => {
    await logoutAction();
    setUser(null);
    router.push("/login");
  };

  const navItems = [
    {
      href: "/admin",
      label: "Sales Overview",
      icon: LayoutDashboard,
      active: pathname === "/admin",
    },
    {
      href: "/admin/orders",
      label: "Orders & Verification",
      icon: ShoppingBag,
      active: pathname.startsWith("/admin/orders"),
    },
    {
      href: "/admin/products",
      label: "Products & Stock",
      icon: Package,
      active: pathname.startsWith("/admin/products"),
    },
    {
      href: "/admin/zones",
      label: "Delivery Zones",
      icon: MapPin,
      active: pathname.startsWith("/admin/zones"),
    },
  ];

  return (
    <header className="bg-gray-900 text-white border-b border-gray-800 sticky top-0 z-30 shadow-md">
      {/* Top Admin Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 to-orange-400 flex items-center justify-center font-black text-white text-sm shadow-md shadow-orange-950">
            ST
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                Shree Traders
              </span>
              <span className="px-2 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 text-[10px] font-bold uppercase tracking-wider">
                Admin Portal
              </span>
            </div>
            <span className="text-[11px] text-gray-400 block font-medium">
              Thana Road, Lekhnath Chowk, Damak
            </span>
          </div>
        </div>

        {/* User & Actions */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-300 hidden md:inline font-medium">
            Logged in as <strong className="text-white font-bold">{userName}</strong>
          </span>

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 text-xs text-gray-200 hover:text-white bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-xl border border-gray-700 transition"
          >
            <span>View Store</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-red-300 hover:text-white bg-red-950/40 hover:bg-red-900/60 border border-red-900/50 px-3 py-1.5 rounded-xl transition"
            title="Log Out of Admin"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <div className="bg-gray-950 border-t border-gray-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-1 text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold transition whitespace-nowrap ${
                  item.active
                    ? "bg-orange-600 text-white shadow-sm"
                    : "text-gray-400 hover:text-white hover:bg-gray-900"
                }`}
              >
                <Icon className={`w-4 h-4 ${item.active ? "text-white" : "text-gray-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
