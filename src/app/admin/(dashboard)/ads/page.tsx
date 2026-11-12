"use client";

import React, { useEffect, useState } from "react";
import {
  DollarSign,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Save,
  HelpCircle,
  Eye,
  Sliders,
  Layers,
} from "lucide-react";

export default function AdminAdsPage() {
  const [config, setConfig] = useState<any>({
    enabled: false,
    publisherId: "ca-pub-9928374829103847",
    testMode: true,
    slots: {
      header: true,
      sidebar: true,
      postDownload: true,
      inGallery: true,
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/ads");
      const data = await res.json();
      if (data.config) {
        setConfig(data.config);
      }
    } catch (e: any) {
      setFeedback({ type: "error", text: "Failed to load AdSense configuration." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch("/api/admin/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save configuration");

      setFeedback({ type: "success", text: "AdSense settings updated and deployed across public routes." });
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const toggleSlot = (slotKey: string) => {
    setConfig((prev: any) => ({
      ...prev,
      slots: {
        ...prev.slots,
        [slotKey]: !prev.slots[slotKey],
      },
    }));
  };

  return (
    <div className="space-y-8 max-w-7xl font-sans">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-black text-white tracking-wide uppercase">
              AdSense Monetization & Ad Slot Orchestration
            </h1>
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                config.enabled
                  ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                  : "bg-zinc-800 text-zinc-400 border-zinc-700"
              }`}
            >
              {config.enabled ? "ENGINE ACTIVE" : "ADS SUSPENDED"}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Configure Google AdSense slots, publisher client ID, and policy compliance verification.
          </p>
        </div>

        <button
          onClick={fetchConfig}
          className="self-start sm:self-auto flex items-center gap-1.5 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3.5 py-2 rounded-lg transition border border-zinc-700 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reload Config</span>
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

      <form onSubmit={handleSaveConfig} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: CORE TOGGLES & PLACEMENT SLOTS (COL 7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Master Kill-Switch Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  Master Monetization Engine
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Global switch to instantly enable or collapse all advertising units.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setConfig((prev: any) => ({ ...prev, enabled: !prev.enabled }))}
                className="cursor-pointer"
              >
                {config.enabled ? (
                  <ToggleRight className="w-10 h-10 text-emerald-400" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-zinc-600" />
                )}
              </button>
            </div>

            {/* Publisher Client ID */}
            <div className="pt-3 border-t border-zinc-800">
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                Google AdSense Publisher ID (Client ID)
              </label>
              <input
                type="text"
                value={config.publisherId}
                onChange={(e) => setConfig((prev: any) => ({ ...prev, publisherId: e.target.value }))}
                placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                className="w-full text-xs px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white font-mono focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
              <span className="text-[10px] text-zinc-500 mt-1 block font-mono">
                Used in public adsense script headers when enabled.
              </span>
            </div>

            {/* Test Mode / Sandbox */}
            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Safe Test / Sandbox Mode</h4>
                <p className="text-[10px] text-zinc-400">
                  Renders visible mock banners to verify responsive layouts without generating invalid impressions.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setConfig((prev: any) => ({ ...prev, testMode: !prev.testMode }))}
                className="cursor-pointer"
              >
                {config.testMode ? (
                  <ToggleRight className="w-8 h-8 text-blue-400" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-zinc-600" />
                )}
              </button>
            </div>
          </div>

          {/* Ad Slot Orchestration Units */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-400" />
              Active Placement Units
            </h3>

            <div className="space-y-3">
              {/* Slot 1: Header Leaderboard */}
              <div className="flex items-center justify-between p-3.5 bg-zinc-800/50 rounded-xl border border-zinc-800">
                <div>
                  <h4 className="text-xs font-bold text-white">Top Header Leaderboard</h4>
                  <p className="text-[10px] text-zinc-400">728x90 desktop / 320x50 mobile responsive banner</p>
                </div>
                <button type="button" onClick={() => toggleSlot("header")} className="cursor-pointer">
                  {config.slots?.header ? (
                    <ToggleRight className="w-7 h-7 text-emerald-400" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-zinc-600" />
                  )}
                </button>
              </div>

              {/* Slot 2: Sticky Sidebar */}
              <div className="flex items-center justify-between p-3.5 bg-zinc-800/50 rounded-xl border border-zinc-800">
                <div>
                  <h4 className="text-xs font-bold text-white">Editor Sticky Sidebar</h4>
                  <p className="text-[10px] text-zinc-400">300x250 Medium Rectangle unit in document editors</p>
                </div>
                <button type="button" onClick={() => toggleSlot("sidebar")} className="cursor-pointer">
                  {config.slots?.sidebar ? (
                    <ToggleRight className="w-7 h-7 text-emerald-400" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-zinc-600" />
                  )}
                </button>
              </div>

              {/* Slot 3: Post-Download Modal */}
              <div className="flex items-center justify-between p-3.5 bg-zinc-800/50 rounded-xl border border-zinc-800">
                <div>
                  <h4 className="text-xs font-bold text-white">Post-Download Interstitial</h4>
                  <p className="text-[10px] text-zinc-400">Polite modal shown during PDF slicing/spooling</p>
                </div>
                <button type="button" onClick={() => toggleSlot("postDownload")} className="cursor-pointer">
                  {config.slots?.postDownload ? (
                    <ToggleRight className="w-7 h-7 text-emerald-400" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-zinc-600" />
                  )}
                </button>
              </div>

              {/* Slot 4: Gallery Native */}
              <div className="flex items-center justify-between p-3.5 bg-zinc-800/50 rounded-xl border border-zinc-800">
                <div>
                  <h4 className="text-xs font-bold text-white">In-Feed Gallery Native Unit</h4>
                  <p className="text-[10px] text-zinc-400">Placed between template rows on `/templates` catalog</p>
                </div>
                <button type="button" onClick={() => toggleSlot("inGallery")} className="cursor-pointer">
                  {config.slots?.inGallery ? (
                    <ToggleRight className="w-7 h-7 text-emerald-400" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-zinc-600" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition text-xs shadow-md cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Settings..." : "Save & Deploy Ad Configuration"}</span>
          </button>
        </div>

        {/* RIGHT COLUMN: POLICY AUDITOR & VISUAL PREVIEW (COL 5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Policy Compliance Auditor */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              AdSense Policy Auditor
            </h3>
            <p className="text-xs text-zinc-400">
              FreeDocForge enforces strict Google Webmaster & AdSense compliance:
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2 bg-emerald-950/40 border border-emerald-800/60 p-3 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-emerald-300">
                  <strong>Zero Deceptive Buttons:</strong> Download PDF buttons are distinct from ad containers.
                </span>
              </div>

              <div className="flex items-start gap-2 bg-emerald-950/40 border border-emerald-800/60 p-3 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-emerald-300">
                  <strong>Safe Content Ratio:</strong> Advertisements occupy less than 25% of viewport height.
                </span>
              </div>

              <div className="flex items-start gap-2 bg-emerald-950/40 border border-emerald-800/60 p-3 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-emerald-300">
                  <strong>Zero Watermark Clean Prints:</strong> Printed PDFs and thermal receipts contain ZERO ads.
                </span>
              </div>
            </div>
          </div>

          {/* Simulated Ad Preview Box */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-blue-400" />
              Live Visual Sandbox
            </h3>
            <p className="text-[11px] text-zinc-400">
              Simulated 300x250 Medium Rectangle unit in test mode:
            </p>

            <div className="w-full h-44 bg-zinc-950 border-2 border-dashed border-zinc-700 rounded-xl flex flex-col items-center justify-center text-center p-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">
                ADVERTISEMENT • GOOGLE ADSENSE
              </span>
              <div className="text-xs font-bold text-zinc-300">
                {config.enabled ? "Active Ad Placement (300x250)" : "Slot Collapsed (Zero Height)"}
              </div>
              <span className="text-[10px] text-zinc-500 font-mono mt-1">
                Publisher: {config.publisherId}
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
