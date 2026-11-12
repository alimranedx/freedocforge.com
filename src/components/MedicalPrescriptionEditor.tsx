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
  Save,
  BookmarkCheck,
  Loader2,
} from "lucide-react";
import AdSenseSlot from "@/components/AdSenseSlot";
import VoiceInputButton from "@/components/VoiceInputButton";
import { useGlobalSettings } from "@/context/GlobalSettingsContext";
import ThemeSelectorBar from "@/components/ThemeSelectorBar";
import {
  detectDefaultThemeForTemplate,
  DESIGN_THEMES,
  DesignThemeId,
} from "@/lib/designThemes";

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

  // Document Design Theme Archetype
  const [activeThemeId, setActiveThemeId] = useState<DesignThemeId>(() => {
    return detectDefaultThemeForTemplate("Healthcare", templateSlug);
  });
  const activeTheme = DESIGN_THEMES[activeThemeId] || DESIGN_THEMES["clinical-teal"];
  const [data, setData] = useState({ ...initialData });
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const [docSaveLoading, setDocSaveLoading] = useState(false);
  const [docSaveSuccess, setDocSaveSuccess] = useState(false);
  const [docSaveMessage, setDocSaveMessage] = useState<string | null>(null);

  // Auto-fill from user's active preset or load saved document
  useEffect(() => {
    // 1. Check if user opened a saved document via ?docId=...
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const docId = params.get("docId");

      if (docId) {
        fetch(`/api/user/documents/${docId}`)
          .then((res) => (res.ok ? res.json() : null))
          .then((resData) => {
            if (resData?.document?.dataJson) {
              const saved = resData.document.dataJson;
              setData((prev: any) => ({ ...prev, ...saved }));
              if (saved.signatureUrl) setSignaturePreview(saved.signatureUrl);
              if (saved.docLang) setDocLang(saved.docLang);
            }
          })
          .catch(() => {});
        return;
      }
    }

    // 2. Load medical preset from localStorage first
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
    } else {
      // 3. Fallback: Load saved preset from user cloud account
      fetch("/api/user/profile")
        .then((res) => (res.ok ? res.json() : null))
        .then((resData) => {
          if (resData?.profile) {
            const p = resData.profile;
            setData((prev: any) => ({
              ...prev,
              doctorName: p.businessName || prev.doctorName,
              degrees: p.tagline || prev.degrees,
              phone: p.phone || prev.phone,
              chamberAddress: p.address || prev.chamberAddress,
              advice: p.terms || prev.advice,
            }));
            if (p.signatureUrl) setSignaturePreview(p.signatureUrl);
          }
        })
        .catch(() => {});
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

  const handleSaveToProfile = async () => {
    const presetData = {
      businessName: data.doctorName || "",
      tagline: data.degrees || "",
      phone: data.phone || "",
      address: data.chamberAddress || "",
      currency: "৳",
      terms: data.advice || "",
      signatureUrl: signaturePreview || null,
      presetType: "medical",
    };

    localStorage.setItem("freedocforge_active_preset", JSON.stringify(presetData));

    try {
      await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(presetData),
      });
    } catch (err) {
      console.warn("Could not sync doctor profile to cloud:", err);
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSaveDocument = async () => {
    setDocSaveLoading(true);
    setDocSaveMessage(null);

    const recipient = data.patientName ? `${data.patientName}${data.patientAge ? ` (${data.patientAge}y)` : ""}` : "Patient";
    const docNum = data.prescriptionNumber || data.tokenNumber || data.regNumber || `RX-${Date.now().toString().slice(-5)}`;
    const details = Array.isArray(data.medicines) && data.medicines.length > 0
      ? data.medicines.map((m: any) => m.name).slice(0, 2).join(", ")
      : "Clinical Consultation";

    const docPayload = {
      templateSlug,
      templateTitle: locales?.[docLang]?.title || data.doctorName || "Prescription Pad",
      category: "Healthcare",
      documentNumber: docNum,
      recipientName: recipient,
      amountOrDetails: details,
      status: "Saved",
      dataJson: {
        ...data,
        signatureUrl: signaturePreview,
        docLang,
      },
    };

    // Save locally first
    try {
      const existing = JSON.parse(localStorage.getItem("freedocforge_history") || "[]");
      const localItem = {
        id: `local-${Date.now()}`,
        ...docPayload,
        date: new Date().toISOString().split("T")[0],
      };
      localStorage.setItem("freedocforge_history", JSON.stringify([localItem, ...existing]));
    } catch (e) {}

    // Persist to user cloud account
    try {
      const res = await fetch("/api/user/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(docPayload),
      });

      const resData = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          setDocSaveMessage(
            docLang === "bn"
              ? "ব্রাউজারে সেভ হয়েছে! ক্লাউড হিস্ট্রির জন্য লগইন করুন।"
              : "Saved in browser! Log in to save to your cloud account."
          );
        } else {
          throw new Error(resData.error || "Failed to save");
        }
      } else {
        setDocSaveMessage(
          docLang === "bn"
            ? "প্রেসক্রিপশন সফলভাবে ক্লাউডে সংরক্ষিত হয়েছে!"
            : "Prescription saved to your cloud history!"
        );
      }
      setDocSaveSuccess(true);
      setTimeout(() => {
        setDocSaveSuccess(false);
        setDocSaveMessage(null);
      }, 4000);
    } catch (err: any) {
      setDocSaveMessage(err.message || "Saved locally");
      setDocSaveSuccess(true);
      setTimeout(() => {
        setDocSaveSuccess(false);
        setDocSaveMessage(null);
      }, 4000);
    } finally {
      setDocSaveLoading(false);
    }
  };

  const isSerial =
    templateSlug === "medical-appointment-token" ||
    templateSlug === "hospital-admission-slip" ||
    !!data.serialNo;

  const isDischarge =
    templateSlug === "medical-discharge-slip" ||
    templateSlug === "radiology-report-pad" ||
    (!!data.regNo && !data.medicines);

  const isPrescription = !isSerial && !isDischarge;

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
            {isSerial ? "English Token" : isDischarge ? "English Summary" : "English Rx"}
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
            {isSerial ? "বাংলা সিরিয়াল স্লিপ" : isDischarge ? "বাংলা ছাড়পত্র" : "বাংলা ব্যবস্থাপত্র"}
          </button>
        </div>
      </div>

      {/* INTERACTIVE 1-CLICK THEME SELECTOR BAR */}
      <ThemeSelectorBar
        activeThemeId={activeThemeId}
        onSelectTheme={setActiveThemeId}
        lang={docLang}
      />

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

          {/* 3. Clinical Symptoms, Diagnosis & Tests (For Prescriptions) */}
          {isPrescription && (
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
          )}

          {/* 3. Appointment & Token Details (For Serial / Token Slips) */}
          {isSerial && (
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                {docLang === "bn" ? "৩. সিরিয়াল ও অ্যাপয়েন্টমেন্ট তথ্য" : "3. Serial & Token Details"}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder={docLang === "bn" ? "সিরিয়াল নং (যেমন: SL - 24)" : "Serial No (e.g. SL - 24)"}
                    className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    value={data.serialNo || ""}
                    onChange={(e) => setData({ ...data, serialNo: e.target.value })}
                  />
                  <div className="absolute right-1">
                    <VoiceInputButton
                      lang={voiceLang}
                      title="Speak Serial No"
                      onTranscript={(txt) => setData({ ...data, serialNo: txt })}
                    />
                  </div>
                </div>

                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder={docLang === "bn" ? "রুম নং (যেমন: ৩০৪)" : "Room No (e.g. 304)"}
                    className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    value={data.roomNo || ""}
                    onChange={(e) => setData({ ...data, roomNo: e.target.value })}
                  />
                  <div className="absolute right-1">
                    <VoiceInputButton
                      lang={voiceLang}
                      title="Speak Room No"
                      onTranscript={(txt) => setData({ ...data, roomNo: txt })}
                    />
                  </div>
                </div>

                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder={docLang === "bn" ? "আনুমানিক সময় (যেমন: সন্ধ্যা ৬:৩০)" : "Time (e.g. 06:30 PM)"}
                    className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    value={data.appointmentTime || ""}
                    onChange={(e) => setData({ ...data, appointmentTime: e.target.value })}
                  />
                  <div className="absolute right-1">
                    <VoiceInputButton
                      lang={voiceLang}
                      title="Speak Time"
                      onTranscript={(txt) => setData({ ...data, appointmentTime: txt })}
                    />
                  </div>
                </div>

                <div className="relative flex items-center">
                  <input
                    type="number"
                    placeholder={docLang === "bn" ? "ভিজিট ফি (যেমন: ১০০০)" : "Consultation Fee (BDT)"}
                    className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    value={data.consultationFee || ""}
                    onChange={(e) => setData({ ...data, consultationFee: e.target.value })}
                  />
                </div>

                <div className="col-span-2 relative flex items-start">
                  <textarea
                    rows={2}
                    placeholder={docLang === "bn" ? "রোগীর নির্দেশনাবলী (যেমন: পূর্বের প্রেসক্রিপশন সাথে আনুন)" : "Patient Instructions..."}
                    className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-9 focus:ring-2 focus:ring-rose-500 focus:outline-none resize-none"
                    value={data.instructions || ""}
                    onChange={(e) => setData({ ...data, instructions: e.target.value })}
                  />
                  <div className="absolute right-2 top-2">
                    <VoiceInputButton
                      lang={voiceLang}
                      title="Speak Instructions"
                      onTranscript={(txt) => setData({ ...data, instructions: (data.instructions ? data.instructions + " " : "") + txt })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. Hospital Admission & Discharge Details (For Discharge & Radiology) */}
          {isDischarge && (
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                {docLang === "bn" ? "৩. ছাড়পত্র ও চিকিৎসা সারসংক্ষেপ" : "3. Discharge & Clinical Course"}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder={docLang === "bn" ? "কেবিন / বেড নং (যেমন: 402)" : "Bed / Cabin No"}
                    className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    value={data.bedNo || ""}
                    onChange={(e) => setData({ ...data, bedNo: e.target.value })}
                  />
                  <div className="absolute right-1">
                    <VoiceInputButton
                      lang={voiceLang}
                      title="Speak Bed No"
                      onTranscript={(txt) => setData({ ...data, bedNo: txt })}
                    />
                  </div>
                </div>

                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder={docLang === "bn" ? "ভর্তির তারিখ (Admission Date)" : "Admission Date"}
                    className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    value={data.admissionDate || ""}
                    onChange={(e) => setData({ ...data, admissionDate: e.target.value })}
                  />
                  <div className="absolute right-1">
                    <VoiceInputButton
                      lang={voiceLang}
                      title="Speak Admission Date"
                      onTranscript={(txt) => setData({ ...data, admissionDate: txt })}
                    />
                  </div>
                </div>

                <div className="col-span-2 relative flex items-center">
                  <input
                    type="text"
                    placeholder={docLang === "bn" ? "চূড়ান্ত রোগ নির্ণয় (Final Diagnosis)" : "Final Diagnosis"}
                    className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    value={data.finalDiagnosis || ""}
                    onChange={(e) => setData({ ...data, finalDiagnosis: e.target.value })}
                  />
                  <div className="absolute right-1">
                    <VoiceInputButton
                      lang={voiceLang}
                      title="Speak Final Diagnosis"
                      onTranscript={(txt) => setData({ ...data, finalDiagnosis: txt })}
                    />
                  </div>
                </div>

                <div className="col-span-2 relative flex items-start">
                  <textarea
                    rows={2}
                    placeholder={docLang === "bn" ? "চিকিৎসার সারসংক্ষেপ ও অপারেশন (Clinical Summary)" : "Treatment Summary & Clinical Course..."}
                    className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-9 focus:ring-2 focus:ring-rose-500 focus:outline-none resize-none"
                    value={data.treatmentSummary || ""}
                    onChange={(e) => setData({ ...data, treatmentSummary: e.target.value })}
                  />
                  <div className="absolute right-2 top-2">
                    <VoiceInputButton
                      lang={voiceLang}
                      title="Speak Summary"
                      onTranscript={(txt) => setData({ ...data, treatmentSummary: (data.treatmentSummary ? data.treatmentSummary + " " : "") + txt })}
                    />
                  </div>
                </div>

                <div className="col-span-2 relative flex items-start">
                  <textarea
                    rows={2}
                    placeholder={docLang === "bn" ? "ছাড়কালীন ওষুধ ও নিয়ম (Discharge Medications)" : "Discharge Medications..."}
                    className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-9 focus:ring-2 focus:ring-rose-500 focus:outline-none resize-none"
                    value={data.dischargeMeds || ""}
                    onChange={(e) => setData({ ...data, dischargeMeds: e.target.value })}
                  />
                  <div className="absolute right-2 top-2">
                    <VoiceInputButton
                      lang={voiceLang}
                      title="Speak Discharge Meds"
                      onTranscript={(txt) => setData({ ...data, dischargeMeds: (data.dischargeMeds ? data.dischargeMeds + " " : "") + txt })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. Medicines & Dosages (Rx) - For Prescriptions only */}
          {isPrescription && (
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
          )}

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
            {/* 1. Print / Save as PDF */}
            <button
              onClick={handlePrint}
              className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl shadow-xs transition text-xs sm:text-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              {docLang === "bn" ? "প্রেসক্রিপশন প্রিন্ট / PDF ডাউনলোড" : "Print Prescription / Save PDF"}
            </button>

            {/* 2. Save Document for Next Use (Cloud + Local) */}
            <button
              onClick={handleSaveDocument}
              disabled={docSaveLoading}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl shadow-xs transition text-xs cursor-pointer disabled:opacity-50"
            >
              {docSaveLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{docLang === "bn" ? "সংরক্ষণ হচ্ছে..." : "Saving..."}</span>
                </>
              ) : docSaveSuccess ? (
                <>
                  <BookmarkCheck className="w-4 h-4 text-white" />
                  <span>{docLang === "bn" ? "প্রেসক্রিপশন সংরক্ষিত হয়েছে!" : "Prescription Saved!"}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{docLang === "bn" ? "পরবর্তী ব্যবহারের জন্য প্রেসক্রিপশন সেভ রাখুন" : "Save Prescription for Next Use"}</span>
                </>
              )}
            </button>

            {/* Feedback notice for document save */}
            {docSaveMessage && (
              <div className="text-[11px] text-center font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 p-2 rounded-lg border border-emerald-200 dark:border-emerald-800">
                {docSaveMessage}
              </div>
            )}

            {/* 3. Save Doctor Profile Preset */}
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
                  {docLang === "bn" ? "ডাক্তারের সিল ও প্যাড প্রিসেট সেভ করুন" : "Save Doctor Profile Preset"}
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
              {isSerial
                ? docLang === "bn"
                  ? "A4 রোগী সিরিয়াল টোকেন প্রিভিউ"
                  : "A4 Patient Appointment Token Live Preview"
                : isDischarge
                ? docLang === "bn"
                  ? "A4 হাসপাতাল ছাড়পত্র প্রিভিউ"
                  : "A4 Hospital Discharge Summary Live Preview"
                : docLang === "bn"
                ? "A4 লাইভ প্রেসক্রিপশন প্যাড (বাংলা)"
                : "A4 Clinical Prescription Live Preview (English)"}
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
            className={`w-full max-w-[210mm] min-h-[297mm] p-8 sm:p-10 print:border-none print:shadow-none print:p-0 print:m-0 print:w-full print:max-w-none text-xs flex flex-col justify-between transition-colors ${activeTheme.fontFamily} ${activeTheme.containerClass}`}
          >
            {isSerial ? (
              /* 1. SERIAL TOKEN / ADMISSION SLIP CANVAS */
              <div className="space-y-6">
                <div className={`flex justify-between items-start pb-5 ${activeTheme.headerBorderClass}`}>
                  <div className="space-y-1 max-w-[65%]">
                    <h1 className="text-xl sm:text-2xl font-black text-rose-800 tracking-tight">
                      {data.hospitalName ||
                        (docLang === "bn" ? "বিশেষজ্ঞ চেম্বার ও ক্লিনিক" : "Specialist Chambers & Clinic")}
                    </h1>
                    <p className="text-xs text-gray-600 font-medium">{data.tagline || data.address}</p>
                    <p className="text-[11px] text-gray-500">
                      {docLang === "bn" ? "ফোন:" : "Phone:"} {data.phone}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-rose-700 text-white font-bold text-xs px-3 py-1 rounded-sm uppercase tracking-wider">
                      {templateSlug.includes("admission")
                        ? docLang === "bn"
                          ? "ভর্তি স্লিপ"
                          : "ADMISSION SLIP"
                        : docLang === "bn"
                        ? "সিরিয়াল টোকেন"
                        : "APPOINTMENT TOKEN"}
                    </span>
                    <p className="text-xs font-semibold text-gray-700 mt-1">
                      {docLang === "bn" ? "তারিখ:" : "Date:"} {data.date || "2026-11-11"}
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-rose-50/60 dark:bg-rose-950/30 rounded-2xl border-2 border-rose-300 text-center my-4">
                  <span className="text-xs uppercase font-extrabold tracking-widest text-rose-700 block mb-1">
                    {docLang === "bn" ? "পেশেন্ট সিরিয়াল নম্বর" : "APPOINTMENT SERIAL NUMBER"}
                  </span>
                  <span className="text-5xl font-black text-rose-900 dark:text-rose-100 tracking-tight">
                    {data.serialNo || data.regNo || "SL - 24"}
                  </span>
                  <div className="mt-3 flex items-center justify-center gap-4 text-xs font-bold text-slate-700 dark:text-slate-300">
                    {data.appointmentTime && (
                      <span>
                        {docLang === "bn" ? "আনুমানিক সময়:" : "Est. Time:"} {data.appointmentTime}
                      </span>
                    )}
                    {data.roomNo && <span>•</span>}
                    {data.roomNo && (
                      <span>
                        {docLang === "bn" ? "রুম নং:" : "Room:"} {data.roomNo}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">
                      {docLang === "bn" ? "চিকিৎসক:" : "Consulting Doctor:"}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900">{data.doctorName || "Specialist Doctor"}</h3>
                    <p className="text-xs text-rose-700 font-semibold">{data.speciality || data.degrees}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">
                      {docLang === "bn" ? "রোগীর তথ্য:" : "Patient Info:"}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900">{data.patientName || "Patient Name"}</h3>
                    <p className="text-xs text-gray-600">
                      {data.patientAge} • {data.patientGender} • {data.patientPhone}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-emerald-50 text-emerald-900 rounded-lg border border-emerald-200 font-bold text-xs">
                  <span>{docLang === "bn" ? "পেমেন্ট অবস্থা / ফি:" : "Consultation Fee:"}</span>
                  <span className="text-sm">
                    {data.paymentStatus || data.consultationFee || "PAID IN FULL (৳ 1,500)"}
                  </span>
                </div>

                {data.instructions && (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-[11px] text-gray-600">
                    <span className="font-bold text-gray-800 block mb-1">
                      {docLang === "bn" ? "রোগীদের জন্য নির্দেশনা:" : "Instructions:"}
                    </span>
                    <p className="leading-relaxed">{data.instructions}</p>
                  </div>
                )}
              </div>
            ) : isDischarge ? (
              /* 2. DISCHARGE CERTIFICATE / RADIOLOGY REPORT CANVAS */
              <div className="space-y-6">
                <div className={`flex justify-between items-start pb-5 ${activeTheme.headerBorderClass}`}>
                  <div className="space-y-1 max-w-[65%]">
                    <h1 className="text-xl sm:text-2xl font-black text-rose-800 tracking-tight">
                      {data.hospitalName ||
                        (docLang === "bn"
                          ? "হাসপাতাল ও ডায়াগনস্টিক কেয়ার"
                          : "Specialist Hospital & Diagnostic Care")}
                    </h1>
                    <p className="text-xs text-gray-600 font-medium">{data.tagline || data.address}</p>
                    <p className="text-[11px] text-gray-500">
                      {docLang === "bn" ? "ফোন:" : "Phone:"} {data.phone}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-rose-700 text-white font-bold text-xs px-3 py-1 rounded-sm uppercase tracking-wider">
                      {templateSlug.includes("radiology")
                        ? docLang === "bn"
                          ? "রেডিওলজি রিপোর্ট"
                          : "RADIOLOGY REPORT"
                        : docLang === "bn"
                        ? "হাসপাতাল ছাড়পত্র"
                        : "DISCHARGE SUMMARY"}
                    </span>
                    <p className="text-xs font-semibold text-gray-700 mt-1">
                      {docLang === "bn" ? "ছাড়পত্র তারিখ:" : "Discharge Date:"}{" "}
                      {data.dischargeDate || data.date}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Patient Name:</span>
                    <span className="font-bold text-gray-900">{data.patientName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Age / Gender:</span>
                    <span className="font-semibold text-gray-800">
                      {data.patientAge} / {data.patientGender}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Reg / IPD No:</span>
                    <span className="font-bold text-gray-900">{data.regNo || "REG-9402"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Bed / Cabin:</span>
                    <span className="font-semibold text-gray-800">{data.bedNo || "Cabin 402"}</span>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-gray-200">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Admission Date:</span>
                    <span className="font-semibold text-gray-800">{data.admissionDate || "08/11/2026"}</span>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-gray-200">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Discharge Date:</span>
                    <span className="font-semibold text-gray-800">{data.dischargeDate || "11/11/2026"}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {data.finalDiagnosis && (
                    <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200">
                      <span className="text-[10px] uppercase font-bold text-rose-800 block mb-1">
                        {docLang === "bn" ? "রোগ নির্ণয় (Final Diagnosis):" : "Final Clinical Diagnosis:"}
                      </span>
                      <p className="text-xs font-bold text-gray-900">{data.finalDiagnosis}</p>
                    </div>
                  )}

                  {data.treatmentSummary && (
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                        {docLang === "bn"
                          ? "প্রদত্ত চিকিৎসা ও কোর্স (Treatment Summary):"
                          : "Hospital Course & Treatment Given:"}
                      </span>
                      <p className="text-xs text-gray-800 whitespace-pre-line leading-relaxed">
                        {data.treatmentSummary}
                      </p>
                    </div>
                  )}

                  {data.dischargeMeds && (
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                        {docLang === "bn"
                          ? "বাসায় সেবনের ওষুধ (Discharge Medications):"
                          : "Discharge Medications (Rx):"}
                      </span>
                      <p className="text-xs font-semibold text-gray-900 whitespace-pre-line leading-relaxed">
                        {data.dischargeMeds}
                      </p>
                    </div>
                  )}

                  {data.followUp && (
                    <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200">
                      <span className="text-[10px] uppercase font-bold text-amber-900 block mb-1">
                        {docLang === "bn"
                          ? "পরবর্তী সাক্ষাতের তারিখ ও পরামর্শ (Follow-up Advice):"
                          : "Follow-up Advice & Instructions:"}
                      </span>
                      <p className="text-xs text-amber-950 font-medium">{data.followUp}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* 3. CLINICAL PRESCRIPTION PAD */
              <div>
                {/* Doctor Header Banner */}
                <div className={`flex justify-between items-start pb-5 ${activeTheme.headerBorderClass}`}>
                  <div className="space-y-1 max-w-[65%]">
                    <h1 className="text-xl sm:text-2xl font-black text-rose-800 tracking-tight">
                      {data.doctorName ||
                        (docLang === "bn" ? "ডা. বিশেষজ্ঞ চিকিৎসক" : "Dr. Specialist Physician")}
                    </h1>
                    <p className="text-xs font-bold text-gray-800 leading-snug">
                      {data.degrees ||
                        data.speciality ||
                        (docLang === "bn" ? "এমবিবিএস, বিসিএস (স্বাস্থ্য)" : "MBBS, Specialist")}
                    </p>
                    <p className="text-[11px] font-semibold text-rose-700">
                      {data.regNo || (docLang === "bn" ? "বিএমডিসি রেজি নং" : "BMDC Reg No")}
                    </p>
                    <p className="text-xs text-gray-600">
                      {data.hospitalName ||
                        (docLang === "bn"
                          ? "বিশেষজ্ঞ চেম্বার ও কনসালটেশন"
                          : "Specialist Chambers & Care")}
                    </p>
                  </div>

                  <div className="text-right space-y-1 max-w-[35%]">
                    <div className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 px-2.5 py-1 rounded text-[11px] font-bold">
                      <Stethoscope className="w-3.5 h-3.5 text-rose-600" />
                      <span>
                        {templateSlug.includes("dental")
                          ? docLang === "bn"
                            ? "ডেন্টাল প্রেসক্রিপশন"
                            : "DENTAL SURGEON Rx"
                          : templateSlug.includes("eye")
                          ? docLang === "bn"
                            ? "আই ও ভিশন প্রেসক্রিপশন"
                            : "VISION & EYE Rx"
                          : templateSlug.includes("pediatric")
                          ? docLang === "bn"
                            ? "শিশু বিশেষজ্ঞ প্রেসক্রিপশন"
                            : "PEDIATRIC Rx"
                          : templateSlug.includes("physio")
                          ? docLang === "bn"
                            ? "ফিজিওথেরাপি প্রেসক্রিপশন"
                            : "PHYSIOTHERAPY Rx"
                          : docLang === "bn"
                          ? "চিকিৎসাপত্র / প্রেসক্রিপশন"
                          : "PRESCRIPTION (Rx)"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 font-medium mt-1">{data.chamberAddress}</p>
                    <p className="text-[11px] text-gray-500">
                      {docLang === "bn" ? "ফোন:" : "Phone:"} {data.phone}
                    </p>
                    <p className="text-[10px] text-gray-500 italic">{data.visitingHours}</p>
                  </div>
                </div>

                {/* Patient Demographics & Vitals Bento Card */}
                <div className="grid grid-cols-12 gap-3 my-5 bg-slate-50/80 border border-slate-200/90 rounded-2xl p-4 sm:p-5 text-xs shadow-2xs">
                  <div className="col-span-5">
                    <span className="text-[9.5px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">
                      {docLang === "bn" ? "রোগীর নাম:" : "PATIENT NAME:"}
                    </span>
                    <span className="font-extrabold text-slate-900 text-sm block truncate">
                      {data.patientName || (docLang === "bn" ? "রোগীর নাম" : "Patient Name")}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[9.5px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">
                      {docLang === "bn" ? "বয়স:" : "AGE:"}
                    </span>
                    <span className="font-bold text-slate-800 tabular-nums block">{data.patientAge || "45 Yrs"}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[9.5px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">
                      {docLang === "bn" ? "লিঙ্গ:" : "GENDER:"}
                    </span>
                    <span className="font-bold text-slate-800 block">{data.patientGender || "Male"}</span>
                  </div>
                  <div className="col-span-3 text-right">
                    <span className="text-[9.5px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">
                      {docLang === "bn" ? "তারিখ:" : "DATE:"}
                    </span>
                    <span className="font-bold text-slate-900 tabular-nums block">{data.date || "2026-11-11"}</span>
                  </div>

                  {(data.patientWeight || data.bp) && (
                    <div className="col-span-12 pt-2.5 mt-1 border-t border-slate-200/80 flex gap-6 text-[11px] text-slate-600 font-medium">
                      {data.patientWeight && (
                        <span>
                          <strong className="text-slate-900">{docLang === "bn" ? "ওজন:" : "Wt:"}</strong>{" "}
                          <span className="tabular-nums">{data.patientWeight}</span>
                        </span>
                      )}
                      {data.bp && (
                        <span>
                          <strong className="text-slate-900">{docLang === "bn" ? "রক্তচাপ:" : "BP:"}</strong>{" "}
                          <span className="tabular-nums text-rose-700 font-bold">{data.bp}</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Main Two-Column Prescription Body */}
                <div className="grid grid-cols-12 gap-6 min-h-[460px] pt-2">
                  {/* Left Clinical Column (Complaints, Diagnosis, Tests) */}
                  <div className="col-span-4 border-r-2 border-slate-200 pr-4 space-y-5">
                    {data.chiefComplaints || data.complaints ? (
                      <div>
                        <h4 className="text-[10px] font-black text-rose-800 uppercase tracking-widest mb-1">
                          {docLang === "bn" ? "উপসর্গ / লক্ষণ (C/C):" : "CHIEF COMPLAINTS (C/C):"}
                        </h4>
                        <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                          {data.chiefComplaints || data.complaints}
                        </p>
                      </div>
                    ) : null}

                    {data.diagnosis && (
                      <div>
                        <h4 className="text-[10px] font-black text-rose-800 uppercase tracking-widest mb-1">
                          {docLang === "bn" ? "রোগ নির্ণয় (Diagnosis):" : "DIAGNOSIS (O/E):"}
                        </h4>
                        <p className="text-xs font-bold text-slate-800 bg-rose-50/70 p-2.5 rounded-xl border border-rose-200/80 shadow-2xs">
                          {data.diagnosis}
                        </p>
                      </div>
                    )}

                    {data.tests && (
                      <div>
                        <h4 className="text-[10px] font-black text-rose-800 uppercase tracking-widest mb-1">
                          {docLang === "bn" ? "প্রয়োজনীয় পরীক্ষা (Inv):" : "ADVISED TESTS (INV):"}
                        </h4>
                        <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/80 p-3 rounded-xl border border-slate-200">
                          {data.tests}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Rx Column (Medicines, Dosages, Advice) */}
                  <div className="col-span-8 pl-3 space-y-5">
                    {/* Big Traditional Rx Icon */}
                    <div className="flex items-center gap-2 border-b-2 border-teal-700/80 pb-2">
                      <span className="text-3xl font-serif font-black text-teal-800 leading-none">℞</span>
                      <span className="text-[9.5px] uppercase font-black text-teal-900 tracking-widest">
                        {docLang === "bn" ? "ওষুধ সেবন নির্দেশিকা" : "PRESCRIBED MEDICATIONS & DOSAGE"}
                      </span>
                    </div>

                    {/* Medicines List */}
                    <div className="space-y-3">
                      {medicinesList.map((med, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3 shadow-2xs hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-baseline justify-between">
                            <span className="text-xs font-extrabold text-slate-900">
                              <span className="text-teal-700 mr-1.5 tabular-nums">{idx + 1}.</span>
                              {med.name}
                            </span>
                            <span className="text-xs font-black text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200 tabular-nums">
                              {med.duration}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-700 pl-4 mt-1.5">
                            <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md text-[11px] tabular-nums">
                              {med.dosage}
                            </span>
                            <span className="text-slate-500 italic text-[11px] font-medium">
                              ({med.instruction})
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Doctor's Advice Section */}
                    {data.advice && (
                      <div className="mt-6 pt-4 border-t border-slate-200">
                        <h4 className="text-[10px] font-black text-rose-800 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-rose-600" />
                          <span>{docLang === "bn" ? "পরামর্শ ও নির্দেশনা:" : "GENERAL ADVICE & CARE:"}</span>
                        </h4>
                        <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
                          {data.advice}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

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
                <div className="mb-2">
                  <div className={activeTheme.sealClass}>
                    <span>✚</span>
                    <span>{docLang === "bn" ? "রেজিস্টার্ড চিকিৎসক" : "BMDC REGISTERED"}</span>
                    <span>✚</span>
                  </div>
                </div>
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
