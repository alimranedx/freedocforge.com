"use client";

import React from "react";
import { Globe } from "lucide-react";
import { useGlobalSettings } from "@/context/GlobalSettingsContext";

export default function TemplateLanguageBar({
  category,
  title,
  description,
}: {
  category: string;
  title: string;
  description: string;
}) {
  const { lang, setLang } = useGlobalSettings();

  return (
    <div className="mb-6 print:hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>{lang === "bn" ? "টেমপ্লেটসমূহ" : "Templates"}</span>
          <span>/</span>
          <span className="font-semibold text-blue-600 dark:text-blue-400">{category}</span>
        </div>

        {/* Dedicated Language Switcher right in the top breadcrumb area */}
        <div className="inline-flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1 shadow-xs self-start sm:self-auto">
          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 px-2 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">
              {lang === "bn" ? "টেমপ্লেট ভাষা:" : "Template Language:"}
            </span>
          </span>
          <button
            type="button"
            onClick={() => setLang("en")}
            className={`text-xs font-bold px-2.5 py-1 rounded-md transition cursor-pointer ${
              lang === "en"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLang("bn")}
            className={`text-xs font-bold px-2.5 py-1 rounded-md transition cursor-pointer ${
              lang === "bn"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            বাংলা
          </button>
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
        {lang === "bn" && title.includes("Cash Memo") ? "ফেসবুক শপ ও অনলাইন ক্যাশ মেমো" : title}
      </h1>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
        {lang === "bn"
          ? "অনলাইন সেলার, ফেসবুক শপ এবং ক্ষুদ্র উদ্যোক্তাদের জন্য সহজ সমাধান। কাস্টমারের ঠিকানা ও কুরিয়ার মেমো প্রিন্ট করুন বাংলায় বা ইংরেজিতে।"
          : description}
      </p>
    </div>
  );
}
