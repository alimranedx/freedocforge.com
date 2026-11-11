"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, User, Shield, LogOut, Sun, Moon, Globe, Menu, X } from "lucide-react";
import { useGlobalSettings } from "@/context/GlobalSettingsContext";

export default function Navbar() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme, lang, toggleLang, t } = useGlobalSettings();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 print:hidden transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs group-hover:bg-blue-700 transition">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              FreeDocForge<span className="text-blue-600 dark:text-blue-400 text-xs px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 font-bold">.com</span>
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-400 block -mt-0.5 font-medium">
              Free Printable & Smart Document Studio
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link href="/templates" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
            {t("navTemplates")}
          </Link>
          <Link href="/templates/f-commerce-invoice" className="hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center gap-1">
            {t("navInvoice")}
            <span className="text-[9px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold px-1.5 py-0.5 rounded">
              BD
            </span>
          </Link>
          <Link href="/templates/school-result-sheet" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
            {t("navSchools")}
          </Link>
          <Link href="/templates/doctor-prescription" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
            {t("navPrescriptions")}
          </Link>
        </nav>

        {/* Right CTA / Controls / Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher Button (Works on public site without login) */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100/70 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
            title="Language / ভাষা পরিবর্তন"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{lang === "en" ? "বাংলা" : "EN"}</span>
          </button>

          {/* Dark / Light Mode Toggle Button (Works on public site without login) */}
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

          {/* User Auth Buttons */}
          {user ? (
            <div className="hidden sm:flex items-center gap-2">
              {user.role === "ADMIN" ? (
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-1 text-xs bg-red-600 hover:bg-red-700 text-white font-semibold px-3 py-2 rounded-lg transition"
                >
                  <Shield className="w-3.5 h-3.5" /> {t("adminPanel")}
                </Link>
              ) : null}

              <Link
                href="/dashboard"
                className="flex items-center gap-1 text-xs bg-blue-50 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-slate-700 text-blue-700 dark:text-blue-400 font-semibold px-3 py-2 rounded-lg transition border border-blue-200 dark:border-slate-700"
              >
                <User className="w-3.5 h-3.5" /> {user.name.split(" ")[0]}
              </Link>

              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-lg transition cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-2.5 py-2 transition"
              >
                {t("navSignIn")}
              </Link>
              <Link
                href="/register"
                className="text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg shadow-xs transition"
              >
                {t("navSaveShop")}
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 -mr-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE COLLAPSIBLE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-5 space-y-3">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            <Link
              href="/templates"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {t("navTemplates")}
            </Link>
            <Link
              href="/templates/f-commerce-invoice"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
            >
              <span>{t("navInvoice")}</span>
              <span className="text-[9px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold px-1.5 py-0.5 rounded">
                BD
              </span>
            </Link>
            <Link
              href="/templates/school-result-sheet"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {t("navSchools")}
            </Link>
            <Link
              href="/templates/doctor-prescription"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {t("navPrescriptions")}
            </Link>
          </nav>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
            {user ? (
              <div className="w-full flex items-center justify-between">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-slate-800 px-3 py-2 rounded-lg"
                >
                  {user.name}'s Shop
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs text-red-600 dark:text-red-400 font-semibold"
                >
                  {t("logOut")}
                </button>
              </div>
            ) : (
              <div className="w-full grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center text-xs font-semibold py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                >
                  {t("navSignIn")}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center text-xs font-semibold py-2.5 rounded-lg bg-blue-600 text-white shadow-xs"
                >
                  {t("navSaveShop")}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
