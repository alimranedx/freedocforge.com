"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Printer,
  Download,
  Plus,
  Trash2,
  Upload,
  Check,
  Mic,
  Globe,
  FileText,
  Stethoscope,
  Calendar,
  Activity,
  Heart,
  UserCheck,
} from "lucide-react";
import AdSenseSlot from "@/components/AdSenseSlot";
import VoiceInputButton from "@/components/VoiceInputButton";
import { useGlobalSettings } from "@/context/GlobalSettingsContext";

interface MedicineItem {
  name: string;
  dosage: string;
  duration: string;
  instruction: string;
}

export default function MedicalPrescriptionEditor({
  initialData,
  locales,
  templateSlug = "doctor-prescription",
}: {
  initialData: any;
  locales?: {
    en: { defaultData: any; title: string; description: string };
    bn: { defaultData: any; title: string; description: string };
  };
  templateSlug?: string;
}) {
  const { lang: sysLang } = useGlobalSettings();
  const [docLang, setDocLang] = useState<"en" | "bn">("en");
  const [voiceLang, setVoiceLang] = useState<"bn" | "en">("bn");
  const [data, setData] = useState({ ...initialData });
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // Auto-fill from user's active preset if available
  useEffect(() => {
    const saved = localStorage.getItem("freedocforge_active_preset");
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (p.presetType === "medical") {
          setData((prev: any) => ({
            ...prev,
            doctorName: p.businessName || prev.doctorName,
            degrees: p.tagline || prev.degrees,
            phone: p.phone || prev.phone,
            chamberAddress: p.address || prev.chamberAddress,
            hospitalName: p.tagline || prev.hospitalName,
            advice: p.terms || prev.advice,
          }));
          if (p.signatureUrl) setSignaturePreview(p.signatureUrl);
        }
      } catch (e) {}
    }
  }, []);

  // Switch Document Locale independently of system language
  const handleSwitchDocLang = (targetLang: "en" | "bn") => {
    setDocLang(targetLang);
    if (locales && locales[targetLang]) {
      setData({ ...locales[targetLang].defaultData });
    }
  };

  const medicinesList: MedicineItem[] = Array.isArray(data.medicines)
    ? data.medicines
    : [
        {
          name: docLang === "bn" ? "ট্যাব. নাপা এক্সট্রা ৬৬৫মিগ্রা" : "Tab. Napa Extra 665mg",
          dosage: docLang === "bn" ? "১ + ০ + ১ (খাবারের পর)" : "1 + 0 + 1 (After Meal)",
          duration: docLang === "bn" ? "৫ দিন" : "5 Days",
          instruction: docLang === "bn" ? "ভরা পেটে পানি সহ সেব্য" : "Take after meal",
        },
      ];

  const handleAddMedicine = () => {
    const newMed: MedicineItem = {
      name: docLang === "bn" ? "নতুন ওষুধ বা সিরাপের নাম" : "New Medicine Name",
      dosage: docLang === "bn" ? "১ + ০ + ১" : "1 + 0 + 1",
      duration: docLang === "bn" ? "৭ দিন" : "7 Days",
      instruction: docLang === "bn" ? "খাবারের পর" : "After meal",
    };
    setData({
      ...data,
      medicines: [...medicinesList, newMed],
    });
  };

  const handleRemoveMedicine = (index: number) => {
    if (medicinesList.length <= 1) return;
    const updated = medicinesList.filter((_, i) => i !== index);
    setData({ ...data, medicines: updated });
  };

  const handleMedicineChange = (index: number, field: keyof MedicineItem, value: string) => {
    const updated = [...medicinesList];
    updated[index] = { ...updated[index], [field]: value };
    setData({ ...data, medicines: updated });
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSignaturePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveToProfile = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const isPrescription = templateSlug === "doctor-prescription";
  const isSerial = templateSlug === "medical-appointment-token";
  const isDischarge = templateSlug === "medical-discharge-slip";

  return (
    <div className="space-y-6">
      {/* INDEPENDENT TEMPLATE DOCUMENT LANGUAGE BAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
            <Stethoscope className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{sysLang === "bn" ? "ডকুমেন্টের প্রিন্ট ভাষা:" : "Document Print Language:"}</span>
              <span className="text-[10px] bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 px-2 py-0.5 rounded-full font-bold">
                {docLang === "bn" ? "বাংলা ফরম্যাট" : "English Format"}
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {sysLang === "bn"
                ? "প্রেসক্রিপশন ও মেডিকেল স্লিপের ভাষা স্বাধীনভাবে বাংলায় বা ইংরেজিতে পরিবর্তন করুন।"
                : "Manage clinical output language independently of the website UI language."}
            </p>
          </div>
        </div>

        {/* Independent Document Language Switcher Buttons */}
        <div className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-auto border border-slate-200 dark:border-slate-700">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 px-2 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{sysLang === "bn" ? "আউটপুট:" : "Output:"}</span>
          </span>
          <button
            type="button"
            onClick={() => handleSwitchDocLang("en")}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition cursor-pointer ${
              docLang === "en"
                ? "bg-white dark:bg-rose-600 text-rose-700 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            English Rx
          </button>
          <button
            type="button"
            onClick={() => handleSwitchDocLang("bn")}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition cursor-pointer ${
              docLang === "bn"
                ? "bg-white dark:bg-rose-600 text-rose-700 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            বাংলা ব্যবস্থাপত্র
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Input Form Controls (Hidden during printing) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs print:hidden space-y-6 transition-colors">
          {/* Header & Voice Input Language Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{docLang === "bn" ? "মেডিকেল সেটিংস ও ইনপুট" : "Medical Details & Rx"}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {sysLang === "bn"
                  ? "তারিখ বাদে প্রতিটি ফিল্ডে মুখে বাংলায় বা ইংরেজিতে বলুন।"
                  : "Click any mic icon to speak into clinical fields. Bangla & English supported."}
              </p>
            </div>

            {/* Dedicated Voice Typing Language Selector */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 self-start sm:self-auto shrink-0">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 px-1.5 flex items-center gap-1">
                <Mic className="w-3.5 h-3.5 text-red-500" />
                <span className="hidden sm:inline">{sysLang === "bn" ? "ভয়েস:" : "Voice:"}</span>
              </span>
              <button
                type="button"
                onClick={() => setVoiceLang("bn")}
                className={`text-[11px] font-bold px-2 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                  voiceLang === "bn"
                    ? "bg-red-500 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
                title="বাংলায় ভয়েস টাইপিং করুন"
              >
                <span>বাংলা</span>
              </button>
              <button
                type="button"
                onClick={() => setVoiceLang("en")}
                className={`text-[11px] font-bold px-2 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                  voiceLang === "en"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
                title="Speak in English"
              >
                <span>English</span>
              </button>
            </div>
          </div>

          {/* 1. Doctor & Chamber Info */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              {docLang === "bn" ? "১. চিকিৎসক ও চেম্বারের তথ্য" : "1. Doctor & Chamber Info"}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 relative flex items-center">
                <input
                  type="text"
                  placeholder={docLang === "bn" ? "চিকিৎসকের নাম (যেমন: ডাঃ ফারহানা ইয়াসমিন)" : "Doctor's Name"}
                  className="w-full text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-9 focus:ring-2 focus:ring-rose-500 focus:outline-none transition-colors"
                  value={data.doctorName || ""}
                  onChange={(e) => setData({ ...data, doctorName: e.target.value })}
                />
                <div className="absolute right-2">
                  <VoiceInputButton
                    lang={voiceLang}
                    title={voiceLang === "bn" ? "ডাক্তারের নাম মুখে বলুন" : "Speak Doctor Name"}
                    onTranscript={(txt) => setData({ ...data, doctorName: txt })}
                  />
                </div>
              </div>

              <div className="col-span-2 relative flex items-center">
                <input
                  type="text"
                  placeholder={docLang === "bn" ? "ডিগ্রি ও বিশেষজ্ঞতা (যেমন: MBBS, FCPS)" : "Degrees & Speciality"}
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-9 focus:ring-2 focus:ring-rose-500 focus:outline-none transition-colors"
                  value={data.degrees || data.speciality || ""}
                  onChange={(e) => setData({ ...data, degrees: e.target.value })}
                />
                <div className="absolute right-2">
                  <VoiceInputButton
                    lang={voiceLang}
                    title={voiceLang === "bn" ? "ডিগ্রি মুখে বলুন" : "Speak Degrees"}
                    onTranscript={(txt) => setData({ ...data, degrees: txt })}
                  />
                </div>
              </div>

              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder={docLang === "bn" ? "বিএমডিসি রেজি নং" : "BMDC Reg No"}
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-rose-500 focus:outline-none transition-colors"
                  value={data.regNo || ""}
                  onChange={(e) => setData({ ...data, regNo: e.target.value })}
                />
                <div className="absolute right-1">
                  <VoiceInputButton
                    lang={voiceLang}
                    title={voiceLang === "bn" ? "রেজিস্ট্রেশন নম্বর মুখে বলুন" : "Speak Reg No"}
                    onTranscript={(txt) => setData({ ...data, regNo: txt })}
                  />
                </div>
              </div>

              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder={docLang === "bn" ? "চেম্বার ফোন" : "Phone / Helpline"}
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-rose-500 focus:outline-none transition-colors"
                  value={data.phone || ""}
                  onChange={(e) => setData({ ...data, phone: e.target.value })}
                />
                <div className="absolute right-1">
                  <VoiceInputButton
                    lang={voiceLang}
                    title={voiceLang === "bn" ? "ফোন নম্বর মুখে বলুন" : "Speak Phone"}
                    onTranscript={(txt) => setData({ ...data, phone: txt })}
                  />
                </div>
              </div>

              <div className="col-span-2 relative flex items-center">
                <input
                  type="text"
                  placeholder={docLang === "bn" ? "চেম্বার / হাসপাতালের নাম ও ঠিকানা" : "Hospital / Chamber Address"}
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-9 focus:ring-2 focus:ring-rose-500 focus:outline-none transition-colors"
                  value={data.hospitalName || data.chamberAddress || ""}
                  onChange={(e) => setData({ ...data, chamberAddress: e.target.value })}
                />
                <div className="absolute right-2">
                  <VoiceInputButton
                    lang={voiceLang}
                    title={voiceLang === "bn" ? "ঠিকানা মুখে বলুন" : "Speak Address"}
                    onTranscript={(txt) => setData({ ...data, chamberAddress: txt })}
                  />
                </div>
              </div>

              <div className="col-span-2 relative flex items-center">
                <input
                  type="text"
                  placeholder={docLang === "bn" ? "রোগী দেখার সময় (যেমন: বিকাল ৫টা - রাত ৯টা)" : "Visiting Hours / Room"}
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-9 focus:ring-2 focus:ring-rose-500 focus:outline-none transition-colors"
                  value={data.visitingHours || data.roomNo || ""}
                  onChange={(e) => setData({ ...data, visitingHours: e.target.value })}
                />
                <div className="absolute right-2">
                  <VoiceInputButton
                    lang={voiceLang}
                    title={voiceLang === "bn" ? "সময় মুখে বলুন" : "Speak Hours"}
                    onTranscript={(txt) => setData({ ...data, visitingHours: txt })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Patient Details */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              {docLang === "bn" ? "২. রোগীর বিবরণ ও স্বাস্থ্য সূচক" : "2. Patient Vitals & Info"}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="col-span-2 sm:col-span-3 relative flex items-center">
                <input
                  type="text"
                  placeholder={docLang === "bn" ? "রোগীর নাম" : "Patient Name"}
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-rose-500 focus:outline-none transition-colors"
                  value={data.patientName || ""}
                  onChange={(e) => setData({ ...data, patientName: e.target.value })}
                />
                <div className="absolute right-1">
                  <VoiceInputButton
                    lang={voiceLang}
                    title={voiceLang === "bn" ? "রোগীর নাম মুখে বলুন" : "Speak Patient Name"}
                    onTranscript={(txt) => setData({ ...data, patientName: txt })}
                  />
                </div>
              </div>

              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder={docLang === "bn" ? "বয়স (যেমন: ৪৫)" : "Age"}
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-rose-500 focus:outline-none transition-colors"
                  value={data.patientAge || ""}
                  onChange={(e) => setData({ ...data, patientAge: e.target.value })}
                />
                <div className="absolute right-1">
                  <VoiceInputButton
                    lang={voiceLang}
                    title="Speak Age"
                    onTranscript={(txt) => setData({ ...data, patientAge: txt })}
                  />
                </div>
              </div>

              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder={docLang === "bn" ? "লিঙ্গ (পুরুষ / মহিলা)" : "Gender"}
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-rose-500 focus:outline-none transition-colors"
                  value={data.patientGender || ""}
                  onChange={(e) => setData({ ...data, patientGender: e.target.value })}
                />
                <div className="absolute right-1">
                  <VoiceInputButton
                    lang={voiceLang}
                    title="Speak Gender"
                    onTranscript={(txt) => setData({ ...data, patientGender: txt })}
                  />
                </div>
              </div>

              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder={docLang === "bn" ? "ওজন (যেমন: ৬৮ কেজি)" : "Weight"}
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-rose-500 focus:outline-none transition-colors"
                  value={data.patientWeight || ""}
                  onChange={(e) => setData({ ...data, patientWeight: e.target.value })}
                />
                <div className="absolute right-1">
                  <VoiceInputButton
                    lang={voiceLang}
                    title="Speak Weight"
                    onTranscript={(txt) => setData({ ...data, patientWeight: txt })}
                  />
                </div>
              </div>

              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder={docLang === "bn" ? "রক্তচাপ (BP: 120/80)" : "BP"}
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-rose-500 focus:outline-none transition-colors"
                  value={data.bp || ""}
                  onChange={(e) => setData({ ...data, bp: e.target.value })}
                />
                <div className="absolute right-1">
                  <VoiceInputButton
                    lang={voiceLang}
                    title="Speak BP"
                    onTranscript={(txt) => setData({ ...data, bp: txt })}
                  />
                </div>
              </div>

              {/* Date Input: Explicitly NO voice input */}
              <div className="col-span-2 sm:col-span-2">
                <input
                  type="date"
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:outline-none transition-colors"
                  value={data.date || "2026-11-11"}
                  onChange={(e) => setData({ ...data, date: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* 3. Clinical Symptoms, Diagnosis & Tests */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              {docLang === "bn" ? "৩. উপসর্গ, রোগ নির্ণয় ও পরীক্ষা" : "3. Symptoms, Diagnosis & Tests"}
            </label>
            <div className="space-y-2.5">
              <div className="relative flex items-start">
                <textarea
                  rows={2}
                  placeholder={docLang === "bn" ? "লক্ষণ ও প্রধান উপসর্গ (Chief Complaints)" : "Chief Complaints / Symptoms"}
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-9 focus:ring-2 focus:ring-rose-500 focus:outline-none resize-none"
                  value={data.complaints || ""}
                  onChange={(e) => setData({ ...data, complaints: e.target.value })}
                />
                <div className="absolute right-2 top-2">
                  <VoiceInputButton
                    lang={voiceLang}
                    title="Speak Symptoms"
                    onTranscript={(txt) => setData({ ...data, complaints: (data.complaints ? data.complaints + ", " : "") + txt })}
                  />
                </div>
              </div>

              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder={docLang === "bn" ? "রোগ নির্ণয় (Diagnosis)" : "Clinical Diagnosis"}
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  value={data.diagnosis || ""}
                  onChange={(e) => setData({ ...data, diagnosis: e.target.value })}
                />
                <div className="absolute right-1">
                  <VoiceInputButton
                    lang={voiceLang}
                    title="Speak Diagnosis"
                    onTranscript={(txt) => setData({ ...data, diagnosis: txt })}
                  />
                </div>
              </div>

              <div className="relative flex items-start">
                <textarea
                  rows={2}
                  placeholder={docLang === "bn" ? "প্রয়োজনীয় প্যাথলজি ও পরীক্ষা (Tests & Lab)" : "Advised Tests / Lab Investigations"}
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-9 focus:ring-2 focus:ring-rose-500 focus:outline-none resize-none"
                  value={data.tests || ""}
                  onChange={(e) => setData({ ...data, tests: e.target.value })}
                />
                <div className="absolute right-2 top-2">
                  <VoiceInputButton
                    lang={voiceLang}
                    title="Speak Tests"
                    onTranscript={(txt) => setData({ ...data, tests: (data.tests ? data.tests + "\n" : "") + txt })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 4. Medicines & Dosages (Rx) */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="font-bold text-rose-600 dark:text-rose-400">Rx</span>
                <span>{docLang === "bn" ? "৪. প্রেসক্রিপশন ও ওষুধের তালিকা" : "4. Medicines & Doses"}</span>
              </label>
              <button
                onClick={handleAddMedicine}
                className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 hover:underline font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> {docLang === "bn" ? "+ ওষুধ যোগ করুন" : "+ Add Medicine"}
              </button>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {medicinesList.map((med, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 w-4">{idx + 1}.</span>
                    <div className="flex-1 relative flex items-center">
                      <input
                        type="text"
                        placeholder={docLang === "bn" ? "ওষুধের নাম ও পাওয়ার (যেমন: Tab. Napa Extra)" : "Medicine Name & Strength"}
                        className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 pr-7 text-slate-900 dark:text-white focus:outline-none"
                        value={med.name}
                        onChange={(e) => handleMedicineChange(idx, "name", e.target.value)}
                      />
                      <div className="absolute right-1">
                        <VoiceInputButton
                          lang={voiceLang}
                          title="Speak Medicine Name"
                          onTranscript={(txt) => handleMedicineChange(idx, "name", txt)}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveMedicine(idx)}
                      className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        placeholder={docLang === "bn" ? "সেবনবিধি (১+০+১)" : "Dose (1+0+1)"}
                        className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 pr-6 text-slate-900 dark:text-white focus:outline-none"
                        value={med.dosage}
                        onChange={(e) => handleMedicineChange(idx, "dosage", e.target.value)}
                      />
                      <div className="absolute right-0.5">
                        <VoiceInputButton
                          lang={voiceLang}
                          title="Speak Dosage"
                          onTranscript={(txt) => handleMedicineChange(idx, "dosage", txt)}
                        />
                      </div>
                    </div>

                    <div className="relative flex items-center">
                      <input
                        type="text"
                        placeholder={docLang === "bn" ? "মেয়াদ (৫ দিন)" : "Duration (5 Days)"}
                        className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 pr-6 text-slate-900 dark:text-white focus:outline-none"
                        value={med.duration}
                        onChange={(e) => handleMedicineChange(idx, "duration", e.target.value)}
                      />
                      <div className="absolute right-0.5">
                        <VoiceInputButton
                          lang={voiceLang}
                          title="Speak Duration"
                          onTranscript={(txt) => handleMedicineChange(idx, "duration", txt)}
                        />
                      </div>
                    </div>

                    <div className="relative flex items-center">
                      <input
                        type="text"
                        placeholder={docLang === "bn" ? "নির্দেশনা (খাবারের পর)" : "Instruction"}
                        className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 pr-6 text-slate-900 dark:text-white focus:outline-none"
                        value={med.instruction}
                        onChange={(e) => handleMedicineChange(idx, "instruction", e.target.value)}
                      />
                      <div className="absolute right-0.5">
                        <VoiceInputButton
                          lang={voiceLang}
                          title="Speak Instruction"
                          onTranscript={(txt) => handleMedicineChange(idx, "instruction", txt)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Advice & Doctor Seal */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              {docLang === "bn" ? "৫. পরামর্শ ও স্বাক্ষর" : "5. Advice & Follow-Up"}
            </label>
            <div className="space-y-2">
              <div className="relative flex items-start">
                <textarea
                  rows={2}
                  placeholder={docLang === "bn" ? "ডাক্তারের পরামর্শ ও চলার নিয়ম (Advice)" : "General Advice & Precautions..."}
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-9 focus:ring-2 focus:ring-rose-500 focus:outline-none resize-none"
                  value={data.advice || ""}
                  onChange={(e) => setData({ ...data, advice: e.target.value })}
                />
                <div className="absolute right-2 top-2">
                  <VoiceInputButton
                    lang={voiceLang}
                    title="Speak Advice"
                    onTranscript={(txt) => setData({ ...data, advice: (data.advice ? data.advice + " " : "") + txt })}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="cursor-pointer flex items-center gap-1.5 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 transition">
                  <Upload className="w-3.5 h-3.5" />
                  {docLang === "bn" ? "ডিজিটাল সিল ও স্বাক্ষর আপলোড" : "Upload Doctor Seal / Signature"}
                  <input type="file" accept="image/*" className="hidden" onChange={handleSignatureUpload} />
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <button
              onClick={handlePrint}
              className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl shadow-xs transition text-xs sm:text-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              {docLang === "bn" ? "প্রেসক্রিপশন প্রিন্ট / PDF ডাউনলোড" : "Print Prescription / Save PDF"}
            </button>

            <button
              onClick={handleSaveToProfile}
              className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium py-2.5 rounded-xl transition text-xs cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  {docLang === "bn" ? "চেম্বার প্রিসেট সংরক্ষিত হয়েছে!" : "Prescription Preset Saved!"}
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  {docLang === "bn" ? "ভবিষ্যতের জন্য ডাক্তারের সিল ও তথ্য সেভ রাখুন" : "Save Doctor Profile Preset"}
                </>
              )}
            </button>
          </div>

          <AdSenseSlot slotId="medical-editor-sidebar" format="rectangle" label="Healthcare Partner" />
        </div>

        {/* RIGHT COLUMN: Live Printable A4 Prescription Pad */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3 print:hidden">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
              {docLang === "bn" ? "A4 লাইভ প্রেসক্রিপশন প্যাড (বাংলা)" : "A4 Clinical Prescription Live Preview (English)"}
            </div>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 hover:underline font-semibold cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              {docLang === "bn" ? "সরাসরি প্রিন্ট" : "Direct Download"}
            </button>
          </div>

          {/* REAL MEDICAL PRESCRIPTION CANVAS */}
          <div
            ref={printRef}
            id="printable-document"
            className="w-full max-w-[210mm] min-h-[297mm] bg-white text-gray-900 p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-200 print:border-none print:shadow-none print:p-0 print:m-0 print:w-full print:max-w-none text-xs flex flex-col justify-between"
          >
            <div>
              {/* Doctor Header Banner */}
              <div className="flex justify-between items-start border-b-2 border-rose-600 pb-5">
                <div className="space-y-1 max-w-[65%]">
                  <h1 className="text-xl sm:text-2xl font-black text-rose-800 tracking-tight">
                    {data.doctorName || "Dr. Farhana Yasmin"}
                  </h1>
                  <p className="text-xs font-bold text-gray-800 leading-snug">
                    {data.degrees || "MBBS, FCPS (Medicine)"}
                  </p>
                  <p className="text-[11px] font-semibold text-rose-700">
                    {data.regNo || "BMDC Reg No: A-54321"}
                  </p>
                  <p className="text-xs text-gray-600">
                    {data.hospitalName || "Specialist Chambers & Diagnostic Care"}
                  </p>
                </div>

                <div className="text-right space-y-1 max-w-[35%]">
                  <div className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 px-2.5 py-1 rounded text-[11px] font-bold">
                    <Stethoscope className="w-3.5 h-3.5 text-rose-600" />
                    <span>{docLang === "bn" ? "প্রেসক্রিপশন" : "PRESCRIPTION"}</span>
                  </div>
                  <p className="text-xs text-gray-600 font-medium mt-1">{data.chamberAddress}</p>
                  <p className="text-[11px] text-gray-500">
                    {docLang === "bn" ? "ফোন:" : "Phone:"} {data.phone}
                  </p>
                  <p className="text-[10px] text-gray-500 italic">{data.visitingHours}</p>
                </div>
              </div>

              {/* Patient Demographics & Vitals Bar */}
              <div className="grid grid-cols-12 gap-2 my-4 bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs">
                <div className="col-span-5">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">
                    {docLang === "bn" ? "রোগীর নাম:" : "Patient Name:"}
                  </span>
                  <span className="font-bold text-gray-900 text-sm">
                    {data.patientName || (docLang === "bn" ? "রোগীর নাম" : "Patient Name")}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">
                    {docLang === "bn" ? "বয়স:" : "Age:"}
                  </span>
                  <span className="font-semibold text-gray-800">{data.patientAge || "45 Yrs"}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">
                    {docLang === "bn" ? "লিঙ্গ:" : "Sex:"}
                  </span>
                  <span className="font-semibold text-gray-800">{data.patientGender || "Male"}</span>
                </div>
                <div className="col-span-3 text-right">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">
                    {docLang === "bn" ? "তারিখ:" : "Date:"}
                  </span>
                  <span className="font-bold text-gray-900">{data.date || "2026-11-11"}</span>
                </div>

                {(data.patientWeight || data.bp) && (
                  <div className="col-span-12 pt-2 mt-1 border-t border-gray-200 flex gap-6 text-[11px] text-gray-600">
                    {data.patientWeight && (
                      <span>
                        <strong className="text-gray-800">{docLang === "bn" ? "ওজন:" : "Wt:"}</strong>{" "}
                        {data.patientWeight}
                      </span>
                    )}
                    {data.bp && (
                      <span>
                        <strong className="text-gray-800">{docLang === "bn" ? "রক্তচাপ:" : "BP:"}</strong>{" "}
                        {data.bp}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Main Two-Column Prescription Body */}
              <div className="grid grid-cols-12 gap-6 min-h-[460px] pt-2">
                {/* Left Clinical Column (Complaints, Diagnosis, Tests) */}
                <div className="col-span-4 border-r-2 border-gray-200 pr-4 space-y-5">
                  {data.complaints && (
                    <div>
                      <h4 className="text-[11px] font-black text-rose-800 uppercase tracking-wider mb-1">
                        {docLang === "bn" ? "উপসর্গ / লক্ষণ (C/C):" : "Chief Complaints (C/C):"}
                      </h4>
                      <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                        {data.complaints}
                      </p>
                    </div>
                  )}

                  {data.diagnosis && (
                    <div>
                      <h4 className="text-[11px] font-black text-rose-800 uppercase tracking-wider mb-1">
                        {docLang === "bn" ? "রোগ নির্ণয় (Diagnosis):" : "Diagnosis (O/E):"}
                      </h4>
                      <p className="text-xs font-semibold text-gray-800 bg-rose-50/70 p-2 rounded border border-rose-100">
                        {data.diagnosis}
                      </p>
                    </div>
                  )}

                  {data.tests && (
                    <div>
                      <h4 className="text-[11px] font-black text-rose-800 uppercase tracking-wider mb-1">
                        {docLang === "bn" ? "প্রয়োজনীয় পরীক্ষা (Inv):" : "Advised Tests (Inv):"}
                      </h4>
                      <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                        {data.tests}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Rx Column (Medicines, Dosages, Advice) */}
                <div className="col-span-8 pl-2 space-y-6">
                  {/* Big Traditional Rx Icon */}
                  <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                    <span className="text-3xl font-black text-rose-700 italic font-serif">℞</span>
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">
                      {docLang === "bn" ? "ওষুধ সেবন নির্দেশিকা" : "Prescription Medications"}
                    </span>
                  </div>

                  {/* Medicines List */}
                  <div className="space-y-4">
                    {medicinesList.map((med, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs font-black text-gray-900">
                            {idx + 1}. {med.name}
                          </span>
                          <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                            {med.duration}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-700 pl-4">
                          <span className="font-semibold text-gray-900 bg-gray-100 px-2 py-0.5 rounded text-[11px]">
                            {med.dosage}
                          </span>
                          <span className="text-gray-500 italic text-[11px]">
                            ({med.instruction})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Doctor's Advice Section */}
                  {data.advice && (
                    <div className="mt-8 pt-4 border-t border-gray-200">
                      <h4 className="text-[11px] font-black text-rose-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-rose-600" />
                        <span>{docLang === "bn" ? "পরামর্শ ও নির্দেশনা:" : "General Advice & Care:"}</span>
                      </h4>
                      <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 p-3 rounded-lg border border-gray-200">
                        {data.advice}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Signature & Footer */}
            <div className="mt-12 pt-6 border-t border-gray-200 flex justify-between items-end">
              <div>
                <p className="text-[10px] text-gray-400">
                  {docLang === "bn" ? "তৈরি হয়েছে" : "Generated via"}{" "}
                  <strong className="text-gray-600">freedocforge.com</strong> •{" "}
                  {docLang === "bn" ? "১০০% ফ্রি ডিজিটাল প্রেসক্রিপশন" : "100% Free Smart Printable Rx"}
                </p>
                <p className="text-[9px] text-gray-400">
                  {docLang === "bn"
                    ? "চিকিৎসকের পরামর্শ ছাড়া কোনো ওষুধ পরিবর্তন করবেন না।"
                    : "Do not alter medications without consulting your physician."}
                </p>
              </div>

              <div className="text-center min-w-[160px]">
                {signaturePreview ? (
                  <img src={signaturePreview} alt="Doctor Seal" className="h-14 mx-auto mb-1 object-contain" />
                ) : (
                  <div className="w-40 border-b-2 border-gray-400 mb-1 mx-auto"></div>
                )}
                <span className="text-[11px] font-bold text-gray-800 block">
                  {data.signatoryTitle ||
                    (docLang === "bn" ? "চিকিৎসকের স্বাক্ষর ও সিল" : "Doctor's Signature & Seal")}
                </span>
                <span className="text-[10px] text-gray-500 block">
                  {data.doctorName || "Treating Physician"}
                </span>
              </div>
            </div>
          </div>

          <AdSenseSlot slotId="medical-canvas-bottom" format="horizontal" className="print:hidden mt-4" />
        </div>
      </div>
    </div>
  );
}
