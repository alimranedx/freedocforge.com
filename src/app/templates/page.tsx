"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdSenseSlot from "@/components/AdSenseSlot";
import TemplateCardPreview from "@/components/TemplateCardPreview";
import JsonLd from "@/components/JsonLd";
import { getBreadcrumbListSchema, SITE_URL } from "@/lib/seo";
import { INITIAL_TEMPLATES, TemplateDefinition } from "@/lib/templates";
import {
  Printer,
  Search,
  ShoppingBag,
  GraduationCap,
  Stethoscope,
  Filter,
  Sparkles,
  Layers,
  CheckCircle2,
  Eye,
  X,
  Receipt,
  Calendar,
  FileText,
  Download,
  Building,
  Check,
} from "lucide-react";
import { useGlobalSettings } from "@/context/GlobalSettingsContext";

// Helper functions for pillar categorization
function isReceiptTemplate(t: TemplateDefinition): boolean {
  return (
    t.category === "Business" ||
    t.category === "Restaurant" ||
    t.subCategory === "invoice" ||
    t.subCategory === "pos" ||
    t.subCategory === "chalan" ||
    t.subCategory === "quotation" ||
    t.subCategory === "receipt" ||
    t.slug.includes("invoice") ||
    t.slug.includes("receipt") ||
    t.slug.includes("bill") ||
    t.slug.includes("memo") ||
    t.slug.includes("chalan") ||
    t.slug.includes("quotation")
  );
}

function isClassRoutineTemplate(t: TemplateDefinition): boolean {
  return (
    (t.category === "Education" ||
      t.subCategory === "routine" ||
      t.slug.includes("routine") ||
      t.slug.includes("timetable")) &&
    !t.slug.includes("exam") &&
    !t.slug.includes("marksheet") &&
    !t.slug.includes("progress") &&
    !t.slug.includes("admit") &&
    !t.slug.includes("certificate") &&
    !t.slug.includes("id-card") &&
    !t.slug.includes("fee")
  );
}

function isExamRoutineTemplate(t: TemplateDefinition): boolean {
  return (
    t.slug.includes("exam") ||
    t.slug.includes("test-schedule") ||
    t.slug.includes("invigilation") ||
    t.slug.includes("revision-planner") ||
    t.slug === "school-exam-routine"
  );
}

function isMedicalReceiptTemplate(t: TemplateDefinition): boolean {
  return (
    (t.category === "Healthcare" ||
      t.slug.includes("medical") ||
      t.slug.includes("hospital") ||
      t.slug.includes("clinic") ||
      t.slug.includes("pharmacy")) &&
    (t.subCategory === "receipt" ||
      t.slug.includes("receipt") ||
      t.slug.includes("bill") ||
      t.slug.includes("admission") ||
      t.slug.includes("money"))
  );
}

function isAcademicOtherTemplate(t: TemplateDefinition): boolean {
  return t.category === "Education" && !isClassRoutineTemplate(t) && !isExamRoutineTemplate(t);
}

function isMedicalOtherTemplate(t: TemplateDefinition): boolean {
  return t.category === "Healthcare" && !isMedicalReceiptTemplate(t);
}

