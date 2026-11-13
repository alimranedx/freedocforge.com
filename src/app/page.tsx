"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdSenseSlot from "@/components/AdSenseSlot";
import TemplateCardPreview from "@/components/TemplateCardPreview";
import JsonLd from "@/components/JsonLd";
import { getBreadcrumbListSchema, getFaqPageSchema, SITE_URL } from "@/lib/seo";
import { INITIAL_TEMPLATES, TemplateDefinition } from "@/lib/templates";
import {
  Printer,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Store,
  GraduationCap,
  Stethoscope,
  Mic,
  FileText,
  Clock,
  Award,
  Layers,
  ChevronRight,
  Eye,
  Search,
  Receipt,
  Calendar,
  Check,
  Star,
  Download,
  Building,
  HelpCircle,
} from "lucide-react";
import { useGlobalSettings } from "@/context/GlobalSettingsContext";

const HOME_FAQS = [
  {
    questionEn: "Is FreeDocForge really 100% free with no watermarks?",
    questionBn: "FreeDocForge কি সত্যিই সম্পূর্ণ ফ্রি এবং ওয়াটারমার্ক ছাড়া?",
    answerEn: "Yes, 100% free forever. FreeDocForge does not place any watermarks, require subscription plans, or charge hidden fees for downloading or printing.",
    answerBn: "হ্যাঁ, আজীবনের জন্য ১০০% ফ্রি। এতে কোনো ওয়াটারমার্ক থাকবে না এবং কোনো সাবস্ক্রিপশন ফি ছাড়াই আনলিমিটেড ডকুমেন্ট ডাউনলোড ও প্রিন্ট করতে পারবেন।",
  },
  {
    questionEn: "Can I print documents on both standard ISO A4 paper and 80mm thermal POS receipt rolls?",
    questionBn: "ডকুমেন্টগুলো কি সাধারণ A4 এবং ৮০ মিমি থার্মাল পিওএস উভয় পেপারে প্রিন্ট করা যায়?",
    answerEn: "Yes! Our templates dynamically adapt to standard ISO A4 (desktop & laser printers) and 80mm ESC/POS thermal paper rolls widely used in restaurants and retail shops.",
    answerBn: "হ্যাঁ! সাধারণ লেজার প্রিন্টারের জন্য স্ট্যান্ডার্ড A4 এবং রেস্টুরেন্ট বা সুপারশপের ৮০মিমি থার্মাল পেপার রোলের মাপে নিখুঁতভাবে প্রিন্ট নেওয়া যায়।",
  },
  {
    questionEn: "How do I download vector PDF files directly without OS print dialogs?",
    questionBn: "প্রিন্ট ডায়ালগ ছাড়া সরাসরি ভেক্টর PDF কীভাবে ডাউনলোড করব?",
    answerEn: "Click the 'Download PDF' button on any document. Our client-side rendering engine instantly compiles and downloads a crystal-clear vector PDF into your device storage.",
    answerBn: "যেকোনো টেমপ্লেটে 'PDF ডাউনলোড' বাটনে ক্লিক করলেই সরাসরি হাই-রেজোলিউশন ভেক্টর PDF আপনার ডিভাইসে ডাউনলোড হয়ে যাবে।",
  },
  {
    questionEn: "Does Bengali Voice Typing support real-time voice speech input?",
    questionBn: "বাংলা ভয়েস টাইপিং কি স্বাভাবিক কথোপকথনের আওয়াজ শনাক্ত করতে পারে?",
    answerEn: "Yes! Click the microphone button next to any input field and speak naturally in Bengali (bn-BD) or English (en-US). Our voice engine types item names and amounts automatically.",
    answerBn: "হ্যাঁ! যেকোনো ইনপুট বক্সের পাশের মাইক বাটনে ক্লিক করে বাংলায় কথা বলুন। স্বয়ংক্রিয়ভাবে পণ্য ও টাকার পরিমাণ বাংলায় টাইপ হয়ে যাবে।",
  },
  {
    questionEn: "Is my business, customer, and student data kept private and secure?",
    questionBn: "আমার ব্যবসা, কাস্টমার এবং শিক্ষার্থীদের তথ্যের গোপনীয়তা কি সুরক্ষিত থাকে?",
    answerEn: "100% private. All document processing and PDF generation take place directly inside your web browser. We never store or transmit your guest invoice details to external servers.",
    answerBn: "১০০% নিরাপদ ও গোপন। সমস্ত ডেটা সম্পূর্ণ আপনার ডিভাইসের ব্রাউজারে প্রক্রিয়াজাত হয়। কোনো সার্ভারে গ্রাহকের তথ্য সংরক্ষিত হয় না।",
  },
];

