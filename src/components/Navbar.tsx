"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  FileText,
  User,
  Shield,
  LogOut,
  Sun,
  Moon,
  Globe,
  Menu,
  X,
  ChevronDown,
  ShoppingBag,
  GraduationCap,
  Stethoscope,
  Store,
  Receipt,
  Calendar,
  Clock,
  ClipboardList,
} from "lucide-react";
import { useGlobalSettings } from "@/context/GlobalSettingsContext";

export default function Navbar() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<"shop" | "school" | "medical" | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<"shop" | "school" | "medical" | null>(null);

  const { theme, toggleTheme, lang, toggleLang, t } = useGlobalSettings();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setUser(data.user);
        }
      })
      .catch(() => {});

    // Close dropdown on outside click
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const isAdmin = user?.role === "ADMIN";
    await fetch("/api/auth/logout", { method: "POST" });
    if (isAdmin) {
      window.location.href = "/admin/login";
    } else {
      window.location.href = "/login";
    }
  };

  const shopItems = [
    {
      title: t("navCashMemo"),
      href: "/templates/f-commerce-invoice",
      desc: lang === "bn" ? "ফেসবুক শপ ও অনলাইন ক্যাশ মেমো" : "F-Commerce & online retail cash memo",
      badge: "BD Special",
    },
    {
      title: t("navPosReceipt"),
      href: "/templates/restaurant-pos-bill",
      desc: lang === "bn" ? "রেস্তোরাঁ ও সুপারশপ ৮০মিমি রসিদ" : "Thermal 80mm POS food & retail receipt",
      badge: "80mm POS",
    },
    {
      title: t("navDeliveryChalan"),
      href: "/templates/shop-delivery-chalan",
      desc: lang === "bn" ? "পণ্য ডেলিভারি চালান ও প্যাকিং স্লিপ" : "Product dispatch & delivery chalan",
      badge: "A4 Slip",
    },
    {
      title: t("navQuotation"),
      href: "/templates/shop-quotation",
      desc: lang === "bn" ? "কাস্টমার কোটেশন ও প্রফর্মা বিল" : "Official quotation & proforma bill",
      badge: "Business",
    },
  ];

  const schoolItems = [
    {
      title: t("navMarksheet"),
      href: "/templates/school-result-sheet",
      desc: lang === "bn" ? "বার্ষিক ও সেমিস্টার মূল্যায়ন মার্কশিট" : "Annual & semester GPA progress card",
      badge: lang === "bn" ? "গ্রেড" : "GPA",
    },
    {
      title: t("navClassRoutine"),
      href: "/templates/school-class-routine",
      desc: lang === "bn" ? "সাপ্তাহিক স্কুল ও কলেজ ক্লাস রুটিন" : "Weekly periods & teacher timetable",
      badge: "Routine",
    },
    {
      title: t("navExamRoutine"),
      href: "/templates/school-exam-routine",
      desc: lang === "bn" ? "পরীক্ষার তারিখ ও শিফট রুটিন" : "Exam dates, shifts & room schedule",
      badge: "Exam",
    },
    {
      title: t("navAdmitCard"),
      href: "/templates/school-admit-card",
      desc: lang === "bn" ? "ছাত্র-ছাত্রী পরীক্ষার প্রবেশপত্র" : "Exam hall pass & student admit card",
      badge: "Admit",
    },
  ];

  const medicalItems = [
    {
      title: t("navPrescription"),
      href: "/templates/doctor-prescription",
      desc: lang === "bn" ? "ডাক্তার ও ক্লিনিকের ব্যবস্থাপত্র" : "Doctor Rx prescription with diagnosis & doses",
      badge: "Rx Pad",
    },
    {
      title: t("navPatientSerial"),
      href: "/templates/medical-appointment-token",
      desc: lang === "bn" ? "রোগীর সিরিয়াল ও অ্যাপয়েন্টমেন্ট স্লিপ" : "Patient queue number & chamber token",
      badge: "Serial",
    },
    {
      title: t("navDischargeSlip"),
      href: "/templates/medical-discharge-slip",
      desc: lang === "bn" ? "হাসপাতাল রিলিজ ও ডিসচার্জ সামারি" : "Hospital patient discharge certificate",
      badge: "Release",
    },
    {
      title: t("navMoneyReceipt"),
      href: "/templates/medical-money-receipt",
      desc: lang === "bn" ? "ডায়াগনস্টিক টেস্ট ও ফি জমার রসিদ" : "Investigation payment receipt & billing",
      badge: "Receipt",
    },
  ];

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 print:hidden transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
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

        {/* Desktop Navigation Links with 3 Rich Dropdowns */}
        <nav
          ref={dropdownRef}
          className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-medium text-slate-600 dark:text-slate-300"
        >
          {/* Gallery Link */}
          <Link
            href="/templates"
            className="px-3 py-2 rounded-lg hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            {t("navTemplates")}
          </Link>

          {/* 1. SHOP CATEGORY DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setActiveDropdown(activeDropdown === "shop" ? null : "shop")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer ${
                activeDropdown === "shop" ? "text-blue-600 dark:text-blue-400 bg-slate-50 dark:bg-slate-800 font-semibold" : ""
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t("navShop")}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === "shop" ? "rotate-180" : ""}`} />
            </button>

            {activeDropdown === "shop" && (
              <div className="absolute left-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t("navShop")}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t("navShopDesc")}</p>
                </div>
                <div className="p-1.5 space-y-0.5">
                  {shopItems.map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-start justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition group"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                      <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-1.5 py-0.5 rounded shrink-0 ml-2">
                        {item.badge}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. SCHOOL CATEGORY DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setActiveDropdown(activeDropdown === "school" ? null : "school")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer ${
                activeDropdown === "school" ? "text-blue-600 dark:text-blue-400 bg-slate-50 dark:bg-slate-800 font-semibold" : ""
              }`}
            >
              <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{t("navSchool")}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === "school" ? "rotate-180" : ""}`} />
            </button>

            {activeDropdown === "school" && (
              <div className="absolute left-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t("navSchool")}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t("navSchoolDesc")}</p>
                </div>
                <div className="p-1.5 space-y-0.5">
                  {schoolItems.map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-start justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition group"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                      <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-1.5 py-0.5 rounded shrink-0 ml-2">
                        {item.badge}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. MEDICAL CATEGORY DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setActiveDropdown(activeDropdown === "medical" ? null : "medical")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer ${
                activeDropdown === "medical" ? "text-blue-600 dark:text-blue-400 bg-slate-50 dark:bg-slate-800 font-semibold" : ""
              }`}
            >
              <Stethoscope className="w-4 h-4 text-rose-500" />
              <span>{t("navMedical")}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === "medical" ? "rotate-180" : ""}`} />
            </button>

            {activeDropdown === "medical" && (
              <div className="absolute left-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t("navMedical")}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t("navMedicalDesc")}</p>
                </div>
                <div className="p-1.5 space-y-0.5">
                  {medicalItems.map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-start justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition group"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                      <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-1.5 py-0.5 rounded shrink-0 ml-2">
                        {item.badge}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right CTA / Controls / Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher Button (Works on public site without login) */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100/70 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
            title={lang === "en" ? "বাংলা ভাষায় পরিবর্তন করুন" : "Switch to English"}
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
              ) : (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1 text-xs bg-blue-50 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-slate-700 text-blue-700 dark:text-blue-400 font-semibold px-3 py-2 rounded-lg transition border border-blue-200 dark:border-slate-700"
                >
                  <User className="w-3.5 h-3.5" /> {user.name.split(" ")[0]}
                </Link>
              )}

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
                className="text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl shadow-xs hover:shadow transition flex items-center gap-1.5"
              >
                <Store className="w-3.5 h-3.5" />
                <span>{t("navSaveShop")}</span>
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

      {/* MOBILE COLLAPSIBLE ACCORDION MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-5 space-y-3">
          <nav className="flex flex-col space-y-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">
            <Link
              href="/templates"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span>{t("navTemplates")}</span>
            </Link>

            {/* Mobile Accordion: SHOP */}
            <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setMobileExpanded(mobileExpanded === "shop" ? null : "shop")}
                className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 text-left font-bold text-xs"
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-emerald-600" />
                  {t("navShop")}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${mobileExpanded === "shop" ? "rotate-180" : ""}`} />
              </button>
              {mobileExpanded === "shop" && (
                <div className="p-2 space-y-1 bg-white dark:bg-slate-900">
                  {shopItems.map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{item.title}</span>
                        <span className="text-[9px] bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-500">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">{item.desc}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Accordion: SCHOOL */}
            <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setMobileExpanded(mobileExpanded === "school" ? null : "school")}
                className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 text-left font-bold text-xs"
              >
                <span className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  {t("navSchool")}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${mobileExpanded === "school" ? "rotate-180" : ""}`} />
              </button>
              {mobileExpanded === "school" && (
                <div className="p-2 space-y-1 bg-white dark:bg-slate-900">
                  {schoolItems.map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{item.title}</span>
                        <span className="text-[9px] bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-500">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">{item.desc}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Accordion: MEDICAL */}
            <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setMobileExpanded(mobileExpanded === "medical" ? null : "medical")}
                className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 text-left font-bold text-xs"
              >
                <span className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-rose-500" />
                  {t("navMedical")}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${mobileExpanded === "medical" ? "rotate-180" : ""}`} />
              </button>
              {mobileExpanded === "medical" && (
                <div className="p-2 space-y-1 bg-white dark:bg-slate-900">
                  {medicalItems.map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{item.title}</span>
                        <span className="text-[9px] bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-500">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">{item.desc}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
            {user ? (
              <div className="w-full flex items-center justify-between">
                {user.role === "ADMIN" ? (
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg flex items-center gap-1.5"
                  >
                    <Shield className="w-3.5 h-3.5" /> {t("adminPanel")}
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-slate-800 px-3 py-2 rounded-lg"
                  >
                    {user.name}'s Shop
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-xs text-red-600 dark:text-red-400 font-semibold cursor-pointer"
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
                  className="text-center text-xs font-bold py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>{t("navSaveShop")}</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
