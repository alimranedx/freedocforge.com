"use client";

import React, { useState } from "react";
import {
  Layers,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Eye,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  ShieldAlert,
} from "lucide-react";
import { INITIAL_TEMPLATES } from "@/lib/templates";

export default function AdminDashboardPage() {
  const [adsEnabled, setAdsEnabled] = useState({
    header: true,
    sidebar: true,
    postDownload: true,
  });

  const toggleAd = (key: keyof typeof adsEnabled) => {
    setAdsEnabled((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* TOP STAT METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Active Templates</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">{INITIAL_TEMPLATES.length}</div>
          <span className="text-[10px] text-emerald-400 font-mono mt-1 block">
            5 Categories Covered
          </span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Targeted Markets</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">F-Commerce / BD</div>
          <span className="text-[10px] text-zinc-400 font-mono mt-1 block">
            Schools, Clinics, Food POS
          </span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">AdSense Engine</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">Ready</div>
          <span className="text-[10px] text-zinc-400 font-mono mt-1 block">
            Policy Compliant Slots Active
          </span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Database Engine</span>
            <ShieldAlert className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">MySQL</div>
          <span className="text-[10px] text-purple-400 font-mono mt-1 block">
            cPanel Hosting Compatible
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* TEMPLATE REPOSITORY TABLE */}
        <div className="lg:col-span-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Live Template Catalog
              </h3>
              <p className="text-xs text-zinc-400">Publicly available formats for users.</p>
            </div>
            <button
              onClick={() => alert("Admin template creator dialog opened")}
              className="flex items-center gap-1.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white px-3.5 py-2 rounded-lg transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add New Template
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead>
                <tr className="border-b border-zinc-800 text-[10px] uppercase font-mono text-zinc-500">
                  <th className="pb-3">Title</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Format</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono">
                {INITIAL_TEMPLATES.map((t) => (
                  <tr key={t.id} className="hover:bg-zinc-800/40">
                    <td className="py-3 font-sans font-semibold text-white">{t.title}</td>
                    <td className="py-3 text-zinc-400">{t.category}</td>
                    <td className="py-3">
                      <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded text-[10px]">
                        {t.paperSize}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <a
                        href={`/templates/${t.slug}`}
                        target="_blank"
                        className="text-red-400 hover:text-red-300 inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Preview
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ADSENSE UNIT ORCHESTRATION */}
        <div className="lg:col-span-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-400" /> AdSense Monetization
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">Toggle live ad slots on public pages.</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl border border-zinc-800">
              <div>
                <h4 className="text-xs font-bold text-white">Top Header Leaderboard</h4>
                <p className="text-[10px] text-zinc-400">728x90 responsive banner</p>
              </div>
              <button onClick={() => toggleAd("header")}>
                {adsEnabled.header ? (
                  <ToggleRight className="w-6 h-6 text-emerald-400 cursor-pointer" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-zinc-600 cursor-pointer" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl border border-zinc-800">
              <div>
                <h4 className="text-xs font-bold text-white">Editor Sticky Sidebar</h4>
                <p className="text-[10px] text-zinc-400">300x250 rectangle unit</p>
              </div>
              <button onClick={() => toggleAd("sidebar")}>
                {adsEnabled.sidebar ? (
                  <ToggleRight className="w-6 h-6 text-emerald-400 cursor-pointer" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-zinc-600 cursor-pointer" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl border border-zinc-800">
              <div>
                <h4 className="text-xs font-bold text-white">Post-Download Interstitial</h4>
                <p className="text-[10px] text-zinc-400">Shown during PDF generation</p>
              </div>
              <button onClick={() => toggleAd("postDownload")}>
                {adsEnabled.postDownload ? (
                  <ToggleRight className="w-6 h-6 text-emerald-400 cursor-pointer" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-zinc-600 cursor-pointer" />
                )}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <div className="bg-emerald-950/40 border border-emerald-800/50 rounded-xl p-3 text-[11px] text-emerald-300">
              💡 <strong>AdSense Strategy:</strong> All slots are fully compliant with Google Webmaster policies. Zero deceptive download buttons.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
