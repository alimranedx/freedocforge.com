"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Wand2,
  Mic,
  ArrowRight,
  Printer,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { useUserDashboard } from "@/context/UserDashboardContext";

const SAMPLE_PROMPTS = [
  {
    title: "📅 Weekly School Class Timetable",
    category: "routine",
    prompt: "Create an ISO A4 6-period weekly class routine for Class 9 Science with morning assembly, subject codes (Physics, Math, ICT), teacher initials, and principal seal.",
  },
  {
    title: "📝 Board & Term Exam Schedule",
    category: "exam",
    prompt: "Generate an annual term final examination schedule with morning shifts (10:00 AM - 01:00 PM), subject codes, hall room allocations, and exam rules.",
  },
  {
    title: "🩺 Diagnostic Pathology Investigation Bill",
    category: "medical",
    prompt: "Generate a diagnostic center money receipt with test names (CBC, Lipid Profile, USG), specimen collection time, report delivery schedule, advance paid, and cashier stamp.",
  },
  {
    title: "🧾 F-Commerce Boutique Cash Memo",
    category: "receipt",
    prompt: "Design an online clothing shop cash memo with customer delivery address, courier consignment tracking number, advance bKash deposit, and 48-hour return terms.",
  },
  {
    title: "🚗 Automobile Repair Workshop Bill",
    category: "receipt",
    prompt: "Create an automobile repair job card with vehicle registration number, mileage, replaced spare parts list, labor service charge, and mechanic warranty seal.",
  },
  {
    title: "🍽️ Restaurant POS 80mm Bill",
    category: "receipt",
    prompt: "Generate an 80mm continuous thermal POS receipt with table number, waiter name, culinary items, 5% VAT, 10% service charge, and Wi-Fi password.",
  },
];

