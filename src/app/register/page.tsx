"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, Lock, Mail, User, ArrowRight, AlertCircle, Sparkles, ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors">
      {/* Top Floating Back Button */}
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
          Create Free Organization Profile
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Save your shop logo, address, and signature for instant 1-click memo printing.
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
                Your Name / Business Name / শপের নাম
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Tanvir Fashion or Ideal School"
                  className="w-full text-xs pl-10 pr-3.5 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-2xs"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address / ইমেইল ঠিকানা
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full text-xs pl-10 pr-3.5 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-2xs"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Password / পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)
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
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{loading ? "Creating Profile..." : "Create Free Account / অ্যাকাউন্ট তৈরি করুন"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
              Sign In here / সাইন ইন করুন
            </Link>
          </div>
        </div>

        {/* Value Proposition Pills */}
        <div className="mt-5 space-y-1.5 text-center text-[11px] text-slate-400 dark:text-slate-500 font-medium">
          <div className="flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Never rewrite your phone number, logo, and terms manually</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            <span>100% Free Forever • No Credit Card Required</span>
          </div>
        </div>
      </div>
    </div>
  );
}
