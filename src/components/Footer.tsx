"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Heart, Sparkles, Store, GraduationCap, Stethoscope } from "lucide-react";
import { useGlobalSettings } from "@/context/GlobalSettingsContext";

export default function Footer() {
  const { lang } = useGlobalSettings();

  return (
    <footer className="bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 py-14 border-t border-slate-200 dark:border-slate-800/80 print:hidden text-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
        {/* Brand Description */}
        <div className="space-y-3.5 md:col-span-1">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              FreeDocForge
              <span className="text-blue-600 dark:text-blue-400 text-xs px-1.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 font-bold">
                .com
              </span>
            </span>
          </Link>
          <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
            {lang === "bn"
              ? "১০০% ফ্রি স্মার্ট প্রিন্ট ও ডকুমেন্ট স্টুডিও। ফেসবুক শপ, স্কুল, ডাক্তার ও রেস্তোরাঁর জন্য ওয়াটারমার্ক ছাড়া ইনস্ট্যান্ট প্রিন্ট ফরম্যাট।"
              : "100% Free Smart Printable & Business Document Studio. Customize invoices, school marksheets, prescriptions, and daily planners in seconds."}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              {lang === "bn"
                ? "ব্রাউজার-লেভেল সিকিউরিটি। আপনার ডেটা কখনোই কোথাও পাঠানো হয় না।"
                : "Client-side generation. Your data never leaves your computer."}
            </span>
          </div>
        </div>

        {/* Free Templates Hub */}
        <div>
          <h4 className="text-slate-900 dark:text-white font-bold mb-3.5 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{lang === "bn" ? "জনপ্রিয় টেমপ্লেট" : "Popular Formats"}</span>
          </h4>
          <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-xs">
            <li>
              <Link href="/templates/f-commerce-invoice" className="hover:text-blue-600 dark:hover:text-white transition flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>F-Commerce Cash Memo (BD)</span>
              </Link>
            </li>
            <li>
              <Link href="/templates/restaurant-pos-bill" className="hover:text-blue-600 dark:hover:text-white transition flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Restaurant 80mm Thermal Bill</span>
              </Link>
            </li>
            <li>
              <Link href="/templates/school-result-sheet" className="hover:text-blue-600 dark:hover:text-white transition flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>School & Coaching Marksheet</span>
              </Link>
            </li>
            <li>
              <Link href="/templates/doctor-prescription" className="hover:text-blue-600 dark:hover:text-white transition flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>Doctor Prescription Pad (Rx)</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal & Policy (Crucial for AdSense) */}
        <div>
          <h4 className="text-slate-900 dark:text-white font-bold mb-3.5 uppercase tracking-wider text-[11px]">
            {lang === "bn" ? "পলিসি ও ট্রাস্ট" : "Policies & Trust"}
          </h4>
          <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-xs">
            <li>
              <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-white transition">
                {lang === "bn" ? "প্রাইভেসি পলিসি" : "Privacy Policy"}
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-blue-600 dark:hover:text-white transition">
                {lang === "bn" ? "ব্যবহারের শর্তাবলী" : "Terms of Service"}
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-blue-600 dark:hover:text-white transition">
                {lang === "bn" ? "আমাদের সম্পর্কে" : "About Us"}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-blue-600 dark:hover:text-white transition">
                {lang === "bn" ? "যোগাযোগ ও সহায়তা" : "Contact & Support"}
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Help & Free Shop Preset */}
        <div>
          <h4 className="text-slate-900 dark:text-white font-bold mb-3.5 uppercase tracking-wider text-[11px]">
            {lang === "bn" ? "ব্যবসায়ীদের জন্য বিশেষ সুবিধা" : "For Small Businesses"}
          </h4>
          <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-3.5">
            {lang === "bn"
              ? "আপনার শপের লোগো, ফোন ও ঠিকানা একবার সেভ করে রাখুন। প্রতিবার কাস্টমার অর্ডারের সময় টাইপ করার ঝামেলা থাকবে না!"
              : "Save your Facebook shop or institute profile once. Never rewrite your phone number, logo, and address manually again!"}
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl transition text-xs shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{lang === "bn" ? "ফ্রি অ্যাকাউন্ট তৈরি করুন" : "Create Free Account"}</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-slate-500 dark:text-slate-400 text-[11px] gap-2">
        <p>© 2026 FreeDocForge.com. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Designed with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for entrepreneurs, schools & healthcare heroes worldwide.
        </p>
      </div>
    </footer>
  );
}
