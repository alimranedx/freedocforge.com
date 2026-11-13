"use client";

import React, { useEffect } from "react";
import { CheckCircle2, X, Download, ArrowRight, Printer, Sparkles } from "lucide-react";
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
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer"
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
