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
  Users,
  AlertCircle,
  Building,
  CheckCircle2,
  MapPin,
  Layers,
  LayoutGrid,
  CalendarCheck,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Eye,
  Edit3,
} from "lucide-react";
import AdSenseSlot from "@/components/AdSenseSlot";
import PostDownloadModal from "@/components/PostDownloadModal";
import ShareDocumentModal from "@/components/ShareDocumentModal";
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
  const [showPostDownloadModal, setShowPostDownloadModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const [docSaveLoading, setDocSaveLoading] = useState(false);
  const [docSaveSuccess, setDocSaveSuccess] = useState(false);
  const [docSaveMessage, setDocSaveMessage] = useState<string | null>(null);

  const [mobileView, setMobileView] = useState<"form" | "preview">("form");
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const toggleSection = (id: string) => {
    setCollapsedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleResetToSample = () => {
    const sample = locales?.[docLang]?.defaultData || initialData || {};
    setData((prev: any) => ({
      ...prev,
      ...sample,
    }));
  };

  const handleClearForm = () => {
    setData((prev: any) => ({
      ...prev,
      studentName: "",
      rollNo: "",
      regNo: "",
      classGrade: "",
      section: "",
      subjects: [{ name: "", marks: 0, fullMarks: 100, grade: "" }],
      routine: [{ day: docLang === "bn" ? "রবিবার" : "Sunday", p1: "", p2: "", p3: "", p4: "", p5: "", p6: "" }],
      exams: [{ date: "", day: "", time: "", subject: "", code: "", room: "" }],
      remarks: "",
    }));
  };

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
      setShowPostDownloadModal(true);
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
      setShowPostDownloadModal(true);
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

  const getShareMessage = () => {
    const institute = data.instituteName || "Academic Institute";
    const student = data.studentName || "Student";
    const roll = data.studentRoll ? `রোল: ${data.studentRoll}` : "";
    const gpa = data.gpa ? `GPA: ${data.gpa}` : "";
    const exam = data.examName || "Examination";

    return docLang === "bn"
      ? `*${institute}*\nপরীক্ষা: ${exam}\nশিক্ষার্থী: ${student}\n${roll}\n${gpa}\n\nফলাফল বিস্তারিত দেখতে বা প্রিন্ট কপি ডাউনলোড করতে ভিজিট করুন FreeDocForge.com`
      : `*${institute}*\nExam: ${exam}\nStudent: ${student}\n${roll}\n${gpa}\n\nOfficial Academic Document via FreeDocForge.com`;
  };

  const handleWhatsAppShare = () => {
    setShowShareModal(true);
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

    const recipient = isClassRoutine
      ? data.classGrade || "Class Timetable"
      : isExamRoutine
      ? data.examTitle || "Examination Routine"
      : data.studentName
      ? `${data.studentName} (Roll: ${data.rollNo || data.rollNumber || "1"})`
      : "Academic Document";

    const docNum = isClassRoutine
      ? `ROUTINE-${Date.now().toString().slice(-5)}`
      : isExamRoutine
      ? `EXAM-${Date.now().toString().slice(-5)}`
      : data.rollNo || data.rollNumber
      ? `ROLL-${data.rollNo || data.rollNumber}`
      : `ACAD-${Date.now().toString().slice(-5)}`;

    const details = isClassRoutine
      ? `${data.classGrade || "Class Routine"} - ${data.academicYear || "Session 2026"}`
      : isExamRoutine
      ? `${data.examTitle || "Exam Routine"} - ${data.academicYear || "Session 2026"}`
      : data.examTitle || data.examName || "Academic Report Card";

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
            ? "ডকুমেন্ট সফলভাবে ক্লাউডে সংরক্ষিত হয়েছে!"
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

  // 2. Class Routine Handlers
  const routineList = Array.isArray(data.routine) ? data.routine : [];
  const handleAddRoutineDay = () => {
    const days = docLang === "bn"
      ? ["শনিবার", "রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার"]
      : ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const nextDay = days[routineList.length % days.length] || (docLang === "bn" ? `দিন ${routineList.length + 1}` : `Day ${routineList.length + 1}`);
    setData({
      ...data,
      routine: [
        ...routineList,
        {
          day: nextDay,
          p1: docLang === "bn" ? "বাংলা" : "Bangla",
          p2: docLang === "bn" ? "ইংরেজি" : "English",
          p3: docLang === "bn" ? "গণিত" : "Math",
          p4: docLang === "bn" ? "বিজ্ঞান" : "Science",
          p5: docLang === "bn" ? "ধর্ম" : "Religion",
          p6: docLang === "bn" ? "আইসিটি" : "ICT",
        },
      ],
    });
  };

  const handleRemoveRoutineDay = (index: number) => {
    if (routineList.length <= 1) return;
    setData({
      ...data,
      routine: routineList.filter((_: any, i: number) => i !== index),
    });
  };

  const handleRoutineChange = (index: number, field: string, val: string) => {
    const updated = [...routineList];
    updated[index] = { ...updated[index], [field]: val };
    setData({ ...data, routine: updated });
  };

  // 3. Teachers Directory Handlers
  const teachersList = Array.isArray(data.teachers) ? data.teachers : [];
  const handleAddTeacher = () => {
    const count = teachersList.length + 1;
    setData({
      ...data,
      teachers: [
        ...teachersList,
        {
          code: `T${count}`,
          name: docLang === "bn" ? `শিক্ষক ${count}` : `Teacher ${count}`,
          subject: docLang === "bn" ? "বিষয়" : "Subject",
        },
      ],
    });
  };

  const handleRemoveTeacher = (index: number) => {
    setData({
      ...data,
      teachers: teachersList.filter((_: any, i: number) => i !== index),
    });
  };

  const handleTeacherChange = (index: number, field: string, val: string) => {
    const updated = [...teachersList];
    updated[index] = { ...updated[index], [field]: val };
    setData({ ...data, teachers: updated });
  };

  // 4. Exam Routine Handlers
  const examsList = Array.isArray(data.exams) ? data.exams : [];
  const handleAddExam = () => {
    setData({
      ...data,
      exams: [
        ...examsList,
        {
          date: "15/06/2026",
          day: docLang === "bn" ? "রবিবার" : "Sunday",
          time: docLang === "bn" ? "সকাল ১০:০০ - দুপুর ১:০০" : "10:00 AM - 1:00 PM",
          subject: docLang === "bn" ? "নতুন পরীক্ষা বিষয়" : "New Exam Subject",
          code: `${100 + examsList.length + 1}`,
          room: docLang === "bn" ? "হল-এ" : "Hall A",
          invigilator: "",
        },
      ],
    });
  };

  const handleRemoveExam = (index: number) => {
    if (examsList.length <= 1) return;
    setData({
      ...data,
      exams: examsList.filter((_: any, i: number) => i !== index),
    });
  };

  const handleExamChange = (index: number, field: string, val: string) => {
    const updated = [...examsList];
    updated[index] = { ...updated[index], [field]: val };
    setData({ ...data, exams: updated });
  };

  // 5. Exam Rules / Instructions Handlers
  const instructionsList = Array.isArray(data.instructions)
    ? data.instructions
    : Array.isArray(data.rules)
    ? data.rules
    : [];

  const handleAddInstruction = () => {
    setData({
      ...data,
      instructions: [
        ...instructionsList,
        docLang === "bn"
          ? "পরীক্ষার হলে নির্ধারিত সময়ের ১৫ মিনিট পূর্বে উপস্থিত হতে হবে।"
          : "Candidates must report to the examination hall 15 minutes before the exam.",
      ],
    });
  };

  const handleRemoveInstruction = (index: number) => {
    setData({
      ...data,
      instructions: instructionsList.filter((_: any, i: number) => i !== index),
    });
  };

  const handleInstructionChange = (index: number, val: string) => {
    const updated = [...instructionsList];
    updated[index] = val;
    setData({ ...data, instructions: updated });
  };

  // Template Type Determination
  const isClassRoutine =
    templateSlug === "school-class-routine" ||
    templateSlug === "highschool-weekly-routine" ||
    templateSlug === "university-semester-timetable" ||
    templateSlug === "madrasah-class-routine" ||
    templateSlug === "coaching-batch-routine" ||
    templateSlug === "kindergarten-activity-schedule" ||
    templateSlug === "teacher-master-schedule" ||
    templateSlug === "private-tutor-routine" ||
    templateSlug === "lab-practical-schedule" ||
    templateSlug === "online-class-timetable" ||
    templateSlug.includes("routine") ||
    templateSlug.includes("timetable") ||
    Array.isArray(data.routine);

  const isExamRoutine =
    !isClassRoutine &&
    (templateSlug === "school-exam-routine" ||
      templateSlug === "board-exam-schedule" ||
      templateSlug === "university-exam-timetable" ||
      templateSlug === "coaching-model-test-schedule" ||
      templateSlug === "madrasah-exam-routine" ||
      templateSlug === "practical-viva-exam-schedule" ||
      templateSlug === "teacher-invigilation-roster" ||
      templateSlug === "revision-study-timetable" ||
      templateSlug === "semester-midterm-schedule" ||
      templateSlug === "admit-card-exam-schedule" ||
      templateSlug.includes("exam") ||
      Array.isArray(data.exams));

  const isMarksheet =
    !isClassRoutine &&
    !isExamRoutine &&
    (templateSlug === "school-result-sheet" ||
      templateSlug === "coaching-monthly-progress" ||
      templateSlug === "madrasah-progress-report" ||
      templateSlug === "school-fee-slip" ||
      (Array.isArray(data.subjects) && data.subjects.length > 0));

  const isAdmitCard =
    !isClassRoutine &&
    !isExamRoutine &&
    (templateSlug === "school-admit-card" || !!data.rules || !!data.examCenter);

  const isIdCard =
    !isClassRoutine &&
    !isExamRoutine &&
    templateSlug === "student-id-card-layout";

  const isCertificate =
    !isMarksheet &&
    !isClassRoutine &&
    !isExamRoutine &&
    !isAdmitCard &&
    !isIdCard;

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
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

      {/* MOBILE VIEWPORT SEGMENTED SWITCHER (<1024px) */}
      <div className="flex lg:hidden items-center justify-between bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 print:hidden">
        <button
          type="button"
          onClick={() => setMobileView("form")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            mobileView === "form"
              ? "bg-white dark:bg-blue-600 text-blue-700 dark:text-white shadow-xs"
              : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          {docLang === "bn" ? "ফর্ম এডিট" : "Edit Form"}
        </button>
        <button
          type="button"
          onClick={() => setMobileView("preview")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            mobileView === "preview"
              ? "bg-white dark:bg-blue-600 text-blue-700 dark:text-white shadow-xs"
              : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          {docLang === "bn" ? "প্রিন্ট প্রিভিউ" : "Print Preview"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Input Form Controls (Hidden during printing) */}
        <div
          className={`lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs print:hidden space-y-6 transition-colors ${
            mobileView === "form" ? "block" : "hidden lg:block"
          }`}
        >
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

          {/* Quick Pre-Fill / Sample Data Toolbar */}
          <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetToSample}
                className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-2xs transition cursor-pointer active:scale-95"
                title={docLang === "bn" ? "আসল নমুনা ডাটা ফিরিয়ে আনুন" : "Reset form to original sample data"}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{docLang === "bn" ? "নমুনা ডাটা" : "Reset Sample"}</span>
              </button>
              <button
                type="button"
                onClick={handleClearForm}
                className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
                title={docLang === "bn" ? "নতুন করে লিখতে ফর্মের ফিল্ডগুলো খালি করুন" : "Clear fields for a fresh entry"}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{docLang === "bn" ? "ফর্ম খালি করুন" : "Clear Form"}</span>
              </button>
            </div>
            <span className="hidden sm:inline text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              {docLang === "bn" ? "১-ক্লিক রিসেট" : "1-Click Reset"}
            </span>
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

          {/* ========================================================================= */}
          {/* 2. CLASS ROUTINE EDITOR SECTION */}
          {/* ========================================================================= */}
          {isClassRoutine && (
            <>
              {/* Routine Class & Shift Info */}
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  {docLang === "bn" ? "২. শ্রেণি ও রুটিনের বিবরণ" : "2. Class & Routine Overview"}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder={docLang === "bn" ? "শ্রেণি ও বিভাগ (যেমন: দশম শ্রেণি - বিজ্ঞান)" : "Class / Program (e.g. Class 10 - Science)"}
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

                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder={docLang === "bn" ? "শাখা / ব্যাচ / কক্ষ (যেমন: শাখা-ক, কক্ষ ৩০৪)" : "Section / Batch / Room (e.g. Sec A, Room 304)"}
                      className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={data.section || ""}
                      onChange={(e) => setData({ ...data, section: e.target.value })}
                    />
                    <div className="absolute right-1">
                      <VoiceInputButton
                        lang={voiceLang}
                        title="Speak Section"
                        onTranscript={(txt) => setData({ ...data, section: txt })}
                      />
                    </div>
                  </div>

                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder={docLang === "bn" ? "শিফট / সময় (যেমন: প্রভাতী শিফট: ৭:৩০ - ১২:০০)" : "Shift / Timing (e.g. Morning: 7:30 AM - 12:00 PM)"}
                      className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={data.shift || ""}
                      onChange={(e) => setData({ ...data, shift: e.target.value })}
                    />
                    <div className="absolute right-1">
                      <VoiceInputButton
                        lang={voiceLang}
                        title="Speak Shift"
                        onTranscript={(txt) => setData({ ...data, shift: txt })}
                      />
                    </div>
                  </div>

                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder={docLang === "bn" ? "শিক্ষাবর্ষ / সেশন (যেমন: শিক্ষাবর্ষ ২০২৬)" : "Academic Session (e.g. Session 2026)"}
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

                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder={docLang === "bn" ? "কার্যকর তারিখ (যেমন: ০১ জানুয়ারি ২০২৬)" : "Effective Date (e.g. 01 Jan 2026)"}
                      className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={data.effectiveDate || data.date || ""}
                      onChange={(e) => setData({ ...data, effectiveDate: e.target.value, date: e.target.value })}
                    />
                    <div className="absolute right-1">
                      <VoiceInputButton
                        lang={voiceLang}
                        title="Speak Date"
                        onTranscript={(txt) => setData({ ...data, effectiveDate: txt, date: txt })}
                      />
                    </div>
                  </div>

                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder={docLang === "bn" ? "কক্ষ নম্বর / ভবন" : "Room / Hall Number"}
                      className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={data.roomNo || ""}
                      onChange={(e) => setData({ ...data, roomNo: e.target.value })}
                    />
                    <div className="absolute right-1">
                      <VoiceInputButton
                        lang={voiceLang}
                        title="Speak Room"
                        onTranscript={(txt) => setData({ ...data, roomNo: txt })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Weekly Timetable Grid Editor */}
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    {docLang === "bn" ? "৩. সাপ্তাহিক ক্লাস রুটিন সময়সূচি" : "3. Weekly Timetable Schedule"}
                  </label>
                  <button
                    type="button"
                    onClick={handleAddRoutineDay}
                    className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> {docLang === "bn" ? "+ দিন যোগ করুন" : "+ Add Day"}
                  </button>
                </div>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {routineList.map((r: any, rIdx: number) => (
                    <div
                      key={rIdx}
                      className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-1.5">
                        <div className="w-36 relative flex items-center">
                          <input
                            type="text"
                            placeholder="Day Name"
                            className="w-full text-xs font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 pr-6 text-blue-900 dark:text-blue-300 focus:outline-none"
                            value={r.day || ""}
                            onChange={(e) => handleRoutineChange(rIdx, "day", e.target.value)}
                          />
                          <div className="absolute right-0.5">
                            <VoiceInputButton
                              lang={voiceLang}
                              title="Speak Day"
                              onTranscript={(txt) => handleRoutineChange(rIdx, "day", txt)}
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveRoutineDay(rIdx)}
                          className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                          title="Remove Day"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5 text-xs">
                        {["p1", "p2", "p3", "p4", "p5", "p6"].map((periodKey, pIdx) => (
                          <div key={periodKey} className="relative flex items-center">
                            <input
                              type="text"
                              placeholder={`P-${pIdx + 1}`}
                              className="w-full text-[11px] bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-1.5 py-1 pr-5 text-slate-900 dark:text-white focus:outline-none"
                              value={r[periodKey] || ""}
                              onChange={(e) => handleRoutineChange(rIdx, periodKey, e.target.value)}
                            />
                            <div className="absolute right-0.5">
                              <VoiceInputButton
                                lang={voiceLang}
                                title={`P${pIdx + 1}`}
                                onTranscript={(txt) => handleRoutineChange(rIdx, periodKey, txt)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Faculty / Teacher Directory (Optional) */}
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    {docLang === "bn" ? "৪. শিক্ষক ও বিষয় তালিকা (অপশনাল)" : "4. Faculty Roster & Legend"}
                  </label>
                  <button
                    type="button"
                    onClick={handleAddTeacher}
                    className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> {docLang === "bn" ? "+ শিক্ষক যোগ" : "+ Add Teacher"}
                  </button>
                </div>

                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {teachersList.map((t: any, tIdx: number) => (
                    <div
                      key={tIdx}
                      className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/60 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                    >
                      <input
                        type="text"
                        placeholder="Code"
                        className="w-14 text-center font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-1 py-1"
                        value={t.code || ""}
                        onChange={(e) => handleTeacherChange(tIdx, "code", e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Teacher Name"
                        className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1"
                        value={t.name || ""}
                        onChange={(e) => handleTeacherChange(tIdx, "name", e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Subject"
                        className="w-24 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1"
                        value={t.subject || ""}
                        onChange={(e) => handleTeacherChange(tIdx, "subject", e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveTeacher(tIdx)}
                        className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ========================================================================= */}
          {/* 2. EXAM ROUTINE EDITOR SECTION */}
          {/* ========================================================================= */}
          {isExamRoutine && (
            <>
              {/* Exam Overview Details */}
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  {docLang === "bn" ? "২. পরীক্ষার সাধারণ বিবরণ" : "2. Examination Overview"}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 relative flex items-center">
                    <input
                      type="text"
                      placeholder={docLang === "bn" ? "পরীক্ষার নাম (যেমন: বার্ষিক পরীক্ষা - ২০২৬)" : "Examination Title (e.g. Annual Examination 2026)"}
                      className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={data.examTitle || ""}
                      onChange={(e) => setData({ ...data, examTitle: e.target.value })}
                    />
                    <div className="absolute right-1">
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
                      placeholder={docLang === "bn" ? "শ্রেণি / বিভাগ (যেমন: ৬ষ্ঠ থেকে ১০ম শ্রেণি)" : "Class / Group (e.g. Classes 6 to 10)"}
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

                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder={docLang === "bn" ? "পরীক্ষার সেশন (যেমন: জুন ২০২৬)" : "Exam Session (e.g. June 2026)"}
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

                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder={docLang === "bn" ? "পরীক্ষা কেন্দ্র / হল (যেমন: মূল ক্যাম্পাস হল-এ)" : "Exam Center / Hall (e.g. Main Auditorium)"}
                      className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={data.examCenter || ""}
                      onChange={(e) => setData({ ...data, examCenter: e.target.value })}
                    />
                    <div className="absolute right-1">
                      <VoiceInputButton
                        lang={voiceLang}
                        title="Speak Center"
                        onTranscript={(txt) => setData({ ...data, examCenter: txt })}
                      />
                    </div>
                  </div>

                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder={docLang === "bn" ? "পরীক্ষার শিফট / সময় (যেমন: সকাল ১০:০০ - ১:০০)" : "Exam Time / Shift (e.g. 10:00 AM - 1:00 PM)"}
                      className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={data.shift || ""}
                      onChange={(e) => setData({ ...data, shift: e.target.value })}
                    />
                    <div className="absolute right-1">
                      <VoiceInputButton
                        lang={voiceLang}
                        title="Speak Shift"
                        onTranscript={(txt) => setData({ ...data, shift: txt })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Exam Schedule Table Editor */}
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    {docLang === "bn" ? "৩. পরীক্ষার তারিখ ও বিষয় তালিকা" : "3. Exam Date Sheet & Subjects"}
                  </label>
                  <button
                    type="button"
                    onClick={handleAddExam}
                    className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> {docLang === "bn" ? "+ পরীক্ষা বিষয় যোগ" : "+ Add Exam"}
                  </button>
                </div>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {examsList.map((ex: any, exIdx: number) => (
                    <div
                      key={exIdx}
                      className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-1.5">
                        <span className="font-bold text-blue-900 dark:text-blue-300">#{exIdx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveExam(exIdx)}
                          className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="relative flex items-center">
                          <input
                            type="text"
                            placeholder="Date (e.g. 15/06/2026)"
                            className="w-full text-[11px] bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 pr-6"
                            value={ex.date || ""}
                            onChange={(e) => handleExamChange(exIdx, "date", e.target.value)}
                          />
                          <div className="absolute right-0.5">
                            <VoiceInputButton
                              lang={voiceLang}
                              title="Date"
                              onTranscript={(txt) => handleExamChange(exIdx, "date", txt)}
                            />
                          </div>
                        </div>

                        <div className="relative flex items-center">
                          <input
                            type="text"
                            placeholder="Day (e.g. Sunday)"
                            className="w-full text-[11px] bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 pr-6"
                            value={ex.day || ""}
                            onChange={(e) => handleExamChange(exIdx, "day", e.target.value)}
                          />
                          <div className="absolute right-0.5">
                            <VoiceInputButton
                              lang={voiceLang}
                              title="Day"
                              onTranscript={(txt) => handleExamChange(exIdx, "day", txt)}
                            />
                          </div>
                        </div>

                        <div className="col-span-2 relative flex items-center">
                          <input
                            type="text"
                            placeholder="Subject Description (e.g. Bangla 1st Paper)"
                            className="w-full text-[11px] font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 pr-6"
                            value={ex.subject || ""}
                            onChange={(e) => handleExamChange(exIdx, "subject", e.target.value)}
                          />
                          <div className="absolute right-0.5">
                            <VoiceInputButton
                              lang={voiceLang}
                              title="Subject"
                              onTranscript={(txt) => handleExamChange(exIdx, "subject", txt)}
                            />
                          </div>
                        </div>

                        <div className="relative flex items-center">
                          <input
                            type="text"
                            placeholder="Code (e.g. 101)"
                            className="w-full text-[11px] text-center bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1"
                            value={ex.code || ""}
                            onChange={(e) => handleExamChange(exIdx, "code", e.target.value)}
                          />
                        </div>

                        <div className="relative flex items-center">
                          <input
                            type="text"
                            placeholder="Room / Hall"
                            className="w-full text-[11px] bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1"
                            value={ex.room || ""}
                            onChange={(e) => handleExamChange(exIdx, "room", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions to Candidates */}
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    {docLang === "bn" ? "৪. পরীক্ষার্থীদের জন্য নিয়মাবলী" : "4. Instructions to Examinees"}
                  </label>
                  <button
                    type="button"
                    onClick={handleAddInstruction}
                    className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> {docLang === "bn" ? "+ নিয়ম যোগ" : "+ Add Rule"}
                  </button>
                </div>

                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {instructionsList.map((inst: string, iIdx: number) => (
                    <div key={iIdx} className="flex items-center gap-1.5 text-xs">
                      <input
                        type="text"
                        className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-[11px]"
                        value={inst}
                        onChange={(e) => handleInstructionChange(iIdx, e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveInstruction(iIdx)}
                        className="text-slate-400 hover:text-red-500 p-1 cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ========================================================================= */}
          {/* 2. STUDENT DEMOGRAPHICS (FOR MARKSHEETS, ADMIT CARDS & CERTIFICATES) */}
          {/* ========================================================================= */}
          {!isClassRoutine && !isExamRoutine && (
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
          )}

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
              {isClassRoutine
                ? docLang === "bn"
                  ? "৫. ক্লাস রুটিন নির্দেশিকা ও স্বাক্ষর"
                  : "5. Routine Notes & Signatures"
                : isExamRoutine
                ? docLang === "bn"
                  ? "৫. পরীক্ষা সংক্রান্ত নোট ও স্বাক্ষর"
                  : "5. Exam Notes & Signatures"
                : docLang === "bn"
                ? "৪. শিক্ষকের মন্তব্য ও স্বাক্ষর"
                : "4. Remarks & Signatures"}
            </label>
            <div className="relative flex items-start">
              <textarea
                rows={2}
                placeholder={
                  isClassRoutine
                    ? docLang === "bn"
                      ? "অ্যাসেম্বলি সময়, ড্রেসকোড ও উপস্থিতি নির্দেশিকা..."
                      : "Assembly timing, uniform and attendance guidelines..."
                    : isExamRoutine
                    ? docLang === "bn"
                      ? "প্রবেশপত্র ও বিশেষ পরীক্ষা নির্দেশিকা..."
                      : "Admit card and examination guidelines..."
                    : docLang === "bn"
                    ? "শিক্ষকের মূল্যায়ন বা মন্তব্য"
                    : "Teacher's remarks..."
                }
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

          <AdSenseSlot slotId="school-editor-sidebar" format="rectangle" label="Advertisement" />
        </div>

        {/* RIGHT COLUMN: Live Printable A4 Academic Sheet */}
        <div
          className={`lg:col-span-7 flex flex-col items-center ${
            mobileView === "preview" ? "flex" : "hidden lg:flex"
          }`}
        >
          {/* Mobile Back-to-Form Header (<1024px) */}
          <div className="w-full flex lg:hidden items-center justify-between mb-4 bg-blue-50 dark:bg-blue-950/60 p-3 rounded-2xl border border-blue-200 dark:border-blue-800 print:hidden">
            <span className="text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-blue-600" />
              {docLang === "bn" ? "লাইভ প্রিন্ট প্রিভিউ" : "Live Print Preview"}
            </span>
            <button
              type="button"
              onClick={() => setMobileView("form")}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 shadow-2xs active:scale-95 transition cursor-pointer"
            >
              {docLang === "bn" ? "← ফর্মে ফিরে যান" : "← Back to Form"}
            </button>
          </div>

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
                    {isClassRoutine
                      ? docLang === "bn"
                        ? "সাপ্তাহিক শ্রেণি কার্যক্রম ও ক্লাস রুটিন"
                        : "WEEKLY CLASS ROUTINE & TIMETABLE"
                      : isExamRoutine
                      ? data.examTitle || (docLang === "bn" ? "পরীক্ষার সময়সূচি ও নির্দেশিকা" : "EXAMINATION SCHEDULE & TIMETABLE")
                      : data.examTitle || (docLang === "bn" ? "ফলাফল ও নম্বরপত্র" : "Academic Progress Report")}
                  </span>
                </div>
              </div>

              {/* 1. CLASS ROUTINE METADATA BENTO STRIP */}
              {isClassRoutine && (
                <div className="grid grid-cols-4 gap-3 my-5 bg-blue-50/80 border border-blue-200/90 rounded-2xl p-4 sm:p-5 text-xs shadow-2xs">
                  <div>
                    <span className="text-[9.5px] uppercase font-bold text-blue-900/60 tracking-wider block mb-0.5">
                      {docLang === "bn" ? "শ্রেণি ও বিভাগ:" : "CLASS / PROGRAM:"}
                    </span>
                    <span className="font-extrabold text-blue-950 text-sm block truncate">
                      {data.classGrade || (docLang === "bn" ? "দশম শ্রেণি (ক)" : "Class 10 (A)")}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9.5px] uppercase font-bold text-blue-900/60 tracking-wider block mb-0.5">
                      {docLang === "bn" ? "শাখা ও কক্ষ:" : "SECTION / ROOM:"}
                    </span>
                    <span className="font-bold text-blue-900 block truncate">
                      {data.section || "A"} {data.roomNo ? `• ${data.roomNo}` : ""}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9.5px] uppercase font-bold text-blue-900/60 tracking-wider block mb-0.5">
                      {docLang === "bn" ? "শিফট ও সময়সূচি:" : "SHIFT & TIMING:"}
                    </span>
                    <span className="font-semibold text-slate-800 block truncate">
                      {data.shift || (docLang === "bn" ? "প্রভাতী শিফট" : "Morning Shift")}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9.5px] uppercase font-bold text-blue-900/60 tracking-wider block mb-0.5">
                      {docLang === "bn" ? "শিক্ষাবর্ষ ও তারিখ:" : "SESSION & DATE:"}
                    </span>
                    <span className="font-semibold text-slate-800 tabular-nums block">
                      {data.academicYear || "Session 2026"}
                    </span>
                  </div>
                </div>
              )}

              {/* 2. EXAM ROUTINE METADATA BENTO STRIP */}
              {isExamRoutine && (
                <div className="space-y-3 my-5">
                  <div className="grid grid-cols-4 gap-3 bg-indigo-50/80 border border-indigo-200/90 rounded-2xl p-4 sm:p-5 text-xs shadow-2xs">
                    <div>
                      <span className="text-[9.5px] uppercase font-bold text-indigo-900/60 tracking-wider block mb-0.5">
                        {docLang === "bn" ? "পরীক্ষার নাম:" : "EXAMINATION:"}
                      </span>
                      <span className="font-extrabold text-indigo-950 text-sm block truncate">
                        {data.examTitle || (docLang === "bn" ? "বার্ষিক পরীক্ষা ২০২৬" : "Annual Exam 2026")}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9.5px] uppercase font-bold text-indigo-900/60 tracking-wider block mb-0.5">
                        {docLang === "bn" ? "অংশগ্রহণকারী শ্রেণি:" : "CLASS / BATCH:"}
                      </span>
                      <span className="font-bold text-indigo-900 block truncate">
                        {data.classGrade || (docLang === "bn" ? "সকল শ্রেণি" : "All Classes")}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9.5px] uppercase font-bold text-indigo-900/60 tracking-wider block mb-0.5">
                        {docLang === "bn" ? "পরীক্ষা কেন্দ্র / হল:" : "EXAM VENUE / HALL:"}
                      </span>
                      <span className="font-semibold text-slate-800 block truncate">
                        {data.examCenter || (docLang === "bn" ? "মূল ক্যাম্পাস হল" : "Main Campus Hall")}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9.5px] uppercase font-bold text-indigo-900/60 tracking-wider block mb-0.5">
                        {docLang === "bn" ? "শিক্ষাবর্ষ / সেশন:" : "ACADEMIC SESSION:"}
                      </span>
                      <span className="font-semibold text-slate-800 tabular-nums block">
                        {data.academicYear || "Session 2026"}
                      </span>
                    </div>
                  </div>
                  {(data.shiftInfo || data.shift) && (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg py-1 px-3 text-center text-[10.5px] font-semibold text-slate-700">
                      ⏰ {data.shiftInfo || data.shift}
                    </div>
                  )}
                </div>
              )}

              {/* 3. STUDENT DEMOGRAPHICS BENTO CARD (FOR MARKSHEETS, ADMIT CARDS & CERTIFICATES ONLY) */}
              {!isClassRoutine && !isExamRoutine && (
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
              )}

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

              {/* WORLD-CLASS CLASS ROUTINE WEEKLY GRID TABLE */}
              {isClassRoutine && data.routine && (
                <div className="my-6 space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-center border-collapse border border-slate-300 text-xs shadow-2xs">
                      <thead>
                        <tr className="bg-slate-900 text-white font-bold uppercase text-[10px] tracking-wider">
                          <th className="p-2.5 border-r border-slate-700 w-24 text-left">
                            {docLang === "bn" ? "দিন / বার" : "Day"}
                          </th>
                          {(Array.isArray(data.periods) && data.periods.length > 0
                            ? data.periods
                            : [
                                docLang === "bn" ? "১ম পিরিয়ড" : "Period 1",
                                docLang === "bn" ? "২য় পিরিয়ড" : "Period 2",
                                docLang === "bn" ? "৩য় পিরিয়ড" : "Period 3",
                                docLang === "bn" ? "৪র্থ পিরিয়ড" : "Period 4",
                                docLang === "bn" ? "৫ম পিরিয়ড" : "Period 5",
                                docLang === "bn" ? "৬ষ্ঠ পিরিয়ড" : "Period 6",
                              ]
                          ).slice(0, 6).map((pLabel: string, pIdx: number) => (
                            <th key={pIdx} className="p-2.5 border-r border-slate-700 last:border-r-0">
                              <span className="block font-black">{pLabel.split("(")[0]?.trim()}</span>
                              {pLabel.includes("(") && (
                                <span className="text-[8px] font-normal opacity-80 block tracking-normal">
                                  {pLabel.substring(pLabel.indexOf("("))}
                                </span>
                              )}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-[11px]">
                        {data.routine.map((r: any, idx: number) => (
                          <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/70"}>
                            <td className="p-2.5 font-extrabold text-left border-r border-slate-300 bg-slate-100/70 text-slate-900">
                              {r.day}
                            </td>
                            {["p1", "p2", "p3", "p4", "p5", "p6"].map((pKey, cIdx) => (
                              <td key={pKey} className="p-2 border-r border-slate-200 last:border-r-0">
                                <div className="font-bold text-slate-900 leading-tight">
                                  {r[pKey] || "—"}
                                </div>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Teacher Directory & Roster Legend */}
                  {Array.isArray(data.teachers) && data.teachers.length > 0 && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[10.5px]">
                      <h4 className="font-bold uppercase tracking-wider text-slate-700 text-[9.5px] mb-1.5 border-b border-slate-200 pb-1">
                        {docLang === "bn" ? "শিক্ষক ও বিষয় নির্দেশিকা:" : "FACULTY DIRECTORY & SUBJECT CODES:"}
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {data.teachers.map((t: any, tIdx: number) => (
                          <div key={tIdx} className="flex items-center gap-1.5 text-slate-800">
                            <span className="font-mono font-bold bg-blue-100 text-blue-900 px-1 py-0.5 rounded text-[9px]">
                              [{t.code}]
                            </span>
                            <span className="font-semibold">{t.name}</span>
                            <span className="text-slate-500">({t.subject})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* WORLD-CLASS EXAM SCHEDULE DATE SHEET TABLE */}
              {isExamRoutine && data.exams && (
                <div className="my-6 space-y-4">
                  <table className="w-full text-left border-collapse border border-slate-300 text-xs shadow-2xs">
                    <thead>
                      <tr className="bg-slate-900 text-white font-bold uppercase text-[10px] tracking-wider">
                        <th className="p-2.5 border-r border-slate-700 w-36">
                          {docLang === "bn" ? "তারিখ ও বার" : "Date & Day"}
                        </th>
                        <th className="p-2.5 border-r border-slate-700 w-36">
                          {docLang === "bn" ? "পরীক্ষার সময় / শিফট" : "Exam Time / Shift"}
                        </th>
                        <th className="p-2.5 border-r border-slate-700">
                          {docLang === "bn" ? "বিষয় ও পত্র বিবরণ" : "Subject Description"}
                        </th>
                        <th className="p-2.5 border-r border-slate-700 text-center w-20">
                          {docLang === "bn" ? "বিষয় কোড" : "Code"}
                        </th>
                        <th className="p-2.5 text-right w-32">
                          {docLang === "bn" ? "পরীক্ষা কক্ষ / হল" : "Hall / Room"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-[11px]">
                      {data.exams.map((ex: any, idx: number) => (
                        <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/70"}>
                          <td className="p-2.5 font-bold border-r border-slate-300 text-slate-900">
                            {ex.date} {ex.day ? `(${ex.day})` : ""}
                          </td>
                          <td className="p-2.5 font-medium border-r border-slate-200 text-slate-700 tabular-nums">
                            {ex.time}
                          </td>
                          <td className="p-2.5 font-bold border-r border-slate-200 text-slate-900">
                            {ex.subject}
                            {ex.syllabus && (
                              <span className="block text-[9.5px] font-normal text-slate-500">{ex.syllabus}</span>
                            )}
                          </td>
                          <td className="p-2.5 text-center font-mono font-bold border-r border-slate-200 text-blue-900">
                            {ex.code}
                          </td>
                          <td className="p-2.5 text-right font-medium text-slate-800">
                            {ex.room}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* General Instructions for Examinees */}
                  {(Array.isArray(data.rules) && data.rules.length > 0 || Array.isArray(data.instructions) && data.instructions.length > 0) && (
                    <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3.5 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-amber-950 uppercase text-[10px] tracking-wider mb-1.5 border-b border-amber-200 pb-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                        <span>{docLang === "bn" ? "পরীক্ষার্থীদের জন্য বিশেষ নির্দেশনাবলী:" : "EXAMINATION RULES & INSTRUCTIONS:"}</span>
                      </div>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[10.5px] text-amber-900 list-disc list-inside leading-relaxed">
                        {(data.rules || data.instructions).map((rule: string, rIdx: number) => (
                          <li key={rIdx}>{rule}</li>
                        ))}
                      </ul>
                    </div>
                  )}
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
                  {data.signatory1 ||
                    (isClassRoutine
                      ? docLang === "bn" ? "রুটিন প্রণয়ন কমিটি" : "Routine Committee"
                      : isExamRoutine
                      ? docLang === "bn" ? "পরীক্ষা নিয়ন্ত্রণ কমিটি" : "Exam Committee"
                      : docLang === "bn" ? "শ্রেণি শিক্ষক" : "Class Teacher")}
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

      {/* STICKY BOTTOM MOBILE ACTION BAR (Hidden on lg+ and during print) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-4 py-2.5 shadow-2xl flex items-center justify-between gap-2 lg:hidden print:hidden">
        <button
          type="button"
          onClick={() => setMobileView(mobileView === "form" ? "preview" : "form")}
          className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 active:scale-95 transition cursor-pointer"
        >
          {mobileView === "form" ? <Eye className="w-4 h-4 text-blue-600" /> : <Edit3 className="w-4 h-4 text-blue-600" />}
          <span>{mobileView === "form" ? (docLang === "bn" ? "প্রিভিউ দেখুন" : "View Preview") : (docLang === "bn" ? "ফর্ম এডিট" : "Edit Form")}</span>
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white shadow-xs active:scale-95 transition cursor-pointer"
            title="Print"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md active:scale-95 transition cursor-pointer disabled:opacity-50"
          >
            {isExportingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>{docLang === "bn" ? "PDF ডাউনলোড" : "Download PDF"}</span>
          </button>
        </div>
      </div>

      {/* Post-Download Confirmation Modal with Policy-Compliant Ad */}
      <PostDownloadModal
        isOpen={showPostDownloadModal}
        onClose={() => setShowPostDownloadModal(false)}
        documentTitle={data.schoolName || data.templateTitle || "Academic Sheet"}
        lang={docLang}
        paperSize="A4"
      />

      {/* Multi-Channel Share Modal */}
      <ShareDocumentModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        documentTitle={data.schoolName || "Academic Record"}
        documentNumber={data.studentRoll || "DOC"}
        recipientName={data.studentName || "Student"}
        recipientPhone={data.guardianPhone || data.phone || ""}
        fullFormattedText={getShareMessage()}
        docLang={docLang}
      />
    </div>
  );
}
