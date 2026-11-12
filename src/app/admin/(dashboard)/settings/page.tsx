"use client";

import React, { useEffect, useState } from "react";
import {
  Settings,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  Phone,
  Mail,
  ToggleLeft,
  ToggleRight,
  Server,
  Lock,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>({
    platformName: "FreeDocForge.com",
    supportPhone: "+880 1711-000000",
    supportEmail: "support@freedocforge.com",
    defaultCurrency: "৳ (BDT)",
    maintenanceMode: false,
    maintenanceMessage: "Scheduled engine optimization in progress. Document downloads remain operational.",
    aiModelEngine: "gemini-2.5-flash",
    defaultAiTokens: 5,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.settings) {
        setSettings(data.settings);
      }
    } catch (e: any) {
      setFeedback({ type: "error", text: "Failed to load platform settings." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save settings");

      setFeedback({ type: "success", text: "Platform settings saved and applied successfully." });
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl font-sans">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-black text-white tracking-wide uppercase">
              Platform Configuration & Operations
            </h1>
            <span className="text-[10px] bg-purple-950 text-purple-400 border border-purple-800 font-mono font-bold px-2 py-0.5 rounded-full">
              GLOBAL CONFIG
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Manage system-wide defaults, maintenance mode banners, and AI designer quotas.
          </p>
        </div>

        <button
          onClick={fetchSettings}
          className="self-start sm:self-auto flex items-center gap-1.5 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3.5 py-2 rounded-lg transition border border-zinc-700 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reload</span>
        </button>
      </div>

      {/* FEEDBACK BANNER */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between border ${
            feedback.type === "success"
              ? "bg-emerald-950/70 border-emerald-800 text-emerald-300"
              : "bg-red-950/70 border-red-800 text-red-300"
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{feedback.text}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-[11px] font-bold underline cursor-pointer hover:opacity-80"
          >
            Dismiss
          </button>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: CORE PLATFORM SETTINGS (COL 7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* General Platform Defaults */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Settings className="w-4 h-4 text-blue-400" /> General Platform Parameters
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Site & Platform Name
                </label>
                <input
                  type="text"
                  value={settings.platformName}
                  onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Support Phone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={settings.supportPhone}
                    onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white font-mono focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Support Email
                  </label>
                  <input
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Default Currency Symbol
                  </label>
                  <input
                    type="text"
                    value={settings.defaultCurrency}
                    onChange={(e) => setSettings({ ...settings, defaultCurrency: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white font-mono focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Initial AI Quota (Per User)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={settings.defaultAiTokens}
                    onChange={(e) => setSettings({ ...settings, defaultAiTokens: parseInt(e.target.value) || 5 })}
                    className="w-full text-xs px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white font-mono focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Maintenance Mode & Announcement */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" /> Maintenance Mode Switch
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Display an operational announcement across the public portal.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                className="cursor-pointer"
              >
                {settings.maintenanceMode ? (
                  <ToggleRight className="w-10 h-10 text-amber-400" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-zinc-600" />
                )}
              </button>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                Announcement Message
              </label>
              <textarea
                rows={2}
                value={settings.maintenanceMessage}
                onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition text-xs shadow-md cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Changes..." : "Save Platform Configuration"}</span>
          </button>
        </div>

        {/* RIGHT COLUMN: SECURITY & LIVE ANNOUNCEMENT PREVIEW (COL 5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Announcement Preview */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Live Banner Preview
            </h3>
            <p className="text-[11px] text-zinc-400">
              How the maintenance notice displays on public user pages:
            </p>

            <div
              className={`p-3.5 rounded-xl text-xs border ${
                settings.maintenanceMode
                  ? "bg-amber-950/60 border-amber-800 text-amber-300"
                  : "bg-zinc-950 border-zinc-800 text-zinc-500"
              }`}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span className="font-semibold">
                  {settings.maintenanceMode ? settings.maintenanceMessage : "Maintenance Banner Disabled"}
                </span>
              </div>
            </div>
          </div>

          {/* Security Architecture Compliance Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Security Architecture
            </h3>
            <p className="text-xs text-zinc-400">
              Verified security controls conforming to project guidelines:
            </p>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center p-2.5 bg-zinc-950 rounded-lg border border-zinc-800">
                <span className="text-zinc-400">Edge Guard (SEC-RBAC-01)</span>
                <span className="text-emerald-400 font-bold">ACTIVE</span>
              </div>

              <div className="flex justify-between items-center p-2.5 bg-zinc-950 rounded-lg border border-zinc-800">
                <span className="text-zinc-400">JWT Token Algorithm</span>
                <span className="text-white font-bold">HS256 (jose)</span>
              </div>

              <div className="flex justify-between items-center p-2.5 bg-zinc-950 rounded-lg border border-zinc-800">
                <span className="text-zinc-400">Cookie Protection</span>
                <span className="text-white font-bold">HttpOnly, SameSite</span>
              </div>

              <div className="flex justify-between items-center p-2.5 bg-zinc-950 rounded-lg border border-zinc-800">
                <span className="text-zinc-400">SQL Injection Defense</span>
                <span className="text-emerald-400 font-bold">Prisma ORM Safe</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
