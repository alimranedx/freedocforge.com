"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdSenseSlot from "@/components/AdSenseSlot";
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
} from "lucide-react";
import { useGlobalSettings } from "@/context/GlobalSettingsContext";

export default function TemplatesCatalogPage() {
  const { lang, t } = useGlobalSettings();
  const [selectedCategory, setSelectedCategory] = useState<"all" | "shop" | "school" | "medical">("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Category Configuration
  const categoryTabs = [
    {
      id: "all",
      label: lang === "bn" ? "সকল টেমপ্লেট" : "All Templates",
      count: INITIAL_TEMPLATES.length,
      icon: Layers,
    },
    {
      id: "shop",
      label: lang === "bn" ? "দোকান ও ব্যবসা" : "Shop & Business",
      count: INITIAL_TEMPLATES.filter((t) => t.category === "Business" || t.category === "Restaurant").length,
      icon: ShoppingBag,
    },
    {
      id: "school",
      label: lang === "bn" ? "স্কুল ও শিক্ষা" : "School & Education",
      count: INITIAL_TEMPLATES.filter((t) => t.category === "Education").length,
      icon: GraduationCap,
    },
    {
      id: "medical",
      label: lang === "bn" ? "চিকিৎসা ও ক্লিনিক" : "Medical & Healthcare",
      count: INITIAL_TEMPLATES.filter((t) => t.category === "Healthcare").length,
      icon: Stethoscope,
    },
  ];

  // Dynamic Subcategory Pills based on selected Category
  const subCategories = useMemo(() => {
    if (selectedCategory === "shop") {
      return [
        { id: "all", label: lang === "bn" ? "সব শপ ফরম্যাট" : "All Shop Formats" },
        { id: "invoice", label: lang === "bn" ? "ক্যাশ মেমো ও ইনভয়েস" : "Cash Memos & Invoices" },
        { id: "pos", label: lang === "bn" ? "৮০মিমি থার্মাল রসিদ" : "80mm POS Receipts" },
        { id: "chalan", label: lang === "bn" ? "ডেলিভারি চালান" : "Delivery Chalans" },
        { id: "quotation", label: lang === "bn" ? "কোটেশন ও প্রফর্মা" : "Quotations & Estimates" },
        { id: "receipt", label: lang === "bn" ? "ভাড়া ও মানি রিসিট" : "Rent & Money Receipts" },
      ];
    }
    if (selectedCategory === "school") {
      return [
        { id: "all", label: lang === "bn" ? "সব শিক্ষা ফরম্যাট" : "All Academic Formats" },
        { id: "marksheet", label: lang === "bn" ? "মার্কশিট ও প্রগ্রেস কার্ড" : "Marksheets & Progress" },
        { id: "routine", label: lang === "bn" ? "ক্লাস ও পরীক্ষার রুটিন" : "Class & Exam Routines" },
        { id: "admit-card", label: lang === "bn" ? "এডমিট কার্ড ও প্রবেশপত্র" : "Admit Cards & Passes" },
        { id: "certificate", label: lang === "bn" ? "ছাড়পত্র (TC) ও প্রশংসাপত্র" : "Certificates & TC" },
        { id: "fees", label: lang === "bn" ? "টিউশন ফি ভাউচার" : "Fee Collection Slips" },
        { id: "id-card", label: lang === "bn" ? "শিক্ষার্থী পরিচয়পত্র" : "Student ID Cards" },
      ];
    }
    if (selectedCategory === "medical") {
      return [
        { id: "all", label: lang === "bn" ? "সব চিকিৎসা ফরম্যাট" : "All Medical Formats" },
        { id: "prescription", label: lang === "bn" ? "ডাক্তারের প্রেসক্রিপশন (Rx)" : "Doctor Rx Pads" },
        { id: "serial", label: lang === "bn" ? "সিরিয়াল টোকেন ও ভর্তি স্লিপ" : "Serial Tokens & Admission" },
        { id: "discharge", label: lang === "bn" ? "ডিসচার্জ সামারি ও রিপোর্ট" : "Discharge & Reports" },
        { id: "receipt", label: lang === "bn" ? "ডায়াগনস্টিক টেস্ট রসিদ" : "Diagnostic Receipts" },
      ];
    }
    return [];
  }, [selectedCategory, lang]);

  // Filter Templates
  const filteredTemplates = useMemo(() => {
    return INITIAL_TEMPLATES.filter((tmpl) => {
      // 1. Category Filter
      if (selectedCategory === "shop") {
        if (tmpl.category !== "Business" && tmpl.category !== "Restaurant") return false;
      } else if (selectedCategory === "school") {
        if (tmpl.category !== "Education") return false;
      } else if (selectedCategory === "medical") {
        if (tmpl.category !== "Healthcare") return false;
      }

      // 2. Subcategory Filter
      if (selectedSubCategory !== "all") {
        if (tmpl.subCategory !== selectedSubCategory) return false;
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
  }, [selectedCategory, selectedSubCategory, searchQuery]);

  // Category change helper
  const handleSelectCategory = (catId: "all" | "shop" | "school" | "medical") => {
    setSelectedCategory(catId);
    setSelectedSubCategory("all");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Header Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3 border border-blue-200 dark:border-blue-900">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>
              {lang === "bn"
                ? "৩০+ রেডিমেড স্মার্ট প্রিন্ট ফরম্যাট"
                : "30+ Ready-to-Print Smart Templates"}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {lang === "bn" ? "ফ্রি ডকুমেন্ট টেমপ্লেট গ্যালারি" : "Explore Free Printable Templates"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl mx-auto">
            {lang === "bn"
              ? "দোকানের মেমো, স্কুলের মার্কশিট ও ডাক্তারের প্রেসক্রিপশন সহজে সিলেক্ট করুন, তথ্য লিখুন বা মুখে বলুন এবং ওয়াটারমার্ক ছাড়াই ফ্রি ডাউনলোড করুন।"
              : "Select any format below to customize details via keyboard or voice typing, add your brand logo, and download a watermark-free PDF instantly."}
          </p>
        </div>

        {/* Top AdSense Banner */}
        <AdSenseSlot slotId="catalog-header-banner" format="horizontal" />

        {/* CONTROLS: Category Tabs & Search Bar */}
        <div className="my-8 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Category Switcher Tabs */}
            <div className="inline-flex flex-wrap p-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs gap-1">
              {categoryTabs.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = selectedCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleSelectCategory(tab.id as any)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                      isActive
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
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

            {/* Live Instant Search Bar */}
            <div className="relative min-w-[260px] sm:min-w-[320px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={
                  lang === "bn"
                    ? "টেমপ্লেট খুঁজুন (যেমন: মেমো, প্রেসক্রিপশন, রুটিন)..."
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

          {/* Subcategory Filter Pills (Shown when a specific Category is active) */}
          {subCategories.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1 pr-1 shrink-0">
                <Filter className="w-3.5 h-3.5" />
                <span>{lang === "bn" ? "ধরন:" : "Subtype:"}</span>
              </span>
              {subCategories.map((sub) => {
                const isSubActive = selectedSubCategory === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubCategory(sub.id)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg shrink-0 transition cursor-pointer ${
                      isSubActive
                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs"
                        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {sub.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Results Count & Current Active Filters Summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4">
          <p>
            {lang === "bn" ? "প্রদর্শিত টেমপ্লেট:" : "Showing"}{" "}
            <strong className="text-slate-900 dark:text-white font-bold">{filteredTemplates.length}</strong>{" "}
            {lang === "bn" ? "টি" : "templates"}
          </p>
          {(selectedCategory !== "all" || selectedSubCategory !== "all" || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSelectedSubCategory("all");
                setSearchQuery("");
              }}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
            >
              {lang === "bn" ? "ফিল্টার ক্লিয়ার করুন" : "Reset Filters"}
            </button>
          )}
        </div>

        {/* Templates Grid (30 Distinct Beautiful Cards) */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
            {filteredTemplates.map((tmpl) => {
              const isShop = tmpl.category === "Business" || tmpl.category === "Restaurant";
              const isSchool = tmpl.category === "Education";
              const isMedical = tmpl.category === "Healthcare";

              const categoryBadgeColor = isShop
                ? "bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                : isSchool
                ? "bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                : "bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800";

              const localizedTitle = lang === "bn" && tmpl.locales?.bn?.title ? tmpl.locales.bn.title : tmpl.title;
              const localizedDesc = lang === "bn" && tmpl.locales?.bn?.description ? tmpl.locales.bn.description : tmpl.description;
              const localizedBadge = lang === "bn" && tmpl.locales?.bn?.badge ? tmpl.locales.bn.badge : tmpl.badge;

              return (
                <div
                  key={tmpl.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs hover:shadow-lg hover:-translate-y-1 transition duration-200 flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between mb-3.5">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border flex items-center gap-1 ${categoryBadgeColor}`}
                      >
                        {isShop && <ShoppingBag className="w-3 h-3" />}
                        {isSchool && <GraduationCap className="w-3 h-3" />}
                        {isMedical && <Stethoscope className="w-3 h-3" />}
                        <span>
                          {isShop
                            ? lang === "bn" ? "দোকান ও ব্যবসা" : "Shop / Commerce"
                            : isSchool
                            ? lang === "bn" ? "স্কুল ও শিক্ষা" : "Education"
                            : lang === "bn" ? "চিকিৎসা ও ক্লিনিক" : "Medical / Clinic"}
                        </span>
                      </span>

                      {localizedBadge && (
                        <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-900">
                          {localizedBadge}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-snug">
                      {localizedTitle}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed line-clamp-3">
                      {localizedDesc}
                    </p>

                    {/* Design Style Pill */}
                    {tmpl.designStyle && (
                      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                        <span>Style: {tmpl.designStyle}</span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {tmpl.paperSize === "POS_80MM" ? "৮০মিমি POS" : "A4 সাইজ"}
                    </span>
                    <Link
                      href={`/templates/${tmpl.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition shadow-xs hover:shadow-md cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>{lang === "bn" ? "কাস্টমাইজ ও প্রিন্ট" : "Edit & Print"}</span>
                    </Link>
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
                setSelectedSubCategory("all");
                setSearchQuery("");
              }}
              className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-4 py-2 rounded-xl"
            >
              {lang === "bn" ? "সবগুলো টেমপ্লেট দেখুন" : "View All Templates"}
            </button>
          </div>
        )}

        {/* Bottom AdSense Banner */}
        <AdSenseSlot slotId="catalog-bottom-banner" format="horizontal" />
      </main>

      <Footer />
    </div>
  );
}