export default function AiTemplateDesignerPage() {
  const { lang } = useUserDashboard();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<any | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceLang, setVoiceLang] = useState<"bn-BD" | "en-US">("bn-BD");

  // Voice recognition
  const handleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = voiceLang;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      setPrompt((prev) => (prev ? prev + " " + text : text));
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  // Generate Layout
  const handleGenerate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);

    setTimeout(() => {
      const q = prompt.toLowerCase();
      const isRoutine = q.includes("routine") || q.includes("timetable") || q.includes("পিরিয়ড") || q.includes("ক্লাস");
      const isExam = q.includes("exam") || q.includes("পরীক্ষা") || q.includes("schedule") || q.includes("টেস্ট");
      const isMedical = q.includes("diag") || q.includes("medic") || q.includes("lab") || q.includes("ডাক্তার") || q.includes("pathology");
      const isPos = q.includes("pos") || q.includes("thermal") || q.includes("restaurant") || q.includes("৮০মিমি");

      let slug = "f-commerce-invoice";
      let title = "Custom Business Cash Memo (AI Generated)";
      let category = "Business";
      let paperSize = "A4";

      if (isRoutine) {
        slug = "school-class-routine";
        title = "Class Timetable & Master Routine (AI Generated)";
        category = "Education";
      } else if (isExam) {
        slug = "school-exam-routine";
        title = "Examination Timetable & Shift Schedule (AI Generated)";
        category = "Education";
      } else if (isMedical) {
        slug = "medical-money-receipt";
        title = "Diagnostic Lab Investigation Bill (AI Generated)";
        category = "Healthcare";
      } else if (isPos) {
        slug = "restaurant-pos-bill";
        title = "Restaurant 80mm POS Thermal Bill (AI Generated)";
        category = "Restaurant";
        paperSize = "POS_80MM";
      }

      setGeneratedResult({
        title,
        category,
        paperSize,
        slug,
        fields: [
          { label: "Entity / Header Name", value: "Smart Studio AI Layout" },
          { label: "Document Serial", value: "AI-GEN-2026-X" },
          { label: "Beneficiary / Client", value: "Selected Recipient / Batch" },
          { label: "Line Item / Schedule Slot 1", value: "Primary Deliverable / Period 1" },
          { label: "Line Item / Schedule Slot 2", value: "Secondary Analysis / Period 2" },
          { label: "Status / Total", value: isMedical || !isRoutine ? "Net Payable: ৳ 2,450" : "Status: Active Routine" },
        ],
        notes: "Generated by FreeDocForge Deep Architectural AI Engine. Precision printable vector layout.",
      });

      setIsGenerating(false);
    }, 1100);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-500/20 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-3 border border-purple-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{lang === "bn" ? "এআই ডকুমেন্ট আর্কিটেক্ট" : "Deep AI Document Architect"}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {lang === "bn" ? "ভয়েস বা টেক্সট দিয়ে নতুন টেমপ্লেট ডিজাইন করুন" : "Generate Custom Document Layouts with AI"}
          </h1>
          <p className="text-purple-100 text-xs sm:text-sm mt-2 leading-relaxed">
            {lang === "bn"
              ? "আপনার কি কোনো বিশেষ ক্যাশ মেমো, ডায়াগনস্টিক স্লিপ, ক্লাস রুটিন বা পরীক্ষার সময়সূচি দরকার? মুখে বলুন বা লিখুন, এআই নিমিষেই রেডিমেড লেআউট তৈরি করে দেবে!"
              : "Describe any specialized cash memo, weekly timetable, exam schedule, or diagnostic receipt in plain English or Bengali. Our AI engine builds the printable layout instantly."}
          </p>
        </div>
      </div>

      {/* Main AI Generator Input Box */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-purple-600" />
            <span>{lang === "bn" ? "আপনার প্রয়োজনীয় ফরম্যাটের বিবরণ দিন" : "Describe Your Desired Layout"}</span>
          </label>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-semibold">{lang === "bn" ? "ভয়েস:" : "Voice:"}</span>
            <button
              type="button"
              onClick={() => setVoiceLang(voiceLang === "bn-BD" ? "en-US" : "bn-BD")}
              className="text-[11px] font-bold px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 cursor-pointer"
            >
              {voiceLang === "bn-BD" ? "বাংলা (bn-BD)" : "English (en-US)"}
            </button>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="relative">
            <textarea
              rows={4}
              required
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                lang === "bn"
                  ? "যেমন: একটি প্রাথমিক স্কুলের সাপ্তাহিক ক্লাস রুটিন তৈরি কর যেখানে ৬টি পিরিয়ড, সকালের সমাবেশ, শিক্ষকের ইনিশিয়াল ও প্রধান শিক্ষকের সিল থাকবে..."
                  : "e.g. Design a diagnostic lab pathology bill with CBC, Lipid Profile test rows, specimen time, delivery date, and cashier seal..."
              }
              className="w-full text-xs sm:text-sm p-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:outline-none transition leading-relaxed"
            />

            <button
              type="button"
              onClick={handleVoiceInput}
              className={`absolute right-3 bottom-4 p-2 rounded-xl transition cursor-pointer flex items-center gap-1 ${
                isListening
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-white dark:bg-slate-700 text-slate-500 hover:text-purple-600 shadow-2xs"
              }`}
              title="Voice Typing"
            >
              <Mic className="w-4 h-4" />
              <span className="text-[10px] font-bold hidden sm:inline">
                {isListening ? (lang === "bn" ? "শুনছি..." : "Listening...") : (lang === "bn" ? "ভয়েস" : "Voice")}
              </span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-slate-400">
              {lang === "bn" ? "⚡ বাংলা ও ইংরেজি উভয় ভাষায় প্রম্পট সমর্থন করে" : "⚡ Supports natural language in English & Bengali"}
            </span>

            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold px-7 py-3 rounded-xl text-xs sm:text-sm transition shadow-md cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{lang === "bn" ? "ডিজাইন তৈরি হচ্ছে..." : "Generating Vector Layout..."}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{lang === "bn" ? "এআই টেমপ্লেট তৈরি করুন" : "Generate Custom Layout"}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* 6 Sample Prompts Across All 4 Pillars */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
            {lang === "bn" ? "💡 দ্রুত টেস্টের জন্য রেডিমেড আইডিয়া:" : "💡 Quick Start Prompts (Click to Fill):"}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {SAMPLE_PROMPTS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPrompt(sample.prompt)}
                className="p-3 text-left bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50/60 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-300 rounded-xl transition cursor-pointer text-xs group"
              >
                <span className="font-bold text-slate-800 dark:text-slate-200 block truncate group-hover:text-purple-600">
                  {sample.title}
                </span>
                <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                  {sample.prompt}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generated Result Preview Card */}
      {generatedResult && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-purple-500/40 p-6 sm:p-8 shadow-xl space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold mb-1">
                <CheckCircle className="w-3 h-3" />
                <span>{lang === "bn" ? "লেআউট প্রস্তুত" : "Vector Layout Ready"}</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {generatedResult.title}
              </h3>
            </div>
            <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg">
              {generatedResult.paperSize} Standard
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {generatedResult.fields.map((field: any, i: number) => (
              <div key={i} className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">{field.label}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">{field.value}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <span className="text-[11px] text-slate-400 font-medium">
              {generatedResult.notes}
            </span>

            <Link
              href={`/templates/${generatedResult.slug}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>{lang === "bn" ? "এই টেমপ্লেটে ডাটা এডিট ও প্রিন্ট করুন" : "Open in Specialized Editor & Print"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
