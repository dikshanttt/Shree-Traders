"use client";

import React, { useState } from "react";
import { Phone, MessageCircle, Send, X, Headset } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ContactProps {
  variant?: "floating" | "banner" | "compact";
  productName?: string;
}

export default function ContactButtons({ variant = "floating", productName }: ContactProps) {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  const phone = "+977-9842428714";
  const whatsappNum = "9779842428714";
  const messengerUrl = "https://m.me/Shreetraders025";

  const waMessage = productName
    ? encodeURIComponent(`Namaste Shree Traders! I am inquiring about "${productName}" at your Damak store.`)
    : encodeURIComponent("Namaste Shree Traders! I have an inquiry regarding your clothing collections at Damak store.");

  const waUrl = `https://wa.me/${whatsappNum}?text=${waMessage}`;

  if (variant === "compact") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition shadow-sm"
          title="WhatsApp Inquiry"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>WhatsApp</span>
        </a>
        <a
          href={messengerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition shadow-sm"
          title="Facebook Messenger"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Messenger</span>
        </a>
        <a
          href={`tel:${phone}`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold transition shadow-sm"
          title="Call Damak Store"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Call Now</span>
        </a>
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 border border-orange-200 rounded-3xl p-6 sm:p-8 text-center shadow-sm w-full max-w-full">
        <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-1">{t.contactTitle}</h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-6 max-w-xl mx-auto">
          {t.contactSubtitle} • Thana Road, Lekhnath Chowk, Damak
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow transition hover:scale-105"
          >
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{t.whatsappChat}</span>
          </a>
          <a
            href={messengerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow transition hover:scale-105"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{t.messengerChat}</span>
          </a>
          <a
            href={`tel:${phone}`}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow transition hover:scale-105"
          >
            <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{t.callStore}</span>
          </a>
        </div>
      </div>
    );
  }

  // Collapsible Floating Action Button
  return (
    <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-2.5">
      {isExpanded && (
        <div className="flex flex-col items-end gap-2 mb-1 animate-in slide-in-from-bottom-3 duration-200">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-full shadow-lg text-xs font-bold transition hover:scale-105"
          >
            <span>WhatsApp Chat</span>
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
          </a>

          <a
            href={messengerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-full shadow-lg text-xs font-bold transition hover:scale-105"
          >
            <span>Messenger</span>
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <Send className="w-4 h-4 text-white" />
            </div>
          </a>

          <a
            href={`tel:${phone}`}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-3.5 py-2 rounded-full shadow-lg text-xs font-bold transition hover:scale-105"
          >
            <span>Call: 9842428714</span>
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <Phone className="w-4 h-4 text-white" />
            </div>
          </a>
        </div>
      )}

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full shadow-xl hover:shadow-2xl transition duration-300 hover:scale-105 border-2 border-white focus:outline-none"
        aria-label="Contact Shree Traders Damak"
      >
        {isExpanded ? (
          <>
            <X className="w-5 h-5 text-white" />
            <span className="text-xs font-bold">Close</span>
          </>
        ) : (
          <>
            <div className="relative">
              <Headset className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-orange-600 animate-pulse" />
            </div>
            <span className="text-xs font-bold hidden sm:inline">Help & Order</span>
          </>
        )}
      </button>
    </div>
  );
}
