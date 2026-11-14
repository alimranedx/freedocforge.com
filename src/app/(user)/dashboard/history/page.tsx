"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  Printer,
  Calendar,
  Trash2,
  GraduationCap,
  Stethoscope,
  Plus,
  Receipt,
  Eye,
  Share2,
  X,
  Clock,
} from "lucide-react";
import { useUserDashboard } from "@/context/UserDashboardContext";
import ShareDocumentModal from "@/components/ShareDocumentModal";

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
    date: "2026-11-12",
    status: "Printed",
  },
  {
    id: "hist-2",
    templateSlug: "school-class-routine",
    templateTitle: "Primary / Elementary School Weekly Timetable",
    category: "Education",
    documentNumber: "ROUTINE-2026-09",
    recipientName: "Class 9 (Science) - Morning Shift",
    amountOrDetails: "6 Periods • Room 402",
    date: "2026-11-11",
    status: "Printed",
  },
  {
    id: "hist-3",
    templateSlug: "school-exam-routine",
    templateTitle: "School Annual & Term Final Exam Routine",
    category: "Education",
    documentNumber: "EXAM-2026-T2",
    recipientName: "Secondary Term Final Candidates",
    amountOrDetails: "10 Subjects • Morning Shift",
    date: "2026-11-10",
    status: "Saved",
  },
  {
    id: "hist-4",
    templateSlug: "medical-money-receipt",
    templateTitle: "Diagnostic Center Test Bill & Money Receipt",
    category: "Healthcare",
    documentNumber: "BILL-2026-904",
    recipientName: "Md. Rafiqul Islam (48y)",
    amountOrDetails: "৳ 3,400 (Advance ৳1,600)",
    date: "2026-11-09",
    status: "Paid",
  },
  {
    id: "hist-5",
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
  const { lang } = useUserDashboard();
  const [history, setHistory] = useState<HistoryItem[]>(DEFAULT_DEMO_HISTORY);
  const [searchQuery, setSearchQuery] = useState("");
  const [pillarFilter, setPillarFilter] = useState<
    "all" | "receipts" | "class-routines" | "exam-routines" | "medical-receipts"
  >("all");
  const [isLoading, setIsLoading] = useState(true);
  const [previewItem, setPreviewItem] = useState<HistoryItem | null>(null);
  const [shareItem, setShareItem] = useState<HistoryItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    // 1. Fetch user documents from cloud API
    fetch("/api/user/documents")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.documents) && data.documents.length > 0) {
          const cloudDocs: HistoryItem[] = data.documents.map((d: any) => ({
            id: d.id,
            templateSlug: d.templateSlug,
            templateTitle: d.templateTitle,
            category: d.category as any,
            documentNumber: d.documentNumber,
            recipientName: d.recipientName || "Valued Recipient",
            amountOrDetails: d.amountOrDetails || "Preset Record",
            date: new Date(d.createdAt).toISOString().split("T")[0],
            status: (d.status || "Saved") as any,
          }));
          setHistory(cloudDocs);
        } else {
          // 2. Fallback to localStorage if offline / no cloud records
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
        }
      })
      .catch(() => {
        const saved = localStorage.getItem("freedocforge_history");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setHistory(parsed);
            }
          } catch (e) {}
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const counts = useMemo(() => {
    let receipts = 0;
    let routines = 0;
    let exams = 0;
    let medicals = 0;

    history.forEach((item) => {
      if (item.category === "Business" || item.templateSlug.includes("invoice") || item.templateSlug.includes("receipt") || item.templateSlug.includes("bill")) {
        receipts++;
      } else if (item.templateSlug.includes("routine") && !item.templateSlug.includes("exam")) {
        routines++;
      } else if (item.templateSlug.includes("exam") || item.templateSlug.includes("test")) {
        exams++;
      } else if (item.category === "Healthcare" || item.templateSlug.includes("medical") || item.templateSlug.includes("doctor")) {
        medicals++;
      }
    });

    return { all: history.length, receipts, routines, exams, medicals };
  }, [history]);

  const handleDelete = async (id: string) => {
    // Optimistic UI removal
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    localStorage.setItem("freedocforge_history", JSON.stringify(updated));
    setDeleteConfirmId(null);
    if (previewItem?.id === id) setPreviewItem(null);

    // Delete from cloud backend API
    try {
      await fetch(`/api/user/documents/${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.warn("Could not delete from cloud:", err);
    }
  };

  const filteredHistory = history.filter((item) => {
    // Pillar Filter
    if (pillarFilter === "receipts") {
      if (item.category !== "Business" && !item.templateSlug.includes("invoice") && !item.templateSlug.includes("receipt") && !item.templateSlug.includes("bill")) {
        return false;
      }
    } else if (pillarFilter === "class-routines") {
      if (!item.templateSlug.includes("routine") || item.templateSlug.includes("exam")) {
        return false;
      }
    } else if (pillarFilter === "exam-routines") {
      if (!item.templateSlug.includes("exam") && !item.templateSlug.includes("test")) {
        return false;
      }
    } else if (pillarFilter === "medical-receipts") {
      if (item.category !== "Healthcare" && !item.templateSlug.includes("medical") && !item.templateSlug.includes("doctor")) {
        return false;
      }
    }

    // Search Query Filter
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
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* 1. COMPACT, HIGH-END BENTO HEADER (Replaces massive empty banner) */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-lg border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/15 text-blue-200 text-xs font-semibold mb-2">
            <Clock className="w-3.5 h-3.5" />
            <span>{lang === "bn" ? "প্রিন্ট ও ডকুমেন্ট সংরক্ষণাগার" : "Document History & Records"}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
            <span>{lang === "bn" ? "সংরক্ষিত ডকুমেন্টস" : "Generated Documents History"}</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-white">
              {history.length}
            </span>
          </h1>
          <p className="text-blue-100/90 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
            {lang === "bn"
              ? "আপনার তৈরি করা প্রতিটি ক্যাশ মেমো, রুটিন বা প্রেসক্রিপশন ১-ক্লিকে রি-প্রিন্ট, এডিট বা হোয়াটসঅ্যাপে পাঠান।"
              : "Review, 1-click re-print, edit, or share your generated documents directly via WhatsApp."}
          </p>
        </div>

        <Link
          href="/templates"
          className="flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition shadow-sm shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === "bn" ? "নতুন ডকুমেন্ট বানান" : "Create New Document"}</span>
        </Link>
      </div>

      {/* 2. THREE QUICK SUMMARY MICRO-CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {lang === "bn" ? "মোট সংরক্ষিত" : "Total Saved"}
            </span>
            <h4 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
              {history.length} {lang === "bn" ? "টি ডকুমেন্ট" : "Records"}
            </h4>
          </div>
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {lang === "bn" ? "ক্যাশ মেমো ও রসিদ" : "Receipts & Memos"}
            </span>
            <h4 className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              {counts.receipts} {lang === "bn" ? "টি ভাউচার" : "Billed Memos"}
            </h4>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Receipt className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {lang === "bn" ? "রি-প্রিন্ট সুবিধা" : "1-Click Re-Print"}
            </span>
            <h4 className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
              100% Free
            </h4>
          </div>
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Printer className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 3. FILTER PILLS & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        {/* Pillar Filter Pills with Live Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: "all", label: lang === "bn" ? "সকল" : "All", count: counts.all, icon: FileText },
            { id: "receipts", label: lang === "bn" ? "ক্যাশ মেমো" : "Receipts", count: counts.receipts, icon: Receipt },
            { id: "class-routines", label: lang === "bn" ? "ক্লাস রুটিন" : "Class", count: counts.routines, icon: Calendar },
            { id: "exam-routines", label: lang === "bn" ? "পরীক্ষার সূচি" : "Exams", count: counts.exams, icon: GraduationCap },
            { id: "medical-receipts", label: lang === "bn" ? "মেডিকেল" : "Medical", count: counts.medicals, icon: Stethoscope },
          ].map((cat) => {
            const Icon = cat.icon;
            const isActive = pillarFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setPillarFilter(cat.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md font-black ${
                    isActive ? "bg-white/25 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative min-w-[220px] sm:min-w-[260px]">
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
            className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 4. HISTORY ITEMS LIST */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-2xs">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/3" />
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
                </div>
                <div className="w-24 h-9 bg-slate-100 dark:bg-slate-800 rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredHistory.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredHistory.map((item) => {
              const isShop = item.category === "Business" || item.templateSlug.includes("invoice") || item.templateSlug.includes("receipt");
              const isSchool = item.category === "Education" || item.templateSlug.includes("routine") || item.templateSlug.includes("exam");
              const isMedical = item.category === "Healthcare" || item.templateSlug.includes("medical") || item.templateSlug.includes("doctor");

              return (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition group"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${
                        isShop
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : isSchool
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                          : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                      }`}
                    >
                      {isShop && <Receipt className="w-5 h-5" />}
                      {isSchool && <GraduationCap className="w-5 h-5" />}
                      {isMedical && <Stethoscope className="w-5 h-5" />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded border border-blue-200/60 dark:border-blue-900/60">
                          {item.documentNumber}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                          <Calendar className="w-3 h-3" />
                          <span>{item.date}</span>
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                            item.status === "Paid"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                              : item.status === "Printed"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          {item.status}
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

                  {/* Actions: Re-Print, WhatsApp, Preview, Delete */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                    {/* Primary Re-Print & Edit */}
                    <Link
                      href={
                        item.id.startsWith("hist-")
                          ? `/templates/${item.templateSlug}`
                          : `/templates/${item.templateSlug}?docId=${item.id}`
                      }
                      className="flex items-center gap-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl transition shadow-xs cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>{lang === "bn" ? "রি-প্রিন্ট / এডিট" : "Re-Print / Edit"}</span>
                    </Link>

                    {/* Multi-Channel Share (WhatsApp, Messenger, SMS) */}
                    <button
                      type="button"
                      onClick={() => setShareItem(item)}
                      className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-xl transition cursor-pointer"
                      title={lang === "bn" ? "হোয়াটসঅ্যাপ ও মেসেঞ্জারে পাঠান" : "Share via WhatsApp & Messenger"}
                    >
                      <Share2 className="w-4 h-4" />
                    </button>

                    {/* Quick Modal Preview */}
                    <button
                      onClick={() => setPreviewItem(item)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
                      title={lang === "bn" ? "প্রিভিউ দেখুন" : "Quick Preview"}
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Delete button with confirmation */}
                    {deleteConfirmId === item.id ? (
                      <div className="flex items-center gap-1 bg-red-50 dark:bg-red-950/50 p-1 rounded-xl">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="px-2 py-1 text-[10px] font-bold bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          {lang === "bn" ? "ডিলিট নিশ্চিত" : "Confirm"}
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(item.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition cursor-pointer"
                        title={lang === "bn" ? "ডিলিট করুন" : "Delete Record"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 p-6">
            <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {lang === "bn" ? "কোনো সংরক্ষিত ডকুমেন্ট পাওয়া যায়নি" : "No documents found"}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              {lang === "bn"
                ? "টেমপ্লেট গ্যালারি থেকে যেকোনো ফরম্যাট তৈরি ও প্রিন্ট করলে তা স্বয়ংক্রিয়ভাবে এখানে তালিকাভুক্ত হবে।"
                : "Whenever you edit or print a template, it will automatically be archived here for instant 1-click re-print."}
            </p>
            <Link
              href="/templates"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-xl transition shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === "bn" ? "টেমপ্লেট ব্রাউজ করুন" : "Browse Templates"}</span>
            </Link>
          </div>
        )}
      </div>

      {/* 5. QUICK MODAL PREVIEW DIALOG */}
      {previewItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                  {previewItem.documentNumber}
                </span>
                <span className="text-xs text-slate-400">{previewItem.date}</span>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {lang === "bn" ? "গ্রহীতার নাম / বিবরণ" : "Recipient / Client Name"}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {previewItem.recipientName}
                </h3>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {lang === "bn" ? "টেমপ্লেটের ধরণ" : "Template Format"}
                </span>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                  {previewItem.templateTitle}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {lang === "bn" ? "হিসাব বা পরিমাণ" : "Amount / Recorded Summary"}
                </span>
                <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {previewItem.amountOrDetails}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setPreviewItem(null)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                {lang === "bn" ? "বন্ধ করুন" : "Close"}
              </button>
              <Link
                href={
                  previewItem.id.startsWith("hist-")
                    ? `/templates/${previewItem.templateSlug}`
                    : `/templates/${previewItem.templateSlug}?docId=${previewItem.id}`
                }
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{lang === "bn" ? "ফুল এডিটরে ওপেন ও রি-প্রিন্ট" : "Open in Editor & Print"}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
      {/* Multi-Channel Share Modal */}
      {shareItem && (
        <ShareDocumentModal
          isOpen={!!shareItem}
          onClose={() => setShareItem(null)}
          documentTitle={shareItem.templateTitle}
          documentNumber={shareItem.documentNumber}
          recipientName={shareItem.recipientName}
          amountOrDetails={shareItem.amountOrDetails}
          fullFormattedText={`*${shareItem.templateTitle}*\nDocument #: ${shareItem.documentNumber}\nRecipient: ${shareItem.recipientName}\nDetails / Total: ${shareItem.amountOrDetails}\nDate: ${shareItem.date}\n\nGenerated via FreeDocForge.com`}
          docLang={lang}
        />
      )}
    </div>
  );
}
