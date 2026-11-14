"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Store,
  Printer,
  ArrowRight,
  GraduationCap,
  Stethoscope,
  FileText,
  Layers,
  Zap,
  Mic,
  Eye,
  PlusCircle,
  TrendingUp,
  Search,
  Receipt,
  Calendar,
} from "lucide-react";
import { INITIAL_TEMPLATES, TemplateDefinition } from "@/lib/templates";
import { useUserDashboard } from "@/context/UserDashboardContext";

export default function UserDashboardOverviewPage() {
  const { lang, t } = useUserDashboard();

  const [activeCategoryTab, setActiveCategoryTab] = useState<
    "all" | "receipts" | "class-routines" | "exam-routines" | "medical-receipts"
  >("receipts");

  const [searchQuery, setSearchQuery] = useState("");
  const [docCount, setDocCount] = useState<number>(4);

  const [profile, setProfile] = useState({
    businessName: "",
    tagline: "Quality Documents Delivered in Seconds",
    phone: "",
    address: "",
    currency: "৳",
    logoUrl: null as string | null,
    signatureUrl: null as string | null,
    presetType: "shop" as "shop" | "school" | "medical",
  });

  // Load saved preset and live document count
  useEffect(() => {
    // 1. Check local preset
    const saved = localStorage.getItem("freedocforge_active_preset");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProfile((prev) => ({
          ...prev,
          ...parsed,
        }));
        if (parsed.presetType === "school") setActiveCategoryTab("class-routines");
        else if (parsed.presetType === "medical") setActiveCategoryTab("medical-receipts");
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

    // 2. Fetch live user documents count
    fetch("/api/user/documents")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.documents)) {
          setDocCount(data.documents.length);
        } else {
          const savedHist = localStorage.getItem("freedocforge_history");
          if (savedHist) {
            try {
              const parsedHist = JSON.parse(savedHist);
              if (Array.isArray(parsedHist)) setDocCount(parsedHist.length);
            } catch (e) {}
          }
        }
      })
      .catch(() => {
        const savedHist = localStorage.getItem("freedocforge_history");
        if (savedHist) {
          try {
            const parsedHist = JSON.parse(savedHist);
            if (Array.isArray(parsedHist)) setDocCount(parsedHist.length);
          } catch (e) {}
        }
      });
  }, []);

  // Quick search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return INITIAL_TEMPLATES.filter((tmpl) => {
      const enT = tmpl.title.toLowerCase();
      const bnT = tmpl.locales?.bn?.title.toLowerCase() || "";
      const slug = tmpl.slug.toLowerCase();
      const badge = tmpl.badge?.toLowerCase() || "";
      return enT.includes(q) || bnT.includes(q) || slug.includes(q) || badge.includes(q);
    }).slice(0, 5);
  }, [searchQuery]);

  // Filter templates based on active 4-pillar tabs
  const activeTemplates = useMemo(() => {
    return INITIAL_TEMPLATES.filter((tmpl) => {
      if (activeCategoryTab === "receipts") {
        return (
          tmpl.category === "Business" ||
          tmpl.category === "Restaurant" ||
          tmpl.slug.includes("invoice") ||
          tmpl.slug.includes("receipt") ||
          tmpl.slug.includes("bill") ||
          tmpl.slug.includes("chalan")
        );
      }
      if (activeCategoryTab === "class-routines") {
        return (
          (tmpl.category === "Education" ||
            tmpl.subCategory === "routine" ||
            tmpl.slug.includes("routine") ||
            tmpl.slug.includes("timetable")) &&
          !tmpl.slug.includes("exam")
        );
      }
      if (activeCategoryTab === "exam-routines") {
        return (
          tmpl.slug.includes("exam") ||
          tmpl.slug.includes("test-schedule") ||
          tmpl.slug === "school-exam-routine"
        );
      }
      if (activeCategoryTab === "medical-receipts") {
        return (
          (tmpl.category === "Healthcare" || tmpl.slug.includes("medical") || tmpl.slug.includes("clinic")) &&
          (tmpl.subCategory === "receipt" ||
            tmpl.slug.includes("receipt") ||
            tmpl.slug.includes("bill") ||
            tmpl.slug.includes("admission") ||
            tmpl.slug.includes("slip"))
        );
      }
      return true;
    }).slice(0, 6);
  }, [activeCategoryTab]);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto animate-in fade-in duration-200">
      {/* 1. TOP HERO BANNER: 1-CLICK AUTOMATION READY */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Subtle Background Glow Rings */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{lang === "bn" ? "অটো-ফিল্ড লেটারহেড সক্রিয়" : "Shop & Institute Automation Active"}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {profile.businessName || "Your Organization Preset"}
          </h2>
          <p className="text-blue-100 text-xs sm:text-sm mt-2 leading-relaxed">
            {lang === "bn"
              ? "যেকোনো টেমপ্লেট ওপেন করলেই স্বয়ংক্রিয়ভাবে আপনার নাম, ফোন ও ঠিকানা পূরণ হয়ে যাবে। ৬০টি টেমপ্লেটেই ইনস্ট্যান্ট অটো-ফিল।"
              : "Whenever a customer orders or a patient visits, launch any template and your saved profile will auto-fill across all 60 formats instantly!"}
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
              activeCategoryTab === "class-routines"
                ? "/templates/school-class-routine"
                : activeCategoryTab === "exam-routines"
                ? "/templates/school-exam-routine"
                : activeCategoryTab === "medical-receipts"
                ? "/templates/medical-money-receipt"
                : "/templates/f-commerce-invoice"
            }
            className="flex items-center justify-center gap-2 bg-white hover:bg-blue-50 text-blue-700 font-bold px-5 py-3 rounded-xl text-xs sm:text-sm transition shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{lang === "bn" ? "১-ক্লিক প্রিন্ট ওপেন করুন" : "1-Click Print"}</span>
          </Link>
        </div>
      </div>

      {/* 2. QUICK TEMPLATE JUMP SEARCH BAR */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              lang === "bn"
                ? "৬০টি টেমপ্লেট থেকে দ্রুত খুঁজুন ও ১-ক্লিকে প্রিসেট সহ ওপেন করুন..."
                : "Quick Template Jump: Search 60 templates to launch with your preset pre-filled..."
            }
            className="w-full pl-11 pr-10 py-3 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Real-time search autocomplete popover */}
        {searchQuery.trim().length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-40 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 animate-in fade-in">
            {searchResults.length > 0 ? (
              searchResults.map((tmpl) => (
                <Link
                  key={tmpl.id}
                  href={`/templates/${tmpl.slug}`}
                  className="p-3 flex items-center justify-between hover:bg-blue-50 dark:hover:bg-slate-800 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600">
                        {lang === "bn" && tmpl.locales?.bn?.title ? tmpl.locales.bn.title : tmpl.title}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        {tmpl.category} • {tmpl.paperSize === "POS_80MM" ? "80mm POS" : "A4 Sheet"}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>{lang === "bn" ? "ওপেন করুন" : "Open"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-slate-400">
                {lang === "bn" ? "কোনো টেমপ্লেট মেলেনি" : "No matching template found"}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. SMART ANALYTICS & STATUS KPI ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Active Preset */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {lang === "bn" ? "বর্তমান প্রিসেট" : "Active Preset"}
            </span>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white mt-1 truncate max-w-[150px]">
              {profile.businessName || (lang === "bn" ? "সক্রিয় প্রিসেট" : "Active Preset")}
            </h4>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {lang === "bn" ? "৬০টি টেমপ্লেটে সিঙ্কড" : "Synced across 60 formats"}
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
              {lang === "bn" ? "সংরক্ষিত ডকুমেন্টস" : "Saved Records"}
            </span>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
              {docCount} {lang === "bn" ? "টি সংরক্ষিত" : "Documents"}
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

        {/* KPI 3: Available Library */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {lang === "bn" ? "টেমপ্লেট সংগ্রহশালা" : "Templates Library"}
            </span>
            <h4 className="text-base font-extrabold text-purple-600 dark:text-purple-400 mt-1">
              {INITIAL_TEMPLATES.length} {lang === "bn" ? "টি ফরম্যাট" : "Ready Formats"}
            </h4>
            <Link
              href="/templates"
              className="text-[10px] text-purple-600 dark:text-purple-400 font-bold hover:underline mt-0.5 block"
            >
              {lang === "bn" ? "সব টেমপ্লেট দেখুন →" : "Browse All →"}
            </Link>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Layers className="w-5 h-5" />
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

      {/* 4. MULTI-CATEGORY QUICK LAUNCHER SECTION (4 PILLARS) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              {lang === "bn" ? "৪টি মূল ক্যাটাগরি অনুযায়ী ১-ক্লিক লঞ্চার" : "4-Pillar Quick Template Launchers"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {lang === "bn"
                ? "যেকোনো টেমপ্লেটে ক্লিক করুন, আপনার প্রতিষ্ঠানের সংরক্ষিত তথ্য দিয়ে অটো-ফিল হয়ে ওপেন হবে।"
                : "Select a pillar below to launch templates automatically pre-filled with your saved profile."}
            </p>
          </div>

          {/* 4 Pillar Category Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveCategoryTab("receipts")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                activeCategoryTab === "receipts"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>{lang === "bn" ? "ক্যাশ মেমো (13)" : "Receipts (13)"}</span>
            </button>

            <button
              onClick={() => setActiveCategoryTab("class-routines")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                activeCategoryTab === "class-routines"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{lang === "bn" ? "ক্লাস রুটিন (10)" : "Class Routines (10)"}</span>
            </button>

            <button
              onClick={() => setActiveCategoryTab("exam-routines")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                activeCategoryTab === "exam-routines"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{lang === "bn" ? "পরীক্ষার রুটিন (10)" : "Exam Routines (10)"}</span>
            </button>

            <button
              onClick={() => setActiveCategoryTab("medical-receipts")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                activeCategoryTab === "medical-receipts"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>{lang === "bn" ? "ক্লিনিক রসিদ (10)" : "Clinic Bills (10)"}</span>
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
            <span>
              {lang === "bn"
                ? `সকল ${INITIAL_TEMPLATES.length}টি টেমপ্লেট গ্যালারিতে দেখুন →`
                : `Explore All ${INITIAL_TEMPLATES.length} Formats in Gallery →`}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
