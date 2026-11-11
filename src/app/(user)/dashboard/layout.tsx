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
} from "lucide-react";
import { UserDashboardProvider, useUserDashboard } from "@/context/UserDashboardContext";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const { theme, toggleTheme, lang, toggleLang, mobileMenuOpen, setMobileMenuOpen, t } = useUserDashboard();

  const [localPresetName, setLocalPresetName] = useState<string>("");

  useEffect(() => {
    // Check local preset
    const savedLocal = localStorage.getItem("freedocforge_active_preset");
    if (savedLocal) {
      try {
        const parsed = JSON.parse(savedLocal);
        if (parsed.businessName) setLocalPresetName(parsed.businessName);
      } catch (e) {}
    }

    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  const navItems = [
    { label: t("overviewQuickPrint"), href: "/dashboard", icon: Home },
    { label: t("myShopPreset"), href: "/dashboard/shop-profile", icon: Store },
    { label: t("savedDocuments"), href: "/dashboard/history", icon: FileText },
    { label: t("aiTemplateDesigner"), href: "/dashboard/ai-designer", icon: Sparkles, badge: "AI" },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* MOBILE BACKDROP OVERLAY */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* USER SIDEBAR (Responsive drawer for mobile, static for desktop) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between shrink-0 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Brand & Mobile Close button */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {t("dashboardTitle")}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {t("activeStatus")}
                </span>
              </div>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 md:hidden"
              title={t("closeMenu")}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Shop Badge */}
          <div className="m-4 p-3.5 bg-gradient-to-br from-slate-100 to-slate-200/60 dark:from-slate-800/80 dark:to-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                {t("activeShop")}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
              {localPresetName || user?.profiles?.[0]?.businessName || user?.name || "Stylist Fashion BD"}
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {user?.email || "Free Preset Active"}
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
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
                          : "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
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

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <Link
            href="/templates/f-commerce-invoice"
            className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" /> {t("instantPrintMemo")}
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 font-semibold py-2 rounded-xl text-xs transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> {t("logOut")}
          </button>
        </div>
      </aside>

      {/* USER MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP HEADER */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 transition-colors">
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
                {t("welcomeBack")}, {user?.name?.split(" ")[0] || "Business Owner"}!
              </h1>
              <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400">
                {t("presetsReady")}
              </p>
            </div>
          </div>

          {/* CONTROLS: THEME TOGGLE, LANGUAGE TOGGLE & USER ID */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher Button */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100/70 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
              title="Change Language / ভাষা পরিবর্তন"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{lang === "en" ? "বাংলা" : "EN"}</span>
            </button>

            {/* Dark / Light Mode Toggle Button */}
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
              href="/"
              className="hidden lg:inline-block text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              {t("publicGallery")}
            </Link>

            <span className="hidden sm:inline-block text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
              #{user?.id?.substring(0, 6) || "..."}
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserDashboardProvider>
      <DashboardContent>{children}</DashboardContent>
    </UserDashboardProvider>
  );
}
