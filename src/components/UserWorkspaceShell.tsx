"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Store,
  FileText,
  Printer,
  Sparkles,
  LogOut,
  Home,
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  Layers,
  GraduationCap,
  Stethoscope,
  Plus,
  Receipt,
  ExternalLink,
  Edit3,
} from "lucide-react";
import { useGlobalSettings } from "@/context/GlobalSettingsContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function formatDisplayName(fullName?: string): string {
  if (!fullName) return "User";
  const trimmed = fullName.trim();
  const parts = trimmed.split(/\s+/);
  if (parts.length > 1 && /^(al|md\.?|dr\.?|prof\.?|mr\.?|mrs\.?|ms\.?|mohammad|engr\.?)$/i.test(parts[0])) {
    const p0 = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    const p1 = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
    return `${p0} ${p1}`;
  }
  return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
}

interface UserWorkspaceShellProps {
  children: React.ReactNode;
  activeNav?: string;
  adaptive?: boolean;
  alwaysWorkspace?: boolean;
}

export default function UserWorkspaceShell({
  children,
  activeNav,
  adaptive = false,
  alwaysWorkspace = false,
}: UserWorkspaceShellProps) {
  const pathname = usePathname();
  const currentPath = activeNav || pathname;

  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
    alwaysWorkspace ? true : null
  );

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localPresetName, setLocalPresetName] = useState<string>("");
  const [presetType, setPresetType] = useState<"shop" | "school" | "medical">("shop");
  const [savedCount, setSavedCount] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  const { theme, toggleTheme, lang, toggleLang, t } = useGlobalSettings();

  useEffect(() => {
    // 1. Check local preset
    const savedLocal = localStorage.getItem("freedocforge_active_preset");
    if (savedLocal) {
      try {
        const parsed = JSON.parse(savedLocal);
        if (parsed.businessName) setLocalPresetName(parsed.businessName);
        if (parsed.presetType) setPresetType(parsed.presetType);
      } catch (e) {}
    }

    // 2. Fetch auth user
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user.role !== "ADMIN") {
          setUser(data.user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
      });

    // 3. Fetch live user documents count for sidebar badge
    fetch("/api/user/documents")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.documents)) {
          setSavedCount(data.documents.length);
        } else {
          const hist = localStorage.getItem("freedocforge_history");
          if (hist) {
            try {
              const p = JSON.parse(hist);
              if (Array.isArray(p)) setSavedCount(p.length);
            } catch (e) {}
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // offline logout fallback
    } finally {
      window.location.replace("/login");
    }
  };

  // If adaptive and not logged in (or still checking initial render in non-workspace mode)
  if (adaptive && isAuthenticated === false) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    );
  }

  const navItems = [
    { label: t("overviewQuickPrint"), href: "/dashboard", icon: Home },
    {
      label: t("savedDocuments"),
      href: "/dashboard/history",
      icon: FileText,
      badge: savedCount !== null && savedCount > 0 ? String(savedCount) : undefined,
    },
    {
      label: t("myShopPreset"),
      href: "/dashboard/shop-profile",
      icon: presetType === "school" ? GraduationCap : presetType === "medical" ? Stethoscope : Store,
    },
    {
      label: lang === "bn" ? "টেমপ্লেট সংগ্রহশালা" : "Templates Library",
      href: "/templates",
      icon: Layers,
      badge: "60",
    },
    { label: t("aiTemplateDesigner"), href: "/dashboard/ai-designer", icon: Sparkles, badge: "AI" },
  ];

  const StudioIcon = presetType === "school" ? GraduationCap : presetType === "medical" ? Stethoscope : FileText;
  const studioTitle =
    presetType === "school"
      ? lang === "bn"
        ? "একাডেমিক স্টুডিও"
        : "Academic Studio"
      : presetType === "medical"
      ? lang === "bn"
        ? "ক্লিনিক্যাল স্টুডিও"
        : "Clinical Studio"
      : t("dashboardTitle");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* MOBILE BACKDROP OVERLAY */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs transition-opacity print:hidden"
          aria-hidden="true"
        />
      )}

      {/* PERMANENTLY FIXED LEFT SIDEBAR (Locked to viewport at all times) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between shrink-0 transform transition-transform duration-300 ease-in-out md:translate-x-0 print:hidden ${
          mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Scrollable inner content for small viewport heights */}
        <div className="flex-1 overflow-y-auto scrollbar-none">
          {/* Brand & Mobile Close button */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-xs group-hover:scale-105 transition-transform">
                <StudioIcon className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-sm text-slate-900 dark:text-white block leading-tight">
                  {studioTitle}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {t("activeStatus")}
                </span>
              </div>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 md:hidden cursor-pointer"
              title={t("closeMenu")}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Organization & Letterhead Card */}
          <div className="m-3 p-3 bg-gradient-to-br from-slate-50 to-slate-100/80 dark:from-slate-800/80 dark:to-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-2xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                {t("activeShop")}
              </span>
              <Link
                href="/dashboard/shop-profile"
                className="text-[10px] font-bold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-0.5 transition"
                title={t("editPresetTooltip")}
              >
                <Edit3 className="w-3 h-3" />
                <span>{lang === "bn" ? "এডিট" : "Edit"}</span>
              </Link>
            </div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
              {localPresetName || user?.profiles?.[0]?.businessName || user?.name || "FreeDocForge Preset"}
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {user?.email || (lang === "bn" ? "১-ক্লিক অটোফিল সক্রিয়" : "1-Click Auto-Fill Active")}
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                currentPath === item.href ||
                (item.href === "/templates" && currentPath.startsWith("/templates"));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-semibold"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                        isActive
                          ? "bg-white text-blue-700"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Fixed Bottom Actions (+ Create Document & Log Out) */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2 shrink-0 bg-white dark:bg-slate-900">
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t("instantPrintMemo")}</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 font-semibold py-2 rounded-xl text-xs transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> {t("logOut")}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA OFFSET BY FIXED SIDEBAR (md:pl-64) */}
      <div className="flex flex-col min-h-screen md:pl-64 transition-all">
        {/* STICKY TOP HEADER */}
        <header className="h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 transition-colors print:hidden">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden cursor-pointer"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                {t("welcomeBack")}, {formatDisplayName(user?.name)}!
              </h1>
              <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400">
                {t("presetsReady")}
              </p>
            </div>
          </div>

          {/* CONTROLS: THEME, LANGUAGE, FREE PLAN STATUS & EXPLORE */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100/70 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
              title={lang === "en" ? "বাংলা ভাষায় পরিবর্তন করুন" : "Switch to English"}
            >
              <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{lang === "en" ? "বাংলা" : "EN"}</span>
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100/70 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4 text-slate-700" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>

            <Link
              href="/templates"
              className="hidden lg:inline-flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              <span>{t("publicGallery")}</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </Link>

            {/* Clean Free Plan Badge */}
            <div className="hidden sm:inline-flex items-center gap-1.5 text-xs bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold px-2.5 py-1.5 rounded-lg border border-emerald-200/80 dark:border-emerald-800/80 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{t("freePlanBadge")}</span>
            </div>
          </div>
        </header>

        {/* MAIN BODY CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 print:p-0 print:m-0">{children}</main>
      </div>

      {/* QUICK DOCUMENT CREATION MODAL */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in print:hidden"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {lang === "bn" ? "নতুন ডকুমেন্ট তৈরি করুন" : "Create New Document"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {lang === "bn"
                    ? "আপনার সংরক্ষিত প্রিসেট তথ্য সহ মুহূর্তেই ওপেন করুন"
                    : "Instantly launch ready with your saved letterhead profile"}
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Option 1: Cash Memo */}
              <Link
                href="/templates/f-commerce-invoice"
                onClick={() => setShowCreateModal(false)}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-slate-800 transition flex items-start gap-3 group"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600">
                    {t("cashMemoOption")}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {lang === "bn" ? "ফেসবুক শপ ও সাধারণ ইনভয়েস" : "A4 & POS Cash Memo"}
                  </p>
                </div>
              </Link>

              {/* Option 2: Doctor Prescription */}
              <Link
                href="/templates/doctor-prescription-pad"
                onClick={() => setShowCreateModal(false)}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-slate-800 transition flex items-start gap-3 group"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600">
                    {t("rxPrescriptionOption")}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {lang === "bn" ? "BMDC সিল ও ক্লিনিক্যাল প্যাড" : "Clinical Rx Pad"}
                  </p>
                </div>
              </Link>

              {/* Option 3: School Routine */}
              <Link
                href="/templates/school-exam-routine"
                onClick={() => setShowCreateModal(false)}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-slate-800 transition flex items-start gap-3 group"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600">
                    {t("schoolRoutineOption")}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {lang === "bn" ? "পরীক্ষার রুটিন ও মার্কশিট" : "Exam Schedule & Marksheet"}
                  </p>
                </div>
              </Link>

              {/* Option 4: POS Thermal */}
              <Link
                href="/templates/restaurant-pos-bill"
                onClick={() => setShowCreateModal(false)}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-slate-800 transition flex items-start gap-3 group"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Printer className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600">
                    {t("posThermalOption")}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {lang === "bn" ? "৮০মিমি রোল পেপার স্লিপ" : "80mm Roll Printer"}
                  </p>
                </div>
              </Link>
            </div>

            <div className="pt-2 text-center border-t border-slate-100 dark:border-slate-800">
              <Link
                href="/templates"
                onClick={() => setShowCreateModal(false)}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                <span>{lang === "bn" ? "অথবা সকল ৬০টি টেমপ্লেট দেখুন →" : "Or explore all 60 templates →"}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
