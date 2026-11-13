"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { getBreadcrumbListSchema, getOrganizationSchema, SITE_URL } from "@/lib/seo";
import {
  Sparkles,
  FileText,
  Printer,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Globe,
  Heart,
  Award,
  Building,
  Users,
  Lock,
  ArrowRight,
  HelpCircle,
  Clock,
  Layers,
} from "lucide-react";
import { useGlobalSettings } from "@/context/GlobalSettingsContext";

export default function AboutPage() {
  const { lang } = useGlobalSettings();

  const breadcrumbs = getBreadcrumbListSchema([
    { name: "Home", url: "/" },
    { name: "About Us", url: "/about" },
  ]);

  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About FreeDocForge.com",
    url: `${SITE_URL}/about`,
    description:
      "FreeDocForge.com is a dedicated digital document publishing studio engineered to eliminate costly software subscriptions and formatting headaches for businesses, schools, and healthcare providers worldwide.",
    mainEntity: getOrganizationSchema(SITE_URL),
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Schema.org Structured Data */}
      <JsonLd data={breadcrumbs} />
      <JsonLd data={aboutSchema} />

      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider border border-blue-200 dark:border-blue-900 shadow-2xs">
            {lang === "bn" ? "আমাদের পরিচিতি ও মিশন" : "Institutional Profile & Mission"}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mt-4 tracking-tight leading-tight">
            {lang === "bn"
              ? "প্রফেশনাল ডকুমেন্ট তৈরির উন্মুক্ত প্ল্যাটফর্ম"
              : "Empowering 100% Free Professional Document Creation"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-3 max-w-2xl mx-auto leading-relaxed">
            {lang === "bn"
              ? "ক্ষুদ্র উদ্যোক্তা, শিক্ষক এবং চিকিৎসকদের জন্য সাবস্ক্রিপশন ও ওয়াটারমার্কহীন স্মার্ট প্রিন্টেবল স্টুডিও।"
              : "FreeDocForge.com is a dedicated digital document publishing studio engineered to eliminate costly software subscriptions and formatting headaches for businesses, schools, and healthcare providers worldwide."}
          </p>
        </div>

        {/* 1. Core Mission & Why We Exist */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-xs space-y-6 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 mb-8">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {lang === "bn" ? "আমাদের মূল লক্ষ্য ও দৃষ্টিভঙ্গি" : "Our Mission & Guiding Principles"}
              </h2>
              <p className="text-[11px] text-slate-400">
                {lang === "bn" ? "সকলের জন্য উন্মুক্ত ও মানসম্মত প্রযুক্তি" : "Democratizing standard publishing tools"}
              </p>
            </div>
          </div>

          <p>
            {lang === "bn"
              ? "প্রতিদিন লাখ লাখ ক্ষুদ্র ব্যবসায়ী, অনলাইন বুটিক শপ ও ফেসবুক উদ্যোক্তা, প্রাথমিক ও উচ্চ বিদ্যালয়ের শিক্ষক এবং স্বাধীন চিকিৎসকরা সাধারণ একটি ক্যাশ মেমো, পরীক্ষার রুটিন বা রোগীর মানি রিসিট প্রিন্ট করতে গিয়ে জটিল সফটওয়্যার, মাসিক চার্জ (১৫-৩০ ডলার) এবং অনাকাঙ্ক্ষিত ওয়াটারমার্কের মুখোমুখি হন।"
              : "Every day, millions of small business owners, F-commerce boutiques, school teachers, and clinic administrators struggle with bloated software, forced $15-$30/month recurring subscriptions, and intrusive watermarks just to print a daily cash memo, class timetable, or clinic receipt."}
          </p>

          <p>
            <strong>FreeDocForge.com</strong>{" "}
            {lang === "bn"
              ? "প্রতিষ্ঠিত হয়েছে এই সমস্যার স্থায়ী এবং আন্তর্জাতিক মানের সমাধান প্রদানের লক্ষ্যে। আমরা বিশ্বাস করি, একটি সুন্দর ও নির্ভুল ডকুমেন্ট তৈরি করার অধিকার সবার রয়েছে—কোনো পেওয়াল বা সাইন-আপের বাধ্যবাধকতা ছাড়াই।"
              : "was created to dismantle these barriers. We believe that professional, mathematically accurate, and beautifully styled business documents should be accessible to anyone with a browser—instantly, without credit cards, email paywalls, or hidden charges."}
          </p>

          {/* 3 Pillar Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                {lang === "bn" ? "১০০% আজীবন ফ্রি ও ওয়াটারমার্কহীন" : "Zero Cost & Zero Watermark"}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                {lang === "bn"
                  ? "সকল ডাউনলোড ও প্রিন্ট সম্পূর্ণ ওয়াটারমার্কহীন। আপনার ক্লায়েন্ট ও শিক্ষার্থীদের দিন নিখুঁত প্রিন্ট।"
                  : "All generated PDFs are clean, professional, and completely free of branding watermarks."}
              </p>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                {lang === "bn" ? "ইউজার প্রাইভেসি ও ক্লায়েন্ট-সাইড" : "Client-Side Privacy First"}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                {lang === "bn"
                  ? "ডকুমেন্টের যাবতীয় হিসাব ও ডেটা ব্রাউজারেই প্রক্রিয়াজাত হয়। কোনো গোপন তথ্য বিক্রি করা হয় না।"
                  : "Documents render and calculate directly in your web browser. Customer data is never sold or shared."}
              </p>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                {lang === "bn" ? "দ্বৈত ভাষা ও আন্তর্জাতিক মান" : "Bilingual & Global Standards"}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                {lang === "bn"
                  ? "বাংলা ও ইংরেজি উভয় ভাষায় নির্ভুল ফিল্ডস, টাকা কথায় কনভার্ট, A4 এবং ৮০মিমি POS সাপোর্ট।"
                  : "Authentic English & Bengali locales, automatic number-to-words conversion, ISO A4 & 80mm POS."}
              </p>
            </div>
          </div>
        </div>

        {/* 2. Transparent Monetization & Ethical Advertising Policy */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-xs space-y-5 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 mb-8">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {lang === "bn"
                  ? "আমাদের টেকসই ব্যবসায়িক মডেল ও বিজ্ঞাপন নীতি"
                  : "Transparent Monetization & Ethical Ad Policy"}
              </h2>
              <p className="text-[11px] text-slate-400">
                {lang === "bn" ? "অ্যাডসেন্স নীতিমালার সাথে ১০০% সংগতিপূর্ণ" : "100% Google AdSense policy compliant"}
              </p>
            </div>
          </div>

          <p>
            {lang === "bn"
              ? "অনেক ব্যবহারকারী প্রশ্ন করেন: 'আপনারা কোনো চার্জ না নিয়ে কিভাবে প্ল্যাটফর্ম পরিচালনা করেন?' আমাদের উত্তর অত্যন্ত স্বচ্ছ: আমরা প্ল্যাটফর্মটি গুগল অ্যাডসেন্স (Google AdSense) ডিসপ্লে বিজ্ঞাপনের মাধ্যমে নৈতিকভাবে পরিচালনা করি।"
              : "Visitors frequently ask how FreeDocForge sustains continuous server infrastructure and technical development without charging fees. Our model is simple and transparent: we partner with Google AdSense to display ethical, non-intrusive advertisements."}
          </p>

          <p>
            {lang === "bn"
              ? "আমরা ব্যবহারকারীদের ডকুমেন্টের ওপর কখনো বিজ্ঞাপন চাপিয়ে দিই না। প্রিন্ট বা ডাউনলোডের ডকুমেন্টে বিজ্ঞাপনের কোনো চিহ্ন থাকে না। বিজ্ঞাপনের আয়ের মাধ্যমে আমাদের ক্লাউড সার্ভার খরচ, ব্যান্ডউইথ এবং ইঞ্জিনিয়ারিং রক্ষণাবেক্ষণ সম্পন্ন হয়, যার ফলে প্রাথমিক শিক্ষক থেকে শুরু করে প্রত্যন্ত অঞ্চলের দোকানদার বিনামূল্যে সেবা পান।"
              : "We strictly adhere to Google Publisher Policies: ads are clearly designated, never overlap critical buttons or content, and are completely excluded from printed PDF documents. Advertising revenue funds our cloud compute, domain integrity, and continuous feature expansion, ensuring FreeDocForge remains permanently free for small merchants and schools."}
          </p>
        </div>

        {/* 3. Document Engineering & Technical Quality Standards */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-xs space-y-5 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 mb-8">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {lang === "bn" ? "ডকুমেন্ট ইঞ্জিনিয়ারিং ও প্রিন্ট কোয়ালিটি" : "Publishing Engineering & Print Standards"}
              </h2>
              <p className="text-[11px] text-slate-400">
                {lang === "bn" ? "আইএসও A4 ও থার্মাল পিওএস স্পেসিফিকেশন" : "ISO 216 & POS ESC/POS hardware specs"}
              </p>
            </div>
          </div>

          <p>
            {lang === "bn"
              ? "আমাদের প্রতিটি ফরম্যাট তৈরি হয়েছে প্রিন্ট ল্যাবের আন্তর্জাতিক মান বজায় রেখে:"
              : "Every single layout across our 60+ templates is architected against rigorous print production standards:"}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="font-bold text-xs text-slate-900 dark:text-white block">
                1. ISO 216 A4 Sheet Geometry
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Calibrated to exact 210mm x 297mm sheet proportions with 300 DPI high-resolution vector PDF export, preventing cutoff margins on desktop inkjet and laser printers.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="font-bold text-xs text-slate-900 dark:text-white block">
                2. Continuous 80mm Thermal POS
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Monospace tabular typography formatted for standard 80mm point-of-sale thermal receipt rolls (ESC/POS compatible) with dashed tear-off rules.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="font-bold text-xs text-slate-900 dark:text-white block">
                3. Tabular Accounting Numerals
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Fixed-width tabular numbers (`font-mono tabular-nums`) guaranteeing perfect vertical alignment across subtotal, VAT, discounts, and balance due rows.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="font-bold text-xs text-slate-900 dark:text-white block">
                4. Culturally Authentic Localization
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Full parity between English and Bengali locales, including automated Bengali in-words conversion, BMDC medical standards, and secondary education grading boards.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Contact & Editorial Transparency */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <h3 className="text-xl sm:text-2xl font-black">
              {lang === "bn" ? "নতুন কোনো টেমপ্লেটের অনুরোধ আছে?" : "Have a Custom Template Request?"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
              {lang === "bn"
                ? "আপনার প্রতিষ্ঠান বা ব্যবসার জন্য বিশেষ কোনো প্রিন্ট ফরম্যাট প্রয়োজন হলে আমাদের টিমকে জানান। আমরা সম্পূর্ণ বিনামূল্যে তা যুক্ত করব।"
                : "Need a specialized clinical format, academic routine, or commercial chalan? Contact our team and we will engineer it for the public gallery."}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/contact"
              className="px-6 py-3 rounded-xl bg-white text-blue-950 hover:bg-blue-50 font-bold text-xs sm:text-sm shadow-md transition"
            >
              {lang === "bn" ? "আমাদের সাথে যোগাযোগ করুন" : "Contact Our Team"}
            </Link>
            <Link
              href="/templates"
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition"
            >
              {lang === "bn" ? "টেমপ্লেট দেখুন" : "Browse Templates"}
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
