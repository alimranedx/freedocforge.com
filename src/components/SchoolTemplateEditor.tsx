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
  GraduationCap,
  Award,
  Calendar,
  Clock,
  BookOpen,
  UserCheck,
  FileText,
  ShieldCheck,
  Save,
  BookmarkCheck,
  Loader2,
  MessageCircle,
  Image as ImageIcon,
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
import { exportElementToPdf, exportElementToJpg } from "@/lib/pdfExport";

interface SubjectItem {
  name: string;
  marks: number;
  fullMarks?: number;
  grade?: string;
}

export default function SchoolTemplateEditor({
  initialData,
  locales,
  templateSlug = "school-result-sheet",
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
    return detectDefaultThemeForTemplate("Education", templateSlug);
  });
  const activeTheme = DESIGN_THEMES[activeThemeId] || DESIGN_THEMES["royal-academic"];
  const [data, setData] = useState({ ...initialData });
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingJpg, setIsExportingJpg] = useState(false);
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

    // 2. Load school preset from localStorage first
    const saved = localStorage.getItem("freedocforge_active_preset");
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (p.presetType === "school") {
          setData((prev: any) => ({
            ...prev,
            instituteName: p.businessName || prev.instituteName,
            tagline: p.tagline || prev.tagline,
            phone: p.phone || prev.phone,
            address: p.address || prev.address,
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
              instituteName: p.businessName || prev.instituteName,
              tagline: p.tagline || prev.tagline,
              phone: p.phone || prev.phone,
              address: p.address || prev.address,
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

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!printRef.current || isExportingPdf) return;
    try {
      setIsExportingPdf(true);
      await exportElementToPdf({
        element: printRef.current,
        filename: `${data.studentRoll || data.examName || "academic-sheet"}.pdf`,
        paperSize: "A4",
        scale: 2,
      });
    } catch (e) {
      console.error("Academic sheet PDF export error:", e);
      alert(
        docLang === "bn"
          ? "PDF ডাউনলোড করা যায়নি। প্রিন্ট অপশনটি ব্যবহার করুন।"
          : "Failed to download PDF. Please use the Print option instead."
      );
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleSaveAsJpg = async () => {
    if (!printRef.current || isExportingJpg) return;
    try {
      setIsExportingJpg(true);
      await exportElementToJpg(
        printRef.current,
        `${data.studentRoll || data.examName || "academic-sheet"}.jpg`,
        2
      );
    } catch (e) {
      console.error("JPG export error:", e);
      alert(
        docLang === "bn"
          ? "JPG এক্সপোর্ট ব্যর্থ হয়েছে। প্রিন্ট অপশনটি ব্যবহার করুন।"
          : "Failed to export JPG. Please use Print / PDF instead."
      );
    } finally {
      setIsExportingJpg(false);
    }
  };

  const handleWhatsAppShare = () => {
    try {
      const institute = data.instituteName || "Academic Institute";
      const student = data.studentName || "Student";
      const roll = data.studentRoll ? `রোল: ${data.studentRoll}` : "";
      const gpa = data.gpa ? `GPA: ${data.gpa}` : "";
      const exam = data.examName || "Examination";

      const message =
        docLang === "bn"
          ? `*${institute}*\nপরীক্ষা: ${exam}\nশিক্ষার্থী: ${student}\n${roll}\n${gpa}\n\nফলাফল বিস্তারিত দেখতে বা প্রিন্ট কপি ডাউনলোড করতে ভিজিট করুন FreeDocForge.com`
          : `*${institute}*\nExam: ${exam}\nStudent: ${student}\n${roll}\n${gpa}\n\nOfficial Academic Document via FreeDocForge.com`;

      const cleanPhone = (data.guardianPhone || data.phone || "").replace(/[^0-9]/g, "");
      const targetUrl =
        cleanPhone.length >= 10
          ? `https://wa.me/${cleanPhone.startsWith("88") ? cleanPhone : `88${cleanPhone}`}?text=${encodeURIComponent(
              message
            )}`
          : `https://wa.me/?text=${encodeURIComponent(message)}`;

      window.open(targetUrl, "_blank");
    } catch (e) {
      console.error("WhatsApp share error:", e);
    }
  };

  const handleSaveToProfile = async () => {
    const presetData = {
      businessName: data.instituteName || "",
      tagline: data.tagline || "",
      phone: data.phone || "",
      address: data.address || "",
      currency: "৳",
      signatureUrl: signaturePreview || null,
      presetType: "school",
    };

    localStorage.setItem("freedocforge_active_preset", JSON.stringify(presetData));

    try {
      await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(presetData),
      });
    } catch (err) {
      console.warn("Could not sync school profile to cloud:", err);
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSaveDocument = async () => {
    setDocSaveLoading(true);
    setDocSaveMessage(null);

    const recipient = data.studentName ? `${data.studentName} (Roll: ${data.rollNumber || "1"})` : "Student";
    const docNum = data.rollNumber ? `ROLL-${data.rollNumber}` : `ACAD-${Date.now().toString().slice(-5)}`;
    const details = data.examName || "Academic Report Card";

    const docPayload = {
      templateSlug,
      templateTitle: locales?.[docLang]?.title || data.instituteName || "School Template",
      category: "Education",
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
            ? "মার্কশিট সফলভাবে ক্লাউডে সংরক্ষিত হয়েছে!"
            : "Academic document saved to your cloud history!"
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

  // 1. Marksheet Subject handlers
  const subjectsList: SubjectItem[] = Array.isArray(data.subjects) ? data.subjects : [];
  const handleAddSubject = () => {
    setData({
      ...data,
      subjects: [
        ...subjectsList,
        {
          name: docLang === "bn" ? "নতুন বিষয়" : "New Subject",
          marks: 80,
          fullMarks: 100,
          grade: "A+",
        },
      ],
    });
  };

  const handleSubjectChange = (index: number, field: string, val: any) => {
    const updated = [...subjectsList];
    updated[index] = { ...updated[index], [field]: val };
    setData({ ...data, subjects: updated });
  };

  const handleRemoveSubject = (index: number) => {
    if (subjectsList.length <= 1) return;
    setData({
      ...data,
      subjects: subjectsList.filter((_: SubjectItem, i: number) => i !== index),
    });
  };

  // GPA calculation
  const totalMarks = subjectsList.reduce((acc: number, s: SubjectItem) => acc + (Number(s.marks) || 0), 0);
  const totalFullMarks = subjectsList.reduce(
    (acc: number, s: SubjectItem) => acc + (Number(s.fullMarks) || 100),
    0
  );
  const percentage = totalFullMarks > 0 ? ((totalMarks / totalFullMarks) * 100).toFixed(1) : "0";

  // Template Type Determination
  const isMarksheet =
    templateSlug === "school-result-sheet" ||
    templateSlug === "coaching-monthly-progress" ||
    templateSlug === "madrasah-progress-report" ||
    templateSlug === "school-fee-slip" ||
    (Array.isArray(data.subjects) && data.subjects.length > 0);

  const isClassRoutine =
    templateSlug === "school-class-routine" ||
    Array.isArray(data.routine);

  const isExamRoutine =
    templateSlug === "school-exam-routine" ||
    Array.isArray(data.exams);

  const isAdmitCard =
    templateSlug === "school-admit-card" ||
    !!data.rules ||
    !!data.examCenter;

  const isIdCard =
    templateSlug === "student-id-card-layout";

  const isCertificate =
    templateSlug === "student-transfer-certificate" ||
    templateSlug === "school-character-certificate" ||
    (!isMarksheet && !isClassRoutine && !isExamRoutine && !isAdmitCard && !isIdCard);

  return (
    <div className="space-y-6">
      {/* INDEPENDENT TEMPLATE DOCUMENT LANGUAGE BAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{sysLang === "bn" ? "ডকুমেন্টের প্রিন্ট ভাষা:" : "Document Print Language:"}</span>
              <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full font-bold">
                {docLang === "bn" ? "বাংলা ফরম্যাট" : "English Format"}
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {sysLang === "bn"
                ? "মার্কশিট ও শিক্ষা সনদের ভাষা আলাদাভাবে বাংলায় বা ইংরেজিতে পরিবর্তন করুন।"
                : "Manage academic print language independently of the website UI language."}
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
                ? "bg-white dark:bg-blue-600 text-blue-700 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            English Academic
          </button>
          <button
            type="button"
            onClick={() => handleSwitchDocLang("bn")}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition cursor-pointer ${
              docLang === "bn"
                ? "bg-white dark:bg-blue-600 text-blue-700 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            বাংলা ফরমেট
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
                <span>{docLang === "bn" ? "শিক্ষা সনদ সেটিংস" : "Academic Document Details"}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {sysLang === "bn"
                  ? "তারিখ বাদে প্রতিটি ফিল্ডে মুখে বাংলায় বা ইংরেজিতে বলুন।"
                  : "Click any mic icon to speak into academic fields. Bangla & English supported."}
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

          {/* 1. Institute Info */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              {docLang === "bn" ? "১. শিক্ষাপ্রতিষ্ঠানের তথ্য" : "1. Institute Information"}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 relative flex items-center">
                <input
                  type="text"
                  placeholder={docLang === "bn" ? "বিদ্যালয় / কলেজের নাম" : "School / Institute Name"}
                  className="w-full text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-9 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={data.instituteName || ""}
                  onChange={(e) => setData({ ...data, instituteName: e.target.value })}
                />
                <div className="absolute right-2">
                  <VoiceInputButton
                    lang={voiceLang}
                    title="Speak Institute Name"
                    onTranscript={(txt) => setData({ ...data, instituteName: txt })}
                  />
                </div>
              </div>

              <div className="col-span-2 relative flex items-center">
                <input
                  type="text"
                  placeholder={docLang === "bn" ? "স্লোগান বা মোটো" : "Institute Tagline / Motto"}
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-9 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={data.tagline || ""}
                  onChange={(e) => setData({ ...data, tagline: e.target.value })}
                />
                <div className="absolute right-2">
                  <VoiceInputButton
                    lang={voiceLang}
                    title="Speak Tagline"
                    onTranscript={(txt) => setData({ ...data, tagline: txt })}
                  />
                </div>
              </div>

              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder={docLang === "bn" ? "ফোন বা ইমেইল" : "Contact Phone"}
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={data.phone || ""}
                  onChange={(e) => setData({ ...data, phone: e.target.value })}
                />
                <div className="absolute right-1">
                  <VoiceInputButton
                    lang={voiceLang}
                    title="Speak Phone"
                    onTranscript={(txt) => setData({ ...data, phone: txt })}
                  />
                </div>
              </div>

              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder={docLang === "bn" ? "ঠিকানা (উপজেলা, জেলা)" : "Address"}
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={data.address || ""}
                  onChange={(e) => setData({ ...data, address: e.target.value })}
                />
                <div className="absolute right-1">
                  <VoiceInputButton
                    lang={voiceLang}
                    title="Speak Address"
                    onTranscript={(txt) => setData({ ...data, address: txt })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Student & Examination Details */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              {docLang === "bn" ? "২. শিক্ষার্থী ও পরীক্ষার বিবরণ" : "2. Student & Examination Details"}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 relative flex items-center">
                <input
                  type="text"
                  placeholder={docLang === "bn" ? "পরীক্ষার নাম (যেমন: বার্ষিক পরীক্ষা - ২০২৬)" : "Examination Title"}
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-9 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={data.examTitle || ""}
                  onChange={(e) => setData({ ...data, examTitle: e.target.value })}
                />
                <div className="absolute right-2">
                  <VoiceInputButton
                    lang={voiceLang}
                    title="Speak Exam Title"
                    onTranscript={(txt) => setData({ ...data, examTitle: txt })}
                  />
                </div>
              </div>

              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder={docLang === "bn" ? "শিক্ষার্থীর নাম" : "Student Name"}
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={data.studentName || ""}
                  onChange={(e) => setData({ ...data, studentName: e.target.value })}
                />
                <div className="absolute right-1">
                  <VoiceInputButton
                    lang={voiceLang}
                    title="Speak Student Name"
                    onTranscript={(txt) => setData({ ...data, studentName: txt })}
                  />
                </div>
              </div>

              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder={docLang === "bn" ? "রোল নং (যেমন: ১২)" : "Roll No"}
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={data.rollNo || ""}
                  onChange={(e) => setData({ ...data, rollNo: e.target.value })}
                />
                <div className="absolute right-1">
                  <VoiceInputButton
                    lang={voiceLang}
                    title="Speak Roll No"
                    onTranscript={(txt) => setData({ ...data, rollNo: txt })}
                  />
                </div>
              </div>

              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder={docLang === "bn" ? "শ্রেণি ও শাখা (নবম শ্রেণি - বিজ্ঞান)" : "Class / Grade"}
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={data.classGrade || ""}
                  onChange={(e) => setData({ ...data, classGrade: e.target.value })}
                />
                <div className="absolute right-1">
                  <VoiceInputButton
                    lang={voiceLang}
                    title="Speak Class"
                    onTranscript={(txt) => setData({ ...data, classGrade: txt })}
                  />
                </div>
              </div>

              {/* Date Input: Explicitly NO voice input */}
              <div>
                <input
                  type="date"
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={data.date || "2026-11-11"}
                  onChange={(e) => setData({ ...data, date: e.target.value })}
                />
              </div>

              {/* Admit Card Specific Inputs */}
              {isAdmitCard && (
                <>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder={docLang === "bn" ? "রেজিস্ট্রেশন নম্বর (যেমন: REG-2024-98432)" : "Registration No"}
                      className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={data.regNo || ""}
                      onChange={(e) => setData({ ...data, regNo: e.target.value })}
                    />
                    <div className="absolute right-1">
                      <VoiceInputButton
                        lang={voiceLang}
                        title="Speak Reg No"
                        onTranscript={(txt) => setData({ ...data, regNo: txt })}
                      />
                    </div>
                  </div>

                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder={docLang === "bn" ? "পরীক্ষা কেন্দ্র ও হল নম্বর" : "Exam Center & Hall"}
                      className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={data.examCenter || ""}
                      onChange={(e) => setData({ ...data, examCenter: e.target.value })}
                    />
                    <div className="absolute right-1">
                      <VoiceInputButton
                        lang={voiceLang}
                        title="Speak Exam Center"
                        onTranscript={(txt) => setData({ ...data, examCenter: txt })}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Certificate Specific Session Input */}
              {isCertificate && (
                <div className="col-span-2 relative flex items-center">
                  <input
                    type="text"
                    placeholder={docLang === "bn" ? "শিক্ষা সেশন / পাসের সাল (যেমন: ২০২৬)" : "Academic Session / Passing Year"}
                    className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={data.academicYear || ""}
                    onChange={(e) => setData({ ...data, academicYear: e.target.value })}
                  />
                  <div className="absolute right-1">
                    <VoiceInputButton
                      lang={voiceLang}
                      title="Speak Session"
                      onTranscript={(txt) => setData({ ...data, academicYear: txt })}
                    />
                  </div>
                </div>
              )}

              {/* Student ID Card Specific Inputs */}
              {isIdCard && (
                <>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder={docLang === "bn" ? "রক্তের গ্রুপ (যেমন: O+)" : "Blood Group (e.g. O+)"}
                      className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={data.bloodGroup || ""}
                      onChange={(e) => setData({ ...data, bloodGroup: e.target.value })}
                    />
                    <div className="absolute right-1">
                      <VoiceInputButton
                        lang={voiceLang}
                        title="Speak Blood Group"
                        onTranscript={(txt) => setData({ ...data, bloodGroup: txt })}
                      />
                    </div>
                  </div>

                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder={docLang === "bn" ? "জরুরি মোবাইল নং" : "Emergency Contact Phone"}
                      className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={data.phone || ""}
                      onChange={(e) => setData({ ...data, phone: e.target.value })}
                    />
                    <div className="absolute right-1">
                      <VoiceInputButton
                        lang={voiceLang}
                        title="Speak Emergency Contact"
                        onTranscript={(txt) => setData({ ...data, phone: txt })}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 3. Subjects Table & Marks (For Marksheets) */}
          {isMarksheet && (
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {docLang === "bn" ? "৩. বিষয় ও প্রাপ্ত নম্বর" : "3. Subjects & Marks"}
                </label>
                <button
                  onClick={handleAddSubject}
                  className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> {docLang === "bn" ? "+ বিষয় যোগ করুন" : "+ Add Subject"}
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {subjectsList.map((sub: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex-1 relative flex items-center min-w-0">
                      <input
                        type="text"
                        placeholder="Subject"
                        className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 pr-6 text-slate-900 dark:text-white focus:outline-none"
                        value={sub.name}
                        onChange={(e) => handleSubjectChange(idx, "name", e.target.value)}
                      />
                      <div className="absolute right-0.5">
                        <VoiceInputButton
                          lang={voiceLang}
                          title="Speak Subject"
                          onTranscript={(txt) => handleSubjectChange(idx, "name", txt)}
                        />
                      </div>
                    </div>

                    <div className="w-16 relative flex items-center shrink-0">
                      <input
                        type="number"
                        placeholder="Marks"
                        className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 pr-5 focus:outline-none text-center"
                        value={sub.marks}
                        onChange={(e) => handleSubjectChange(idx, "marks", Number(e.target.value) || 0)}
                      />
                      <div className="absolute right-0.5">
                        <VoiceInputButton
                          lang={voiceLang}
                          isNumeric={true}
                          title="Speak Marks"
                          onTranscript={(val) => handleSubjectChange(idx, "marks", Number(val) || 0)}
                        />
                      </div>
                    </div>

                    <div className="w-14 relative flex items-center shrink-0">
                      <input
                        type="text"
                        placeholder="Grade"
                        className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-1.5 py-1 text-center font-bold"
                        value={sub.grade || "A+"}
                        onChange={(e) => handleSubjectChange(idx, "grade", e.target.value)}
                      />
                    </div>

                    <button
                      onClick={() => handleRemoveSubject(idx)}
                      className="text-slate-400 hover:text-red-500 p-1 cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Remarks & Signatures */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              {docLang === "bn" ? "৪. শিক্ষকের মন্তব্য ও স্বাক্ষর" : "4. Remarks & Signatures"}
            </label>
            <div className="relative flex items-start">
              <textarea
                rows={2}
                placeholder={docLang === "bn" ? "শিক্ষকের মূল্যায়ন বা মন্তব্য" : "Teacher's remarks..."}
                className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-9 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                value={data.remarks || ""}
                onChange={(e) => setData({ ...data, remarks: e.target.value })}
              />
              <div className="absolute right-2 top-2">
                <VoiceInputButton
                  lang={voiceLang}
                  title="Speak Remarks"
                  onTranscript={(txt) => setData({ ...data, remarks: (data.remarks ? data.remarks + " " : "") + txt })}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            {/* 1. Direct 1-Click Vector/Raster PDF Download */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition text-xs sm:text-sm cursor-pointer disabled:opacity-50"
            >
              {isExportingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{docLang === "bn" ? "PDF প্রস্তুত হচ্ছে..." : "Generating Academic PDF..."}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>{docLang === "bn" ? "১-ক্লিক সরাসরি PDF ডাউনলোড" : "1-Click Direct PDF Download"}</span>
                </>
              )}
            </button>

            {/* 2. Print via System Spooler */}
            <button
              type="button"
              onClick={handlePrint}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-750 dark:hover:bg-slate-700 text-white font-semibold py-2.5 rounded-xl shadow-xs transition text-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{docLang === "bn" ? "প্রিন্টার দিয়ে প্রিন্ট করুন" : "Print via System Spooler"}</span>
            </button>

            {/* 1-Click WhatsApp & JPG Direct Export */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-3 rounded-xl shadow-xs transition text-xs cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{docLang === "bn" ? "হোয়াটসঅ্যাপে পাঠান" : "WhatsApp Share"}</span>
              </button>
              <button
                type="button"
                onClick={handleSaveAsJpg}
                disabled={isExportingJpg}
                className="flex items-center justify-center gap-1.5 bg-slate-700 hover:bg-slate-850 text-white font-bold py-2.5 px-3 rounded-xl shadow-xs transition text-xs cursor-pointer disabled:opacity-50"
              >
                {isExportingJpg ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ImageIcon className="w-3.5 h-3.5" />
                )}
                <span>
                  {isExportingJpg
                    ? docLang === "bn"
                      ? "সেভ হচ্ছে..."
                      : "Saving..."
                    : docLang === "bn"
                    ? "ছবি সেভ (JPG)"
                    : "Save as JPG"}
                </span>
              </button>
            </div>

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
                  <span>{docLang === "bn" ? "মার্কশিট সংরক্ষিত হয়েছে!" : "Academic Sheet Saved!"}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{docLang === "bn" ? "পরবর্তী ব্যবহারের জন্য মার্কশিট সেভ রাখুন" : "Save Academic Sheet for Next Use"}</span>
                </>
              )}
            </button>

            {/* Feedback notice for document save */}
            {docSaveMessage && (
              <div className="text-[11px] text-center font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 p-2 rounded-lg border border-emerald-200 dark:border-emerald-800">
                {docSaveMessage}
              </div>
            )}

            {/* 3. Save Institute Profile Preset */}
            <button
              onClick={handleSaveToProfile}
              className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium py-2.5 rounded-xl transition text-xs cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  {docLang === "bn" ? "বিদ্যালয়ের প্রিসেট সংরক্ষিত হয়েছে!" : "Academic Preset Saved!"}
                </>
              ) : (
                <>
                  <GraduationCap className="w-4 h-4" />
                  {docLang === "bn" ? "প্রতিষ্ঠানের লেটারহেড প্রিসেট সেভ রাখুন" : "Save Institute Profile Preset"}
                </>
              )}
            </button>
          </div>

          <AdSenseSlot slotId="school-editor-sidebar" format="rectangle" label="Educational Partner" />
        </div>

        {/* RIGHT COLUMN: Live Printable A4 Academic Sheet */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3 print:hidden">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
              {docLang === "bn" ? "A4 লাইভ মার্কশিট প্রিভিউ (বাংলা)" : "A4 Academic Live Preview (English)"}
            </div>
            <button
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              {isExportingPdf
                ? docLang === "bn"
                  ? "ডাউনলোড হচ্ছে..."
                  : "Downloading..."
                : docLang === "bn"
                ? "১-ক্লিক PDF ডাউনলোড"
                : "1-Click PDF"}
            </button>
          </div>

          {/* REAL ACADEMIC MARKSHEET / CERTIFICATE CANVAS */}
          <div
            ref={printRef}
            id="printable-document"
            className={`w-full max-w-[210mm] min-h-[297mm] p-8 sm:p-10 print:border-none print:shadow-none print:p-0 print:m-0 print:w-full print:max-w-none text-xs flex flex-col justify-between transition-colors ${activeTheme.fontFamily} ${activeTheme.containerClass}`}
          >
            <div>
              {/* Institution Header */}
              <div className="text-center border-b-2 border-gray-900 pb-5 space-y-1">
                <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold mb-1">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                  {data.instituteName || "DHAKA IDEAL ACADEMIC CARE"}
                </h1>
                <p className="text-xs text-gray-600 font-medium italic">{data.tagline}</p>
                <p className="text-xs text-gray-500">
                  {data.address} • {docLang === "bn" ? "ফোন:" : "Phone:"} {data.phone}
                </p>
                <div className="pt-2">
                  <span className="inline-block bg-blue-900 text-white font-bold text-xs uppercase px-4 py-1 rounded">
                    {data.examTitle || (docLang === "bn" ? "ফলাফল ও নম্বরপত্র" : "Academic Progress Report")}
                  </span>
                </div>
              </div>

              {/* Student Demographics Bento Card */}
              <div className="grid grid-cols-4 gap-3 my-5 bg-slate-50/80 border border-slate-200/90 rounded-2xl p-4 sm:p-5 text-xs shadow-2xs">
                <div>
                  <span className="text-[9.5px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">
                    {docLang === "bn" ? "শিক্ষার্থীর নাম:" : "STUDENT NAME:"}
                  </span>
                  <span className="font-extrabold text-slate-900 text-sm block truncate">{data.studentName}</span>
                </div>
                <div>
                  <span className="text-[9.5px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">
                    {docLang === "bn" ? "রোল নম্বর:" : "ROLL NUMBER:"}
                  </span>
                  <span className="font-bold text-blue-900 tabular-nums block">{data.rollNo}</span>
                </div>
                <div>
                  <span className="text-[9.5px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">
                    {docLang === "bn" ? "শ্রেণি ও বিভাগ:" : "CLASS / GRADE:"}
                  </span>
                  <span className="font-semibold text-slate-800 block truncate">{data.classGrade}</span>
                </div>
                <div className="text-right">
                  <span className="text-[9.5px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">
                    {docLang === "bn" ? "ইস্যু তারিখ:" : "DATE OF ISSUE:"}
                  </span>
                  <span className="font-semibold text-slate-800 tabular-nums block">{data.date}</span>
                </div>
              </div>

              {/* Subjects & Marks Table with Tabular Numbers */}
              {isMarksheet && (
                <table className="w-full text-left border-collapse my-6">
                  <thead>
                    <tr className={`border-b-2 border-slate-900 uppercase text-[9.5px] font-black tracking-wider ${activeTheme.tableHeaderClass}`}>
                      <th className="py-2.5 px-3 w-10 rounded-l-lg">{docLang === "bn" ? "নং" : "#"}</th>
                      <th className="py-2.5 px-3">{docLang === "bn" ? "বিষয়ের নাম" : "Subject Description"}</th>
                      <th className="py-2.5 px-3 text-center w-28">{docLang === "bn" ? "পূর্ণমান" : "Full Marks"}</th>
                      <th className="py-2.5 px-3 text-center w-28">{docLang === "bn" ? "প্রাপ্ত নম্বর" : "Marks Obtained"}</th>
                      <th className="py-2.5 px-3 text-right w-24 rounded-r-lg">{docLang === "bn" ? "লেটার গ্রেড" : "Letter Grade"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {subjectsList.map((sub: any, idx: number) => (
                      <tr key={idx} className={`hover:bg-slate-50/60 transition-colors ${activeTheme.tableRowClass}`}>
                        <td className="py-3 px-3 text-slate-400 font-medium tabular-nums">{idx + 1}</td>
                        <td className="py-3 px-3 font-semibold text-slate-800">{sub.name}</td>
                        <td className="py-3 px-3 text-center text-slate-600 tabular-nums">{sub.fullMarks || 100}</td>
                        <td className="py-3 px-3 text-center font-bold text-slate-900 tabular-nums">{sub.marks}</td>
                        <td className="py-3 px-3 text-right font-black text-blue-700">{sub.grade || "A+"}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-900 font-black text-slate-900 text-xs bg-slate-50/80 avoid-break">
                      <td colSpan={2} className="py-3.5 px-3">
                        {docLang === "bn" ? "সর্বমোট প্রাপ্ত ফলাফল:" : "Cumulative Performance:"}
                      </td>
                      <td className="py-3.5 px-3 text-center tabular-nums">{totalFullMarks}</td>
                      <td className="py-3.5 px-3 text-center text-blue-700 tabular-nums">{totalMarks}</td>
                      <td className="py-3.5 px-3 text-right">
                        <span className={`${activeTheme.duePillClass} tabular-nums text-xs inline-block`}>
                          {percentage}%
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              )}

              {/* Class Routine Table (For Class Routine) */}
              {isClassRoutine && data.routine && (
                <div className="my-6">
                  <table className="w-full text-center border-collapse border border-gray-300 text-xs">
                    <thead>
                      <tr className="bg-blue-50 text-blue-900 font-bold border-b border-gray-300">
                        <th className="p-2 border-r border-gray-300">Day</th>
                        <th className="p-2 border-r border-gray-300">Period 1</th>
                        <th className="p-2 border-r border-gray-300">Period 2</th>
                        <th className="p-2 border-r border-gray-300">Period 3</th>
                        <th className="p-2 border-r border-gray-300">Period 4</th>
                        <th className="p-2">Period 5</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {data.routine.map((r: any, idx: number) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="p-2 font-bold text-left border-r border-gray-300">{r.day}</td>
                          <td className="p-2 border-r border-gray-300">{r.p1}</td>
                          <td className="p-2 border-r border-gray-300">{r.p2}</td>
                          <td className="p-2 border-r border-gray-300">{r.p3}</td>
                          <td className="p-2 border-r border-gray-300">{r.p4}</td>
                          <td className="p-2">{r.p5}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Exam Routine Table (For Exam Routine) */}
              {isExamRoutine && data.exams && (
                <div className="my-6">
                  <table className="w-full text-left border-collapse border border-gray-300 text-xs">
                    <thead>
                      <tr className="bg-blue-50 text-blue-900 font-bold border-b border-gray-300">
                        <th className="p-2 border-r border-gray-300">Date & Day</th>
                        <th className="p-2 border-r border-gray-300">Exam Time</th>
                        <th className="p-2 border-r border-gray-300">Subject Description</th>
                        <th className="p-2 border-r border-gray-300 text-center">Code</th>
                        <th className="p-2 text-right">Hall / Room</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {data.exams.map((ex: any, idx: number) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="p-2 font-bold border-r border-gray-300">{ex.date} ({ex.day})</td>
                          <td className="p-2 border-r border-gray-300">{ex.time}</td>
                          <td className="p-2 font-semibold border-r border-gray-300">{ex.subject}</td>
                          <td className="p-2 text-center border-r border-gray-300">{ex.code}</td>
                          <td className="p-2 text-right">{ex.room}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Admit Card Canvas */}
              {isAdmitCard && (
                <div className="my-6 space-y-5">
                  <div className="grid grid-cols-12 gap-4 items-center bg-blue-50/60 p-4 rounded-xl border border-blue-200">
                    <div className="col-span-8 space-y-2 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase block">
                          {docLang === "bn" ? "পরীক্ষার্থীর নাম:" : "Examinee Name:"}
                        </span>
                        <span className="font-black text-gray-900 text-sm">{data.studentName}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase block">
                            {docLang === "bn" ? "রোল নম্বর:" : "Roll No:"}
                          </span>
                          <span className="font-bold text-blue-900">{data.rollNo}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase block">
                            {docLang === "bn" ? "রেজিস্ট্রেশন নং:" : "Registration No:"}
                          </span>
                          <span className="font-bold text-gray-800">{data.regNo || "REG-2024-98432"}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase block">
                            {docLang === "bn" ? "শ্রেণি ও শাখা:" : "Class / Group:"}
                          </span>
                          <span className="font-semibold text-gray-800">{data.classGrade}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase block">
                            {docLang === "bn" ? "পরীক্ষা কেন্দ্র:" : "Exam Center:"}
                          </span>
                          <span className="font-semibold text-gray-800">{data.examCenter || "Main Campus Examination Hall"}</span>
                        </div>
                      </div>
                    </div>
                    {/* Passport Photo Box */}
                    <div className="col-span-4 flex flex-col items-center justify-center">
                      <div className="w-24 h-28 border-2 border-dashed border-gray-400 rounded-lg bg-white flex flex-col items-center justify-center text-center p-2 text-gray-400 shadow-2xs">
                        <UserCheck className="w-7 h-7 mb-1 text-gray-300" />
                        <span className="text-[8px] font-semibold leading-tight">
                          {docLang === "bn" ? "পাসপোর্ট ছবি সংযুক্ত করুন" : "Affix Passport Photo"}
                        </span>
                        <span className="text-[7px] text-gray-400 mt-0.5">(35mm x 45mm)</span>
                      </div>
                    </div>
                  </div>

                  {/* Candidate Rules */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs">
                    <h4 className="font-bold uppercase text-[10px] text-gray-700 tracking-wider mb-2 border-b border-gray-200 pb-1">
                      {docLang === "bn" ? "পরীক্ষার্থীদের জন্য বিশেষ নির্দেশনাবলী:" : "General Instructions for Candidates:"}
                    </h4>
                    <ul className="space-y-1.5 text-gray-700 list-disc list-inside text-[11px] leading-relaxed">
                      {Array.isArray(data.rules) ? (
                        data.rules.map((rule: string, rIdx: number) => (
                          <li key={rIdx}>{rule}</li>
                        ))
                      ) : (
                        <>
                          <li>Examinees must bring this admit card to the examination hall every day.</li>
                          <li>Candidates must take their seats at least 15 minutes before the exam starts.</li>
                          <li>Mobile phones, programmable calculators, or any unfair means are strictly prohibited.</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              )}

              {/* Certificate & Testimonial Canvas */}
              {isCertificate && (
                <div className="my-8 py-8 px-6 border-4 border-double border-blue-900/40 rounded-2xl bg-amber-50/20 text-center space-y-6">
                  <div className="inline-block border-y-2 border-blue-900 py-1 px-8">
                    <h2 className="text-lg font-black uppercase tracking-widest text-blue-950">
                      {data.examTitle || (docLang === "bn" ? "প্রশংসাপত্র / সনদপত্র" : "CERTIFICATE OF MERIT & CHARACTER")}
                    </h2>
                  </div>

                  <p className="text-sm sm:text-base font-serif leading-loose text-gray-800 text-justify px-4 sm:px-8">
                    {docLang === "bn" ? (
                      <>
                        এই মর্মে প্রত্যয়ন করা যাচ্ছে যে, <strong className="font-bold text-gray-950 underline decoration-blue-900 underline-offset-4">{data.studentName}</strong>, 
                        রোল নম্বর <strong className="font-bold text-gray-950">{data.rollNo}</strong>, 
                        এই প্রতিষ্ঠানের <strong className="font-bold text-gray-950">{data.classGrade}</strong>-এর একজন নিয়মিত শিক্ষার্থী ছিলেন। 
                        শিক্ষা সেশন <strong className="font-bold text-gray-950">{data.academicYear || "২০২৬"}</strong>। 
                        <span className="block mt-3">
                          {data.remarks || "তিনি অত্র প্রতিষ্ঠানে অধ্যয়নকালে সৎ ও উন্নত চরিত্রের পরিচয় দিয়েছেন। রাষ্ট্র কিংবা শৃঙ্খলা পরিপন্থী কোনো কার্যকলাপে কখনো লিপ্ত ছিলেন না। আমি তার জীবনের সার্বিক সাফল্য ও উজ্জ্বল ভবিষ্যৎ কামনা করি।"}
                        </span>
                      </>
                    ) : (
                      <>
                        This is to officially certify that <strong className="font-bold text-gray-950 underline decoration-blue-900 underline-offset-4">{data.studentName}</strong>, 
                        bearing Roll No <strong className="font-bold text-gray-950">{data.rollNo}</strong>, 
                        was a bona fide student of this institution in <strong className="font-bold text-gray-950">{data.classGrade}</strong> 
                        during the academic session <strong className="font-bold text-gray-950">{data.academicYear || "2026"}</strong>.
                        <br />
                        <span className="italic block mt-3 text-gray-700">
                          &ldquo;{data.remarks || "To the best of our knowledge and records, the student bears an exemplary moral character and did not participate in any subversive activities. All institutional fees and dues have been cleared."}&rdquo;
                        </span>
                      </>
                    )}
                  </p>

                  <div className="pt-4 flex justify-between items-center text-xs text-gray-600 px-8 border-t border-blue-900/20">
                    <span>{docLang === "bn" ? "ইস্যু তারিখ:" : "Issue Date:"} <strong>{data.date}</strong></span>
                    <span className="font-serif italic text-blue-900">
                      {docLang === "bn" ? "অফিসিয়াল প্রাতিষ্ঠানিক সনদ" : "Official Institutional Document"}
                    </span>
                  </div>
                </div>
              )}

              {/* Student ID Card Canvas */}
              {isIdCard && (
                <div className="my-8 flex justify-center">
                  <div className="w-[85mm] min-h-[125mm] bg-white border-2 border-blue-900 rounded-2xl shadow-lg p-5 flex flex-col justify-between text-center relative overflow-hidden font-sans">
                    <div className="absolute top-0 left-0 right-0 h-3.5 bg-gradient-to-r from-blue-900 via-indigo-800 to-blue-900"></div>
                    <div className="pt-2 border-b border-gray-200 pb-2">
                      <h3 className="font-black text-xs uppercase text-blue-950">{data.instituteName}</h3>
                      <p className="text-[8px] text-gray-500 font-medium">{data.tagline}</p>
                      <span className="inline-block bg-blue-900 text-white text-[8px] font-bold px-2 py-0.5 rounded-full mt-1">
                        STUDENT IDENTITY CARD
                      </span>
                    </div>

                    <div className="flex flex-col items-center my-3 space-y-2">
                      <div className="w-20 h-24 border-2 border-blue-900 rounded-lg bg-gray-50 flex items-center justify-center shadow-xs">
                        <GraduationCap className="w-10 h-10 text-blue-400" />
                      </div>
                      <h4 className="font-black text-sm text-gray-900">{data.studentName}</h4>
                      <p className="text-[10px] font-bold text-blue-800">{data.rollNo}</p>
                      <div className="w-full text-[10px] space-y-1 text-left bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                        <div className="flex justify-between">
                          <span className="text-gray-500 font-semibold">Class / Group:</span>
                          <span className="font-bold text-gray-800">{data.classGrade}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 font-semibold">Blood Group:</span>
                          <span className="font-black text-red-600">{data.bloodGroup || "O+ (Pos)"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 font-semibold">Valid Upto:</span>
                          <span className="font-bold text-gray-800">{data.academicYear || "2026-2028"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 font-semibold">Emergency:</span>
                          <span className="font-bold text-gray-800">{data.phone || "+880 1711-234567"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-2 flex justify-between items-end">
                      <div className="text-left font-mono text-[8px] text-gray-600">
                        <span>||||||||||||||||||||||||||</span>
                        <p className="text-[7px] text-gray-400 mt-0.5">freedocforge.com</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 border-b border-gray-900 mb-0.5"></div>
                        <span className="text-[8px] font-bold text-gray-900 block">Principal</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Remarks Box (For Marksheets and Routines only) */}
              {!isCertificate && data.remarks && (
                <div className="my-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                    {docLang === "bn" ? "শিক্ষকের মন্তব্য / প্রাতিষ্ঠানিক মূল্যায়ন:" : "Teacher's Evaluation & Remarks:"}
                  </span>
                  <p className="text-xs text-gray-800 italic leading-relaxed">{data.remarks}</p>
                </div>
              )}
            </div>

            {/* Signatures & Footer */}
            <div className="mt-16 pt-6 border-t border-gray-200 flex justify-between items-end">
              <div className="text-center">
                <div className="w-36 border-b border-gray-400 mb-1 mx-auto"></div>
                <span className="text-[11px] font-bold text-gray-700 block">
                  {data.signatory1 || (docLang === "bn" ? "শ্রেণি শিক্ষক" : "Class Teacher")}
                </span>
              </div>

              <div className="text-center text-[10px] text-gray-400">
                <p>
                  {docLang === "bn" ? "তৈরি হয়েছে" : "Generated via"}{" "}
                  <strong className="text-gray-600">freedocforge.com</strong> •{" "}
                  {docLang === "bn" ? "স্মার্ট একাডেমি স্টুডিও" : "Smart Academic Studio"}
                </p>
              </div>

              <div className="text-center">
                <div className="mb-2">
                  <div className={activeTheme.sealClass}>
                    <span>★</span>
                    <span>{docLang === "bn" ? "অফিসিয়াল সিলমোহর" : "OFFICIAL SEAL"}</span>
                    <span>★</span>
                  </div>
                </div>
                {signaturePreview ? (
                  <img src={signaturePreview} alt="Signature" className="h-10 mx-auto mb-1 object-contain" />
                ) : (
                  <div className="w-36 border-b-2 border-gray-900 mb-1 mx-auto"></div>
                )}
                <span className="text-[11px] font-bold text-gray-900 block">
                  {data.signatory2 || (docLang === "bn" ? "প্রধান শিক্ষক / অধ্যক্ষ" : "Headmaster / Principal")}
                </span>
                <span className="text-[10px] text-gray-500 block">
                  {docLang === "bn" ? "অনুমোদিত স্বাক্ষর" : "Authorized Signature"}
                </span>
              </div>
            </div>
          </div>

          <AdSenseSlot slotId="school-canvas-bottom" format="horizontal" className="print:hidden mt-4" />
        </div>
      </div>
    </div>
  );
}
