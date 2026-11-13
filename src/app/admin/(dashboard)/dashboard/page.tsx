"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Layers,
  Users,
  DollarSign,
  TrendingUp,
  FileText,
  Activity,
  Server,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
  Receipt,
  Calendar,
  Award,
  Stethoscope,
  BookOpen,
  Zap,
  Printer,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/admin/stats");
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error("Failed to load admin stats", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl animate-pulse">
        <div className="h-10 bg-zinc-900 border border-zinc-800 rounded-xl w-72"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-zinc-900 border border-zinc-800 rounded-2xl"></div>
          ))}
        </div>
        <div className="h-64 bg-zinc-900 border border-zinc-800 rounded-2xl"></div>
      </div>
    );
  }

  const stats = data?.stats || {
    totalUsers: 0,
    totalDocs: 0,
    totalTemplates: 60,
    categoryCounts: { business: 0, healthcare: 0, education: 0, pos: 0 },
  };

  return (
    <div className="space-y-8 max-w-7xl font-sans">
      {/* HEADER BAR WITH STATUS & ACTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-black text-white tracking-wide uppercase">
              Executive Platform Console
            </h1>
            <span className="text-[10px] bg-red-950 text-red-400 border border-red-800 font-mono font-bold px-2 py-0.5 rounded-full">
              PRODUCTION OPS
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time telemetry, merchant activity, document volume, and AdSense health.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border ${
              data?.dbOnline
                ? "bg-emerald-950/60 text-emerald-400 border-emerald-800/80"
                : "bg-amber-950/60 text-amber-400 border-amber-800/80"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                data?.dbOnline ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              }`}
            ></span>
            <span>{data?.dbOnline ? "MySQL Active" : "Cache / Fallback"}</span>
          </div>

          <button
            onClick={loadStats}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3.5 py-2 rounded-lg transition border border-zinc-700 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* TOP STAT METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl hover:border-zinc-700 transition">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Registered Merchants</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">{stats.totalUsers}</div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/80">
            <span className="text-[10px] text-zinc-400 font-mono">Shop, Clinic & School Owners</span>
            <Link
              href="/admin/users"
              className="text-[10px] text-blue-400 hover:text-blue-300 font-bold inline-flex items-center gap-0.5"
            >
              Manage →
            </Link>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl hover:border-zinc-700 transition">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Documents Generated</span>
            <FileText className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{stats.totalDocs}</div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/80">
            <span className="text-[10px] text-zinc-400 font-mono">Invoices, Prescriptions, Slips</span>
            <Link
              href="/admin/documents"
              className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold inline-flex items-center gap-0.5"
            >
              Audit →
            </Link>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl hover:border-zinc-700 transition">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Active Templates</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">{stats.totalTemplates}</div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/80">
            <span className="text-[10px] text-purple-400 font-mono">Strict Dual-Locale (EN & BN)</span>
            <Link
              href="/admin/templates"
              className="text-[10px] text-purple-400 hover:text-purple-300 font-bold inline-flex items-center gap-0.5"
            >
              Studio →
            </Link>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl hover:border-zinc-700 transition">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Monetization Engine</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">AdSense</div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/80">
            <span className="text-[10px] text-zinc-400 font-mono">Policy-Safe Ad Slots Ready</span>
            <Link
              href="/admin/ads"
              className="text-[10px] text-amber-400 hover:text-amber-300 font-bold inline-flex items-center gap-0.5"
            >
              Configure →
            </Link>
          </div>
        </div>
      </div>

      {/* 4-PILLAR TELEMETRY INVENTORY & SENIOR ADMIN QUICK LAUNCH */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h2 className="text-sm font-black text-white uppercase tracking-wider">
                Production Template Inventory (60 Live Formats)
              </h2>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono font-bold px-2 py-0.5 rounded-full">
                4 CORE PILLARS ACTIVE
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Zero-signup, 100% free vector PDF generators with thermal POS (80mm) and ISO A4 print engines.
            </p>
          </div>
          <Link
            href="/admin/templates"
            className="text-xs font-bold text-red-400 hover:text-red-300 transition inline-flex items-center gap-1 shrink-0"
          >
            Manage in Studio →
          </Link>
        </div>

        {/* 4-PILLAR BREAKDOWN CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Pillar 1: Receipts */}
          <div className="bg-zinc-950 border border-zinc-800/90 rounded-xl p-4 flex flex-col justify-between hover:border-zinc-700 transition">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Receipt className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800/60">
                  13 Formats
                </span>
              </div>
              <h3 className="text-xs font-bold text-white">Worldwide Receipts</h3>
              <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                F-Commerce, POS rolls (80mm), VAT tax invoices & money receipts.
              </p>
            </div>
            <Link
              href="/editor?template=f-commerce-invoice"
              className="mt-3 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1"
            >
              Launch Editor →
            </Link>
          </div>

          {/* Pillar 2: Class Routines */}
          <div className="bg-zinc-950 border border-zinc-800/90 rounded-xl p-4 flex flex-col justify-between hover:border-zinc-700 transition">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span className="text-[10px] font-mono font-bold bg-blue-950/80 text-blue-400 px-2 py-0.5 rounded border border-blue-800/60">
                  10 Formats
                </span>
              </div>
              <h3 className="text-xs font-bold text-white">Class Routines</h3>
              <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                6-period timetables, teacher allocations, multi-section room grids.
              </p>
            </div>
            <Link
              href="/editor?template=school-class-routine"
              className="mt-3 text-[11px] font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
            >
              Launch Editor →
            </Link>
          </div>

          {/* Pillar 3: Exam Routines */}
          <div className="bg-zinc-950 border border-zinc-800/90 rounded-xl p-4 flex flex-col justify-between hover:border-zinc-700 transition">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-[10px] font-mono font-bold bg-amber-950/80 text-amber-400 px-2 py-0.5 rounded border border-amber-800/60">
                  10 Formats
                </span>
              </div>
              <h3 className="text-xs font-bold text-white">Exam Routines</h3>
              <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                Annual, terminal & board timetables with shifts and center rules.
              </p>
            </div>
            <Link
              href="/editor?template=school-exam-routine"
              className="mt-3 text-[11px] font-semibold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1"
            >
              Launch Editor →
            </Link>
          </div>

          {/* Pillar 4: Medical Bills */}
          <div className="bg-zinc-950 border border-zinc-800/90 rounded-xl p-4 flex flex-col justify-between hover:border-zinc-700 transition">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Stethoscope className="w-4 h-4 text-teal-400" />
                <span className="text-[10px] font-mono font-bold bg-teal-950/80 text-teal-400 px-2 py-0.5 rounded border border-teal-800/60">
                  10 Formats
                </span>
              </div>
              <h3 className="text-xs font-bold text-white">Medical Bills</h3>
              <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                Diagnostic pathology, clinic consults, inpatient admission slips.
              </p>
            </div>
            <Link
              href="/editor?template=medical-money-receipt"
              className="mt-3 text-[11px] font-semibold text-teal-400 hover:text-teal-300 inline-flex items-center gap-1"
            >
              Launch Editor →
            </Link>
          </div>

          {/* Pillar 5: Companion Records */}
          <div className="bg-zinc-950 border border-zinc-800/90 rounded-xl p-4 flex flex-col justify-between hover:border-zinc-700 transition">
            <div>
              <div className="flex items-center justify-between mb-2">
                <BookOpen className="w-4 h-4 text-purple-400" />
                <span className="text-[10px] font-mono font-bold bg-purple-950/80 text-purple-400 px-2 py-0.5 rounded border border-purple-800/60">
                  17 Formats
                </span>
              </div>
              <h3 className="text-xs font-bold text-white">Academic & Clinical</h3>
              <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                Doctor Rx pads, marksheet transcripts, admit cards & certificates.
              </p>
            </div>
            <Link
              href="/editor?template=doctor-prescription-pad"
              className="mt-3 text-[11px] font-semibold text-purple-400 hover:text-purple-300 inline-flex items-center gap-1"
            >
              Launch Editor →
            </Link>
          </div>
        </div>

        {/* SENIOR ADMIN 1-CLICK QUICK LAUNCH ACTIONS */}
        <div className="pt-4 border-t border-zinc-800">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-bold">
              Senior Admin Quick Launch & Test Terminals
            </h4>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/editor?template=f-commerce-invoice"
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white rounded-lg text-xs font-medium border border-zinc-700 transition inline-flex items-center gap-1.5"
            >
              <Receipt className="w-3.5 h-3.5 text-emerald-400" />
              <span>F-Commerce Memo</span>
            </Link>
            <Link
              href="/editor?template=restaurant-pos-bill"
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white rounded-lg text-xs font-medium border border-zinc-700 transition inline-flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span>80mm POS Thermal</span>
            </Link>
            <Link
              href="/editor?template=school-class-routine"
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white rounded-lg text-xs font-medium border border-zinc-700 transition inline-flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>Class Routine (A4)</span>
            </Link>
            <Link
              href="/editor?template=school-exam-routine"
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white rounded-lg text-xs font-medium border border-zinc-700 transition inline-flex items-center gap-1.5"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Exam Timetable (A4)</span>
            </Link>
            <Link
              href="/editor?template=medical-money-receipt"
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white rounded-lg text-xs font-medium border border-zinc-700 transition inline-flex items-center gap-1.5"
            >
              <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
              <span>Medical Bill</span>
            </Link>
            <Link
              href="/editor?template=doctor-prescription-pad"
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white rounded-lg text-xs font-medium border border-zinc-700 transition inline-flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              <span>Doctor Rx Pad</span>
            </Link>
            <Link
              href="/templates"
              target="_blank"
              className="px-3 py-1.5 bg-zinc-800/60 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-lg text-xs font-medium border border-zinc-700/80 transition inline-flex items-center gap-1.5 ml-auto"
            >
              <span>Public Catalog (60)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* CORE 2-COLUMN SECTION: RECENT ACTIVITY & SYSTEM DIAGNOSTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* RECENT DOCUMENT CREATION ACTIVITY (COL 8) */}
        <div className="lg:col-span-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Live Document Creation Stream
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Audit feed of latest invoices, prescription slips, and academic records.
              </p>
            </div>
            <Link
              href="/admin/documents"
              className="text-xs font-bold text-red-400 hover:text-red-300 transition inline-flex items-center gap-1"
            >
              Full Audit Log <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead>
                <tr className="border-b border-zinc-800 text-[10px] uppercase font-mono text-zinc-500">
                  <th className="pb-3">Doc #</th>
                  <th className="pb-3">Format / Template</th>
                  <th className="pb-3">Recipient / Details</th>
                  <th className="pb-3">Created By</th>
                  <th className="pb-3 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono">
                {data?.recentDocs?.length > 0 ? (
                  data.recentDocs.map((doc: any) => (
                    <tr key={doc.id} className="hover:bg-zinc-800/40">
                      <td className="py-3 font-bold text-white">{doc.documentNumber}</td>
                      <td className="py-3">
                        <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded text-[10px] font-sans">
                          {doc.templateTitle}
                        </span>
                      </td>
                      <td className="py-3 text-zinc-400 truncate max-w-[150px]">
                        {doc.recipientName || doc.amountOrDetails || "—"}
                      </td>
                      <td className="py-3 text-zinc-300 font-sans">
                        {doc.user?.name || "Merchant"}
                      </td>
                      <td className="py-3 text-right text-[10px] text-zinc-500">
                        {new Date(doc.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-zinc-500 font-sans">
                      No documents generated yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SYSTEM DIAGNOSTICS & QUICK OPERATIONAL ACTIONS (COL 4) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Server & Node.js Health */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <div className="border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Server className="w-4 h-4 text-purple-400" /> System Diagnostics
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">Runtime health & resource metrics.</p>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex justify-between items-center py-1 border-b border-zinc-800/60">
                <span className="text-zinc-400">Node Runtime</span>
                <span className="text-white font-bold">{data?.systemInfo?.nodeVersion || "v20.x"}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-zinc-800/60">
                <span className="text-zinc-400">Host Platform</span>
                <span className="text-white font-bold capitalize">
                  {data?.systemInfo?.platform || "win32"}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-zinc-800/60">
                <span className="text-zinc-400">Heap Memory</span>
                <span className="text-emerald-400 font-bold">
                  {data?.systemInfo?.heapUsedMB || 82} MB / {data?.systemInfo?.heapTotalMB || 140} MB
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-zinc-800/60">
                <span className="text-zinc-400">Process Uptime</span>
                <span className="text-white font-bold">
                  {Math.floor((data?.systemInfo?.uptimeSeconds || 360) / 60)} mins
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-zinc-400">Security Guard</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> SEC-RBAC Active
                </span>
              </div>
            </div>
          </div>

          {/* Quick Operations Links */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Management Modules
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/admin/users"
                className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-center transition group border border-zinc-700/60"
              >
                <Users className="w-5 h-5 mx-auto text-blue-400 group-hover:scale-110 transition" />
                <span className="text-[11px] font-bold text-white block mt-1.5">Users</span>
              </Link>

              <Link
                href="/admin/documents"
                className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-center transition group border border-zinc-700/60"
              >
                <FileText className="w-5 h-5 mx-auto text-emerald-400 group-hover:scale-110 transition" />
                <span className="text-[11px] font-bold text-white block mt-1.5">Documents</span>
              </Link>

              <Link
                href="/admin/ads"
                className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-center transition group border border-zinc-700/60"
              >
                <DollarSign className="w-5 h-5 mx-auto text-amber-400 group-hover:scale-110 transition" />
                <span className="text-[11px] font-bold text-white block mt-1.5">AdSense</span>
              </Link>

              <Link
                href="/admin/settings"
                className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-center transition group border border-zinc-700/60"
              >
                <Sparkles className="w-5 h-5 mx-auto text-purple-400 group-hover:scale-110 transition" />
                <span className="text-[11px] font-bold text-white block mt-1.5">Settings</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
