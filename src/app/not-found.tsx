import React from "react";
import Link from "next/link";
import {
  FileQuestion,
  Home,
  Layers,
  ArrowRight,
  Store,
  Stethoscope,
  GraduationCap,
  Utensils,
  Search,
} from "lucide-react";

export default function NotFoundPage() {
  const popularTemplates = [
    { title: "F-Commerce Cash Memo", href: "/templates/f-commerce-invoice", icon: Store, category: "Business" },
    { title: "Doctor Rx Prescription", href: "/templates/doctor-prescription-pad", icon: Stethoscope, category: "Healthcare" },
    { title: "Academic Marksheet (GPA 5.00)", href: "/templates/school-marksheet-result", icon: GraduationCap, category: "Education" },
    { title: "Restaurant POS Slip (80mm)", href: "/templates/restaurant-pos-bill", icon: Utensils, category: "Retail POS" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center items-center px-4 py-16 font-sans">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* VISUAL 404 BADGE */}
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-3xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400 shadow-xl shadow-blue-500/10">
            <FileQuestion className="w-12 h-12" />
          </div>
          <span className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-mono font-black text-xs px-2.5 py-0.5 rounded-full shadow-md">
            404 ERROR
          </span>
        </div>

        {/* HEADINGS */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Page Not Found
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            The document template, link, or page you requested does not exist or may have been moved.
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">
            পৃষ্ঠাটি খুঁজে পাওয়া যায়নি • অনুগ্রহ করে সঠিক ঠিকানা যাচাই করুন
          </p>
        </div>

        {/* PRIMARY ACTION BUTTONS */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
          >
            <Home className="w-4 h-4" /> Return to Homepage
          </Link>
          <Link
            href="/templates"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition border border-slate-300 dark:border-slate-700"
          >
            <Layers className="w-4 h-4" /> Browse All Templates
          </Link>
        </div>

        {/* POPULAR SHORTCUTS */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800/80 text-left">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 text-center">
            Popular Free Printable Document Formats
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {popularTemplates.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition flex items-center justify-between group shadow-2xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-950 transition">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">{item.category}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:text-blue-500 transition" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* BRAND FOOTER NOTE */}
        <p className="text-[11px] text-slate-400 dark:text-slate-600 pt-4">
          FreeDocForge.com • 100% Free Smart Printable & Document Studio
        </p>
      </div>
    </div>
  );
}
