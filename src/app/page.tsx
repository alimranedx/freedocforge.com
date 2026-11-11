import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdSenseSlot from "@/components/AdSenseSlot";
import { INITIAL_TEMPLATES } from "@/lib/templates";
import { Printer, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Zap, Heart } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      {/* TOP LEADERBOARD ADSENSE UNIT */}
      <div className="max-w-7xl mx-auto px-4 w-full pt-4">
        <AdSenseSlot slotId="home-top-leaderboard" format="horizontal" label="Advertisement" />
      </div>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" /> 100% Free Instant Document & Printable Studio
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight">
          Create, Customize & Print <br />
          <span className="text-blue-600">Free Business Documents</span> in Seconds.
        </h1>
        <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          The all-in-one free document studio for Bangladeshi F-commerce shops, schools, doctors, and restaurants.
          No credit card, no watermarks, and no sign-up required.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/templates/f-commerce-invoice"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-xl shadow-md transition text-sm"
          >
            <Printer className="w-4 h-4" /> Create Cash Memo Now
          </Link>
          <Link
            href="/templates"
            className="flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-800 font-bold px-6 py-3.5 rounded-xl border border-slate-300 shadow-sm transition text-sm"
          >
            Browse All Templates <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Feature Badges */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-2" />
            <h4 className="text-xs font-bold text-slate-900">Zero Watermark</h4>
            <p className="text-[11px] text-slate-500">100% clean and professional PDF files.</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <Zap className="w-5 h-5 text-amber-500 mb-2" />
            <h4 className="text-xs font-bold text-slate-900">BDT (৳) Currency Ready</h4>
            <p className="text-[11px] text-slate-500">Auto words converter & courier slips.</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <Printer className="w-5 h-5 text-blue-600 mb-2" />
            <h4 className="text-xs font-bold text-slate-900">A4 & Thermal 80mm</h4>
            <p className="text-[11px] text-slate-500">Prints on office printers and POS rolls.</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <ShieldCheck className="w-5 h-5 text-purple-600 mb-2" />
            <h4 className="text-xs font-bold text-slate-900">100% Free Forever</h4>
            <p className="text-[11px] text-slate-500">Monetized ethically with display ads.</p>
          </div>
        </div>
      </section>

      {/* TEMPLATE SHOWCASE / CATALOG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Popular Free Templates</h2>
            <p className="text-sm text-slate-500 mt-1">Pick a template below, customize your details, and print instantly.</p>
          </div>
          <Link href="/templates" className="text-xs font-bold text-blue-600 hover:underline mt-2 sm:mt-0 flex items-center gap-1">
            View All Categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INITIAL_TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                    {tmpl.category}
                  </span>
                  {tmpl.badge && (
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      {tmpl.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition">
                  {tmpl.title}
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {tmpl.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">Format: {tmpl.paperSize}</span>
                <Link
                  href={`/templates/${tmpl.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold bg-slate-900 hover:bg-blue-600 text-white px-3.5 py-2 rounded-lg transition shadow-sm"
                >
                  Customize & Print <ArrowRight className="w-3.5 h-3.5" />
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
      <section className="bg-blue-600 text-white py-14 px-4 sm:px-6 lg:px-8 my-8">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <span className="inline-block bg-blue-500 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            Special for Small Business & F-Commerce
          </span>
          <h2 className="text-3xl sm:text-4xl font-black">
            Save Your Shop Logo, Address & Signature Once
          </h2>
          <p className="text-blue-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Stop typing your phone number, logo, and terms every single time! Create a free account to save your shop preset. Every time a customer orders, just enter the items and hit print!
          </p>
          <div className="pt-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-bold px-7 py-3.5 rounded-xl shadow-lg transition text-sm"
            >
              <Sparkles className="w-4 h-4 text-blue-600" /> Create Free Shop Account
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
