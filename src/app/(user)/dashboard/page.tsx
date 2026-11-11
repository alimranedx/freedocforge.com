"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Store, Printer, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Upload, Save } from "lucide-react";
import { INITIAL_TEMPLATES } from "@/lib/templates";

export default function UserDashboardPage() {
  const [profile, setProfile] = useState({
    businessName: "My Facebook Fashion Shop",
    phone: "+880 1700-112233",
    address: "House 12, Dhanmondi, Dhaka",
    currency: "৳",
    terms: "Exchange accepted within 48 hours with receipt.",
  });
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* SHOP PRESET STATUS BANNER */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs bg-white/20 text-white font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Shop Automation Active
          </span>
          <h2 className="text-xl font-black mt-2">1-Click Invoice & Memo Ready</h2>
          <p className="text-blue-100 text-xs mt-1 max-w-xl">
            Whenever a customer orders on your Facebook page or phone, open any template and your shop details will auto-fill instantly!
          </p>
        </div>
        <Link
          href="/templates/f-commerce-invoice"
          className="bg-white hover:bg-blue-50 text-blue-700 font-bold px-5 py-2.5 rounded-xl text-xs transition shadow-sm shrink-0 flex items-center gap-1.5"
        >
          <Printer className="w-4 h-4" /> Open Ready Cash Memo
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Shop Profile Settings Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="border-b pb-4 mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">My Default Shop Details</h3>
              <p className="text-xs text-slate-500">This information will automatically appear on all printed documents.</p>
            </div>
            <Store className="w-5 h-5 text-blue-600" />
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Store / Institute / Clinic Name
              </label>
              <input
                type="text"
                className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={profile.businessName}
                onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Official Contact Phone
                </label>
                <input
                  type="text"
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Currency Symbol
                </label>
                <input
                  type="text"
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={profile.currency}
                  onChange={(e) => setProfile({ ...profile, currency: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Shop Address / Location
              </label>
              <textarea
                rows={2}
                className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Default Terms & Return Policy
              </label>
              <textarea
                rows={2}
                className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={profile.terms}
                onChange={(e) => setProfile({ ...profile, terms: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-lg text-xs transition shadow-sm cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {isSaved ? "Saved Successfully!" : "Save Default Shop Preset"}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: Instant Template Launchers */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Instant Template Launchers</h3>
            <p className="text-xs text-slate-500 mb-4">Click any template to auto-populate your shop details.</p>

            <div className="space-y-2.5">
              {INITIAL_TEMPLATES.map((tmpl) => (
                <Link
                  key={tmpl.id}
                  href={`/templates/${tmpl.slug}`}
                  className="p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition flex items-center justify-between group"
                >
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                      {tmpl.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition">
                      {tmpl.title}
                    </h4>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* AI Custom Architect Teaser */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 text-purple-700 font-bold text-xs mb-2">
              <Sparkles className="w-4 h-4" /> AI Custom Template Architect
            </div>
            <h4 className="text-sm font-bold text-slate-900">Need a unique document layout?</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Describe your custom format (e.g. specialized diagnostic slip or gate pass) and our AI will build the layout for your shop.
            </p>
            <div className="mt-4">
              <button
                onClick={() => alert("AI custom layout engine will query your database schema and suggest 2 bespoke formats!")}
                className="text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition shadow-sm"
              >
                Launch AI Assistant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
