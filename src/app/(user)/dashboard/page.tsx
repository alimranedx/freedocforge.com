"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Store, Printer, Sparkles, ArrowRight, Save, Check } from "lucide-react";
import { INITIAL_TEMPLATES } from "@/lib/templates";
import { useUserDashboard } from "@/context/UserDashboardContext";

export default function UserDashboardPage() {
  const { t } = useUserDashboard();
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
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto">
      {/* SHOP PRESET STATUS BANNER */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white rounded-2xl p-5 sm:p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] bg-white/20 text-white font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            {t("shopAutomationActive")}
          </span>
          <h2 className="text-lg sm:text-xl font-black mt-2">{t("oneClickInvoiceReady")}</h2>
          <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
            {t("shopBannerDesc")}
          </p>
        </div>
        <Link
          href="/templates/f-commerce-invoice"
          className="w-full md:w-auto text-center bg-white hover:bg-blue-50 text-blue-700 font-bold px-5 py-3 rounded-xl text-xs sm:text-sm transition shadow-sm shrink-0 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Printer className="w-4 h-4" /> {t("openReadyCashMemo")}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* LEFT COLUMN: Shop Profile Settings Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs transition-colors">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {t("defaultShopDetails")}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t("defaultShopDesc")}
              </p>
            </div>
            <Store className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                {t("storeNameLabel")}
              </label>
              <input
                type="text"
                className="w-full text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                value={profile.businessName}
                onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  {t("officialPhoneLabel")}
                </label>
                <input
                  type="text"
                  className="w-full text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  {t("currencySymbolLabel")}
                </label>
                <input
                  type="text"
                  className="w-full text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                  value={profile.currency}
                  onChange={(e) => setProfile({ ...profile, currency: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                {t("addressLabel")}
              </label>
              <textarea
                rows={2}
                className="w-full text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                {t("termsLabel")}
              </label>
              <textarea
                rows={2}
                className="w-full text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                value={profile.terms}
                onChange={(e) => setProfile({ ...profile, terms: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-3 rounded-xl text-xs sm:text-sm transition shadow-sm cursor-pointer"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  {t("savedSuccessMsg")}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {t("savePresetBtn")}
                </>
              )}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: Instant Template Launchers & AI */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs transition-colors">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              {t("instantLaunchers")}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              {t("instantLaunchersDesc")}
            </p>

            <div className="space-y-2.5">
              {INITIAL_TEMPLATES.map((tmpl) => (
                <Link
                  key={tmpl.id}
                  href={`/templates/${tmpl.slug}`}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-slate-800/60 transition flex items-center justify-between group"
                >
                  <div className="min-w-0 pr-2">
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                      {tmpl.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition truncate">
                      {tmpl.title}
                    </h4>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* AI Custom Architect Card */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/30 border border-purple-200 dark:border-purple-800/50 rounded-2xl p-5 sm:p-6 transition-colors">
            <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold text-xs mb-2">
              <Sparkles className="w-4 h-4" /> {t("aiTemplateDesigner")}
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {t("needCustomLayout")}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              {t("aiDesc")}
            </p>
            <div className="mt-4">
              <button
                onClick={() =>
                  alert(
                    "AI custom layout engine will query your database schema and suggest 2 bespoke formats!"
                  )
                }
                className="w-full sm:w-auto text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-lg transition shadow-xs cursor-pointer"
              >
                {t("launchAiBtn")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
