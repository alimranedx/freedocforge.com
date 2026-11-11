"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdSenseSlot from "@/components/AdSenseSlot";
import TemplateCardPreview from "@/components/TemplateCardPreview";
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
} from "lucide-react";
import { useGlobalSettings } from "@/context/GlobalSettingsContext";

export default function HomePage() {
  const { lang, t } = useGlobalSettings();
  const [heroActiveTab, setHeroActiveTab] = useState<"shop" | "school" | "medical">("shop");

  // Select top 6 featured templates for the showcase
  const popularTemplates = [
    INITIAL_TEMPLATES.find((t) => t.slug === "f-commerce-invoice")!,
    INITIAL_TEMPLATES.find((t) => t.slug === "doctor-prescription")!,
    INITIAL_TEMPLATES.find((t) => t.slug === "school-result-sheet")!,
    INITIAL_TEMPLATES.find((t) => t.slug === "restaurant-pos-bill")!,
    INITIAL_TEMPLATES.find((t) => t.slug === "school-class-routine")!,
    INITIAL_TEMPLATES.find((t) => t.slug === "medical-appointment-token")!,
  ].filter(Boolean);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      {/* TOP LEADERBOARD ADSENSE UNIT */}
      <div className="max-w-7xl mx-auto px-4 w-full pt-4">
        <AdSenseSlot slotId="home-top-leaderboard" format="horizontal" label="Advertisement" />
      </div>

      {/* 1. HERO SECTION WITH AMBIENT LIGHT & INTERACTIVE STUDIO PREVIEW */}
      <section className="relative overflow-hidden pt-10 sm:pt-16 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8">
        {/* Ambient Radial Spotlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-blue-500/15 via-indigo-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-950/80 dark:to-indigo-950/80 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200/80 dark:border-blue-800 shadow-2xs">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{t("heroBadge")}</span>
          </div>

          {/* Punchy Hero Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            {t("heroTitle1")} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400">
              {t("heroTitle2")}
            </span>{" "}
            {t("heroTitleSuffix")}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t("heroSubtitle")}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/templates/f-commerce-invoice"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-7 py-3.5 rounded-2xl shadow-md hover:shadow-lg transition text-xs sm:text-sm cursor-pointer transform hover:-translate-y-0.5"
            >
              <Printer className="w-4 h-4" />
              <span>{t("heroCta1")}</span>
            </Link>

            <Link
              href="/templates"
              className="flex items-center gap-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold px-6 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-800 shadow-xs transition text-xs sm:text-sm cursor-pointer"
            >
              <span>{t("heroCta2")}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{lang === "bn" ? "১০০% ফ্রি ওয়াটারমার্ক ছাড়া" : "100% Free Zero Watermark"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{lang === "bn" ? "বাংলা ও ইংরেজি ভয়েস টাইপিং" : "Bangla & English Voice Typing"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{lang === "bn" ? "A4 ও ৮০মিমি থার্মাল POS সাপোর্ট" : "A4 & 80mm POS Thermal Support"}</span>
            </div>
          </div>
        </div>

        {/* 2. INTERACTIVE LIVE STUDIO MOCKUP WINDOW (The Hero Eye-Catcher) */}
        <div className="max-w-5xl mx-auto mt-12 sm:mt-14 relative z-10">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden ring-1 ring-slate-900/5">
            {/* Top Mac Window Control Bar */}
            <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                <span className="text-[11px] font-mono text-slate-400 ml-2 hidden sm:inline">
                  freedocforge.com/live-editor
                </span>
              </div>

              {/* Interactive Tab Switcher */}
              <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setHeroActiveTab("shop")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    heroActiveTab === "shop"
                      ? "bg-blue-600 text-white shadow-2xs"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>{lang === "bn" ? "দোকান মেমো" : "Shop Memo"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHeroActiveTab("school")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    heroActiveTab === "school"
                      ? "bg-blue-600 text-white shadow-2xs"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>{lang === "bn" ? "মার্কশিট" : "Marksheet"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHeroActiveTab("medical")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    heroActiveTab === "medical"
                      ? "bg-blue-600 text-white shadow-2xs"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>{lang === "bn" ? "প্রেসক্রিপশন" : "Rx Pad"}</span>
                </button>
              </div>
            </div>

            {/* Inner Live Document Canvas Showcase */}
            <div className="p-6 sm:p-10 bg-slate-50/70 dark:bg-slate-950/60 flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Left Document Miniature Preview */}
              <div className="w-full lg:w-3/5 bg-white text-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 select-none text-xs space-y-4">
                {heroActiveTab === "shop" && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-start border-b-2 border-slate-900 pb-3">
                      <div>
                        <h3 className="font-black text-base text-slate-900 uppercase tracking-tight">
                          STYLIST FASHION BD
                        </h3>
                        <p className="text-slate-500 text-[11px] font-medium">Quality Delivered to Your Doorstep</p>
                        <p className="text-slate-400 text-[10px]">Dhanmondi, Dhaka • +880 1712-345678</p>
                      </div>
                      <div className="text-right">
                        <span className="bg-slate-900 text-white font-black text-[10px] px-2 py-0.5 rounded">
                          CASH MEMO
                        </span>
                        <p className="text-slate-600 font-bold text-[11px] mt-1">INV-2026-089</p>
                        <p className="text-slate-400 text-[10px]">Date: 2026-11-11</p>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex justify-between items-center text-[11px]">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">BILLED TO:</span>
                        <span className="font-bold text-slate-900">Md. Tanvir Ahmed</span>
                        <span className="text-slate-500 block text-[10px]">Mirpur-10, Dhaka</span>
                      </div>
                      <span className="bg-amber-100 text-amber-800 font-black px-2.5 py-1 rounded-lg text-xs">
                        COD DUE: ৳ 3,470
                      </span>
                    </div>

                    <table className="w-full text-[11px] border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 uppercase text-[9px] font-bold">
                          <th className="text-left py-1">Item Description</th>
                          <th className="text-center py-1">Qty</th>
                          <th className="text-right py-1">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="py-1.5 font-medium">Premium Cotton Formal Shirt (L)</td>
                          <td className="text-center">2</td>
                          <td className="text-right font-bold">৳ 2,500</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 font-medium">Slim Fit Chino Pant (32)</td>
                          <td className="text-center">1</td>
                          <td className="text-right font-bold">৳ 1,450</td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="border-t-2 border-slate-900 pt-2 flex justify-between items-end text-[11px]">
                      <div>
                        <span className="text-[10px] text-slate-400 block">In Words: Three Thousand Four Hundred Seventy Taka Only</span>
                        <span className="font-black text-blue-700 text-sm">Net Payable: ৳ 3,470</span>
                      </div>
                      <div className="text-center">
                        <div className="w-20 border-b border-slate-400 mb-0.5"></div>
                        <span className="text-[9px] font-bold text-slate-600">Authorized Signature</span>
                      </div>
                    </div>
                  </div>
                )}

                {heroActiveTab === "school" && (
                  <div className="space-y-4">
                    <div className="text-center border-b-2 border-blue-900 pb-3">
                      <div className="w-8 h-8 mx-auto rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold mb-1">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <h3 className="font-black text-base text-blue-950 uppercase tracking-tight">
                        DHAKA IDEAL MODEL SCHOOL & COLLEGE
                      </h3>
                      <span className="inline-block bg-blue-900 text-white font-extrabold text-[10px] px-2 py-0.5 rounded mt-0.5">
                        ACADEMIC PROGRESS MARKSHEET
                      </span>
                    </div>

                    <div className="bg-blue-50/70 border border-blue-200 p-2.5 rounded-xl flex justify-between text-[11px]">
                      <span><strong>Student:</strong> Sadia Rahman</span>
                      <span><strong>Roll:</strong> 12</span>
                      <span><strong>Class:</strong> 9 (Science)</span>
                    </div>

                    <table className="w-full text-[11px] border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 uppercase text-[9px] font-bold bg-slate-50">
                          <th className="text-left py-1 px-1">Subject</th>
                          <th className="text-center py-1">Full</th>
                          <th className="text-center py-1">Marks</th>
                          <th className="text-right py-1 px-1">Grade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="py-1 px-1 font-semibold">Bangla 1st & 2nd</td>
                          <td className="text-center text-slate-400">100</td>
                          <td className="text-center font-bold">88</td>
                          <td className="text-right px-1 font-black text-blue-700">A+</td>
                        </tr>
                        <tr>
                          <td className="py-1 px-1 font-semibold">General Mathematics</td>
                          <td className="text-center text-slate-400">100</td>
                          <td className="text-center font-bold">95</td>
                          <td className="text-right px-1 font-black text-blue-700">A+</td>
                        </tr>
                        <tr>
                          <td className="py-1 px-1 font-semibold">Physics & Chemistry</td>
                          <td className="text-center text-slate-400">100</td>
                          <td className="text-center font-bold">85</td>
                          <td className="text-right px-1 font-black text-blue-700">A+</td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="border-t-2 border-slate-900 pt-2 flex justify-between items-center text-[11px]">
                      <span className="bg-emerald-100 text-emerald-900 font-black px-2.5 py-1 rounded-lg text-xs">
                        TOTAL RESULT: GPA 5.00 (A+)
                      </span>
                      <div className="text-center">
                        <div className="w-20 border-b border-slate-400 mb-0.5"></div>
                        <span className="text-[9px] font-bold text-slate-700">Principal Signature</span>
                      </div>
                    </div>
                  </div>
                )}

                {heroActiveTab === "medical" && (
                  <div className="space-y-4">
                    <div className="border-b-2 border-rose-600 pb-2.5 flex justify-between items-start">
                      <div>
                        <h3 className="font-black text-base text-rose-900">
                          Dr. Farhana Yasmin, MBBS, FCPS
                        </h3>
                        <p className="text-slate-600 text-[10px] font-semibold">Specialist in Internal Medicine</p>
                        <span className="text-[9px] bg-rose-50 text-rose-700 font-bold px-1.5 py-0.2 rounded mt-0.5 inline-block">
                          BMDC Reg No: A-54321
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="bg-rose-600 text-white font-black text-[10px] px-2 py-0.5 rounded uppercase">
                          DOCTOR Rx PAD
                        </span>
                        <p className="text-slate-500 text-[10px] mt-1">Care Medical Specialist Center</p>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 flex justify-between text-[10px]">
                      <span><strong>Pt:</strong> Nurul Islam (52y / Male)</span>
                      <span><strong>BP:</strong> 125/85 mmHg</span>
                      <span><strong>Date:</strong> 11/11/2026</span>
                    </div>

                    <div className="grid grid-cols-12 gap-3 py-1">
                      <div className="col-span-4 border-r border-slate-200 pr-2 space-y-2 text-[10px]">
                        <div>
                          <span className="font-bold text-rose-800 uppercase block text-[9px]">C/C:</span>
                          <p className="text-slate-600">Fever & cough (3 days)</p>
                        </div>
                        <div>
                          <span className="font-bold text-rose-800 uppercase block text-[9px]">Diagnosis:</span>
                          <p className="font-bold text-slate-800 bg-rose-50 p-1 rounded">Acute Bronchitis</p>
                        </div>
                      </div>

                      <div className="col-span-8 pl-1 space-y-2 text-[11px]">
                        <span className="font-serif font-black text-rose-700 text-lg leading-none block">℞</span>
                        <div className="space-y-1.5">
                          <div className="bg-rose-50/70 p-1.5 rounded-lg border border-rose-100">
                            <span className="font-bold text-slate-900 block">1. Tab. Napa Extra 665mg</span>
                            <span className="text-[10px] text-slate-600 font-semibold">১ + ০ + ১ (খাবারের পর - ৫ দিন)</span>
                          </div>
                          <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                            <span className="font-bold text-slate-900 block">2. Tab. Fexo 120mg</span>
                            <span className="text-[10px] text-slate-600 font-semibold">০ + ০ + ১ (রাতে ঘুমানোর আগে)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-200 pt-2 flex justify-between items-end text-[10px]">
                      <span className="text-slate-400">100% Free Prescription Studio</span>
                      <div className="text-center">
                        <div className="w-20 border-b border-rose-500 mb-0.5"></div>
                        <span className="text-[9px] font-bold text-slate-700">Doctor's Seal & Sign</span>
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
                    {heroActiveTab === "shop"
                      ? "F-Commerce & Shop Cash Memo"
                      : heroActiveTab === "school"
                      ? "School Marksheet & Result Sheet"
                      : "Doctor Prescription Pad (Rx)"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {heroActiveTab === "shop"
                      ? "পণ্য এবং কাস্টমারের নাম লিখুন বা মুখে বলুন, অটোমেটিক ট্যাক্স ও টাকায় কথায় কনভার্ট হয়ে সাথে সাথে প্রিন্ট হবে।"
                      : heroActiveTab === "school"
                      ? "শিক্ষার্থীদের নম্বর বসালেই জিপিএ ও গ্রেড অটো-হিসাব হবে। এক ক্লিকে প্রিন্ট ও ছাত্রছাত্রীদের দেওয়া যাবে।"
                      : "রোগীর নাম, প্রেসার এবং ওষুধ বাংলায় লিখুন বা বলুন। সিল ও স্বাক্ষর সহ প্রেসক্রিপশন প্রিন্ট করুন।"}
                  </p>
                </div>

                {/* Feature Chips */}
                <div className="space-y-2 pt-1 text-xs">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
                      <Mic className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {lang === "bn" ? "ভয়েস টাইপিং দিয়ে অটো-ফিলাপ" : "Voice typing on all input fields"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                    <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center shrink-0">
                      <Printer className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {lang === "bn" ? "A4 ও ৮০মিমি থার্মাল POS প্রিন্ট সাপোর্ট" : "A4 & POS 80mm standard paper sizes"}
                    </span>
                  </div>
                </div>

                {/* CTA Link to exact editor */}
                <div className="pt-2">
                  <Link
                    href={
                      heroActiveTab === "school"
                        ? "/templates/school-result-sheet"
                        : heroActiveTab === "medical"
                        ? "/templates/doctor-prescription"
                        : "/templates/f-commerce-invoice"
                    }
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 px-5 rounded-xl shadow-md transition text-xs sm:text-sm cursor-pointer"
                  >
                    <span>{lang === "bn" ? "এই টেমপ্লেটটি এডিট ও প্রিন্ট করুন" : "Customize & Print This Template"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THREE CORE HUBS: SHOP, SCHOOL & MEDICAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {lang === "bn" ? "আপনার ক্যাটাগরি বেছে নিন" : "Ecosystem Showcase"}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            {lang === "bn" ? "৩টি বিশেষায়িত প্রিন্টেবল স্টুডিও" : "Tailored for 3 Major Industries in BD"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            {lang === "bn"
              ? "দোকান, শিক্ষাপ্রতিষ্ঠান ও চিকিৎসার জন্য আলাদা আলাদা রেডিমেড ফরম্যাট, ক্যালকুলেশন ও ডিজাইন।"
              : "Dedicated document workflows designed specifically for Bangladeshi business owners, educators, and physicians."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Hub 1: Shop & Business */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-xl hover:-translate-y-1 transition duration-200 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center font-bold mb-4 shadow-sm">
                <Store className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                10 Formats • F-Commerce
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-2 group-hover:text-emerald-600 transition">
                {lang === "bn" ? "দোকান ও ব্যবসা স্টুডিও" : "Shop & Business Studio"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {lang === "bn"
                  ? "ক্যাশ মেমো, ৮০মিমি থার্মাল পিওএস রসিদ, কুরিয়ার ডেলিভারি চালান, কোটেশন এবং ওয়ারেন্টি কার্ড।"
                  : "Cash memos, 80mm POS receipts, courier delivery chalans, quotations, and product warranty slips."}
              </p>

              <div className="mt-4 space-y-1 text-xs text-slate-600 dark:text-slate-300 font-semibold">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Facebook Shop Cash Memo</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Restaurant 80mm POS Bill</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Delivery Dispatch Chalan</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link
                href="/templates?category=shop"
                className="w-full flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-xs"
              >
                <span>{lang === "bn" ? "শপ ফরম্যাট দেখুন" : "Explore Shop Templates"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Hub 2: School & Education */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-xl hover:-translate-y-1 transition duration-200 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold mb-4 shadow-sm">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                10 Formats • Academic
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-2 group-hover:text-blue-600 transition">
                {lang === "bn" ? "স্কুল ও একাডেমি স্টুডিও" : "School & Education Studio"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {lang === "bn"
                  ? "মার্কশিট ও জিপিএ ৫.০০ রেজাল্ট কার্ড, সাপ্তাহিক ক্লাস রুটিন, পরীক্ষার সময়সূচি, এডমিট কার্ড এবং টিসি।"
                  : "GPA 5.00 marksheets, weekly class timetables, exam schedules, admit cards, and transfer certificates."}
              </p>

              <div className="mt-4 space-y-1 text-xs text-slate-600 dark:text-slate-300 font-semibold">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                  <span>Academic Result Marksheet</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                  <span>Weekly 6-Day Period Routine</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                  <span>Student Admit Card & Seat Pass</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link
                href="/templates?category=school"
                className="w-full flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-xs"
              >
                <span>{lang === "bn" ? "শিক্ষা ফরম্যাট দেখুন" : "Explore Academic Templates"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Hub 3: Medical & Healthcare */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-xl hover:-translate-y-1 transition duration-200 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-red-600 text-white flex items-center justify-center font-bold mb-4 shadow-sm">
                <Stethoscope className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded">
                10 Formats • Healthcare
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-2 group-hover:text-rose-600 transition">
                {lang === "bn" ? "চিকিৎসা ও চেম্বার স্টুডিও" : "Medical & Clinic Studio"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {lang === "bn"
                  ? "ডাক্তারের প্রেসক্রিপশন প্যাড (BMDC Reg), রোগীর সিরিয়াল টোকেন, হাসপাতাল ডিসচার্জ সামারি ও টেস্ট রসিদ।"
                  : "Doctor prescription pads (BMDC), appointment tokens, hospital discharge summaries, and diagnostic bills."}
              </p>

              <div className="mt-4 space-y-1 text-xs text-slate-600 dark:text-slate-300 font-semibold">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Doctor Prescription Pad (Rx)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Patient Appointment Token</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Hospital Discharge Summary</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link
                href="/templates?category=medical"
                className="w-full flex items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-xs"
              >
                <span>{lang === "bn" ? "চিকিৎসা ফরম্যাট দেখুন" : "Explore Medical Templates"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TEMPLATE SHOWCASE WITH THEMEFOREST-STYLE MOCKUP CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {lang === "bn" ? "জনপ্রিয় ফরম্যাটসমূহ" : "Popular Formats"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              {t("popularTemplates")}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">{t("popularDesc")}</p>
          </div>
          <Link
            href="/templates"
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline mt-2 sm:mt-0 flex items-center gap-1"
          >
            {t("viewAllCategories")} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {popularTemplates.map((tmpl) => (
            <div
              key={tmpl.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-xl hover:-translate-y-1 transition duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Visual Snapshot Card */}
                <div className="mb-4">
                  <TemplateCardPreview template={tmpl} lang={lang} />
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                    {tmpl.category} • {tmpl.paperSize}
                  </span>
                  {tmpl.badge && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-full">
                      {tmpl.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-snug">
                  {lang === "bn" && tmpl.locales?.bn?.title ? tmpl.locales.bn.title : tmpl.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {lang === "bn" && tmpl.locales?.bn?.description ? tmpl.locales.bn.description : tmpl.description}
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">
                  {tmpl.paperSize === "POS_80MM" ? "৮০মিমি POS" : "A4 সাইজ"}
                </span>

                <Link
                  href={`/templates/${tmpl.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl transition shadow-xs hover:shadow-md cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{lang === "bn" ? "এডিট ও প্রিন্ট" : "Edit & Print"}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. MID-PAGE PROMOTIONAL & ADSENSE UNIT */}
      <div className="max-w-7xl mx-auto px-4 w-full my-6">
        <AdSenseSlot slotId="home-mid-content-ad" format="horizontal" label="Sponsored Content" />
      </div>

      {/* 6. REDESIGNED ULTRA-PREMIUM SAAS CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-14 w-full">
        <div className="relative overflow-hidden rounded-3xl sm:rounded-4xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-8 sm:p-12 lg:p-16 border border-indigo-500/20 shadow-2xl">
          {/* Subtle Background Glow Rings */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{t("specialFcommerce")}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
                {t("shopCtaTitle")}
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm lg:text-base leading-relaxed max-w-xl">
                {t("shopCtaDesc")}
              </p>

              {/* Feature Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-semibold text-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>১-ক্লিকে নাম, ফোন ও ঠিকানা পূরণ</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>লোগো ও অফিসিয়াল ডিজিটাল সিল</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>শপ, স্কুল ও মেডিকেল ৩টি প্রিসেট</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>১০০% ফ্রি ও লাইফটাইম অ্যাক্সেস</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg transition text-xs sm:text-sm"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{t("createFreeAccount")}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/templates"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-bold px-5 py-3.5 rounded-xl border border-white/20 transition text-xs sm:text-sm"
                >
                  <span>সকল টেমপ্লেট দেখুন</span>
                </Link>
              </div>
            </div>

            {/* Right Visual Floating Cards */}
            <div className="lg:col-span-5 space-y-3">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 space-y-2 shadow-xl transform lg:rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-white block">Stylist Fashion BD</span>
                      <span className="text-[10px] text-slate-300">F-Commerce Memo Preset</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Auto-Fill
                  </span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 space-y-2 shadow-xl transform lg:-rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-white block">Dhaka Ideal Model School</span>
                      <span className="text-[10px] text-slate-300">Academic Marksheet & Routine</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                    Auto-Fill
                  </span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 space-y-2 shadow-xl transform lg:rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-white block">Dr. Farhana Yasmin, MBBS</span>
                      <span className="text-[10px] text-slate-300">Doctor Prescription Pad (Rx)</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
                    Auto-Fill
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
