import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Sparkles, FileText, Printer, CheckCircle } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <span className="text-xs bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Our Mission
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3">About FreeDocForge.com</h1>
          <p className="text-sm text-slate-600 mt-2 max-w-2xl mx-auto">
            Empowering small businesses, entrepreneurs, schools, and clinics with zero-cost, instant professional document creation.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6 text-sm leading-relaxed text-slate-700">
          <h2 className="text-xl font-bold text-slate-900">Why We Built FreeDocForge</h2>
          <p>
            Millions of online sellers on Facebook, independent clinics, local restaurants, and coaching centers struggle with bloated software, forced recurring subscriptions, and watermarked downloads just to print a simple cash memo or student report.
          </p>
          <p>
            <strong>FreeDocForge.com</strong> was created to solve this exact problem: an instant, clean, web-based tool that lets you customize ready-to-print formats in seconds. We monetize transparently through non-intrusive Google AdSense display advertisements, keeping our entire core tool 100% free for everyone.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <CheckCircle className="w-5 h-5 text-emerald-600 mb-2" />
              <h4 className="font-bold text-slate-900 text-xs">Zero Watermarks</h4>
              <p className="text-[11px] text-slate-500">Professional clean documents ready for your customers.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <CheckCircle className="w-5 h-5 text-blue-600 mb-2" />
              <h4 className="font-bold text-slate-900 text-xs">Client Privacy First</h4>
              <p className="text-[11px] text-slate-500">Documents render right in your browser. Data is never sold.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <CheckCircle className="w-5 h-5 text-purple-600 mb-2" />
              <h4 className="font-bold text-slate-900 text-xs">Local & Global Ready</h4>
              <p className="text-[11px] text-slate-500">Supports BDT (৳), USD, thermal 80mm rolls, and A4 print.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