function CatalogContent() {
  const { lang, t } = useGlobalSettings();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPaperSize, setSelectedPaperSize] = useState<"all" | "A4" | "POS_80MM">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [quickViewTemplate, setQuickViewTemplate] = useState<TemplateDefinition | null>(null);

  // Sync with URL query parameter
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      if (
        [
          "all",
          "receipts",
          "class-routines",
          "exam-routines",
          "medical-receipts",
          "academic-other",
          "medical-other",
        ].includes(cat)
      ) {
        setSelectedCategory(cat);
      }
    }
  }, [searchParams]);

  // Category Configuration
  const categoryTabs = useMemo(
    () => [
      {
        id: "all",
        label: lang === "bn" ? "সকল টেমপ্লেট" : "All Templates",
        count: INITIAL_TEMPLATES.length,
        icon: Layers,
      },
      {
        id: "receipts",
        label: lang === "bn" ? "ক্যাশ মেমো ও ইনভয়েস" : "Worldwide Receipts",
        count: INITIAL_TEMPLATES.filter(isReceiptTemplate).length,
        icon: Receipt,
      },
      {
        id: "class-routines",
        label: lang === "bn" ? "ক্লাস রুটিন" : "Class Routines",
        count: INITIAL_TEMPLATES.filter(isClassRoutineTemplate).length,
        icon: Calendar,
      },
      {
        id: "exam-routines",
        label: lang === "bn" ? "পরীক্ষার রুটিন" : "Exam Routines",
        count: INITIAL_TEMPLATES.filter(isExamRoutineTemplate).length,
        icon: GraduationCap,
      },
      {
        id: "medical-receipts",
        label: lang === "bn" ? "চিকিৎসা ও ডায়াগনস্টিক রসিদ" : "Medical Receipts",
        count: INITIAL_TEMPLATES.filter(isMedicalReceiptTemplate).length,
        icon: Stethoscope,
      },
      {
        id: "academic-other",
        label: lang === "bn" ? "অন্যান্য শিক্ষা ফরম্যাট" : "Other Academic",
        count: INITIAL_TEMPLATES.filter(isAcademicOtherTemplate).length,
        icon: FileText,
      },
      {
        id: "medical-other",
        label: lang === "bn" ? "প্রেসক্রিপশন ও টোকেন" : "Rx & Clinic Slips",
        count: INITIAL_TEMPLATES.filter(isMedicalOtherTemplate).length,
        icon: Building,
      },
    ],
    [lang]
  );

  // Filter Templates
  const filteredTemplates = useMemo(() => {
    return INITIAL_TEMPLATES.filter((tmpl) => {
      // 1. Pillar / Category Filter
      if (selectedCategory === "receipts") {
        if (!isReceiptTemplate(tmpl)) return false;
      } else if (selectedCategory === "class-routines") {
        if (!isClassRoutineTemplate(tmpl)) return false;
      } else if (selectedCategory === "exam-routines") {
        if (!isExamRoutineTemplate(tmpl)) return false;
      } else if (selectedCategory === "medical-receipts") {
        if (!isMedicalReceiptTemplate(tmpl)) return false;
      } else if (selectedCategory === "academic-other") {
        if (!isAcademicOtherTemplate(tmpl)) return false;
      } else if (selectedCategory === "medical-other") {
        if (!isMedicalOtherTemplate(tmpl)) return false;
      }

      // 2. Paper Size Filter
      if (selectedPaperSize !== "all") {
        if (tmpl.paperSize !== selectedPaperSize) return false;
      }

      // 3. Search Query Filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase().trim();
        const matchesEnTitle = tmpl.title.toLowerCase().includes(query);
        const matchesBnTitle = tmpl.locales?.bn?.title.toLowerCase().includes(query);
        const matchesEnDesc = tmpl.description.toLowerCase().includes(query);
        const matchesBnDesc = tmpl.locales?.bn?.description.toLowerCase().includes(query);
        const matchesBadge = tmpl.badge?.toLowerCase().includes(query);
        const matchesSlug = tmpl.slug.toLowerCase().includes(query);

        return (
          matchesEnTitle ||
          matchesBnTitle ||
          matchesEnDesc ||
          matchesBnDesc ||
          matchesBadge ||
          matchesSlug
        );
      }

      return true;
    });
  }, [selectedCategory, selectedPaperSize, searchQuery]);

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Header Title Section */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3 border border-blue-200 dark:border-blue-900 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>
            {lang === "bn"
              ? "৪০+ রেডিমেড স্মার্ট প্রিন্ট ও ডাউনলোড ফরম্যাট"
              : "40+ Ready-to-Print Smart Templates"}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          {lang === "bn" ? "ফ্রি ডকুমেন্ট টেমপ্লেট গ্যালারি" : "Explore Free Printable Templates"}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl mx-auto leading-relaxed">
          {lang === "bn"
            ? "ক্যাশ মেমো, ক্লাস রুটিন, পরীক্ষার সময়সূচি ও ক্লিনিক রসিদ। প্রিভিউ দেখে পছন্দ করুন, তথ্য টাইপ বা মুখে বলুন, এবং ওয়াটারমার্ক ছাড়াই ১-ক্লিকে ভেক্টর PDF ডাউনলোড করুন।"
            : "Invoices, class routines, exam schedules & clinic receipts. Preview visual document snapshots, customize via typing or voice, and download watermark-free PDFs."}
        </p>
      </div>

      {/* Top AdSense Banner */}
      <AdSenseSlot slotId="catalog-header-banner" format="horizontal" />

      {/* CONTROLS: Category Tabs, Paper Size Filter & Search Bar */}
      <div className="my-8 space-y-4">
        {/* Category Switcher Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {categoryTabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    isActive
                      ? "bg-blue-800 text-blue-100"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar & Paper Size Filter Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Paper Size Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1 pr-1 shrink-0">
              <Filter className="w-3.5 h-3.5" />
              <span>{lang === "bn" ? "সাইজ:" : "Paper:"}</span>
            </span>
            {[
              { id: "all", label: lang === "bn" ? "সকল সাইজ" : "All Sizes" },
              { id: "A4", label: lang === "bn" ? "A4 স্ট্যান্ডার্ড" : "A4 Sheet" },
              { id: "POS_80MM", label: lang === "bn" ? "৮০মিমি POS রোল" : "80mm Thermal" },
            ].map((sizeOpt) => {
              const isSizeActive = selectedPaperSize === sizeOpt.id;
              return (
                <button
                  key={sizeOpt.id}
                  onClick={() => setSelectedPaperSize(sizeOpt.id as any)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg shrink-0 transition cursor-pointer ${
                    isSizeActive
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs"
                      : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {sizeOpt.label}
                </button>
              );
            })}
          </div>

          {/* Live Instant Search Bar */}
          <div className="relative min-w-[280px] sm:min-w-[340px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                lang === "bn"
                  ? "টেমপ্লেট খুঁজুন (যেমন: মেমো, রুটিন, পরীক্ষার সূচি, পিওএস)..."
                  : "Search templates by keyword or slug..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Count & Current Active Filters Summary */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4">
        <p>
          {lang === "bn" ? "প্রদর্শিত টেমপ্লেট:" : "Showing"}{" "}
          <strong className="text-slate-900 dark:text-white font-bold">{filteredTemplates.length}</strong>{" "}
          {lang === "bn" ? "টি" : "templates"}
        </p>
        {(selectedCategory !== "all" || selectedPaperSize !== "all" || searchQuery) && (
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSelectedPaperSize("all");
              setSearchQuery("");
            }}
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
          >
            {lang === "bn" ? "ফিল্টার ক্লিয়ার করুন" : "Reset Filters"}
          </button>
        )}
      </div>

      {/* Templates Grid (Distinct Beautiful Cards with Visual Snapshot Mockup) */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 my-6">
          {filteredTemplates.map((tmpl) => {
            const isReceipt = isReceiptTemplate(tmpl);
            const isClassRoutine = isClassRoutineTemplate(tmpl);
            const isExamRoutine = isExamRoutineTemplate(tmpl);
            const isMedicalReceipt = isMedicalReceiptTemplate(tmpl);

            const categoryBadgeColor = isReceipt
              ? "bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
              : isClassRoutine
              ? "bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
              : isExamRoutine
              ? "bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
              : isMedicalReceipt
              ? "bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800"
              : "bg-slate-50 dark:bg-slate-950/70 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800";

            const localizedTitle =
              lang === "bn" && tmpl.locales?.bn?.title ? tmpl.locales.bn.title : tmpl.title;
            const localizedDesc =
              lang === "bn" && tmpl.locales?.bn?.description
                ? tmpl.locales.bn.description
                : tmpl.description;
            const localizedBadge =
              lang === "bn" && tmpl.locales?.bn?.badge ? tmpl.locales.bn.badge : tmpl.badge;

            return (
              <div
                key={tmpl.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-xl hover:-translate-y-1 transition duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* 1. VISUAL TEMPLATE SNAPSHOT / MOCKUP VIEW */}
                  <div className="mb-4">
                    <TemplateCardPreview
                      template={tmpl}
                      lang={lang}
                      onQuickView={(t) => setQuickViewTemplate(t)}
                    />
                  </div>

                  {/* 2. Top Badges */}
                  <div className="flex items-center justify-between mb-2.5">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border flex items-center gap-1 ${categoryBadgeColor}`}
                    >
                      {isReceipt && <Receipt className="w-3 h-3" />}
                      {isClassRoutine && <Calendar className="w-3 h-3" />}
                      {isExamRoutine && <GraduationCap className="w-3 h-3" />}
                      {isMedicalReceipt && <Stethoscope className="w-3 h-3" />}
                      <span>
                        {isReceipt
                          ? lang === "bn"
                            ? "ক্যাশ মেমো / ইনভয়েস"
                            : "Invoice / Receipt"
                          : isClassRoutine
                          ? lang === "bn"
                            ? "ক্লাস রুটিন"
                            : "Class Routine"
                          : isExamRoutine
                          ? lang === "bn"
                            ? "পরীক্ষার রুটিন"
                            : "Exam Routine"
                          : isMedicalReceipt
                          ? lang === "bn"
                            ? "চিকিৎসা রসিদ"
                            : "Medical Receipt"
                          : tmpl.category}
                      </span>
                    </span>

                    {localizedBadge && (
                      <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-900">
                        {localizedBadge}
                      </span>
                    )}
                  </div>

                  {/* 3. Title */}
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-snug">
                    {localizedTitle}
                  </h3>

                  {/* 4. Description */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed line-clamp-2">
                    {localizedDesc}
                  </p>

                  {/* 5. Design Style Pill */}
                  {tmpl.designStyle && (
                    <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                      <span>Style: {tmpl.designStyle}</span>
                    </div>
                  )}
                </div>

                {/* 6. Bottom Action Footer */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md shrink-0">
                    {tmpl.paperSize === "POS_80MM" ? "৮০মিমি POS" : "A4 সাইজ"}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setQuickViewTemplate(tmpl)}
                      className="p-2 rounded-xl text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      title={lang === "bn" ? "বড় করে ডিজাইন দেখুন" : "View Template Preview"}
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <Link
                      href={`/templates/${tmpl.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl transition shadow-xs hover:shadow-md cursor-pointer shrink-0"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>{lang === "bn" ? "এডিট ও প্রিন্ট" : "Edit & Print"}</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 my-8">
          <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            {lang === "bn" ? "কোনো টেমপ্লেট পাওয়া যায়নি" : "No templates matched your filter"}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {lang === "bn"
              ? "অনুগ্রহ করে অন্য কোনো শব্দ অনুসন্ধান করুন অথবা ফিল্টার পরিবর্তন করুন।"
              : "Try adjusting your search query or selecting a different category."}
          </p>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSelectedPaperSize("all");
              setSearchQuery("");
            }}
            className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-4 py-2 rounded-xl cursor-pointer"
          >
            {lang === "bn" ? "সবগুলো টেমপ্লেট দেখুন" : "View All Templates"}
          </button>
        </div>
      )}

      {/* Bottom AdSense Banner */}
      <AdSenseSlot slotId="catalog-bottom-banner" format="horizontal" />

      {/* QUICK VIEW POPUP MODAL */}
      {quickViewTemplate && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                  {quickViewTemplate.category} • {quickViewTemplate.paperSize}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {lang === "bn" && quickViewTemplate.locales?.bn?.title
                    ? quickViewTemplate.locales.bn.title
                    : quickViewTemplate.title}
                </h3>
              </div>
              <button
                onClick={() => setQuickViewTemplate(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Large Snapshot Preview */}
            <div className="p-2 bg-slate-100 dark:bg-slate-950 rounded-2xl flex items-center justify-center">
              <div className="w-full max-w-sm">
                <TemplateCardPreview template={quickViewTemplate} lang={lang} />
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {lang === "bn" && quickViewTemplate.locales?.bn?.description
                ? quickViewTemplate.locales.bn.description
                : quickViewTemplate.description}
            </p>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setQuickViewTemplate(null)}
                className="text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                {lang === "bn" ? "বন্ধ করুন" : "Close"}
              </button>

              <Link
                href={`/templates/${quickViewTemplate.slug}`}
                className="flex items-center gap-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition shadow-xs hover:shadow-md cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{lang === "bn" ? "এডিট ও কাস্টমাইজ করুন" : "Customize & Print"}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function TemplatesCatalogPage() {
  const breadcrumbs = useMemo(
    () =>
      getBreadcrumbListSchema([
        { name: "Home", url: "/" },
        { name: "Templates", url: "/templates" },
      ]),
    []
  );

  const itemListSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Free Printable Document & Invoicing Templates Catalog",
      description:
        "Browse 60+ free printable templates for business invoices, class routines, exam schedules, and medical receipts.",
      numberOfItems: INITIAL_TEMPLATES.length,
      itemListElement: INITIAL_TEMPLATES.slice(0, 30).map((tmpl, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `${tmpl.title} (${tmpl.category})`,
        url: `${SITE_URL}/templates/${tmpl.slug}`,
      })),
    }),
    []
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Schema.org Structured Data */}
      <JsonLd data={breadcrumbs} />
      <JsonLd data={itemListSchema} />

      <Navbar />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center p-20 text-xs text-slate-400">Loading catalog...</div>}>
        <CatalogContent />
      </Suspense>
      <Footer />
    </div>
  );
}
