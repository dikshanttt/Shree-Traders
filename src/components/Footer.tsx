"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Phone, MessageCircle, Send, Clock, ShieldCheck, Heart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-gray-950 text-gray-300 pt-14 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-gray-800">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center text-white font-bold text-lg">
                ST
              </div>
              <span className="text-xl font-black text-white">{t.storeName}</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t.storeTagline}. {language === "ne" ? "विवाह, व्रतबन्ध तथा चाडपर्वका लागि उच्चस्तरीय साडी तथा कुर्ताको भरपर्दो पसल।" : "Specializing in authentic bridal Banarasi sarees, designer party wear chiffons, and trending kurta sets in Damak."}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://wa.me/9779800000000"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition"
                title="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="https://m.me/shreetradersdamak"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white flex items-center justify-center transition"
                title="Messenger"
              >
                <Send className="w-5 h-5" />
              </a>
              <a
                href="tel:+9779800000000"
                className="w-9 h-9 rounded-full bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white flex items-center justify-center transition"
                title="Call"
              >
                <Phone className="w-5 h-5" />
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
                <Link href="/products?category=sarees" className="hover:text-rose-400 transition">
                  {t.sarees} (Banarasi, Chiffon, Cotton)
                </Link>
              </li>
              <li>
                <Link href="/products?category=kurtas" className="hover:text-rose-400 transition">
                  {t.kurtas} (Anarkali, Sets, Daily)
                </Link>
              </li>
              <li>
                <Link href="/products?category=purses" className="hover:text-rose-400 transition">
                  {t.purses}
                </Link>
              </li>
              <li>
                <Link href="/products?category=accessories" className="hover:text-rose-400 transition">
                  {t.accessories}
                </Link>
              </li>
              <li>
                <Link href="/products?category=cosmetics" className="hover:text-rose-400 transition">
                  {t.cosmetics}
                </Link>
              </li>
            </ul>
          </div>

          {/* Damak Location & Hours */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              {language === "ne" ? "स्टोरको ठेगाना तथा समय" : "Damak Store & Hours"}
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0 mt-1" />
                <span>
                  <strong>Thana Road, Lekhnath Chowk</strong>
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
                <span>+977-9800000000 / 023-XXXXXX</span>
              </li>
            </ul>
          </div>

          {/* Direct Services & Admin */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              {language === "ne" ? "सेवा तथा सहयोग" : "Delivery & Security"}
            </h4>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              {t.deliveryInfo}
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified eSewa, Fonepay & Bank Payments</span>
              </div>
              <div className="pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition bg-gray-900 px-3 py-1.5 rounded-md border border-gray-800"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                  <span>{t.adminDashboard}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} Shree Traders Damak. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for Damak, Jhapa & Eastern Nepal</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
