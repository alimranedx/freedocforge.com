"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  Printer,
  Calendar,
  Trash2,
  ExternalLink,
  Filter,
  ShoppingBag,
  GraduationCap,
  Stethoscope,
  Sparkles,
  Download,
  Plus,
} from "lucide-react";
import { useUserDashboard } from "@/context/UserDashboardContext";

interface HistoryItem {
  id: string;
  templateSlug: string;
  templateTitle: string;
  category: "Business" | "Education" | "Healthcare";
  documentNumber: string;
  recipientName: string;
  amountOrDetails: string;
  date: string;
  status: "Printed" | "Saved" | "Paid";
}

const DEFAULT_DEMO_HISTORY: HistoryItem[] = [
  {
    id: "hist-1",
    templateSlug: "f-commerce-invoice",
    templateTitle: "Facebook Shop & F-Commerce Cash Memo",
    category: "Business",
    documentNumber: "INV-2026-089",
    recipientName: "Md. Tanvir Ahmed (Dhanmondi)",
    amountOrDetails: "৳ 3,470 (COD Due)",
    date: "2026-11-11",
    status: "Printed",
  },
  {
    id: "hist-2",
    templateSlug: "doctor-prescription",
    templateTitle: "Doctor & Clinic Prescription Pad (Rx)",
    category: "Healthcare",
    documentNumber: "RX-5502",
    recipientName: "Mrs. Nasrin Akter (42y)",
    amountOrDetails: "Tab. Napa, Tab. Fexo",
    date: "2026-11-10",
    status: "Printed",
  },
  {
    id: "hist-3",
    templateSlug: "school-result-sheet",
    templateTitle: "School & Coaching Result Sheet",
    category: "Education",
    documentNumber: "MARKS-901",
    recipientName: "Sadia Rahman (Class 9)",
    amountOrDetails: "GPA: 5.00 (A+)",
    date: "2026-11-09",
    status: "Saved",
  },
  {
    id: "hist-4",
    templateSlug: "restaurant-pos-bill",
    templateTitle: "Restaurant POS Thermal Bill (80mm)",
    category: "Business",
    documentNumber: "BILL-5491",
    recipientName: "Table 4 - Dine In",
    amountOrDetails: "৳ 1,420 (Paid Full)",
    date: "2026-11-08",
    status: "Paid",
  },
];

export default function SavedDocumentsHistoryPage() {
  const { lang, t } = useUserDashboard();
  const [history, setHistory] = useState<HistoryItem[]>(DEFAULT_DEMO_HISTORY);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "Business" | "Education" | "Healthcare">("all");

  useEffect(() => {
    // Load from localStorage if user generated real docs
    const saved = localStorage.getItem("freedocforge_history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHistory(parsed);
        }
      } catch (e) {
        console.error("History parse error", e);
      }
    }
  }, []);

  const handleDelete = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    localStorage.setItem("freedocforge_history", JSON.stringify(updated));
  };

  const filteredHistory = history.filter((item) => {
    if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      return (
        item.documentNumber.toLowerCase().includes(q) ||
        item.recipientName.toLowerCase().includes(q) ||
        item.templateTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold mb-3">
            <FileText className="w-3.5 h-3.5" />
            <span>{lang === "bn" ? "ডকুমেন্ট প্রিন্ট ও জেনারেট হিস্ট্রি" : "Saved Documents & Print Archive"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {lang === "bn" ? "সংরক্ষিত ডকুমেন্টস ও প্রিন্ট রেকর্ড" : "Generated Documents History"}
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
            {lang === "bn"
              ? "আপনার প্রিন্ট করা প্রতিটি ক্যাশ মেমো, প্রেসক্রিপশন ও মার্কশিট এখানে সংরক্ষিত থাকে। যেকোনো সময় রি-প্রিন্ট বা এডিট করুন।"
              : "Review, re-print, and manage all your generated customer memos, doctor prescriptions, and student report cards."}
          </p>
        </div>

        <Link
          href="/templates"
          className="flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-bold px-5 py-3 rounded-xl text-xs sm:text-sm transition shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === "bn" ? "নতুন ডকুমেন্ট বানান" : "Create New Document"}</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: "all", label: lang === "bn" ? "সকল (All)" : "All", icon: FileText },
            { id: "Business", label: lang === "bn" ? "দোকান ও ব্যবসা" : "Shop", icon: ShoppingBag },
            { id: "Education", label: lang === "bn" ? "স্কুল ও শিক্ষা" : "School", icon: GraduationCap },
            { id: "Healthcare", label: lang === "bn" ? "চিকিৎসা" : "Medical", icon: Stethoscope },
          ].map((cat) => {
            const Icon = cat.icon;
            const isActive = categoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px] sm:min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              lang === "bn"
                ? "ডকুমেন্ট নং বা গ্রহীতার নাম খুঁজুন..."
                : "Search by number or recipient..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
        </div>
      </div>

      {/* History Items Table / Card Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        {filteredHistory.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredHistory.map((item) => {
              const isShop = item.category === "Business";
              const isSchool = item.category === "Education";
              const isMedical = item.category === "Healthcare";

              return (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                        isShop
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : isSchool
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                          : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                      }`}
                    >
                      {isShop && <ShoppingBag className="w-5 h-5" />}
                      {isSchool && <GraduationCap className="w-5 h-5" />}
                      {isMedical && <Stethoscope className="w-5 h-5" />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                          {item.documentNumber}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                          <Calendar className="w-3 h-3" />
                          <span>{item.date}</span>
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate mt-1">
                        {item.recipientName}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {item.templateTitle} • <strong className="text-slate-700 dark:text-slate-300">{item.amountOrDetails}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                    <Link
                      href={`/templates/${item.templateSlug}`}
                      className="flex items-center gap-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl transition shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>{lang === "bn" ? "রি-প্রিন্ট" : "Re-Print"}</span>
                    </Link>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition cursor-pointer"
                      title={lang === "bn" ? "ডিলিট করুন" : "Delete Record"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 p-6">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {lang === "bn" ? "কোনো সংরক্ষিত ডকুমেন্ট পাওয়া যায়নি" : "No documents found"}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {lang === "bn"
                ? "টেমপ্লেট গ্যালারি থেকে যেকোনো ফরম্যাট তৈরি ও প্রিন্ট করলে তা স্বয়ংক্রিয়ভাবে এখানে তালিকাভুক্ত হবে।"
                : "Whenever you edit or print a template, it will automatically be archived here."}
            </p>
            <Link
              href="/templates"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-xl transition"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === "bn" ? "টেমপ্লেট ব্রাউজ করুন" : "Browse Templates"}</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
