"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  Stethoscope,
  GraduationCap,
  ShoppingBag,
  Award,
  Calendar,
  Clock,
  CheckCircle,
  Eye,
  Printer,
  Sparkles,
  Zap,
  Receipt,
  HeartPulse,
  Activity,
  Layers,
  Crown,
  ShieldCheck,
  Cpu,
  Truck,
} from "lucide-react";
import { TemplateDefinition } from "@/lib/templates";
import {
  detectDefaultThemeForTemplate,
  DESIGN_THEMES,
  DesignThemeId,
} from "@/lib/designThemes";

interface TemplateCardPreviewProps {
  template: TemplateDefinition;
  lang: "en" | "bn";
  onQuickView?: (template: TemplateDefinition) => void;
}

export default function TemplateCardPreview({
  template,
  lang,
  onQuickView,
}: TemplateCardPreviewProps) {
  const isShop = template.category === "Business" || template.category === "Restaurant";
  const isSchool = template.category === "Education";
  const isMedical = template.category === "Healthcare";
  const isPos = template.paperSize === "POS_80MM" || template.slug.includes("pos");
  const sub = template.subCategory || "";
  const slug = template.slug;

  const title = lang === "bn" && template.locales?.bn?.title ? template.locales.bn.title : template.title;
  const data = template.defaultData || {};

  // Detect visual design archetype
  const themeId = detectDefaultThemeForTemplate(template.category, template.slug, template.paperSize);
  const theme = DESIGN_THEMES[themeId] || DESIGN_THEMES["modern-blue"];

  // Category & Archetype Floating Icon
  const renderFloatingIcon = () => {
    if (themeId === "luxury-gold") {
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-white flex items-center justify-center shadow-lg ring-4 ring-white dark:ring-stone-900">
          <Crown className="w-4 h-4" />
        </div>
      );
    }
    if (themeId === "thermal-pos") {
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-950 text-white flex items-center justify-center shadow-lg ring-4 ring-white dark:ring-zinc-900">
          <Receipt className="w-4 h-4" />
        </div>
      );
    }
    if (themeId === "royal-academic") {
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-900 to-indigo-950 text-white flex items-center justify-center shadow-lg ring-4 ring-white dark:ring-slate-900">
          <GraduationCap className="w-4 h-4" />
        </div>
      );
    }
    if (themeId === "clinical-teal") {
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-700 to-emerald-600 text-white flex items-center justify-center shadow-lg ring-4 ring-white dark:ring-slate-900">
          <Stethoscope className="w-4 h-4" />
        </div>
      );
    }
    if (themeId === "cyber-slate") {
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-slate-800 text-white flex items-center justify-center shadow-lg ring-4 ring-white dark:ring-slate-900">
          <Cpu className="w-4 h-4" />
        </div>
      );
    }
    // Default F-Commerce Modern Blue
    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg ring-4 ring-white dark:ring-slate-900">
        <ShoppingBag className="w-4 h-4" />
      </div>
    );
  };

  // Render ThemeForest-Style Visual Template Snapshot
  const renderVisualSnapshot = () => {
    // -------------------------------------------------------------------------
    // Common item calculations for billing/invoices
    // -------------------------------------------------------------------------
    const itemsList = Array.isArray(data.items) ? data.items : [];
    const computedSubtotal = itemsList.reduce(
      (acc: number, it: any) => acc + (Number(it.price) * (Number(it.quantity) || 1) || 0),
      0
    );
    const computedTotal = Math.max(
      0,
      computedSubtotal + (Number(data.deliveryCharge) || 0) - (Number(data.discount) || 0)
    );

    // -------------------------------------------------------------------------
    // 1. DIAGNOSTIC CENTER TEST BILL & MONEY RECEIPT (CLINICAL TEAL / INVOICE)
    // -------------------------------------------------------------------------
    if (slug === "medical-money-receipt") {
      return (
        <div className="w-full h-full bg-white text-slate-800 p-3.5 flex flex-col justify-between text-[8px] select-none rounded-xl relative overflow-hidden shadow-xs border-2 border-teal-600/40 font-sans">
          <div className="border-b-2 border-teal-700 pb-1.5 flex justify-between items-start">
            <div className="max-w-[70%]">
              <h4 className="font-extrabold text-[9.5px] text-teal-950 uppercase tracking-tight truncate">
                {data.businessName || "Popular Diagnostic Center"}
              </h4>
              <p className="text-[6.5px] text-slate-500 font-medium truncate">
                {data.tagline || "Pathology & Radiology Services"}
              </p>
              <p className="text-[6px] text-teal-700 font-semibold">{data.phone || "+880 2-9669480"}</p>
            </div>
            <div className="text-right">
              <span className="bg-teal-700 text-white font-black text-[6.5px] px-1.5 py-0.5 rounded-xs uppercase">
                TEST MONEY RECEIPT
              </span>
              <p className="text-[6px] font-bold text-slate-700 mt-0.5">{data.invoiceNumber || "MR-2026-904"}</p>
            </div>
          </div>

          <div className="bg-teal-50/70 border border-teal-200/80 rounded px-2 py-1 flex justify-between text-[7px] my-1 font-medium text-slate-700">
            <span><strong>Patient:</strong> {data.customerName?.split(" ")[0] || "Mohammad"}</span>
            <span><strong>Ref:</strong> {data.tagline?.split(" ")[0] || "Self"}</span>
            <span className="text-teal-800 font-bold">Delivery: Today 7PM</span>
          </div>

          <table className="w-full text-[6.5px] border-collapse my-0.5">
            <thead>
              <tr className="border-b border-teal-200 font-extrabold text-teal-900 uppercase bg-teal-50/50">
                <th className="text-left py-0.5 px-1">Diagnostic Test Description</th>
                <th className="text-right py-0.5 px-1">Fee (BDT)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-teal-50">
              {itemsList.slice(0, 2).map((it: any, iIdx: number) => (
                <tr key={iIdx}>
                  <td className="py-0.5 px-1 font-semibold truncate max-w-[125px]">{it.name}</td>
                  <td className="text-right px-1 font-bold">৳ {Number(it.price).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border-t border-teal-200 pt-1 flex justify-between items-end text-[7px]">
            <div>
              <span className="text-[6px] text-slate-400 block">freedocforge.com</span>
              <span className="font-extrabold text-teal-800">Net Due: ৳ {computedTotal.toLocaleString()}</span>
            </div>
            <div className="text-center">
              <div className="w-16 border-b border-teal-700 mb-0.5"></div>
              <span className="text-[6px] font-bold text-teal-900">Cashier Signature</span>
            </div>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------------------
    // 2. MEDICAL SERIAL TOKEN / APPOINTMENT SLIP (SERIAL)
    // -------------------------------------------------------------------------
    if (sub === "serial" || slug === "medical-appointment-token" || slug === "hospital-admission-slip") {
      const isAdmission = slug === "hospital-admission-slip";
      return (
        <div className="w-full h-full bg-white text-slate-800 p-3.5 flex flex-col justify-between text-[8px] select-none rounded-xl relative overflow-hidden shadow-xs border-2 border-rose-500/30 font-sans">
          <div className="border-b border-rose-200 pb-1.5 flex justify-between items-start">
            <div className="max-w-[70%]">
              <h4 className="font-black text-[9.5px] text-rose-950 uppercase tracking-tight truncate">
                {data.hospitalName || "Square Specialist Chamber"}
              </h4>
              <p className="text-[6.5px] text-slate-500 font-medium truncate">{data.tagline || "Specialist Consultation Center"}</p>
            </div>
            <span className="bg-rose-700 text-white font-black text-[6.5px] px-1.5 py-0.5 rounded uppercase">
              {isAdmission ? "ADMISSION SLIP" : "SERIAL TOKEN"}
            </span>
          </div>

          <div className="my-1.5 bg-rose-50/70 border border-rose-200 rounded-lg p-2 text-center">
            <span className="text-[6.5px] font-bold uppercase text-rose-800 tracking-wider block">
              {isAdmission ? "HOSPITAL ADMISSION ORDER" : "PATIENT APPOINTMENT SERIAL"}
            </span>
            <div className="text-base font-black text-rose-900 tracking-tight my-0.5">
              {data.serialNo || (isAdmission ? "ADM - 809" : "SL - 24")}
            </div>
            <div className="flex justify-center gap-3 text-[7px] text-slate-700 font-medium">
              <span><strong>Room:</strong> {data.roomNo || "Room 402"}</span>
              <span><strong>Time:</strong> {data.appointmentTime || "06:30 PM"}</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded px-2 py-1 space-y-0.5 text-[7px]">
            <div className="flex justify-between">
              <span className="text-slate-500">Patient:</span>
              <strong className="text-slate-900">{data.patientName || "Kamal Hossain"}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Doctor:</span>
              <strong className="text-slate-900">{data.doctorName || "Prof. Dr. Specialist"}</strong>
            </div>
          </div>

          <div className="border-t border-rose-200 pt-1 flex justify-between items-end text-[7px]">
            <span className="bg-emerald-100 text-emerald-800 font-black px-1.5 py-0.5 rounded text-[6.5px]">
              Fee: ৳ {data.consultationFee || "1,000"} (PAID)
            </span>
            <div className="text-center">
              <div className="w-14 border-b border-rose-700 mb-0.5"></div>
              <span className="text-[6px] font-bold text-rose-900">Authorized Seal</span>
            </div>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------------------
    // 3. MEDICAL DISCHARGE SUMMARY & RADIOLOGY REPORT (DISCHARGE)
    // -------------------------------------------------------------------------
    if (sub === "discharge" || slug === "medical-discharge-slip" || slug === "radiology-report-pad") {
      const isRadio = slug.includes("radiology");
      return (
        <div className="w-full h-full bg-white text-slate-800 p-3.5 flex flex-col justify-between text-[8px] select-none rounded-xl relative overflow-hidden shadow-xs border-2 border-indigo-500/30 font-sans">
          <div className="border-b-2 border-indigo-700 pb-1.5 flex justify-between items-start">
            <div className="max-w-[70%]">
              <h4 className="font-black text-[9.5px] text-indigo-950 uppercase tracking-tight truncate">
                {data.hospitalName || "Dhaka Central Hospital"}
              </h4>
              <p className="text-[6.5px] text-slate-500 truncate">{data.phone || "+880 2-8611111"}</p>
            </div>
            <span className="bg-indigo-700 text-white font-black text-[6.5px] px-1.5 py-0.5 rounded uppercase">
              {isRadio ? "RADIOLOGY REPORT" : "DISCHARGE SUMMARY"}
            </span>
          </div>

          <div className="bg-indigo-50/60 border border-indigo-200 rounded px-2 py-1 flex justify-between text-[7px] my-1 font-medium text-slate-700">
            <span><strong>Pt:</strong> {data.patientName || "Mrs. Bilkis"}</span>
            <span><strong>Bed:</strong> {data.bedNo || "Cabin 402"}</span>
            <span><strong>Date:</strong> {data.dischargeDate || "11/11/26"}</span>
          </div>

          <div className="space-y-1 my-0.5 text-[6.5px]">
            <div>
              <span className="font-black uppercase text-indigo-950 block text-[6px]">Final Diagnosis:</span>
              <p className="font-bold text-slate-800 bg-slate-50 p-1 rounded border border-slate-100 truncate">
                {data.finalDiagnosis || "Clinical Assessment & Summary"}
              </p>
            </div>
            <div>
              <span className="font-black uppercase text-indigo-950 block text-[6px]">Clinical Course & Advice:</span>
              <p className="text-slate-600 line-clamp-2 leading-tight">
                {data.dischargeVitals || data.treatmentSummary || "Stable vital parameters upon discharge. Follow-up after 7 days."}
              </p>
            </div>
          </div>

          <div className="border-t border-indigo-200 pt-1 flex justify-between items-end text-[7px]">
            <span className="text-[6px] text-slate-400">Official Clinical Summary</span>
            <div className="text-center">
              <div className="w-14 border-b border-indigo-800 mb-0.5"></div>
              <span className="text-[6px] font-bold text-indigo-900">Consultant Sign</span>
            </div>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------------------
    // 4. MEDICAL PRESCRIPTION (Rx Pad) - DYNAMIC FOR ALL SPECIALITIES
    // -------------------------------------------------------------------------
    if (
      isMedical ||
      sub === "prescription" ||
      slug.startsWith("doctor-") ||
      slug.startsWith("dental-") ||
      slug.startsWith("eye-") ||
      slug.startsWith("pediatric-") ||
      slug.startsWith("physiotherapy-")
    ) {
      const isDental = slug.includes("dental");
      const isEye = slug.includes("eye");
      const isPediatric = slug.includes("pediatric");
      const isPhysio = slug.includes("physiotherapy");
      const medsList = Array.isArray(data.medicines) && data.medicines.length > 0 ? data.medicines : [];

      return (
        <div className="w-full h-full bg-white text-slate-800 p-3.5 flex flex-col justify-between text-[8px] select-none rounded-xl relative overflow-hidden shadow-xs border-2 border-teal-600/30 font-sans">
          <div className="border-b-2 border-teal-700 pb-2 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                <p className="font-extrabold text-[9.5px] text-teal-950 truncate max-w-[150px]">
                  {data.doctorName || "Dr. Farhana Yasmin, MBBS, FCPS"}
                </p>
              </div>
              <p className="text-[7px] text-slate-600 font-semibold mt-0.5 truncate max-w-[140px]">
                {data.degrees || "Specialist Physician"}
              </p>
              <span className="text-[6.5px] bg-teal-50 text-teal-800 font-bold px-1 py-0.2 rounded mt-0.5 inline-block border border-teal-200">
                {data.regNo || "BMDC Reg No: A-54321"}
              </span>
            </div>
            <div className="text-right">
              <span className="bg-teal-700 text-white font-black text-[7px] px-1.5 py-0.5 rounded uppercase tracking-wider">
                {isDental ? "DENTAL Rx" : isEye ? "VISION Rx" : isPediatric ? "CHILD Rx" : isPhysio ? "REHAB Rx" : "DOCTOR Rx"}
              </span>
              <p className="text-[6.5px] text-slate-500 font-medium mt-1 truncate max-w-[80px]">
                {data.hospitalName || "Care Specialist Chamber"}
              </p>
            </div>
          </div>

          <div className="bg-teal-50/50 border border-teal-200/80 rounded px-2 py-1 flex justify-between text-[7px] my-1 font-medium text-slate-700">
            <span><strong>Pt:</strong> {data.patientName?.split(" ")[0] || "Nasrin"} ({data.patientAge || "42y"})</span>
            <span><strong>Sex:</strong> {data.patientGender || "Female"}</span>
            <span><strong>BP:</strong> {data.bp || "120/80"}</span>
            <span><strong>Date:</strong> 11/11/26</span>
          </div>

          <div className="grid grid-cols-12 gap-2 flex-1 my-0.5">
            <div className="col-span-4 border-r border-teal-100 pr-1.5 space-y-1">
              <div>
                <span className="text-[6px] font-black text-teal-900 uppercase block">Diagnosis:</span>
                <p className="text-[6px] font-bold text-slate-800 bg-teal-50/60 p-0.5 rounded truncate">
                  {data.diagnosis || "Clinical Review"}
                </p>
              </div>
              <div>
                <span className="text-[6px] font-black text-teal-900 uppercase block">Tests:</span>
                <p className="text-[5.5px] text-slate-500 leading-tight truncate">
                  {data.tests || "Routine Follow-up"}
                </p>
              </div>
            </div>

            <div className="col-span-8 pl-1 space-y-1">
              <div className="flex items-center gap-1 border-b border-teal-100 pb-0.5">
                <span className="font-serif font-black text-teal-800 text-base leading-none">℞</span>
                <span className="text-[6px] uppercase font-bold text-teal-700 tracking-wider">Prescribed Care</span>
              </div>
              <div className="space-y-1">
                {medsList.length > 0 ? (
                  medsList.slice(0, 2).map((m: any, mIdx: number) => (
                    <div key={mIdx} className="bg-teal-50/70 border border-teal-200/60 p-1 rounded">
                      <div className="flex justify-between font-bold text-[7.5px] text-slate-900">
                        <span className="truncate max-w-[100px]">{mIdx + 1}. {m.name}</span>
                        <span className="text-teal-700 text-[6.5px]">{m.duration || "5d"}</span>
                      </div>
                      <p className="text-[6.5px] text-slate-600 font-medium">{m.dosage || "1 + 0 + 1"}</p>
                    </div>
                  ))
                ) : (
                  <div className="bg-teal-50/70 border border-teal-200/60 p-1 rounded">
                    <div className="font-bold text-[7.5px] text-slate-900">1. Tab. Napa Extra (665mg)</div>
                    <p className="text-[6.5px] text-slate-600 font-medium">১ + ০ + ১ (খাবারের পর)</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-teal-200 pt-1 flex justify-between items-end">
            <div>
              <p className="text-[6px] text-slate-400">BMDC Standard Prescription Pad</p>
              <p className="text-[5.5px] text-teal-700 font-semibold">freedocforge.com • 100% Free</p>
            </div>
            <div className="text-center">
              <div className="w-16 border-b-2 border-teal-700 mb-0.5"></div>
              <span className="text-[6.5px] font-bold text-teal-900 block">Doctor's Seal & Sign</span>
            </div>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------------------
    // 5. CLASS ROUTINE (EDUCATION)
    // -------------------------------------------------------------------------
    if (slug === "school-class-routine" || Array.isArray(data.routine)) {
      const routineList = Array.isArray(data.routine) ? data.routine : [];
      return (
        <div className="w-full h-full bg-white text-blue-950 p-3 flex flex-col justify-between text-[8px] select-none rounded-xl relative overflow-hidden shadow-xs border-2 border-blue-900 font-sans">
          <div className="text-center border-b border-blue-900 pb-1">
            <h4 className="font-black text-[9px] uppercase tracking-tight truncate">
              {data.instituteName || "Uttara Model School & College"}
            </h4>
            <span className="inline-block bg-blue-900 text-white font-bold text-[6px] px-2 py-0.2 rounded mt-0.5">
              WEEKLY CLASS ROUTINE - {data.classGrade || "Class 10"}
            </span>
          </div>

          <table className="w-full text-[6.5px] border-collapse my-1 border border-blue-200">
            <thead>
              <tr className="bg-blue-900 text-white font-bold uppercase">
                <th className="py-0.5 px-1 text-left border-r border-blue-800">Day</th>
                <th className="py-0.5 px-1 border-r border-blue-800">P-1</th>
                <th className="py-0.5 px-1 border-r border-blue-800">P-2</th>
                <th className="py-0.5 px-1">P-3</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {routineList.slice(0, 3).map((r: any, rIdx: number) => (
                <tr key={rIdx}>
                  <td className="py-0.5 px-1 font-bold border-r border-blue-100">{r.day}</td>
                  <td className="py-0.5 px-1 text-center border-r border-blue-100">{r.p1}</td>
                  <td className="py-0.5 px-1 text-center border-r border-blue-100">{r.p2}</td>
                  <td className="py-0.5 px-1 text-center">{r.p3}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border-t border-blue-900 pt-1 flex justify-between items-end text-[6.5px]">
            <span className="text-[6px] text-slate-500">School Timetable Standard</span>
            <div className="text-center">
              <div className="w-14 border-b border-blue-900 mb-0.5"></div>
              <span className="text-[6px] font-bold text-blue-900">Principal Sign</span>
            </div>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------------------
    // 6. EXAM ROUTINE (EDUCATION)
    // -------------------------------------------------------------------------
    if (slug === "school-exam-routine" || Array.isArray(data.exams)) {
      const examList = Array.isArray(data.exams) ? data.exams : [];
      return (
        <div className="w-full h-full bg-white text-blue-950 p-3 flex flex-col justify-between text-[8px] select-none rounded-xl relative overflow-hidden shadow-xs border-2 border-blue-900 font-sans">
          <div className="text-center border-b border-blue-900 pb-1">
            <h4 className="font-black text-[9px] uppercase tracking-tight truncate">
              {data.instituteName || "Ideal School & College"}
            </h4>
            <span className="inline-block bg-blue-900 text-white font-bold text-[6px] px-2 py-0.2 rounded mt-0.5">
              {data.examTitle || "EXAMINATION SCHEDULE"}
            </span>
          </div>

          <table className="w-full text-[6.5px] border-collapse my-1 border border-blue-200">
            <thead>
              <tr className="bg-blue-900 text-white font-bold uppercase">
                <th className="py-0.5 px-1 text-left border-r border-blue-800">Date</th>
                <th className="py-0.5 px-1 border-r border-blue-800">Subject</th>
                <th className="py-0.5 px-1">Hall</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {examList.slice(0, 3).map((ex: any, eIdx: number) => (
                <tr key={eIdx}>
                  <td className="py-0.5 px-1 font-bold border-r border-blue-100 truncate max-w-[50px]">{ex.date}</td>
                  <td className="py-0.5 px-1 font-semibold border-r border-blue-100 truncate max-w-[80px]">{ex.subject}</td>
                  <td className="py-0.5 px-1 text-right">{ex.room}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border-t border-blue-900 pt-1 flex justify-between items-end text-[6.5px]">
            <span className="text-[6px] text-slate-500">Hall Schedule Verified</span>
            <div className="text-center">
              <div className="w-14 border-b border-blue-900 mb-0.5"></div>
              <span className="text-[6px] font-bold text-blue-900">Controller of Exams</span>
            </div>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------------------
    // 7. ADMIT CARD (EDUCATION)
    // -------------------------------------------------------------------------
    if (slug === "school-admit-card" || sub === "admit-card") {
      return (
        <div className="w-full h-full bg-white text-blue-950 p-3 flex flex-col justify-between text-[8px] select-none rounded-xl relative overflow-hidden shadow-xs border-2 border-blue-900 font-sans">
          <div className="text-center border-b border-blue-900 pb-1">
            <h4 className="font-black text-[9px] uppercase tracking-tight truncate">
              {data.instituteName || "Rajuk Uttara Model College"}
            </h4>
            <span className="inline-block bg-blue-900 text-white font-bold text-[6px] px-2 py-0.2 rounded mt-0.5">
              OFFICIAL ADMIT CARD - 2026
            </span>
          </div>

          <div className="grid grid-cols-12 gap-1.5 my-1 bg-blue-50/60 p-1.5 rounded border border-blue-200">
            <div className="col-span-8 space-y-0.5 text-[6.5px]">
              <div><strong>Name:</strong> {data.studentName || "Mohammad Fahim"}</div>
              <div><strong>Roll:</strong> {data.rollNo || "105"} | <strong>Reg:</strong> {data.regNo || "98432"}</div>
              <div className="truncate"><strong>Class:</strong> {data.classGrade || "Class 10 (Sci)"}</div>
              <div className="truncate"><strong>Center:</strong> {data.examCenter || "Main Campus Hall"}</div>
            </div>
            <div className="col-span-4 flex items-center justify-center">
              <div className="w-11 h-13 border border-dashed border-blue-400 bg-white rounded flex flex-col items-center justify-center text-[5.5px] text-blue-400 text-center leading-tight">
                <span>Photo</span>
                <span>35x45</span>
              </div>
            </div>
          </div>

          <p className="text-[5.5px] text-slate-500 italic truncate">
            1. Must carry admit card to examination hall daily. Unfair means strictly prohibited.
          </p>

          <div className="border-t border-blue-900 pt-1 flex justify-between items-end text-[6.5px]">
            <span className="text-[6px] text-slate-500">Candidate: Signed</span>
            <div className="text-center">
              <div className="w-14 border-b border-blue-900 mb-0.5"></div>
              <span className="text-[6px] font-bold text-blue-900">Principal Seal</span>
            </div>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------------------
    // 8. ACADEMIC CERTIFICATE / TESTIMONIAL (EDUCATION)
    // -------------------------------------------------------------------------
    if (sub === "certificate" || slug === "student-transfer-certificate" || slug === "school-character-certificate") {
      return (
        <div className="w-full h-full bg-[#FCFBF7] text-blue-950 p-3 flex flex-col justify-between text-[8px] select-none rounded-xl relative overflow-hidden shadow-xs border-4 border-double border-blue-900 font-serif">
          <div className="text-center border-b border-blue-900/60 pb-1">
            <div className="text-[8px] text-amber-700 block mb-0.5">~ ⚜️ ~</div>
            <h4 className="font-black text-[9px] uppercase tracking-tight truncate">
              {data.instituteName || "Viqarunnisa Noon School & College"}
            </h4>
            <span className="inline-block bg-blue-950 text-white font-sans font-bold text-[6px] px-2 py-0.2 rounded-full border border-amber-400 mt-0.5">
              {data.examTitle || "TRANSFER CERTIFICATE"}
            </span>
          </div>

          <div className="text-[6.5px] leading-relaxed text-slate-800 text-justify my-1 space-y-1 font-serif px-1">
            <p>
              This is to certify that <strong>{data.studentName || "Student Name"}</strong>, Roll No: <strong>{data.rollNo || "08"}</strong>, 
              was a bona fide student in <strong>{data.classGrade || "Class 8"}</strong>.
            </p>
            <p className="text-slate-600 italic line-clamp-2">
              &ldquo;{data.remarks || "Bears an exemplary moral character and satisfied all institutional requirements."}&rdquo;
            </p>
          </div>

          <div className="border-t border-blue-900/60 pt-1 flex justify-between items-end text-[6.5px] font-sans">
            <span className="text-[6px] text-slate-500">Date: {data.date || "11/11/26"}</span>
            <div className="text-center">
              <div className="w-14 border-b border-blue-900 mb-0.5"></div>
              <span className="text-[6px] font-bold text-blue-900 font-serif">Head of Institution</span>
            </div>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------------------
    // 9. STUDENT ID CARD (EDUCATION)
    // -------------------------------------------------------------------------
    if (slug === "student-id-card-layout" || sub === "id-card") {
      return (
        <div className="w-full h-full bg-white text-blue-950 p-2.5 flex flex-col justify-between text-[8px] select-none rounded-xl relative overflow-hidden shadow-xs border-2 border-blue-900 font-sans">
          <div className="bg-blue-900 text-white text-center py-1 -mx-2.5 -mt-2.5 mb-1">
            <h4 className="font-black text-[8px] uppercase tracking-tight truncate px-1">
              {data.instituteName || "Notre Dame College, Dhaka"}
            </h4>
            <span className="text-[6px] text-blue-200">STUDENT IDENTITY CARD</span>
          </div>

          <div className="flex gap-2 items-center my-0.5">
            <div className="w-10 h-12 border border-blue-900 rounded bg-blue-50 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-blue-700" />
            </div>
            <div className="text-[6.5px] space-y-0.5 flex-1 min-w-0">
              <p className="font-bold text-[8px] text-slate-900 truncate">{data.studentName || "Tahmidur Rahman"}</p>
              <p className="text-blue-800 font-bold">{data.rollNo || "NDC-2026-8902"}</p>
              <p className="text-slate-600 truncate">{data.classGrade || "Class 11 (Sci)"}</p>
              <p className="text-red-700 font-bold">Blood: {data.bloodGroup || "O+ (Pos)"}</p>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-1 flex justify-between items-end text-[6px]">
            <span className="font-mono text-[6px] text-slate-500">|||||||||||||||</span>
            <div className="text-center">
              <div className="w-10 border-b border-blue-900 mb-0.5"></div>
              <span className="font-bold text-blue-900">Principal</span>
            </div>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------------------
    // 10. ACADEMIC MARKSHEET (ROYAL ACADEMIC)
    // -------------------------------------------------------------------------
    if (isSchool || sub === "marksheet" || Array.isArray(data.subjects)) {
      const subjList = Array.isArray(data.subjects) && data.subjects.length > 0 ? data.subjects : [];
      return (
        <div className="w-full h-full bg-white text-blue-950 p-3 flex flex-col justify-between text-[8px] select-none rounded-xl relative overflow-hidden shadow-xs border-4 border-double border-blue-950 font-serif">
          <div className="text-center border-b-2 border-blue-950 pb-1">
            <div className="w-5 h-5 mx-auto rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold mb-0.5 shadow-xs">
              <GraduationCap className="w-3 h-3" />
            </div>
            <h4 className="font-black text-[9px] text-blue-950 uppercase tracking-tight truncate">
              {data.instituteName || "DHAKA IDEAL MODEL SCHOOL"}
            </h4>
            <span className="inline-block bg-blue-950 text-white font-bold text-[6px] px-2 py-0.2 rounded-full border border-amber-400 mt-0.5">
              {data.examTitle || "ANNUAL RESULT MARKSHEET - 2026"}
            </span>
          </div>

          <div className="bg-blue-50/70 border border-blue-200 rounded px-1.5 py-0.5 flex justify-between text-[6.5px] my-0.5 font-sans">
            <span><strong>Name:</strong> {data.studentName?.split(" ")[0] || "Sadia"}</span>
            <span><strong>Roll:</strong> {data.rollNo || "12"}</span>
            <span><strong>Class:</strong> {data.classGrade || "Class 9"}</span>
          </div>

          <table className="w-full text-[6.5px] border-collapse my-0.5 font-sans">
            <thead>
              <tr className="bg-blue-950 text-white font-bold uppercase">
                <th className="text-left py-0.5 px-1">Subject</th>
                <th className="text-center py-0.5">Marks</th>
                <th className="text-right py-0.5 px-1">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {subjList.length > 0 ? (
                subjList.slice(0, 3).map((s: any, sIdx: number) => (
                  <tr key={sIdx}>
                    <td className="py-0.5 px-1 font-semibold truncate max-w-[90px]">{s.name}</td>
                    <td className="text-center font-bold">{s.marks}</td>
                    <td className="text-right px-1 font-black text-blue-900">{s.grade || "A+"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-0.5 px-1 font-semibold">General Subject</td>
                  <td className="text-center font-bold">88</td>
                  <td className="text-right px-1 font-black text-blue-900">A+</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="border-t-2 border-blue-950 pt-1 flex justify-between items-center text-[6.5px]">
            <span className="bg-emerald-100 text-emerald-950 font-black px-1.5 py-0.5 rounded text-[7px] border border-emerald-300">
              RESULT: PASSED (GPA 5.00)
            </span>
            <div className="text-right">
              <div className="w-14 border-b border-blue-900 mb-0.5"></div>
              <span className="text-[5.5px] font-bold text-blue-900">Headmaster's Seal</span>
            </div>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------------------
    // 11. THERMAL DOT-MATRIX POS (80mm) - RESTAURANT & SUPERMARKET
    // -------------------------------------------------------------------------
    if (themeId === "thermal-pos" || isPos) {
      return (
        <div className="w-full h-full bg-[#FAFAFA] text-zinc-900 p-3 flex flex-col justify-between text-[7.5px] font-mono select-none rounded-lg relative overflow-hidden shadow-xs border border-dashed border-zinc-400">
          <div className="text-center border-b border-dashed border-zinc-400 pb-1.5">
            <span className="text-[6px] text-zinc-400 tracking-widest block mb-0.5">/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\</span>
            <p className="font-black text-[9.5px] uppercase tracking-wider truncate">
              {data.businessName || "DHABA & BBQ NIGHTS"}
            </p>
            <p className="text-[6.5px] text-zinc-500 truncate">{data.phone || "Dhanmondi, Dhaka"}</p>
            <div className="bg-black text-white text-[7px] font-black px-2 py-0.5 rounded-none inline-block mt-1">
              TOKEN: [ {data.invoiceNumber?.slice(-2) || "48"} ]
            </div>
          </div>

          <div className="my-1 space-y-0.5 text-[7px]">
            <div className="flex justify-between border-b border-dashed border-zinc-300 pb-0.5 font-bold">
              <span>ITEM</span>
              <span>QTY</span>
              <span>TOTAL</span>
            </div>
            {itemsList.slice(0, 3).map((it: any, iIdx: number) => (
              <div key={iIdx} className="flex justify-between">
                <span className="truncate max-w-[85px]">{it.name.toUpperCase()}</span>
                <span>x{it.quantity || 1}</span>
                <span className="font-bold">{(Number(it.price) * (Number(it.quantity) || 1)).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="border-t-2 border-dashed border-zinc-500 pt-1 text-[7px]">
            <div className="flex justify-between font-black text-[8.5px] text-black">
              <span>NET PAYABLE:</span>
              <span>৳ {computedTotal.toLocaleString()}</span>
            </div>
            <p className="text-center text-[5.5px] text-zinc-500 tracking-widest mt-1">
              ||| || |||||| |||| ||| |||||||
            </p>
            <p className="text-center text-[5.5px] text-zinc-400">Thank you for your visit!</p>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------------------
    // 12. LUXURY BOUTIQUE & JEWELRY - HAUTE COUTURE SERIF & GOLD
    // -------------------------------------------------------------------------
    if (themeId === "luxury-gold" || slug.includes("boutique") || slug.includes("jewelry")) {
      return (
        <div className="w-full h-full bg-[#FAF7F2] text-stone-900 p-3.5 flex flex-col justify-between text-[8px] select-none rounded-xl relative overflow-hidden shadow-xs border-2 border-amber-300 font-serif">
          <div className="text-center border-y border-amber-300/80 py-1.5 my-0.5">
            <span className="text-[8px] text-amber-700 block">~ ⚜️ ~</span>
            <h4 className="font-normal text-[10px] tracking-widest uppercase italic text-stone-900 truncate">
              {data.businessName || "MAISHA LUXURY BOUTIQUE"}
            </h4>
            <p className="text-[6.5px] text-stone-500 uppercase tracking-widest font-sans mt-0.5 truncate">
              {data.tagline || "Haute Couture & Jamdani Saree"}
            </p>
          </div>

          <div className="flex justify-between items-center text-[7px] py-1 border-b border-stone-200 font-sans">
            <div>
              <span className="text-stone-400 uppercase text-[6px]">VOUCHER:</span>{" "}
              <strong className="text-stone-800">{data.invoiceNumber || "MLB-8821"}</strong>
            </div>
            <span className="text-amber-800 font-serif italic text-[7.5px] truncate max-w-[80px]">
              {data.address?.split(",")[0] || "Banani, Dhaka"}
            </span>
          </div>

          <div className="my-1 space-y-1 font-sans text-[7px]">
            <div className="flex justify-between border-b border-amber-200 pb-0.5 font-serif uppercase text-[6.5px] text-amber-900 tracking-wider">
              <span>Article Description</span>
              <span>Amount</span>
            </div>
            {itemsList.slice(0, 2).map((it: any, iIdx: number) => (
              <div key={iIdx} className="flex justify-between py-0.5 border-b border-stone-100">
                <span className="truncate max-w-[120px] font-medium">{it.name}</span>
                <span className="font-bold">৳ {(Number(it.price) * (Number(it.quantity) || 1)).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-amber-300/80 pt-1 flex justify-between items-end font-sans">
            <div>
              <span className="bg-amber-100 text-amber-900 font-serif text-[7px] px-2 py-0.5 rounded-full border border-amber-300 inline-block">
                Authentic Craft
              </span>
            </div>
            <div className="text-right">
              <span className="text-[6.5px] text-stone-500 block">TOTAL PAYABLE</span>
              <span className="font-serif text-[9.5px] font-bold text-amber-900">৳ {computedTotal.toLocaleString()} BDT</span>
            </div>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------------------
    // 13. CYBER TECH & WARRANTY SLATE (ELECTRONICS & GADGETS)
    // -------------------------------------------------------------------------
    if (themeId === "cyber-slate" || slug.includes("warranty") || slug.includes("electronics")) {
      return (
        <div className="w-full h-full bg-white text-slate-900 p-3.5 flex flex-col justify-between text-[8px] select-none rounded-xl relative overflow-hidden shadow-xs border-2 border-cyan-500/50 font-sans">
          <div className="bg-slate-900 text-white p-2 rounded-lg flex justify-between items-start border-b-2 border-cyan-500">
            <div>
              <h4 className="font-black text-[9px] text-cyan-400 uppercase tracking-tight truncate max-w-[120px]">
                {data.businessName || "NEXUS GADGETS & TECH"}
              </h4>
              <p className="text-[6px] text-slate-400 truncate max-w-[120px]">{data.address || "Multiplan Center, Dhaka"}</p>
            </div>
            <div className="text-right">
              <span className="bg-cyan-600 text-slate-950 font-mono font-black text-[6.5px] px-1 py-0.2 rounded-xs">
                WARRANTY INVOICE
              </span>
              <p className="text-[5.5px] font-mono text-cyan-300 mt-0.5">SN-VERIFIED</p>
            </div>
          </div>

          <div className="bg-cyan-50/60 border border-cyan-200 rounded px-2 py-1 flex justify-between items-center my-1 text-[6.5px] font-mono">
            <span><strong>INV:</strong> {data.invoiceNumber || "NX-2026-90412"}</span>
            <span className="text-cyan-800 font-bold">|||||||||||||||||||||||</span>
          </div>

          <table className="w-full text-[6.5px] border-collapse my-0.5">
            <thead>
              <tr className="bg-slate-900 text-cyan-400 uppercase font-mono">
                <th className="text-left py-0.5 px-1">Hardware Model</th>
                <th className="text-center py-0.5">Qty</th>
                <th className="text-right py-0.5 px-1">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {itemsList.slice(0, 2).map((it: any, iIdx: number) => (
                <tr key={iIdx}>
                  <td className="py-0.5 px-1 font-semibold truncate max-w-[100px]">{it.name}</td>
                  <td className="text-center font-mono">{it.quantity || 1}</td>
                  <td className="text-right px-1 font-bold">{(Number(it.price) * (Number(it.quantity) || 1)).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border-t border-cyan-500/50 pt-1 flex justify-between items-end text-[6.5px]">
            <span className="text-[5.5px] bg-red-50 text-red-700 border border-red-200 px-1 py-0.2 rounded font-bold">
              ⚠️ VOID IF SEAL BROKEN
            </span>
            <div className="text-right">
              <span className="font-mono font-black text-cyan-800">৳ {computedTotal.toLocaleString()} (PAID)</span>
            </div>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------------------
    // 14. DEFAULT SHOP & BUSINESS CASH MEMO / CHALAN / QUOTATION (DYNAMIC)
    // -------------------------------------------------------------------------
    return (
      <div className="w-full h-full bg-white text-slate-800 p-3.5 flex flex-col justify-between text-[8px] select-none rounded-xl relative overflow-hidden shadow-xs border border-slate-200 font-sans">
        <div className="flex justify-between items-start pb-2 border-b-2 border-blue-600">
          <div className="max-w-[65%]">
            <h4 className="font-black text-[9.5px] text-slate-900 uppercase tracking-tight truncate">
              {data.businessName || "STYLIST FASHION BD"}
            </h4>
            <p className="text-[6.5px] text-slate-500 font-medium truncate">{data.tagline || "Quality Products Delivered"}</p>
            <p className="text-[6.5px] text-slate-400 truncate">{data.phone || "+880 1712-345678"}</p>
          </div>
          <div className="text-right">
            <span className="inline-block bg-blue-600 text-white font-black text-[7px] px-1.5 py-0.5 uppercase rounded-xs">
              {sub === "chalan" ? "CHALAN" : sub === "quotation" ? "QUOTATION" : sub === "receipt" ? "MONEY RECEIPT" : "CASH MEMO"}
            </span>
            <p className="text-[6.5px] font-bold text-slate-700 mt-0.5">{data.invoiceNumber || "INV-2026-089"}</p>
            <span className="text-[6px] text-blue-600 font-semibold truncate block max-w-[80px]">
              {data.courierPartner ? `Courier: ${data.courierPartner}` : "freedocforge.com"}
            </span>
          </div>
        </div>

        <div className="bg-blue-50/50 border border-blue-100 rounded px-2 py-1 flex justify-between items-center my-1 text-[7px]">
          <div className="truncate max-w-[120px]">
            <span className="text-[6px] uppercase font-bold text-slate-400 block">BILLED TO:</span>
            <span className="font-bold text-slate-900 truncate block">
              {data.customerName || "Customer Name"}
            </span>
          </div>
          <span className="bg-amber-100 text-amber-800 font-black px-1.5 py-0.5 rounded text-[6.5px] shrink-0">
            {sub === "chalan" ? "CHALAN SLIP" : `NET: ৳ ${computedTotal.toLocaleString()}`}
          </span>
        </div>

        <table className="w-full text-[6.5px] border-collapse my-0.5">
          <thead>
            <tr className="border-b border-slate-300 font-extrabold text-slate-500 uppercase bg-slate-50">
              <th className="text-left py-0.5 px-1">{sub === "chalan" ? "Item Description" : "Product / Service"}</th>
              <th className="text-center py-0.5">Qty</th>
              <th className="text-right py-0.5 px-1">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {itemsList.slice(0, 2).map((it: any, iIdx: number) => (
              <tr key={iIdx}>
                <td className="py-0.5 px-1 font-semibold truncate max-w-[110px]">{it.name}</td>
                <td className="text-center">{it.quantity || 1}</td>
                <td className="text-right px-1 font-bold">
                  {(Number(it.price) * (Number(it.quantity) || 1)).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="border-t border-slate-200 pt-1 flex justify-between items-end text-[7px]">
          <div>
            <span className="text-[6px] text-slate-400 block">freedocforge.com</span>
            <span className="font-extrabold text-blue-700">
              {sub === "chalan" ? "Goods Dispatched" : `Net Due: ৳ ${computedTotal.toLocaleString()}`}
            </span>
          </div>
          <div className="text-center">
            <div className="w-16 border-b border-slate-400 mb-0.5"></div>
            <span className="text-[6px] font-bold text-slate-700">Authorized Signature</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`relative w-full aspect-[210/240] rounded-2xl p-2.5 sm:p-3 flex flex-col justify-between overflow-hidden group/thumb transition-all duration-300 hover:shadow-xl bg-gradient-to-b ${theme.cardOuterBg} border ${theme.cardBorder} ${theme.cardGlow}`}
    >
      {/* Floating Category & Archetype Icon */}
      <div className="absolute top-2 left-3 z-10 drop-shadow-sm">
        {renderFloatingIcon()}
      </div>

      {/* Floating Theme Label Pill (Top Right) */}
      <div className="absolute top-2.5 right-3 z-10">
        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs text-slate-700 dark:text-slate-300 shadow-2xs border border-slate-200/60 dark:border-slate-700">
          {theme.icon} {lang === "bn" ? theme.nameBn.split("(")[0] : theme.nameEn.split(" ")[0]}
        </span>
      </div>

      {/* Visual Rendered Document Sheet */}
      <div className="w-full h-full pt-3.5 flex items-center justify-center pointer-events-none">
        <div className="w-full h-full shadow-md rounded-xl overflow-hidden ring-1 ring-slate-900/5">
          {renderVisualSnapshot()}
        </div>
      </div>

      {/* Interactive ThemeForest-Style Hover Overlay */}
      <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2.5 p-4 text-center z-20">
        <span className="text-white text-xs sm:text-sm font-bold leading-tight max-w-[200px] line-clamp-2 drop-shadow-sm">
          {title}
        </span>

        <span className="text-[10px] text-blue-200 font-mono">
          {theme.nameEn}
        </span>

        <div className="flex flex-col sm:flex-row items-center gap-2 mt-1 w-full max-w-[210px]">
          {onQuickView && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(template);
              }}
              className="w-full flex items-center justify-center gap-1.5 bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold py-2 px-3 rounded-xl shadow-md transition cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-blue-600" />
              <span>{lang === "bn" ? "প্রিভিউ দেখুন" : "Live Preview"}</span>
            </button>
          )}

          <Link
            href={`/templates/${template.slug}`}
            className="w-full flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-3 rounded-xl shadow-md transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{lang === "bn" ? "এডিট করুন" : "Edit & Print"}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
