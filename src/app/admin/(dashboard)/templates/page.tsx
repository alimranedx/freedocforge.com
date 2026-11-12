"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  LayoutGrid,
  List,
  FolderTree,
  RotateCw,
  ExternalLink,
  ChevronRight,
  Printer,
  FileSpreadsheet,
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
  CheckSquare,
  BadgeAlert,
  Building2,
  Calendar,
  UserCheck,
  Receipt,
  FileSignature,
} from "lucide-react";
import { INITIAL_TEMPLATES, TemplateDefinition } from "@/lib/templates";

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

// Available Smart CMS Components in the Block Palette
const COMPONENT_PALETTE = [
  {
    category: "Identity & Header",
    icon: Building2,
    items: [
      {
        type: "header",
        titleEn: "Brand & Company Header",
        titleBn: "প্রতিষ্ঠান ও ব্র্যান্ড হেডার",
        descriptionEn: "Business title, logo, contact phone, address, and BIN/Tax ID",
        descriptionBn: "প্রতিষ্ঠানের নাম, লোগো, ফোন, ঠিকানা ও ট্রেড লাইসেন্স",
        options: { showLogo: true, showTagline: true, showContact: true, showTaxId: false, theme: "modern" },
      },
      {
        type: "header",
        titleEn: "Clinical Doctor Rx Header",
        titleBn: "চিকিৎসক ও ক্লিনিক্যাল হেডার",
        descriptionEn: "Doctor name, MBBS/FCPS degrees, BMDC reg no, chamber timings",
        descriptionBn: "চিকিৎসকের নাম, ডিগ্রি, বিএমডিসি রেজিঃ নং ও চেম্বার সময়সূচি",
        options: { showLogo: true, showTagline: true, showContact: true, showTaxId: true, theme: "clinical" },
      },
      {
        type: "header",
        titleEn: "Academic School Crest Header",
        titleBn: "বিদ্যালয় বা শিক্ষা প্রতিষ্ঠান হেডার",
        descriptionEn: "Institute name, EIIN code, establishment year, board affiliation",
        descriptionBn: "শিক্ষা প্রতিষ্ঠানের নাম, ইআইআইএন কোড ও বোর্ড স্বীকৃতি",
        options: { showLogo: true, showTagline: true, showContact: true, showTaxId: false, theme: "academic" },
      },
    ],
  },
  {
    category: "Metadata & Tracking",
    icon: Calendar,
    items: [
      {
        type: "meta",
        titleEn: "Invoice & Document Serial Meta",
        titleBn: "নথির তথ্য ও স্মারক তারিখ",
        descriptionEn: "Invoice / Bill / Rx serial number, issue date, due date",
        descriptionBn: "বিল বা প্রেসক্রিপশন নম্বর, তারিখ ও কুরিয়ার ডেলিভারি",
        options: { showDate: true, showDueDate: false, showCourier: true },
      },
      {
        type: "qrcode",
        titleEn: "Anti-Counterfeit QR Code Token",
        titleBn: "নিরাপত্তা কিউআর কোড ভেরিফিকেশন",
        descriptionEn: "Scannable digital QR token for document authenticity verification",
        descriptionBn: "নথির সত্যতা যাচাইকরণ স্ক্যান কোড ও সুরক্ষা বারকোড",
        options: { qrLabel: "VERIFIED AUTHENTIC DOCUMENT", showSerial: true },
      },
    ],
  },
  {
    category: "Recipient & Client",
    icon: UserCheck,
    items: [
      {
        type: "recipient",
        titleEn: "Customer Profile Card",
        titleBn: "ক্রেতার নাম ও ডেলিভারি বিবরণ",
        descriptionEn: "Customer name, mobile number, shipping address, note",
        descriptionBn: "গ্রাহকের নাম, মোবাইল নম্বর ও ডেলিভারি ঠিকানা",
        options: { showPhone: true, showAddress: true, showCustomId: false },
      },
      {
        type: "recipient",
        titleEn: "Clinical Patient Record",
        titleBn: "রোগীর নাম ও শারীরিক তথ্য",
        descriptionEn: "Patient name, age, sex, blood pressure, weight",
        descriptionBn: "রোগীর বয়স, লিঙ্গ, ওজন এবং রক্তচাপ বিবরণ",
        options: { showPhone: true, showAddress: true, showCustomId: true, isPatient: true },
      },
    ],
  },
  {
    category: "Tables & Grids",
    icon: FileSpreadsheet,
    items: [
      {
        type: "table",
        titleEn: "Product Sales & Services Table",
        titleBn: "পণ্য বা সেবার বিবরণী ছক",
        descriptionEn: "Line items table with quantity, unit rate, and total price",
        descriptionBn: "পণ্যের নাম, পরিমাণ, একক দর ও মোট টাকার হিসাব",
        options: { showQuantity: true, showUnitPrice: true, showItemCode: false, theme: "bordered" },
      },
      {
        type: "table",
        titleEn: "Clinical Diagnostic Pathology Tests",
        titleBn: "ডায়াগনস্টিক টেস্ট ও প্যাথলজি তালিকা",
        descriptionEn: "Diagnostic investigations list, sample collection time, room no",
        descriptionBn: "প্যাথলজিক্যাল পরীক্ষা তালিকা, স্যাম্পল সংগ্রহ সময়",
        options: { showQuantity: false, showUnitPrice: true, showItemCode: true, theme: "clinical" },
      },
    ],
  },
  {
    category: "Totals & Calculation",
    icon: Receipt,
    items: [
      {
        type: "summary",
        titleEn: "Financial Totals & Due Balance",
        titleBn: "মোট হিসাব, ছাড় ও বকেয়া",
        descriptionEn: "Subtotal, VAT %, delivery fee, special discount, and net due",
        descriptionBn: "সাবটোটাল, ভ্যাট, ডেলিভারি চার্জ, ছাড় ও মোট বকেয়া টাকা",
        options: { showTax: false, showDiscount: true, showDelivery: true, showPaidDue: true },
      },
    ],
  },
  {
    category: "Signatures & Seals",
    icon: FileSignature,
    items: [
      {
        type: "signatory",
        titleEn: "Authorized Signatory Authority",
        titleBn: "অনুমোদিত স্বাক্ষর ও সিলমোহর",
        descriptionEn: "Executive authorized signature, official company stamp line",
        descriptionBn: "কর্মকর্তার স্বাক্ষর ও প্রাতিষ্ঠানিক সিলমোহর",
        options: { showSeal: true, titleEn: "Authorized Signature", titleBn: "অনুমোদিত স্বাক্ষর" },
      },
      {
        type: "signatory",
        titleEn: "BMDC Doctor Stamp & Registration",
        titleBn: "বিএমডিসি চিকিৎসকের সিল ও স্বাক্ষর",
        descriptionEn: "Physician stamp line with official medical council reg number",
        descriptionBn: "চিকিৎসকের অফিসিয়াল সিলমোহর ও রেজিস্ট্রেশন স্বাক্ষর",
        options: { showSeal: true, titleEn: "Registered Physician Seal", titleBn: "চিকিৎসকের স্বাক্ষর ও সিল" },
      },
    ],
  },
  {
    category: "Terms & Policies",
    icon: ShieldCheck,
    items: [
      {
        type: "terms",
        titleEn: "Return Warranty & Payment Policy",
        titleBn: "পণ্য ফেরত শর্ত ও পেমেন্ট বিবরণ",
        descriptionEn: "7-day return conditions, bKash/Nagad merchant payment instructions",
        descriptionBn: "ওয়ারেন্টি নীতিমালা, বিকাশ বা ব্যাংক পেমেন্ট ও ফুটনোট",
        options: { showFooterNote: true, showPaymentQR: true },
      },
      {
        type: "callout",
        titleEn: "Important Notice / Warning Banner",
        titleBn: "জরুরি নোটিশ বা সতর্কবার্তা বক্স",
        descriptionEn: "High-contrast highlighted note for customers or patients",
        descriptionBn: "জরুরি নোটিশ বা বিশেষ নির্দেশনা সম্বলিত হাইলাইট বক্স",
        options: { calloutTheme: "alert" },
      },
    ],
  },
];

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

