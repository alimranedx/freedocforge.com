"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Printer,
  Download,
  Plus,
  Trash2,
  Building,
  Upload,
  Check,
  Mic,
  Globe,
  FileText,
  Share2,
  Image as ImageIcon,
  MessageCircle,
  Eye,
  Edit3,
  Save,
  BookmarkCheck,
  Loader2,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import { numberToWordsEnglish, numberToWordsBengali } from "@/lib/numberToWords";
import AdSenseSlot from "@/components/AdSenseSlot";
import PostDownloadModal from "@/components/PostDownloadModal";
import VoiceInputButton, { parseBanglaDigits } from "@/components/VoiceInputButton";
import { useGlobalSettings } from "@/context/GlobalSettingsContext";
import { trackEvent } from "@/lib/analytics";
import ThemeSelectorBar from "@/components/ThemeSelectorBar";
import {
  detectDefaultThemeForTemplate,
  DESIGN_THEMES,
  DesignThemeId,
} from "@/lib/designThemes";
import { exportElementToPdf, exportElementToJpg } from "@/lib/pdfExport";

interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
}

export default function InvoiceEditor({
  initialData,
  locales,
  isUserSaved = false,
  templateSlug = "f-commerce-invoice",
}: {
  initialData: any;
  locales?: {
    en: { defaultData: any; title: string; description: string };
    bn: { defaultData: any; title: string; description: string };
  };
  isUserSaved?: boolean;
  templateSlug?: string;
}) {
  // 1. SYSTEM LANGUAGE (Controls Website UI Chrome from Navbar)
  const { lang: sysLang } = useGlobalSettings();

  // 2. TEMPLATE / DOCUMENT LANGUAGE (Independent! Controls Printed Document Output)
  const [docLang, setDocLang] = useState<"en" | "bn">("en");

  // 3. VOICE INPUT LANGUAGE (Allows speaking in Bangla or English on ALL inputs)
  const [voiceLang, setVoiceLang] = useState<"bn" | "en">("bn");

  // 4. DOCUMENT DESIGN THEME ARCHETYPE (Real-time styling for canvas & print)
  const [activeThemeId, setActiveThemeId] = useState<DesignThemeId>(() => {
    return detectDefaultThemeForTemplate("Business", templateSlug);
  });
  const activeTheme = DESIGN_THEMES[activeThemeId] || DESIGN_THEMES["modern-blue"];
  const isPos = templateSlug.includes("pos") || activeThemeId === "thermal-pos";

  // Initialize data with safe fallbacks (ensuring currency and items are never undefined)
  const [data, setData] = useState({
    businessName: "",
    tagline: "",
    phone: "",
    address: "",
    invoiceNumber: "INV-2026-001",
    date: "2026-11-11",
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    courierPartner: "",
    currency: "৳",
    items: [{ name: "Standard Product / Service", quantity: 1, price: 500 }],
    deliveryCharge: 0,
    discount: 0,
    paidAmount: 0,
    notes: "",
    signatoryTitle: "Authorized Signature",
    ...initialData,
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [mobileView, setMobileView] = useState<"form" | "preview">("form");
  const [isExportingJpg, setIsExportingJpg] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [showPostDownloadModal, setShowPostDownloadModal] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const [docSaveLoading, setDocSaveLoading] = useState(false);
  const [docSaveSuccess, setDocSaveSuccess] = useState(false);
  const [docSaveMessage, setDocSaveMessage] = useState<string | null>(null);

  // Collapsible Form Section Cards
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const toggleSection = (id: string) => {
    setCollapsedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Quick Pre-Fill / Sample Data Handlers
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
      customerName: "",
      customerPhone: "",
      customerAddress: "",
      patientName: "",
      patientAge: "",
      gender: "",
      patientId: "",
      referredBy: "",
      bedWard: "",
      sampleTime: "",
      items: [{ name: "", quantity: 1, price: 0 }],
      deliveryCharge: 0,
      discount: 0,
      paidAmount: 0,
      notes: "",
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
              if (saved.logoUrl) setLogoPreview(saved.logoUrl);
              if (saved.signatureUrl) setSignaturePreview(saved.signatureUrl);
              if (saved.docLang) setDocLang(saved.docLang);
            }
          })
          .catch(() => {});
        return;
      }
    }

    // 2. Load brand preset from localStorage first
    const saved = localStorage.getItem("freedocforge_active_preset");
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (p.presetType === "shop" || !p.presetType) {
          setData((prev: any) => ({
            ...prev,
            businessName: p.businessName || prev.businessName,
            tagline: p.tagline || prev.tagline,
            phone: p.phone || prev.phone,
            address: p.address || prev.address,
            currency: p.currency || prev.currency,
            notes: p.terms || prev.notes,
          }));
          if (p.logoUrl) setLogoPreview(p.logoUrl);
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
              businessName: p.businessName || prev.businessName,
              tagline: p.tagline || prev.tagline,
              phone: p.phone || prev.phone,
              address: p.address || prev.address,
              currency: p.currency || prev.currency,
              notes: p.terms || prev.notes,
            }));
            if (p.logoUrl) setLogoPreview(p.logoUrl);
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
      setData({
        currency: "৳",
        ...locales[targetLang].defaultData,
      });
    }
  };

  // Safe Currency Fallback (prevents "undefined" bug in COD display)
  const currency = data.currency || "৳";
  const currencyName = currency === "$" ? "Dollars" : currency === "€" ? "Euros" : currency === "₹" ? "Rupees" : "Taka";

  // Calculations
  const itemsList: InvoiceItem[] = Array.isArray(data.items) && data.items.length > 0
    ? data.items
    : [{ name: docLang === "bn" ? "পণ্য বা সেবার বিবরণ" : "Product / Service", quantity: 1, price: 500 }];

  const subtotal = itemsList.reduce(
    (acc: number, item: InvoiceItem) =>
      acc + Number(item.quantity || 0) * Number(item.price || 0),
    0
  );
  const delivery = Number(data.deliveryCharge || 0);
  const discount = Number(data.discount || 0);
  const vatTaxPercent = Number(data.vatTaxPercent || data.taxPercent || 0);
  const vatTaxAmount = vatTaxPercent > 0 ? Math.round((subtotal * vatTaxPercent) / 100) : Number(data.taxAmount || 0);
  const grandTotal = Math.max(0, subtotal + delivery - discount + vatTaxAmount);
  const paid = Number(data.paidAmount || data.advancePaid || 0);
  const due = Math.max(0, grandTotal - paid);

  const handleAddItem = () => {
    const newItemName = docLang === "bn" ? "নতুন পণ্য বা সেবা" : "New Product / Service";
    setData({
      ...data,
      items: [...itemsList, { name: newItemName, quantity: 1, price: 500 }],
    });
  };

  const handleRemoveItem = (index: number) => {
    if (itemsList.length <= 1) return;
    const updated = itemsList.filter((_: any, i: number) => i !== index);
    setData({ ...data, items: updated });
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updated = [...itemsList];
    updated[index] = { ...updated[index], [field]: value };
    setData({ ...data, items: updated });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
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
    trackEvent({
      name: "print_initiated",
      properties: {
        template_slug: templateSlug,
        paper_size: "A4",
        has_logo: !!logoPreview,
        amount_bucket:
          grandTotal < 1000
            ? "0-1000"
            : grandTotal <= 5000
            ? "1000-5000"
            : grandTotal <= 20000
            ? "5000-20000"
            : "20000+",
      },
    });
    window.print();
  };

  const handleWhatsAppShare = () => {
    try {
      const shopTitle = data.businessName || "Cash Memo";
      const invNumber = data.invoiceNumber || "INV-001";
      const customer = data.customerName || "Valued Customer";
      const totalStr = `${currency} ${grandTotal.toLocaleString()}`;
      const dueStr =
        due > 0 ? `${currency} ${due.toLocaleString()}` : docLang === "bn" ? "পরিশোধিত" : "Paid";

      const message =
        docLang === "bn"
          ? `*${shopTitle}*\nমেমো নং: ${invNumber}\nক্রেতা: ${customer}\nডেলিভারি ঠিকানা: ${
              data.customerAddress || "N/A"
            }\nকুরিয়ার: ${data.courierPartner || "Standard"}\n\n*সর্বমোট বিল:* ${totalStr}\n*ক্যাশ অন ডেলিভারি (বাকি):* ${dueStr}\n\nধন্যবাদ আমাদের সাথে কেনাকাটা করার জন্য!`
          : `*${shopTitle}*\nInvoice: ${invNumber}\nCustomer: ${customer}\nDelivery Address: ${
              data.customerAddress || "N/A"
            }\nCourier: ${data.courierPartner || "Standard"}\n\n*Grand Total:* ${totalStr}\n*Net COD Due:* ${dueStr}\n\nThank you for shopping with us!`;

      trackEvent({
        name: "whatsapp_share_clicked",
        properties: { template_slug: templateSlug },
      });

      const cleanPhone = (data.customerPhone || "").replace(/[^0-9]/g, "");
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

  const handleDownloadPdf = async () => {
    if (!printRef.current || isExportingPdf) return;
    try {
      setIsExportingPdf(true);
      await exportElementToPdf({
        element: printRef.current,
        filename: `${data.invoiceNumber || "cash-memo"}.pdf`,
        paperSize: isPos ? "POS_80MM" : "A4",
        scale: 2,
      });

      trackEvent({
        name: "pdf_download_completed",
        properties: { template_slug: templateSlug, paper_size: isPos ? "POS_80MM" : "A4" },
      });

      setShowPostDownloadModal(true);
    } catch (e) {
      console.error("Direct PDF export error:", e);
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
      await exportElementToJpg(printRef.current, `${data.invoiceNumber || "cash-memo"}.jpg`, 2);

      trackEvent({
        name: "pdf_download_completed",
        properties: { template_slug: templateSlug, paper_size: "A4_JPG" },
      });

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

  const handleSaveToProfile = async () => {
    const presetData = {
      businessName: data.businessName || "",
      tagline: data.tagline || "",
      phone: data.phone || "",
      address: data.address || "",
      currency: data.currency || "৳",
      terms: data.notes || "",
      logoUrl: logoPreview || null,
      signatureUrl: signaturePreview || null,
      presetType: "shop",
    };

    localStorage.setItem("freedocforge_active_preset", JSON.stringify(presetData));

    try {
      await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(presetData),
      });
    } catch (err) {
      console.warn("Could not sync brand profile to cloud:", err);
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const isMedicalReceipt =
    templateSlug.includes("medical") ||
    templateSlug.includes("diagnostic") ||
    templateSlug.includes("hospital") ||
    templateSlug.includes("pharmacy") ||
    templateSlug.includes("doctor-consultation") ||
    templateSlug.includes("dental-procedure") ||
    templateSlug.includes("optical-eyecare") ||
    templateSlug.includes("physiotherapy") ||
    templateSlug.includes("pathology") ||
    templateSlug.includes("ambulance") ||
    templateSlug.includes("discharge") ||
    templateSlug.includes("money-receipt") ||
    data.patientName !== undefined ||
    data.patientAge !== undefined ||
    data.referredBy !== undefined;

  const handleSaveDocument = async () => {
    setDocSaveLoading(true);
    setDocSaveMessage(null);

    const recipient = isMedicalReceipt
      ? data.patientName || data.customerName || "Patient"
      : data.customerName || data.clientName || data.name || "Customer";
    const docNum = data.invoiceNumber || data.memoNumber || data.billNumber || `INV-${Date.now().toString().slice(-6)}`;
    const amountStr = `${currency} ${grandTotal.toLocaleString("en-US")}`;

    const docPayload = {
      templateSlug,
      templateTitle: locales?.[docLang]?.title || data.businessName || "Invoice / Cash Memo",
      category: "Business",
      documentNumber: docNum,
      recipientName: recipient,
      amountOrDetails: amountStr,
      status: due > 0 ? "Saved" : "Paid",
      dataJson: {
        ...data,
        logoUrl: logoPreview,
        signatureUrl: signaturePreview,
        docLang,
      },
    };

    // Save locally first for instant offline access
    try {
      const existing = JSON.parse(localStorage.getItem("freedocforge_history") || "[]");
      const localItem = {
        id: `local-${Date.now()}`,
        ...docPayload,
        date: new Date().toISOString().split("T")[0],
      };
      localStorage.setItem("freedocforge_history", JSON.stringify([localItem, ...existing]));
    } catch (e) {}

    // Persist to database via API
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
            ? "ডকুমেন্ট ও টেমপ্লেট ডাটা সফলভাবে ক্লাউডে সংরক্ষিত হয়েছে!"
            : "Document & template saved to your cloud history!"
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

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* INDEPENDENT TEMPLATE DOCUMENT LANGUAGE BAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{sysLang === "bn" ? "ডকুমেন্টের প্রিন্ট ভাষা:" : "Document Print Language:"}</span>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                {docLang === "bn" ? "বাংলা ফরম্যাট" : "English Format"}
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {sysLang === "bn"
                ? "সিস্টেম ল্যাঙ্গুয়েজের বাইরে সম্পূর্ণ আলাদাভাবে ডকুমেন্টের ভাষা ও ভয়েস টাইপিং নিয়ন্ত্রণ করুন।"
                : "Manage printed document language independently of the website UI language."}
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
            {isMedicalReceipt ? "English Receipt" : "English Invoice"}
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
            {isMedicalReceipt ? "বাংলা মানি রিসিট" : "বাংলা ক্যাশ মেমো"}
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
          {docLang === "bn" ? "লাইভ প্রিভিউ দেখুন" : "Live Preview"}
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
                <span>{docLang === "bn" ? "ডকুমেন্ট সেটিংস" : "Document Settings"}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {sysLang === "bn"
                  ? "তারিখ বাদে প্রতিটি ফিল্ডে ভয়েস টাইপিং করতে মাইক্রোফোনে ক্লিক করুন।"
                  : "Click any mic icon to speak into fields. Bangla & English voice supported."}
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
                title="ভয়েস ইনপুট বাংলা ভাষায় গ্রহণ করবে"
              >
                <span>বাংলা (bn)</span>
              </button>
              <button
                type="button"
                onClick={() => setVoiceLang("en")}
                className={`text-[11px] font-bold px-2 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                  voiceLang === "en"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
                title="Voice input will listen in English"
              >
                <span>English (en)</span>
              </button>
            </div>
          </div>

          {/* 1. Business Details */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              {isMedicalReceipt
                ? docLang === "bn"
                  ? "১. ডায়াগনস্টিক সেন্টার বা প্রতিষ্ঠানের তথ্য"
                  : "1. Diagnostic Center / Hospital Details"
                : docLang === "bn"
                ? "১. আপনার দোকান / প্রতিষ্ঠানের তথ্য"
                : "1. Your Business / Shop Details"}
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Business Name */}
              <div className="col-span-2 relative flex items-center">
                <input
                  type="text"
                  placeholder={
                    isMedicalReceipt
                      ? docLang === "bn"
                        ? "ডায়াগনস্টিক সেন্টারের নাম"
                        : "Diagnostic Center / Hospital Name"
                      : docLang === "bn"
                      ? "দোকান বা পেজের নাম"
                      : "Shop / Company Name"
                  }
                  className="w-full text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-9 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                  value={data.businessName || ""}
                  onChange={(e) => setData({ ...data, businessName: e.target.value })}
                />
                <div className="absolute right-2">
                  <VoiceInputButton
                    lang={voiceLang}
                    title={voiceLang === "bn" ? "দোকান বা সেন্টারের নাম মুখে বলুন" : "Speak Name"}
                    onTranscript={(txt) => setData({ ...data, businessName: txt })}
                  />
                </div>
              </div>

              {/* Tagline */}
              <div className="col-span-2 relative flex items-center">
                <input
                  type="text"
                  placeholder={
                    isMedicalReceipt
                      ? docLang === "bn"
                        ? "স্লোগান / আদর্শ (যেমন: নির্ভুল টেস্ট রিপোর্ট, সেবাই লক্ষ্য)"
                        : "Tagline / Mission"
                      : docLang === "bn"
                      ? "স্লোগান / ট্যাগলাইন (যেমন: সেরা মানের পণ্য)"
                      : "Tagline / Slogan"
                  }
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-9 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                  value={data.tagline || ""}
                  onChange={(e) => setData({ ...data, tagline: e.target.value })}
                />
                <div className="absolute right-2">
                  <VoiceInputButton
                    lang={voiceLang}
                    title={voiceLang === "bn" ? "ট্যাগলাইন মুখে বলুন" : "Speak Tagline"}
                    onTranscript={(txt) => setData({ ...data, tagline: txt })}
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder={docLang === "bn" ? "মোবাইল নম্বর" : "Phone Number"}
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                  value={data.phone || ""}
                  onChange={(e) => setData({ ...data, phone: e.target.value })}
                />
                <div className="absolute right-1">
                  <VoiceInputButton
                    lang={voiceLang}
                    isNumeric={false}
                    title={voiceLang === "bn" ? "মোবাইল নম্বর মুখে বলুন" : "Speak Phone Number"}
                    onTranscript={(txt) => {
                      const normalized = parseBanglaDigits(txt);
                      setData({ ...data, phone: normalized });
                    }}
                  />
                </div>
              </div>

              {/* Invoice Number */}
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder={
                    isMedicalReceipt
                      ? docLang === "bn"
                        ? "বিল বা মানি রিসিট নং"
                        : "Receipt / Bill #"
                      : docLang === "bn"
                      ? "মেমো নং"
                      : "Invoice #"
                  }
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                  value={data.invoiceNumber || ""}
                  onChange={(e) => setData({ ...data, invoiceNumber: e.target.value })}
                />
                <div className="absolute right-1">
                  <VoiceInputButton
                    lang={voiceLang}
                    title={voiceLang === "bn" ? "মেমো নম্বর মুখে বলুন" : "Speak Invoice Number"}
                    onTranscript={(txt) => setData({ ...data, invoiceNumber: txt })}
                  />
                </div>
              </div>

              {/* Address */}
              <div className="col-span-2 relative flex items-center">
                <input
                  type="text"
                  placeholder={
                    isMedicalReceipt
                      ? docLang === "bn"
                        ? "ডায়াগনস্টিক সেন্টারের ঠিকানা"
                        : "Center Address"
                      : docLang === "bn"
                      ? "দোকানের ঠিকানা / লোকেশন"
                      : "Shop Address / Location"
                  }
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-9 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                  value={data.address || ""}
                  onChange={(e) => setData({ ...data, address: e.target.value })}
                />
                <div className="absolute right-2">
                  <VoiceInputButton
                    lang={voiceLang}
                    title={voiceLang === "bn" ? "ঠিকানা মুখে বলুন" : "Speak Address"}
                    onTranscript={(txt) => setData({ ...data, address: txt })}
                  />
                </div>
              </div>

              <div className="col-span-2 flex flex-wrap items-center gap-2">
                <label className="cursor-pointer flex items-center gap-1.5 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 transition">
                  <Upload className="w-3.5 h-3.5" />
                  {isMedicalReceipt
                    ? docLang === "bn"
                      ? "সেন্টার লোগো আপলোড"
                      : "Upload Center Logo"
                    : docLang === "bn"
                    ? "লোগো আপলোড"
                    : "Upload Shop Logo"}
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </label>
                <label className="cursor-pointer flex items-center gap-1.5 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 transition">
                  <Upload className="w-3.5 h-3.5" />
                  {docLang === "bn" ? "স্বাক্ষর আপলোড" : "Upload Digital Signature"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleSignatureUpload}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* 2. Customer / Client / Patient Details */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              {isMedicalReceipt
                ? docLang === "bn"
                  ? "২. রোগীর বিবরণ ও রেফারেন্স ডাক্তার"
                  : "2. Patient & Referring Doctor Details"
                : docLang === "bn"
                ? "২. কাস্টমার / ক্রেতার বিবরণ"
                : "2. Customer / Client Details"}
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Customer Name */}
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder={
                    isMedicalReceipt
                      ? docLang === "bn"
                        ? "রোগীর নাম"
                        : "Patient Name"
                      : docLang === "bn"
                      ? "কাস্টমারের নাম"
                      : "Customer Name"
                  }
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                  value={data.customerName || ""}
                  onChange={(e) => setData({ ...data, customerName: e.target.value })}
                />
                <div className="absolute right-1">
                  <VoiceInputButton
                    lang={voiceLang}
                    title={voiceLang === "bn" ? "নাম মুখে বলুন" : "Speak Name"}
                    onTranscript={(txt) => setData({ ...data, customerName: txt })}
                  />
                </div>
              </div>

              {/* Customer Phone */}
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder={
                    isMedicalReceipt
                      ? docLang === "bn"
                        ? "রোগীর ফোন"
                        : "Patient Phone"
                      : docLang === "bn"
                      ? "কাস্টমারের ফোন"
                      : "Customer Phone"
                  }
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                  value={data.customerPhone || ""}
                  onChange={(e) => setData({ ...data, customerPhone: e.target.value })}
                />
                <div className="absolute right-1">
                  <VoiceInputButton
                    lang={voiceLang}
                    isNumeric={false}
                    title={voiceLang === "bn" ? "মোবাইল নম্বর মুখে বলুন" : "Speak Phone"}
                    onTranscript={(txt) => {
                      const normalized = parseBanglaDigits(txt);
                      setData({ ...data, customerPhone: normalized });
                    }}
                  />
                </div>
              </div>

              {/* Customer Address / Ref Doctor */}
              <div className="col-span-2 relative flex items-center">
                <input
                  type="text"
                  placeholder={
                    isMedicalReceipt
                      ? docLang === "bn"
                        ? "রেফারেন্স ডাক্তারের নাম ও পদবী (Ref. Doctor)"
                        : "Referring Doctor (e.g. Prof. Dr. S. K. Roy)"
                      : docLang === "bn"
                      ? "ডেলিভারি ঠিকানা (জেলা, থানা, বাসা)"
                      : "Delivery Address"
                  }
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-9 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                  value={data.customerAddress || data.referredBy || ""}
                  onChange={(e) => setData({ ...data, customerAddress: e.target.value, referredBy: e.target.value })}
                />
                <div className="absolute right-2">
                  <VoiceInputButton
                    lang={voiceLang}
                    title={voiceLang === "bn" ? "ঠিকানা বা রেফারেন্স মুখে বলুন" : "Speak Ref"}
                    onTranscript={(txt) => setData({ ...data, customerAddress: txt, referredBy: txt })}
                  />
                </div>
              </div>

              {/* Courier Partner / Delivery Schedule */}
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder={
                    isMedicalReceipt
                      ? docLang === "bn"
                        ? "রিপোর্ট ডেলিভারির সময় (যেমন: ১২/১১/২৬ বিকাল ৫টা)"
                        : "Report Delivery Time (e.g. 12/11/26 5:00 PM)"
                      : docLang === "bn"
                      ? "কুরিয়ার (যেমন: Steadfast/Pathao)"
                      : "Courier Partner"
                  }
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                  value={data.courierPartner || data.deliveryTime || ""}
                  onChange={(e) => setData({ ...data, courierPartner: e.target.value, deliveryTime: e.target.value })}
                />
                <div className="absolute right-1">
                  <VoiceInputButton
                    lang={voiceLang}
                    title={voiceLang === "bn" ? "ডেলিভারি সময় মুখে বলুন" : "Speak Delivery Time"}
                    onTranscript={(txt) => setData({ ...data, courierPartner: txt, deliveryTime: txt })}
                  />
                </div>
              </div>

              {/* Date Input: Explicitly NO voice input, per instruction "except date time input" */}
              <div>
                <input
                  type="date"
                  title="Date of Document"
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                  value={data.date || "2026-11-11"}
                  onChange={(e) => setData({ ...data, date: e.target.value })}
                />
              </div>

              {/* Specialized Medical Demographics Fields */}
              {isMedicalReceipt && (
                <>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder={docLang === "bn" ? "বয়স ও লিঙ্গ (যেমন: ৪৫ বছর / পুরুষ)" : "Age & Gender (e.g. 45 Yrs / Male)"}
                      className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
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
                      placeholder={docLang === "bn" ? "পেশেন্ট আইডি / UHID নং" : "Patient ID / UHID #"}
                      className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                      value={data.patientId || ""}
                      onChange={(e) => setData({ ...data, patientId: e.target.value })}
                    />
                    <div className="absolute right-1">
                      <VoiceInputButton
                        lang={voiceLang}
                        title="Speak Patient ID"
                        onTranscript={(txt) => setData({ ...data, patientId: txt })}
                      />
                    </div>
                  </div>

                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder={docLang === "bn" ? "কেবিন / বেড / ওয়ার্ড নং" : "Cabin / Bed / Ward #"}
                      className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                      value={data.bedWard || ""}
                      onChange={(e) => setData({ ...data, bedWard: e.target.value })}
                    />
                    <div className="absolute right-1">
                      <VoiceInputButton
                        lang={voiceLang}
                        title="Speak Bed"
                        onTranscript={(txt) => setData({ ...data, bedWard: txt })}
                      />
                    </div>
                  </div>

                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder={docLang === "bn" ? "নমুনা সংগ্রহের সময় (Sample Time)" : "Sample Time (e.g. 10:30 AM)"}
                      className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                      value={data.sampleTime || ""}
                      onChange={(e) => setData({ ...data, sampleTime: e.target.value })}
                    />
                    <div className="absolute right-1">
                      <VoiceInputButton
                        lang={voiceLang}
                        title="Speak Sample Time"
                        onTranscript={(txt) => setData({ ...data, sampleTime: txt })}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Quick Bangladeshi Courier Chips */}
              <div className="col-span-2 flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  {docLang === "bn" ? "জনপ্রিয় কুরিয়ার:" : "Couriers:"}
                </span>
                {[
                  { name: "Steadfast Courier", label: "Steadfast" },
                  { name: "Pathao Courier", label: "Pathao" },
                  { name: "RedX Delivery", label: "RedX" },
                  { name: "Paperfly", label: "Paperfly" },
                  { name: "Sundarban Courier", label: "Sundarban" },
                ].map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => {
                      setData({ ...data, courierPartner: c.name });
                      trackEvent({
                        name: "courier_affiliate_clicked",
                        properties: {
                          courier_name: c.label.toLowerCase() as any,
                          placement: "editor_sidebar",
                        },
                      });
                    }}
                    className={`text-[10px] px-2 py-0.5 rounded-md border transition font-medium cursor-pointer ${
                      data.courierPartner === c.name
                        ? "bg-blue-50 dark:bg-blue-950 border-blue-500 text-blue-700 dark:text-blue-300 font-bold"
                        : "bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Items & Pricing */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {isMedicalReceipt
                  ? docLang === "bn"
                    ? "৩. প্যাথলজি ও ডায়াগনস্টিক টেস্টের তালিকা"
                    : "3. Diagnostic Tests & Charges"
                  : docLang === "bn"
                  ? "৩. পণ্যের বিবরণ ও মূল্য তালিকা"
                  : "3. Items & Pricing"}
              </label>
              <button
                onClick={handleAddItem}
                className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />{" "}
                {isMedicalReceipt
                  ? docLang === "bn"
                    ? "+ টেস্ট যোগ করুন"
                    : "+ Add Test"
                  : docLang === "bn"
                  ? "+ পণ্য যোগ করুন"
                  : "+ Add Item"}
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {itemsList.map((item: InvoiceItem, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  {/* Item Description with Voice Input */}
                  <div className="flex-1 relative flex items-center min-w-0">
                    <input
                      type="text"
                      placeholder={
                        isMedicalReceipt
                          ? docLang === "bn"
                            ? "টেস্টের নাম (যেমন: CBC, FBS, USG)"
                            : "Test Name (e.g. CBC, FBS, USG)"
                          : docLang === "bn"
                          ? "পণ্যের নাম"
                          : "Item name"
                      }
                      className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1.5 pr-7 text-slate-900 dark:text-white focus:outline-none"
                      value={item.name}
                      onChange={(e) => handleItemChange(idx, "name", e.target.value)}
                    />
                    <div className="absolute right-1">
                      <VoiceInputButton
                        lang={voiceLang}
                        title={voiceLang === "bn" ? "পণ্যের নাম মুখে বলুন" : "Speak Item Name"}
                        onTranscript={(txt) => handleItemChange(idx, "name", txt)}
                      />
                    </div>
                  </div>

                  {/* Quantity with Numeric Voice Input */}
                  <div className="w-20 relative flex items-center shrink-0">
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1.5 pr-6 focus:outline-none text-center text-slate-900 dark:text-white"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(idx, "quantity", Math.max(1, Number(e.target.value) || 1))
                      }
                    />
                    <div className="absolute right-0.5">
                      <VoiceInputButton
                        lang={voiceLang}
                        isNumeric={true}
                        title={voiceLang === "bn" ? "পরিমাণ মুখে বলুন" : "Speak Quantity"}
                        onTranscript={(val) => {
                          const n = Math.max(1, parseInt(val, 10) || 1);
                          handleItemChange(idx, "quantity", n);
                        }}
                      />
                    </div>
                  </div>

                  {/* Price with Numeric Voice Input */}
                  <div className="w-24 relative flex items-center shrink-0">
                    <input
                      type="number"
                      min="0"
                      placeholder="Price"
                      className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1.5 pr-6 focus:outline-none text-right text-slate-900 dark:text-white"
                      value={item.price}
                      onChange={(e) =>
                        handleItemChange(idx, "price", Math.max(0, Number(e.target.value) || 0))
                      }
                    />
                    <div className="absolute right-0.5">
                      <VoiceInputButton
                        lang={voiceLang}
                        isNumeric={true}
                        title={voiceLang === "bn" ? "মূল্য মুখে বলুন" : "Speak Unit Price"}
                        onTranscript={(val) => {
                          const n = Math.max(0, parseFloat(val) || 0);
                          handleItemChange(idx, "price", n);
                        }}
                      />
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(idx)}
                    className="text-slate-400 hover:text-red-500 p-1 cursor-pointer shrink-0"
                    title="Remove Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Financial Adjustments with Numeric Voice Inputs */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              {/* Delivery Charge */}
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">
                  {docLang === "bn" ? "ডেলিভারি চার্জ" : "Delivery Fee"}
                </span>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    min="0"
                    className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded px-2 py-1.5 pr-6 focus:outline-none"
                    value={data.deliveryCharge || 0}
                    onChange={(e) =>
                      setData({ ...data, deliveryCharge: Math.max(0, Number(e.target.value) || 0) })
                    }
                  />
                  <div className="absolute right-0.5">
                    <VoiceInputButton
                      lang={voiceLang}
                      isNumeric={true}
                      title={voiceLang === "bn" ? "ডেলিভারি ফি মুখে বলুন" : "Speak Delivery Fee"}
                      onTranscript={(val) =>
                        setData({ ...data, deliveryCharge: Math.max(0, parseFloat(val) || 0) })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Discount */}
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">
                  {docLang === "bn" ? "বিশেষ ছাড়" : "Discount"}
                </span>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    min="0"
                    className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded px-2 py-1.5 pr-6 focus:outline-none"
                    value={data.discount || 0}
                    onChange={(e) =>
                      setData({ ...data, discount: Math.max(0, Number(e.target.value) || 0) })
                    }
                  />
                  <div className="absolute right-0.5">
                    <VoiceInputButton
                      lang={voiceLang}
                      isNumeric={true}
                      title={voiceLang === "bn" ? "ছাড় বা ডিসকাউন্ট মুখে বলুন" : "Speak Discount"}
                      onTranscript={(val) =>
                        setData({ ...data, discount: Math.max(0, parseFloat(val) || 0) })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Advance Paid */}
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">
                  {docLang === "bn" ? "অগ্রিম জমা" : "Advance Paid"}
                </span>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    min="0"
                    className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded px-2 py-1.5 pr-6 focus:outline-none"
                    value={data.paidAmount || 0}
                    onChange={(e) =>
                      setData({ ...data, paidAmount: Math.max(0, Number(e.target.value) || 0) })
                    }
                  />
                  <div className="absolute right-0.5">
                    <VoiceInputButton
                      lang={voiceLang}
                      isNumeric={true}
                      title={voiceLang === "bn" ? "অগ্রিম টাকা মুখে বলুন" : "Speak Advance Paid"}
                      onTranscript={(val) =>
                        setData({ ...data, paidAmount: Math.max(0, parseFloat(val) || 0) })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Delivery Rate Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                {docLang === "bn" ? "ডেলিভারি রেট:" : "Delivery Rates:"}
              </span>
              {[
                { fee: 70, bnLabel: "ঢাকা সিটি (৳৭০)", enLabel: "Inside Dhaka (৳70)" },
                { fee: 100, bnLabel: "সাব-ঢাকা (৳১০০)", enLabel: "Sub-Dhaka (৳100)" },
                { fee: 130, bnLabel: "ঢাকার বাইরে (৳১৩০)", enLabel: "Outside Dhaka (৳130)" },
                { fee: 0, bnLabel: "ফ্রি (৳০)", enLabel: "Free (৳0)" },
              ].map((rate) => (
                <button
                  key={rate.fee}
                  type="button"
                  onClick={() => setData({ ...data, deliveryCharge: rate.fee })}
                  className={`text-[10px] px-2 py-0.5 rounded-md border transition cursor-pointer font-medium ${
                    Number(data.deliveryCharge) === rate.fee
                      ? "bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold"
                      : "bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400"
                  }`}
                >
                  {docLang === "bn" ? rate.bnLabel : rate.enLabel}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Terms, Notes & Signatory with Voice Inputs */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              {docLang === "bn" ? "৪. শর্তাবলী ও স্বাক্ষর" : "4. Terms & Signature Title"}
            </label>
            <div className="space-y-2.5">
              {/* Notes / Terms */}
              <div className="relative flex items-start">
                <textarea
                  rows={2}
                  placeholder={
                    docLang === "bn"
                      ? "শর্তাবলী বা নোট (যেমন: পার্সেল গ্রহণের ৪৮ ঘণ্টার মধ্যে যাচাই করুন)"
                      : "Terms, warranty or note..."
                  }
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-9 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors resize-none"
                  value={data.notes || ""}
                  onChange={(e) => setData({ ...data, notes: e.target.value })}
                />
                <div className="absolute right-2 top-2">
                  <VoiceInputButton
                    lang={voiceLang}
                    title={voiceLang === "bn" ? "শর্তাবলী মুখে বলুন" : "Speak Terms & Notes"}
                    onTranscript={(txt) =>
                      setData({
                        ...data,
                        notes: data.notes ? `${data.notes} ${txt}` : txt,
                      })
                    }
                  />
                </div>
              </div>

              {/* Signatory Title */}
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder={
                    docLang === "bn"
                      ? "অনুমোদিত স্বাক্ষরকারীর পদবী (যেমন: ম্যানেজার)"
                      : "Signatory Title (e.g. Authorized Signature)"
                  }
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                  value={data.signatoryTitle || ""}
                  onChange={(e) => setData({ ...data, signatoryTitle: e.target.value })}
                />
                <div className="absolute right-1">
                  <VoiceInputButton
                    lang={voiceLang}
                    title={voiceLang === "bn" ? "পদবী মুখে বলুন" : "Speak Signatory Title"}
                    onTranscript={(txt) => setData({ ...data, signatoryTitle: txt })}
                  />
                </div>
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
                  <span>{docLang === "bn" ? "PDF প্রস্তুত হচ্ছে..." : "Generating PDF File..."}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>{docLang === "bn" ? "১-ক্লিক সরাসরি PDF ডাউনলোড" : "1-Click Direct PDF Download"}</span>
                </>
              )}
            </button>

            {/* 2. Print (Hardware / System Spooler) */}
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
                {docLang === "bn" ? "হোয়াটসঅ্যাপ শেয়ার" : "WhatsApp Share"}
              </button>
              <button
                type="button"
                onClick={handleSaveAsJpg}
                disabled={isExportingJpg}
                className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 px-3 rounded-xl shadow-xs transition text-xs cursor-pointer disabled:opacity-50"
              >
                {isExportingJpg ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ImageIcon className="w-3.5 h-3.5" />
                )}
                {isExportingJpg
                  ? docLang === "bn"
                    ? "সেভ হচ্ছে..."
                    : "Saving..."
                  : docLang === "bn"
                  ? "ছবি সেভ (JPG)"
                  : "Save as JPG"}
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
                  <span>{docLang === "bn" ? "ডকুমেন্ট সংরক্ষিত হয়েছে!" : "Document Saved!"}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{docLang === "bn" ? "পরবর্তী ব্যবহারের জন্য মেমো সেভ রাখুন" : "Save Document for Next Use"}</span>
                </>
              )}
            </button>

            {/* Feedback notice for document save */}
            {docSaveMessage && (
              <div className="text-[11px] text-center font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 p-2 rounded-lg border border-emerald-200 dark:border-emerald-800">
                {docSaveMessage}
              </div>
            )}

            {/* 3. Save Brand Preset */}
            <button
              onClick={handleSaveToProfile}
              className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium py-2 rounded-xl transition text-xs cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  {docLang === "bn" ? "আপনার শপে সংরক্ষিত হয়েছে!" : "Saved to Your Shop Profile!"}
                </>
              ) : (
                <>
                  <Building className="w-4 h-4" />
                  {docLang === "bn"
                    ? "ব্র্যান্ড লেটারহেড প্রিসেট সেভ করুন"
                    : "Save Brand Preset for Next Time"}
                </>
              )}
            </button>
          </div>

          {/* In-sidebar AdSense Ad (Hidden when disabled) */}
          <AdSenseSlot slotId="editor-sidebar-slot" format="rectangle" label="Advertisement" />
        </div>

        {/* RIGHT COLUMN: Live Printable A4 Canvas */}
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
              className="flex items-center gap-1.5 text-xs font-bold bg-blue-600 text-white px-3 py-1.5 rounded-xl shadow-xs cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              {docLang === "bn" ? "ফর্মে ফিরুন" : "Back to Form"}
            </button>
          </div>

          <div className="w-full flex items-center justify-between mb-3 print:hidden">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {docLang === "bn" ? "A4 লাইভ প্রিন্ট প্রিভিউ (বাংলা)" : "A4 Pixel-Perfect Live Preview (English)"}
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

          {/* ACTUAL PRINTABLE SHEET (Clean White A4 Page) */}
          <div
            ref={printRef}
            id="printable-document"
            className={`w-full max-w-[210mm] min-h-[297mm] p-8 sm:p-10 print:border-none print:shadow-none print:p-0 print:m-0 print:w-full print:max-w-none text-xs flex flex-col justify-between transition-colors ${activeTheme.fontFamily} ${activeTheme.containerClass}`}
          >
            <div>
              {/* Header: Brand & Document Number */}
              <div className={`flex justify-between items-start pb-6 ${activeTheme.headerBorderClass}`}>
                <div className="space-y-1">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="h-14 object-contain mb-2" />
                  ) : (
                    <h1 className={`text-xl sm:text-2xl tracking-tight uppercase ${activeTheme.titleClass}`}>
                      {data.businessName || (docLang === "bn" ? "আপনার দোকানের নাম" : "Your Shop Name")}
                    </h1>
                  )}
                  {data.tagline && <p className="text-xs text-gray-600 font-medium">{data.tagline}</p>}
                  {data.address && <p className="text-xs text-gray-500">{data.address}</p>}
                  {data.phone && (
                    <p className="text-xs text-gray-500">
                      {docLang === "bn" ? "মোবাইল:" : "Phone:"} {data.phone}
                    </p>
                  )}
                </div>

                <div className="text-right space-y-1">
                  <span className="inline-block bg-gray-900 text-white font-black tracking-widest text-xs sm:text-sm px-4 py-1.5 uppercase rounded-sm">
                    {templateSlug.includes("chalan")
                      ? docLang === "bn" ? "ডেলিভারি চালান" : "DELIVERY CHALAN"
                      : templateSlug.includes("quotation")
                      ? docLang === "bn" ? "কোটেশন ও এস্টিমেট" : "QUOTATION"
                      : templateSlug.includes("tax") || templateSlug.includes("vat")
                      ? docLang === "bn" ? "মূসক-৬.৩ কর চালানপত্র" : "TAX INVOICE (MUSHAK-6.3)"
                      : templateSlug.includes("donation") || templateSlug.includes("charity")
                      ? docLang === "bn" ? "দান ও অনুদান রসিদ" : "DONATION RECEIPT"
                      : templateSlug.includes("consignment") || templateSlug.includes("courier")
                      ? docLang === "bn" ? "কুরিয়ার চালানপত্র" : "CONSIGNMENT NOTE"
                      : templateSlug.includes("auto") || templateSlug.includes("repair")
                      ? docLang === "bn" ? "ওয়ার্কশপ সার্ভিস বিল" : "AUTO REPAIR BILL"
                      : templateSlug.includes("warranty")
                      ? docLang === "bn" ? "ওয়ারেন্টি ইনভয়েস" : "WARRANTY INVOICE"
                      : templateSlug.includes("rent")
                      ? docLang === "bn" ? "ভাড়া রসিদ" : "RENT RECEIPT"
                      : templateSlug.includes("freelance")
                      ? docLang === "bn" ? "সার্ভিস ইনভয়েস" : "SERVICE INVOICE"
                      : templateSlug.includes("hospital-admission")
                      ? docLang === "bn" ? "ভর্তি ও বেড চার্জ বিল" : "ADMISSION BILL"
                      : templateSlug.includes("hospital-discharge")
                      ? docLang === "bn" ? "ছাড়পত্র ও ফাইনাল ক্লিয়ারেন্স" : "DISCHARGE CLEARANCE"
                      : templateSlug.includes("pharmacy")
                      ? docLang === "bn" ? "ফার্মেসি ক্যাশ মেমো" : "PHARMACY BILL"
                      : templateSlug.includes("doctor-consultation")
                      ? docLang === "bn" ? "ডাক্তার ফি রসিদ" : "CONSULTATION RECEIPT"
                      : templateSlug.includes("dental")
                      ? docLang === "bn" ? "ডেন্টাল চিকিৎসা বিল" : "DENTAL PROCEDURE BILL"
                      : templateSlug.includes("optical")
                      ? docLang === "bn" ? "চশমা ও অপটিক্যাল বিল" : "OPTICAL BILL"
                      : templateSlug.includes("physio")
                      ? docLang === "bn" ? "থেরাপি সেশন রসিদ" : "PHYSIOTHERAPY BILL"
                      : templateSlug.includes("pathology")
                      ? docLang === "bn" ? "প্যাথলজি বিল" : "PATHOLOGY BILL"
                      : templateSlug.includes("ambulance")
                      ? docLang === "bn" ? "অ্যাম্বুলেন্স স্লিপ" : "AMBULANCE SLIP"
                      : isMedicalReceipt
                      ? docLang === "bn" ? "মানি রিসিট ও টেস্ট বিল" : "MONEY RECEIPT"
                      : templateSlug.includes("pos")
                      ? docLang === "bn" ? "পিওএস রসিদ" : "POS RECEIPT"
                      : templateSlug.includes("boutique")
                      ? docLang === "bn" ? "বুটিক মেমো" : "BOUTIQUE CASH MEMO"
                      : docLang === "bn" ? "ক্যাশ মেমো" : "CASH MEMO"}
                  </span>
                  <p className="text-xs font-semibold text-gray-700 mt-2">
                    {docLang === "bn" ? "মেমো নং:" : "Invoice No:"}{" "}
                    <span className="text-gray-900 font-bold">{data.invoiceNumber}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    {docLang === "bn" ? "তারিখ:" : "Date:"} {data.date}
                  </p>
                  {data.courierPartner && (
                    <p className="text-[11px] text-gray-500">
                      {docLang === "bn" ? "কুরিয়ার:" : "Courier:"} {data.courierPartner}
                    </p>
                  )}
                </div>
              </div>

              {/* Bill To / Recipient Info - Bento Card */}
              <div className="grid grid-cols-12 gap-4 my-6 bg-slate-50/80 border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs">
                <div className="col-span-8 space-y-1">
                  <span className="text-[9.5px] uppercase font-bold text-slate-400 tracking-widest block mb-1">
                    {isMedicalReceipt
                      ? docLang === "bn"
                        ? "রোগীর বিবরণ / পেশেন্ট:"
                        : "PATIENT DEMOGRAPHICS:"
                      : docLang === "bn"
                      ? "ক্রেতার বিবরণ / কাস্টমার:"
                      : "BILLED TO / CUSTOMER:"}
                  </span>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                    {data.patientName || data.customerName ||
                      (docLang === "bn"
                        ? isMedicalReceipt
                          ? "রোগীর নাম"
                          : "ক্রেতার নাম"
                        : isMedicalReceipt
                        ? "Patient Name"
                        : "Customer Name")}
                  </h3>
                  <div className="text-xs text-slate-600 font-medium flex flex-wrap gap-x-2 gap-y-0.5">
                    {data.customerPhone && <span>{data.customerPhone}</span>}
                    {data.patientAge && <span>• {docLang === "bn" ? "বয়স:" : "Age:"} {data.patientAge}</span>}
                    {data.gender && <span>• {data.gender}</span>}
                    {data.patientId && <span>• ID: {data.patientId}</span>}
                    {data.bedWard && <span>• {data.bedWard}</span>}
                  </div>
                  {(data.referredBy || data.customerAddress) && (
                    <p className="text-xs text-slate-500 leading-tight mt-0.5">
                      {isMedicalReceipt ? (docLang === "bn" ? "রেফারেল:" : "Ref:") : ""} {data.referredBy || data.customerAddress}
                    </p>
                  )}
                  {isMedicalReceipt && (data.sampleTime || data.deliveryTime) && (
                    <div className="flex flex-wrap gap-2 pt-1 text-[10px] text-slate-500 font-medium">
                      {data.sampleTime && <span>🕒 {docLang === "bn" ? "নমুনা:" : "Sample:"} {data.sampleTime}</span>}
                      {data.deliveryTime && <span>🚚 {docLang === "bn" ? "ডেলিভারি:" : "Delivery:"} {data.deliveryTime}</span>}
                    </div>
                  )}
                </div>
                <div className="col-span-4 flex flex-col justify-between items-end text-right">
                  <span className="text-[9.5px] uppercase font-bold text-slate-400 tracking-widest block mb-1">
                    {docLang === "bn" ? "পেমেন্ট অবস্থা:" : "PAYMENT STATUS:"}
                  </span>
                  <span
                    className={`inline-block text-xs font-black px-3.5 py-1.5 rounded-full shadow-2xs tracking-wider uppercase ${
                      due <= 0
                        ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                        : "bg-amber-100 text-amber-900 border border-amber-300"
                    }`}
                  >
                    {due <= 0
                      ? docLang === "bn"
                        ? "সম্পূর্ণ পরিশোধিত (PAID)"
                        : "PAID IN FULL"
                      : docLang === "bn"
                      ? `${isMedicalReceipt ? "বকেয়া ফি:" : "বাকি (COD):"} ${currency} ${due.toLocaleString()}`
                      : `${isMedicalReceipt ? "DUE:" : "COD DUE:"} ${currency} ${due.toLocaleString()}`}
                  </span>
                  {data.courierPartner && (
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 mt-1 inline-block">
                      🚚 {data.courierPartner}
                    </span>
                  )}
                </div>
              </div>

              {/* Items Table with Tabular Numbers */}
              <table className="w-full text-left border-collapse my-6">
                <thead>
                  <tr className={`border-b border-slate-900 uppercase text-[9.5px] font-black tracking-wider ${activeTheme.tableHeaderClass}`}>
                    <th className="py-2.5 px-3 w-10 rounded-l-lg">{docLang === "bn" ? "নং" : "#"}</th>
                    <th className="py-2.5 px-3">
                      {isMedicalReceipt
                        ? docLang === "bn"
                          ? "প্যাথলজি / ডায়াগনস্টিক টেস্টের বিবরণ"
                          : "Investigation / Test Description"
                        : docLang === "bn"
                        ? "পণ্যের বিবরণ"
                        : "Item Description"}
                    </th>
                    <th className="py-2.5 px-3 text-center w-20">
                      {isMedicalReceipt ? (docLang === "bn" ? "সংখ্যা" : "Qty") : docLang === "bn" ? "পরিমাণ" : "Qty"}
                    </th>
                    <th className="py-2.5 px-3 text-right w-28">
                      {isMedicalReceipt ? (docLang === "bn" ? "ফি (টাকা)" : "Test Fee") : docLang === "bn" ? "দর (টাকা)" : "Unit Price"}
                    </th>
                    <th className="py-2.5 px-3 text-right w-32 rounded-r-lg">{docLang === "bn" ? "মোট টাকা" : "Total"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {itemsList.map((item: any, idx: number) => (
                    <tr key={idx} className={`hover:bg-slate-50/60 transition-colors ${activeTheme.tableRowClass}`}>
                      <td className="py-3 px-3 text-slate-400 font-medium tabular-nums">{idx + 1}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800">
                        {item.name}
                        {(item.batchNo || item.expiry || item.specimen) && (
                          <span className="block text-[10px] font-normal text-slate-500 mt-0.5">
                            {item.batchNo && `Batch: ${item.batchNo} `}
                            {item.expiry && `• Exp: ${item.expiry} `}
                            {item.specimen && `• Sample: ${item.specimen}`}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center text-slate-700 tabular-nums">{item.quantity}</td>
                      <td className="py-3 px-3 text-right text-slate-700 tabular-nums">
                        {currency} {Number(item.price).toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-black text-slate-900 tabular-nums">
                        {currency} {(item.quantity * item.price).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Calculations & Words Breakdown */}
              <div className="grid grid-cols-12 gap-6 pt-4 border-t border-slate-200 avoid-break">
                <div className="col-span-7 space-y-3">
                  <div className="bg-slate-50/90 p-3.5 rounded-xl border border-slate-200">
                    <span className="text-[9.5px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">
                      {docLang === "bn" ? "কথায়:" : "IN WORDS:"}
                    </span>
                    <p className="text-xs font-bold text-slate-800 italic leading-relaxed">
                      {docLang === "bn" ? numberToWordsBengali(grandTotal) : numberToWordsEnglish(grandTotal, currencyName)}
                    </p>
                  </div>
                  {data.notes && (
                    <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[9.5px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">
                        {docLang === "bn" ? "শর্তাবলী ও নোটস:" : "TERMS & CONDITIONS:"}
                      </span>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{data.notes}</p>
                    </div>
                  )}
                  {/* Simulated Barcode */}
                  <div className="pt-1">
                    <span className="font-mono text-[9px] text-slate-500 tracking-widest block">
                      ||| |||| || |||||| | |||| ||| |||||||
                    </span>
                    <span className="text-[8px] font-mono text-slate-400">
                      {data.invoiceNumber} • SECURE VERIFIED
                    </span>
                  </div>
                </div>

                <div className="col-span-5 space-y-2 text-right">
                  <div className="flex justify-between text-xs text-slate-600 font-medium">
                    <span>{docLang === "bn" ? "উপমোট:" : "Subtotal:"}</span>
                    <span className="font-semibold tabular-nums text-slate-800">
                      {currency} {subtotal.toLocaleString()}
                    </span>
                  </div>
                  {delivery > 0 && (
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>{docLang === "bn" ? "ডেলিভারি চার্জ:" : "Delivery Fee:"}</span>
                      <span className="tabular-nums">
                        +{currency} {delivery.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {discount > 0 && (
                    <div className="flex justify-between text-xs text-emerald-600 font-medium">
                      <span>{docLang === "bn" ? "বিশেষ ছাড়:" : "Special Discount:"}</span>
                      <span className="tabular-nums">
                        -{currency} {discount.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {vatTaxAmount > 0 && (
                    <div className="flex justify-between text-xs text-slate-600 font-medium">
                      <span>{docLang === "bn" ? `ভ্যাট / ট্যাক্স (${vatTaxPercent}%):` : `VAT / Tax (${vatTaxPercent}%):`}</span>
                      <span className="tabular-nums">
                        +{currency} {vatTaxAmount.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {/* Grand Total Box */}
                  <div className={`flex justify-between text-sm font-black pt-3 pb-3 px-3.5 my-2 rounded-xl text-slate-900 border ${activeTheme.totalBoxClass}`}>
                    <span className="uppercase tracking-wider">{docLang === "bn" ? "সর্বমোট বিল:" : "Grand Total:"}</span>
                    <span className="tabular-nums text-base">
                      {currency} {grandTotal.toLocaleString()}
                    </span>
                  </div>
                  {paid > 0 && (
                    <div className="flex justify-between text-xs text-slate-600 pt-1">
                      <span>{docLang === "bn" ? "অগ্রিম জমা:" : "Advance Paid:"}</span>
                      <span className="tabular-nums">
                        {currency} {paid.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs font-bold text-gray-800 pt-1">
                    <span>{docLang === "bn" ? "ডেলিভারির সময় প্রদেয়:" : "Net Due on Delivery:"}</span>
                    <span className="text-blue-700 font-black">
                      {currency} {due.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Signature & Watermark */}
            <div className="mt-16 pt-6 border-t border-gray-200 flex justify-between items-end">
              <div>
                <p className="text-[10px] text-gray-400">
                  {docLang === "bn" ? "তৈরি হয়েছে" : "Generated via"}{" "}
                  <strong className="text-gray-600">freedocforge.com</strong> •{" "}
                  {docLang === "bn" ? "১০০% ফ্রি স্মার্ট মেমো" : "100% Free Smart Printable"}
                </p>
              </div>
              <div className="text-center">
                {signaturePreview ? (
                  <img src={signaturePreview} alt="Signature" className="h-10 mx-auto mb-1 object-contain" />
                ) : (
                  <div className="w-36 border-b border-gray-400 mb-1 mx-auto"></div>
                )}
                <span className="text-[11px] font-bold text-gray-700">
                  {data.signatoryTitle ||
                    (isMedicalReceipt
                      ? docLang === "bn" ? "ক্যাশিয়ার / অথরাইজড মেডিকেল টেকনোলজিস্ট" : "Cashier / Medical Technologist"
                      : docLang === "bn" ? "অনুমোদিত স্বাক্ষর" : "Authorized Signature")}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Banner AdSense */}
          <AdSenseSlot slotId="canvas-bottom-banner" format="horizontal" className="print:hidden" />
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
        documentTitle={data.businessName || data.templateTitle || "Document"}
        lang={docLang}
        paperSize={isPos ? "POS_80MM" : "A4"}
      />
    </div>
  );
}
