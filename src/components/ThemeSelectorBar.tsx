"use client";

import React from "react";
import { Palette, Sparkles, Check } from "lucide-react";
import {
  DesignThemeId,
  DESIGN_THEMES,
  THEME_LIST,
  DesignThemeConfig,
} from "@/lib/designThemes";

interface ThemeSelectorBarProps {
  activeThemeId: DesignThemeId;
  onSelectTheme: (themeId: DesignThemeId) => void;
  lang?: "en" | "bn";
  className?: string;
}

export default function ThemeSelectorBar({
  activeThemeId,
  onSelectTheme,
  lang = "en",
  className = "",
}: ThemeSelectorBarProps) {
  const activeTheme = DESIGN_THEMES[activeThemeId] || DESIGN_THEMES["modern-blue"];

  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs print:hidden transition-all ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>
                {lang === "bn" ? "ডকুমেন্ট ডিজাইন থিম আর্কিটাইপ:" : "Document Design Theme Archetype:"}
              </span>
              <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                {lang === "bn" ? activeTheme.nameBn : activeTheme.nameEn}
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {lang === "bn"
                ? "এক ক্লিকেই ফন্ট, বর্ডার ও লেআউট স্টাইল পরিবর্তন করুন। প্রিন্ট ও ডাউনলোডে হুবহু প্রতিফলিত হবে।"
                : "Switch fonts, border filigree, and layout styles in 1 click. Reflected in print & PDF."}
            </p>
          </div>
        </div>
      </div>

      {/* The 6 Theme Selection Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {THEME_LIST.map((theme: DesignThemeConfig) => {
          const isActive = theme.id === activeThemeId;

          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => {
                onSelectTheme(theme.id);
                try {
                  localStorage.setItem("freedocforge_preferred_theme", theme.id);
                } catch {}
              }}
              className={`flex items-center gap-2 p-2.5 rounded-xl text-left transition-all cursor-pointer border relative group ${
                isActive
                  ? "bg-slate-900 dark:bg-slate-800 text-white border-slate-900 dark:border-slate-700 shadow-md ring-2 ring-indigo-500/40"
                  : "bg-slate-50 dark:bg-slate-850/60 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300"
              }`}
            >
              <span className="text-base sm:text-lg shrink-0 drop-shadow-xs">{theme.icon}</span>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-bold truncate leading-tight">
                    {lang === "bn" ? theme.nameBn.split("(")[0] : theme.nameEn}
                  </p>
                  {isActive && <Check className="w-3 h-3 text-emerald-400 shrink-0 ml-1" />}
                </div>
                <p
                  className={`text-[9px] truncate mt-0.5 ${
                    isActive ? "text-slate-300" : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {theme.fontFamily.replace("font-", "")} style
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