const CATEGORY_TABS = [
  { id: "all", label: "All Templates", icon: Layers, color: "text-zinc-300" },
  { id: "Business", label: "Business & Commerce", icon: ShoppingBag, color: "text-blue-400" },
  { id: "Healthcare", label: "Healthcare & Clinics", icon: Stethoscope, color: "text-emerald-400" },
  { id: "Education", label: "Education & Coaching", icon: GraduationCap, color: "text-amber-400" },
  { id: "Restaurant", label: "Restaurant & Food POS", icon: UtensilsCrossed, color: "text-rose-400" },
  { id: "Printables", label: "Printables & Legal", icon: FileText, color: "text-purple-400" },
  { id: "custom", label: "Custom Templates", icon: Sparkles, color: "text-cyan-400" },
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Viewport & Live Locale in Studio
  const [previewViewport, setPreviewViewport] = useState<"A4" | "POS_80MM">("A4");
  const [previewLocale, setPreviewLocale] = useState<"en" | "bn">("en");
  const [zoomScale, setZoomScale] = useState<number>(100);

  // Active Block Selection in Studio
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number>(0);
  const [inspectorTab, setInspectorTab] = useState<"block" | "meta">("block");
  const [paletteSearch, setPaletteSearch] = useState("");

  // Drag and Drop State
  const [draggedBlockIndex, setDraggedBlockIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Master Template Form Data
  const [formData, setFormData] = useState({
    id: "",
    slug: "",
    category: "Business",
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

  // Template Blocks on Canvas
  const [templateBlocks, setTemplateBlocks] = useState<TemplateBlock[]>(DEFAULT_BLOCKS);

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
      Business: 0,
      Healthcare: 0,
      Education: 0,
      Restaurant: 0,
      Printables: 0,
      custom: 0,
    };

    templates.forEach((t) => {
      if (counts[t.category] !== undefined) {
        counts[t.category] += 1;
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
      if (selectedCategory === "custom") {
        if (!t.isCustom) return false;
      } else if (selectedCategory !== "all" && t.category !== selectedCategory) {
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
      Business: [],
      Healthcare: [],
      Education: [],
      Restaurant: [],
      Printables: [],
    };

    filteredTemplates.forEach((t) => {
      if (groups[t.category]) {
        groups[t.category].push(t);
      } else {
        groups.Business.push(t);
      }
    });

    return groups;
  }, [filteredTemplates]);

  // Open Smart CMS Studio for Adding a New Template
  const handleOpenAddStudio = () => {
    setEditingTemplate(null);
    setValidationError("");
    setTemplateBlocks(DEFAULT_BLOCKS.map((b, i) => ({ ...b, order: i })));
    setFormData({
      id: "",
      slug: "",
      category: "Business",
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
    setPreviewViewport("A4");
    setPreviewLocale("en");
    setSelectedBlockIndex(0);
    setInspectorTab("meta");
    setIsStudioOpen(true);
  };

  // Open Smart CMS Studio for Modifying Existing Template
  const handleOpenEditStudio = (t: any) => {
    setEditingTemplate(t);
    setValidationError("");
    const blocks =
      t.blocks && Array.isArray(t.blocks) && t.blocks.length > 0
        ? t.blocks
        : DEFAULT_BLOCKS.map((b, i) => ({ ...b, order: i }));
    setTemplateBlocks(blocks);
    setFormData({
      id: t.id,
      slug: t.slug,
      category: t.category,
      paperSize: t.paperSize,
      isFeatured: Boolean(t.isFeatured),
      en_title: t.locales?.en?.title || t.title,
      en_description: t.locales?.en?.description || t.description,
      en_signatory: t.locales?.en?.defaultData?.signatoryTitle || "Authorized Signature",
      en_currency: t.locales?.en?.defaultData?.currency || "৳",
      bn_title: t.locales?.bn?.title || "",
      bn_description: t.locales?.bn?.description || "",
      bn_signatory: t.locales?.bn?.defaultData?.signatoryTitle || "অনুমোদিত স্বাক্ষর",
      bn_currency: t.locales?.bn?.defaultData?.currency || "৳",
    });
    setPreviewViewport(t.paperSize === "POS_80MM" ? "POS_80MM" : "A4");
    setPreviewLocale("en");
    setSelectedBlockIndex(0);
    setInspectorTab("block");
    setIsStudioOpen(true);
  };

  // Drag and Drop Block Movement
  const handleDragStart = (index: number) => {
    setDraggedBlockIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (index: number) => {
    if (draggedBlockIndex === null || draggedBlockIndex === index) {
      setDragOverIndex(null);
      setDraggedBlockIndex(null);
      return;
    }
    const reordered = [...templateBlocks];
    const [movedItem] = reordered.splice(draggedBlockIndex, 1);
    reordered.splice(index, 0, movedItem);
    const updated = reordered.map((b, idx) => ({ ...b, order: idx }));
    setTemplateBlocks(updated);
    setSelectedBlockIndex(index);
    setDraggedBlockIndex(null);
    setDragOverIndex(null);
  };

  // Reorder via arrow buttons
  const moveBlock = (index: number, direction: "up" | "down", e?: React.MouseEvent) => {
    e?.stopPropagation();
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= templateBlocks.length) return;
    const reordered = [...templateBlocks];
    const [movedItem] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, movedItem);
    const updated = reordered.map((b, idx) => ({ ...b, order: idx }));
    setTemplateBlocks(updated);
    setSelectedBlockIndex(targetIndex);
  };

  // Add Block from Palette
  const handleAddPaletteItem = (item: any) => {
    const newId = `${item.type}_${Date.now()}`;
    const newBlock: TemplateBlock = {
      id: newId,
      type: item.type,
      titleEn: item.titleEn,
      titleBn: item.titleBn,
      enabled: true,
      order: templateBlocks.length,
      descriptionEn: item.descriptionEn,
      descriptionBn: item.descriptionBn,
      options: { ...item.options },
    };
    setTemplateBlocks([...templateBlocks, newBlock]);
    setSelectedBlockIndex(templateBlocks.length);
    setInspectorTab("block");
  };

  // Duplicate Block
  const handleDuplicateBlock = (index: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const target = templateBlocks[index];
    const duplicated: TemplateBlock = {
      ...target,
      id: `${target.type}_${Date.now()}`,
      titleEn: `${target.titleEn} (Copy)`,
      titleBn: `${target.titleBn} (কপি)`,
      order: index + 1,
    };
    const updated = [...templateBlocks];
    updated.splice(index + 1, 0, duplicated);
    setTemplateBlocks(updated.map((b, i) => ({ ...b, order: i })));
    setSelectedBlockIndex(index + 1);
  };

  // Delete Block
  const handleDeleteBlock = (index: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (templateBlocks.length <= 1) {
      alert("A template must contain at least 1 layout block.");
      return;
    }
    const updated = templateBlocks.filter((_, i) => i !== index).map((b, idx) => ({ ...b, order: idx }));
    setTemplateBlocks(updated);
    setSelectedBlockIndex(Math.max(0, index - 1));
  };

  // Toggle Block Visibility
  const toggleBlockEnabled = (index: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setTemplateBlocks((prev) =>
      prev.map((b, i) => (i === index ? { ...b, enabled: !b.enabled } : b))
    );
  };

  // Save Template with strict EN + BN validation
  const handleSaveTemplate = async () => {
    setValidationError("");

    // 1. Strict English Validation
    if (!formData.slug || !formData.en_title || !formData.en_description) {
      setInspectorTab("meta");
      setValidationError("Mandatory Requirement: English Title, URL Slug, and Description must be provided.");
      return;
    }

    // 2. Strict Bangla Validation
    if (!formData.bn_title || !formData.bn_description) {
      setInspectorTab("meta");
      setValidationError(
        "Mandatory Requirement: FreeDocForge strictly requires the Bangla (বাংলা) version of this template as well before publishing!"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        id: editingTemplate ? editingTemplate.id : undefined,
        slug: formData.slug.toLowerCase().replace(/\s+/g, "-"),
        category: formData.category,
        paperSize: formData.paperSize,
        isFeatured: formData.isFeatured,
        en_title: formData.en_title,
        en_description: formData.en_description,
        en_signatory: formData.en_signatory,
        en_currency: formData.en_currency,
        bn_title: formData.bn_title,
        bn_description: formData.bn_description,
        bn_signatory: formData.bn_signatory,
        bn_currency: formData.bn_currency,
        blocks: templateBlocks,
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

  // Keyboard Shortcuts (Ctrl+S / Cmd+S to Save)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s" && isStudioOpen) {
        e.preventDefault();
        handleSaveTemplate();
      }
      if (e.key === "Escape" && isStudioOpen) {
        setIsStudioOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isStudioOpen, formData, templateBlocks]);

  const activeSelectedBlock = templateBlocks[selectedBlockIndex] || null;

  return (
    <div className="space-y-8 max-w-7xl font-sans text-zinc-100">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black uppercase tracking-wider text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-red-500" />
              Template CMS & Visual Studio
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
            Browse templates separated by category, design custom documents with our Smart CMS drag-and-drop studio, and enforce dual-locale (English + বাংলা) parity.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchTemplates}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-2 rounded-xl text-xs transition border border-zinc-700 cursor-pointer disabled:opacity-50"
            title="Reload templates from database"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Sync
          </button>
          <button
            onClick={handleOpenAddStudio}
            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-lg shadow-red-950/50 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Launch Smart CMS Studio
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {CATEGORY_TABS.map((cat) => {
          const Icon = cat.icon;
          const count = categoryCounts[cat.id] || 0;
          const isActive = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-3.5 rounded-2xl border text-left transition relative cursor-pointer ${
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
              <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                {cat.id === "all" ? "Full Catalog" : "Category Filter"}
              </div>
            </button>
          );
        })}
      </div>

      {/* SEARCH, FILTER & VIEW CONTROLS */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
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

        {/* Paper Format & Layout Switcher */}
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
            <span> in <strong className="text-red-400 capitalize">{selectedCategory}</strong></span>
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
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${
                            t.category === "Business"
                              ? "bg-blue-950/60 text-blue-400 border-blue-800/60"
                              : t.category === "Healthcare"
                              ? "bg-emerald-950/60 text-emerald-400 border-emerald-800/60"
                              : t.category === "Education"
                              ? "bg-amber-950/60 text-amber-400 border-amber-800/60"
                              : t.category === "Restaurant"
                              ? "bg-rose-950/60 text-rose-400 border-rose-800/60"
                              : "bg-purple-950/60 text-purple-400 border-purple-800/60"
                          }`}
                        >
                          {t.category}
                        </span>
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
                            Smart CMS Custom
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
                            title="Open in Smart CMS Studio"
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
          {Object.entries(groupedByCategory).map(([catName, catTemplates]) => {
            if (catTemplates.length === 0) return null;

            return (
              <div key={catName} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-zinc-800 border border-zinc-700 text-red-400">
                      {catName === "Business" && <ShoppingBag className="w-4 h-4 text-blue-400" />}
                      {catName === "Healthcare" && <Stethoscope className="w-4 h-4 text-emerald-400" />}
                      {catName === "Education" && <GraduationCap className="w-4 h-4 text-amber-400" />}
                      {catName === "Restaurant" && <UtensilsCrossed className="w-4 h-4 text-rose-400" />}
                      {catName === "Printables" && <FileText className="w-4 h-4 text-purple-400" />}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-white">{catName} Templates</h3>
                      <p className="text-[11px] text-zinc-400 font-mono">
                        {catTemplates.length} templates available in this category
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-full border border-zinc-700">
                    Category: {catName}
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
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      t.category === "Business"
                        ? "bg-blue-950/60 text-blue-400"
                        : t.category === "Healthcare"
                        ? "bg-emerald-950/60 text-emerald-400"
                        : t.category === "Education"
                        ? "bg-amber-950/60 text-amber-400"
                        : "bg-rose-950/60 text-rose-400"
                    }`}
                  >
                    {t.category}
                  </span>
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
      {/* 4. HIGH-LEVEL SMART CMS VISUAL DRAG-AND-DROP STUDIO (MODAL)   */}
      {/* ============================================================== */}
      {isStudioOpen && (
        <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col font-sans text-zinc-100 overflow-hidden animate-in fade-in">
          {/* STUDIO TOP COMMAND BAR */}
          <header className="h-14 bg-zinc-900 border-b border-zinc-800 px-4 flex items-center justify-between shrink-0 select-none">
            {/* Left: Branding & Current Editing Status */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-2.5 py-1 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[11px] font-mono font-black tracking-wider text-white">DOCFORGE SMART CMS</span>
              </div>

              <div className="hidden md:flex items-center gap-1.5 text-xs text-zinc-400">
                <span className="text-zinc-600">/</span>
                <span className="font-semibold text-white truncate max-w-xs">
                  {formData.en_title || "Untitled Template"}
                </span>
                <span className="text-[10px] font-mono text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">
                  /{formData.slug || "slug"}
                </span>
              </div>
            </div>

            {/* Center: Device Viewport & Live Locale Switcher */}
            <div className="flex items-center gap-2">
              {/* Device Viewport */}
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

              {/* Live Preview Dual-Locale Switcher */}
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
            {/* COLUMN 1: COMPONENT PALETTE (LEFT PANEL - 280px)              */}
            {/* ============================================================== */}
            <aside className="w-72 bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0 select-none">
              <div className="p-3 border-b border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-red-400" /> Block Palette
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">Drag or click +</span>
                </div>
                <div className="relative">
                  <Search className="w-3 h-3 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search blocks..."
                    value={paletteSearch}
                    onChange={(e) => setPaletteSearch(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-7 pr-2 py-1 text-[11px] text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Categorized Palette Items */}
              <div className="flex-1 overflow-y-auto p-3 space-y-4">
                {COMPONENT_PALETTE.map((catGroup) => {
                  const filteredItems = catGroup.items.filter(
                    (it) =>
                      it.titleEn.toLowerCase().includes(paletteSearch.toLowerCase()) ||
                      it.titleBn.toLowerCase().includes(paletteSearch.toLowerCase())
                  );
                  if (filteredItems.length === 0) return null;

                  const GroupIcon = catGroup.icon;

                  return (
                    <div key={catGroup.category} className="space-y-1.5">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 flex items-center gap-1.5 px-1">
                        <GroupIcon className="w-3 h-3 text-zinc-400" />
                        <span>{catGroup.category}</span>
                      </div>

                      <div className="space-y-1">
                        {filteredItems.map((item, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleAddPaletteItem(item)}
                            className="p-2.5 rounded-xl bg-zinc-950/80 hover:bg-zinc-800/80 border border-zinc-800/80 hover:border-zinc-700 cursor-pointer transition flex items-center justify-between group"
                          >
                            <div className="pr-2">
                              <div className="text-xs font-bold text-white group-hover:text-red-400 transition truncate">
                                {item.titleEn}
                              </div>
                              <div className="text-[10px] text-zinc-400 font-sans truncate">
                                {item.titleBn}
                              </div>
                            </div>
                            <button
                              type="button"
                              className="p-1 rounded-md bg-zinc-900 group-hover:bg-red-600 text-zinc-400 group-hover:text-white transition shrink-0"
                              title="Add this section to canvas"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </aside>

            {/* ============================================================== */}
            {/* COLUMN 2: LIVE RESPONSIVE CANVAS (CENTER VIEWPORT - FLEX-1)    */}
            {/* ============================================================== */}
            <main className="flex-1 bg-zinc-950 overflow-y-auto p-6 flex flex-col items-center justify-start relative">
              {/* Visual Canvas Paper Container */}
              <div
                style={{
                  transform: `scale(${zoomScale / 100})`,
                  transformOrigin: "top center",
                  transition: "transform 0.15s ease",
                }}
                className={`bg-white text-zinc-900 rounded-lg shadow-2xl transition-all relative ${
                  previewViewport === "POS_80MM"
                    ? "w-80 p-5 font-mono text-xs border-dashed border-2 border-zinc-400"
                    : "w-full max-w-2xl p-8 font-sans text-xs min-h-[750px] border border-zinc-200"
                }`}
              >
                {/* Visual Watermark Badge */}
                <div className="absolute right-4 top-4 text-[9px] font-mono uppercase tracking-widest text-zinc-300 pointer-events-none select-none">
                  FreeDocForge Printable CMS
                </div>

                {/* Render Canvas Blocks with Interactive Drag & Drop */}
                {templateBlocks.map((block, index) => {
                  const isSelected = selectedBlockIndex === index;
                  const isDragOver = dragOverIndex === index;

                  return (
                    <div
                      key={block.id}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={() => handleDrop(index)}
                      onClick={() => {
                        setSelectedBlockIndex(index);
                        setInspectorTab("block");
                      }}
                      className={`relative group transition rounded-lg my-1 p-2 cursor-pointer ${
                        !block.enabled ? "opacity-30 bg-zinc-100" : ""
                      } ${
                        isSelected
                          ? "ring-2 ring-red-500 bg-red-50/30"
                          : "hover:ring-1 hover:ring-zinc-400 hover:bg-zinc-50/50"
                      } ${isDragOver ? "border-t-4 border-red-500" : ""}`}
                    >
                      {/* Floating Mini Action Toolbar (Visible on Hover/Selected) */}
                      <div
                        className={`absolute -top-3.5 right-2 z-20 flex items-center gap-1 bg-zinc-900 text-white rounded-md shadow-lg px-1.5 py-0.5 text-[10px] font-mono transition-opacity ${
                          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        <div
                          className="cursor-grab active:cursor-grabbing p-0.5 hover:text-red-400"
                          title="Drag to rearrange position"
                        >
                          <GripVertical className="w-3 h-3" />
                        </div>
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={(e) => moveBlock(index, "up", e)}
                          className="p-0.5 hover:text-red-400 disabled:opacity-30"
                          title="Move Up"
                        >
                          <ChevronUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          disabled={index === templateBlocks.length - 1}
                          onClick={(e) => moveBlock(index, "down", e)}
                          className="p-0.5 hover:text-red-400 disabled:opacity-30"
                          title="Move Down"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDuplicateBlock(index, e)}
                          className="p-0.5 hover:text-emerald-400"
                          title="Duplicate block"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => toggleBlockEnabled(index, e)}
                          className={`px-1 rounded text-[9px] ${
                            block.enabled ? "text-emerald-400" : "text-zinc-500"
                          }`}
                          title="Toggle Active/Inactive"
                        >
                          {block.enabled ? "ON" : "OFF"}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteBlock(index, e)}
                          className="p-0.5 hover:text-rose-400"
                          title="Delete Block"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      {/* BLOCK RENDERING LOGIC */}
                      {/* Block Type: Header */}
                      {block.type === "header" && (
                        <div className="text-center pb-2 border-b border-zinc-200">
                          <div className="text-[10px] uppercase font-mono tracking-widest text-zinc-400">
                            {previewLocale === "en" ? formData.category : "ক্যাটাগরি"}
                          </div>
                          <h1 className="text-base font-black text-zinc-900 mt-0.5">
                            {previewLocale === "en"
                              ? formData.en_title || "Sample Business / Clinic Name"
                              : formData.bn_title || "নমুনা প্রতিষ্ঠান বা ক্লিনিকের নাম"}
                          </h1>
                          <p className="text-[10px] text-zinc-500 max-w-md mx-auto">
                            {previewLocale === "en"
                              ? formData.en_description || "Quality Products & Diagnostic Services"
                              : formData.bn_description || "গুণগত মানসম্পন্ন সেবা ও দ্রুততম ডেলিভারি"}
                          </p>
                          {block.options?.showContact && (
                            <div className="text-[10px] text-zinc-600 mt-1">
                              {previewLocale === "en"
                                ? "Phone: +880 1712-000000 | Dhaka - 1205, Bangladesh"
                                : "ফোন: ০১৭১২-০০০০০০ | ঢাকা - ১২০৫, বাংলাদেশ"}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Block Type: Meta */}
                      {block.type === "meta" && (
                        <div className="flex justify-between items-center text-[10px] text-zinc-700 py-1.5 bg-zinc-50 px-3 rounded border border-zinc-100">
                          <div>
                            <strong>{previewLocale === "en" ? "Doc / Memo No:" : "নথি / মেমো নং:"}</strong> #DOC-2026-089
                          </div>
                          <div>
                            <strong>{previewLocale === "en" ? "Issue Date:" : "ইস্যু তারিখ:"}</strong> 2026-11-12
                          </div>
                          {block.options?.showCourier && (
                            <div>
                              <strong>{previewLocale === "en" ? "Courier:" : "কুরিয়ার:"}</strong> Steadfast BD
                            </div>
                          )}
                        </div>
                      )}

                      {/* Block Type: Recipient */}
                      {block.type === "recipient" && (
                        <div className="text-[11px] py-1">
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
                      )}

                      {/* Block Type: Table */}
                      {block.type === "table" && (
                        <div className="py-2">
                          <table className="w-full text-left text-[11px] border border-zinc-200">
                            <thead className="bg-zinc-100 text-zinc-700 font-bold border-b border-zinc-200">
                              <tr>
                                <th className="p-2">{previewLocale === "en" ? "Item / Service Description" : "পণ্য বা সেবার বিবরণ"}</th>
                                <th className="p-2 text-center">{previewLocale === "en" ? "Qty" : "পরিমাণ"}</th>
                                <th className="p-2 text-right">{previewLocale === "en" ? "Rate" : "দর"}</th>
                                <th className="p-2 text-right">{previewLocale === "en" ? "Amount" : "টাকা"}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200">
                              <tr>
                                <td className="p-2">
                                  {previewLocale === "en" ? "Premium Formal Cotton Shirt" : "প্রিমিয়াম সুতি ফরমাল শার্ট"}
                                </td>
                                <td className="p-2 text-center font-mono">2</td>
                                <td className="p-2 text-right font-mono">{formData.en_currency} 1,250</td>
                                <td className="p-2 text-right font-mono font-bold">{formData.en_currency} 2,500</td>
                              </tr>
                              <tr>
                                <td className="p-2">
                                  {previewLocale === "en" ? "Standard Service / Consultation Fee" : "সার্ভিস বা কনসাল্টেশন ফি"}
                                </td>
                                <td className="p-2 text-center font-mono">1</td>
                                <td className="p-2 text-right font-mono">{formData.en_currency} 500</td>
                                <td className="p-2 text-right font-mono font-bold">{formData.en_currency} 500</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Block Type: Summary */}
                      {block.type === "summary" && (
                        <div className="text-[11px] space-y-1 text-right py-1.5 border-t border-zinc-200 mt-1">
                          <div className="text-zinc-600">
                            {previewLocale === "en" ? "Subtotal:" : "মোট মূল্য:"}{" "}
                            <span className="font-mono">{formData.en_currency} 3,000</span>
                          </div>
                          {block.options?.showDelivery && (
                            <div className="text-zinc-600">
                              {previewLocale === "en" ? "Delivery Fee:" : "ডেলিভারি চার্জ:"}{" "}
                              <span className="font-mono">+ {formData.en_currency} 120</span>
                            </div>
                          )}
                          {block.options?.showDiscount && (
                            <div className="text-zinc-600">
                              {previewLocale === "en" ? "Discount:" : "বিশেষ ছাড়:"}{" "}
                              <span className="font-mono text-emerald-600">- {formData.en_currency} 100</span>
                            </div>
                          )}
                          <div className="text-xs font-black text-zinc-900 border-t border-zinc-300 pt-1">
                            {previewLocale === "en" ? "Net Total Due:" : "সর্বমোট বকেয়া:"}{" "}
                            <span className="font-mono text-red-600">{formData.en_currency} 3,020</span>
                          </div>
                        </div>
                      )}

                      {/* Block Type: Signatory */}
                      {block.type === "signatory" && (
                        <div className="pt-6 pb-2 flex justify-between items-end">
                          <div className="text-center w-36 border-t border-zinc-400 pt-1 text-[10px] text-zinc-700 font-bold">
                            {previewLocale === "en" ? "Customer Signature" : "গ্রাহকের স্বাক্ষর"}
                          </div>
                          <div className="text-center w-40 border-t border-zinc-900 pt-1 text-[10px] text-zinc-900 font-bold">
                            {previewLocale === "en" ? formData.en_signatory : formData.bn_signatory}
                          </div>
                        </div>
                      )}

                      {/* Block Type: Terms */}
                      {block.type === "terms" && (
                        <div className="text-[9px] text-zinc-500 italic pt-2 border-t border-zinc-200">
                          * {previewLocale === "en"
                            ? "Thank you for doing business with us! For warranty, please preserve this document slip."
                            : "আমাদের সেবা গ্রহণ করার জন্য আপনাকে ধন্যবাদ। ওয়ারেন্টির প্রয়োজনে অনুগ্রহ করে এই রসিদটি সংরক্ষণ করুন।"}
                        </div>
                      )}

                      {/* Block Type: QR Code */}
                      {block.type === "qrcode" && (
                        <div className="flex items-center gap-3 p-2 bg-zinc-50 rounded border border-zinc-200 my-1">
                          <div className="p-2 bg-white rounded border border-zinc-300">
                            <QrCode className="w-8 h-8 text-zinc-900" />
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-zinc-800">
                              {previewLocale === "en" ? "Digital Verification QR" : "ডিজিটাল ভেরিফিকেশন কোড"}
                            </div>
                            <div className="text-[9px] text-zinc-500 font-mono">
                              DOC-ID: FDF-8902-BD | Scan to verify originality
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Block Type: Callout */}
                      {block.type === "callout" && (
                        <div className="bg-amber-50 border-l-4 border-amber-500 p-2.5 rounded text-amber-900 text-[10px] my-1">
                          <strong>{previewLocale === "en" ? "Important Notice:" : "জরুরি নোটিশ:"}</strong>{" "}
                          {previewLocale === "en"
                            ? "Please verify parcel seal before making payment."
                            : "পণ্য বুঝে নিয়ে এবং সিলমোহর পরীক্ষা করে মূল্য পরিশোধ করুন।"}
                        </div>
                      )}

                      {/* Block Type: Custom */}
                      {block.type === "custom" && (
                        <div className="bg-zinc-100 p-2.5 rounded text-[10px] text-zinc-700 my-1">
                          <strong>{previewLocale === "en" ? block.titleEn : block.titleBn}:</strong> Custom configured block data.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </main>

            {/* ============================================================== */}
            {/* COLUMN 3: BLOCK & STYLE INSPECTOR (RIGHT PANEL - 320px)       */}
            {/* ============================================================== */}
            <aside className="w-80 bg-zinc-900 border-l border-zinc-800 flex flex-col shrink-0 select-none">
              {/* Inspector Top Tabs */}
              <div className="flex border-b border-zinc-800">
                <button
                  type="button"
                  onClick={() => setInspectorTab("block")}
                  className={`flex-1 py-3 text-xs font-bold transition flex items-center justify-center gap-1.5 border-b-2 cursor-pointer ${
                    inspectorTab === "block"
                      ? "border-red-500 text-white bg-zinc-850"
                      : "border-transparent text-zinc-400 hover:text-white"
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5 text-amber-400" /> Block Properties
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
                  <Globe className="w-3.5 h-3.5 text-blue-400" /> Template Meta
                </button>
              </div>

              {/* Inspector Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* 1. BLOCK INSPECTOR TAB */}
                {inspectorTab === "block" && activeSelectedBlock && (
                  <div className="space-y-4">
                    <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-mono uppercase text-zinc-500">Selected Block #{selectedBlockIndex + 1}</div>
                        <div className="text-xs font-bold text-white">{activeSelectedBlock.titleEn}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleBlockEnabled(selectedBlockIndex)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition cursor-pointer border ${
                          activeSelectedBlock.enabled
                            ? "bg-emerald-950/80 text-emerald-400 border-emerald-800"
                            : "bg-zinc-800 text-zinc-500 border-zinc-700"
                        }`}
                      >
                        {activeSelectedBlock.enabled ? "Active" : "Disabled"}
                      </button>
                    </div>

                    {/* Block Title (English) */}
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                        Block Title (English)
                      </label>
                      <input
                        type="text"
                        value={activeSelectedBlock.titleEn}
                        onChange={(e) => {
                          const updated = [...templateBlocks];
                          updated[selectedBlockIndex].titleEn = e.target.value;
                          setTemplateBlocks(updated);
                        }}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    {/* Block Title (Bangla - Mandatory) */}
                    <div>
                      <label className="block text-[11px] font-bold text-emerald-400 mb-1 flex items-center justify-between">
                        <span>বাংলা শিরোনাম (Bangla Title)</span>
                        <span className="text-[9px] font-mono text-zinc-500">*বাধ্যতামূলক</span>
                      </label>
                      <input
                        type="text"
                        value={activeSelectedBlock.titleBn}
                        onChange={(e) => {
                          const updated = [...templateBlocks];
                          updated[selectedBlockIndex].titleBn = e.target.value;
                          setTemplateBlocks(updated);
                        }}
                        className="w-full bg-zinc-950 border border-emerald-900/60 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {/* Block Options / Feature Toggles */}
                    <div className="space-y-2 pt-2 border-t border-zinc-800">
                      <div className="text-[10px] font-mono uppercase text-zinc-500">Block Configuration Toggles</div>

                      {activeSelectedBlock.type === "header" && (
                        <div className="space-y-2">
                          <label className="flex items-center justify-between text-xs text-zinc-300 cursor-pointer">
                            <span>Show Business Logo</span>
                            <input
                              type="checkbox"
                              checked={Boolean(activeSelectedBlock.options?.showLogo)}
                              onChange={(e) => {
                                const updated = [...templateBlocks];
                                updated[selectedBlockIndex].options = {
                                  ...updated[selectedBlockIndex].options,
                                  showLogo: e.target.checked,
                                };
                                setTemplateBlocks(updated);
                              }}
                              className="rounded text-red-600 focus:ring-0"
                            />
                          </label>
                          <label className="flex items-center justify-between text-xs text-zinc-300 cursor-pointer">
                            <span>Show Contact & Phone</span>
                            <input
                              type="checkbox"
                              checked={Boolean(activeSelectedBlock.options?.showContact)}
                              onChange={(e) => {
                                const updated = [...templateBlocks];
                                updated[selectedBlockIndex].options = {
                                  ...updated[selectedBlockIndex].options,
                                  showContact: e.target.checked,
                                };
                                setTemplateBlocks(updated);
                              }}
                              className="rounded text-red-600 focus:ring-0"
                            />
                          </label>
                        </div>
                      )}

                      {activeSelectedBlock.type === "summary" && (
                        <div className="space-y-2">
                          <label className="flex items-center justify-between text-xs text-zinc-300 cursor-pointer">
                            <span>Show Delivery Fee</span>
                            <input
                              type="checkbox"
                              checked={Boolean(activeSelectedBlock.options?.showDelivery)}
                              onChange={(e) => {
                                const updated = [...templateBlocks];
                                updated[selectedBlockIndex].options = {
                                  ...updated[selectedBlockIndex].options,
                                  showDelivery: e.target.checked,
                                };
                                setTemplateBlocks(updated);
                              }}
                              className="rounded text-red-600 focus:ring-0"
                            />
                          </label>
                          <label className="flex items-center justify-between text-xs text-zinc-300 cursor-pointer">
                            <span>Show Special Discount</span>
                            <input
                              type="checkbox"
                              checked={Boolean(activeSelectedBlock.options?.showDiscount)}
                              onChange={(e) => {
                                const updated = [...templateBlocks];
                                updated[selectedBlockIndex].options = {
                                  ...updated[selectedBlockIndex].options,
                                  showDiscount: e.target.checked,
                                };
                                setTemplateBlocks(updated);
                              }}
                              className="rounded text-red-600 focus:ring-0"
                            />
                          </label>
                        </div>
                      )}

                      {activeSelectedBlock.type === "signatory" && (
                        <div className="space-y-2">
                          <label className="flex items-center justify-between text-xs text-zinc-300 cursor-pointer">
                            <span>Show Official Stamp Seal</span>
                            <input
                              type="checkbox"
                              checked={Boolean(activeSelectedBlock.options?.showSeal)}
                              onChange={(e) => {
                                const updated = [...templateBlocks];
                                updated[selectedBlockIndex].options = {
                                  ...updated[selectedBlockIndex].options,
                                  showSeal: e.target.checked,
                                };
                                setTemplateBlocks(updated);
                              }}
                              className="rounded text-red-600 focus:ring-0"
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. TEMPLATE META INSPECTOR TAB */}
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

                    {/* Dual-Locale Title & Description */}
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
