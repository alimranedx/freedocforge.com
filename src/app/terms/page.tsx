"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FileCheck, ShieldAlert, Award } from "lucide-react";
import { useGlobalSettings } from "@/context/GlobalSettingsContext";

export default function TermsPage() {
  const { lang } = useGlobalSettings();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3 border border-blue-200 dark:border-blue-900">
            <FileCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>{lang === "bn" ? "ব্যবহারের নীতিমালা" : "Terms & Conditions"}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {lang === "bn" ? "ব্যবহারের শর্তাবলী" : "Terms of Service"}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Last updated: November 2026
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-xs space-y-6 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            Welcome to <strong>FreeDocForge.com</strong>. By accessing or using our website and printable document creation tools, you agree to be bound by these Terms of Service.
          </p>

          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-6 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>1. Free License & Commercial Usage</span>
          </h2>
          <p>
            You are granted a worldwide, royalty-free, perpetual license to generate, download, print, and distribute documents created using FreeDocForge.com for personal or commercial business purposes (such as issuing customer cash memos, student marksheets, or medical prescription slips).
          </p>

          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-6 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span>2. Prohibited Activities</span>
          </h2>
          <p>
            You may not use our service to generate fraudulent, deceptive, or illegal documents, including counterfeit legal deeds, forged government credentials, or fake financial statements. Any such unlawful activity is strictly prohibited and subject to immediate account termination.
          </p>

          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-6">
            3. Disclaimer of Legal & Medical Warranties
          </h2>
          <p>
            FreeDocForge provides document design templates and layout automation. We do not provide certified legal, medical, or tax advice. Users and business owners are solely responsible for ensuring their issued documents comply with applicable local trade regulations and professional standards.
          </p>

          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-6">
            4. Service Availability & Modifications
          </h2>
          <p>
            We strive for 99.9% uptime and continuous improvement. We reserve the right to add, update, or refine template formats to better serve small businesses and educational communities.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
