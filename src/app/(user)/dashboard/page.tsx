"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Store,
  Printer,
  Sparkles,
  ArrowRight,
  Save,
  Check,
  GraduationCap,
  Stethoscope,
  ShoppingBag,
  FileText,
  Clock,
  Layers,
  Zap,
  Mic,
  Eye,
  PlusCircle,
  TrendingUp,
} from "lucide-react";
import { INITIAL_TEMPLATES, TemplateDefinition } from "@/lib/templates";
import { useUserDashboard } from "@/context/UserDashboardContext";

export default function UserDashboardOverviewPage() {
  const { lang, t } = useUserDashboard();

  const [activeCategoryTab, setActiveCategoryTab] = useState<"shop" | "school" | "medical">("shop");
  const [profile, setProfile] = useState({
    businessName: "Stylist Fashion BD",
    tagline: "Quality Products Delivered to Your Doorstep",
    phone: "+880 1712-345678",
    address: "House 14, Road 5, Dhanmondi, Dhaka",
    currency: "৳",
    logoUrl: null as string | null,
    signatureUrl: null as string | null,
    presetType: "shop" as "shop" | "school" | "medical",
  });

  // Load saved preset from localStorage or API
  useEffect(() => {
    const saved = localStorage.getItem("freedocforge_active_preset");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProfile((prev) => ({
          ...prev,
          ...parsed,
        }));
        if (parsed.presetType) setActiveCategoryTab(parsed.presetType);
      } catch (e) {
        console.error(e);
      }
    } else {
      // Check cloud API
      fetch("/api/user/profile")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.profile) {
            setProfile((prev) => ({
              ...prev,
              ...data.profile,
            }));
          }
        })
        .catch(() => {});
    }
  }, []);

  // Filter templates based on active tab
  const activeTemplates = INITIAL_TEMPLATES.filter((tmpl) => {
    if (activeCategoryTab === "shop") return tmpl.category === "Business" || tmpl.category === "Restaurant";
    if (activeCategoryTab === "school") return tmpl.category === "Education";
    if (activeCategoryTab === "medical") return tmpl.category === "Healthcare";
    return true;
  }).slice(0, 6);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto animate-in fade-in duration-200">
      {/* 1. TOP HERO BANNER: 1-CLICK AUTOMATION READY */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-800 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{lang === "bn" ? "অটো-ফিল্ড লেটারহেড সক্রিয়" : "Shop Automation Active"}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {profile.businessName || "Your Organization Preset"}
          </h2>
          <p className="text-blue-100 text-xs sm:text-sm mt-2 leading-relaxed">
            {lang === "bn"
              ? "যেকোনো টেমপ্লেট ওপেন করলেই স্বয়ংক্রিয়ভাবে আপনার নাম, ফোন ও ঠিকানা পূরণ হয়ে যাবে। প্রতিবার নতুন করে টাইপ করার প্রয়োজন নেই!"
              : "Whenever a customer orders or a patient visits, launch any template and your saved preset details will auto-fill instantly!"}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-blue-200">
            <span>📞 {profile.phone || "+880 1712-345678"}</span>
            <span>•</span>
            <span>📍 {profile.address || "Dhaka, Bangladesh"}</span>
            <span>•</span>
            <span className="font-bold text-white">Currency: {profile.currency || "৳"}</span>
          </div>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
          <Link
            href="/dashboard/shop-profile"
            className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-3 rounded-xl text-xs sm:text-sm transition border border-white/20"
          >
            <span>{lang === "bn" ? "প্রিসেট এডিট করুন" : "Edit Preset"}</span>
          </Link>
          <Link
            href={
              activeCategoryTab === "school"
                ? "/templates/school-result-sheet"
                : activeCategoryTab === "medical"
                ? "/templates/doctor-prescription"
                : "/templates/f-commerce-invoice"
            }
            className="flex items-center justify-center gap-2 bg-white hover:bg-blue-50 text-blue-700 font-bold px-5 py-3 rounded-xl text-xs sm:text-sm transition shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{lang === "bn" ? "১-ক্লিক প্রিন্ট ওপেন করুন" : "1-Click Print"}</span>
          </Link>
        </div>
      </div>

      {/* 2. SMART ANALYTICS & STATUS KPI ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Active Preset */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {lang === "bn" ? "বর্তমান প্রিসেট" : "Active Preset"}
            </span>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white mt-1 truncate max-w-[150px]">
              {profile.businessName?.split(" ")[0] || "Stylist Fashion"}
            </h4>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {lang === "bn" ? "৩০টি টেমপ্লেটে সিঙ্কড" : "Auto-Sync Active"}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Store className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 2: Documents Printed */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {lang === "bn" ? "প্রিন্ট করা ডকুমেন্টস" : "Archived Docs"}
            </span>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
              4 {lang === "bn" ? "টি তৈরি" : "Records"}
            </h4>
            <Link
              href="/dashboard/history"
              className="text-[10px] text-blue-600 dark:text-blue-400 font-bold hover:underline mt-0.5 block"
            >
              {lang === "bn" ? "হিস্ট্রি দেখুন →" : "View History →"}
            </Link>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 3: AI Designer Credits */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {lang === "bn" ? "এআই কোটা বাকি" : "AI Quota Left"}
            </span>
            <h4 className="text-base font-extrabold text-purple-600 dark:text-purple-400 mt-1">
              5 / 5 {lang === "bn" ? "টি" : "Credits"}
            </h4>
            <Link
              href="/dashboard/ai-designer"
              className="text-[10px] text-purple-600 dark:text-purple-400 font-bold hover:underline mt-0.5 block"
            >
              {lang === "bn" ? "এআই ডিজাইনার খুলুন →" : "Launch AI →"}
            </Link>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 4: Watermark Free Status */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {lang === "bn" ? "লাইসেন্স ও ওয়াটারমার্ক" : "License & Ads"}
            </span>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
              100% Free
            </h4>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5 block">
              {lang === "bn" ? "জিরো ওয়াটারমার্ক" : "Zero Watermark"}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. MULTI-CATEGORY QUICK LAUNCHER SECTION */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              {lang === "bn" ? "ক্যাটাগরি অনুযায়ী ১-ক্লিক টেমপ্লেট লঞ্চার" : "Multi-Category Quick Launcher"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {lang === "bn"
                ? "যেকোনো টেমপ্লেটে ক্লিক করুন, আপনার প্রতিষ্ঠানের সংরক্ষিত তথ্য দিয়ে অটো-ফিল হয়ে ওপেন হবে।"
                : "Select a category below to launch ready-to-print formats pre-filled with your saved profile."}
            </p>
          </div>

          {/* Category Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setActiveCategoryTab("shop")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeCategoryTab === "shop"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{lang === "bn" ? "দোকান ও ব্যবসা" : "Shop"}</span>
            </button>

            <button
              onClick={() => setActiveCategoryTab("school")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeCategoryTab === "school"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{lang === "bn" ? "স্কুল ও শিক্ষা" : "School"}</span>
            </button>

            <button
              onClick={() => setActiveCategoryTab("medical")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeCategoryTab === "medical"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>{lang === "bn" ? "চিকিৎসা" : "Medical"}</span>
            </button>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeTemplates.map((tmpl) => {
            const isPos = tmpl.paperSize === "POS_80MM";
            return (
              <Link
                key={tmpl.id}
                href={`/templates/${tmpl.slug}`}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition flex flex-col justify-between group bg-slate-50/50 dark:bg-slate-800/40"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                      {isPos ? "POS 80mm" : "A4 Sheet"}
                    </span>
                    {tmpl.badge && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-full">
                        {tmpl.badge}
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-snug">
                    {lang === "bn" && tmpl.locales?.bn?.title ? tmpl.locales.bn.title : tmpl.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {lang === "bn" && tmpl.locales?.bn?.description ? tmpl.locales.bn.description : tmpl.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                  <span>{lang === "bn" ? "প্রিসেট সহ ওপেন করুন" : "Open with Preset"}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center pt-2">
          <Link
            href="/templates"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <span>{lang === "bn" ? "সকল ৩০টি টেমপ্লেট গ্যালারিতে দেখুন →" : "Explore All 30 Formats in Gallery →"}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
