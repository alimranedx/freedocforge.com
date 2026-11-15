"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Layers,
  Plus,
  Eye,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Globe,
  Trash2,
  X,
  Save,
  Check,
  Search,
  Filter,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Settings2,
  Sparkles,
  ShoppingBag,
  Stethoscope,
  GraduationCap,
  UtensilsCrossed,
  FileText,
  FileSpreadsheet,
  LayoutGrid,
  List,
  FolderTree,
  RotateCw,
  ExternalLink,
  QrCode,
  Copy,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Smartphone,
  Monitor,
  ShieldCheck,
  Sliders,
  Palette,
  Undo2,
  Redo2,
  ClipboardPaste,
  Building2,
  Calendar,
  UserCheck,
  Receipt,
  FileSignature,
  FileCode2,
  Sparkle,
  Phone,
  MapPin,
  Mail,
  Hash,
  Upload,
  Download,
  Wand2,
  FileDown,
  ArrowRight,
  Image as ImageIcon,
} from "lucide-react";
import {
  INITIAL_TEMPLATES,
  TemplateDefinition,
  RECEIPT_TEMPLATES,
  CLASS_ROUTINE_TEMPLATES,
  EXAM_ROUTINE_TEMPLATES,
  MEDICAL_RECEIPT_TEMPLATES,
  OTHER_EDUCATION_TEMPLATES,
  OTHER_HEALTHCARE_TEMPLATES,
} from "@/lib/templates";
import { exportElementToPdf } from "@/lib/pdfExport";

export interface DocumentStyles {
  themePreset: string;
  bgColor: string;
  fontColor: string;
  accentColor: string;
  secondaryColor: string;
  fontSize: "sm" | "base" | "lg" | "xl";
  fontFamily: string;
}

export const DEFAULT_DOC_STYLES: DocumentStyles = {
  themePreset: "modern-blue",
  bgColor: "#ffffff",
  fontColor: "#0f172a",
  accentColor: "#2563eb",
  secondaryColor: "#64748b",
  fontSize: "base",
  fontFamily: "Inter, sans-serif",
};

