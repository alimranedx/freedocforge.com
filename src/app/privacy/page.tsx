"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Lock, Eye, FileText } from "lucide-react";
import { useGlobalSettings } from "@/context/GlobalSettingsContext";

export default function PrivacyPolicyPage() {
  const { lang } = useGlobalSettings();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3 border border-blue-200 dark:border-blue-900">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span>{lang === "bn" ? "নিরাপত্তা ও গোপনীয়তা" : "Privacy & Compliance"}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {lang === "bn" ? "প্রাইভেসি পলিসি" : "Privacy Policy"}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Last updated: November 2026
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-xs space-y-6 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            At <strong>FreeDocForge.com</strong>, the privacy of our visitors and registered business owners is of extreme importance to us. This Privacy Policy outlines the types of personal information that is received and collected by FreeDocForge.com and how it is used.
          </p>

          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-6 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>1. Client-Side Document Processing</span>
          </h2>
          <p>
            All document customization, financial calculations, voice typing, and PDF generation take place directly inside your web browser. We do not store or transmit your customer's personal data or invoices on external servers unless you explicitly sign in and save them to your account.
          </p>

          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-6 flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>2. Google AdSense & Cookies</span>
          </h2>
          <p>
            Google, as a third-party vendor, uses cookies to serve ads on FreeDocForge.com. Google's use of the DART cookie enables it to serve ads to users based on their visit to FreeDocForge.com and other sites on the Internet. Users may opt out of the use of the DART cookie by visiting the Google ad and content network privacy policy.
          </p>

          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-6 flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>3. User Profile Storage</span>
          </h2>
          <p>
            When you register for a free account, we securely store your business details (store name, phone number, address, and uploaded logo/signature) solely for auto-populating your templates. We never sell, rent, or distribute your account data to third parties.
          </p>

          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-6">
            4. Contact Information
          </h2>
          <p>
            If you have any questions or require additional information about our privacy policy, please contact our data privacy officer at <strong>support@freedocforge.com</strong>.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
