import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdSenseSlot from "@/components/AdSenseSlot";
import { INITIAL_TEMPLATES } from "@/lib/templates";
import { ArrowRight, Printer } from "lucide-react";

export default function TemplatesCatalogPage() {
  const categories = ["All", "Business", "Education", "Healthcare", "Restaurant", "Printables"];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full uppercase tracking-wider">
            Public Template Gallery
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-3">
            Explore Free Printable Templates
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            Select a document format below to customize colors, add your shop logo, and download a watermark-free PDF.
          </p>
        </div>

        {/* Top AdSense Banner */}
        <AdSenseSlot slotId="catalog-header-banner" format="horizontal" />

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
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
                    <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full">
                      {tmpl.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                  {tmpl.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {tmpl.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Size: {tmpl.paperSize}</span>
                <Link
                  href={`/templates/${tmpl.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg transition shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" /> Edit & Print
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom AdSense Banner */}
        <AdSenseSlot slotId="catalog-bottom-banner" format="horizontal" />
      </main>

      <Footer />
    </div>
  );
}
