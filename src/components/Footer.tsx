"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Phone, Clock, ShieldCheck, Heart, Award, Handshake } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

// TikTok icon (not in lucide-react, using SVG)
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.79 1.54V6.78a4.86 4.86 0 0 1-1.02-.09z"/>
    </svg>
  );
}

// Facebook icon SVG
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

// Instagram icon SVG
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

export default function Footer() {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-gray-950 text-gray-300 pt-14 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Values row — matches business card */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-10 pb-8 border-b border-gray-800">
          {[
            { icon: "🪡", label: "Quality" },
            { icon: "🤝", label: "Trust" },
            { icon: "✨", label: "Style" },
            { icon: "😊", label: "Satisfaction" },
          ].map((v) => (
            <div key={v.label} className="flex flex-col items-center gap-1.5 text-center">
              <span className="text-2xl sm:text-3xl">{v.icon}</span>
              <span className="text-xs sm:text-sm font-semibold text-gray-300 tracking-wide">{v.label}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-gray-800">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white font-bold text-lg shadow">
                ST
              </div>
              <div>
                <span className="text-xl font-black text-white block">{t.storeName}</span>
                <span className="text-xs text-orange-400 italic">Shop with Dipa</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Find Your <span className="text-orange-400 italic font-semibold">perfect</span> fit. Specializing in authentic bridal Banarasi sarees, designer kurtas, men&apos;s fashion and kids&apos; wear in Damak, Jhapa.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://facebook.com/Shreetraders025"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white flex items-center justify-center transition"
                title="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/shreetraders025"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-pink-600/20 text-pink-400 hover:bg-pink-600 hover:text-white flex items-center justify-center transition"
                title="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://tiktok.com/@shreetraders_025"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-gray-700/50 text-gray-300 hover:bg-gray-100 hover:text-gray-900 flex items-center justify-center transition"
                title="TikTok"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/9779842428714"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition"
                title="WhatsApp"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              {t.browseCategories}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/products?category=sarees" className="hover:text-orange-400 transition">
                  Sarees — Banarasi, Chiffon, Cotton
                </Link>
              </li>
              <li>
                <Link href="/products?category=kurtas" className="hover:text-orange-400 transition">
                  Kurtas — Anarkali, Sets, Daily Wear
                </Link>
              </li>
              <li>
                <Link href="/products?category=mens-wear" className="hover:text-orange-400 transition">
                  {t.mensWear} — Shirts, Kurta Pyjama
                </Link>
              </li>
              <li>
                <Link href="/products?category=kids-wear" className="hover:text-orange-400 transition">
                  {t.kidsWear} — Boys & Girls
                </Link>
              </li>
              <li>
                <Link href="/products?category=purses" className="hover:text-orange-400 transition">
                  {t.purses}
                </Link>
              </li>
              <li>
                <Link href="/products?category=accessories" className="hover:text-orange-400 transition">
                  {t.accessories}
                </Link>
              </li>
              <li>
                <Link href="/products?category=cosmetics" className="hover:text-orange-400 transition">
                  {t.cosmetics}
                </Link>
              </li>
            </ul>
          </div>

          {/* Store Info */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              {language === "ne" ? "स्टोरको ठेगाना तथा समय" : "Store Info"}
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0 mt-1" />
                <span>
                  <strong className="text-gray-300">Thana Road, Lekhnath Chowk</strong>
                  <br />
                  Damak, Jhapa, Koshi Province, Nepal
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Open: 10:00 AM – 8:00 PM (Daily)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a href="tel:+9779842428714" className="hover:text-white transition font-semibold">
                  +977-9842428714
                </a>
              </li>
            </ul>
          </div>

          {/* Delivery & Payments */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              {language === "ne" ? "डेलिभरी तथा भुक्तानी" : "Delivery & Payments"}
            </h4>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              {t.deliveryInfo}
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>eSewa · Fonepay · Bank Transfer</span>
              </div>
              <div className="flex items-center gap-2 text-orange-400 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>Cash on Delivery (Damak only)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} Shree Traders, Damak. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
            <span>for Damak, Jhapa & Eastern Nepal</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
