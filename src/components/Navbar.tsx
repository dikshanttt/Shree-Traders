"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Globe,
  User,
  ShieldCheck,
  Phone,
  Sparkles,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ne" : "en");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-sm w-full max-w-full">
      {/* Top Announcement Bar - Mobile-optimized, single non-wrapping line */}
      <div className="bg-rose-700 text-white py-1 px-3 text-[11px] font-medium w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-hidden whitespace-nowrap">
          <div className="flex items-center gap-1.5 truncate">
            <Sparkles className="w-3 h-3 text-amber-200 flex-shrink-0" />
            <span className="font-semibold text-amber-200">Shree Traders</span>
            <span className="text-rose-200 hidden xs:inline">•</span>
            <span className="truncate text-rose-100">Thana Road, Lekhnath Chowk, Damak</span>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 text-rose-100">
            <a
              href="tel:+9779800000000"
              className="hover:text-white flex items-center gap-1 transition"
            >
              <Phone className="w-3 h-3" />
              <span>9800000000</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Logo & Brand Name */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0 group">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center text-white font-black text-base sm:text-xl shadow group-hover:scale-105 transition flex-shrink-0">
              ST
            </div>
            <div className="min-w-0">
              <span className="text-base sm:text-2xl font-black tracking-tight text-gray-900 block group-hover:text-rose-600 transition leading-tight truncate">
                {t.storeName}
              </span>
              <span className="text-[9px] sm:text-xs text-rose-700 font-semibold tracking-wide block uppercase truncate">
                {language === "ne" ? "महिला • पुरुष • बालबालिका फेसन" : "Women • Men • Kids Fashion"}
              </span>
            </div>
          </Link>

          {/* Desktop Search */}
          <form
            onSubmit={handleSearch}
            className="hidden lg:flex flex-1 max-w-sm xl:max-w-md relative items-center"
          >
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 hover:bg-gray-100 focus:bg-white text-xs rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3" />
          </form>

          {/* Actions: Language, Cart, User (desktop), Menu Toggle (mobile) */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-gray-200 hover:border-rose-300 hover:bg-rose-50 text-[11px] sm:text-xs font-semibold text-gray-700 transition"
              title="Toggle English / नेपाली"
            >
              <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-600" />
              <span>{language === "en" ? "नेपाली" : "English"}</span>
            </button>

            {/* Shopping Cart Icon */}
            <Link
              href="/cart"
              className="relative p-2 rounded-full text-gray-700 hover:text-rose-600 hover:bg-rose-50 transition"
              title={t.cart}
            >
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-600 text-white text-[10px] sm:text-[11px] font-black rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center shadow">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Desktop-only User Auth */}
            <div className="relative hidden md:block">
              {user ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 p-1.5 rounded-full hover:bg-gray-100 transition text-xs font-semibold text-gray-700"
                  >
                    <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="max-w-[80px] truncate">{user.name}</span>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        <p className="text-[10px] font-black text-rose-600 uppercase mt-0.5">
                          {user.role}
                        </p>
                      </div>
                      {user.role === "ADMIN" && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-rose-50 hover:text-rose-600"
                        >
                          <ShieldCheck className="w-4 h-4 text-rose-600" />
                          {t.adminDashboard}
                        </Link>
                      )}
                      <Link
                        href="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-rose-50 hover:text-rose-600"
                      >
                        <ShoppingBag className="w-4 h-4 text-gray-500" />
                        {t.orders}
                      </Link>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        {t.logout}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-gray-700 hover:text-rose-600 hover:bg-rose-50 transition border border-gray-200"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{t.login}</span>
                </Link>
              )}
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center justify-center space-x-6 lg:space-x-8 py-2 border-t border-gray-100 text-xs font-semibold text-gray-700">
          <Link href="/" className="hover:text-rose-600 transition">
            {t.home}
          </Link>
          <Link
            href="/products?category=sarees"
            className="text-rose-700 font-bold hover:text-rose-900 transition flex items-center gap-1"
          >
            <span>{t.sarees}</span>
            <span className="bg-rose-100 text-rose-800 text-[9px] px-1.5 py-0.5 rounded-full uppercase">
              Popular
            </span>
          </Link>
          <Link
            href="/products?category=kurtas"
            className="text-rose-700 font-bold hover:text-rose-900 transition flex items-center gap-1"
          >
            <span>{t.kurtas}</span>
            <span className="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.5 rounded-full uppercase">
              Trending
            </span>
          </Link>
          <Link
            href="/products?category=mens-wear"
            className="hover:text-rose-600 transition text-gray-800 font-bold"
          >
            {t.mensWear}
          </Link>
          <Link
            href="/products?category=kids-wear"
            className="hover:text-rose-600 transition text-gray-800 font-bold"
          >
            {t.kidsWear}
          </Link>
          <Link href="/products?category=accessories" className="hover:text-rose-600 transition">
            {t.accessories}
          </Link>
          <Link href="/products?category=purses" className="hover:text-rose-600 transition">
            {t.purses}
          </Link>
          <Link href="/products?category=cosmetics" className="hover:text-rose-600 transition">
            {t.cosmetics}
          </Link>
          <Link href="/products" className="hover:text-rose-600 transition text-gray-500">
            {t.catalog}
          </Link>
        </nav>
      </div>

      {/* Mobile Slide-Down Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-2">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          </form>

          {/* User Profile / Auth block in mobile drawer */}
          <div className="p-3 bg-rose-50/60 rounded-2xl border border-rose-100 flex items-center justify-between">
            {user ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 leading-tight">{user.name}</p>
                    <p className="text-[10px] text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-2.5 py-1 bg-white text-rose-700 rounded-lg text-[11px] font-bold border border-rose-200"
                  >
                    {t.orders}
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="text-[11px] font-bold text-red-600 px-2 py-1"
                  >
                    {t.logout}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 font-bold flex items-center justify-center text-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-gray-700 font-medium">Customer Account</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-bold shadow-sm"
                  >
                    {t.login}
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-1.5 bg-white text-gray-700 border border-gray-200 rounded-xl text-xs font-bold"
                  >
                    {t.register}
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* All Categories Grid */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-1">
              Shop Collections
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <Link
                href="/products?category=sarees"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-rose-50 text-rose-900 flex items-center justify-between border border-rose-100"
              >
                <span>👗 {t.sarees}</span>
                <ChevronRight className="w-3.5 h-3.5 text-rose-400" />
              </Link>
              <Link
                href="/products?category=kurtas"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-between border border-amber-100"
              >
                <span>👘 {t.kurtas}</span>
                <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
              </Link>
              <Link
                href="/products?category=mens-wear"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-between border border-blue-100"
              >
                <span>👔 {t.mensWear}</span>
                <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
              </Link>
              <Link
                href="/products?category=kids-wear"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-emerald-50 text-emerald-900 flex items-center justify-between border border-emerald-100"
              >
                <span>🧒 {t.kidsWear}</span>
                <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
              </Link>
              <Link
                href="/products?category=accessories"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-gray-50 text-gray-800 flex items-center justify-between border border-gray-100"
              >
                <span>💍 {t.accessories}</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </Link>
              <Link
                href="/products?category=purses"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-gray-50 text-gray-800 flex items-center justify-between border border-gray-100"
              >
                <span>👜 {t.purses}</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </Link>
              <Link
                href="/products?category=cosmetics"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-gray-50 text-gray-800 flex items-center justify-between border border-gray-100"
              >
                <span>💄 {t.cosmetics}</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </Link>
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-rose-600 text-white flex items-center justify-between"
              >
                <span>✨ {t.catalog}</span>
                <ChevronRight className="w-3.5 h-3.5 text-rose-200" />
              </Link>
            </div>
          </div>

          {/* Admin link if logged in as admin */}
          {user?.role === "ADMIN" && (
            <div className="pt-2 border-t border-gray-100">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-gray-900 text-white text-xs font-bold flex items-center justify-center gap-2 shadow"
              >
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                <span>{t.adminDashboard}</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
