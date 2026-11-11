"use client";

import React from "react";
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
  const { lang } = useGlobalSettings();

  return (
    <div className="mb-6 print:hidden">
      {/* Clean Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
        <span>{lang === "bn" ? "টেমপ্লেটসমূহ" : "Templates"}</span>
        <span>/</span>
        <span className="font-semibold text-blue-600 dark:text-blue-400">{category}</span>
      </div>

      {/* Dynamic Title & Description responsive to System Language */}
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