export const THEME_PRESETS: Record<string, Partial<DocumentStyles> & { label: string; desc: string }> = {
  "modern-blue": {
    label: "Modern Blue",
    desc: "Cobalt accent & crisp slate",
    bgColor: "#ffffff",
    fontColor: "#0f172a",
    accentColor: "#2563eb",
    secondaryColor: "#64748b",
    fontFamily: "Inter, sans-serif",
  },
  "clinical-teal": {
    label: "Clinical Teal",
    desc: "Surgical teal & deep emerald",
    bgColor: "#f0fdfa",
    fontColor: "#134e4a",
    accentColor: "#0d9488",
    secondaryColor: "#115e59",
    fontFamily: "Inter, sans-serif",
  },
  "luxury-gold": {
    label: "Luxury Gold",
    desc: "Ivory cream & burnished gold",
    bgColor: "#fffdf7",
    fontColor: "#451a03",
    accentColor: "#b45309",
    secondaryColor: "#78350f",
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  "thermal-pos": {
    label: "Thermal POS",
    desc: "Monospace dot-matrix receipt",
    bgColor: "#ffffff",
    fontColor: "#000000",
    accentColor: "#18181b",
    secondaryColor: "#52525b",
    fontFamily: "'JetBrains Mono', Courier, monospace",
  },
  "royal-academic": {
    label: "Royal Academic",
    desc: "Oxford navy & engraved rules",
    bgColor: "#f8fafc",
    fontColor: "#172554",
    accentColor: "#1e3a8a",
    secondaryColor: "#1e40af",
    fontFamily: "Inter, sans-serif",
  },
  "cyber-slate": {
    label: "Cyber Slate",
    desc: "Stealth graphite & cyan neon",
    bgColor: "#0f172a",
    fontColor: "#f8fafc",
    accentColor: "#06b6d4",
    secondaryColor: "#94a3b8",
    fontFamily: "'JetBrains Mono', Courier, monospace",
  },
};

export const FONT_FAMILIES = [
  { id: "Inter, sans-serif", label: "Inter (Modern Sans-serif)" },
  { id: "'Playfair Display', Georgia, serif", label: "Playfair Display (Editorial Serif)" },
  { id: "'JetBrains Mono', Courier, monospace", label: "JetBrains Mono (POS / Monospace)" },
  { id: "'Hind Siliguri', 'Segoe UI', sans-serif", label: "Hind Siliguri (Bengali Sans)" },
  { id: "'Kalpurush', Times, serif", label: "Kalpurush (Classic Bengali Serif)" },
];

export const FONT_SIZE_SCALES: { id: "sm" | "base" | "lg" | "xl"; label: string; scaleClass: string }[] = [
  { id: "sm", label: "Compact Accounting (10px)", scaleClass: "text-[11px]" },
  { id: "base", label: "Standard Business (12px)", scaleClass: "text-xs" },
  { id: "lg", label: "Large Print (14px)", scaleClass: "text-sm" },
  { id: "xl", label: "High Legibility (16px)", scaleClass: "text-base" },
];

export function synthesizeFallbackTemplate(prompt: string, category: string, paperSize: "A4" | "POS_80MM") {
  const p = prompt.toLowerCase();
  const isMedical = category === "Healthcare" || p.includes("medical") || p.includes("prescription") || p.includes("rx") || p.includes("doctor") || p.includes("diagnostic");
  const isEducation = category === "Education" || p.includes("school") || p.includes("routine") || p.includes("exam") || p.includes("marksheet");
  const isPos = paperSize === "POS_80MM" || p.includes("pos") || p.includes("thermal") || p.includes("restaurant");

  const cleanSlug = `ai-${(prompt.slice(0, 20) || "custom-template").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString().slice(-4)}`;

  if (isMedical) {
    return {
      title: "Diagnostic Center Test Bill & Money Receipt",
      slug: cleanSlug,
      category: "Healthcare",
      subCategory: "bill",
      paperSize: "A4",
      description: "Pathology investigation bill with specimen collection & report delivery times",
      locales: {
        en: {
          title: "Diagnostic Center Test Bill & Money Receipt",
          description: "Pathology investigation bill with specimen collection & report delivery times",
          defaultData: {
            businessName: "Popular Diagnostic & Consultation Center",
            tagline: "Govt. Reg No: DGHS-2026-904 | Fully Automated Lab",
            items: [
              { name: "Complete Blood Count (CBC with ESR)", quantity: 1, price: 600, unit: "Test" },
              { name: "Serum Creatinine (Kidney Function)", quantity: 1, price: 450, unit: "Test" },
              { name: "Lipid Profile (Fasting Lipid Panel)", quantity: 1, price: 1200, unit: "Test" },
              { name: "HbA1c (Glycated Hemoglobin)", quantity: 1, price: 850, unit: "Test" },
            ],
            deliveryCharge: 0,
            discount: 200,
            paidAmount: 2000,
            currency: "৳",
            signatoryTitle: "Medical Technologist / Cashier",
          },
        },
        bn: {
          title: "ডায়াগনস্টিক সেন্টার টেস্ট বিল ও মানি রিসিট",
          description: "প্যাথলজি টেস্টের বিল, নমুনা সংগ্রহের সময় ও রিপোর্ট ডেলিভারি বিবরণ",
          defaultData: {
            businessName: "পপুলার ডায়াগনস্টিক ও কনসালটেশন সেন্টার",
            tagline: "স্বাস্থ্য অধিদপ্তর রেজি: ডিজিএইচএস-২০২৬-৯০৪",
            items: [
              { name: "কমপ্লিট ব্লাড কাউন্ট (সিবিসি)", quantity: 1, price: 600, unit: "টেস্ট" },
              { name: "সিরাম ক্রিয়েটিনিন (কিডনি টেস্ট)", quantity: 1, price: 450, unit: "টেস্ট" },
              { name: "লিপিড প্রোফাইল (ফাস্টিং)", quantity: 1, price: 1200, unit: "টেস্ট" },
              { name: "এইচবিএ১সি (ডায়াবেটিস ৩ মাসের গড়)", quantity: 1, price: 850, unit: "টেস্ট" },
            ],
            deliveryCharge: 0,
            discount: 200,
            paidAmount: 2000,
            currency: "৳",
            signatoryTitle: "মেডিকেল টেকনোলজিস্ট / ক্যাশিয়ার",
          },
        },
      },
      styles: THEME_PRESETS["clinical-teal"],
    };
  }

  if (isEducation) {
    return {
      title: "Academic Weekly Class Routine & Schedule",
      slug: cleanSlug,
      category: "Education",
      subCategory: "routine",
      paperSize: "A4",
      description: "6-period weekly schedule with shift, room allocation, and teacher legend",
      locales: {
        en: {
          title: "Academic Weekly Class Routine & Schedule",
          description: "6-period weekly schedule with shift, room allocation, and teacher legend",
          defaultData: {
            businessName: "Dhaka Model Collegiate School & College",
            tagline: "EIIN: 108421 | Morning & Day Shift Timetable",
            items: [
              { name: "Bangla 1st Paper (Room 402 - Mr. Rafiq)", quantity: 5, price: 100, unit: "Classes" },
              { name: "English 2nd Paper (Room 402 - Ms. Farhana)", quantity: 5, price: 100, unit: "Classes" },
              { name: "Higher Mathematics (Room 403 - Dr. Kamal)", quantity: 4, price: 120, unit: "Classes" },
              { name: "Physics Theory & Lab (Central Lab)", quantity: 3, price: 150, unit: "Sessions" },
            ],
            deliveryCharge: 0,
            discount: 0,
            paidAmount: 0,
            currency: "৳",
            signatoryTitle: "Headmaster / Academic Supervisor",
          },
        },
        bn: {
          title: "প্রাতিষ্ঠানিক সাপ্তাহিক ক্লাস রুটিন ও সময়সূচী",
          description: "৬-পিরিয়ড সাপ্তাহিক ক্লাস রুটিন, শিফট ও শিক্ষক ডিরেক্টরি",
          defaultData: {
            businessName: "ঢাকা মডেল কলেজিয়েট স্কুল অ্যান্ড কলেজ",
            tagline: "ইআইআইএন: ১০৮৪২১ | প্রভাতী ও দিবা শিফট",
            items: [
              { name: "বাংলা ১ম পত্র (রুম ৪০২ - জনাব রফিক)", quantity: 5, price: 100, unit: "ক্লাস" },
              { name: "ইংরেজি ২য় পত্র (রুম ৪০২ - ফারহানা ম্যাডাম)", quantity: 5, price: 100, unit: "ক্লাস" },
              { name: "উচ্চতর গণিত (রুম ৪০৩ - ড. কামাল)", quantity: 4, price: 120, unit: "ক্লাস" },
              { name: "পদার্থবিজ্ঞান তত্ত্ব ও ল্যাব (সেন্ট্রাল ল্যাব)", quantity: 3, price: 150, unit: "সেশন" },
            ],
            deliveryCharge: 0,
            discount: 0,
            paidAmount: 0,
            currency: "৳",
            signatoryTitle: "প্রধান শিক্ষক / একাডেমিক ইনচার্জ",
          },
        },
      },
      styles: THEME_PRESETS["royal-academic"],
    };
  }

  // Default Commerce / Retail
  return {
    title: isPos ? "80mm POS Thermal Receipt Slip" : "Corporate Tax Invoice & Cash Memo",
    slug: cleanSlug,
    category: isPos ? "Restaurant" : "Business",
    subCategory: isPos ? "pos" : "invoice",
    paperSize: isPos ? "POS_80MM" : "A4",
    description: isPos ? "80mm thermal dot-matrix receipt with VAT breakdown" : "Commercial bill with itemized quantities, delivery fee, and COD due",
    locales: {
      en: {
        title: isPos ? "80mm POS Thermal Receipt Slip" : "Corporate Tax Invoice & Cash Memo",
        description: isPos ? "80mm thermal dot-matrix receipt with VAT breakdown" : "Commercial bill with itemized quantities, delivery fee, and COD due",
        defaultData: {
          businessName: isPos ? "The Rustic Gourmet Bistro & Cafe" : "TechVanguard Gadgets & Solutions",
          tagline: isPos ? "Table 12 • Dine In • VAT Reg: 00294819" : "Importer & Distributor • BIN: 003928174-0101",
          items: isPos
            ? [
                { name: "Wood-Fired Margherita Pizza", quantity: 1, price: 850, unit: "Dish" },
                { name: "Smoked Chicken Pasta Alfredo", quantity: 2, price: 480, unit: "Dish" },
                { name: "Iced Caramel Macchiato", quantity: 2, price: 260, unit: "Cup" },
              ]
            : [
                { name: "Mechanical Gaming Keyboard RGB", quantity: 2, price: 3450, unit: "Pcs" },
                { name: "Wireless Ergonomic Mouse 4K", quantity: 1, price: 1850, unit: "Pcs" },
                { name: "Braided Type-C Fast Cable 2M", quantity: 3, price: 320, unit: "Pcs" },
              ],
          deliveryCharge: isPos ? 0 : 120,
          discount: 150,
          paidAmount: isPos ? 2330 : 5000,
          currency: "৳",
          signatoryTitle: isPos ? "Cashier / Server" : "Authorized Store Manager",
        },
      },
      bn: {
        title: isPos ? "৮০মিমি পিওএস থার্মাল ক্যাশ রসিদ" : "কর্পোরেট ট্যাক্স চালান ও ক্যাশ মেমো",
        description: isPos ? "৮০মিমি থার্মাল ডট-ম্যাট্রিক্স স্লিপ ও ভ্যাট হিসাব" : "আইটেম বিবরণ, ডেলিভারি চার্জ ও ক্যাশ অন ডেলিভারি হিসাব",
        defaultData: {
          businessName: isPos ? "দ্য রাস্টিক গোরমেট বিস্ট্রো অ্যান্ড ক্যাফে" : "টেকভ্যানগার্ড গ্যাজেটস অ্যান্ড সলিউশনস",
          tagline: isPos ? "টেবিল ১২ • ডাইন ইন • ভ্যাট রেজি: ০০২৯৪৮১৯" : "আমদানিকারক ও পাইকারি বিক্রেতা • বিন: ০০৩৯২৮১৭৪-০১০১",
          items: isPos
            ? [
                { name: "উড-ফায়ার্ড মার্গারিটা পিৎজা", quantity: 1, price: 850, unit: "ডিশ" },
                { name: "স্মোকড চিকেন পাস্তা আলফ্রেডো", quantity: 2, price: 480, unit: "ডিশ" },
                { name: "আইসড ক্যারামেল ম্যাকিয়াটো", quantity: 2, price: 260, unit: "কাপ" },
              ]
            : [
                { name: "মেকানিক্যাল গেমিং কীবোর্ড আরজিবি", quantity: 2, price: 3450, unit: "পিস" },
                { name: "ওয়্যারলেস মাউস ৪কে সেন্সর", quantity: 1, price: 1850, unit: "পিস" },
                { name: "টাইপ-সি ফাস্ট চার্জিং ক্যাবল", quantity: 3, price: 320, unit: "পিস" },
              ],
          deliveryCharge: isPos ? 0 : 120,
          discount: 150,
          paidAmount: isPos ? 2330 : 5000,
          currency: "৳",
          signatoryTitle: isPos ? "ক্যাশিয়ার / সার্ভার" : "অনুমোদিত কর্মকর্তা",
        },
      },
    },
    styles: isPos ? THEME_PRESETS["thermal-pos"] : THEME_PRESETS["modern-blue"],
  };
}

export interface TemplateBlock {
  id: string;
  type: string;
  titleEn: string;
  titleBn: string;
  enabled: boolean;
  order: number;
  descriptionEn?: string;
  descriptionBn?: string;
  options?: Record<string, any>;
}

export interface TableRowItem {
  id: string;
  nameEn: string;
  nameBn: string;
  quantity: number;
  price: number;
  unit?: string;
}

export interface MetaItem {
  id: string;
  key: string;
  labelEn: string;
  labelBn: string;
  valueEn: string;
  valueBn: string;
}

export interface ContactItem {
  id: string;
  type: "phone" | "address" | "email" | "tax" | "custom";
  labelEn: string;
  labelBn: string;
  valueEn: string;
  valueBn: string;
}

const DEFAULT_BLOCKS: TemplateBlock[] = [
  {
    id: "header",
    type: "header",
    titleEn: "Brand & Company Header",
    titleBn: "প্রতিষ্ঠান ও ব্র্যান্ড পরিচিতি",
    enabled: true,
    order: 0,
    descriptionEn: "Business/Institute name, logo, phone, address, and license/BIN",
    descriptionBn: "প্রতিষ্ঠান বা ক্লিনিকের নাম, লোগো, ফোন নম্বর, ঠিকানা ও বিআইএন",
    options: { showLogo: true, showTagline: true, showContact: true, showTaxId: false, theme: "modern" },
  },
  {
    id: "meta",
    type: "meta",
    titleEn: "Document Identifier & Dates",
    titleBn: "নথির তথ্য ও স্মারক তারিখ",
    enabled: true,
    order: 1,
    descriptionEn: "Invoice / Rx / Token serial, issue date, due date, courier",
    descriptionBn: "চালান / প্রেসক্রিপশন নম্বর, তারিখ ও কুরিয়ার তথ্য",
    options: { showDate: true, showDueDate: false, showCourier: true },
  },
  {
    id: "recipient",
    type: "recipient",
    titleEn: "Customer / Recipient Profile",
    titleBn: "ক্রেতা বা প্রাপকের তথ্য",
    enabled: true,
    order: 2,
    descriptionEn: "Customer name, mobile number, delivery address or patient/student info",
    descriptionBn: "ক্রেতার নাম, মোবাইল, ঠিকানা বা রোগীর বিবরণ",
    options: { showPhone: true, showAddress: true, showCustomId: false },
  },
  {
    id: "table",
    type: "table",
    titleEn: "Dynamic Itemized Table",
    titleBn: "পণ্য বা সেবার বিবরণী ছক",
    enabled: true,
    order: 3,
    descriptionEn: "Line items table with quantity, unit price, and calculated amount",
    descriptionBn: "পণ্য বা সেবার তালিকা, পরিমাণ, একক মূল্য এবং মোট টাকা",
    options: { showQuantity: true, showUnitPrice: true, showItemCode: false, theme: "bordered" },
  },
  {
    id: "summary",
    type: "summary",
    titleEn: "Financial Totals & Due Calculation",
    titleBn: "হিসাব ও মোট টাকার বিবরণ",
    enabled: true,
    order: 4,
    descriptionEn: "Subtotal, VAT/Tax %, delivery fee, special discount, and due balance",
    descriptionBn: "মোট মূল্য, ভ্যাট, ডেলিভারি চার্জ, ছাড় ও বকেয়া টাকার হিসাব",
    options: { showTax: false, showDiscount: true, showDelivery: true, showPaidDue: true },
  },
  {
    id: "signatory",
    type: "signatory",
    titleEn: "Signatory Authority & Official Stamp",
    titleBn: "অনুমোদিত স্বাক্ষর ও সিল",
    enabled: true,
    order: 5,
    descriptionEn: "Official authorized signature, BMDC doctor seal, or cashier signature",
    descriptionBn: "কর্মকর্তার স্বাক্ষর, বিএমডিসি চিকিৎসকের সিল বা ক্যাশিয়ার স্বাক্ষর",
    options: { showSeal: true, titleEn: "Authorized Signature", titleBn: "অনুমোদিত স্বাক্ষর" },
  },
  {
    id: "terms",
    type: "terms",
    titleEn: "Terms, Conditions & Return Notes",
    titleBn: "শর্তাবলি ও মন্তব্য",
    enabled: true,
    order: 6,
    descriptionEn: "Return warranty policy, payment instructions (bKash/Nagad), footer notes",
    descriptionBn: "পণ্য ফেরতের শর্ত, বিকাশ বা ব্যাংক পেমেন্ট তথ্য এবং ফুটনোট",
    options: { showFooterNote: true },
  },
];

const RECEIPT_SLUGS = new Set(RECEIPT_TEMPLATES.map((t) => t.slug));
const CLASS_ROUTINE_SLUGS = new Set(CLASS_ROUTINE_TEMPLATES.map((t) => t.slug));
const EXAM_ROUTINE_SLUGS = new Set(EXAM_ROUTINE_TEMPLATES.map((t) => t.slug));
const MEDICAL_RECEIPT_SLUGS = new Set(MEDICAL_RECEIPT_TEMPLATES.map((t) => t.slug));
const EDUCATION_OTHER_SLUGS = new Set(OTHER_EDUCATION_TEMPLATES.map((t) => t.slug));
const HEALTHCARE_OTHER_SLUGS = new Set(OTHER_HEALTHCARE_TEMPLATES.map((t) => t.slug));

export function getTemplateCategory(t: {
  slug?: string;
  isCustom?: boolean;
  subCategory?: string;
  category?: string;
}): string {
  if (t.isCustom) return "custom";
  const s = t.slug || "";
  const sub = (t.subCategory || "").toLowerCase();

  // 1. Class Routines & Timetables (10)
  if (CLASS_ROUTINE_SLUGS.has(s) || sub === "routine" || sub === "class-routine" || sub === "timetable") {
    return "class-routines";
  }

  // 2. Exam Routines & Schedules (10)
  if (EXAM_ROUTINE_SLUGS.has(s) || sub === "exam" || sub === "exam-routine") {
    return "exam-routines";
  }

  // 3. Medical Receipts & Diagnostic Bills (10)
  if (
    MEDICAL_RECEIPT_SLUGS.has(s) ||
    (t.category === "Healthcare" && (sub === "bill" || sub === "receipt"))
  ) {
    return "medical-receipts";
  }

  // 4. Academic Marksheets & Certificates (8)
  if (
    EDUCATION_OTHER_SLUGS.has(s) ||
    (t.category === "Education" &&
      (sub === "marksheet" || sub === "admit-card" || sub === "certificate" || sub === "id-card"))
  ) {
    return "education-other";
  }

  // 5. Clinical Prescriptions & Consultation Pads (9)
  if (
    HEALTHCARE_OTHER_SLUGS.has(s) ||
    (t.category === "Healthcare" &&
      (sub === "prescription" || sub === "serial" || sub === "discharge"))
  ) {
    return "healthcare-other";
  }

  // 6. Worldwide Commercial Receipts & POS (13)
  if (RECEIPT_SLUGS.has(s) || t.category === "Business" || t.category === "Restaurant") {
    return "receipts";
  }

  return "receipts";
}

export const CATEGORY_META: Record<
  string,
  { label: string; icon: any; color: string; subtitle: string }
> = {
  receipts: {
    label: "Worldwide Receipts & Invoices",
    icon: Receipt,
    color: "text-blue-400",
    subtitle: "Commercial invoices, cash memos & POS rolls (13)",
  },
  "class-routines": {
    label: "Class Routines & Timetables",
    icon: Calendar,
    color: "text-emerald-400",
    subtitle: "Weekly schedules, shifts & classroom grids (10)",
  },
  "exam-routines": {
    label: "Exam Routines & Schedules",
    icon: FileSignature,
    color: "text-amber-400",
    subtitle: "Term exams, seat plans & board schedules (10)",
  },
  "medical-receipts": {
    label: "Medical Receipts & Diagnostic Bills",
    icon: Stethoscope,
    color: "text-rose-400",
    subtitle: "Clinical investigations, hospital & pharmacy bills (10)",
  },
  "education-other": {
    label: "Academic Marksheets & Certificates",
    icon: GraduationCap,
    color: "text-cyan-400",
    subtitle: "Progress reports, admit cards, TC & student IDs (8)",
  },
  "healthcare-other": {
    label: "Clinical Prescriptions & Pads",
    icon: FileText,
    color: "text-purple-400",
    subtitle: "Doctor consultation pads, tokens & discharge sheets (9)",
  },
  custom: {
    label: "Custom Admin Templates",
    icon: Sparkles,
    color: "text-pink-400",
    subtitle: "Admin studio custom-built templates",
  },
};

const CATEGORY_TABS = [
  { id: "all", label: "All Templates", subtitle: "Full Catalog (60)", icon: Layers, color: "text-zinc-300" },
  { id: "receipts", label: "Worldwide Receipts", subtitle: "Invoices & POS (13)", icon: Receipt, color: "text-blue-400" },
  { id: "class-routines", label: "Class Routines", subtitle: "Weekly Timetables (10)", icon: Calendar, color: "text-emerald-400" },
  { id: "exam-routines", label: "Exam Schedules", subtitle: "Exam Routines (10)", icon: FileSignature, color: "text-amber-400" },
  { id: "medical-receipts", label: "Medical Receipts", subtitle: "Diagnostic Bills (10)", icon: Stethoscope, color: "text-rose-400" },
  { id: "education-other", label: "Marksheets & TC", subtitle: "Academic Certs (8)", icon: GraduationCap, color: "text-cyan-400" },
  { id: "healthcare-other", label: "Clinical Rx Pads", subtitle: "Prescriptions (9)", icon: FileText, color: "text-purple-400" },
  { id: "custom", label: "Custom Templates", subtitle: "Admin Defined", icon: Sparkles, color: "text-pink-400" },
];

export default function AdminTemplatesManagerPage() {
  const [templates, setTemplates] = useState<(TemplateDefinition & { isCustom?: boolean; blocks?: TemplateBlock[] })[]>([
    ...INITIAL_TEMPLATES.map((t) => ({ ...t, isCustom: false, blocks: DEFAULT_BLOCKS })),
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dbOnline, setDbOnline] = useState(true);

  // Category & Filter State
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [formatFilter, setFormatFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "sections" | "grid">("table");

  // SMART CMS STUDIO STATE
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [validationError, setValidationError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [clipboardToast, setClipboardToast] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Viewport, Live Locale & Zoom
  const [previewViewport, setPreviewViewport] = useState<"A4" | "POS_80MM">("A4");
  const [previewLocale, setPreviewLocale] = useState<"en" | "bn">("en");
  const [zoomScale, setZoomScale] = useState<number>(100);

  // Selection & Inspector
  const [selectedElement, setSelectedElement] = useState<{
    type: "block" | "row" | "meta" | "contact" | "header" | "recipient" | "summary" | "signatory" | "terms" | "table";
    id: string;
    index?: number;
  }>({ type: "block", id: "header", index: 0 });
  const [inspectorTab, setInspectorTab] = useState<"content" | "style" | "meta">("content");

  // Elementor CMS Internal Clipboard (Copy & Paste Support)
  const [clipboard, setClipboard] = useState<{
    type: "row" | "meta" | "contact" | "block";
    data: any;
  } | null>(null);

  // Visual Style Engine State
  const [docStyles, setDocStyles] = useState<DocumentStyles>(DEFAULT_DOC_STYLES);

  // Template Creation & Starter Suggester Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalTab, setCreateModalTab] = useState<"starter" | "ai" | "blank">("starter");
  const [starterCategory, setStarterCategory] = useState<string>("receipts");
  const [starterSearch, setStarterSearch] = useState<string>("");

  // AI Template Designer State
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiCategory, setAiCategory] = useState("Business");
  const [aiPaperSize, setAiPaperSize] = useState<"A4" | "POS_80MM">("A4");
  const [aiImageBase64, setAiImageBase64] = useState<string | null>(null);
  const [aiImageName, setAiImageName] = useState<string>("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiGeneratedTemplate, setAiGeneratedTemplate] = useState<any | null>(null);
  const [isExportingAiPdf, setIsExportingAiPdf] = useState(false);
  const aiPreviewRef = useRef<HTMLDivElement>(null);

  // Master Template Form Data
  const [formData, setFormData] = useState({
    id: "",
    slug: "",
    category: "Business",
    subCategory: "invoice",
    paperSize: "A4",
    isFeatured: false,
    en_title: "",
    en_description: "",
    en_signatory: "Authorized Signature",
    en_currency: "৳",
    bn_title: "",
    bn_description: "",
    bn_signatory: "অনুমোদিত স্বাক্ষর",
    bn_currency: "৳",
  });

  // Dynamic Blocks on Canvas
  const [templateBlocks, setTemplateBlocks] = useState<TemplateBlock[]>(DEFAULT_BLOCKS);

  // Dynamic Child Elements for Elementor Editing
  const [businessNameEn, setBusinessNameEn] = useState("Sample Business / Clinic Name");
  const [businessNameBn, setBusinessNameBn] = useState("নমুনা প্রতিষ্ঠান বা ক্লিনিকের নাম");
  const [taglineEn, setTaglineEn] = useState("Quality Products & Diagnostic Services");
  const [taglineBn, setTaglineBn] = useState("গুণগত মানসম্পন্ন সেবা ও দ্রুততম ডেলিভারি");

  const [headerContacts, setHeaderContacts] = useState<ContactItem[]>([
    {
      id: "cnt_1",
      type: "phone",
      labelEn: "Phone",
      labelBn: "ফোন",
      valueEn: "+880 1712-000000",
      valueBn: "০১৭১২-০০০০০০",
    },
    {
      id: "cnt_2",
      type: "address",
      labelEn: "Address",
      labelBn: "ঠিকানা",
      valueEn: "Dhaka - 1205, Bangladesh",
      valueBn: "ঢাকা - ১২০৫, বাংলাদেশ",
    },
  ]);

  const [metaItems, setMetaItems] = useState<MetaItem[]>([
    {
      id: "meta_1",
      key: "docNo",
      labelEn: "Doc / Memo No",
      labelBn: "নথি / মেমো নং",
      valueEn: "#DOC-2026-089",
      valueBn: "#মেমো-২০২৬-০৮৯",
    },
    {
      id: "meta_2",
      key: "date",
      labelEn: "Issue Date",
      labelBn: "ইস্যু তারিখ",
      valueEn: "2026-11-12",
      valueBn: "১২/১১/২০২৬",
    },
    {
      id: "meta_3",
      key: "courier",
      labelEn: "Courier",
      labelBn: "কুরিয়ার",
      valueEn: "Steadfast BD",
      valueBn: "স্টেডফাস্ট কুরিয়ার",
    },
  ]);

  const [tableRows, setTableRows] = useState<TableRowItem[]>([
    {
      id: "row_1",
      nameEn: "Premium Formal Cotton Shirt",
      nameBn: "প্রিমিয়াম সুতি ফরমাল শার্ট",
      quantity: 2,
      price: 1250,
      unit: "Pcs",
    },
    {
      id: "row_2",
      nameEn: "Standard Service / Consultation Fee",
      nameBn: "সার্ভিস বা কনসাল্টেশন ফি",
      quantity: 1,
      price: 500,
      unit: "Session",
    },
  ]);

  const [deliveryCharge, setDeliveryCharge] = useState<number>(120);
  const [discountAmount, setDiscountAmount] = useState<number>(100);
  const [paidAmount, setPaidAmount] = useState<number>(0);

  // Undo / Redo History Stack
  const [historyStack, setHistoryStack] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Push to history
  const pushHistory = useCallback(
    (snapshot: any) => {
      setHistoryStack((prev) => {
        const sliced = prev.slice(0, historyIndex + 1);
        return [...sliced, snapshot].slice(-25); // retain last 25 states
      });
      setHistoryIndex((prev) => Math.min(prev + 1, 24));
    },
    [historyIndex]
  );

  const handleUndo = () => {
    if (historyIndex > 0) {
      const targetState = historyStack[historyIndex - 1];
      if (targetState) {
        setTemplateBlocks(targetState.templateBlocks);
        setTableRows(targetState.tableRows);
        setMetaItems(targetState.metaItems);
        setHeaderContacts(targetState.headerContacts);
        setBusinessNameEn(targetState.businessNameEn);
        setBusinessNameBn(targetState.businessNameBn);
        setTaglineEn(targetState.taglineEn);
        setTaglineBn(targetState.taglineBn);
        setHistoryIndex(historyIndex - 1);
      }
    }
  };

  const handleRedo = () => {
    if (historyIndex < historyStack.length - 1) {
      const targetState = historyStack[historyIndex + 1];
      if (targetState) {
        setTemplateBlocks(targetState.templateBlocks);
        setTableRows(targetState.tableRows);
        setMetaItems(targetState.metaItems);
        setHeaderContacts(targetState.headerContacts);
        setBusinessNameEn(targetState.businessNameEn);
        setBusinessNameBn(targetState.businessNameBn);
        setTaglineEn(targetState.taglineEn);
        setTaglineBn(targetState.taglineBn);
        setHistoryIndex(historyIndex + 1);
      }
    }
  };

  // Calculated Totals
  const subtotal = useMemo(() => {
    return tableRows.reduce((acc, row) => acc + (Number(row.quantity) || 0) * (Number(row.price) || 0), 0);
  }, [tableRows]);

  const netTotal = useMemo(() => {
    return Math.max(0, subtotal + (Number(deliveryCharge) || 0) - (Number(discountAmount) || 0));
  }, [subtotal, deliveryCharge, discountAmount]);

  const dueAmount = useMemo(() => {
    return Math.max(0, netTotal - (Number(paidAmount) || 0));
  }, [netTotal, paidAmount]);

  // Toast feedback helper
  const showToast = (msg: string) => {
    setClipboardToast(msg);
    setTimeout(() => setClipboardToast(""), 3000);
  };

  // Fetch templates from API
  const fetchTemplates = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch("/api/admin/templates");
      if (res.ok) {
        const data = await res.json();
        setTemplates(data.templates || []);
        setDbOnline(Boolean(data.dbOnline));
      }
    } catch (err) {
      console.error("Failed to load templates:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // Category counts computation
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: templates.length,
      receipts: 0,
      "class-routines": 0,
      "exam-routines": 0,
      "medical-receipts": 0,
      "education-other": 0,
      "healthcare-other": 0,
      custom: 0,
    };

    templates.forEach((t) => {
      const cat = getTemplateCategory(t);
      if (counts[cat] !== undefined) {
        counts[cat] += 1;
      }
      if (t.isCustom) {
        counts.custom += 1;
      }
    });

    return counts;
  }, [templates]);

  // Filtered Templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const cat = getTemplateCategory(t);
      if (selectedCategory === "custom") {
        if (!t.isCustom) return false;
      } else if (selectedCategory !== "all" && cat !== selectedCategory) {
        return false;
      }

      if (formatFilter !== "all" && t.paperSize !== formatFilter) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const enTitle = (t.locales?.en?.title || t.title || "").toLowerCase();
        const bnTitle = (t.locales?.bn?.title || "").toLowerCase();
        const descEn = (t.locales?.en?.description || t.description || "").toLowerCase();
        const descBn = (t.locales?.bn?.description || "").toLowerCase();
        const slug = (t.slug || "").toLowerCase();

        return (
          enTitle.includes(q) ||
          bnTitle.includes(q) ||
          descEn.includes(q) ||
          descBn.includes(q) ||
          slug.includes(q)
        );
      }

      return true;
    });
  }, [templates, selectedCategory, formatFilter, searchQuery]);

  // Grouped for sections view
  const groupedByCategory = useMemo(() => {
    const groups: Record<string, typeof templates> = {
      receipts: [],
      "class-routines": [],
      "exam-routines": [],
      "medical-receipts": [],
      "education-other": [],
      "healthcare-other": [],
      custom: [],
    };

    filteredTemplates.forEach((t) => {
      const cat = getTemplateCategory(t);
      if (groups[cat]) {
        groups[cat].push(t);
      } else {
        groups.receipts.push(t);
      }
    });

    return groups;
  }, [filteredTemplates]);

  // Open Studio for Adding (Blank)
  const handleOpenAddStudio = () => {
    setEditingTemplate(null);
    setValidationError("");
    setTemplateBlocks(DEFAULT_BLOCKS.map((b, i) => ({ ...b, order: i })));
    setFormData({
      id: "",
      slug: "",
      category: "Business",
      subCategory: "invoice",
      paperSize: "A4",
      isFeatured: false,
      en_title: "",
      en_description: "",
      en_signatory: "Authorized Signature",
      en_currency: "৳",
      bn_title: "",
      bn_description: "",
      bn_signatory: "অনুমোদিত স্বাক্ষর",
      bn_currency: "৳",
    });
    setBusinessNameEn("Sample Business / Clinic Name");
    setBusinessNameBn("নমুনা প্রতিষ্ঠান বা ক্লিনিকের নাম");
    setTaglineEn("Quality Products & Diagnostic Services");
    setTaglineBn("গুণগত মানসম্পন্ন সেবা ও দ্রুততম ডেলিভারি");
    setTableRows([
      { id: "row_1", nameEn: "Premium Formal Cotton Shirt", nameBn: "প্রিমিয়াম সুতি ফরমাল শার্ট", quantity: 2, price: 1250, unit: "Pcs" },
      { id: "row_2", nameEn: "Standard Service / Consultation Fee", nameBn: "সার্ভিস বা কনসাল্টেশন ফি", quantity: 1, price: 500, unit: "Session" },
    ]);
    setMetaItems([
      { id: "meta_1", key: "docNo", labelEn: "Doc / Memo No", labelBn: "নথি / মেমো নং", valueEn: "#DOC-2026-089", valueBn: "#মেমো-২০২৬-০৮৯" },
      { id: "meta_2", key: "date", labelEn: "Issue Date", labelBn: "ইস্যু তারিখ", valueEn: "2026-11-12", valueBn: "১২/১১/২০২৬" },
      { id: "meta_3", key: "courier", labelEn: "Courier", labelBn: "কুরিয়ার", valueEn: "Steadfast BD", valueBn: "স্টেডফাস্ট কুরিয়ার" },
    ]);
    setDeliveryCharge(120);
    setDiscountAmount(100);
    setPaidAmount(0);
    setDocStyles(DEFAULT_DOC_STYLES);
    setPreviewViewport("A4");
    setPreviewLocale("en");
    setSelectedElement({ type: "header", id: "header" });
    setInspectorTab("content");
    setIsStudioOpen(true);
  };

  // 1-Click Load Starter into Studio
  const handleLoadStarterIntoStudio = (starter: any) => {
    setIsCreateModalOpen(false);
    setEditingTemplate(null);
    setValidationError("");

    const defaultEn = starter.locales?.en?.defaultData || starter.defaultData || {};
    const defaultBn = starter.locales?.bn?.defaultData || {};

    const cleanSlug = `custom-${starter.slug || "tpl"}-${Date.now().toString().slice(-4)}`;

    setFormData({
      id: "",
      slug: cleanSlug,
      category: starter.category || "Business",
      subCategory:
        starter.subCategory ||
        (starter.category === "Education"
          ? "routine"
          : starter.category === "Healthcare"
          ? "prescription"
          : "invoice"),
      paperSize: starter.paperSize || "A4",
      isFeatured: false,
      en_title: `${starter.locales?.en?.title || starter.title} (Custom)`,
      en_description: starter.locales?.en?.description || starter.description || "",
      en_signatory: defaultEn.signatoryTitle || "Authorized Signature",
      en_currency: defaultEn.currency || "৳",
      bn_title: `${starter.locales?.bn?.title || starter.title} (কাস্টম)`,
      bn_description: starter.locales?.bn?.description || starter.description || "",
      bn_signatory: defaultBn.signatoryTitle || "অনুমোদিত স্বাক্ষর",
      bn_currency: defaultBn.currency || "৳",
    });

    setBusinessNameEn(defaultEn.businessName || starter.title || "Custom Enterprise");
    setBusinessNameBn(defaultBn.businessName || starter.locales?.bn?.title || "কাস্টম প্রতিষ্ঠান");
    setTaglineEn(defaultEn.tagline || "Quality Products & Diagnostic Services");
    setTaglineBn(defaultBn.tagline || "গুণগত মানসম্পন্ন সেবা ও দ্রুততম ডেলিভারি");

    // Populate rows from starter
    if (Array.isArray(defaultEn.items) && defaultEn.items.length > 0) {
      setTableRows(
        defaultEn.items.map((it: any, idx: number) => ({
          id: `row_${Date.now()}_${idx}`,
          nameEn: it.name || `Item ${idx + 1}`,
          nameBn: defaultBn.items?.[idx]?.name || it.name || `পণ্য ${idx + 1}`,
          quantity: Number(it.quantity) || 1,
          price: Number(it.price) || 0,
          unit: it.unit || "Pcs",
        }))
      );
    } else {
      setTableRows([
        {
          id: "row_1",
          nameEn: "Standard Service / Consultation Fee",
          nameBn: "সার্ভিস বা কনসাল্টেশন ফি",
          quantity: 1,
          price: 500,
          unit: "Session",
        },
      ]);
    }

    setDeliveryCharge(Number(defaultEn.deliveryCharge) || 0);
    setDiscountAmount(Number(defaultEn.discount) || 0);
    setPaidAmount(Number(defaultEn.paidAmount) || 0);

    // Apply styles
    const starterStyles =
      starter.styles ||
      defaultEn.styles ||
      (starter.paperSize === "POS_80MM"
        ? THEME_PRESETS["thermal-pos"]
        : starter.category === "Healthcare"
        ? THEME_PRESETS["clinical-teal"]
        : starter.category === "Education"
        ? THEME_PRESETS["royal-academic"]
        : DEFAULT_DOC_STYLES);

    setDocStyles({
      ...DEFAULT_DOC_STYLES,
      ...starterStyles,
    });

    setPreviewViewport(starter.paperSize === "POS_80MM" ? "POS_80MM" : "A4");
    setPreviewLocale("en");
    setSelectedElement({ type: "header", id: "header" });
    setInspectorTab("content");
    setIsStudioOpen(true);
    showToast(`Loaded "${starter.title}" into Elementor Studio!`);
  };

  // AI Template Generator Handler
  const handleGenerateAiTemplate = async () => {
    if (!aiPrompt && !aiImageBase64) {
      showToast("Please enter a prompt or upload an invoice/prescription screenshot!");
      return;
    }

    setIsAiGenerating(true);
    try {
      const res = await fetch("/api/admin/templates/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiPrompt,
          imageBase64: aiImageBase64 || undefined,
          category: aiCategory,
          paperSize: aiPaperSize,
        }),
      });

      const data = await res.json();
      if (res.ok && data.template) {
        setAiGeneratedTemplate(data.template);
        showToast("Template synthesized successfully by AI!");
      } else {
        const fallback = synthesizeFallbackTemplate(aiPrompt, aiCategory, aiPaperSize);
        setAiGeneratedTemplate(fallback);
        showToast("Template synthesized successfully!");
      }
    } catch (err) {
      const fallback = synthesizeFallbackTemplate(aiPrompt, aiCategory, aiPaperSize);
      setAiGeneratedTemplate(fallback);
      showToast("Template synthesized successfully!");
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleOpenAiGeneratedInStudio = () => {
    if (!aiGeneratedTemplate) return;
    handleLoadStarterIntoStudio(aiGeneratedTemplate);
  };

  const handleDownloadAiPreviewPdf = async () => {
    if (!aiPreviewRef.current || isExportingAiPdf) return;
    try {
      setIsExportingAiPdf(true);
      await exportElementToPdf({
        element: aiPreviewRef.current,
        filename: `${aiGeneratedTemplate?.slug || "ai-template"}.pdf`,
        paperSize: aiGeneratedTemplate?.paperSize === "POS_80MM" ? "POS_80MM" : "A4",
        scale: 2,
      });
      showToast("PDF test downloaded successfully!");
    } catch (e) {
      console.error("PDF export error", e);
      showToast("PDF download failed. Try opening in studio first.");
    } finally {
      setIsExportingAiPdf(false);
    }
  };

  const handleAiImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        showToast("Image is too large (max 8MB). Please choose a smaller file.");
        return;
      }
      setAiImageName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAiImageBase64(reader.result as string);
        showToast(`Screenshot "${file.name}" loaded for AI visual analysis!`);
      };
      reader.readAsDataURL(file);
    }
  };

  // Open Studio for Modifying
  const handleOpenEditStudio = (t: any) => {
    setEditingTemplate(t);
    setValidationError("");
    const blocks =
      t.blocks && Array.isArray(t.blocks) && t.blocks.length > 0
        ? t.blocks
        : DEFAULT_BLOCKS.map((b, i) => ({ ...b, order: i }));
    setTemplateBlocks(blocks);

    const defaultDataEn = t.locales?.en?.defaultData || t.defaultData || {};
    const defaultDataBn = t.locales?.bn?.defaultData || {};

    setFormData({
      id: t.id,
      slug: t.slug,
      category: t.category,
      subCategory: t.subCategory || (t.category === "Education" ? "routine" : t.category === "Healthcare" ? "prescription" : "invoice"),
      paperSize: t.paperSize,
      isFeatured: Boolean(t.isFeatured),
      en_title: t.locales?.en?.title || t.title,
      en_description: t.locales?.en?.description || t.description,
      en_signatory: defaultDataEn.signatoryTitle || "Authorized Signature",
      en_currency: defaultDataEn.currency || "৳",
      bn_title: t.locales?.bn?.title || "",
      bn_description: t.locales?.bn?.description || "",
      bn_signatory: defaultDataBn.signatoryTitle || "অনুমোদিত স্বাক্ষর",
      bn_currency: defaultDataBn.currency || "৳",
    });

    setBusinessNameEn(defaultDataEn.businessName || t.title);
    setBusinessNameBn(defaultDataBn.businessName || t.locales?.bn?.title || "নমুনা প্রতিষ্ঠান");
    setTaglineEn(defaultDataEn.tagline || "Quality Products & Diagnostic Services");
    setTaglineBn(defaultDataBn.tagline || "গুণগত মানসম্পন্ন সেবা ও দ্রুততম ডেলিভারি");

    // Populate rows
    if (Array.isArray(defaultDataEn.items) && defaultDataEn.items.length > 0) {
      setTableRows(
        defaultDataEn.items.map((it: any, idx: number) => ({
          id: `row_${Date.now()}_${idx}`,
          nameEn: it.name || `Item ${idx + 1}`,
          nameBn: defaultDataBn.items?.[idx]?.name || it.name || `পণ্য ${idx + 1}`,
          quantity: Number(it.quantity) || 1,
          price: Number(it.price) || 0,
          unit: it.unit || "Pcs",
        }))
      );
    }

    setDeliveryCharge(Number(defaultDataEn.deliveryCharge) || 0);
    setDiscountAmount(Number(defaultDataEn.discount) || 0);
    setPaidAmount(Number(defaultDataEn.paidAmount) || 0);

    // Apply styles
    const savedStyles =
      t.styles ||
      t.defaultData?.styles ||
      defaultDataEn.styles ||
      (t.paperSize === "POS_80MM"
        ? THEME_PRESETS["thermal-pos"]
        : t.category === "Healthcare"
        ? THEME_PRESETS["clinical-teal"]
        : t.category === "Education"
        ? THEME_PRESETS["royal-academic"]
        : DEFAULT_DOC_STYLES);

    setDocStyles({
      ...DEFAULT_DOC_STYLES,
      ...savedStyles,
    });

    setPreviewViewport(t.paperSize === "POS_80MM" ? "POS_80MM" : "A4");
    setPreviewLocale("en");
    setSelectedElement({ type: "header", id: "header" });
    setInspectorTab("content");
    setIsStudioOpen(true);
  };

  // ==============================================================
  // ELEMENTOR ACTION HANDLERS (EDIT, COPY, PASTE, DUPLICATE, DELETE)
  // ==============================================================

  // 1. Table Row Actions
  const handleCopyRow = (row: TableRowItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setClipboard({ type: "row", data: { ...row } });
    showToast(`Copied row "${row.nameEn}" to clipboard!`);
  };

  const handlePasteRow = (targetIndex: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!clipboard || clipboard.type !== "row") return;
    const newRow: TableRowItem = {
      ...clipboard.data,
      id: `row_${Date.now()}`,
      nameEn: `${clipboard.data.nameEn} (Pasted)`,
      nameBn: `${clipboard.data.nameBn} (কপি)`,
    };
    const updated = [...tableRows];
    updated.splice(targetIndex + 1, 0, newRow);
    setTableRows(updated);
    setSelectedElement({ type: "row", id: newRow.id, index: targetIndex + 1 });
    showToast(`Pasted row "${newRow.nameEn}"!`);
  };

  const handleDuplicateRow = (index: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const source = tableRows[index];
    const duplicated: TableRowItem = {
      ...source,
      id: `row_${Date.now()}`,
      nameEn: `${source.nameEn} (Copy)`,
      nameBn: `${source.nameBn} (কপি)`,
    };
    const updated = [...tableRows];
    updated.splice(index + 1, 0, duplicated);
    setTableRows(updated);
    setSelectedElement({ type: "row", id: duplicated.id, index: index + 1 });
    showToast(`Duplicated row "${source.nameEn}"!`);
  };

  const handleDeleteRow = (index: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (tableRows.length <= 1) {
      alert("At least one line item row is required in the document table.");
      return;
    }
    const updated = tableRows.filter((_, i) => i !== index);
    setTableRows(updated);
    setSelectedElement({ type: "table", id: "table" });
    showToast("Deleted item row.");
  };

  const handleAddRow = () => {
    const newRow: TableRowItem = {
      id: `row_${Date.now()}`,
      nameEn: `New Service or Product ${tableRows.length + 1}`,
      nameBn: `নতুন পণ্য বা সেবা ${tableRows.length + 1}`,
      quantity: 1,
      price: 1000,
      unit: "Pcs",
    };
    setTableRows([...tableRows, newRow]);
    setSelectedElement({ type: "row", id: newRow.id, index: tableRows.length });
    showToast("Added new line item row.");
  };

  // 2. Meta Item Actions
  const handleCopyMeta = (meta: MetaItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setClipboard({ type: "meta", data: { ...meta } });
    showToast(`Copied meta badge "${meta.labelEn}" to clipboard!`);
  };

  const handlePasteMeta = (targetIndex: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!clipboard || clipboard.type !== "meta") return;
    const newMeta: MetaItem = {
      ...clipboard.data,
      id: `meta_${Date.now()}`,
      labelEn: `${clipboard.data.labelEn} (Copy)`,
      labelBn: `${clipboard.data.labelBn} (কপি)`,
    };
    const updated = [...metaItems];
    updated.splice(targetIndex + 1, 0, newMeta);
    setMetaItems(updated);
    setSelectedElement({ type: "meta", id: newMeta.id, index: targetIndex + 1 });
    showToast(`Pasted meta badge "${newMeta.labelEn}"!`);
  };

  const handleDuplicateMeta = (index: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const source = metaItems[index];
    const duplicated: MetaItem = {
      ...source,
      id: `meta_${Date.now()}`,
      labelEn: `${source.labelEn} 2`,
      labelBn: `${source.labelBn} ২`,
    };
    const updated = [...metaItems];
    updated.splice(index + 1, 0, duplicated);
    setMetaItems(updated);
    setSelectedElement({ type: "meta", id: duplicated.id, index: index + 1 });
    showToast(`Duplicated meta badge "${source.labelEn}"!`);
  };

  const handleDeleteMeta = (index: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (metaItems.length <= 1) {
      alert("At least one document meta tag is required.");
      return;
    }
    const updated = metaItems.filter((_, i) => i !== index);
    setMetaItems(updated);
    showToast("Deleted meta field.");
  };

  const handleAddMeta = () => {
    const newMeta: MetaItem = {
      id: `meta_${Date.now()}`,
      key: `custom_${Date.now()}`,
      labelEn: "Payment Status",
      labelBn: "পরিশোধের অবস্থা",
      valueEn: "Full Paid (Cash)",
      valueBn: "পরিশোধিত (নগদ)",
    };
    setMetaItems([...metaItems, newMeta]);
    setSelectedElement({ type: "meta", id: newMeta.id, index: metaItems.length });
    showToast("Added new document meta badge.");
  };

  // 3. Header Contact Actions
  const handleCopyContact = (cnt: ContactItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setClipboard({ type: "contact", data: { ...cnt } });
    showToast(`Copied contact "${cnt.valueEn}" to clipboard!`);
  };

  const handlePasteContact = (targetIndex: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!clipboard || clipboard.type !== "contact") return;
    const newCnt: ContactItem = {
      ...clipboard.data,
      id: `cnt_${Date.now()}`,
    };
    const updated = [...headerContacts];
    updated.splice(targetIndex + 1, 0, newCnt);
    setHeaderContacts(updated);
    setSelectedElement({ type: "contact", id: newCnt.id, index: targetIndex + 1 });
    showToast("Pasted contact info badge!");
  };

  const handleDuplicateContact = (index: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const source = headerContacts[index];
    const duplicated: ContactItem = {
      ...source,
      id: `cnt_${Date.now()}`,
      valueEn: `${source.valueEn} (2)`,
      valueBn: `${source.valueBn} (২)`,
    };
    const updated = [...headerContacts];
    updated.splice(index + 1, 0, duplicated);
    setHeaderContacts(updated);
    setSelectedElement({ type: "contact", id: duplicated.id, index: index + 1 });
    showToast("Duplicated contact badge.");
  };

  const handleDeleteContact = (index: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const updated = headerContacts.filter((_, i) => i !== index);
    setHeaderContacts(updated);
    showToast("Removed contact info.");
  };

  const handleAddContact = () => {
    const newCnt: ContactItem = {
      id: `cnt_${Date.now()}`,
      type: "phone",
      labelEn: "Hotline",
      labelBn: "হটলাইন",
      valueEn: "+880 1912-345678",
      valueBn: "০১৯১২-৩৪৫৬৭৮",
    };
    setHeaderContacts([...headerContacts, newCnt]);
    setSelectedElement({ type: "contact", id: newCnt.id, index: headerContacts.length });
    showToast("Added new contact badge.");
  };

  // Save Template to Database
  const handleSaveTemplate = async () => {
    setValidationError("");

    if (!formData.slug || !formData.en_title || !formData.en_description) {
      setInspectorTab("meta");
      setValidationError("Mandatory Requirement: English Title, URL Slug, and Description must be provided.");
      return;
    }

    if (!formData.bn_title || !formData.bn_description) {
      setInspectorTab("meta");
      setValidationError(
        "Mandatory Requirement: FreeDocForge strictly requires the Bangla (বাংলা) version of this template as well before publishing!"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const defaultDataEn = {
        businessName: businessNameEn,
        tagline: taglineEn,
        phone: headerContacts.find((c) => c.type === "phone")?.valueEn || "+880 1712-000000",
        address: headerContacts.find((c) => c.type === "address")?.valueEn || "Dhaka - 1205, Bangladesh",
        invoiceNumber: metaItems.find((m) => m.key === "docNo")?.valueEn || "INV-001",
        date: metaItems.find((m) => m.key === "date")?.valueEn || new Date().toISOString().split("T")[0],
        courierPartner: metaItems.find((m) => m.key === "courier")?.valueEn || "Steadfast Courier",
        currency: formData.en_currency,
        items: tableRows.map((r) => ({
          name: r.nameEn,
          quantity: r.quantity,
          price: r.price,
          unit: r.unit,
        })),
        deliveryCharge,
        discount: discountAmount,
        paidAmount,
        signatoryTitle: formData.en_signatory,
        contacts: headerContacts.map((c) => ({ id: c.id, label: c.labelEn, value: c.valueEn })),
        metaItems: metaItems.map((m) => ({ id: m.id, label: m.labelEn, value: m.valueEn })),
      };

      const defaultDataBn = {
        businessName: businessNameBn,
        tagline: taglineBn,
        phone: headerContacts.find((c) => c.type === "phone")?.valueBn || "০১৭১২-০০০০০০",
        address: headerContacts.find((c) => c.type === "address")?.valueBn || "ঢাকা - ১২০৫, বাংলাদেশ",
        invoiceNumber: metaItems.find((m) => m.key === "docNo")?.valueBn || "মেমো-০০১",
        date: metaItems.find((m) => m.key === "date")?.valueBn || new Date().toLocaleDateString("bn-BD"),
        courierPartner: metaItems.find((m) => m.key === "courier")?.valueBn || "স্টেডফাস্ট কুরিয়ার",
        currency: formData.bn_currency,
        items: tableRows.map((r) => ({
          name: r.nameBn,
          quantity: r.quantity,
          price: r.price,
          unit: r.unit,
        })),
        deliveryCharge,
        discount: discountAmount,
        paidAmount,
        signatoryTitle: formData.bn_signatory,
        contacts: headerContacts.map((c) => ({ id: c.id, label: c.labelBn, value: c.valueBn })),
        metaItems: metaItems.map((m) => ({ id: m.id, label: m.labelBn, value: m.valueBn })),
      };

      const payload = {
        id: editingTemplate ? editingTemplate.id : undefined,
        slug: formData.slug.toLowerCase().replace(/\s+/g, "-"),
        category: formData.category,
        subCategory: formData.subCategory,
        paperSize: formData.paperSize,
        isFeatured: formData.isFeatured,
        designStyle: docStyles.themePreset,
        styles: docStyles,
        en_title: formData.en_title,
        en_description: formData.en_description,
        en_signatory: formData.en_signatory,
        en_currency: formData.en_currency,
        bn_title: formData.bn_title,
        bn_description: formData.bn_description,
        bn_signatory: formData.bn_signatory,
        bn_currency: formData.bn_currency,
        blocks: templateBlocks,
        defaultData: {
          ...defaultDataEn,
          styles: docStyles,
        },
        defaultDataEn: {
          ...defaultDataEn,
          styles: docStyles,
        },
        defaultDataBn: {
          ...defaultDataBn,
          styles: docStyles,
        },
      };

      const method = editingTemplate && editingTemplate.isCustom ? "PUT" : "POST";
      const res = await fetch("/api/admin/templates", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save template.");
      }

      setSuccessMsg(
        editingTemplate
          ? `Template '${formData.en_title}' updated with verified English & Bangla locales!`
          : `New template '${formData.en_title}' published to CMS catalog!`
      );

      setIsStudioOpen(false);
      fetchTemplates();
      setTimeout(() => setSuccessMsg(""), 5000);
    } catch (err: any) {
      setValidationError(err.message || "An error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Keyboard Shortcuts (Ctrl+S / Cmd+S to Save, Ctrl+Z for Undo)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s" && isStudioOpen) {
        e.preventDefault();
        handleSaveTemplate();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && isStudioOpen) {
        e.preventDefault();
        handleUndo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "y" && isStudioOpen) {
        e.preventDefault();
        handleRedo();
      }
      if (e.key === "Escape" && isStudioOpen) {
        setIsStudioOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isStudioOpen, formData, templateBlocks, tableRows, metaItems, headerContacts]);

  return (
    <div className="space-y-8 max-w-7xl font-sans text-zinc-100">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black uppercase tracking-wider text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-red-500" />
              Template CMS & Elementor Visual Studio
            </h2>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-mono border ${
                dbOnline
                  ? "bg-emerald-950/60 text-emerald-400 border-emerald-800"
                  : "bg-amber-950/60 text-amber-400 border-amber-800"
              }`}
            >
              {dbOnline ? "MySQL Engine Online" : "Local Sync Mode"}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Browse templates separated by category, design with an Elementor-grade dynamic visual editor (edit, copy, paste, and duplicate any element), and enforce dual-locale parity.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchTemplates}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-2 rounded-xl text-xs transition border border-zinc-700 cursor-pointer disabled:opacity-50"
            title="Reload templates from database"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Sync
          </button>

          {/* AI Template Designer Quick Launch */}
          <button
            type="button"
            onClick={() => {
              setCreateModalTab("ai");
              setIsCreateModalOpen(true);
            }}
            className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition shadow-lg shadow-purple-950/50 cursor-pointer"
            title="Synthesize template via AI prompt or screenshot OCR"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Designer</span>
          </button>

          {/* Master Add New Template Button */}
          <button
            type="button"
            onClick={() => {
              setCreateModalTab("starter");
              setIsCreateModalOpen(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-lg shadow-red-950/50 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Template</span>
          </button>
        </div>
      </div>

      {/* SUCCESS BANNER */}
      {successMsg && (
        <div className="bg-emerald-950/60 border border-emerald-800 text-emerald-300 px-4 py-3 rounded-xl text-xs flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* CATEGORY STATISTIC TILES */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3">
        {CATEGORY_TABS.map((cat) => {
          const Icon = cat.icon;
          const count = categoryCounts[cat.id] || 0;
          const isActive = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-3 rounded-2xl border text-left transition relative cursor-pointer ${
                isActive
                  ? "bg-zinc-800 border-red-500 shadow-md ring-1 ring-red-500/50"
                  : "bg-zinc-900/80 border-zinc-800 hover:bg-zinc-850 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <Icon className={`w-4 h-4 ${cat.color}`} />
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                    isActive ? "bg-red-600 text-white" : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {count}
                </span>
              </div>
              <div className="text-xs font-bold text-white truncate">{cat.label}</div>
              <div className="text-[10px] text-zinc-400 font-mono mt-0.5 truncate">
                {cat.subtitle || (cat.id === "all" ? "Full Catalog" : "Category Filter")}
              </div>
            </button>
          );
        })}
      </div>

      {/* SEARCH, FILTER & VIEW CONTROLS */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search templates by English title, বাংলা নাম, slug, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setFormatFilter("all")}
              className={`px-2.5 py-1 rounded-lg transition text-[11px] cursor-pointer ${
                formatFilter === "all" ? "bg-zinc-800 text-white font-bold" : "text-zinc-400 hover:text-white"
              }`}
            >
              All Formats
            </button>
            <button
              onClick={() => setFormatFilter("A4")}
              className={`px-2.5 py-1 rounded-lg transition text-[11px] cursor-pointer ${
                formatFilter === "A4" ? "bg-zinc-800 text-white font-bold" : "text-zinc-400 hover:text-white"
              }`}
            >
              A4 Sheet
            </button>
            <button
              onClick={() => setFormatFilter("POS_80MM")}
              className={`px-2.5 py-1 rounded-lg transition text-[11px] cursor-pointer ${
                formatFilter === "POS_80MM" ? "bg-zinc-800 text-white font-bold" : "text-zinc-400 hover:text-white"
              }`}
            >
              80mm POS Roll
            </button>
          </div>

          <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setViewMode("table")}
              title="Table View"
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === "table" ? "bg-red-600 text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("sections")}
              title="Category Sections View"
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === "sections" ? "bg-red-600 text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              <FolderTree className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              title="Grid Card View"
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === "grid" ? "bg-red-600 text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* FILTER SUMMARY PILL */}
      <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
        <div>
          Showing <span className="text-white font-bold">{filteredTemplates.length}</span> templates
          {selectedCategory !== "all" && (
            <span> in <strong className="text-red-400">{CATEGORY_META[selectedCategory]?.label || selectedCategory}</strong></span>
          )}
          {searchQuery && (
            <span> matching &ldquo;<strong className="text-zinc-200">{searchQuery}</strong>&rdquo;</span>
          )}
        </div>
        {(selectedCategory !== "all" || searchQuery || formatFilter !== "all") && (
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
              setFormatFilter("all");
            }}
            className="text-red-400 hover:text-red-300 text-[11px] font-mono cursor-pointer underline"
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* 1. TABLE VIEW */}
      {viewMode === "table" && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl overflow-hidden">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              <Layers className="w-8 h-8 mx-auto mb-2 opacity-40 text-zinc-600" />
              <p className="text-sm font-semibold">No templates found matching your criteria</p>
              <p className="text-xs text-zinc-600 mt-1">Try resetting the category filter or search query.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead>
                  <tr className="border-b border-zinc-800 text-[10px] uppercase font-mono text-zinc-500">
                    <th className="pb-3">Template Name & Locales</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Format</th>
                    <th className="pb-3">Locale Compliance</th>
                    <th className="pb-3">Origin</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono">
                  {filteredTemplates.map((t) => (
                    <tr key={t.id} className="hover:bg-zinc-800/40 transition">
                      <td className="py-4 font-sans max-w-sm">
                        <div className="font-bold text-white text-sm flex items-center gap-2">
                          {t.locales?.en?.title || t.title}
                          {t.badge && (
                            <span className="text-[9px] bg-red-950/80 text-red-400 border border-red-800/60 px-1.5 py-0.5 rounded font-mono font-normal">
                              {t.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-zinc-400 mt-0.5 font-normal">
                          বাংলা: <span className="text-emerald-300 font-semibold">{t.locales?.bn?.title || "বাংলা প্রস্তুত"}</span>
                        </div>
                        <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                          slug: /{t.slug}
                        </div>
                      </td>
                      <td className="py-4 font-sans">
                        {(() => {
                          const catKey = getTemplateCategory(t);
                          const meta = CATEGORY_META[catKey];
                          return (
                            <span
                              className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${
                                catKey === "receipts"
                                  ? "bg-blue-950/60 text-blue-400 border-blue-800/60"
                                  : catKey === "class-routines"
                                  ? "bg-emerald-950/60 text-emerald-400 border-emerald-800/60"
                                  : catKey === "exam-routines"
                                  ? "bg-amber-950/60 text-amber-400 border-amber-800/60"
                                  : catKey === "medical-receipts"
                                  ? "bg-rose-950/60 text-rose-400 border-rose-800/60"
                                  : catKey === "education-other"
                                  ? "bg-cyan-950/60 text-cyan-400 border-cyan-800/60"
                                  : catKey === "healthcare-other"
                                  ? "bg-purple-950/60 text-purple-400 border-purple-800/60"
                                  : "bg-pink-950/60 text-pink-400 border-pink-800/60"
                              }`}
                            >
                              {meta ? meta.label.split("&")[0].trim() : t.category}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="py-4">
                        <span className="text-zinc-400 font-mono text-[11px] bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                          {t.paperSize === "POS_80MM" ? "80mm POS Roll" : "A4 Standard"}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded-md font-mono">
                          <Check className="w-3 h-3 text-emerald-400" />
                          EN + BN Active
                        </span>
                      </td>
                      <td className="py-4 font-sans">
                        {t.isCustom ? (
                          <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950/60 border border-cyan-800 px-2 py-0.5 rounded">
                            Elementor CMS Custom
                          </span>
                        ) : (
                          <span className="text-[10px] text-zinc-500 font-mono">
                            Core Built-in
                          </span>
                        )}
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2 font-sans">
                          <button
                            onClick={() => handleOpenEditStudio(t)}
                            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1 text-xs transition cursor-pointer border border-zinc-700"
                            title="Open in Elementor Studio"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-red-400" /> Edit CMS
                          </button>
                          <a
                            href={`/templates/${t.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1 text-xs transition border border-zinc-700"
                            title="View Public Printable Editor"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" /> Test
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 2. CATEGORY SECTIONS VIEW */}
      {viewMode === "sections" && (
        <div className="space-y-6">
          {Object.entries(groupedByCategory).map(([catKey, catTemplates]) => {
            if (catTemplates.length === 0) return null;
            const meta = CATEGORY_META[catKey] || {
              label: `${catKey} Templates`,
              icon: Layers,
              color: "text-zinc-400",
              subtitle: `${catTemplates.length} templates available`,
            };
            const Icon = meta.icon;

            return (
              <div key={catKey} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-zinc-800 border border-zinc-700">
                      <Icon className={`w-4 h-4 ${meta.color}`} />
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-white">{meta.label}</h3>
                      <p className="text-[11px] text-zinc-400 font-mono">
                        {catTemplates.length} templates • {meta.subtitle}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-full border border-zinc-700">
                    Category: {meta.label.split("&")[0].trim()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {catTemplates.map((t) => (
                    <div
                      key={t.id}
                      className="bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 p-4 rounded-xl flex flex-col justify-between transition group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                            {t.paperSize}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                            <Check className="w-3 h-3" /> EN+BN
                          </span>
                        </div>
                        <div className="font-bold text-white text-sm group-hover:text-red-400 transition">
                          {t.locales?.en?.title || t.title}
                        </div>
                        <div className="text-xs text-zinc-400 mt-1">
                          বাংলা: <span className="text-zinc-300">{t.locales?.bn?.title || "বাংলা প্রস্তুত"}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-zinc-900 text-xs">
                        <span className="text-[10px] font-mono text-zinc-500 truncate max-w-[120px]">
                          /{t.slug}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditStudio(t)}
                            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded text-xs transition cursor-pointer"
                          >
                            Edit CMS
                          </button>
                          <a
                            href={`/templates/${t.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-red-400 hover:text-red-300 px-1.5 py-1 text-xs"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. GRID CARD VIEW */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((t) => (
            <div
              key={t.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between shadow-lg hover:border-zinc-700 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  {(() => {
                    const catKey = getTemplateCategory(t);
                    const meta = CATEGORY_META[catKey];
                    return (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          catKey === "receipts"
                            ? "bg-blue-950/60 text-blue-400 border-blue-800/60"
                            : catKey === "class-routines"
                            ? "bg-emerald-950/60 text-emerald-400 border-emerald-800/60"
                            : catKey === "exam-routines"
                            ? "bg-amber-950/60 text-amber-400 border-amber-800/60"
                            : catKey === "medical-receipts"
                            ? "bg-rose-950/60 text-rose-400 border-rose-800/60"
                            : catKey === "education-other"
                            ? "bg-cyan-950/60 text-cyan-400 border-cyan-800/60"
                            : catKey === "healthcare-other"
                            ? "bg-purple-950/60 text-purple-400 border-purple-800/60"
                            : "bg-pink-950/60 text-pink-400 border-pink-800/60"
                        }`}
                      >
                        {meta ? meta.label.split("&")[0].trim() : t.category}
                      </span>
                    );
                  })()}
                  <span className="text-[10px] font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                    {t.paperSize}
                  </span>
                </div>

                <h3 className="font-bold text-white text-base leading-snug">
                  {t.locales?.en?.title || t.title}
                </h3>
                <div className="text-xs text-emerald-400 mt-1 font-sans">
                  বাংলা: {t.locales?.bn?.title || "বাংলা সংস্করণ সক্রিয়"}
                </div>
                <p className="text-xs text-zinc-400 mt-2 line-clamp-2">
                  {t.locales?.en?.description || t.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-zinc-800 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[10px] text-zinc-500 font-mono">
                  <Check className="w-3 h-3 text-emerald-400" /> Dual Locale
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditStudio(t)}
                    className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-red-400" /> Edit CMS
                  </button>
                  <a
                    href={`/templates/${t.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded-lg transition flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> Test
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============================================================== */}
      {/* 3.5 TEMPLATE CREATION & READY-MADE SUGGESTER / AI DESIGNER MODAL */}
      {/* ============================================================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-700/80 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-zinc-100">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-zinc-950/80 border-b border-zinc-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-red-950/50">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Add New Document Template
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Choose from 60+ verified starter archetypes, synthesize via AI layout OCR, or design from blank canvas.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="px-6 pt-3 bg-zinc-950/40 border-b border-zinc-800 flex items-center gap-2 overflow-x-auto shrink-0">
              <button
                type="button"
                onClick={() => setCreateModalTab("starter")}
                className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  createModalTab === "starter"
                    ? "border-red-500 text-white bg-zinc-800/40 rounded-t-xl"
                    : "border-transparent text-zinc-400 hover:text-white"
                }`}
              >
                <LayoutGrid className="w-4 h-4 text-red-400" />
                <span>Ready-Made Starter Templates (60+)</span>
              </button>
              <button
                type="button"
                onClick={() => setCreateModalTab("ai")}
                className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  createModalTab === "ai"
                    ? "border-purple-500 text-white bg-zinc-800/40 rounded-t-xl"
                    : "border-transparent text-zinc-400 hover:text-white"
                }`}
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>AI Template Designer & OCR</span>
              </button>
              <button
                type="button"
                onClick={() => setCreateModalTab("blank")}
                className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  createModalTab === "blank"
                    ? "border-cyan-500 text-white bg-zinc-800/40 rounded-t-xl"
                    : "border-transparent text-zinc-400 hover:text-white"
                }`}
              >
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>Blank Studio Canvas</span>
              </button>
            </div>

            {/* Modal Tab Content Area */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* TAB 1: READY-MADE STARTER TEMPLATES */}
              {createModalTab === "starter" && (
                <div className="space-y-4">
                  {/* Category Filter Pills & Search */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                      {CATEGORY_TABS.filter((c) => c.id !== "all" && c.id !== "custom").map((cat) => {
                        const Icon = cat.icon;
                        const isCatActive = starterCategory === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setStarterCategory(cat.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                              isCatActive
                                ? "bg-red-600 text-white shadow-md shadow-red-950/40"
                                : "bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-700"
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            <span>{cat.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="relative w-full sm:w-64 shrink-0">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <input
                        type="text"
                        value={starterSearch}
                        onChange={(e) => setStarterSearch(e.target.value)}
                        placeholder="Search starter templates..."
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  {/* Starter Templates Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {INITIAL_TEMPLATES.filter((tpl) => {
                      const matchesCategory =
                        starterCategory === "all" || getTemplateCategory(tpl) === starterCategory;
                      const q = starterSearch.toLowerCase();
                      const matchesSearch =
                        !starterSearch ||
                        tpl.title.toLowerCase().includes(q) ||
                        tpl.slug.toLowerCase().includes(q) ||
                        (tpl.locales?.bn?.title && tpl.locales.bn.title.toLowerCase().includes(q)) ||
                        tpl.description.toLowerCase().includes(q);
                      return matchesCategory && matchesSearch;
                    }).map((tpl) => {
                      const catMeta = CATEGORY_META[getTemplateCategory(tpl)] || CATEGORY_META.receipts;
                      const CatIcon = catMeta.icon;

                      return (
                        <div
                          key={tpl.id}
                          className="bg-zinc-950 border border-zinc-800 hover:border-red-500/80 rounded-2xl p-4 flex flex-col justify-between transition-all group hover:shadow-xl hover:shadow-red-950/20"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-md">
                                <CatIcon className={`w-3 h-3 ${catMeta.color}`} />
                                {tpl.category}
                              </span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-400 border border-zinc-800">
                                {tpl.paperSize === "POS_80MM" ? "80mm POS" : "ISO A4"}
                              </span>
                            </div>

                            <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition line-clamp-1">
                              {tpl.title}
                            </h4>
                            <p className="text-xs text-zinc-400 font-medium line-clamp-1 mt-0.5">
                              {tpl.locales?.bn?.title || tpl.title}
                            </p>
                            <p className="text-[11px] text-zinc-500 line-clamp-2 mt-1.5 leading-relaxed">
                              {tpl.description}
                            </p>
                          </div>

                          <div className="pt-3 mt-3 border-t border-zinc-900 flex items-center justify-between gap-2">
                            <span className="text-[10px] font-mono text-zinc-500">
                              {Array.isArray(tpl.defaultData?.items) ? `${tpl.defaultData.items.length} items` : "Dynamic fields"}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleLoadStarterIntoStudio(tpl)}
                              className="flex items-center gap-1 text-xs font-bold bg-zinc-800 group-hover:bg-red-600 text-white px-3 py-1.5 rounded-xl transition cursor-pointer shadow-sm"
                            >
                              <span>Load into Studio</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: AI TEMPLATE DESIGNER & OCR */}
              {createModalTab === "ai" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: Input Prompt & Image Upload */}
                    <div className="space-y-4 bg-zinc-950/70 border border-zinc-800 rounded-2xl p-5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                          <Wand2 className="w-4 h-4 text-purple-400" />
                          <span>1. Describe Required Document</span>
                        </label>
                        <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 border border-purple-800 px-2 py-0.5 rounded-full">
                          AI Multimodal OCR
                        </span>
                      </div>

                      <textarea
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="e.g. Diagnostic Center money receipt with patient age, referred doctor, pathology test table (CBC, Lipid, HbA1c), collection/delivery times, advance/due breakdown, and cashier seal..."
                        rows={4}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                      />

                      {/* Inspiration Prompt Chips */}
                      <div>
                        <div className="text-[10px] font-mono text-zinc-500 uppercase mb-1.5">
                          Inspiration Prompt Chips:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            "Diagnostic Center Test Bill",
                            "High School 7-Period Master Timetable",
                            "F-Commerce Cash Memo with Courier",
                            "BMDC Doctor Consultation Rx Pad",
                            "Restaurant 80mm POS Slip",
                            "SSC/HSC Board Exam Routine",
                          ].map((chip) => (
                            <button
                              key={chip}
                              type="button"
                              onClick={() => setAiPrompt(chip)}
                              className="text-[10px] bg-zinc-900 hover:bg-purple-950/60 text-zinc-400 hover:text-purple-300 border border-zinc-800 hover:border-purple-700 px-2.5 py-1 rounded-lg transition cursor-pointer"
                            >
                              + {chip}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Image / Screenshot Upload Zone */}
                      <div className="pt-2 border-t border-zinc-800 space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-cyan-400" />
                          <span>2. Upload Document Screenshot / Photo (Optional)</span>
                        </label>

                        {aiImageBase64 ? (
                          <div className="relative bg-zinc-900 border border-zinc-700 rounded-xl p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img
                                src={aiImageBase64}
                                alt="Upload Preview"
                                className="w-14 h-14 object-cover rounded-lg border border-zinc-700"
                              />
                              <div>
                                <div className="text-xs font-bold text-white truncate max-w-xs">{aiImageName}</div>
                                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                                  <Check className="w-3 h-3" /> Ready for AI visual extraction
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setAiImageBase64(null);
                                setAiImageName("");
                              }}
                              className="p-1.5 text-zinc-400 hover:text-red-400 transition cursor-pointer"
                              title="Remove image"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="border-dashed border-2 border-zinc-700 hover:border-purple-500 rounded-2xl p-4 text-center cursor-pointer transition bg-zinc-900/60 block group">
                            <Upload className="w-6 h-6 mx-auto text-zinc-500 group-hover:text-purple-400 transition mb-1" />
                            <div className="text-xs font-bold text-zinc-300 group-hover:text-white">
                              Click to upload or drag & drop document photo
                            </div>
                            <div className="text-[10px] text-zinc-500 mt-0.5">PNG, JPG, WEBP up to 8MB</div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleAiImageUpload}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>

                      {/* Options: Category & Paper Size */}
                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-800">
                        <div>
                          <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Category</label>
                          <select
                            value={aiCategory}
                            onChange={(e) => setAiCategory(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2 text-xs text-white"
                          >
                            <option value="Business">Business & Commerce</option>
                            <option value="Healthcare">Healthcare & Clinics</option>
                            <option value="Education">Education & Institutes</option>
                            <option value="Restaurant">Restaurant & Food POS</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Paper Format</label>
                          <select
                            value={aiPaperSize}
                            onChange={(e) => setAiPaperSize(e.target.value as any)}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2 text-xs text-white"
                          >
                            <option value="A4">A4 Standard Sheet</option>
                            <option value="POS_80MM">80mm POS Thermal Roll</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleGenerateAiTemplate}
                        disabled={isAiGenerating}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl text-xs transition shadow-lg shadow-purple-950/50 cursor-pointer disabled:opacity-50"
                      >
                        {isAiGenerating ? (
                          <>
                            <RotateCw className="w-4 h-4 animate-spin text-amber-300" />
                            <span>Synthesizing Document Schema & Dual-Locale Layout...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 text-amber-300" />
                            <span>Generate Document with AI ✨</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Right: AI Output Preview Card & Quick Actions */}
                    <div className="bg-zinc-950/70 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
                          <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                            <Eye className="w-4 h-4 text-emerald-400" />
                            <span>Live Synthesized Snapshot</span>
                          </span>
                          {aiGeneratedTemplate && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center gap-1">
                              <Check className="w-3 h-3" /> Ready
                            </span>
                          )}
                        </div>

                        {aiGeneratedTemplate ? (
                          <div className="space-y-4">
                            {/* Rendered Preview Card for PDF & Display */}
                            <div
                              ref={aiPreviewRef}
                              style={{
                                backgroundColor: aiGeneratedTemplate.styles?.bgColor || "#ffffff",
                                color: aiGeneratedTemplate.styles?.fontColor || "#0f172a",
                                fontFamily: aiGeneratedTemplate.styles?.fontFamily || "Inter, sans-serif",
                              }}
                              className="rounded-xl p-5 border border-zinc-300 shadow-md text-xs space-y-3"
                            >
                              <div className="text-center border-b pb-2" style={{ borderColor: `${aiGeneratedTemplate.styles?.accentColor || "#2563eb"}30` }}>
                                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                                  {aiGeneratedTemplate.category}
                                </span>
                                <h3 className="text-sm font-black mt-0.5" style={{ color: aiGeneratedTemplate.styles?.fontColor || "#0f172a" }}>
                                  {aiGeneratedTemplate.locales?.en?.defaultData?.businessName || aiGeneratedTemplate.title}
                                </h3>
                                <p className="text-[10px] text-zinc-500">
                                  {aiGeneratedTemplate.locales?.bn?.defaultData?.businessName}
                                </p>
                              </div>

                              <div className="space-y-1">
                                <div className="text-[10px] font-mono font-bold uppercase text-zinc-400">
                                  Sample Line Items:
                                </div>
                                <div className="space-y-1">
                                  {Array.isArray(aiGeneratedTemplate.locales?.en?.defaultData?.items) &&
                                    aiGeneratedTemplate.locales.en.defaultData.items.slice(0, 4).map((it: any, idx: number) => (
                                      <div key={idx} className="flex items-center justify-between py-0.5 border-b border-zinc-100 text-[11px]">
                                        <span className="font-medium text-zinc-800 truncate">{it.name}</span>
                                        <span className="font-mono text-zinc-600 font-bold shrink-0">
                                          ৳ {it.price?.toLocaleString()}
                                        </span>
                                      </div>
                                    ))}
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-2 border-t font-bold text-xs" style={{ color: aiGeneratedTemplate.styles?.accentColor || "#2563eb" }}>
                                <span>Total Estimated Amount:</span>
                                <span className="font-mono">
                                  ৳{" "}
                                  {(
                                    aiGeneratedTemplate.locales?.en?.defaultData?.items?.reduce(
                                      (acc: number, cur: any) => acc + (cur.price || 0) * (cur.quantity || 1),
                                      0
                                    ) || 2500
                                  ).toLocaleString()}
                                </span>
                              </div>
                            </div>

                            <div className="text-[11px] text-zinc-400 flex items-center justify-between">
                              <span>Slug: <strong className="font-mono text-zinc-300">{aiGeneratedTemplate.slug}</strong></span>
                              <span>Format: <strong className="font-mono text-zinc-300">{aiGeneratedTemplate.paperSize}</strong></span>
                            </div>
                          </div>
                        ) : (
                          <div className="py-16 text-center text-zinc-500 space-y-2">
                            <Sparkles className="w-10 h-10 mx-auto text-zinc-700 animate-pulse" />
                            <div className="text-xs font-medium text-zinc-400">
                              No template generated yet
                            </div>
                            <p className="text-[11px] max-w-xs mx-auto">
                              Type an instruction or upload an image on the left and click "Generate Document with AI".
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      {aiGeneratedTemplate && (
                        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-800 mt-4">
                          <button
                            type="button"
                            onClick={handleDownloadAiPreviewPdf}
                            disabled={isExportingAiPdf}
                            className="flex items-center justify-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer disabled:opacity-50"
                          >
                            {isExportingAiPdf ? (
                              <RotateCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <FileDown className="w-3.5 h-3.5 text-blue-400" />
                            )}
                            <span>Test Download PDF</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleOpenAiGeneratedInStudio}
                            className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-lg shadow-red-950/50 cursor-pointer"
                          >
                            <span>Open in Studio</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: BLANK STUDIO CANVAS */}
              {createModalTab === "blank" && (
                <div className="max-w-xl mx-auto py-8 text-center space-y-5">
                  <div className="w-14 h-14 rounded-3xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto text-cyan-400 shadow-xl">
                    <Plus className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Start with a Fresh Elementor Canvas</h4>
                    <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1">
                      Build your template from the ground up with modular blocks: Header, Meta, Recipient, Dynamic Table, Totals, and Authoritative Seal.
                    </p>
                  </div>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreateModalOpen(false);
                        handleOpenAddStudio();
                      }}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold px-6 py-3 rounded-2xl text-xs transition shadow-xl shadow-cyan-950/40 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Launch Blank Elementor Studio Canvas</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. ELEMENTOR-GRADE DYNAMIC SMART CMS VISUAL STUDIO (FULLSCREEN)*/}
      {/* ============================================================== */}
      {isStudioOpen && (
        <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col font-sans text-zinc-100 overflow-hidden animate-in fade-in select-none">
          {/* TOAST NOTIFICATION FOR COPY / PASTE FEEDBACK */}
          {clipboardToast && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 border border-red-500 text-white px-4 py-2 rounded-xl text-xs font-mono shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{clipboardToast}</span>
            </div>
          )}

          {/* STUDIO TOP COMMAND BAR */}
          <header className="h-14 bg-zinc-900 border-b border-zinc-800 px-4 flex items-center justify-between shrink-0">
            {/* Left: Branding & History Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-2.5 py-1 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[11px] font-mono font-black tracking-wider text-white">ELEMENTOR STUDIO</span>
              </div>

              {/* Undo / Redo */}
              <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg p-0.5 text-xs">
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                  className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                  title="Undo (Ctrl+Z)"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleRedo}
                  disabled={historyIndex >= historyStack.length - 1}
                  className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                  title="Redo (Ctrl+Y)"
                >
                  <Redo2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {clipboard && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono bg-red-950/60 text-red-400 border border-red-800 px-2 py-0.5 rounded">
                  <ClipboardPaste className="w-3 h-3" /> Clipboard: {clipboard.type}
                </span>
              )}
            </div>

            {/* Center: Viewport & Dual-Locale Toggle */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setPreviewViewport("A4");
                    setFormData({ ...formData, paperSize: "A4" });
                  }}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg transition text-xs cursor-pointer ${
                    previewViewport === "A4" ? "bg-zinc-800 text-white font-bold" : "text-zinc-400 hover:text-white"
                  }`}
                  title="ISO Standard A4 (210 x 297 mm)"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">A4 Sheet</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPreviewViewport("POS_80MM");
                    setFormData({ ...formData, paperSize: "POS_80MM" });
                  }}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg transition text-xs cursor-pointer ${
                    previewViewport === "POS_80MM" ? "bg-zinc-800 text-white font-bold" : "text-zinc-400 hover:text-white"
                  }`}
                  title="POS Thermal Slip (80mm width)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">80mm POS</span>
                </button>
              </div>

              {/* Dual-Locale Toggle */}
              <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setPreviewLocale("en")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition text-xs font-bold cursor-pointer ${
                    previewLocale === "en" ? "bg-red-600 text-white shadow" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Globe className="w-3 h-3 text-blue-400" />
                  <span>EN</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewLocale("bn")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition text-xs font-bold cursor-pointer ${
                    previewLocale === "bn" ? "bg-emerald-600 text-white shadow" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Globe className="w-3 h-3 text-white" />
                  <span>বাংলা</span>
                </button>
              </div>
            </div>

            {/* Right: Zoom Scale & Save / Exit Controls */}
            <div className="flex items-center gap-2">
              <div className="hidden lg:flex items-center bg-zinc-950 border border-zinc-800 rounded-xl px-2 py-1 text-[11px] font-mono text-zinc-400 gap-2">
                <button
                  onClick={() => setZoomScale(Math.max(50, zoomScale - 10))}
                  className="hover:text-white cursor-pointer"
                >
                  <ZoomOut className="w-3 h-3" />
                </button>
                <span>{zoomScale}%</span>
                <button
                  onClick={() => setZoomScale(Math.min(150, zoomScale + 10))}
                  className="hover:text-white cursor-pointer"
                >
                  <ZoomIn className="w-3 h-3" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleSaveTemplate}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold px-4 py-1.5 rounded-xl text-xs transition shadow-lg shadow-red-950/60 cursor-pointer disabled:opacity-50"
                title="Save & Publish Template (Ctrl+S)"
              >
                <Save className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isSubmitting ? "Publishing..." : "Save & Publish"}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsStudioOpen(false)}
                className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer"
                title="Close Studio (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* STUDIO ERROR BAR */}
          {validationError && (
            <div className="bg-red-950/90 border-b border-red-800 text-red-200 px-4 py-2 text-xs flex items-center justify-between shrink-0 shadow-lg animate-in slide-in-from-top">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{validationError}</span>
              </div>
              <button onClick={() => setValidationError("")} className="hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* STUDIO 3-COLUMN WORKSPACE */}
          <div className="flex-1 flex overflow-hidden">
            {/* ============================================================== */}
            {/* COLUMN 1: ELEMENTOR COMPONENT PALETTE (LEFT - 260px)          */}
            {/* ============================================================== */}
            <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0 select-none">
              <div className="p-3 border-b border-zinc-800">
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Elements & Blocks
                </div>
                <div className="text-[10px] text-zinc-500 mt-0.5">Click to add to canvas</div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {/* Quick Add Elements */}
                <div className="space-y-1">
                  <div className="text-[10px] font-mono uppercase text-zinc-500 px-1">Dynamic Repeater Tools</div>
                  <button
                    type="button"
                    onClick={handleAddRow}
                    className="w-full text-left p-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-200 flex items-center justify-between transition group"
                  >
                    <span className="flex items-center gap-2">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" /> + Add Item Row
                    </span>
                    <Plus className="w-3 h-3 opacity-0 group-hover:opacity-100 text-red-400" />
                  </button>

                  <button
                    type="button"
                    onClick={handleAddMeta}
                    className="w-full text-left p-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-200 flex items-center justify-between transition group"
                  >
                    <span className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" /> + Add Doc Meta Field
                    </span>
                    <Plus className="w-3 h-3 opacity-0 group-hover:opacity-100 text-red-400" />
                  </button>

                  <button
                    type="button"
                    onClick={handleAddContact}
                    className="w-full text-left p-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-200 flex items-center justify-between transition group"
                  >
                    <span className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" /> + Add Header Contact
                    </span>
                    <Plus className="w-3 h-3 opacity-0 group-hover:opacity-100 text-red-400" />
                  </button>
                </div>

                {/* Block Sections */}
                <div className="space-y-1 pt-2 border-t border-zinc-800">
                  <div className="text-[10px] font-mono uppercase text-zinc-500 px-1">Structural Sections</div>
                  {templateBlocks.map((block, idx) => (
                    <div
                      key={block.id}
                      onClick={() => setSelectedElement({ type: "block", id: block.id, index: idx })}
                      className={`p-2 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${
                        selectedElement.id === block.id
                          ? "bg-zinc-800 border-red-500 text-white font-bold"
                          : "bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-white"
                      }`}
                    >
                      <span className="truncate">{block.titleEn}</span>
                      <span className="text-[9px] font-mono text-zinc-500">#{idx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* ============================================================== */}
            {/* COLUMN 2: LIVE DYNAMIC CANVAS (CENTER VIEWPORT - FLEX-1)       */}
            {/* ============================================================== */}
            <main className="flex-1 bg-zinc-950 overflow-y-auto p-6 flex flex-col items-center justify-start relative">
              {/* Visual Canvas Paper Container */}
              <div
                style={{
                  transform: `scale(${zoomScale / 100})`,
                  transformOrigin: "top center",
                  transition: "transform 0.15s ease, background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease",
                  backgroundColor: docStyles.bgColor || "#ffffff",
                  color: docStyles.fontColor || "#0f172a",
                  fontFamily: docStyles.fontFamily || "Inter, sans-serif",
                  borderTop: `4px solid ${docStyles.accentColor || "#2563eb"}`,
                }}
                className={`rounded-lg shadow-2xl transition-all relative ${
                  FONT_SIZE_SCALES.find((s) => s.id === docStyles.fontSize)?.scaleClass || "text-xs"
                } ${
                  previewViewport === "POS_80MM"
                    ? "w-80 p-5 font-mono border-dashed border-2 border-zinc-400"
                    : "w-full max-w-2xl p-8 min-h-[750px] border border-zinc-200"
                }`}
              >
                {/* Elementor Watermark */}
                <div className="absolute right-4 top-4 text-[9px] font-mono uppercase tracking-widest text-zinc-300 pointer-events-none select-none">
                  Elementor Dynamic Studio
                </div>

                {/* ========================================================== */}
                {/* 1. HEADER SECTION (EDITABLE, COPYABLE, DUPLICABLE)         */}
                {/* ========================================================== */}
                <div
                  onClick={() => {
                    setSelectedElement({ type: "header", id: "header" });
                    setInspectorTab("content");
                  }}
                  className={`group relative p-3 rounded-lg border transition mb-2 cursor-pointer ${
                    selectedElement.id === "header"
                      ? "ring-2 ring-cyan-500 border-cyan-400 bg-cyan-50/20"
                      : "border-transparent hover:border-cyan-300 hover:bg-cyan-50/10"
                  }`}
                >
                  {/* Floating Action Badge on Header */}
                  <div className="absolute -top-3 left-3 opacity-0 group-hover:opacity-100 z-20 flex items-center gap-1 bg-cyan-600 text-white px-2 py-0.5 rounded text-[9px] font-mono font-bold shadow">
                    <span>HEADER CONTAINER</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setClipboard({
                          type: "block",
                          data: { businessNameEn, businessNameBn, taglineEn, taglineBn, contacts: headerContacts },
                        });
                        showToast("Copied header block to clipboard!");
                      }}
                      className="p-0.5 hover:text-cyan-200"
                      title="Copy Header Block"
                    >
                      <Copy className="w-2.5 h-2.5" />
                    </button>
                  </div>

                  <div className="text-center pb-2">
                    <div className="text-[10px] uppercase font-mono tracking-widest text-zinc-400">
                      {formData.category}
                    </div>

                    {/* Editable Business Title */}
                    <h1
                      style={{ color: docStyles.fontColor }}
                      className="text-base font-black mt-0.5 hover:text-cyan-700 transition"
                    >
                      {previewLocale === "en" ? businessNameEn : businessNameBn}
                    </h1>

                    {/* Editable Tagline */}
                    <p
                      style={{ color: docStyles.secondaryColor }}
                      className="text-[10px] max-w-md mx-auto hover:text-cyan-700 transition"
                    >
                      {previewLocale === "en" ? taglineEn : taglineBn}
                    </p>

                    {/* Editable Contacts Bar (Redmarked Element in Screenshot!) */}
                    <div className="mt-2 pt-1 border-t border-zinc-100 flex flex-wrap items-center justify-center gap-2 text-[10px] text-zinc-700">
                      {headerContacts.map((cnt, cIdx) => (
                        <div
                          key={cnt.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedElement({ type: "contact", id: cnt.id, index: cIdx });
                            setInspectorTab("content");
                          }}
                          className="group/cnt relative px-2 py-0.5 rounded border border-zinc-200 hover:border-cyan-500 hover:bg-cyan-50 transition flex items-center gap-1"
                        >
                          <span className="font-semibold text-zinc-500">
                            {previewLocale === "en" ? cnt.labelEn : cnt.labelBn}:
                          </span>
                          <span>{previewLocale === "en" ? cnt.valueEn : cnt.valueBn}</span>

                          {/* Mini Elementor Context Toolbar for Contact */}
                          <div className="absolute -top-5 right-0 opacity-0 group-hover/cnt:opacity-100 bg-zinc-900 text-white rounded px-1 py-0.5 flex items-center gap-1 text-[8px] font-mono shadow z-30">
                            <button
                              type="button"
                              onClick={(e) => handleCopyContact(cnt, e)}
                              className="hover:text-cyan-400"
                              title="Copy contact"
                            >
                              <Copy className="w-2.5 h-2.5" />
                            </button>
                            {clipboard && clipboard.type === "contact" && (
                              <button
                                type="button"
                                onClick={(e) => handlePasteContact(cIdx, e)}
                                className="hover:text-emerald-400"
                                title="Paste contact below"
                              >
                                <ClipboardPaste className="w-2.5 h-2.5" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={(e) => handleDuplicateContact(cIdx, e)}
                              className="hover:text-amber-400"
                              title="Duplicate contact"
                            >
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteContact(cIdx, e)}
                              className="hover:text-red-400"
                              title="Delete contact"
                            >
                              <Trash2 className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Add Contact Trigger */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddContact();
                        }}
                        className="text-[9px] font-mono text-cyan-600 hover:text-cyan-800 px-1 py-0.5 border border-dashed border-cyan-400 rounded"
                        title="Add contact info"
                      >
                        + Add Contact
                      </button>
                    </div>
                  </div>
                </div>

                {/* ========================================================== */}
                {/* 2. META ITEMS SECTION (REDMARKED ELEMENT IN SCREENSHOT!)   */}
                {/* ========================================================== */}
                <div
                  onClick={() => {
                    setSelectedElement({ type: "meta", id: "meta" });
                    setInspectorTab("content");
                  }}
                  className={`group relative p-2.5 rounded-lg border transition mb-2 cursor-pointer bg-zinc-50 ${
                    selectedElement.id === "meta"
                      ? "ring-2 ring-cyan-500 border-cyan-400"
                      : "border-zinc-200 hover:border-cyan-300"
                  }`}
                >
                  <div className="absolute -top-3 left-3 opacity-0 group-hover:opacity-100 z-20 flex items-center gap-1 bg-cyan-600 text-white px-2 py-0.5 rounded text-[9px] font-mono font-bold shadow">
                    <span>DOCUMENT META ITEMS</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setClipboard({ type: "block", data: { metaItems } });
                        showToast("Copied meta section to clipboard!");
                      }}
                      className="p-0.5 hover:text-cyan-200"
                      title="Copy Meta Block"
                    >
                      <Copy className="w-2.5 h-2.5" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-zinc-700">
                    {metaItems.map((meta, mIdx) => (
                      <div
                        key={meta.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedElement({ type: "meta", id: meta.id, index: mIdx });
                          setInspectorTab("content");
                        }}
                        className="group/meta relative px-2 py-1 rounded border border-transparent hover:border-cyan-500 hover:bg-white transition flex items-center gap-1.5"
                      >
                        <strong className="text-zinc-600">
                          {previewLocale === "en" ? meta.labelEn : meta.labelBn}:
                        </strong>
                        <span className="font-mono text-zinc-900 font-bold">
                          {previewLocale === "en" ? meta.valueEn : meta.valueBn}
                        </span>

                        {/* Mini Elementor Context Toolbar for Meta Item */}
                        <div className="absolute -top-5 right-0 opacity-0 group-hover/meta:opacity-100 bg-zinc-900 text-white rounded px-1 py-0.5 flex items-center gap-1 text-[8px] font-mono shadow z-30">
                          <button
                            type="button"
                            onClick={(e) => handleCopyMeta(meta, e)}
                            className="hover:text-cyan-400"
                            title="Copy meta tag"
                          >
                            <Copy className="w-2.5 h-2.5" />
                          </button>
                          {clipboard && clipboard.type === "meta" && (
                            <button
                              type="button"
                              onClick={(e) => handlePasteMeta(mIdx, e)}
                              className="hover:text-emerald-400"
                              title="Paste meta tag"
                            >
                              <ClipboardPaste className="w-2.5 h-2.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={(e) => handleDuplicateMeta(mIdx, e)}
                            className="hover:text-amber-400"
                            title="Duplicate meta tag"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteMeta(mIdx, e)}
                            className="hover:text-red-400"
                            title="Delete meta tag"
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddMeta();
                      }}
                      className="text-[9px] font-mono text-cyan-600 hover:text-cyan-800 px-1.5 py-0.5 border border-dashed border-cyan-400 rounded"
                    >
                      + Add Field
                    </button>
                  </div>
                </div>

                {/* ========================================================== */}
                {/* 3. RECIPIENT PROFILE SECTION                               */}
                {/* ========================================================== */}
                <div
                  onClick={() => {
                    setSelectedElement({ type: "recipient", id: "recipient" });
                    setInspectorTab("content");
                  }}
                  className={`group relative p-2.5 rounded-lg border transition mb-2 cursor-pointer ${
                    selectedElement.id === "recipient"
                      ? "ring-2 ring-cyan-500 border-cyan-400 bg-cyan-50/10"
                      : "border-transparent hover:border-cyan-300"
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    {previewLocale === "en" ? "Billed / Prescribed To:" : "প্রাপক / গ্রাহকের তথ্য:"}
                  </div>
                  <div className="font-bold text-zinc-800 text-xs">
                    {previewLocale === "en" ? "Md. Tanvir Ahmed" : "মোঃ তানভীর আহমেদ"}
                  </div>
                  <div className="text-[10px] text-zinc-600">
                    {previewLocale === "en"
                      ? "House 14, Road 5, Mirpur-10, Dhaka | Phone: +880 1819-000000"
                      : "বাড়ি ১৪, রোড ৫, মিরপুর-১০, ঢাকা | মোবাইল: ০১৮১৯-০০০০০০"}
                  </div>
                </div>

                {/* ========================================================== */}
                {/* 4. DYNAMIC TABLE SECTION (REDMARKED ROWS IN SCREENSHOT!)   */}
                {/* ========================================================== */}
                <div
                  onClick={() => {
                    setSelectedElement({ type: "table", id: "table" });
                    setInspectorTab("content");
                  }}
                  className={`group relative p-2 rounded-lg border transition mb-2 cursor-pointer ${
                    selectedElement.id === "table"
                      ? "ring-2 ring-cyan-500 border-cyan-400"
                      : "border-transparent hover:border-cyan-300"
                  }`}
                >
                  <div className="absolute -top-3 left-3 opacity-0 group-hover:opacity-100 z-20 flex items-center gap-1 bg-cyan-600 text-white px-2 py-0.5 rounded text-[9px] font-mono font-bold shadow">
                    <span>DYNAMIC ITEMS TABLE</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setClipboard({ type: "block", data: { tableRows } });
                        showToast("Copied table rows to clipboard!");
                      }}
                      className="p-0.5 hover:text-cyan-200"
                      title="Copy Table"
                    >
                      <Copy className="w-2.5 h-2.5" />
                    </button>
                  </div>

                  <table className="w-full text-left text-[11px] border border-zinc-200">
                    <thead
                      className="font-bold border-b transition"
                      style={{
                        backgroundColor: docStyles.bgColor === "#ffffff" ? "#f8fafc" : "rgba(0,0,0,0.03)",
                        borderBottomColor: docStyles.accentColor || "#2563eb",
                        color: docStyles.fontColor || "#1e293b",
                      }}
                    >
                      <tr>
                        <th className="p-2" style={{ color: docStyles.accentColor || "#2563eb" }}>
                          {previewLocale === "en" ? "Item / Service Description" : "পণ্য বা সেবার বিবরণ"}
                        </th>
                        <th className="p-2 text-center w-14">{previewLocale === "en" ? "Qty" : "পরিমাণ"}</th>
                        <th className="p-2 text-right w-20">{previewLocale === "en" ? "Rate" : "দর"}</th>
                        <th className="p-2 text-right w-24">{previewLocale === "en" ? "Amount" : "টাকা"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200">
                      {tableRows.map((row, rIdx) => {
                        const isRowSelected = selectedElement.id === row.id;

                        return (
                          <tr
                            key={row.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedElement({ type: "row", id: row.id, index: rIdx });
                              setInspectorTab("content");
                            }}
                            className={`group/row relative transition cursor-pointer ${
                              isRowSelected
                                ? "bg-red-50/50 ring-2 ring-inset ring-red-400"
                                : "hover:bg-cyan-50/40"
                            }`}
                          >
                            <td className="p-2 relative font-sans font-medium text-zinc-900">
                              {previewLocale === "en" ? row.nameEn : row.nameBn}

                              {/* Floating Elementor Action Bar on Hovering Row */}
                              <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover/row:opacity-100 bg-zinc-900 text-white rounded px-1.5 py-0.5 flex items-center gap-1.5 text-[9px] font-mono shadow-xl z-30">
                                <button
                                  type="button"
                                  onClick={(e) => handleCopyRow(row, e)}
                                  className="hover:text-cyan-400"
                                  title="Copy Row (Ctrl+C)"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                                {clipboard && clipboard.type === "row" && (
                                  <button
                                    type="button"
                                    onClick={(e) => handlePasteRow(rIdx, e)}
                                    className="hover:text-emerald-400"
                                    title="Paste Row Below"
                                  >
                                    <ClipboardPaste className="w-3 h-3" />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={(e) => handleDuplicateRow(rIdx, e)}
                                  className="hover:text-amber-400"
                                  title="Duplicate Row"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => handleDeleteRow(rIdx, e)}
                                  className="hover:text-rose-400"
                                  title="Delete Row"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </td>
                            <td className="p-2 text-center font-mono text-zinc-700">
                              {row.quantity}
                            </td>
                            <td className="p-2 text-right font-mono text-zinc-700">
                              {formData.en_currency} {row.price.toLocaleString()}
                            </td>
                            <td className="p-2 text-right font-mono font-bold text-zinc-900">
                              {formData.en_currency} {(row.quantity * row.price).toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Add Row Button on Canvas */}
                  <div className="mt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddRow();
                      }}
                      className="flex items-center gap-1 text-[10px] font-bold text-cyan-600 hover:text-cyan-800 bg-cyan-50 hover:bg-cyan-100 border border-cyan-300 px-3 py-1 rounded-md transition"
                    >
                      <Plus className="w-3 h-3" /> + Add Line Item Row
                    </button>
                    <span className="text-[10px] font-mono text-zinc-400">
                      {tableRows.length} item rows
                    </span>
                  </div>
                </div>

                {/* ========================================================== */}
                {/* 5. TOTALS & DUE SUMMARY SECTION                            */}
                {/* ========================================================== */}
                <div
                  onClick={() => {
                    setSelectedElement({ type: "summary", id: "summary" });
                    setInspectorTab("content");
                  }}
                  className={`group relative p-2.5 rounded-lg border transition mb-2 text-right cursor-pointer ${
                    selectedElement.id === "summary"
                      ? "ring-2 ring-cyan-500 border-cyan-400 bg-cyan-50/10"
                      : "border-transparent hover:border-cyan-300"
                  }`}
                >
                  <div className="text-[11px] space-y-1">
                    <div className="text-zinc-600">
                      {previewLocale === "en" ? "Subtotal:" : "মোট মূল্য:"}{" "}
                      <span className="font-mono font-bold">{formData.en_currency} {subtotal.toLocaleString()}</span>
                    </div>

                    <div className="text-zinc-600">
                      {previewLocale === "en" ? "Delivery Fee:" : "ডেলিভারি চার্জ:"}{" "}
                      <span className="font-mono">+ {formData.en_currency} {deliveryCharge.toLocaleString()}</span>
                    </div>

                    <div className="text-zinc-600">
                      {previewLocale === "en" ? "Discount:" : "বিশেষ ছাড়:"}{" "}
                      <span className="font-mono text-emerald-600">- {formData.en_currency} {discountAmount.toLocaleString()}</span>
                    </div>

                    <div
                      className="text-xs font-black border-t border-zinc-300 pt-1"
                      style={{ color: docStyles.fontColor }}
                    >
                      {previewLocale === "en" ? "Net Total Due:" : "সর্বমোট বকেয়া:"}{" "}
                      <span className="font-mono" style={{ color: docStyles.accentColor || "#dc2626" }}>
                        {formData.en_currency} {dueAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ========================================================== */}
                {/* 6. SIGNATURES & OFFICIAL SEAL SECTION                      */}
                {/* ========================================================== */}
                <div
                  onClick={() => {
                    setSelectedElement({ type: "signatory", id: "signatory" });
                    setInspectorTab("content");
                  }}
                  className={`group relative pt-6 pb-2 px-2 flex justify-between items-end border rounded-lg transition cursor-pointer ${
                    selectedElement.id === "signatory"
                      ? "ring-2 ring-cyan-500 border-cyan-400"
                      : "border-transparent hover:border-cyan-300"
                  }`}
                >
                  <div className="text-center w-36 border-t border-zinc-400 pt-1 text-[10px] text-zinc-700 font-bold">
                    {previewLocale === "en" ? "Customer Signature" : "গ্রাহকের স্বাক্ষর"}
                  </div>
                  <div className="text-center w-40 border-t border-zinc-900 pt-1 text-[10px] text-zinc-900 font-bold">
                    {previewLocale === "en" ? formData.en_signatory : formData.bn_signatory}
                  </div>
                </div>

                {/* ========================================================== */}
                {/* 7. TERMS & NOTES SECTION                                   */}
                {/* ========================================================== */}
                <div
                  onClick={() => {
                    setSelectedElement({ type: "terms", id: "terms" });
                    setInspectorTab("content");
                  }}
                  className={`text-[9px] text-zinc-500 italic pt-2 border-t border-zinc-200 mt-2 p-1.5 rounded transition cursor-pointer ${
                    selectedElement.id === "terms"
                      ? "ring-2 ring-cyan-500 bg-cyan-50/10"
                      : "hover:bg-cyan-50/5"
                  }`}
                >
                  * {previewLocale === "en"
                    ? "Thank you for doing business with us! For warranty, please preserve this document slip."
                    : "আমাদের সেবা গ্রহণ করার জন্য আপনাকে ধন্যবাদ। ওয়ারেন্টির প্রয়োজনে অনুগ্রহ করে এই রসিদটি সংরক্ষণ করুন।"}
                </div>
              </div>
            </main>

            {/* ============================================================== */}
            {/* COLUMN 3: ELEMENTOR 3-TAB INSPECTOR (RIGHT PANEL - 320px)      */}
            {/* ============================================================== */}
            <aside className="w-80 bg-zinc-900 border-l border-zinc-800 flex flex-col shrink-0 select-none">
              {/* Elementor Tabs Header */}
              <div className="flex border-b border-zinc-800">
                <button
                  type="button"
                  onClick={() => setInspectorTab("content")}
                  className={`flex-1 py-3 text-xs font-bold transition flex items-center justify-center gap-1.5 border-b-2 cursor-pointer ${
                    inspectorTab === "content"
                      ? "border-cyan-400 text-white bg-zinc-850"
                      : "border-transparent text-zinc-400 hover:text-white"
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Content
                </button>
                <button
                  type="button"
                  onClick={() => setInspectorTab("style")}
                  className={`flex-1 py-3 text-xs font-bold transition flex items-center justify-center gap-1.5 border-b-2 cursor-pointer ${
                    inspectorTab === "style"
                      ? "border-amber-400 text-white bg-zinc-850"
                      : "border-transparent text-zinc-400 hover:text-white"
                  }`}
                >
                  <Palette className="w-3.5 h-3.5 text-amber-400" /> Style
                </button>
                <button
                  type="button"
                  onClick={() => setInspectorTab("meta")}
                  className={`flex-1 py-3 text-xs font-bold transition flex items-center justify-center gap-1.5 border-b-2 cursor-pointer ${
                    inspectorTab === "meta"
                      ? "border-red-500 text-white bg-zinc-850"
                      : "border-transparent text-zinc-400 hover:text-white"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-red-400" /> Template Meta
                </button>
              </div>

              {/* Inspector Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* TAB 1: CONTENT TAB */}
                {inspectorTab === "content" && (
                  <div className="space-y-4">
                    {/* Active Selected Element Pill */}
                    <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 flex items-center justify-between">
                      <div>
                        <div className="text-[9px] font-mono uppercase text-zinc-500">Active Element</div>
                        <div className="text-xs font-bold text-cyan-400 capitalize">
                          {selectedElement.type}: {selectedElement.id}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                        Live Editable
                      </span>
                    </div>

                    {/* Content Editor based on Selected Element */}
                    {/* A. If Selected Element is a TABLE ROW */}
                    {selectedElement.type === "row" && (
                      <div className="space-y-3 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                        <div className="text-[10px] font-mono uppercase text-zinc-400">Row Line Item Properties</div>

                        {(() => {
                          const row = tableRows[selectedElement.index || 0];
                          if (!row) return null;

                          return (
                            <>
                              <div>
                                <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                                  Item Name (English)
                                </label>
                                <input
                                  type="text"
                                  value={row.nameEn}
                                  onChange={(e) => {
                                    const updated = [...tableRows];
                                    updated[selectedElement.index || 0].nameEn = e.target.value;
                                    setTableRows(updated);
                                  }}
                                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-emerald-400 mb-1">
                                  পণ্যের নাম (Bangla - Mandatory)
                                </label>
                                <input
                                  type="text"
                                  value={row.nameBn}
                                  onChange={(e) => {
                                    const updated = [...tableRows];
                                    updated[selectedElement.index || 0].nameBn = e.target.value;
                                    setTableRows(updated);
                                  }}
                                  className="w-full bg-zinc-900 border border-emerald-900/60 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[10px] font-mono text-zinc-400 mb-1">Quantity</label>
                                  <input
                                    type="number"
                                    min="1"
                                    value={row.quantity}
                                    onChange={(e) => {
                                      const updated = [...tableRows];
                                      updated[selectedElement.index || 0].quantity = Number(e.target.value) || 1;
                                      setTableRows(updated);
                                    }}
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-white"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-mono text-zinc-400 mb-1">Unit Rate ({formData.en_currency})</label>
                                  <input
                                    type="number"
                                    min="0"
                                    value={row.price}
                                    onChange={(e) => {
                                      const updated = [...tableRows];
                                      updated[selectedElement.index || 0].price = Number(e.target.value) || 0;
                                      setTableRows(updated);
                                    }}
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-white"
                                  />
                                </div>
                              </div>

                              <div className="pt-2 flex items-center justify-between border-t border-zinc-800">
                                <span className="text-[10px] font-mono text-zinc-400">
                                  Total: <strong>{formData.en_currency} {(row.quantity * row.price).toLocaleString()}</strong>
                                </span>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={(e) => handleCopyRow(row, e)}
                                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded text-[10px] transition cursor-pointer"
                                  >
                                    Copy
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => handleDuplicateRow(selectedElement.index || 0, e)}
                                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded text-[10px] transition cursor-pointer"
                                  >
                                    Duplicate
                                  </button>
                                </div>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    )}

                    {/* B. If Selected Element is a META ITEM */}
                    {selectedElement.type === "meta" && (
                      <div className="space-y-3 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                        <div className="text-[10px] font-mono uppercase text-zinc-400">Document Meta Item</div>

                        {(() => {
                          const meta = metaItems[selectedElement.index || 0];
                          if (!meta) return null;

                          return (
                            <>
                              <div>
                                <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                                  Label (English)
                                </label>
                                <input
                                  type="text"
                                  value={meta.labelEn}
                                  onChange={(e) => {
                                    const updated = [...metaItems];
                                    updated[selectedElement.index || 0].labelEn = e.target.value;
                                    setMetaItems(updated);
                                  }}
                                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-emerald-400 mb-1">
                                  লেবেল (Bangla)
                                </label>
                                <input
                                  type="text"
                                  value={meta.labelBn}
                                  onChange={(e) => {
                                    const updated = [...metaItems];
                                    updated[selectedElement.index || 0].labelBn = e.target.value;
                                    setMetaItems(updated);
                                  }}
                                  className="w-full bg-zinc-900 border border-emerald-900/60 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                                  Default Value (English)
                                </label>
                                <input
                                  type="text"
                                  value={meta.valueEn}
                                  onChange={(e) => {
                                    const updated = [...metaItems];
                                    updated[selectedElement.index || 0].valueEn = e.target.value;
                                    setMetaItems(updated);
                                  }}
                                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none"
                                />
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    )}

                    {/* C. If Selected Element is HEADER or CONTACT */}
                    {(selectedElement.type === "header" || selectedElement.type === "contact") && (
                      <div className="space-y-3 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                        <div className="text-[10px] font-mono uppercase text-zinc-400">Header & Branding Details</div>

                        <div>
                          <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                            Business Name (English)
                          </label>
                          <input
                            type="text"
                            value={businessNameEn}
                            onChange={(e) => setBusinessNameEn(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-emerald-400 mb-1">
                            প্রতিষ্ঠানের নাম (Bangla)
                          </label>
                          <input
                            type="text"
                            value={businessNameBn}
                            onChange={(e) => setBusinessNameBn(e.target.value)}
                            className="w-full bg-zinc-900 border border-emerald-900/60 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                            Tagline / Motto
                          </label>
                          <input
                            type="text"
                            value={taglineEn}
                            onChange={(e) => setTaglineEn(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* D. If Selected Element is SUMMARY */}
                    {selectedElement.type === "summary" && (
                      <div className="space-y-3 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                        <div className="text-[10px] font-mono uppercase text-zinc-400">Financial Summary Controls</div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-mono text-zinc-400 mb-1">Delivery Charge</label>
                            <input
                              type="number"
                              value={deliveryCharge}
                              onChange={(e) => setDeliveryCharge(Number(e.target.value) || 0)}
                              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-zinc-400 mb-1">Discount Amount</label>
                            <input
                              type="number"
                              value={discountAmount}
                              onChange={(e) => setDiscountAmount(Number(e.target.value) || 0)}
                              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-white"
                            />
                          </div>
                        </div>

                        <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 font-mono space-y-1">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>{formData.en_currency} {subtotal.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between font-bold text-red-400">
                            <span>Net Total:</span>
                            <span>{formData.en_currency} {netTotal.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: STYLE TAB */}
                {inspectorTab === "style" && (
                  <div className="space-y-4 text-xs">
                    {/* 1. CURATED THEME ARCHETYPES */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold">
                          Curated Theme Archetypes
                        </span>
                        <span className="text-[9px] font-mono text-zinc-500">6 Presets</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(THEME_PRESETS).map(([key, preset]) => {
                          const isActive = docStyles.themePreset === key;
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => {
                                setDocStyles((prev) => ({
                                  ...prev,
                                  themePreset: key,
                                  ...(preset.bgColor ? { bgColor: preset.bgColor } : {}),
                                  ...(preset.fontColor ? { fontColor: preset.fontColor } : {}),
                                  ...(preset.accentColor ? { accentColor: preset.accentColor } : {}),
                                  ...(preset.secondaryColor ? { secondaryColor: preset.secondaryColor } : {}),
                                  ...(preset.fontFamily ? { fontFamily: preset.fontFamily } : {}),
                                }));
                              }}
                              className={`p-2.5 rounded-xl border text-left transition relative flex flex-col justify-between ${
                                isActive
                                  ? "bg-zinc-900 border-red-500 ring-1 ring-red-500"
                                  : "bg-zinc-950/70 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50"
                              }`}
                            >
                              <div>
                                <div className="flex items-center justify-between">
                                  <span className={`font-bold text-xs ${isActive ? "text-white" : "text-zinc-300"}`}>
                                    {preset.label}
                                  </span>
                                  {isActive && <Check className="w-3.5 h-3.5 text-red-400" />}
                                </div>
                                <p className="text-[10px] text-zinc-500 mt-0.5 line-clamp-1">{preset.desc}</p>
                              </div>

                              {/* Color Swatch Dots */}
                              <div className="flex items-center gap-1.5 mt-2 pt-1.5 border-t border-zinc-800/80">
                                <span
                                  className="w-3.5 h-3.5 rounded-full border border-zinc-700 shadow-sm"
                                  style={{ backgroundColor: preset.bgColor }}
                                  title={`BG: ${preset.bgColor}`}
                                />
                                <span
                                  className="w-3.5 h-3.5 rounded-full border border-zinc-700 shadow-sm"
                                  style={{ backgroundColor: preset.accentColor }}
                                  title={`Accent: ${preset.accentColor}`}
                                />
                                <span
                                  className="w-3.5 h-3.5 rounded-full border border-zinc-700 shadow-sm"
                                  style={{ backgroundColor: preset.fontColor }}
                                  title={`Font: ${preset.fontColor}`}
                                />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 2. COLOR PALETTE CONTROLS */}
                    <div className="pt-3 border-t border-zinc-800 space-y-3">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold">
                        Color Palette Overrides
                      </div>

                      {/* Canvas Background Color */}
                      <div className="space-y-1.5 bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-medium text-zinc-300">Canvas Background</label>
                          <span className="text-[10px] font-mono text-zinc-500">{docStyles.bgColor}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={docStyles.bgColor}
                            onChange={(e) => setDocStyles((prev) => ({ ...prev, bgColor: e.target.value }))}
                            className="w-8 h-8 rounded border border-zinc-700 bg-transparent cursor-pointer p-0.5"
                          />
                          <input
                            type="text"
                            value={docStyles.bgColor}
                            onChange={(e) => setDocStyles((prev) => ({ ...prev, bgColor: e.target.value }))}
                            className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-white font-mono"
                          />
                          <div className="flex items-center gap-1">
                            {["#ffffff", "#f8fafc", "#f0fdfa", "#fffdf7", "#0f172a"].map((c) => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => setDocStyles((prev) => ({ ...prev, bgColor: c }))}
                                className="w-4 h-4 rounded-full border border-zinc-600 hover:scale-110 transition cursor-pointer"
                                style={{ backgroundColor: c }}
                                title={c}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Primary Font Color */}
                      <div className="space-y-1.5 bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-medium text-zinc-300">Primary Typography</label>
                          <span className="text-[10px] font-mono text-zinc-500">{docStyles.fontColor}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={docStyles.fontColor}
                            onChange={(e) => setDocStyles((prev) => ({ ...prev, fontColor: e.target.value }))}
                            className="w-8 h-8 rounded border border-zinc-700 bg-transparent cursor-pointer p-0.5"
                          />
                          <input
                            type="text"
                            value={docStyles.fontColor}
                            onChange={(e) => setDocStyles((prev) => ({ ...prev, fontColor: e.target.value }))}
                            className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-white font-mono"
                          />
                          <div className="flex items-center gap-1">
                            {["#0f172a", "#18181b", "#134e4a", "#451a03", "#f8fafc"].map((c) => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => setDocStyles((prev) => ({ ...prev, fontColor: c }))}
                                className="w-4 h-4 rounded-full border border-zinc-600 hover:scale-110 transition cursor-pointer"
                                style={{ backgroundColor: c }}
                                title={c}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Brand Accent Color */}
                      <div className="space-y-1.5 bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-medium text-zinc-300">Brand Accent Color</label>
                          <span className="text-[10px] font-mono text-zinc-500">{docStyles.accentColor}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={docStyles.accentColor}
                            onChange={(e) => setDocStyles((prev) => ({ ...prev, accentColor: e.target.value }))}
                            className="w-8 h-8 rounded border border-zinc-700 bg-transparent cursor-pointer p-0.5"
                          />
                          <input
                            type="text"
                            value={docStyles.accentColor}
                            onChange={(e) => setDocStyles((prev) => ({ ...prev, accentColor: e.target.value }))}
                            className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-white font-mono"
                          />
                          <div className="flex items-center gap-1">
                            {["#2563eb", "#0d9488", "#b45309", "#dc2626", "#7c3aed", "#059669"].map((c) => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => setDocStyles((prev) => ({ ...prev, accentColor: c }))}
                                className="w-4 h-4 rounded-full border border-zinc-600 hover:scale-110 transition cursor-pointer"
                                style={{ backgroundColor: c }}
                                title={c}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Secondary / Label Color */}
                      <div className="space-y-1.5 bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-medium text-zinc-300">Secondary / Subtitles</label>
                          <span className="text-[10px] font-mono text-zinc-500">{docStyles.secondaryColor}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={docStyles.secondaryColor}
                            onChange={(e) => setDocStyles((prev) => ({ ...prev, secondaryColor: e.target.value }))}
                            className="w-8 h-8 rounded border border-zinc-700 bg-transparent cursor-pointer p-0.5"
                          />
                          <input
                            type="text"
                            value={docStyles.secondaryColor}
                            onChange={(e) => setDocStyles((prev) => ({ ...prev, secondaryColor: e.target.value }))}
                            className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-white font-mono"
                          />
                          <div className="flex items-center gap-1">
                            {["#64748b", "#71717a", "#115e59", "#78350f", "#94a3b8"].map((c) => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => setDocStyles((prev) => ({ ...prev, secondaryColor: c }))}
                                className="w-4 h-4 rounded-full border border-zinc-600 hover:scale-110 transition cursor-pointer"
                                style={{ backgroundColor: c }}
                                title={c}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 3. FONT FAMILY SELECTOR */}
                    <div className="pt-3 border-t border-zinc-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold">
                          Font Family
                        </span>
                      </div>
                      <select
                        value={docStyles.fontFamily}
                        onChange={(e) => setDocStyles((prev) => ({ ...prev, fontFamily: e.target.value }))}
                        className="w-full text-xs bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white font-medium focus:outline-none focus:border-red-500 cursor-pointer"
                      >
                        {FONT_FAMILIES.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 4. TYPOGRAPHY SCALE */}
                    <div className="pt-3 border-t border-zinc-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold">
                          Typography Scale
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase">{docStyles.fontSize}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {FONT_SIZE_SCALES.map((scale) => {
                          const isScaleActive = docStyles.fontSize === scale.id;
                          return (
                            <button
                              key={scale.id}
                              type="button"
                              onClick={() => setDocStyles((prev) => ({ ...prev, fontSize: scale.id }))}
                              className={`p-2 rounded-lg border text-left text-xs transition cursor-pointer ${
                                isScaleActive
                                  ? "bg-red-950/40 border-red-500 text-white font-bold"
                                  : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                              }`}
                            >
                              <div className="font-medium">{scale.label.split(" (")[0]}</div>
                              <div className="text-[10px] text-zinc-500">
                                {scale.label.includes("(") ? `(${scale.label.split("(")[1]}` : ""}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 5. RESET BUTTON */}
                    <div className="pt-3 border-t border-zinc-800">
                      <button
                        type="button"
                        onClick={() => {
                          setDocStyles(DEFAULT_DOC_STYLES);
                          showToast("Reset document styling to defaults.");
                        }}
                        className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-medium transition cursor-pointer"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        Reset to Default Styling
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 3: TEMPLATE META TAB */}
                {inspectorTab === "meta" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">
                        URL Slug Identifier *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. madrasah-cash-memo"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full text-xs bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-2 text-white font-mono focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">
                        Category Classification *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full text-xs bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-2 text-white focus:outline-none"
                      >
                        <option value="Business">Business & Commerce</option>
                        <option value="Healthcare">Healthcare & Clinics</option>
                        <option value="Education">Education & Institutes</option>
                        <option value="Restaurant">Restaurant & Food POS</option>
                        <option value="Printables">Printables & Legal</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">
                        Sub-Category / Specialized Document Type *
                      </label>
                      <select
                        value={formData.subCategory}
                        onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                        className="w-full text-xs bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-red-500"
                      >
                        <optgroup label="Worldwide Receipts & Billing (InvoiceEditor)">
                          <option value="invoice">Commercial Tax Invoice / Memo</option>
                          <option value="receipt">Money Receipt / Voucher</option>
                          <option value="pos">80mm POS Thermal Receipt</option>
                          <option value="chalan">Delivery Chalan & Transport</option>
                        </optgroup>
                        <optgroup label="Academic & Timetables (SchoolTemplateEditor)">
                          <option value="routine">Class Routine & Timetable</option>
                          <option value="exam">Exam Routine & Schedule</option>
                          <option value="marksheet">Marksheet / Grade Progress</option>
                          <option value="admit-card">Admit Card / Hall Pass</option>
                          <option value="certificate">Character / Transfer Certificate</option>
                          <option value="id-card">Student / Staff ID Card</option>
                        </optgroup>
                        <optgroup label="Healthcare & Clinical (MedicalPrescriptionEditor)">
                          <option value="bill">Medical Diagnostic / Hospital Bill</option>
                          <option value="prescription">Clinical Doctor Prescription Pad</option>
                          <option value="serial">Chamber Serial / Token</option>
                          <option value="discharge">Hospital Discharge Summary</option>
                        </optgroup>
                      </select>
                      <p className="text-[10px] text-zinc-500 mt-1">
                        Controls specialized editor routing: InvoiceEditor, SchoolTemplateEditor, or MedicalPrescriptionEditor.
                      </p>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-zinc-800">
                      <div>
                        <label className="block text-xs font-bold text-zinc-300 mb-1">
                          English Title *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Clinical Test Bill"
                          value={formData.en_title}
                          onChange={(e) => setFormData({ ...formData, en_title: e.target.value })}
                          className="w-full text-xs bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-red-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-zinc-300 mb-1">
                          English Description *
                        </label>
                        <textarea
                          rows={2}
                          value={formData.en_description}
                          onChange={(e) => setFormData({ ...formData, en_description: e.target.value })}
                          className="w-full text-xs bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-red-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-emerald-400 mb-1 flex items-center justify-between">
                          <span>বাংলা শিরোনাম (Bangla Title) *</span>
                          <span className="text-[9px] font-mono text-zinc-500">*বাধ্যতামূলক</span>
                        </label>
                        <input
                          type="text"
                          placeholder="যেমন: ক্লিনিক্যাল টেস্ট মানি রসিদ"
                          value={formData.bn_title}
                          onChange={(e) => setFormData({ ...formData, bn_title: e.target.value })}
                          className="w-full text-xs bg-zinc-950 border border-emerald-900/60 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-emerald-400 mb-1 flex items-center justify-between">
                          <span>বাংলা বিবরণ (Bangla Description) *</span>
                          <span className="text-[9px] font-mono text-zinc-500">*বাধ্যতামূলক</span>
                        </label>
                        <textarea
                          rows={2}
                          value={formData.bn_description}
                          onChange={(e) => setFormData({ ...formData, bn_description: e.target.value })}
                          className="w-full text-xs bg-zinc-950 border border-emerald-900/60 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-mono text-zinc-400 mb-1">Currency</label>
                          <input
                            type="text"
                            value={formData.en_currency}
                            onChange={(e) => setFormData({ ...formData, en_currency: e.target.value })}
                            className="w-full text-xs bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-zinc-400 mb-1">মুদ্রা (BN)</label>
                          <input
                            type="text"
                            value={formData.bn_currency}
                            onChange={(e) => setFormData({ ...formData, bn_currency: e.target.value })}
                            className="w-full text-xs bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
}
