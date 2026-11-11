"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, Lock, Mail, ArrowRight, AlertCircle, Sparkles, ArrowLeft, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to sign in");
      }

      router.push(data.redirect || "/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors">
      {/* Top Floating Home Button */}
      <div className="max-w-md mx-auto w-full px-4 mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home / হোমপেজে ফিরে যান</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        <Link href="/" className="inline-flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
            <FileText className="w-5 h-5" />
          </div>
          <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white">
            FreeDocForge<span className="text-blue-600 dark:text-blue-400">.com</span>
          </span>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Welcome Back / সাইন ইন করুন
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Access your saved presets, custom documents, and print history.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-8 shadow-xl rounded-3xl border border-slate-200 dark:border-slate-800 transition-colors">
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address / ইমেইল ঠিকানা
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="yourname@example.com"
                  className="w-full text-xs pl-10 pr-3.5 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-2xs"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Password / পাসওয়ার্ড
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full text-xs pl-10 pr-3.5 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-2xs"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl transition text-xs sm:text-sm shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? "Signing in..." : "Sign In to Dashboard / ড্যাশবোর্ডে প্রবেশ"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
            Don't have an account yet?{" "}
            <Link href="/register" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
              Create Free Account / ফ্রি অ্যাকাউন্ট খুলুন
            </Link>
          </div>
        </div>

        {/* Security Trust Note */}
        <div className="mt-4 text-center flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>100% Free Forever • Zero Watermark • Instant Auto-Fill</span>
        </div>
      </div>
    </div>
  );
}
