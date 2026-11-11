"use client";

import React, { useState, useRef } from "react";
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
} from "lucide-react";
import AdSenseSlot from "@/components/AdSenseSlot";
import VoiceInputButton from "@/components/VoiceInputButton";
import { useGlobalSettings } from "@/context/GlobalSettingsContext";

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
  const [data, setData] = useState({ ...initialData });
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

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

  const handleSaveToProfile = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
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
  const isMarksheet = templateSlug === "school-result-sheet";
  const isClassRoutine = templateSlug === "school-class-routine";
  const isExamRoutine = templateSlug === "school-exam-routine";
  const isAdmitCard = templateSlug === "school-admit-card";

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
            <button
              onClick={handlePrint}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-xs transition text-xs sm:text-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              {docLang === "bn" ? "মার্কশিট প্রিন্ট / PDF ডাউনলোড" : "Print Academic Sheet / Save PDF"}
            </button>

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
                  {docLang === "bn" ? "প্রতিষ্ঠানের প্রিসেট সেভ রাখুন" : "Save Institute Profile Preset"}
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
              onClick={handlePrint}
              className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              {docLang === "bn" ? "সরাসরি প্রিন্ট" : "Direct Download"}
            </button>
          </div>

          {/* REAL ACADEMIC MARKSHEET / CERTIFICATE CANVAS */}
          <div
            ref={printRef}
            id="printable-document"
            className="w-full max-w-[210mm] min-h-[297mm] bg-white text-gray-900 p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-200 print:border-none print:shadow-none print:p-0 print:m-0 print:w-full print:max-w-none text-xs flex flex-col justify-between"
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

              {/* Student Demographics Bar */}
              <div className="grid grid-cols-4 gap-3 my-5 bg-gray-50 p-4 rounded-lg border border-gray-200 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">
                    {docLang === "bn" ? "শিক্ষার্থীর নাম:" : "Student Name:"}
                  </span>
                  <span className="font-bold text-gray-900 text-sm">{data.studentName}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">
                    {docLang === "bn" ? "রোল নম্বর:" : "Roll No:"}
                  </span>
                  <span className="font-bold text-gray-900">{data.rollNo}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">
                    {docLang === "bn" ? "শ্রেণি / বিভাগ:" : "Class / Grade:"}
                  </span>
                  <span className="font-semibold text-gray-800">{data.classGrade}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">
                    {docLang === "bn" ? "ইস্যু তারিখ:" : "Date of Issue:"}
                  </span>
                  <span className="font-semibold text-gray-800">{data.date}</span>
                </div>
              </div>

              {/* Subjects & Marks Table */}
              {isMarksheet && (
                <table className="w-full text-left border-collapse my-6">
                  <thead>
                    <tr className="border-b-2 border-gray-900 text-gray-900 uppercase text-[10px] font-bold">
                      <th className="py-2.5 w-10">{docLang === "bn" ? "নং" : "#"}</th>
                      <th className="py-2.5">{docLang === "bn" ? "বিষয়ের নাম" : "Subject Description"}</th>
                      <th className="py-2.5 text-center w-28">{docLang === "bn" ? "পূর্ণমান" : "Full Marks"}</th>
                      <th className="py-2.5 text-center w-28">{docLang === "bn" ? "প্রাপ্ত নম্বর" : "Marks Obtained"}</th>
                      <th className="py-2.5 text-right w-24">{docLang === "bn" ? "লেটার গ্রেড" : "Letter Grade"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {subjectsList.map((sub: any, idx: number) => (
                      <tr key={idx} className="hover:bg-gray-50/50">
                        <td className="py-3 text-gray-400 font-medium">{idx + 1}</td>
                        <td className="py-3 font-semibold text-gray-900">{sub.name}</td>
                        <td className="py-3 text-center text-gray-600">{sub.fullMarks || 100}</td>
                        <td className="py-3 text-center font-bold text-gray-900">{sub.marks}</td>
                        <td className="py-3 text-right font-black text-blue-700">{sub.grade || "A+"}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-900 font-black text-gray-900 text-xs bg-gray-50">
                      <td colSpan={2} className="py-3 pl-2">
                        {docLang === "bn" ? "সর্বমোট প্রাপ্ত ফলাফল:" : "Cumulative Performance:"}
                      </td>
                      <td className="py-3 text-center">{totalFullMarks}</td>
                      <td className="py-3 text-center text-blue-700">{totalMarks}</td>
                      <td className="py-3 text-right pr-2">
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
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

              {/* Remarks Box */}
              {data.remarks && (
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
                {signaturePreview ? (
                  <img src={signaturePreview} alt="Signature" className="h-10 mx-auto mb-1 object-contain" />
                ) : (
                  <div className="w-36 border-b-2 border-gray-900 mb-1 mx-auto"></div>
                )}
                <span className="text-[11px] font-bold text-gray-900 block">
                  {data.signatory2 || (docLang === "bn" ? "প্রধান শিক্ষক / অধ্যক্ষ" : "Headmaster / Principal")}
                </span>
                <span className="text-[10px] text-gray-500 block">
                  {docLang === "bn" ? "স্বাক্ষর ও সিলমোহর" : "Official Seal"}
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
