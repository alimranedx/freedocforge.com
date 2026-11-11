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
} from "lucide-react";
import { TemplateDefinition } from "@/lib/templates";

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
  const isPos = template.paperSize === "POS_80MM";
  const sub = template.subCategory || "";
  const slug = template.slug;

  const title = lang === "bn" && template.locales?.bn?.title ? template.locales.bn.title : template.title;
  const data = template.defaultData || {};

  // ThemeForest-style floating icon configuration
  const categoryIcon = isShop ? (
    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-emerald-500 text-white flex items-center justify-center shadow-md ring-4 ring-white dark:ring-slate-900">
      <ShoppingBag className="w-4 h-4" />
    </div>
  ) : isSchool ? (
    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md ring-4 ring-white dark:ring-slate-900">
      <GraduationCap className="w-4 h-4" />
    </div>
  ) : (
    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-red-600 text-white flex items-center justify-center shadow-md ring-4 ring-white dark:ring-slate-900">
      <Stethoscope className="w-4 h-4" />
    </div>
  );

  // Render ThemeForest-Style Visual Template Snapshot
  const renderVisualSnapshot = () => {
    // -------------------------------------------------------------------------
    // 1. MEDICAL PRESCRIPTION (Rx Pad)
    // -------------------------------------------------------------------------
    if (isMedical && (sub === "prescription" || slug.startsWith("doctor-") || slug.startsWith("dental-") || slug.startsWith("eye-") || slug.startsWith("pediatric-") || slug.startsWith("physiotherapy-"))) {
      const isDental = slug.includes("dental");
      const isEye = slug.includes("eye");
      const isPediatric = slug.includes("pediatric");

      return (
        <div className="w-full h-full bg-white text-slate-800 p-3.5 flex flex-col justify-between text-[8px] select-none rounded-xl relative overflow-hidden shadow-xs border border-slate-200">
          {/* Top Doctor Header */}
          <div className="border-b-2 border-rose-600 pb-2 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                <p className="font-extrabold text-[9.5px] text-rose-900 truncate max-w-[150px]">
                  {data.doctorName || "Dr. Farhana Yasmin, MBBS, FCPS"}
                </p>
              </div>
              <p className="text-[7px] text-slate-600 font-semibold mt-0.5 truncate max-w-[140px]">
                {data.degrees || "Specialist in Internal Medicine"}
              </p>
              <span className="text-[6.5px] bg-rose-50 text-rose-700 font-bold px-1 py-0.2 rounded mt-0.5 inline-block">
                {data.regNo || "BMDC Reg No: A-54321"}
              </span>
            </div>
            <div className="text-right">
              <span className="bg-rose-600 text-white font-black text-[7px] px-1.5 py-0.5 rounded uppercase tracking-wider">
                {isDental ? "DENTAL Rx" : isEye ? "VISION Rx" : isPediatric ? "CHILD Rx" : "DOCTOR Rx"}
              </span>
              <p className="text-[6.5px] text-slate-500 font-medium mt-1 truncate max-w-[80px]">
                {data.hospitalName || "Care Center"}
              </p>
            </div>
          </div>

          {/* Patient Bar */}
          <div className="bg-slate-50 border border-slate-200 rounded px-2 py-1 flex justify-between text-[7px] my-1.5 font-medium">
            <span><strong>Pt:</strong> {data.patientName?.split(" ")[0] || "Patient"} ({data.patientAge || "45y"})</span>
            <span><strong>Sex:</strong> {data.patientGender || "Male"}</span>
            <span><strong>BP:</strong> {data.bp || "120/80"}</span>
            <span><strong>Date:</strong> 11/11/26</span>
          </div>

          {/* Body: Two Column Medical Layout */}
          <div className="grid grid-cols-12 gap-2 flex-1 my-1">
            {/* Left Clinical Column */}
            <div className="col-span-4 border-r border-slate-200 pr-1.5 space-y-1.5">
              <div>
                <span className="text-[6.5px] font-black text-rose-800 uppercase block">C/C:</span>
                <p className="text-[6.5px] text-slate-600 leading-tight">Fever, cough & cold (3d)</p>
              </div>
              <div>
                <span className="text-[6.5px] font-black text-rose-800 uppercase block">Diagnosis:</span>
                <p className="text-[6.5px] font-bold text-slate-800 bg-rose-50/60 p-0.5 rounded">
                  {data.diagnosis || "Acute Infection"}
                </p>
              </div>
              <div>
                <span className="text-[6.5px] font-black text-rose-800 uppercase block">Tests (Inv):</span>
                <p className="text-[6px] text-slate-500 leading-tight">CBC, Chest X-Ray</p>
              </div>
            </div>

            {/* Right Rx Column */}
            <div className="col-span-8 pl-1 space-y-1.5">
              <div className="flex items-center gap-1 border-b border-slate-100 pb-0.5">
                <span className="font-serif font-black text-rose-700 text-base leading-none">℞</span>
                <span className="text-[6.5px] uppercase font-bold text-slate-400 tracking-wider">Advised Medications</span>
              </div>
              <div className="space-y-1">
                <div className="bg-rose-50/60 border border-rose-100 p-1 rounded">
                  <div className="flex justify-between font-bold text-[7.5px] text-slate-900">
                    <span>1. Tab. Napa Extra 665mg</span>
                    <span className="text-rose-700 text-[6.5px]">5 Days</span>
                  </div>
                  <p className="text-[6.5px] text-slate-600 font-medium">১ + ০ + ১ (খাবারের পর)</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-1 rounded">
                  <div className="flex justify-between font-bold text-[7.5px] text-slate-900">
                    <span>2. Tab. Fexo 120mg</span>
                    <span className="text-slate-500 text-[6.5px]">7 Days</span>
                  </div>
                  <p className="text-[6.5px] text-slate-600 font-medium">০ + ০ + ১ (রাতে ঘুমানোর আগে)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer with Doctor Stamp */}
          <div className="border-t border-slate-200 pt-1.5 flex justify-between items-end">
            <div>
              <p className="text-[6px] text-slate-400">freedocforge.com • 100% Free Rx Pad</p>
              <p className="text-[5.5px] text-slate-400">Digital Printable Health Record</p>
            </div>
            <div className="text-center">
              <div className="w-16 border-b border-rose-500 mb-0.5"></div>
              <span className="text-[6.5px] font-bold text-slate-800 block">Doctor's Seal & Sign</span>
            </div>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------------------
    // 2. MEDICAL SERIAL TOKEN / DISCHARGE / DIAGNOSTIC RECEIPT
    // -------------------------------------------------------------------------
    if (isMedical && (sub === "serial" || sub === "discharge" || sub === "receipt" || slug.startsWith("medical-") || slug.startsWith("hospital-") || slug.startsWith("radiology-"))) {
      const isSerial = sub === "serial" || slug.includes("appointment");
      return (
        <div className="w-full h-full bg-white text-slate-800 p-3.5 flex flex-col justify-between text-[8px] select-none rounded-xl relative overflow-hidden shadow-xs border border-slate-200">
          <div className="text-center border-b-2 border-rose-500 pb-1.5">
            <h4 className="font-extrabold text-[9.5px] text-rose-900 uppercase tracking-tight truncate">
              {data.hospitalName || "Square Care Specialist Chambers"}
            </h4>
            <p className="text-[6.5px] text-slate-500">{data.tagline || "Dedicated Healthcare & Diagnostic Care"}</p>
          </div>

          <div className="my-auto py-3 px-2 bg-gradient-to-b from-rose-50 to-white rounded-xl border border-rose-200 text-center shadow-xs">
            <span className="text-[7px] font-black uppercase tracking-widest text-rose-600 block">
              {isSerial ? "PATIENT APPOINTMENT TOKEN" : "DISCHARGE SUMMARY CERTIFICATE"}
            </span>
            <span className="font-black text-2xl text-rose-800 block my-0.5 tracking-tight">
              {data.serialNo || data.regNo || "SL - 18"}
            </span>
            <span className="text-[8px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded-full border border-rose-100 inline-block shadow-2xs">
              {data.appointmentTime || "Estimated Time: 6:45 PM"}
            </span>
          </div>

          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 space-y-1 text-[7px]">
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Physician:</span>
              <span className="font-bold text-slate-800">{data.doctorName?.split(",")[0] || "Prof. Dr. M. A. Rashid"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Patient:</span>
              <span className="font-semibold text-slate-800">{data.patientName || "Nurul Islam (58y/M)"}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-0.5 font-bold text-emerald-700">
              <span>Status:</span>
              <span>{data.paymentStatus || "PAID IN FULL (৳ 1,500)"}</span>
            </div>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------------------
    // 3. SCHOOL MARKSHEET / PROGRESS REPORT
    // -------------------------------------------------------------------------
    if (isSchool && (sub === "marksheet" || slug.startsWith("school-result-") || slug.startsWith("coaching-") || slug.startsWith("madrasah-"))) {
      return (
        <div className="w-full h-full bg-white text-slate-800 p-3.5 flex flex-col justify-between text-[8px] select-none rounded-xl relative overflow-hidden shadow-xs border border-slate-200">
          {/* Institute Header */}
          <div className="text-center border-b-2 border-blue-900 pb-1.5">
            <div className="w-6 h-6 mx-auto rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold mb-0.5 shadow-2xs">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
            <h4 className="font-black text-[9.5px] text-blue-950 uppercase tracking-tight truncate">
              {data.instituteName || "DHAKA IDEAL ACADEMIC CARE"}
            </h4>
            <span className="inline-block bg-blue-900 text-white font-extrabold text-[6.5px] px-2 py-0.2 rounded mt-0.5">
              {data.examTitle || "ACADEMIC PROGRESS MARKSHEET"}
            </span>
          </div>

          {/* Student Profile Bar */}
          <div className="bg-blue-50/70 border border-blue-200 rounded px-2 py-1 flex justify-between text-[7px] my-1">
            <span><strong>Name:</strong> {data.studentName?.split(" ")[0] || "Sadia Rahman"}</span>
            <span><strong>Roll:</strong> {data.rollNo || "12"}</span>
            <span><strong>Class:</strong> 9 (Sci)</span>
          </div>

          {/* Subjects Table */}
          <table className="w-full text-[6.5px] border-collapse my-0.5">
            <thead>
              <tr className="border-b border-slate-300 font-extrabold text-slate-600 uppercase bg-slate-50">
                <th className="text-left py-0.5 px-1">Subject</th>
                <th className="text-center py-0.5">Full</th>
                <th className="text-center py-0.5">Marks</th>
                <th className="text-right py-0.5 px-1">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-0.5 px-1 font-semibold">Bangla 1st & 2nd</td>
                <td className="text-center text-slate-400">100</td>
                <td className="text-center font-bold">88</td>
                <td className="text-right px-1 font-black text-blue-700">A+</td>
              </tr>
              <tr>
                <td className="py-0.5 px-1 font-semibold">English Language</td>
                <td className="text-center text-slate-400">100</td>
                <td className="text-center font-bold">82</td>
                <td className="text-right px-1 font-black text-blue-700">A+</td>
              </tr>
              <tr>
                <td className="py-0.5 px-1 font-semibold">General Mathematics</td>
                <td className="text-center text-slate-400">100</td>
                <td className="text-center font-bold">95</td>
                <td className="text-right px-1 font-black text-blue-700">A+</td>
              </tr>
              <tr>
                <td className="py-0.5 px-1 font-semibold">Physics & Chemistry</td>
                <td className="text-center text-slate-400">100</td>
                <td className="text-center font-bold">85</td>
                <td className="text-right px-1 font-black text-blue-700">A+</td>
              </tr>
            </tbody>
          </table>

          {/* GPA Total Ribbon & Stamp */}
          <div className="border-t-2 border-slate-900 pt-1 flex justify-between items-center text-[7px]">
            <span className="bg-emerald-100 text-emerald-900 font-black px-2 py-0.5 rounded text-[7.5px] border border-emerald-200">
              GPA: 5.00 (A+)
            </span>
            <div className="text-right">
              <div className="w-16 border-b border-slate-400 mb-0.5"></div>
              <span className="text-[6px] font-bold text-slate-700">Principal Signature</span>
            </div>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------------------
    // 4. SCHOOL ROUTINE / TIMETABLE / ADMIT / TC
    // -------------------------------------------------------------------------
    if (isSchool && (sub === "routine" || sub === "admit-card" || sub === "certificate" || sub === "fees" || sub === "id-card" || slug.startsWith("school-") || slug.startsWith("student-"))) {
      return (
        <div className="w-full h-full bg-white text-slate-800 p-3.5 flex flex-col justify-between text-[8px] select-none rounded-xl relative overflow-hidden shadow-xs border border-slate-200">
          <div className="text-center border-b-2 border-blue-600 pb-1.5">
            <h4 className="font-black text-[9.5px] text-blue-900 uppercase tracking-tight truncate">
              {data.instituteName || "Uttara Model School & College"}
            </h4>
            <p className="text-[6.5px] text-slate-500">{data.tagline || "Discipline, Knowledge & Character"}</p>
            <span className="inline-block bg-blue-50 text-blue-700 font-bold text-[6.5px] px-2 py-0.2 rounded mt-0.5 border border-blue-200">
              {data.examTitle || data.classGrade || "Weekly Timetable Routine"}
            </span>
          </div>

          {/* Routine Grid Mockup */}
          <div className="my-1 border border-slate-200 rounded overflow-hidden text-[6.5px]">
            <div className="grid grid-cols-4 bg-blue-100/80 font-black text-blue-900 text-center py-1 border-b border-slate-200">
              <span>Day</span>
              <span>1st Period</span>
              <span>2nd Period</span>
              <span>3rd Period</span>
            </div>
            <div className="divide-y divide-slate-100 text-center">
              <div className="grid grid-cols-4 py-0.5 font-medium">
                <span className="font-bold text-blue-900 bg-blue-50/50">Sat</span>
                <span>Bangla</span>
                <span>English</span>
                <span>Math</span>
              </div>
              <div className="grid grid-cols-4 py-0.5 font-medium bg-slate-50/40">
                <span className="font-bold text-blue-900 bg-blue-50/50">Sun</span>
                <span>Math</span>
                <span>Physics</span>
                <span>Chemistry</span>
              </div>
              <div className="grid grid-cols-4 py-0.5 font-medium">
                <span className="font-bold text-blue-900 bg-blue-50/50">Mon</span>
                <span>English</span>
                <span>ICT Lab</span>
                <span>Biology</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-1 flex justify-between items-end text-[6.5px]">
            <span className="text-slate-400">Academic Session: 2026</span>
            <div className="text-center">
              <div className="w-14 border-b border-slate-400 mb-0.5"></div>
              <span className="font-bold text-slate-700">Official Seal</span>
            </div>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------------------
    // 5. THERMAL POS RECEIPT (80mm)
    // -------------------------------------------------------------------------
    if (isPos || sub === "pos" || slug.includes("pos") || slug.includes("receipt")) {
      return (
        <div className="w-full h-full bg-slate-50 text-slate-800 p-3.5 flex flex-col justify-between text-[8px] font-mono select-none rounded-xl relative overflow-hidden shadow-xs border border-dashed border-slate-300">
          <div className="text-center border-b border-dashed border-slate-400 pb-1.5">
            <p className="font-black text-[9.5px] uppercase tracking-wider">{data.businessName || "Dhaba & BBQ Nights"}</p>
            <p className="text-[6.5px] text-slate-500">{data.phone || "+880 1788-990011"}</p>
            <p className="text-[6px] text-slate-400 mt-0.5">80mm POS Roll • {data.invoiceNumber || "BILL-5491"}</p>
          </div>

          <div className="my-1 space-y-1 text-[7px]">
            <div className="flex justify-between border-b border-slate-200 pb-0.5 font-bold">
              <span>Item</span>
              <span>Total</span>
            </div>
            <div className="flex justify-between">
              <span className="truncate max-w-[110px]">Chicken Biryani (x2)</span>
              <span>760</span>
            </div>
            <div className="flex justify-between">
              <span className="truncate max-w-[110px]">Reshmi Kebab (x1)</span>
              <span>420</span>
            </div>
            <div className="flex justify-between">
              <span className="truncate max-w-[110px]">Butter Naan (x3)</span>
              <span>180</span>
            </div>
          </div>

          <div className="border-t-2 border-dashed border-slate-400 pt-1 space-y-0.5 text-[7px]">
            <div className="flex justify-between font-semibold text-slate-600">
              <span>Subtotal:</span>
              <span>1,360</span>
            </div>
            <div className="flex justify-between font-black text-[8.5px] text-slate-900 border-t border-slate-200 pt-0.5">
              <span>NET PAYABLE:</span>
              <span>৳ 1,420</span>
            </div>
            <p className="text-center text-[6px] text-slate-400 pt-1">
              *** 100% FREE THERMAL RECEIPT ***
            </p>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------------------
    // 6. DEFAULT GENERAL BUSINESS CASH MEMO & INVOICE
    // -------------------------------------------------------------------------
    const isBoutique = slug.includes("boutique");
    const isWarranty = slug.includes("warranty");

    return (
      <div className="w-full h-full bg-white text-slate-800 p-3.5 flex flex-col justify-between text-[8px] select-none rounded-xl relative overflow-hidden shadow-xs border border-slate-200">
        {/* Header */}
        <div className={`flex justify-between items-start pb-2 border-b-2 ${isBoutique ? "border-amber-700" : isWarranty ? "border-cyan-600" : "border-slate-900"}`}>
          <div className="max-w-[65%]">
            <h4 className={`font-black text-[9.5px] uppercase tracking-tight truncate ${isBoutique ? "text-amber-900" : isWarranty ? "text-cyan-900" : "text-slate-900"}`}>
              {data.businessName || "STYLIST FASHION BD"}
            </h4>
            <p className="text-[6.5px] text-slate-500 font-medium truncate">{data.tagline || "Quality Products Delivered"}</p>
            <p className="text-[6.5px] text-slate-400">{data.phone || "+880 1712-345678"}</p>
          </div>
          <div className="text-right">
            <span className={`inline-block text-white font-black text-[7px] px-1.5 py-0.5 uppercase rounded-xs ${isBoutique ? "bg-amber-800" : isWarranty ? "bg-cyan-700" : "bg-slate-900"}`}>
              {sub === "chalan" ? "CHALAN" : sub === "quotation" ? "QUOTATION" : "CASH MEMO"}
            </span>
            <p className="text-[6.5px] font-bold text-slate-700 mt-0.5">{data.invoiceNumber || "INV-2026-089"}</p>
            <p className="text-[6px] text-slate-400">11/11/2026</p>
          </div>
        </div>

        {/* Customer Box */}
        <div className="bg-slate-50 border border-slate-200 rounded px-2 py-1 flex justify-between items-center my-1 text-[7px]">
          <div>
            <span className="text-[6px] uppercase font-bold text-slate-400 block">BILLED TO:</span>
            <span className="font-bold text-slate-900">{data.customerName?.split(" ")[0] || "Md. Tanvir Ahmed"}</span>
          </div>
          <span className="bg-amber-100 text-amber-800 font-black px-1.5 py-0.5 rounded text-[6.5px]">
            COD: ৳ 3,470
          </span>
        </div>

        {/* Items Mini Table */}
        <table className="w-full text-[6.5px] border-collapse my-0.5">
          <thead>
            <tr className="border-b border-slate-300 font-extrabold text-slate-500 uppercase bg-slate-50">
              <th className="text-left py-0.5 px-1">Item Description</th>
              <th className="text-center py-0.5">Qty</th>
              <th className="text-right py-0.5 px-1">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="py-0.5 px-1 font-semibold truncate max-w-[110px]">Premium Cotton Shirt</td>
              <td className="text-center">2</td>
              <td className="text-right px-1 font-bold">2,500</td>
            </tr>
            <tr>
              <td className="py-0.5 px-1 font-semibold truncate max-w-[110px]">Slim Fit Chino Pant</td>
              <td className="text-center">1</td>
              <td className="text-right px-1 font-bold">1,450</td>
            </tr>
          </tbody>
        </table>

        {/* Footer Calculation & Signature */}
        <div className="border-t border-slate-200 pt-1 flex justify-between items-end text-[7px]">
          <div>
            <span className="text-[6px] text-slate-400 block">freedocforge.com</span>
            <span className="font-extrabold text-blue-700">Net Due: ৳ 3,470</span>
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
    <div className="relative w-full aspect-[210/240] rounded-2xl p-2.5 sm:p-3 flex flex-col justify-between overflow-hidden group/thumb transition-all duration-300 hover:shadow-xl bg-gradient-to-b from-slate-100/90 to-slate-200/90 dark:from-slate-800/80 dark:to-slate-900/80 border border-slate-200/90 dark:border-slate-800">
      {/* Floating Category Icon (ThemeForest style) */}
      <div className="absolute top-2 left-3 z-10 drop-shadow-sm">
        {categoryIcon}
      </div>

      {/* Visual Rendered Document Sheet */}
      <div className="w-full h-full pt-3 flex items-center justify-center pointer-events-none">
        <div className="w-full h-full shadow-md rounded-xl overflow-hidden ring-1 ring-slate-900/5">
          {renderVisualSnapshot()}
        </div>
      </div>

      {/* Interactive ThemeForest-Style Hover Overlay */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2.5 p-4 text-center z-20">
        <span className="text-white text-xs sm:text-sm font-bold leading-tight max-w-[200px] line-clamp-2 drop-shadow-sm">
          {title}
        </span>

        <div className="flex flex-col sm:flex-row items-center gap-2 mt-2 w-full max-w-[210px]">
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
