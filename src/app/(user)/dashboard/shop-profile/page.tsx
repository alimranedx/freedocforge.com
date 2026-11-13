"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Store,
  GraduationCap,
  Stethoscope,
  Save,
  Check,
  Upload,
  Trash2,
  Mic,
  MicOff,
  Sparkles,
  ArrowRight,
  Eye,
  FileCheck,
  Building,
  Receipt,
  Calendar,
} from "lucide-react";
import { useUserDashboard } from "@/context/UserDashboardContext";

export default function ShopProfilePresetPage() {
  const { lang, t } = useUserDashboard();

  const [presetType, setPresetType] = useState<"shop" | "school" | "medical">("shop");
  const [businessName, setBusinessName] = useState("");
  const [tagline, setTagline] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [currency, setCurrency] = useState("৳");
  const [terms, setTerms] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);

  // Institutional default fields
  const [academicSession, setAcademicSession] = useState("2026");
  const [academicShift, setAcademicShift] = useState("Morning Shift");
  const [examCenter, setExamCenter] = useState("Main Campus / Hall A");

  // Right-hand live preview switcher
  const [previewPillar, setPreviewPillar] = useState<"receipt" | "routine" | "exam" | "medical">("receipt");

  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeVoiceField, setActiveVoiceField] = useState<string | null>(null);
  const [voiceLang, setVoiceLang] = useState<"bn-BD" | "en-US">("bn-BD");

  // Load existing profile from API or LocalStorage
  useEffect(() => {
    // 1. Try local storage first for instant load
    const savedLocal = localStorage.getItem("freedocforge_active_preset");
    if (savedLocal) {
      try {
        const parsed = JSON.parse(savedLocal);
        if (parsed.presetType) setPresetType(parsed.presetType);
        if (parsed.businessName) setBusinessName(parsed.businessName);
        if (parsed.tagline) setTagline(parsed.tagline);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.address) setAddress(parsed.address);
        if (parsed.currency) setCurrency(parsed.currency);
        if (parsed.terms) setTerms(parsed.terms);
        if (parsed.logoUrl) setLogoUrl(parsed.logoUrl);
        if (parsed.signatureUrl) setSignatureUrl(parsed.signatureUrl);
        if (parsed.academicSession) setAcademicSession(parsed.academicSession);
        if (parsed.academicShift) setAcademicShift(parsed.academicShift);
        if (parsed.examCenter) setExamCenter(parsed.examCenter);
      } catch (e) {
        console.error("Local storage load error", e);
      }
    }

    // 2. Fetch from backend API
    fetch("/api/user/profile")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.profile) {
          const p = data.profile;
          if (p.businessName) setBusinessName(p.businessName);
          if (p.tagline) setTagline(p.tagline);
          if (p.phone) setPhone(p.phone);
          if (p.address) setAddress(p.address);
          if (p.currency) setCurrency(p.currency);
          if (p.terms) setTerms(p.terms);
          if (p.logoUrl) setLogoUrl(p.logoUrl);
          if (p.signatureUrl) setSignatureUrl(p.signatureUrl);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  // Sync preview pillar when presetType changes
  useEffect(() => {
    if (presetType === "shop") setPreviewPillar("receipt");
    else if (presetType === "school") setPreviewPillar("routine");
    else if (presetType === "medical") setPreviewPillar("medical");
  }, [presetType]);

  // Voice typing handler
  const handleVoiceType = (fieldKey: string) => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (activeVoiceField === fieldKey) {
      setActiveVoiceField(null);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = voiceLang;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setActiveVoiceField(fieldKey);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (fieldKey === "businessName") setBusinessName((prev) => (prev ? prev + " " + transcript : transcript));
      if (fieldKey === "tagline") setTagline((prev) => (prev ? prev + " " + transcript : transcript));
      if (fieldKey === "phone") setPhone(transcript);
      if (fieldKey === "address") setAddress((prev) => (prev ? prev + " " + transcript : transcript));
      if (fieldKey === "terms") setTerms((prev) => (prev ? prev + " " + transcript : transcript));
      setActiveVoiceField(null);
    };

    recognition.onerror = () => {
      setActiveVoiceField(null);
    };

    recognition.onend = () => {
      setActiveVoiceField(null);
    };

    recognition.start();
  };

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "signature") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image file size must be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64 = uploadEvent.target?.result as string;
      if (type === "logo") setLogoUrl(base64);
      if (type === "signature") setSignatureUrl(base64);
    };
    reader.readAsDataURL(file);
  };

  // Save Preset Handler
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const presetData = {
      presetType,
      businessName: businessName || (presetType === "shop" ? "Stylist Fashion BD" : presetType === "school" ? "Dhaka Model School" : "Dr. Farhana Yasmin, MBBS"),
      tagline,
      phone,
      address,
      currency: currency || "৳",
      terms,
      logoUrl,
      signatureUrl,
      academicSession,
      academicShift,
      examCenter,
      updatedAt: new Date().toISOString(),
    };

    // Save to localStorage for instant template auto-fill across the whole app
    localStorage.setItem("freedocforge_active_preset", JSON.stringify(presetData));

    // Also persist to backend API
    try {
      await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(presetData),
      });
    } catch (err) {
      console.warn("Could not sync to cloud profile:", err);
    }

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-500/20 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>
              {lang === "bn" ? "অটো-ফিল্ড স্মার্ট লেটারহেড ও প্রিসেট" : "Smart Auto-Fill Document Preset"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {lang === "bn" ? "আপনার প্রতিষ্ঠান ও শপের তথ্য প্রিসেট করুন" : "Manage Your Organization Preset"}
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm mt-2 leading-relaxed">
            {lang === "bn"
              ? "এখানে একবার লোগো, ঠিকানা, ফোন ও ডিজিটাল সিল সংরক্ষণ করুন। এরপরে গ্যালারির যেকোনো ক্যাশ মেমো, ক্লাস রুটিন, পরীক্ষার সূচি বা প্রেসক্রিপশন খুললেই স্বয়ংক্রিয়ভাবে তথ্য বসে যাবে!"
              : "Save your brand logo, authorized signature, phone, and terms once. Every time you open any template across FreeDocForge, it auto-fills in 1 second!"}
          </p>
        </div>
      </div>

      {/* Preset Type Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <button
          type="button"
          onClick={() => setPresetType("shop")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            presetType === "shop"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Store className="w-4 h-4" />
          <span>{lang === "bn" ? "দোকান ও ব্যবসা (Shop / Invoices)" : "Shop & Invoices"}</span>
        </button>

        <button
          type="button"
          onClick={() => setPresetType("school")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            presetType === "school"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>{lang === "bn" ? "স্কুল ও একাডেমি (School / Routines)" : "School & Routines"}</span>
        </button>

        <button
          type="button"
          onClick={() => setPresetType("medical")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            presetType === "medical"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>{lang === "bn" ? "ডাক্তার ও চেম্বার (Doctor / Clinic)" : "Doctor & Clinic"}</span>
        </button>

        <div className="ml-auto flex items-center gap-1.5 px-2">
          <span className="text-[11px] text-slate-400 font-semibold">{lang === "bn" ? "ভয়েস ভাষা:" : "Voice:"}</span>
          <button
            type="button"
            onClick={() => setVoiceLang(voiceLang === "bn-BD" ? "en-US" : "bn-BD")}
            className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 cursor-pointer"
          >
            {voiceLang === "bn-BD" ? "বাংলা (bn-BD)" : "English (en-US)"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* LEFT COLUMN: Preset Configuration Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs">
          <form onSubmit={handleSave} className="space-y-4">
            {/* Entity Name */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {presetType === "shop"
                    ? lang === "bn" ? "দোকান বা ব্র্যান্ডের নাম" : "Business / Store Name"
                    : presetType === "school"
                    ? lang === "bn" ? "স্কুল বা প্রতিষ্ঠানের নাম" : "School / Institute Name"
                    : lang === "bn" ? "ডাক্তার বা ক্লিনিকের নাম" : "Doctor / Clinic Name"}
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleVoiceType("businessName")}
                  className={`p-1 rounded-md text-xs flex items-center gap-1 cursor-pointer transition ${
                    activeVoiceField === "businessName"
                      ? "bg-red-500 text-white animate-pulse"
                      : "text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                  title="Voice input"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-semibold">{activeVoiceField === "businessName" ? "শুনছি..." : "ভয়েস"}</span>
                </button>
              </div>
              <input
                type="text"
                required
                placeholder={
                  presetType === "shop"
                    ? "যেমন: Stylist Fashion BD"
                    : presetType === "school"
                    ? "যেমন: Dhaka Ideal Model School & College"
                    : "যেমন: Dr. Farhana Yasmin, MBBS, FCPS"
                }
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>

            {/* Tagline / Degrees */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {presetType === "medical"
                    ? lang === "bn" ? "ডিগ্রি ও বিশেষজ্ঞ পদবি" : "Degrees & Specialization"
                    : lang === "bn" ? "স্লোগান বা সাব-টাইটেল" : "Tagline / Motto"}
                </label>
                <button
                  type="button"
                  onClick={() => handleVoiceType("tagline")}
                  className={`p-1 rounded-md text-xs flex items-center gap-1 cursor-pointer transition ${
                    activeVoiceField === "tagline"
                      ? "bg-red-500 text-white animate-pulse"
                      : "text-slate-400 hover:text-blue-600"
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-semibold">{activeVoiceField === "tagline" ? "শুনছি..." : "ভয়েস"}</span>
                </button>
              </div>
              <input
                type="text"
                placeholder={
                  presetType === "medical"
                    ? "Specialist in Medicine • BMDC Reg No: A-54321"
                    : presetType === "school"
                    ? "EIIN: 134215 • Established 2002"
                    : "Quality Products Delivered to Your Doorstep"
                }
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>

            {/* Institutional School Defaults: Session, Shift, Center */}
            {presetType === "school" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-blue-50/60 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-900">
                <div>
                  <label className="block text-[10px] font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider mb-1">
                    {lang === "bn" ? "শিক্ষাবর্ষ / সেশন" : "Academic Session"}
                  </label>
                  <input
                    type="text"
                    value={academicSession}
                    onChange={(e) => setAcademicSession(e.target.value)}
                    placeholder="2026"
                    className="w-full text-xs border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-800 rounded-lg p-2 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider mb-1">
                    {lang === "bn" ? "ডিফল্ট শিফট" : "Default Shift"}
                  </label>
                  <input
                    type="text"
                    value={academicShift}
                    onChange={(e) => setAcademicShift(e.target.value)}
                    placeholder="Morning Shift"
                    className="w-full text-xs border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-800 rounded-lg p-2 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider mb-1">
                    {lang === "bn" ? "পরীক্ষা কেন্দ্র / ভেন্যু" : "Exam Center / Hall"}
                  </label>
                  <input
                    type="text"
                    value={examCenter}
                    onChange={(e) => setExamCenter(e.target.value)}
                    placeholder="Main Campus / Hall A"
                    className="w-full text-xs border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-800 rounded-lg p-2 font-semibold"
                  />
                </div>
              </div>
            )}

            {/* Phone & Currency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    {lang === "bn" ? "যোগাযোগের ফোন নম্বর" : "Official Phone Number"}
                  </label>
                  <button
                    type="button"
                    onClick={() => handleVoiceType("phone")}
                    className="p-1 rounded-md text-slate-400 hover:text-blue-600"
                  >
                    <Mic className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="+880 1712-345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  {lang === "bn" ? "মুদ্রা প্রতীক (Currency)" : "Currency Symbol"}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-24 text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none transition font-bold"
                  />
                  <div className="flex items-center gap-1">
                    {["৳", "$", "₹", "€"].map((sym) => (
                      <button
                        key={sym}
                        type="button"
                        onClick={() => setCurrency(sym)}
                        className={`px-2 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                          currency === sym
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        {sym}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {lang === "bn" ? "অফিস বা চেম্বারের ঠিকানা" : "Location / Chamber Address"}
                </label>
                <button
                  type="button"
                  onClick={() => handleVoiceType("address")}
                  className="p-1 rounded-md text-slate-400 hover:text-blue-600"
                >
                  <Mic className="w-3.5 h-3.5" />
                </button>
              </div>
              <textarea
                rows={2}
                placeholder="House 14, Road 5, Dhanmondi, Dhaka - 1205"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>

            {/* Terms / Return Policy / Consulting Hours */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {presetType === "medical"
                    ? lang === "bn" ? "পরামর্শের সময় ও বিশেষ নির্দেশনা" : "Consultation Days & Instructions"
                    : lang === "bn" ? "ডিফল্ট শর্ত ও পলিসি" : "Default Terms & Instructions"}
                </label>
                <button
                  type="button"
                  onClick={() => handleVoiceType("terms")}
                  className="p-1 rounded-md text-slate-400 hover:text-blue-600"
                >
                  <Mic className="w-3.5 h-3.5" />
                </button>
              </div>
              <textarea
                rows={2}
                placeholder={
                  presetType === "medical"
                    ? "Saturday - Thursday: 5:00 PM - 9:00 PM. Friday Closed."
                    : "Goods once sold can be exchanged within 48 hours with original invoice."
                }
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                className="w-full text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>

            {/* Upload Logo & Signature Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              {/* Logo Upload */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                  {lang === "bn" ? "প্রতিষ্ঠানের লোগো (Brand Logo)" : "Official Brand Logo"}
                </span>
                {logoUrl ? (
                  <div className="flex items-center gap-3">
                    <img src={logoUrl} alt="Logo" className="w-12 h-12 object-contain bg-white rounded-lg p-1 border" />
                    <button
                      type="button"
                      onClick={() => setLogoUrl(null)}
                      className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{lang === "bn" ? "মুছুন" : "Remove"}</span>
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-xl p-3 cursor-pointer text-xs font-semibold text-slate-500 hover:text-blue-600 transition">
                    <Upload className="w-4 h-4" />
                    <span>{lang === "bn" ? "লোগো আপলোড করুন" : "Upload Logo Image"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "logo")}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Signature Upload */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                  {lang === "bn" ? "ডিজিটাল সিল বা স্বাক্ষর" : "Digital Signature / Seal"}
                </span>
                {signatureUrl ? (
                  <div className="flex items-center gap-3">
                    <img src={signatureUrl} alt="Signature" className="w-16 h-10 object-contain bg-white rounded-lg p-1 border" />
                    <button
                      type="button"
                      onClick={() => setSignatureUrl(null)}
                      className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{lang === "bn" ? "মুছুন" : "Remove"}</span>
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-xl p-3 cursor-pointer text-xs font-semibold text-slate-500 hover:text-blue-600 transition">
                    <Upload className="w-4 h-4" />
                    <span>{lang === "bn" ? "স্বাক্ষর বা সিল আপলোড" : "Upload Seal / Sign"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "signature")}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition shadow-sm cursor-pointer"
              >
                {isSaved ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>{lang === "bn" ? "সফলভাবে প্রিসেট সেভ হয়েছে!" : "Saved & Synced Successfully!"}</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{lang === "bn" ? "প্রিসেট সেভ করুন" : "Save Organization Preset"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: Live Print Letterhead Preview with Multi-Preset Switching */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {lang === "bn" ? "লাইভ লেটারহেড প্রিভিউ" : "Live Multi-Preset Preview"}
                </h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                {lang === "bn" ? "অটো-ফিল সক্রিয়" : "Auto-Fill Active"}
              </span>
            </div>

            {/* 4-Pillar Preview Selector */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-3 text-[11px] overflow-x-auto">
              <button
                type="button"
                onClick={() => setPreviewPillar("receipt")}
                className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition cursor-pointer ${
                  previewPillar === "receipt"
                    ? "bg-white dark:bg-slate-900 text-blue-600 shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {lang === "bn" ? "ক্যাশ মেমো" : "Cash Memo"}
              </button>

              <button
                type="button"
                onClick={() => setPreviewPillar("routine")}
                className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition cursor-pointer ${
                  previewPillar === "routine"
                    ? "bg-white dark:bg-slate-900 text-blue-600 shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {lang === "bn" ? "ক্লাস রুটিন" : "Class Routine"}
              </button>

              <button
                type="button"
                onClick={() => setPreviewPillar("exam")}
                className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition cursor-pointer ${
                  previewPillar === "exam"
                    ? "bg-white dark:bg-slate-900 text-blue-600 shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {lang === "bn" ? "পরীক্ষার সূচি" : "Exam Schedule"}
              </button>

              <button
                type="button"
                onClick={() => setPreviewPillar("medical")}
                className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition cursor-pointer ${
                  previewPillar === "medical"
                    ? "bg-white dark:bg-slate-900 text-blue-600 shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {lang === "bn" ? "ক্লিনিক রসিদ" : "Clinic Bill"}
              </button>
            </div>

            {/* Rendered Live Miniature Letterhead Card */}
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-slate-800 dark:text-slate-200 text-xs shadow-inner space-y-3">
              <div className="flex items-start justify-between gap-3 border-b-2 border-slate-900 dark:border-white pb-3">
                <div className="space-y-1">
                  {logoUrl && (
                    <img src={logoUrl} alt="Logo" className="w-8 h-8 object-contain mb-1 rounded" />
                  )}
                  <h4 className="font-black text-sm uppercase tracking-tight text-slate-900 dark:text-white">
                    {businessName || (previewPillar === "receipt" ? "STYLIST FASHION BD" : previewPillar === "routine" || previewPillar === "exam" ? "DHAKA IDEAL MODEL SCHOOL" : "CARE SPECIALIST CLINIC")}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {tagline || (previewPillar === "medical" ? "MBBS, FCPS • BMDC Reg No: A-54321" : "Excellence in Quality & Trust")}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Phone: {phone || "+880 1712-345678"} • Currency: {currency || "৳"}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {address || "House 14, Road 5, Dhanmondi, Dhaka"}
                  </p>
                  {(previewPillar === "routine" || previewPillar === "exam") && (
                    <p className="text-[10px] text-blue-600 font-semibold">
                      Session: {academicSession} • Shift: {academicShift}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <span className="inline-block bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-black text-[9px] px-2 py-1 rounded">
                    {previewPillar === "receipt"
                      ? "CASH MEMO"
                      : previewPillar === "routine"
                      ? "TIMETABLE"
                      : previewPillar === "exam"
                      ? "EXAM SCHEDULE"
                      : "MONEY RECEIPT"}
                  </span>
                </div>
              </div>

              {/* Sample Document Body Area */}
              <div className="py-4 border-b border-dashed border-slate-300 dark:border-slate-700 text-center text-slate-400 text-[10px]">
                {previewPillar === "receipt" && (
                  <div className="space-y-1">
                    <div className="flex justify-between font-medium text-[10px] text-slate-600">
                      <span>Item: Premium Formal Cotton Shirt (x2)</span>
                      <span>{currency || "৳"} 2,500</span>
                    </div>
                    <div className="flex justify-between font-medium text-[10px] text-slate-600">
                      <span>Item: Slim Fit Chino Pant (x1)</span>
                      <span>{currency || "৳"} 1,450</span>
                    </div>
                  </div>
                )}

                {previewPillar === "routine" && (
                  <div className="text-center space-y-1">
                    <span className="font-bold text-slate-700 block">Weekly Periods (Sunday - Thursday)</span>
                    <span className="text-[9px] text-slate-400">P1: Higher Math | P2: Physics | P3: English | P4: Chemistry</span>
                  </div>
                )}

                {previewPillar === "exam" && (
                  <div className="text-center space-y-1">
                    <span className="font-bold text-slate-700 block">Annual Exam 2026 • Center: {examCenter}</span>
                    <span className="text-[9px] text-slate-400">Bangla 1st (101) | Math (109) | Physics (136)</span>
                  </div>
                )}

                {previewPillar === "medical" && (
                  <div className="text-center space-y-1">
                    <span className="font-bold text-slate-700 block">Diagnostic Investigation & Fee Receipt</span>
                    <span className="text-[9px] text-slate-400">CBC with ESR (৳ 450) • USG Whole Abdomen (৳ 1,500)</span>
                  </div>
                )}
              </div>

              {/* Footer Terms & Signature Preview */}
              <div className="flex items-end justify-between pt-1 text-[10px]">
                <div className="max-w-[65%]">
                  <span className="font-bold text-slate-500 block uppercase text-[9px]">Terms & Conditions:</span>
                  <p className="text-slate-500 dark:text-slate-400 text-[9px] line-clamp-2">
                    {terms || "Exchange accepted within 48 hours with invoice."}
                  </p>
                </div>
                <div className="text-center shrink-0">
                  {signatureUrl ? (
                    <img src={signatureUrl} alt="Sign" className="w-16 h-8 object-contain mx-auto mb-0.5" />
                  ) : (
                    <div className="w-16 border-b border-slate-400 mb-1"></div>
                  )}
                  <span className="text-[9px] font-bold text-slate-700 dark:text-slate-300 block">
                    {previewPillar === "routine" || previewPillar === "exam"
                      ? "Principal / Controller"
                      : previewPillar === "medical"
                      ? "Doctor's Seal"
                      : "Authorized Sign"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Link to Test */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Link
                href={
                  previewPillar === "routine"
                    ? "/templates/school-class-routine"
                    : previewPillar === "exam"
                    ? "/templates/school-exam-routine"
                    : previewPillar === "medical"
                    ? "/templates/medical-money-receipt"
                    : "/templates/f-commerce-invoice"
                }
                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs transition"
              >
                <span>{lang === "bn" ? "প্রিসেট দিয়ে টেমপ্লেট টেস্ট করুন" : "Open Selected Template with Preset"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
