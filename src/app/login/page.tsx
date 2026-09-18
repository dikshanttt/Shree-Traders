"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { loginAction } from "@/actions/authActions";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await loginAction(formData);

    if (res.success && res.user) {
      setUser(res.user);
      if (res.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/orders");
      }
    } else {
      setError(res.error || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-orange-50/30">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-orange-100 shadow-xl">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 text-white font-black text-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-200">
            ST
          </div>
          <h2 className="text-2xl font-black text-gray-900">Sign In</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Find Your <span className="text-orange-600 font-bold italic">perfect</span> fit. — Shop with Dipa
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Access your order history and manage your purchases
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white font-bold text-sm shadow-lg hover:shadow-orange-200 transition flex items-center justify-center gap-2"
          >
            {loading ? "Signing in..." : "Sign In"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-gray-500">
          {`Don't have an account?`}{" "}
          <Link href="/register" className="font-bold text-orange-600 hover:underline">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
}