export default function HomePage() {
  const { lang, t } = useGlobalSettings();

  const homeBreadcrumb = getBreadcrumbListSchema([{ name: "Home", url: "/" }]);
  const homeFaq = getFaqPageSchema(HOME_FAQS, lang);

  // Active Hero Interactive Studio Preview Tab
  const [heroActiveTab, setHeroActiveTab] = useState<
    "receipts" | "class-routine" | "exam-routine" | "medical-receipt"
  >("receipts");

  // Hero Live Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  // Quick search results (real-time as-you-type)
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    return INITIAL_TEMPLATES.filter((tmpl) => {
      const enTitle = tmpl.title.toLowerCase();
      const bnTitle = tmpl.locales?.bn?.title.toLowerCase() || "";
      const enDesc = tmpl.description.toLowerCase();
      const bnDesc = tmpl.locales?.bn?.description.toLowerCase() || "";
      const slug = tmpl.slug.toLowerCase();
      const badge = tmpl.badge?.toLowerCase() || "";
      return (
        enTitle.includes(query) ||
        bnTitle.includes(query) ||
        enDesc.includes(query) ||
        bnDesc.includes(query) ||
        slug.includes(query) ||
        badge.includes(query)
      );
    }).slice(0, 6);
  }, [searchQuery]);

  // Pillar 1: Worldwide Receipts & Invoices (Top 4 Featured)
  const receiptTemplates = useMemo(() => {
    const slugs = [
      "f-commerce-invoice",
      "restaurant-pos-bill",
      "shop-delivery-chalan",
      "grocery-supermarket-receipt",
    ];
    return slugs
      .map((slug) => INITIAL_TEMPLATES.find((t) => t.slug === slug))
      .filter(Boolean) as TemplateDefinition[];
  }, []);

  // Pillar 2: Class Routines & Academic Timetables (Featured)
  const classRoutineTemplates = useMemo(() => {
    return INITIAL_TEMPLATES.filter(
      (t) =>
        (t.slug.includes("routine") || t.subCategory === "routine" || t.slug.includes("timetable")) &&
        !t.slug.includes("exam")
    ).slice(0, 4);
  }, []);

  // Pillar 3: Examination Routines & Schedules (Featured)
  const examRoutineTemplates = useMemo(() => {
    return INITIAL_TEMPLATES.filter(
      (t) => t.slug.includes("exam") || t.slug.includes("schedule") || t.slug === "school-exam-routine"
    ).slice(0, 4);
  }, []);

  // Pillar 4: Medical & Clinic Receipts (Featured)
  const medicalReceiptTemplates = useMemo(() => {
    const slugs = [
      "medical-money-receipt",
      "hospital-admission-slip",
      "medical-appointment-token",
      "doctor-prescription",
    ];
    return slugs
      .map((slug) => INITIAL_TEMPLATES.find((t) => t.slug === slug))
      .filter(Boolean) as TemplateDefinition[];
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Schema.org Structured Data */}
      <JsonLd data={homeBreadcrumb} />
      <JsonLd data={homeFaq} />

      <Navbar />

      {/* 0. HIGH-CONVERTING TRUST & RETENTION RIBBON */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white text-xs py-2 px-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="font-semibold text-[11px] sm:text-xs">
              {lang === "bn"
                ? "১০০% সম্পূর্ণ ফ্রি • ওয়াটারমার্ক ছাড়া ১-ক্লিকে ভেক্টর PDF • কোনো সাইন-আপ প্রয়োজন নেই"
                : "100% Free Forever • Zero Watermark • 1-Click Vector PDF • No Signup Required"}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-[11px] font-medium text-blue-100">
            <span>{lang === "bn" ? "আজ ৫২০+ ডকুমেন্ট তৈরি হয়েছে" : "520+ Documents generated today"}</span>
            <Link
              href="/templates"
              className="underline font-bold text-white hover:text-amber-300 transition"
            >
              {lang === "bn" ? "সব টেমপ্লেট দেখুন →" : "Explore 40+ Templates →"}
            </Link>
          </div>
        </div>
      </div>

      {/* TOP LEADERBOARD ADSENSE UNIT */}
      <div className="max-w-7xl mx-auto px-4 w-full pt-4">
        <AdSenseSlot slotId="home-top-leaderboard" format="horizontal" label="Advertisement" />
      </div>

      {/* 1. HERO SECTION WITH HOOK & LIVE SEARCH */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
        {/* Ambient Radial Spotlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-500/15 via-indigo-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-5">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-950/80 dark:to-indigo-950/80 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200/80 dark:border-blue-800 shadow-2xs">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>
              {lang === "bn"
                ? "বিশ্বমানের ৪০+ ফ্রি প্রিন্ট ও ডাউনলোড টেমপ্লেট"
                : "40+ World-Class Free Printable & Download Templates"}
            </span>
          </div>

          {/* Punchy Hero Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
            {lang === "bn" ? "কয়েক সেকেন্ডেই তৈরি ও প্রিন্ট করুন" : "Create, Customize & Download"}{" "}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400">
              {lang === "bn" ? "১০০% ফ্রি প্রফেশনাল ডকুমেন্ট" : "100% Free Business Documents"}
            </span>{" "}
            {lang === "bn" ? "বিনা খরচে।" : "in Seconds."}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {lang === "bn"
              ? "দোকানের ক্যাশ মেমো, স্কুলের ক্লাস রুটিন, পরীক্ষার সময়সূচি ও ক্লিনিক রসিদ। কোনো ক্রেডিট কার্ড বা সাইন-আপ ছাড়াই ১ ক্লিকে হাই-রেজুলেশন ভেক্টর PDF ডাউনলোড করুন।"
              : "Invoices, class routines, exam schedules & clinic receipts with instant live preview. Zero signup, zero watermarks, and direct 1-click vector PDF download."}
          </p>

          {/* HERO LIVE INSTANT SEARCH BAR (Search as you type) */}
          <div className="max-w-2xl mx-auto relative pt-2">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  lang === "bn"
                    ? "৪০+ ফ্রি টেমপ্লেট খুঁজুন (যেমন: মেমো, ক্লাস রুটিন, পরীক্ষার রুটিন, পিওএস বিল)..."
                    : "Search 40+ free templates (e.g. Cash memo, Class routine, Exam schedule, POS bill)..."
                }
                className="w-full pl-12 pr-10 py-3.5 sm:py-4 text-xs sm:text-sm bg-white dark:bg-slate-900 border-2 border-blue-500/40 dark:border-blue-500/30 rounded-2xl shadow-lg focus:border-blue-600 focus:ring-4 focus:ring-blue-500/20 focus:outline-none transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 text-slate-400 hover:text-slate-600 text-sm font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Live Search Instant Autocomplete Popover */}
            {searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden text-left divide-y divide-slate-100 dark:divide-slate-800 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>
                    {lang === "bn"
                      ? `${searchResults.length} টি টেমপ্লেট পাওয়া গেছে`
                      : `Found ${searchResults.length} matching templates`}
                  </span>
                  <Link
                    href={`/templates`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {lang === "bn" ? "সব দেখুন" : "View all"}
                  </Link>
                </div>

                {searchResults.length > 0 ? (
                  searchResults.map((tmpl) => (
                    <Link
                      key={tmpl.id}
                      href={`/templates/${tmpl.slug}`}
                      className="p-3.5 flex items-center justify-between hover:bg-blue-50/60 dark:hover:bg-slate-800/80 transition group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition">
                            {lang === "bn" && tmpl.locales?.bn?.title
                              ? tmpl.locales.bn.title
                              : tmpl.title}
                          </p>
                          <p className="text-[11px] text-slate-400 line-clamp-1">
                            {tmpl.category} • {tmpl.paperSize === "POS_80MM" ? "80mm Thermal" : "A4 Sheet"}
                          </p>
                        </div>
                      </div>
                      <span className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-lg shrink-0 group-hover:bg-blue-600 group-hover:text-white transition">
                        <span>{lang === "bn" ? "ওপেন করুন" : "Open"}</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </Link>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-slate-400">
                    {lang === "bn"
                      ? "কোনো টেমপ্লেট পাওয়া যায়নি। নিচের ক্যাটাগরিগুলো থেকে বেছে নিন।"
                      : "No template found. Explore popular categories below."}
                  </div>
                )}
              </div>
            )}

            {/* Quick Trending Suggestions Bar */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="font-bold text-slate-400">🔥 {lang === "bn" ? "জনপ্রিয়:" : "Trending:"}</span>
              {[
                { label: lang === "bn" ? "ক্যাশ মেমো" : "Cash Memo", q: "memo" },
                { label: lang === "bn" ? "ক্লাস রুটিন" : "Class Routine", q: "routine" },
                { label: lang === "bn" ? "পরীক্ষার সূচি" : "Exam Routine", q: "exam" },
                { label: lang === "bn" ? "৮০মিমি পিওএস" : "POS 80mm", q: "pos" },
                { label: lang === "bn" ? "ডায়াগনস্টিক বিল" : "Medical Bill", q: "receipt" },
              ].map((item, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSearchQuery(item.q)}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 hover:text-blue-600 transition shadow-2xs font-medium cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Link
              href="/templates/f-commerce-invoice"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-7 py-3.5 rounded-2xl shadow-md hover:shadow-lg transition text-xs sm:text-sm cursor-pointer transform hover:-translate-y-0.5"
            >
              <Printer className="w-4 h-4" />
              <span>{lang === "bn" ? "ক্যাশ মেমো তৈরি করুন" : "Create Cash Memo Now"}</span>
            </Link>

            <Link
              href="/templates"
              className="flex items-center gap-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold px-6 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-800 shadow-xs transition text-xs sm:text-sm cursor-pointer"
            >
              <span>{lang === "bn" ? "সকল ৪০+ টেমপ্লেট দেখুন" : "Browse 40+ Templates"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 2. INTERACTIVE LIVE STUDIO MOCKUP WINDOW (The 4-Pillar Hook) */}
        <div className="max-w-5xl mx-auto mt-10 sm:mt-14 relative z-10">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden ring-1 ring-slate-900/5">
            {/* Top Mac Window Control Bar */}
            <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                <span className="text-[11px] font-mono text-slate-400 ml-2 hidden sm:inline">
                  freedocforge.com/live-preview
                </span>
              </div>

              {/* 4-Pillar Interactive Tab Switcher */}
              <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setHeroActiveTab("receipts")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                    heroActiveTab === "receipts"
                      ? "bg-blue-600 text-white shadow-2xs"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>{lang === "bn" ? "ক্যাশ মেমো (10+)" : "Receipts (10+)"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHeroActiveTab("class-routine")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                    heroActiveTab === "class-routine"
                      ? "bg-blue-600 text-white shadow-2xs"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{lang === "bn" ? "ক্লাস রুটিন (10+)" : "Class Routine (10+)"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHeroActiveTab("exam-routine")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                    heroActiveTab === "exam-routine"
                      ? "bg-blue-600 text-white shadow-2xs"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>{lang === "bn" ? "পরীক্ষার রুটিন (10+)" : "Exam Routine (10+)"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHeroActiveTab("medical-receipt")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                    heroActiveTab === "medical-receipt"
                      ? "bg-blue-600 text-white shadow-2xs"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>{lang === "bn" ? "ক্লিনিক রসিদ (10+)" : "Clinic Bill (10+)"}</span>
                </button>
              </div>
            </div>

            {/* Inner Live Document Canvas Showcase */}
            <div className="p-5 sm:p-8 bg-slate-50/70 dark:bg-slate-950/60 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
              {/* Left Document Miniature Preview */}
              <div className="w-full lg:w-3/5 bg-white text-slate-800 p-5 sm:p-7 rounded-2xl shadow-lg border border-slate-200 select-none text-xs space-y-4">
                {/* TAB 1: WORLDWIDE RECEIPTS */}
                {heroActiveTab === "receipts" && (
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-start border-b-2 border-slate-900 pb-2.5">
                      <div>
                        <h3 className="font-black text-sm sm:text-base text-slate-900 uppercase tracking-tight">
                          STYLIST FASHION BD
                        </h3>
                        <p className="text-slate-500 text-[10px] font-medium">Quality Delivered to Your Doorstep</p>
                        <p className="text-slate-400 text-[9px]">Dhanmondi, Dhaka • +880 1712-345678</p>
                      </div>
                      <div className="text-right">
                        <span className="bg-slate-900 text-white font-black text-[9px] px-2 py-0.5 rounded">
                          CASH MEMO
                        </span>
                        <p className="text-slate-600 font-bold text-[10px] mt-0.5">INV-2026-089</p>
                        <p className="text-slate-400 text-[9px]">Date: 2026-11-12</p>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex justify-between items-center text-[10px]">
                      <div>
                        <span className="text-[8px] uppercase font-bold text-slate-400 block">BILLED TO:</span>
                        <span className="font-bold text-slate-900">Md. Tanvir Ahmed</span>
                        <span className="text-slate-500 block text-[9px]">Mirpur-10, Dhaka • +880 1819-987654</span>
                      </div>
                      <span className="bg-amber-100 text-amber-800 font-black px-2.5 py-1 rounded-lg text-[11px]">
                        COD DUE: ৳ 3,470
                      </span>
                    </div>

                    <table className="w-full text-[10px] border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 uppercase text-[8px] font-bold">
                          <th className="text-left py-1">Item Description</th>
                          <th className="text-center py-1">Qty</th>
                          <th className="text-right py-1">Rate</th>
                          <th className="text-right py-1">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="py-1 font-medium">Premium Cotton Formal Shirt (L)</td>
                          <td className="text-center">2</td>
                          <td className="text-right text-slate-500">৳ 1,250</td>
                          <td className="text-right font-bold">৳ 2,500</td>
                        </tr>
                        <tr>
                          <td className="py-1 font-medium">Slim Fit Chino Pant (32)</td>
                          <td className="text-center">1</td>
                          <td className="text-right text-slate-500">৳ 1,450</td>
                          <td className="text-right font-bold">৳ 1,450</td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="border-t-2 border-slate-900 pt-2 flex justify-between items-end text-[10px]">
                      <div>
                        <span className="text-[9px] text-slate-400 block">Three Thousand Four Hundred Seventy Taka Only</span>
                        <span className="font-black text-blue-700 text-xs sm:text-sm">Net Payable: ৳ 3,470</span>
                      </div>
                      <div className="text-center">
                        <div className="w-16 border-b border-slate-400 mb-0.5"></div>
                        <span className="text-[8px] font-bold text-slate-600">Authorized Seal</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: CLASS ROUTINES */}
                {heroActiveTab === "class-routine" && (
                  <div className="space-y-3">
                    <div className="text-center border-b-2 border-blue-900 pb-2">
                      <h3 className="font-black text-sm sm:text-base text-blue-950 uppercase tracking-tight">
                        DHAKA IDEAL MODEL SCHOOL & COLLEGE
                      </h3>
                      <div className="flex items-center justify-center gap-2 mt-0.5">
                        <span className="bg-blue-900 text-white font-extrabold text-[9px] px-2 py-0.5 rounded">
                          CLASS 9 (SCIENCE) - WEEKLY MASTER ROUTINE
                        </span>
                        <span className="text-[9px] text-slate-500 font-semibold">Morning Shift • Room 402</span>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-[9px] border-collapse border border-slate-200">
                        <thead>
                          <tr className="bg-blue-50 text-blue-900 font-bold uppercase text-[8px] border-b border-slate-200">
                            <th className="p-1 border-r border-slate-200 text-left">Day</th>
                            <th className="p-1 border-r border-slate-200 text-center">1st (08:30)</th>
                            <th className="p-1 border-r border-slate-200 text-center">2nd (09:15)</th>
                            <th className="p-1 border-r border-slate-200 text-center">3rd (10:00)</th>
                            <th className="p-1 border-r border-slate-200 text-center">4th (11:15)</th>
                            <th className="p-1 text-center">5th (12:00)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr>
                            <td className="p-1 font-bold bg-slate-50 border-r border-slate-200">SUN</td>
                            <td className="p-1 text-center border-r border-slate-200 font-medium">H. Math (MTR)</td>
                            <td className="p-1 text-center border-r border-slate-200 font-medium">Physics (KBR)</td>
                            <td className="p-1 text-center border-r border-slate-200 font-medium">English (SAR)</td>
                            <td className="p-1 text-center border-r border-slate-200 font-medium">Chemistry (RAH)</td>
                            <td className="p-1 text-center font-medium">Biology (NUR)</td>
                          </tr>
                          <tr>
                            <td className="p-1 font-bold bg-slate-50 border-r border-slate-200">MON</td>
                            <td className="p-1 text-center border-r border-slate-200 font-medium">Bangla 1st (JAL)</td>
                            <td className="p-1 text-center border-r border-slate-200 font-medium">H. Math (MTR)</td>
                            <td className="p-1 text-center border-r border-slate-200 font-medium">ICT (TNH)</td>
                            <td className="p-1 text-center border-r border-slate-200 font-medium">Physics (KBR)</td>
                            <td className="p-1 text-center font-medium">Religion (ABU)</td>
                          </tr>
                          <tr>
                            <td className="p-1 font-bold bg-slate-50 border-r border-slate-200">TUE</td>
                            <td className="p-1 text-center border-r border-slate-200 font-medium">Chemistry (RAH)</td>
                            <td className="p-1 text-center border-r border-slate-200 font-medium">English (SAR)</td>
                            <td className="p-1 text-center border-r border-slate-200 font-medium">H. Math (MTR)</td>
                            <td className="p-1 text-center border-r border-slate-200 font-medium">Biology (NUR)</td>
                            <td className="p-1 text-center font-medium">Bangla 2nd (JAL)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="border-t border-slate-200 pt-1.5 flex justify-between items-center text-[9px]">
                      <span className="text-slate-500 font-medium">
                        Effective: Academic Year 2026 • 6-Day Period Grid
                      </span>
                      <div className="text-center">
                        <div className="w-16 border-b border-slate-400 mb-0.5"></div>
                        <span className="text-[8px] font-bold text-slate-700">Principal Signature</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: EXAM ROUTINES */}
                {heroActiveTab === "exam-routine" && (
                  <div className="space-y-3">
                    <div className="text-center border-b-2 border-indigo-900 pb-2">
                      <h3 className="font-black text-sm sm:text-base text-indigo-950 uppercase tracking-tight">
                        ANNUAL & BOARD EXAMINATION TIMETABLE 2026
                      </h3>
                      <div className="flex items-center justify-center gap-2 mt-0.5">
                        <span className="bg-indigo-900 text-white font-extrabold text-[9px] px-2 py-0.5 rounded">
                          SECONDARY & HIGHER SECONDARY
                        </span>
                        <span className="text-[9px] text-slate-500 font-semibold">Morning Shift: 10:00 AM - 01:00 PM</span>
                      </div>
                    </div>

                    <table className="w-full text-[9px] border-collapse border border-slate-200">
                      <thead>
                        <tr className="bg-indigo-50 text-indigo-900 font-bold uppercase text-[8px] border-b border-slate-200">
                          <th className="p-1 border-r border-slate-200 text-left">Date & Day</th>
                          <th className="p-1 border-r border-slate-200 text-left">Subject Name</th>
                          <th className="p-1 border-r border-slate-200 text-center">Code</th>
                          <th className="p-1 text-center">Hall / Room</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="p-1 font-bold border-r border-slate-200">2026-11-20 (Thu)</td>
                          <td className="p-1 font-medium border-r border-slate-200">Bangla 1st Paper</td>
                          <td className="p-1 text-center font-mono border-r border-slate-200">101</td>
                          <td className="p-1 text-center font-bold text-indigo-700">Room 201-205</td>
                        </tr>
                        <tr>
                          <td className="p-1 font-bold border-r border-slate-200">2026-11-23 (Sun)</td>
                          <td className="p-1 font-medium border-r border-slate-200">Bangla 2nd Paper</td>
                          <td className="p-1 text-center font-mono border-r border-slate-200">102</td>
                          <td className="p-1 text-center font-bold text-indigo-700">Room 201-205</td>
                        </tr>
                        <tr>
                          <td className="p-1 font-bold border-r border-slate-200">2026-11-26 (Wed)</td>
                          <td className="p-1 font-medium border-r border-slate-200">English 1st Paper</td>
                          <td className="p-1 text-center font-mono border-r border-slate-200">107</td>
                          <td className="p-1 text-center font-bold text-indigo-700">Room 201-205</td>
                        </tr>
                        <tr>
                          <td className="p-1 font-bold border-r border-slate-200">2026-11-30 (Sun)</td>
                          <td className="p-1 font-medium border-r border-slate-200">General Mathematics</td>
                          <td className="p-1 text-center font-mono border-r border-slate-200">109</td>
                          <td className="p-1 text-center font-bold text-indigo-700">Room 201-205</td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="border-t border-slate-200 pt-1.5 flex justify-between items-center text-[9px]">
                      <span className="text-slate-500 font-medium">
                        Admit Card & ID mandatory in examination hall
                      </span>
                      <div className="text-center">
                        <div className="w-16 border-b border-slate-400 mb-0.5"></div>
                        <span className="text-[8px] font-bold text-slate-700">Exam Controller</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: MEDICAL RECEIPTS */}
                {heroActiveTab === "medical-receipt" && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-start border-b-2 border-rose-600 pb-2">
                      <div>
                        <h3 className="font-black text-sm sm:text-base text-rose-950 uppercase tracking-tight">
                          CARE DIAGNOSTIC & SPECIALIST CENTER
                        </h3>
                        <p className="text-slate-500 text-[10px] font-medium">Modern Pathology, Imaging & Pharmacy</p>
                      </div>
                      <div className="text-right">
                        <span className="bg-rose-600 text-white font-black text-[9px] px-2 py-0.5 rounded">
                          MONEY RECEIPT
                        </span>
                        <p className="text-slate-600 font-bold text-[10px] mt-0.5">BILL-2026-904</p>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl flex justify-between text-[9px]">
                      <div>
                        <span><strong>Pt:</strong> Md. Rafiqul Islam (48y / Male)</span>
                        <span className="block text-slate-500">Ref: Dr. Farhana Yasmin, MBBS, FCPS</span>
                      </div>
                      <div className="text-right">
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">Report: Today 6:00 PM</span>
                      </div>
                    </div>

                    <table className="w-full text-[9px] border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 uppercase text-[8px] font-bold">
                          <th className="text-left py-0.5">Investigation / Test Name</th>
                          <th className="text-right py-0.5">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="py-1 font-medium">1. Complete Blood Count (CBC) with ESR</td>
                          <td className="text-right font-bold">৳ 450</td>
                        </tr>
                        <tr>
                          <td className="py-1 font-medium">2. Ultrasonography of Whole Abdomen (USG)</td>
                          <td className="text-right font-bold">৳ 1,500</td>
                        </tr>
                        <tr>
                          <td className="py-1 font-medium">3. Serum Creatinine & Fasting Blood Sugar</td>
                          <td className="text-right font-bold">৳ 650</td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="border-t-2 border-slate-900 pt-1.5 flex justify-between items-end text-[10px]">
                      <div>
                        <span className="text-slate-400 text-[9px] block">Advance Paid: ৳ 1,600</span>
                        <span className="font-black text-rose-700 text-xs sm:text-sm">Balance Due: ৳ 1,000</span>
                      </div>
                      <div className="text-center">
                        <div className="w-16 border-b border-slate-400 mb-0.5"></div>
                        <span className="text-[8px] font-bold text-slate-600">Cashier Stamp & Sign</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Hero Studio Control Cards */}
              <div className="w-full lg:w-2/5 space-y-4 text-left">
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Live Document Studio
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug">
                    {heroActiveTab === "receipts"
                      ? lang === "bn"
                        ? "ক্যাশ মেমো ও কমার্শিয়াল ইনভয়েস"
                        : "Worldwide Invoices & Cash Memos"
                      : heroActiveTab === "class-routine"
                      ? lang === "bn"
                        ? "স্কুল ও কলেজ ক্লাস রুটিন"
                        : "School & College Class Routines"
                      : heroActiveTab === "exam-routine"
                      ? lang === "bn"
                        ? "বার্ষিক ও বোর্ড পরীক্ষার সময়সূচি"
                        : "Term Final & Board Exam Schedules"
                      : lang === "bn"
                      ? "ক্লিনিক ও ডায়াগনস্টিক টেস্ট রসিদ"
                      : "Medical & Diagnostic Receipts"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {heroActiveTab === "receipts"
                      ? lang === "bn"
                        ? "পণ্য এবং কাস্টমারের নাম লিখুন বা মুখে বলুন, অটোমেটিক ট্যাক্স ও টাকায় কথায় কনভার্ট হয়ে সাথে সাথে প্রিন্ট ও PDF হবে।"
                        : "Enter items and customer info or voice-type. Calculations, tax & currency words are auto-generated for instant PDF download."
                      : heroActiveTab === "class-routine"
                      ? lang === "bn"
                        ? "সাপ্তাহিক পিরিয়ড, বিষয়ের নাম ও শিক্ষকের কোড সহজে সাজান। প্রিন্টেবল A4 কালার ও ক্লিন ফরম্যাট।"
                        : "Easily schedule weekly periods, subject codes and teacher initials. High-resolution print-ready A4 timetable."
                      : heroActiveTab === "exam-routine"
                      ? lang === "bn"
                        ? "পরীক্ষার তারিখ, সময়, শিফট এবং রুম নম্বর বসিয়ে সরাসরি প্রিন্ট করুন অথবা নোটিশ বোর্ডে টাঙিয়ে দিন।"
                        : "Organize dates, morning/afternoon shifts, codes & hall allocations. Ready for notice boards and student handouts."
                      : lang === "bn"
                      ? "রোগীর তথ্য, টেস্ট চার্জ ও বাকি টাকার হিসাব সহ অফিশিয়াল সিলযুক্ত ক্লিনিক্যাল রসিদ।"
                      : "Complete diagnostic billing with advance/due breakdown, sample timings, and official cashier seal."}
                  </p>
                </div>

                {/* Feature Chips */}
                <div className="space-y-2 pt-1 text-xs">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
                      <Download className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {lang === "bn"
                        ? "১-ক্লিকে সরাসরি ভেক্টর PDF ডাউনলোড (ওয়াটারমার্ক ছাড়া)"
                        : "1-Click Direct Vector PDF (Zero Watermark)"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                    <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center shrink-0">
                      <Printer className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {lang === "bn"
                        ? "A4 ও ৮০মিমি থার্মাল POS দুই সাইজেই প্রিন্ট উপযোগী"
                        : "A4 sheet & 80mm POS thermal roll supported"}
                    </span>
                  </div>
                </div>

                {/* CTA Link to exact editor */}
                <div className="pt-2">
                  <Link
                    href={
                      heroActiveTab === "class-routine"
                        ? "/templates/school-class-routine"
                        : heroActiveTab === "exam-routine"
                        ? "/templates/school-exam-routine"
                        : heroActiveTab === "medical-receipt"
                        ? "/templates/medical-money-receipt"
                        : "/templates/f-commerce-invoice"
                    }
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 px-5 rounded-xl shadow-md transition text-xs sm:text-sm cursor-pointer"
                  >
                    <span>
                      {lang === "bn"
                        ? "এই টেমপ্লেটটি এডিট ও ডাউনলোড করুন"
                        : "Customize & Download This Template"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ZERO-FRICTION VALUE PROPOSITION (Why Visitors Never Leave) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs text-center space-y-1.5 hover:border-blue-300 transition">
            <div className="w-9 h-9 mx-auto rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
              {lang === "bn" ? "১০০% আজীবন ফ্রি" : "100% Free Forever"}
            </h4>
            <p className="text-[11px] text-slate-500 leading-tight">
              {lang === "bn" ? "কোনো হিডেন ফি বা চার্জ নেই" : "No subscriptions or paywalls"}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs text-center space-y-1.5 hover:border-blue-300 transition">
            <div className="w-9 h-9 mx-auto rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
              {lang === "bn" ? "সাইন-আপ ছাড়া ডাউনলোড" : "No Signup Required"}
            </h4>
            <p className="text-[11px] text-slate-500 leading-tight">
              {lang === "bn" ? "মুহূর্তেই ১-ক্লিক ভেক্টর PDF" : "Download PDF straight away"}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs text-center space-y-1.5 hover:border-blue-300 transition">
            <div className="w-9 h-9 mx-auto rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold">
              <Building className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
              {lang === "bn" ? "বাংলা ও ইংরেজি" : "Bengali & English"}
            </h4>
            <p className="text-[11px] text-slate-500 leading-tight">
              {lang === "bn" ? "টাকায় কথায় কনভার্ট সুবিধা" : "Authentic dual-locale parity"}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs text-center space-y-1.5 hover:border-blue-300 transition">
            <div className="w-9 h-9 mx-auto rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold">
              <Download className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
              {lang === "bn" ? "১-ক্লিক ভেক্টর PDF" : "1-Click Direct PDF"}
            </h4>
            <p className="text-[11px] text-slate-500 leading-tight">
              {lang === "bn" ? "৩০০ ডিপিআই ক্রিস্প প্রিন্ট" : "Ultra-crisp 300 DPI vector output"}
            </p>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs text-center space-y-1.5 hover:border-blue-300 transition">
            <div className="w-9 h-9 mx-auto rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center font-bold">
              <Printer className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
              {lang === "bn" ? "A4 ও ৮০মিমি থার্মাল" : "A4 & 80mm Thermal"}
            </h4>
            <p className="text-[11px] text-slate-500 leading-tight">
              {lang === "bn" ? "সকল প্রিন্টারে মানানসই" : "Office & POS receipt printers"}
            </p>
          </div>
        </div>
      </section>

      {/* 4. HIGH-VISIBILITY PILLAR QUICK-ACCESS FILTER PILLS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
        <div className="bg-white dark:bg-slate-900 p-2 sm:p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
          <Link
            href="/templates?category=receipts"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-700 dark:text-slate-200 hover:text-blue-600 transition shrink-0"
          >
            <Receipt className="w-4 h-4 text-emerald-600" />
            <span>{lang === "bn" ? "ক্যাশ মেমো ও ইনভয়েস (10+)" : "Worldwide Receipts (10+)"}</span>
          </Link>

          <Link
            href="/templates?category=class-routines"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-700 dark:text-slate-200 hover:text-blue-600 transition shrink-0"
          >
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>{lang === "bn" ? "ক্লাস রুটিন (10+)" : "Class Routines (10+)"}</span>
          </Link>

          <Link
            href="/templates?category=exam-routines"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-700 dark:text-slate-200 hover:text-blue-600 transition shrink-0"
          >
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span>{lang === "bn" ? "পরীক্ষার রুটিন (10+)" : "Exam Routines (10+)"}</span>
          </Link>

          <Link
            href="/templates?category=medical-receipts"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-700 dark:text-slate-200 hover:text-blue-600 transition shrink-0"
          >
            <Stethoscope className="w-4 h-4 text-rose-600" />
            <span>{lang === "bn" ? "ক্লিনিক ও ডায়াগনস্টিক রসিদ (10+)" : "Medical Receipts (10+)"}</span>
          </Link>

          <Link
            href="/templates"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition shrink-0 shadow-2xs"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{lang === "bn" ? "সকল ৪০+ টেমপ্লেট" : "All 40+ Templates"}</span>
          </Link>
        </div>
      </section>

      {/* 5. PILLAR BENTO SHOWCASE: WORLDWIDE RECEIPTS & COMMERCIAL INVOICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
              Pillar 1 • Invoicing & Commercial Billing
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              {lang === "bn" ? "বিশ্বমানের ক্যাশ মেমো ও ইনভয়েস (১০+)" : "Worldwide Receipts & Commercial Invoices (10+)"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {lang === "bn"
                ? "ফেসবুক শপ, রেস্তোরাঁ ৮০মিমি থার্মাল পিওএস, চালান, ভ্যাট ট্যাক্স ও সুপারশপ রসিদ।"
                : "F-commerce retail, 80mm thermal restaurant bills, delivery slips, and corporate VAT invoices."}
            </p>
          </div>
          <Link
            href="/templates?category=receipts"
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline mt-2 sm:mt-0 flex items-center gap-1"
          >
            {lang === "bn" ? "সব রসিদ ফরম্যাট দেখুন" : "View All 10+ Receipts"} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {receiptTemplates.map((tmpl) => (
            <div
              key={tmpl.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs hover:shadow-xl hover:-translate-y-1 transition duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="mb-3">
                  <TemplateCardPreview template={tmpl} lang={lang} />
                </div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                    {tmpl.paperSize === "POS_80MM" ? "80mm POS" : "A4 Sheet"}
                  </span>
                  {tmpl.badge && (
                    <span className="text-[9px] font-bold text-amber-700 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-full">
                      {tmpl.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition leading-snug">
                  {lang === "bn" && tmpl.locales?.bn?.title ? tmpl.locales.bn.title : tmpl.title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {lang === "bn" && tmpl.locales?.bn?.description ? tmpl.locales.bn.description : tmpl.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-medium">100% Free</span>
                <Link
                  href={`/templates/${tmpl.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl transition shadow-xs"
                >
                  <Printer className="w-3 h-3" />
                  <span>{lang === "bn" ? "প্রিন্ট করুন" : "Print Free"}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. PILLAR BENTO SHOWCASE: CLASS ROUTINES & ACADEMIC TIMETABLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
              Pillar 2 • Timetables & Class Schedules
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              {lang === "bn" ? "ক্লাস রুটিন ও সাপ্তাহিক সময়সূচি (১০+)" : "Class Routines & Academic Timetables (10+)"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {lang === "bn"
                ? "স্কুল, কলেজ, বিশ্ববিদ্যালয় সেমিস্টার, মাদ্রাসা ও কোচিং সেন্টারের জন্য পূর্ণাঙ্গ সাপ্তাহিক পিরিয়ড রুটিন।"
                : "Primary, high school master, university semester credit, madrasah and coaching center schedules."}
            </p>
          </div>
          <Link
            href="/templates?category=class-routines"
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline mt-2 sm:mt-0 flex items-center gap-1"
          >
            {lang === "bn" ? "সব ক্লাস রুটিন দেখুন" : "View All 10+ Routines"} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {classRoutineTemplates.map((tmpl) => (
            <div
              key={tmpl.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs hover:shadow-xl hover:-translate-y-1 transition duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="mb-3">
                  <TemplateCardPreview template={tmpl} lang={lang} />
                </div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                    A4 Printable
                  </span>
                  {tmpl.badge && (
                    <span className="text-[9px] font-bold text-blue-700 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full">
                      {tmpl.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition leading-snug">
                  {lang === "bn" && tmpl.locales?.bn?.title ? tmpl.locales.bn.title : tmpl.title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {lang === "bn" && tmpl.locales?.bn?.description ? tmpl.locales.bn.description : tmpl.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-medium">Bilingual EN + BN</span>
                <Link
                  href={`/templates/${tmpl.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl transition shadow-xs"
                >
                  <Calendar className="w-3 h-3" />
                  <span>{lang === "bn" ? "রুটিন বানান" : "Make Routine"}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. PILLAR BENTO SHOWCASE: EXAMINATION ROUTINES & SCHEDULES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
              Pillar 3 • Exam Schedules & Shifts
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              {lang === "bn" ? "পরীক্ষার রুটিন ও পরীক্ষার সময়সূচি (১০+)" : "Examination Routines & Schedules (10+)"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {lang === "bn"
                ? "টার্ম ফাইনাল, বোর্ড পরীক্ষা, বিশ্ববিদ্যালয় মিডটার্ম ও মডেল টেস্ট পরীক্ষার পূর্ণাঙ্গ শিফট সূচি।"
                : "Annual term finals, secondary board exams, university midterms, and mock test routines."}
            </p>
          </div>
          <Link
            href="/templates?category=exam-routines"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline mt-2 sm:mt-0 flex items-center gap-1"
          >
            {lang === "bn" ? "সব পরীক্ষার রুটিন দেখুন" : "View All 10+ Exam Routines"} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {examRoutineTemplates.map((tmpl) => (
            <div
              key={tmpl.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs hover:shadow-xl hover:-translate-y-1 transition duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="mb-3">
                  <TemplateCardPreview template={tmpl} lang={lang} />
                </div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                    Exam Schedule
                  </span>
                  {tmpl.badge && (
                    <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-full">
                      {tmpl.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition leading-snug">
                  {lang === "bn" && tmpl.locales?.bn?.title ? tmpl.locales.bn.title : tmpl.title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {lang === "bn" && tmpl.locales?.bn?.description ? tmpl.locales.bn.description : tmpl.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-medium">Shifts & Hall Info</span>
                <Link
                  href={`/templates/${tmpl.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl transition shadow-xs"
                >
                  <GraduationCap className="w-3 h-3" />
                  <span>{lang === "bn" ? "পরীক্ষার রুটিন" : "Exam Schedule"}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. PILLAR BENTO SHOWCASE: MEDICAL & CLINIC RECEIPTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded">
              Pillar 4 • Healthcare & Clinical Billing
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              {lang === "bn" ? "চিকিৎসা ও ডায়াগনস্টিক রসিদ (১০+)" : "Medical & Clinic Receipts (10+)"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {lang === "bn"
                ? "ডায়াগনস্টিক প্যাথলজি টেস্ট বিল, হাসপাতাল ভর্তি স্লিপ, ফার্মেসি ক্যাশ মেমো ও প্রেসক্রিপশন প্যাড।"
                : "Diagnostic pathology bills, hospital admission slips, retail medicine memos, and doctor Rx pads."}
            </p>
          </div>
          <Link
            href="/templates?category=medical-receipts"
            className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline mt-2 sm:mt-0 flex items-center gap-1"
          >
            {lang === "bn" ? "সব চিকিৎসা রসিদ দেখুন" : "View All 10+ Medical Receipts"} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {medicalReceiptTemplates.map((tmpl) => (
            <div
              key={tmpl.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs hover:shadow-xl hover:-translate-y-1 transition duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="mb-3">
                  <TemplateCardPreview template={tmpl} lang={lang} />
                </div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-rose-700 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded">
                    Clinical Format
                  </span>
                  {tmpl.badge && (
                    <span className="text-[9px] font-bold text-rose-700 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded-full">
                      {tmpl.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-rose-600 transition leading-snug">
                  {lang === "bn" && tmpl.locales?.bn?.title ? tmpl.locales.bn.title : tmpl.title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {lang === "bn" && tmpl.locales?.bn?.description ? tmpl.locales.bn.description : tmpl.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-medium">Doctor & Clinic</span>
                <Link
                  href={`/templates/${tmpl.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-xl transition shadow-xs"
                >
                  <Stethoscope className="w-3 h-3" />
                  <span>{lang === "bn" ? "রসিদ তৈরি" : "Create Bill"}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MID-PAGE AD UNIT */}
      <div className="max-w-7xl mx-auto px-4 w-full my-6">
        <AdSenseSlot slotId="home-mid-content-ad" format="horizontal" label="Advertisement" />
      </div>

      {/* 9. WHY STAY HERE? (FREEDOCFORGE VS WORD/EXCEL/PAID APPS) COMPARISON */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {lang === "bn" ? "তুলনামূলক বিশ্লেষণ" : "Why Choose Us"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            {lang === "bn" ? "কেন Word বা Excel এর চেয়ে FreeDocForge ১০ গুণ দ্রুত?" : "Why FreeDocForge Outperforms Word & Excel"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {lang === "bn"
              ? "ভাঙা মার্জিন ও জটিল হিসাবের দিন শেষ। ৩০ সেকেন্ডে রেডিমেড প্রফেশনাল প্রিন্ট।"
              : "No more broken table borders, missing Bengali fonts, or manual math errors."}
          </p>
        </div>

        <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
                <th className="p-4 sm:p-5 font-bold text-slate-500">Feature</th>
                <th className="p-4 sm:p-5 font-black text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/40">
                  ✨ FreeDocForge.com
                </th>
                <th className="p-4 sm:p-5 font-semibold text-slate-500">Microsoft Word</th>
                <th className="p-4 sm:p-5 font-semibold text-slate-500">Excel Spreadsheets</th>
                <th className="p-4 sm:p-5 font-semibold text-slate-500">Paid Invoicing Apps</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr>
                <td className="p-4 font-bold text-slate-900 dark:text-white">Price & Subscription</td>
                <td className="p-4 font-black text-emerald-600 bg-blue-50/20 dark:bg-blue-950/20">
                  100% Free Forever
                </td>
                <td className="p-4 text-slate-500">$9.99/mo (Office 365)</td>
                <td className="p-4 text-slate-500">$9.99/mo</td>
                <td className="p-4 text-rose-500 font-semibold">$15 - $30 / month</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-900 dark:text-white">Signup / Registration</td>
                <td className="p-4 font-black text-emerald-600 bg-blue-50/20 dark:bg-blue-950/20">
                  Zero Signup Needed
                </td>
                <td className="p-4 text-slate-500">Account Required</td>
                <td className="p-4 text-slate-500">Account Required</td>
                <td className="p-4 text-rose-500 font-semibold">Mandatory Signup</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-900 dark:text-white">1-Click Direct Vector PDF</td>
                <td className="p-4 font-black text-emerald-600 bg-blue-50/20 dark:bg-blue-950/20">
                  Instant Direct Download
                </td>
                <td className="p-4 text-slate-500">Multi-step Save As</td>
                <td className="p-4 text-slate-500">Print area headaches</td>
                <td className="p-4 text-slate-500">Email attachment only</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-900 dark:text-white">80mm POS Thermal Support</td>
                <td className="p-4 font-black text-emerald-600 bg-blue-50/20 dark:bg-blue-950/20">
                  Dedicated 80mm Layouts
                </td>
                <td className="p-4 text-rose-500 font-semibold">Not Supported</td>
                <td className="p-4 text-rose-500 font-semibold">Not Supported</td>
                <td className="p-4 text-slate-500">Requires Extra Hardware</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-900 dark:text-white">Automatic Bengali Words Conversion</td>
                <td className="p-4 font-black text-emerald-600 bg-blue-50/20 dark:bg-blue-950/20">
                  Auto (টাকা কথায় রূপান্তর)
                </td>
                <td className="p-4 text-rose-500 font-semibold">Manual Typing</td>
                <td className="p-4 text-rose-500 font-semibold">Complex VBA Macro</td>
                <td className="p-4 text-rose-500 font-semibold">English Only</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 10. SOCIAL PROOF & TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
              "আমি মিরপুরে একটি ফেসবুক বুটিক শপ চালাই। প্রতিদিন ৫০+ ক্যাশ মেমো প্রিন্ট করি। আগে ওয়ার্ডে করতে গিয়ে ফরম্যাটিং ভেঙে যেত, এখন ৩০ সেকেন্ডে মেমো রেডি!"
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-slate-900 dark:text-white block">মোঃ তানভীর আহমেদ</span>
                <span className="text-[10px] text-slate-400">Stylist Fashion BD, ঢাকা</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                Verified Seller
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
              "আমাদের স্কুলের ক্লাস রুটিন ও পরীক্ষার সূচি তৈরি করতে শিক্ষকদের পুরো দিন লেগে যেত। FreeDocForge এর রুটিন টেমপ্লেট দিয়ে নিমিষেই সুন্দর কালার প্রিন্ট পাওয়া যায়।"
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-slate-900 dark:text-white block">কে. রহমান</span>
                <span className="text-[10px] text-slate-400">প্রধান শিক্ষক, আইডিয়াল একাডেমি</span>
              </div>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                School Principal
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
              "ক্লিনিক ও ডায়াগনস্টিক টেস্টের মানি রিসিট এবং সিরিয়াল টোকেন খুব সহজেই বের করা যায়। কোনো সাইন-আপের ঝামেলা নেই। খুবই দরকারি একটি ওয়েবসাইট।"
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-slate-900 dark:text-white block">ডাঃ এস. আহমেদ</span>
                <span className="text-[10px] text-slate-400">কেয়ার ডায়াগনস্টিক সেন্টার, সিলেট</span>
              </div>
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded">
                Clinic Admin
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 11. REDESIGNED ULTRA-PREMIUM SAAS CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12 w-full">
        <div className="relative overflow-hidden rounded-3xl sm:rounded-4xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-8 sm:p-12 lg:p-16 border border-indigo-500/20 shadow-2xl">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{lang === "bn" ? "আজীবন ১০০% ফ্রি প্রিন্ট স্টুডিও" : "100% Free Forever Printable Studio"}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
                {lang === "bn"
                  ? "দোকানের লোগো, ঠিকানা ও সিল একবার সেভ রাখুন"
                  : "Save Your Shop Preset Once & Print in 1-Click"}
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm lg:text-base leading-relaxed max-w-xl">
                {lang === "bn"
                  ? "প্রতিবার বারবার দোকানের নাম ও ফোন নম্বর টাইপ করার দিন শেষ। একটি ফ্রি অ্যাকাউন্ট বানিয়ে শপ প্রিসেট সেভ করে রাখুন। কাস্টমার অর্ডার করলেই ১ ক্লিকে মেমো প্রিন্ট করুন!"
                  : "Stop retyping your address, phone, and terms. Save your shop preset for automatic 1-click auto-filling every time."}
              </p>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-wrap items-center gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg transition text-xs sm:text-sm"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{lang === "bn" ? "ফ্রি অ্যাকাউন্ট তৈরি করুন" : "Create Free Account"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/templates"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-bold px-5 py-3.5 rounded-xl border border-white/20 transition text-xs sm:text-sm"
                >
                  <span>{lang === "bn" ? "সকল টেমপ্লেট দেখুন" : "Browse All Templates"}</span>
                </Link>
              </div>
            </div>

            {/* Right Visual Floating Badges */}
            <div className="lg:col-span-5 space-y-3">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 flex items-center justify-between shadow-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-white block">Stylist Fashion BD</span>
                    <span className="text-[10px] text-slate-300">F-Commerce Memo Preset</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Auto-Fill Active
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 flex items-center justify-between shadow-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-white block">Dhaka Ideal Model School</span>
                    <span className="text-[10px] text-slate-300">Academic Marksheet & Routine</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                  Auto-Fill Active
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 flex items-center justify-between shadow-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-white block">Dr. Farhana Yasmin, MBBS</span>
                    <span className="text-[10px] text-slate-300">Doctor Prescription Pad (Rx)</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
                  Auto-Fill Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
