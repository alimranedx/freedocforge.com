"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Sparkles, FileText, Printer, CheckCircle, Shield, Zap, Globe, Heart } from "lucide-react";
import { useGlobalSettings } from "@/context/GlobalSettingsContext";

export default function AboutPage() {
  const { lang } = useGlobalSettings();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-xs bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-blue-200 dark:border-blue-900">
            {lang === "bn" ? "আমাদের লক্ষ্য ও উদ্দেশ্য" : "Our Core Mission"}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mt-3 tracking-tight">
            {lang === "bn" ? "FreeDocForge সম্পর্কে জানুন" : "About FreeDocForge.com"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl mx-auto leading-relaxed">
            {lang === "bn"
              ? "ক্ষুদ্র উদ্যোক্তা, শিক্ষক এবং চিকিৎসকদের জন্য জিরো-কস্ট ও প্রফেশনাল ডকুমেন্ট তৈরির একটি উন্মুক্ত স্মার্ট প্ল্যাটফর্ম।"
              : "Empowering small businesses, entrepreneurs, schools, and clinics with zero-cost, instant professional document creation."}
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-xs space-y-6 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {lang === "bn" ? "কেন আমরা FreeDocForge তৈরি করেছি?" : "Why We Built FreeDocForge"}
          </h2>
          <p>
            {lang === "bn"
              ? "বাংলাদেশে হাজার হাজার ফেসবুক পেইজ সেলার, কোচিং সেন্টারের শিক্ষক এবং চেম্বারের চিকিৎসকরা প্রতিদিন সাধারণ একটি ক্যাশ মেমো বা রেজাল্ট শিট বা প্রেসক্রিপশন প্রিন্ট করতে গিয়ে জটিল সফটওয়্যার, মাসিক সাবস্ক্রিপশন ফি কিংবা বিদঘুটে ওয়াটারমার্কের সম্মুখীন হন।"
              : "Millions of online sellers on Facebook, independent clinics, local restaurants, and coaching centers struggle with bloated software, forced recurring subscriptions, and watermarked downloads just to print a simple cash memo or student report."}
          </p>
          <p>
            <strong>FreeDocForge.com</strong>{" "}
            {lang === "bn"
              ? "তৈরি হয়েছে এই সমস্যাটি চিরতরে সমাধান করার জন্য—একটি পরিচ্ছন্ন, দ্রুত ও নিরাপদ ওয়েব টুল যা কোনো সাইন-আপ ছাড়াই যেকোনো ফরম্যাট তাৎক্ষণিকভাবে প্রিন্ট করতে দেয়। আমরা অনাধিকারপ্রবেশকারী গুগল অ্যাডসেন্স বিজ্ঞাপনের মাধ্যমে প্ল্যাটফর্মটি চালাই, যার ফলে মূল সেবাটি আজীবন সম্পূর্ণ ফ্রি থাকে।"
              : "was created to solve this exact problem: an instant, clean, web-based tool that lets you customize ready-to-print formats in seconds. We monetize transparently through non-intrusive display advertisements, keeping our entire core tool 100% free for everyone."}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-2" />
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                {lang === "bn" ? "জিরো ওয়াটারমার্ক" : "Zero Watermarks"}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {lang === "bn" ? "১০০% ক্লিন ও প্রফেশনাল পিডিএফ।" : "Professional clean documents ready for your customers."}
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2" />
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                {lang === "bn" ? "ইউজার প্রাইভেসি" : "Client Privacy First"}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {lang === "bn" ? "ডকুমেন্ট ডেটা আপনার ব্রাউজারেই জেনারেট হয়।" : "Documents render right in your browser. Data is never sold."}
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
              <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-2" />
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                {lang === "bn" ? "বাংলা ও ইংরেজি ভয়েস" : "Local & Global Ready"}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {lang === "bn" ? "টাকা (৳), ডলার, ৮০মিমি থার্মাল ও A4 সাপোর্ট।" : "Supports BDT (৳), USD, thermal 80mm rolls, and A4 print."}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
