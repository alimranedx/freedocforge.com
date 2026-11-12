"use client";

import React, { useState, useEffect, useMemo } from "react";
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

const DEFAULT_BLOCKS: TemplateBlock[] = [
  {
    id: "header",
    type: "header",
    titleEn: "Brand & Organization Header",
    titleBn: "প্রতিষ্ঠান ও ব্র্যান্ড পরিচিতি",
    enabled: true,
    order: 0,
    descriptionEn: "Business/Institute name, logo, phone, address, and license/BIN",
    descriptionBn: "প্রতিষ্ঠান বা ক্লিনিকের নাম, লোগো, ফোন নম্বর, ঠিকানা ও বিআইএন",
    options: { showLogo: true, showTagline: true, showContact: true, showTaxId: false },
  },
  {
    id: "meta",
    type: "meta",
    titleEn: "Document Identifier & Date Info",
    titleBn: "নথির তথ্য ও তারিখ",
    enabled: true,
    order: 1,
    descriptionEn: "Invoice / Rx / Token No, issue date, due date, courier",
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
    options: { showQuantity: true, showUnitPrice: true, showItemCode: false },
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

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"locales" | "blocks" | "preview">("locales");
  const [localeTab, setLocaleTab] = useState<"en" | "bn">("en");
  const [previewLocale, setPreviewLocale] = useState<"en" | "bn">("en");
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [validationError, setValidationError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State with mandatory EN and BN fields
  const [formData, setFormData] = useState({
    id: "",
    slug: "",
    category: "Business",
    paperSize: "A4",
    isFeatured: false,
    // English Version
    en_title: "",
    en_description: "",
    en_signatory: "Authorized Signature",
    en_currency: "৳",
    // Bangla Version (Mandatory!)
    bn_title: "",
    bn_description: "",
    bn_signatory: "অনুমোদিত স্বাক্ষর",
    bn_currency: "৳",
  });

  // Drag and Drop Visual Block Builder State
  const [templateBlocks, setTemplateBlocks] = useState<TemplateBlock[]>(DEFAULT_BLOCKS);
  const [draggedBlockIndex, setDraggedBlockIndex] = useState<number | null>(null);
  const [expandedBlockId, setExpandedBlockId] = useState<string | null>(null);

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
      // Category filter
      if (selectedCategory === "custom") {
        if (!t.isCustom) return false;
      } else if (selectedCategory !== "all" && t.category !== selectedCategory) {
        return false;
      }

      // Format filter
      if (formatFilter !== "all" && t.paperSize !== formatFilter) {
        return false;
      }

      // Search query filter
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

  // Group templates by category for Section View
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

  // Open Add Modal
  const handleOpenAddModal = () => {
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
    setModalTab("locales");
    setLocaleTab("en");
    setPreviewLocale("en");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (t: any) => {
    setEditingTemplate(t);
    setValidationError("");
    setTemplateBlocks(
      t.blocks && Array.isArray(t.blocks) && t.blocks.length > 0
        ? t.blocks
        : DEFAULT_BLOCKS.map((b, i) => ({ ...b, order: i }))
    );
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
    setModalTab("locales");
    setLocaleTab("en");
    setPreviewLocale("en");
    setIsModalOpen(true);
  };

  // Drag and Drop Handlers for Organizing Template Blocks
  const handleDragStart = (index: number) => {
    setDraggedBlockIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (index: number) => {
    if (draggedBlockIndex === null || draggedBlockIndex === index) return;
    const reordered = [...templateBlocks];
    const [movedItem] = reordered.splice(draggedBlockIndex, 1);
    reordered.splice(index, 0, movedItem);
    const updated = reordered.map((b, idx) => ({ ...b, order: idx }));
    setTemplateBlocks(updated);
    setDraggedBlockIndex(null);
  };

  // Reorder buttons (Move Up / Down)
  const moveBlock = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= templateBlocks.length) return;
    const reordered = [...templateBlocks];
    const [movedItem] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, movedItem);
    const updated = reordered.map((b, idx) => ({ ...b, order: idx }));
    setTemplateBlocks(updated);
  };

  // Toggle Block Visibility (Active / Inactive)
  const toggleBlockEnabled = (id: string) => {
    setTemplateBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, enabled: !b.enabled } : b))
    );
  };

  // Add Custom Section Block
  const handleAddCustomBlock = () => {
    const customId = `custom_${Date.now()}`;
    const newBlock: TemplateBlock = {
      id: customId,
      type: "custom",
      titleEn: "Custom Information Block",
      titleBn: "কাস্টম তথ্য সেকশন",
      enabled: true,
      order: templateBlocks.length,
      descriptionEn: "Custom key-value attributes or special policy note",
      descriptionBn: "বিশেষ তথ্য ফিল্ড বা পলিসি নোট",
      options: { customText: "" },
    };
    setTemplateBlocks([...templateBlocks, newBlock]);
    setExpandedBlockId(customId);
  };

  // Delete Block
  const handleDeleteBlock = (id: string) => {
    setTemplateBlocks((prev) =>
      prev.filter((b) => b.id !== id).map((b, idx) => ({ ...b, order: idx }))
    );
  };

  // Save Template with strict EN + BN validation
  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    // 1. Validate English fields
    if (!formData.slug || !formData.en_title || !formData.en_description) {
      setModalTab("locales");
      setLocaleTab("en");
      setValidationError("Mandatory Requirement: English Title, Slug, and Description must be provided.");
      return;
    }

    // 2. Strict Requirement: Validate Bangla fields
    if (!formData.bn_title || !formData.bn_description) {
      setModalTab("locales");
      setLocaleTab("bn");
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
          ? "Template updated successfully with verified English & Bangla locales!"
          : "New template published successfully with verified English & Bangla locales!"
      );

      setIsModalOpen(false);
      fetchTemplates();
      setTimeout(() => setSuccessMsg(""), 5000);
    } catch (err: any) {
      setValidationError(err.message || "An error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Custom Template
  const handleDeleteCustomTemplate = async (t: any) => {
    if (!confirm(`Are you sure you want to delete custom template '${t.title}'? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/templates?id=${t.id}&slug=${t.slug}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to delete template.");
        return;
      }
      setSuccessMsg(`Template '${t.title}' deleted successfully.`);
      fetchTemplates();
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      alert("Error deleting template: " + (err.message || "Unknown error"));
    }
  };

  return (
    <div className="space-y-8 max-w-7xl font-sans text-zinc-100">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black uppercase tracking-wider text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-red-500" />
              Template CMS & Dual-Locale Engine
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
            Browse templates separated by category, organize document layout sections with drag & drop, and publish verified dual-locale (English + বাংলা) editions.
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
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-lg shadow-red-950/40 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add New Template
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

      {/* QUICK CATEGORY METRIC TILES */}
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
          {/* Format Filter */}
          <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setFormatFilter("all")}
              className={`px-2.5 py-1 rounded-lg transition text-[11px] cursor-pointer ${
                formatFilter === "all" ? "bg-zinc-800 text-white font-bold" : "text-zinc-400 hover:text-white"
              }`}
            >
              All Sizes
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
              80mm Thermal
            </button>
          </div>

          {/* View Mode Toggle */}
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
                            Custom Admin
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
                            onClick={() => handleOpenEditModal(t)}
                            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1 text-xs transition cursor-pointer border border-zinc-700"
                            title="Organize Layout & Edit Details"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-red-400" /> Organize
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
                          {t.isCustom && (
                            <button
                              onClick={() => handleDeleteCustomTemplate(t)}
                              className="text-zinc-500 hover:text-red-400 p-1.5 rounded-lg transition cursor-pointer"
                              title="Delete Custom Template"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
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
                            onClick={() => handleOpenEditModal(t)}
                            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded text-xs transition cursor-pointer"
                          >
                            Organize
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
                    onClick={() => handleOpenEditModal(t)}
                    className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-red-400" /> Organize
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

      {/* DUAL-LOCALE & VISUAL DRAG-AND-DROP TEMPLATE ORGANIZER MODAL ("DARK DROP EDIT BOX") */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-4xl p-6 shadow-2xl space-y-5 my-8 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 shrink-0">
              <div>
                <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Settings2 className="w-4 h-4 text-red-500" />
                  {editingTemplate ? `Organize Template: ${editingTemplate.title}` : "Visual Template Builder & Dual-Locale Engine"}
                </h3>
                <p className="text-[11px] text-zinc-400">
                  Configure English and Bangla locales, drag & drop layout blocks, and preview your document before publishing.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-500 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ERROR ALERT */}
            {validationError && (
              <div className="bg-red-950/60 border border-red-800 text-red-300 px-4 py-3 rounded-xl text-xs flex items-center gap-2 shrink-0">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{validationError}</span>
              </div>
            )}

            {/* MODAL WORKSPACE TABS */}
            <div className="flex border-b border-zinc-800 shrink-0">
              <button
                type="button"
                onClick={() => setModalTab("locales")}
                className={`flex-1 py-2.5 text-xs font-bold transition flex items-center justify-center gap-2 border-b-2 cursor-pointer ${
                  modalTab === "locales"
                    ? "border-red-500 text-white bg-zinc-900/80"
                    : "border-transparent text-zinc-400 hover:text-white"
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                1. Dual-Locale & Metadata
              </button>

              <button
                type="button"
                onClick={() => setModalTab("blocks")}
                className={`flex-1 py-2.5 text-xs font-bold transition flex items-center justify-center gap-2 border-b-2 cursor-pointer ${
                  modalTab === "blocks"
                    ? "border-red-500 text-white bg-zinc-900/80"
                    : "border-transparent text-zinc-400 hover:text-white"
                }`}
              >
                <GripVertical className="w-3.5 h-3.5 text-amber-400" />
                2. Visual Block Organizer (Drag & Drop)
              </button>

              <button
                type="button"
                onClick={() => setModalTab("preview")}
                className={`flex-1 py-2.5 text-xs font-bold transition flex items-center justify-center gap-2 border-b-2 cursor-pointer ${
                  modalTab === "preview"
                    ? "border-red-500 text-white bg-zinc-900/80"
                    : "border-transparent text-zinc-400 hover:text-white"
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                3. Live Layout Preview
              </button>
            </div>

            {/* TAB CONTENT (SCROLLABLE AREA) */}
            <div className="overflow-y-auto flex-1 pr-1 space-y-4">
              {/* TAB 1: LOCALES & METADATA */}
              {modalTab === "locales" && (
                <div className="space-y-4">
                  {/* Meta Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-zinc-900/80 p-3.5 rounded-2xl border border-zinc-800">
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">
                        URL Identifier (Slug) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. madrasah-cash-memo"
                        className="w-full text-xs bg-zinc-950 border border-zinc-750 rounded-lg px-2.5 py-2 text-white font-mono focus:ring-1 focus:ring-red-500 focus:outline-none"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">
                        Category Classification *
                      </label>
                      <select
                        className="w-full text-xs bg-zinc-950 border border-zinc-750 rounded-lg px-2.5 py-2 text-white focus:outline-none"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                        Paper Format *
                      </label>
                      <select
                        className="w-full text-xs bg-zinc-950 border border-zinc-750 rounded-lg px-2.5 py-2 text-white focus:outline-none"
                        value={formData.paperSize}
                        onChange={(e) => setFormData({ ...formData, paperSize: e.target.value })}
                      >
                        <option value="A4">A4 Standard Sheet (210 x 297 mm)</option>
                        <option value="POS_80MM">80mm POS Thermal Receipt Roll</option>
                      </select>
                    </div>
                  </div>

                  {/* Bilingual Tabs Switcher */}
                  <div className="flex border-b border-zinc-800 mt-2">
                    <button
                      type="button"
                      onClick={() => setLocaleTab("en")}
                      className={`px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 border-b-2 cursor-pointer ${
                        localeTab === "en"
                          ? "border-red-500 text-white bg-zinc-900"
                          : "border-transparent text-zinc-400 hover:text-white"
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5 text-blue-400" /> English Content (Required)
                    </button>
                    <button
                      type="button"
                      onClick={() => setLocaleTab("bn")}
                      className={`px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 border-b-2 cursor-pointer ${
                        localeTab === "bn"
                          ? "border-emerald-500 text-white bg-zinc-900"
                          : "border-transparent text-zinc-400 hover:text-white"
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5 text-emerald-400" /> বাংলা সংস্করণ (Mandatory!)
                    </button>
                  </div>

                  {/* ENGLISH FIELDS */}
                  {localeTab === "en" && (
                    <div className="space-y-3 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          English Template Title *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Diagnostic Center Clinical Test Bill"
                          className="w-full text-xs bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                          value={formData.en_title}
                          onChange={(e) => setFormData({ ...formData, en_title: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          English Description *
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Detailed purpose and instructions for English users..."
                          className="w-full text-xs bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                          value={formData.en_description}
                          onChange={(e) => setFormData({ ...formData, en_description: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-zinc-300 mb-1">
                            Signatory Title (EN)
                          </label>
                          <input
                            type="text"
                            className="w-full text-xs bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none"
                            value={formData.en_signatory}
                            onChange={(e) => setFormData({ ...formData, en_signatory: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-zinc-300 mb-1">
                            Currency Symbol
                          </label>
                          <input
                            type="text"
                            className="w-full text-xs bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none"
                            value={formData.en_currency}
                            onChange={(e) => setFormData({ ...formData, en_currency: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* BANGLA FIELDS (MANDATORY) */}
                  {localeTab === "bn" && (
                    <div className="space-y-3 bg-zinc-900/60 p-4 rounded-2xl border border-emerald-950/60">
                      <div>
                        <label className="block text-xs font-semibold text-emerald-400 mb-1 flex items-center justify-between">
                          <span>বাংলা শিরোনাম (Bangla Title - Mandatory) *</span>
                          <span className="text-[10px] text-zinc-400 font-mono">*বাধ্যতামূলক</span>
                        </label>
                        <input
                          type="text"
                          placeholder="যেমন: ডায়াগনস্টিক টেস্ট ও ক্লিনিক্যাল মানি রসিদ"
                          className="w-full text-xs bg-zinc-950 border border-emerald-800/60 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                          value={formData.bn_title}
                          onChange={(e) => setFormData({ ...formData, bn_title: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-emerald-400 mb-1 flex items-center justify-between">
                          <span>বাংলা বিবরণ (Bangla Description - Mandatory) *</span>
                          <span className="text-[10px] text-zinc-400 font-mono">*বাধ্যতামূলক</span>
                        </label>
                        <textarea
                          rows={2}
                          placeholder="টেমপ্লেটটির ব্যবহার ও সুবিধা সম্পর্কে বাংলায় লিখুন..."
                          className="w-full text-xs bg-zinc-950 border border-emerald-800/60 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                          value={formData.bn_description}
                          onChange={(e) => setFormData({ ...formData, bn_description: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-emerald-400 mb-1">
                            স্বাক্ষর পদবি (BN Signatory Title)
                          </label>
                          <input
                            type="text"
                            className="w-full text-xs bg-zinc-950 border border-emerald-800/60 rounded-lg px-3 py-2 text-white focus:outline-none"
                            value={formData.bn_signatory}
                            onChange={(e) => setFormData({ ...formData, bn_signatory: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-emerald-400 mb-1">
                            মুদ্রা প্রতীক (Currency)
                          </label>
                          <input
                            type="text"
                            className="w-full text-xs bg-zinc-950 border border-emerald-800/60 rounded-lg px-3 py-2 text-white focus:outline-none"
                            value={formData.bn_currency}
                            onChange={(e) => setFormData({ ...formData, bn_currency: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: VISUAL BLOCK ORGANIZER ("DARK DROP EDIT BOX") */}
              {modalTab === "blocks" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <GripVertical className="w-3.5 h-3.5 text-amber-400" />
                        Interactive Layout Structure (Dark Drop Box)
                      </h4>
                      <p className="text-[11px] text-zinc-400">
                        Drag & drop blocks to rearrange the vertical flow of your printable document. Toggle switches to enable or disable sections.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddCustomBlock}
                      className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs px-2.5 py-1.5 rounded-lg border border-zinc-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Section
                    </button>
                  </div>

                  {/* DRAGGABLE BLOCK LIST */}
                  <div className="space-y-2">
                    {templateBlocks.map((block, index) => (
                      <div
                        key={block.id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={() => handleDrop(index)}
                        className={`p-3.5 rounded-xl border transition flex flex-col gap-2 ${
                          draggedBlockIndex === index
                            ? "opacity-50 border-red-500 bg-zinc-800/80"
                            : block.enabled
                            ? "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                            : "bg-zinc-950/60 border-zinc-900 opacity-60"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          {/* Drag Handle & Step */}
                          <div className="flex items-center gap-2.5">
                            <div
                              className="cursor-grab active:cursor-grabbing text-zinc-500 hover:text-white p-1"
                              title="Drag to reorder section"
                            >
                              <GripVertical className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-mono font-bold bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <div>
                              <div className="font-bold text-white text-xs flex items-center gap-2">
                                {block.titleEn}
                                <span className="text-zinc-500 font-normal">/</span>
                                <span className="text-emerald-400 font-normal">{block.titleBn}</span>
                              </div>
                              <div className="text-[10px] text-zinc-400 mt-0.5">
                                {block.descriptionEn}
                              </div>
                            </div>
                          </div>

                          {/* Controls (Move Up/Down & Toggle) */}
                          <div className="flex items-center gap-2">
                            <div className="flex items-center bg-zinc-950 rounded-lg border border-zinc-800 p-0.5">
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={() => moveBlock(index, "up")}
                                className="p-1 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                                title="Move Up"
                              >
                                <ChevronUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={index === templateBlocks.length - 1}
                                onClick={() => moveBlock(index, "down")}
                                className="p-1 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                                title="Move Down"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Active Switch */}
                            <button
                              type="button"
                              onClick={() => toggleBlockEnabled(block.id)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition cursor-pointer border ${
                                block.enabled
                                  ? "bg-emerald-950/80 text-emerald-400 border-emerald-800"
                                  : "bg-zinc-800 text-zinc-500 border-zinc-700"
                              }`}
                            >
                              {block.enabled ? "Active" : "Disabled"}
                            </button>

                            {block.type === "custom" && (
                              <button
                                type="button"
                                onClick={() => handleDeleteBlock(block.id)}
                                className="p-1 text-zinc-500 hover:text-red-400 cursor-pointer"
                                title="Delete Section"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: LIVE PREVIEW CANVAS */}
              {modalTab === "preview" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
                    <span className="text-xs text-zinc-400 font-mono">
                      Visual snapshot with current organized block layout:
                    </span>
                    <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg p-0.5 text-xs">
                      <button
                        type="button"
                        onClick={() => setPreviewLocale("en")}
                        className={`px-3 py-1 rounded-md transition text-xs font-bold cursor-pointer ${
                          previewLocale === "en" ? "bg-red-600 text-white" : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        English Preview
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewLocale("bn")}
                        className={`px-3 py-1 rounded-md transition text-xs font-bold cursor-pointer ${
                          previewLocale === "bn" ? "bg-red-600 text-white" : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        বাংলা প্রিভিউ
                      </button>
                    </div>
                  </div>

                  {/* DOCUMENT PREVIEW CONTAINER */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex justify-center">
                    <div
                      className={`bg-white text-zinc-900 rounded-lg shadow-2xl p-6 transition-all ${
                        formData.paperSize === "POS_80MM"
                          ? "w-80 border-dashed border-2 border-zinc-400 font-mono text-xs"
                          : "w-full max-w-lg font-sans text-xs"
                      }`}
                    >
                      {/* Render blocks in organized order */}
                      {templateBlocks
                        .filter((b) => b.enabled)
                        .map((block) => (
                          <div key={block.id} className="py-2.5 border-b border-zinc-200 last:border-b-0">
                            {/* Block 1: Header */}
                            {block.type === "header" && (
                              <div className="text-center pb-2">
                                <div className="text-xs uppercase font-mono tracking-widest text-zinc-500">
                                  {previewLocale === "en" ? formData.category : "ক্যাটাগরি"}
                                </div>
                                <h1 className="text-base font-black text-zinc-900 mt-0.5">
                                  {previewLocale === "en"
                                    ? formData.en_title || "Sample Business / Clinic Name"
                                    : formData.bn_title || "নমুনা প্রতিষ্ঠান বা ক্লিনিকের নাম"}
                                </h1>
                                <p className="text-[10px] text-zinc-500">
                                  {previewLocale === "en" ? formData.en_description : formData.bn_description}
                                </p>
                              </div>
                            )}

                            {/* Block 2: Meta */}
                            {block.type === "meta" && (
                              <div className="flex justify-between text-[10px] text-zinc-600 py-1 bg-zinc-50 px-2 rounded">
                                <span>
                                  <strong>{previewLocale === "en" ? "Doc No:" : "নথি নং:"}</strong> #DOC-2026-001
                                </span>
                                <span>
                                  <strong>{previewLocale === "en" ? "Date:" : "তারিখ:"}</strong> 2026-11-12
                                </span>
                              </div>
                            )}

                            {/* Block 3: Recipient */}
                            {block.type === "recipient" && (
                              <div className="text-[11px] py-1">
                                <span className="font-bold text-zinc-700">
                                  {previewLocale === "en" ? "Billed / Prescribed To:" : "প্রাপক / রোগী:"}
                                </span>
                                <div className="text-zinc-800">
                                  {previewLocale === "en" ? "Md. Tanvir Ahmed (Customer/Patient)" : "মোঃ তানভীর আহমেদ (গ্রাহক)"}
                                </div>
                                <div className="text-[10px] text-zinc-500">
                                  {previewLocale === "en" ? "Dhaka, Bangladesh | +880 1712-000000" : "ঢাকা, বাংলাদেশ | ০১৭১২-০০০০০০"}
                                </div>
                              </div>
                            )}

                            {/* Block 4: Table */}
                            {block.type === "table" && (
                              <div className="py-2">
                                <table className="w-full text-left text-[11px] border border-zinc-200">
                                  <thead className="bg-zinc-100 text-zinc-700 font-bold">
                                    <tr>
                                      <th className="p-1.5">{previewLocale === "en" ? "Item / Service" : "বিবরণ"}</th>
                                      <th className="p-1.5 text-center">{previewLocale === "en" ? "Qty" : "পরিমাণ"}</th>
                                      <th className="p-1.5 text-right">{previewLocale === "en" ? "Total" : "টাকা"}</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-zinc-200">
                                    <tr>
                                      <td className="p-1.5">
                                        {previewLocale === "en" ? "Standard Service Item" : "নমুনা পণ্য বা সেবা ০১"}
                                      </td>
                                      <td className="p-1.5 text-center font-mono">1</td>
                                      <td className="p-1.5 text-right font-mono font-bold">
                                        {formData.en_currency} 1,200
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="p-1.5">
                                        {previewLocale === "en" ? "Consultation / Delivery" : "নমুনা পণ্য বা সেবা ০২"}
                                      </td>
                                      <td className="p-1.5 text-center font-mono">2</td>
                                      <td className="p-1.5 text-right font-mono font-bold">
                                        {formData.en_currency} 800
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            )}

                            {/* Block 5: Summary */}
                            {block.type === "summary" && (
                              <div className="text-[11px] space-y-1 text-right py-1">
                                <div className="text-zinc-600">
                                  {previewLocale === "en" ? "Subtotal:" : "মোট টাকা:"}{" "}
                                  <span className="font-mono">{formData.en_currency} 2,000</span>
                                </div>
                                <div className="text-zinc-600">
                                  {previewLocale === "en" ? "Discount:" : "বিশেষ ছাড়:"}{" "}
                                  <span className="font-mono">- {formData.en_currency} 100</span>
                                </div>
                                <div className="text-xs font-black text-zinc-900 border-t border-zinc-300 pt-1">
                                  {previewLocale === "en" ? "Net Total Due:" : "সর্বমোট বকেয়া:"}{" "}
                                  <span className="font-mono text-red-600">{formData.en_currency} 1,900</span>
                                </div>
                              </div>
                            )}

                            {/* Block 6: Signatory */}
                            {block.type === "signatory" && (
                              <div className="pt-4 flex justify-end">
                                <div className="text-center w-36 border-t border-zinc-400 pt-1 text-[10px] text-zinc-700 font-bold">
                                  {previewLocale === "en" ? formData.en_signatory : formData.bn_signatory}
                                </div>
                              </div>
                            )}

                            {/* Block 7: Terms */}
                            {block.type === "terms" && (
                              <div className="text-[9px] text-zinc-500 italic pt-1">
                                * {previewLocale === "en"
                                  ? "Thank you for doing business with us. Keep this voucher for warranty."
                                  : "আমাদের সেবা গ্রহণ করার জন্য ধন্যবাদ। ওয়ারেন্টির জন্য রসিদটি সংরক্ষণ করুন।"}
                              </div>
                            )}

                            {/* Custom Blocks */}
                            {block.type === "custom" && (
                              <div className="bg-zinc-100 p-2 rounded text-[10px] text-zinc-700">
                                <strong>{previewLocale === "en" ? block.titleEn : block.titleBn}:</strong> Custom configured block data.
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* MODAL ACTIONS FOOTER */}
            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-zinc-500 font-mono">
                *Strict Bilingual Parity: Both English &amp; Bangla must be completed.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs text-zinc-400 hover:text-white px-3 py-2 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveTemplate}
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition shadow-md cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  {isSubmitting ? "Publishing..." : "Save & Publish Template"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
