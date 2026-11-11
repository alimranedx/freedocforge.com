"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdSenseSlot from "@/components/AdSenseSlot";
import { INITIAL_TEMPLATES } from "@/lib/templates";
import { Printer, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { useGlobalSettings } from "@/context/GlobalSettingsContext";

export default function HomePage() {
  const { t } = useGlobalSettings();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      {/* TOP LEADERBOARD ADSENSE UNIT */}
      <div className="max-w-7xl mx-auto px-4 w-full pt-4">
        <AdSenseSlot slotId="home-top-leaderboard" format="horizontal" label="Advertisement" />
      </div>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-12 sm:py-16 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-6 border border-blue-200 dark:border-blue-900">
          <Sparkles className="w-3.5 h-3.5" /> {t("heroBadge")}
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
          {t("heroTitle1")} <br />
          <span className="text-blue-600 dark:text-blue-400">{t("heroTitle2")}</span> {t("heroTitleSuffix")}
        </h1>
        <p className="mt-5 text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {t("heroSubtitle")}
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/templates/f-commerce-invoice"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-xl shadow-md transition text-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" /> {t("heroCta1")}
          </Link>
          <Link
            href="/templates"
            className="flex items-center gap-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold px-6 py-3.5 rounded-xl border border-slate-300 dark:border-slate-800 shadow-xs transition text-sm cursor-pointer"
          >
            {t("heroCta2")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Feature Badges */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-2" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t("featZeroWatermark")}</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{t("featZeroWatermarkDesc")}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
            <Zap className="w-5 h-5 text-amber-500 mb-2" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t("featBdtReady")}</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{t("featBdtReadyDesc")}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
            <Printer className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t("featPaperSizes")}</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{t("featPaperSizesDesc")}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
            <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-2" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t("featFreeForever")}</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{t("featFreeForeverDesc")}</p>
          </div>
        </div>
      </section>

      {/* TEMPLATE SHOWCASE / CATALOG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t("popularTemplates")}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t("popularDesc")}</p>
          </div>
          <Link
            href="/templates"
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline mt-2 sm:mt-0 flex items-center gap-1"
          >
            {t("viewAllCategories")} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INITIAL_TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-md">
                    {tmpl.category}
                  </span>
                  {tmpl.badge && (
                    <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full">
                      {tmpl.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                  {tmpl.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {tmpl.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                  {t("sizeLabel")}: {tmpl.paperSize}
                </span>
                <Link
                  href={`/templates/${tmpl.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold bg-slate-900 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg transition shadow-xs"
                >
                  {t("customizeAndPrint")} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MID-PAGE PROMOTIONAL & ADSENSE UNIT */}
      <div className="max-w-7xl mx-auto px-4 w-full my-6">
        <AdSenseSlot slotId="home-mid-content-ad" format="horizontal" label="Sponsored Content" />
      </div>

      {/* WHY REGISTER? (FOR F-COMMERCE & BUSINESS OWNERS) */}
      <section className="bg-blue-600 dark:bg-blue-700 text-white py-14 px-4 sm:px-6 lg:px-8 my-8">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <span className="inline-block bg-blue-500 dark:bg-blue-800 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            {t("specialFcommerce")}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black">
            {t("shopCtaTitle")}
          </h2>
          <p className="text-blue-100 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
            {t("shopCtaDesc")}
          </p>
          <div className="pt-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-bold px-7 py-3.5 rounded-xl shadow-lg transition text-xs sm:text-sm"
            >
              <Sparkles className="w-4 h-4 text-blue-600" /> {t("createFreeAccount")}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
