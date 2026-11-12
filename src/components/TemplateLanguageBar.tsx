"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import { useGlobalSettings } from "@/context/GlobalSettingsContext";

export default function TemplateLanguageBar({
  category,
  title,
  description,
  locales,
}: {
  category: string;
  title: string;
  description: string;
  locales?: {
    en?: { title?: string; description?: string };
    bn?: { title?: string; description?: string };
  };
}) {
  const { lang } = useGlobalSettings();

  const displayTitle = lang === "bn" && locales?.bn?.title ? locales.bn.title : title;
  const displayDescription = lang === "bn" && locales?.bn?.description ? locales.bn.description : description;

  const categoryName =
    lang === "bn"
      ? category === "Shop & Business"
        ? "দোকান ও ব্যবসা"
        : category === "School & Education"
        ? "স্কুল ও শিক্ষা"
        : category === "Medical & Healthcare"
        ? "চিকিৎসা ও ক্লিনিক"
        : category === "Personal & Daily"
        ? "ব্যক্তিগত ও দৈনন্দিন"
        : category
      : category;

  return (
    <div className="mb-6 print:hidden">
      {/* Clean Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2">
        <Link href="/templates" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
          {lang === "bn" ? "টেমপ্লেটসমূহ" : "Templates"}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-blue-600 dark:text-blue-400">{categoryName}</span>
      </div>

      {/* Dynamic Title & Description responsive to System Language */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
        {displayTitle}
      </h1>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
        {displayDescription}
      </p>
    </div>
  );
}
