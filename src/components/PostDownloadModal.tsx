"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, X, Download, ArrowRight, Printer, Sparkles, Store, History, UserPlus } from "lucide-react";
import AdSenseSlot from "@/components/AdSenseSlot";

interface PostDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle?: string;
  lang?: "en" | "bn";
  paperSize?: string;
}

export default function PostDownloadModal({
  isOpen,
  onClose,
  documentTitle,
  lang = "en",
  paperSize = "A4",
}: PostDownloadModalProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.authenticated) setIsLoggedIn(true);
      })
      .catch(() => {});
  }, [isOpen]);

  // ESC key to dismiss
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="download-success-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-fade-in print:hidden"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 text-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close confirmation dialog"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Success Icon & Heading */}
        <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 ring-8 ring-emerald-50 dark:ring-emerald-900/30">
          <CheckCircle2 className="w-7 h-7" />
        </div>

        <h3
          id="download-success-title"
          className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight"
        >
          {lang === "bn" ? "ডাউনলোড সফল হয়েছে!" : "Download Complete!"}
        </h3>

        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
          {lang === "bn"
            ? `${documentTitle ? `"${documentTitle}"` : "আপনার ডকুমেন্টটি"} হাই-রেজোলিউশন ভেক্টরে ডাউনলোড হয়েছে। আপনি চাইলে সরাসরি প্রিন্ট নিতে পারেন বা ফর্ম এডিট চালিয়ে যেতে পারেন।`
            : `${documentTitle ? `"${documentTitle}"` : "Your document"} has been generated in vector high-resolution. You can print directly or continue customizing.`}
        </p>

        {/* HIGH-CONVERTING MERCHANT SIGNUP / DASHBOARD CALLOUT */}
        <div className="my-5 p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/60 to-purple-50/50 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-purple-950/30 border border-blue-200/80 dark:border-blue-800/60 text-left flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              {isLoggedIn ? <History className="w-5 h-5" /> : <Store className="w-5 h-5" />}
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                {isLoggedIn
                  ? lang === "bn"
                    ? "ডকুমেন্টটি আপনার ড্যাশবোর্ডে সংরক্ষিত রয়েছে"
                    : "Document archived in your merchant dashboard"
                  : lang === "bn"
                  ? "ভবিষ্যতের চালানে লোগো ও ঠিকানা অটো-ফিল করতে চান?"
                  : "Save logo & details for 1-second auto-fill?"}
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">
                {isLoggedIn
                  ? lang === "bn"
                    ? "যেকোনো সময় হিস্ট্রি থেকে রি-প্রিন্ট বা এডিট করতে পারেন।"
                    : "Review, edit, or re-print your documents anytime from history."
                  : lang === "bn"
                  ? "একটি ফ্রি প্রিসেট সংরক্ষণ করুন, পরবর্তী প্রতিটি চালানে সময় বাঁচান।"
                  : "Save your brand preset once for automatic 1-second generation on future orders."}
              </p>
            </div>
          </div>
          <Link
            href={isLoggedIn ? "/dashboard/history" : "/register"}
            onClick={onClose}
            className="shrink-0 w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs group"
          >
            <span>
              {isLoggedIn
                ? lang === "bn"
                  ? "হিস্ট্রি দেখুন →"
                  : "View History →"
                : lang === "bn"
                ? "ফ্রি সাইন আপ →"
                : "Sign Up Free →"}
            </span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Policy-Safe AdSense Slot (Only rendered when approved/enabled) */}
        <div className="my-4">
          <AdSenseSlot
            slotId="post-download-confirmation-slot"
            format="rectangle"
            label="Advertisement"
            className="my-2"
          />
        </div>

        {/* Action Controls */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm transition cursor-pointer"
          >
            {lang === "bn" ? "এডিটর-এ ফিরে যান" : "Continue Editing"}
          </button>
        </div>

        {/* Trust Reminder */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>
            {lang === "bn"
              ? "১০০% ফ্রি ও নিরাপদ • কোনো ওয়াটারমার্ক নেই"
              : "100% Free & Secure • Zero Watermarks"}
          </span>
        </div>
      </div>
    </div>
  );
}
