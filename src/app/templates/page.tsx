"use client";

import React, { useState, useMemo, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UserWorkspaceShell from "@/components/UserWorkspaceShell";
import AdSenseSlot from "@/components/AdSenseSlot";
import TemplateCardPreview from "@/components/TemplateCardPreview";
import JsonLd from "@/components/JsonLd";
import { getBreadcrumbListSchema, SITE_URL } from "@/lib/seo";
import {
  INITIAL_TEMPLATES,
  RECEIPT_TEMPLATES,
  CLASS_ROUTINE_TEMPLATES,
  EXAM_ROUTINE_TEMPLATES,
  MEDICAL_RECEIPT_TEMPLATES,
  OTHER_EDUCATION_TEMPLATES,
  OTHER_HEALTHCARE_TEMPLATES,
  TemplateDefinition,
} from "@/lib/templates";
import {
  Printer,
  Search,
  ShoppingBag,
  GraduationCap,
  Stethoscope,
  Filter,
  Sparkles,
  Layers,
  CheckCircle2,
  Eye,
  X,
  Receipt,
  Calendar,
  FileText,
  Download,
  Building,
  Check,
  ChevronDown,
  MoreHorizontal,
  Star,
  ArrowUpDown,
  Copy,
  ExternalLink,
  Share2,
} from "lucide-react";
import { useGlobalSettings } from "@/context/GlobalSettingsContext";

// Exact 6-Pillar Slug Sets for 100% mathematical count accuracy & zero overlapping
const RECEIPT_SLUGS = new Set(RECEIPT_TEMPLATES.map((t) => t.slug));
const CLASS_ROUTINE_SLUGS = new Set(CLASS_ROUTINE_TEMPLATES.map((t) => t.slug));
const EXAM_ROUTINE_SLUGS = new Set(EXAM_ROUTINE_TEMPLATES.map((t) => t.slug));
const MEDICAL_RECEIPT_SLUGS = new Set(MEDICAL_RECEIPT_TEMPLATES.map((t) => t.slug));
const ACADEMIC_OTHER_SLUGS = new Set(OTHER_EDUCATION_TEMPLATES.map((t) => t.slug));
const MEDICAL_OTHER_SLUGS = new Set(OTHER_HEALTHCARE_TEMPLATES.map((t) => t.slug));

function isReceiptTemplate(t: TemplateDefinition): boolean {
  return RECEIPT_SLUGS.has(t.slug);
}

function isClassRoutineTemplate(t: TemplateDefinition): boolean {
  return CLASS_ROUTINE_SLUGS.has(t.slug);
}

function isExamRoutineTemplate(t: TemplateDefinition): boolean {
  return EXAM_ROUTINE_SLUGS.has(t.slug);
}

function isMedicalReceiptTemplate(t: TemplateDefinition): boolean {
  return MEDICAL_RECEIPT_SLUGS.has(t.slug);
}

function isAcademicOtherTemplate(t: TemplateDefinition): boolean {
  return ACADEMIC_OTHER_SLUGS.has(t.slug);
}

function isMedicalOtherTemplate(t: TemplateDefinition): boolean {
  return MEDICAL_OTHER_SLUGS.has(t.slug);
}

function CatalogContent() {
  const router = useRouter();
  const { lang, t } = useGlobalSettings();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPaperSize, setSelectedPaperSize] = useState<"all" | "A4" | "POS_80MM">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [quickViewTemplate, setQuickViewTemplate] = useState<TemplateDefinition | null>(null);

  // Authentication & Personalization Profile State
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Favorites / Pinned Templates System
  const [favorites, setFavorites] = useState<string[]>([]);

  // Sorting System: Recommended, Alphabetical, Paper Size
  const [sortBy, setSortBy] = useState<"recommended" | "alpha" | "paper_a4" | "paper_pos">("recommended");

  // Quick Direct Link Copy Feedback
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [visibleCount, setVisibleCount] = useState<number>(4);

  // Load User, Profile Preset & Scoped Favorites
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated && data.user) {
          setActiveUserId(data.user.id);
          setUserProfile(data.user);

          const favKey = `freedocforge_favorites_${data.user.id}`;
          const savedFavs = localStorage.getItem(favKey);
          if (savedFavs) {
            try {
              setFavorites(JSON.parse(savedFavs));
            } catch {}
          }

          // Fetch organization / business name from profile for personalization
          fetch("/api/user/profile")
            .then((r) => (r.ok ? r.json() : null))
            .then((pData) => {
              if (pData?.profile) {
                setUserProfile((prev: any) => ({
                  ...prev,
                  ...pData.profile,
                }));
              }
            })
            .catch(() => {});
        } else {
          const guestFavs = localStorage.getItem("freedocforge_favorites_guest");
          if (guestFavs) {
            try {
              setFavorites(JSON.parse(guestFavs));
            } catch {}
          }
        }
      })
      .catch(() => {
        const guestFavs = localStorage.getItem("freedocforge_favorites_guest");
        if (guestFavs) {
          try {
            setFavorites(JSON.parse(guestFavs));
          } catch {}
        }
      });
  }, []);

  const handleToggleFavorite = (slug: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setFavorites((prev) => {
      const exists = prev.includes(slug);
      const next = exists ? prev.filter((s) => s !== slug) : [...prev, slug];
      const favKey = activeUserId ? `freedocforge_favorites_${activeUserId}` : "freedocforge_favorites_guest";
      try {
        localStorage.setItem(favKey, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleCopyDirectLink = (slug: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/templates/${slug}`;
      navigator.clipboard.writeText(url);
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2500);
    }
  };

  // Sync with URL query parameter
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      if (
        [
          "all",
          "favorites",
          "receipts",
          "class-routines",
          "exam-routines",
          "medical-receipts",
          "academic-other",
          "medical-other",
        ].includes(cat)
      ) {
        setSelectedCategory(cat);
      }
    }
  }, [searchParams]);

  // Exact 6-Pillar Category Configuration & 100% Count Accuracy
  const categoryTabs = useMemo(() => {
    const tabs = [
      {
        id: "all",
        label: lang === "bn" ? "সকল টেমপ্লেট" : "All Templates",
        count: INITIAL_TEMPLATES.length,
        icon: Layers,
      },
    ];

    if (favorites.length > 0) {
      tabs.push({
        id: "favorites",
        label: lang === "bn" ? "পিন করা টেমপ্লেট" : "Pinned",
        count: favorites.length,
        icon: Star,
      });
    }

    tabs.push(
      {
        id: "receipts",
        label: lang === "bn" ? "ক্যাশ মেমো ও ইনভয়েস" : "Worldwide Receipts",
        count: RECEIPT_TEMPLATES.length,
        icon: Receipt,
      },
      {
        id: "class-routines",
        label: lang === "bn" ? "ক্লাস রুটিন" : "Class Routines",
        count: CLASS_ROUTINE_TEMPLATES.length,
        icon: Calendar,
      },
      {
        id: "exam-routines",
        label: lang === "bn" ? "পরীক্ষার রুটিন" : "Exam Routines",
        count: EXAM_ROUTINE_TEMPLATES.length,
        icon: GraduationCap,
      },
      {
        id: "medical-receipts",
        label: lang === "bn" ? "চিকিৎসা ও ডায়াগনস্টিক রসিদ" : "Medical Receipts",
        count: MEDICAL_RECEIPT_TEMPLATES.length,
        icon: Stethoscope,
      },
      {
        id: "academic-other",
        label: lang === "bn" ? "অন্যান্য শিক্ষা ফরম্যাট" : "Other Academic",
        count: OTHER_EDUCATION_TEMPLATES.length,
        icon: FileText,
      },
      {
        id: "medical-other",
        label: lang === "bn" ? "প্রেসক্রিপশন ও টোকেন" : "Rx & Clinic Slips",
        count: OTHER_HEALTHCARE_TEMPLATES.length,
        icon: Building,
      }
    );

    return tabs;
  }, [lang, favorites]);

  // Dynamically calculate visible category tabs that fit cleanly on this screen
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const calculateVisibleTabs = () => {
      const containerWidth = container.clientWidth;
      if (!containerWidth) return;

      const TAB_WIDTHS_MAP: Record<string, number> = {
        all: 135,
        favorites: 110,
        receipts: 180,
        "class-routines": 145,
        "exam-routines": 150,
        "medical-receipts": 165,
        "academic-other": 150,
        "medical-other": 155,
      };
      const MORE_BTN_WIDTH = 125;
      const GAP = 8;

      let totalNeeded = 0;
      for (let i = 0; i < categoryTabs.length; i++) {
        totalNeeded += (TAB_WIDTHS_MAP[categoryTabs[i].id] || 150) + (i > 0 ? GAP : 0);
      }
      if (containerWidth >= totalNeeded) {
        setVisibleCount(categoryTabs.length);
        return;
      }

      const availableForTabs = containerWidth - MORE_BTN_WIDTH - GAP;
      let used = 0;
      let fitCount = 0;
      for (let i = 0; i < categoryTabs.length; i++) {
        const w = (TAB_WIDTHS_MAP[categoryTabs[i].id] || 150) + (i > 0 ? GAP : 0);
        if (used + w <= availableForTabs) {
          used += w;
          fitCount++;
        } else {
          break;
        }
      }
      setVisibleCount(Math.max(1, Math.min(categoryTabs.length, fitCount)));
    };

    calculateVisibleTabs();

    const resizeObserver = new ResizeObserver(() => {
      calculateVisibleTabs();
    });
    resizeObserver.observe(container);

    window.addEventListener("resize", calculateVisibleTabs, { passive: true });
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", calculateVisibleTabs);
    };
  }, [categoryTabs]);

  // Click outside listener for more menu popover
  useEffect(() => {
    if (!showMoreMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMoreMenu]);

  // Partition categories into visible tabs on this screen vs overflow in "More"
  const { visibleTabs, overflowTabs, activeInOverflow } = useMemo(() => {
    if (visibleCount >= categoryTabs.length) {
      return {
        visibleTabs: categoryTabs,
        overflowTabs: [],
        activeInOverflow: null,
      };
    }

    const visible = categoryTabs.slice(0, visibleCount);
    const overflow = categoryTabs.slice(visibleCount);
    const activeOverflowItem = overflow.find((t) => t.id === selectedCategory) || null;

    return {
      visibleTabs: visible,
      overflowTabs: overflow,
      activeInOverflow: activeOverflowItem,
    };
  }, [categoryTabs, visibleCount, selectedCategory]);

  // Filter Templates
  const filteredTemplates = useMemo(() => {
    return INITIAL_TEMPLATES.filter((tmpl) => {
      // 1. Pillar / Category / Pinned Filter
      if (selectedCategory === "favorites") {
        if (!favorites.includes(tmpl.slug)) return false;
      } else if (selectedCategory === "receipts") {
        if (!isReceiptTemplate(tmpl)) return false;
      } else if (selectedCategory === "class-routines") {
        if (!isClassRoutineTemplate(tmpl)) return false;
      } else if (selectedCategory === "exam-routines") {
        if (!isExamRoutineTemplate(tmpl)) return false;
      } else if (selectedCategory === "medical-receipts") {
        if (!isMedicalReceiptTemplate(tmpl)) return false;
      } else if (selectedCategory === "academic-other") {
        if (!isAcademicOtherTemplate(tmpl)) return false;
      } else if (selectedCategory === "medical-other") {
        if (!isMedicalOtherTemplate(tmpl)) return false;
      }

      // 2. Paper Size Filter
      if (selectedPaperSize !== "all") {
        if (tmpl.paperSize !== selectedPaperSize) return false;
      }

      // 3. Search Query Filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase().trim();
        const matchesEnTitle = tmpl.title.toLowerCase().includes(query);
        const matchesBnTitle = tmpl.locales?.bn?.title.toLowerCase().includes(query);
        const matchesEnDesc = tmpl.description.toLowerCase().includes(query);
        const matchesBnDesc = tmpl.locales?.bn?.description.toLowerCase().includes(query);
        const matchesBadge = tmpl.badge?.toLowerCase().includes(query);
        const matchesSlug = tmpl.slug.toLowerCase().includes(query);

        return (
          matchesEnTitle ||
          matchesBnTitle ||
          matchesEnDesc ||
          matchesBnDesc ||
          matchesBadge ||
          matchesSlug
        );
      }

      return true;
    });
  }, [selectedCategory, selectedPaperSize, searchQuery, favorites]);

  // Sort Templates: Recommended, A-Z Alphabetical, Paper Size A4/POS
  const sortedTemplates = useMemo(() => {
    const list = [...filteredTemplates];
    if (sortBy === "alpha") {
      return list.sort((a, b) => {
        const titleA = lang === "bn" && a.locales?.bn?.title ? a.locales.bn.title : a.title;
        const titleB = lang === "bn" && b.locales?.bn?.title ? b.locales.bn.title : b.title;
        return titleA.localeCompare(titleB);
      });
    }
    if (sortBy === "paper_a4") {
      return list.sort((a, b) => {
        if (a.paperSize === "A4" && b.paperSize !== "A4") return -1;
        if (a.paperSize !== "A4" && b.paperSize === "A4") return 1;
        return 0;
      });
    }
    if (sortBy === "paper_pos") {
      return list.sort((a, b) => {
        if (a.paperSize === "POS_80MM" && b.paperSize !== "POS_80MM") return -1;
        if (a.paperSize !== "POS_80MM" && b.paperSize === "POS_80MM") return 1;
        return 0;
      });
    }
    return list;
  }, [filteredTemplates, sortBy, lang]);

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Header Title Section */}
      <div className="text-center max-w-3xl mx-auto mb-6">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3 border border-blue-200 dark:border-blue-900 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>
            {lang === "bn"
              ? "৬০টি রেডিমেড স্মার্ট প্রিন্ট ও ডাউনলোড ফরম্যাট"
              : "60 Ready-to-Print Smart Templates"}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          {lang === "bn" ? "ফ্রি ডকুমেন্ট টেমপ্লেট গ্যালারি" : "Explore Free Printable Templates"}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl mx-auto leading-relaxed">
          {lang === "bn"
            ? "ক্যাশ মেমো, ক্লাস রুটিন, পরীক্ষার সময়সূচি ও ক্লিনিক রসিদ। প্রিভিউ দেখে পছন্দ করুন, তথ্য টাইপ বা মুখে বলুন, এবং ওয়াটারমার্ক ছাড়াই ১-ক্লিকে ভেক্টর PDF ডাউনলোড করুন।"
            : "Invoices, class routines, exam schedules & clinic receipts. Preview visual document snapshots, customize via typing or voice, and download watermark-free PDFs."}
        </p>
      </div>

      {/* Profile Personalization Indicator Banner */}
      {userProfile && (
        <div className="mb-6 p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-200/80 dark:border-blue-900/80 flex items-center justify-between flex-wrap gap-2 text-xs animate-in fade-in">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="font-bold">
              {lang === "bn"
                ? `${userProfile.businessName || userProfile.name || "ইউজার"}-এর ব্র্যান্ড প্রোফাইলের সাথে সিঙ্ক রয়েছে`
                : `Synced with ${userProfile.businessName || userProfile.name || "Your"}'s Brand Organization Preset`}
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-[11px] hidden md:inline">
              • {lang === "bn" ? "সকল টেমপ্লেটে আপনার লোগো, নাম ও যোগাযোগের তথ্য স্বয়ংক্রিয়ভাবে বসে যাবে" : "Auto-fills your logo & contacts across all printable documents"}
            </span>
          </div>
          <Link
            href="/dashboard/shop-profile"
            className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 shrink-0"
          >
            <span>{lang === "bn" ? "প্রোফাইল সেটিংস" : "Manage Profile Preset"}</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* Top AdSense Banner */}
      <AdSenseSlot slotId="catalog-header-banner" format="horizontal" />

      {/* CONTROLS: Category Tabs, Paper Size Filter, Sorting & Search Bar */}
      <div className="my-8 space-y-4">
        {/* Category Switcher Tabs Container: Dynamic partition into visible tabs & More overflow */}
        <div ref={containerRef} className="relative flex items-center gap-2 w-full flex-nowrap overflow-hidden">
          {/* Visible Category Tabs that fit on this screen */}
          <div className="flex items-center gap-2 flex-nowrap shrink-0">
            {visibleTabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = selectedCategory === tab.id;
              const isFavoritesTab = tab.id === "favorites";

              let activeColorClass = "bg-blue-600 text-white shadow-md shadow-blue-500/20";
              let badgeColorClass = "bg-blue-800 text-blue-100";
              if (tab.id === "all") {
                activeColorClass = "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md";
                badgeColorClass = "bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900";
              } else if (tab.id === "favorites") {
                activeColorClass = "bg-amber-500 text-white shadow-md shadow-amber-500/25 ring-2 ring-amber-300/60";
                badgeColorClass = "bg-amber-700 text-amber-100";
              } else if (tab.id === "receipts") {
                activeColorClass = "bg-emerald-600 text-white shadow-md shadow-emerald-500/25";
                badgeColorClass = "bg-emerald-800 text-emerald-100";
              } else if (tab.id === "class-routines") {
                activeColorClass = "bg-blue-600 text-white shadow-md shadow-blue-500/25";
                badgeColorClass = "bg-blue-800 text-blue-100";
              } else if (tab.id === "exam-routines") {
                activeColorClass = "bg-indigo-600 text-white shadow-md shadow-indigo-500/25";
                badgeColorClass = "bg-indigo-800 text-indigo-100";
              } else if (tab.id === "medical-receipts") {
                activeColorClass = "bg-rose-600 text-white shadow-md shadow-rose-500/25";
                badgeColorClass = "bg-rose-800 text-rose-100";
              } else if (tab.id === "academic-other") {
                activeColorClass = "bg-sky-600 text-white shadow-md shadow-sky-500/25";
                badgeColorClass = "bg-sky-800 text-sky-100";
              } else if (tab.id === "medical-other") {
                activeColorClass = "bg-teal-600 text-white shadow-md shadow-teal-500/25";
                badgeColorClass = "bg-teal-800 text-teal-100";
              }

              return (
                <button
                  key={tab.id}
                  data-tab-id={tab.id}
                  onClick={() => {
                    setSelectedCategory(tab.id);
                    setShowMoreMenu(false);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer shrink-0 ${
                    isActive
                      ? activeColorClass
                      : isFavoritesTab
                      ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 hover:bg-amber-100"
                      : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <IconComponent className={`w-4 h-4 ${isFavoritesTab ? "fill-amber-400" : ""}`} />
                  <span className="whitespace-nowrap">{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                      isActive
                        ? badgeColorClass
                        : isFavoritesTab
                        ? "bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* More (...) Dropdown Launcher for categories not seen on this screen */}
          {overflowTabs.length > 0 && (
            <div ref={moreMenuRef} className="relative shrink-0 z-20">
              <button
                type="button"
                onClick={() => setShowMoreMenu((prev) => !prev)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border transition cursor-pointer shrink-0 shadow-xs ${
                  activeInOverflow
                    ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                    : showMoreMenu
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
                title={
                  activeInOverflow
                    ? `${activeInOverflow.label} (${activeInOverflow.count})`
                    : lang === "bn"
                    ? "অন্যান্য ক্যাটাগরি"
                    : "More Categories"
                }
              >
                {activeInOverflow ? (
                  <>
                    {React.createElement(activeInOverflow.icon, { className: "w-4 h-4 shrink-0" })}
                    <span className="whitespace-nowrap">{activeInOverflow.label}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full font-extrabold bg-blue-800 text-blue-100">
                      {activeInOverflow.count}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 shrink-0 opacity-80" />
                  </>
                ) : (
                  <>
                    <MoreHorizontal className="w-4 h-4 shrink-0" />
                    <span>{lang === "bn" ? "আরও" : "More"}</span>
                    <ChevronDown className="w-3.5 h-3.5 shrink-0 opacity-60" />
                  </>
                )}
              </button>

              {/* Dropdown Menu Popover: ONLY categories not seen on this screen */}
              {showMoreMenu && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-1.5 z-40 space-y-0.5 animate-in fade-in zoom-in-95">
                  <div className="px-2.5 py-1.5 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    {lang === "bn" ? "আরও ক্যাটাগরি" : "More Categories"}
                  </div>
                  {overflowTabs.map((tab) => {
                    const IconComp = tab.icon;
                    const isSelected = selectedCategory === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(tab.id);
                          setShowMoreMenu(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                          isSelected
                            ? "bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 font-bold"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <IconComp className="w-4 h-4 shrink-0" />
                          <span className="truncate">{tab.label}</span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 shrink-0 ml-2">
                          {tab.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Search Bar, Paper Size Filter & Sorting Dropdown */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white/75 dark:bg-slate-900/75 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          {/* Left group: Paper Size Filter Pills & Sorting Dropdown */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1 lg:pb-0">
            {/* Paper Size Filter Pills */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1 pr-1 shrink-0">
                <Filter className="w-3.5 h-3.5" />
                <span>{lang === "bn" ? "সাইজ:" : "Paper:"}</span>
              </span>
              {[
                { id: "all", label: lang === "bn" ? "সকল সাইজ" : "All Sizes" },
                { id: "A4", label: lang === "bn" ? "A4 স্ট্যান্ডার্ড" : "A4 Sheet" },
                { id: "POS_80MM", label: lang === "bn" ? "৮০মিমি POS রোল" : "80mm Thermal" },
              ].map((sizeOpt) => {
                const isSizeActive = selectedPaperSize === sizeOpt.id;
                return (
                  <button
                    key={sizeOpt.id}
                    onClick={() => setSelectedPaperSize(sizeOpt.id as any)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg shrink-0 transition cursor-pointer ${
                      isSizeActive
                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs"
                        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {sizeOpt.label}
                  </button>
                );
              })}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 shrink-0 pl-2 border-l border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1 shrink-0">
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>{lang === "bn" ? "বাছাই:" : "Sort:"}</span>
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs"
              >
                <option value="recommended">{lang === "bn" ? "প্রস্তাবিত (ডিফল্ট)" : "Recommended"}</option>
                <option value="alpha">{lang === "bn" ? "অক্ষর অনুযায়ী (A - Z)" : "A - Z (Alphabetical)"}</option>
                <option value="paper_a4">{lang === "bn" ? "A4 সাইজ আগে" : "Paper Size (A4 First)"}</option>
                <option value="paper_pos">{lang === "bn" ? "৮০মিমি POS আগে" : "Paper Size (80mm POS First)"}</option>
              </select>
            </div>
          </div>

          {/* Live Instant Search Bar */}
          <div className="relative min-w-[260px] sm:min-w-[320px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                lang === "bn"
                  ? "টেমপ্লেট খুঁজুন (যেমন: মেমো, রুটিন, পরীক্ষার সূচি, পিওএস)..."
                  : "Search templates by keyword or slug..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Count & Current Active Filters Summary */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4">
        <p>
          {lang === "bn" ? "প্রদর্শিত টেমপ্লেট:" : "Showing"}{" "}
          <strong className="text-slate-900 dark:text-white font-bold">{sortedTemplates.length}</strong>{" "}
          {lang === "bn" ? "টি" : "templates"}
        </p>
        {(selectedCategory !== "all" || selectedPaperSize !== "all" || searchQuery) && (
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSelectedPaperSize("all");
              setSearchQuery("");
            }}
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
          >
            {lang === "bn" ? "ফিল্টার ক্লিয়ার করুন" : "Reset Filters"}
          </button>
        )}
      </div>

      {/* Templates Grid (Distinct Beautiful Cards with Visual Snapshot Mockup) */}
      {sortedTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 my-6">
          {sortedTemplates.map((tmpl) => {
            const isReceipt = isReceiptTemplate(tmpl);
            const isClassRoutine = isClassRoutineTemplate(tmpl);
            const isExamRoutine = isExamRoutineTemplate(tmpl);
            const isMedicalReceipt = isMedicalReceiptTemplate(tmpl);
            const isFav = favorites.includes(tmpl.slug);

            const categoryBadgeColor = isReceipt
              ? "bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
              : isClassRoutine
              ? "bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
              : isExamRoutine
              ? "bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
              : isMedicalReceipt
              ? "bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800"
              : "bg-slate-50 dark:bg-slate-950/70 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800";

            const localizedTitle =
              lang === "bn" && tmpl.locales?.bn?.title ? tmpl.locales.bn.title : tmpl.title;
            const localizedDesc =
              lang === "bn" && tmpl.locales?.bn?.description
                ? tmpl.locales.bn.description
                : tmpl.description;
            const localizedBadge =
              lang === "bn" && tmpl.locales?.bn?.badge ? tmpl.locales.bn.badge : tmpl.badge;

            return (
              <div
                key={tmpl.id}
                onClick={() => router.push(`/templates/${tmpl.slug}`)}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group cursor-pointer relative ring-1 ring-slate-900/5 hover:ring-blue-500/20"
              >
                <div>
                  {/* 1. VISUAL TEMPLATE SNAPSHOT / MOCKUP VIEW */}
                  <div className="mb-4">
                    <TemplateCardPreview
                      template={tmpl}
                      lang={lang}
                      onQuickView={(t) => setQuickViewTemplate(t)}
                    />
                  </div>

                  {/* 2. Top Badges */}
                  <div className="flex items-center justify-between mb-2.5 flex-wrap gap-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border flex items-center gap-1 ${categoryBadgeColor}`}
                      >
                        {isReceipt && <Receipt className="w-3 h-3" />}
                        {isClassRoutine && <Calendar className="w-3 h-3" />}
                        {isExamRoutine && <GraduationCap className="w-3 h-3" />}
                        {isMedicalReceipt && <Stethoscope className="w-3 h-3" />}
                        <span>
                          {isReceipt
                            ? lang === "bn"
                              ? "ক্যাশ মেমো / ইনভয়েস"
                              : "Invoice / Receipt"
                            : isClassRoutine
                            ? lang === "bn"
                              ? "ক্লাস রুটিন"
                              : "Class Routine"
                            : isExamRoutine
                            ? lang === "bn"
                              ? "পরীক্ষার রুটিন"
                              : "Exam Routine"
                            : isMedicalReceipt
                            ? lang === "bn"
                              ? "চিকিৎসা রসিদ"
                              : "Medical Receipt"
                            : isAcademicOtherTemplate(tmpl)
                            ? lang === "bn"
                              ? "একাডেমিক ফরম্যাট"
                              : "Academic Format"
                            : isMedicalOtherTemplate(tmpl)
                            ? lang === "bn"
                              ? "প্রেসক্রিপশন / স্লিপ"
                              : "Clinical Rx / Slip"
                            : tmpl.category}
                        </span>
                      </span>

                      {/* Golden Star Pinned Indicator Badge */}
                      {isFav && (
                        <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-800 flex items-center gap-1 shadow-2xs">
                          <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-600" />
                          <span>{lang === "bn" ? "পিন করা" : "Pinned"}</span>
                        </span>
                      )}
                    </div>

                    {localizedBadge && (
                      <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-900">
                        {localizedBadge}
                      </span>
                    )}
                  </div>

                  {/* 3. Title */}
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-snug">
                    {localizedTitle}
                  </h3>

                  {/* 4. Description */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed line-clamp-2">
                    {localizedDesc}
                  </p>

                  {/* 5. Design Style Pill */}
                  {tmpl.designStyle && (
                    <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                      <span>Style: {tmpl.designStyle}</span>
                    </div>
                  )}
                </div>

                {/* 6. Bottom Action Footer */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md shrink-0">
                    {tmpl.paperSize === "POS_80MM" ? "৮০মিমি POS" : "A4 সাইজ"}
                  </span>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    {/* Star Favorite Toggle Button */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleFavorite(tmpl.slug, e)}
                      className={`p-2 rounded-xl transition cursor-pointer ${
                        isFav
                          ? "text-amber-500 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100"
                          : "text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                      title={isFav ? "Remove from Pinned Favorites" : "Pin to Favorites"}
                    >
                      <Star className={`w-4 h-4 ${isFav ? "fill-amber-400 text-amber-500" : ""}`} />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuickViewTemplate(tmpl);
                      }}
                      className="p-2 rounded-xl text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      title={lang === "bn" ? "বড় করে ডিজাইন দেখুন" : "View Template Preview"}
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <Link
                      href={`/templates/${tmpl.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl transition shadow-xs hover:shadow-md cursor-pointer shrink-0"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>{lang === "bn" ? "এডিট ও প্রিন্ট" : "Edit & Print"}</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 my-8">
          <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            {lang === "bn" ? "কোনো টেমপ্লেট পাওয়া যায়নি" : "No templates matched your filter"}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {lang === "bn"
              ? "অনুগ্রহ করে অন্য কোনো শব্দ অনুসন্ধান করুন অথবা ফিল্টার পরিবর্তন করুন।"
              : "Try adjusting your search query or selecting a different category."}
          </p>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSelectedPaperSize("all");
              setSearchQuery("");
            }}
            className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-4 py-2 rounded-xl cursor-pointer"
          >
            {lang === "bn" ? "সবগুলো টেমপ্লেট দেখুন" : "View All Templates"}
          </button>
        </div>
      )}

      {/* Bottom AdSense Banner */}
      <AdSenseSlot slotId="catalog-bottom-banner" format="horizontal" />

      {/* ENHANCED QUICK VIEW POPUP MODAL */}
      {quickViewTemplate && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                    {quickViewTemplate.category} • {quickViewTemplate.paperSize === "POS_80MM" ? "80mm POS Thermal" : "A4 Sheet"}
                  </span>
                  {favorites.includes(quickViewTemplate.slug) && (
                    <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-600" />
                      <span>Pinned</span>
                    </span>
                  )}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {lang === "bn" && quickViewTemplate.locales?.bn?.title
                    ? quickViewTemplate.locales.bn.title
                    : quickViewTemplate.title}
                </h3>
              </div>
              <button
                onClick={() => setQuickViewTemplate(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Large Snapshot Preview */}
            <div className="p-2 bg-slate-100 dark:bg-slate-950 rounded-2xl flex items-center justify-center">
              <div className="w-full max-w-sm">
                <TemplateCardPreview
                  template={quickViewTemplate}
                  lang={lang}
                  isFavorite={favorites.includes(quickViewTemplate.slug)}
                  onToggleFavorite={() => handleToggleFavorite(quickViewTemplate.slug)}
                />
              </div>
            </div>

            {/* Format Specifications & Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px] bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-2xl border border-slate-200/60 dark:border-slate-800">
              <div className="p-1">
                <span className="text-slate-400 uppercase font-mono block">Format</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {quickViewTemplate.paperSize === "POS_80MM" ? "80mm Thermal" : "A4 (210×297)"}
                </span>
              </div>
              <div className="p-1">
                <span className="text-slate-400 uppercase font-mono block">Languages</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">English + বাংলা</span>
              </div>
              <div className="p-1">
                <span className="text-slate-400 uppercase font-mono block">Export</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">Vector PDF & Print</span>
              </div>
              <div className="p-1">
                <span className="text-slate-400 uppercase font-mono block">Theme</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
                  {quickViewTemplate.designStyle || "Modern Clean"}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {lang === "bn" && quickViewTemplate.locales?.bn?.description
                ? quickViewTemplate.locales.bn.description
                : quickViewTemplate.description}
            </p>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex-wrap">
              <div className="flex items-center gap-2">
                {/* Copy Direct Link */}
                <button
                  type="button"
                  onClick={(e) => handleCopyDirectLink(quickViewTemplate.slug, e)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  {copiedSlug === quickViewTemplate.slug ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        {lang === "bn" ? "লিংক কপি হয়েছে!" : "Link Copied!"}
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>{lang === "bn" ? "লিংক কপি করুন" : "Copy Link"}</span>
                    </>
                  )}
                </button>

                {/* Star Pin in Modal */}
                <button
                  type="button"
                  onClick={() => handleToggleFavorite(quickViewTemplate.slug)}
                  className={`p-2 rounded-xl border transition cursor-pointer ${
                    favorites.includes(quickViewTemplate.slug)
                      ? "bg-amber-50 dark:bg-amber-950/60 border-amber-300 text-amber-500"
                      : "border-slate-200 dark:border-slate-700 text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                  title="Toggle Pinned Favorite"
                >
                  <Star
                    className={`w-4 h-4 ${
                      favorites.includes(quickViewTemplate.slug) ? "fill-amber-400 text-amber-500" : ""
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuickViewTemplate(null)}
                  className="text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  {lang === "bn" ? "বন্ধ করুন" : "Close"}
                </button>

                <Link
                  href={`/templates/${quickViewTemplate.slug}`}
                  className="flex items-center gap-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition shadow-xs hover:shadow-md cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>{lang === "bn" ? "এডিট ও কাস্টমাইজ করুন" : "Customize & Print"}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TemplatesCatalogPage() {
  const breadcrumbs = useMemo(
    () =>
      getBreadcrumbListSchema([
        { name: "Home", url: "/" },
        { name: "Templates", url: "/templates" },
      ]),
    []
  );

  const itemListSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Free Printable Document & Invoicing Templates Catalog",
      description:
        "Browse 60+ free printable templates for business invoices, class routines, exam schedules, and medical receipts.",
      numberOfItems: INITIAL_TEMPLATES.length,
      itemListElement: INITIAL_TEMPLATES.slice(0, 30).map((tmpl, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `${tmpl.title} (${tmpl.category})`,
        url: `${SITE_URL}/templates/${tmpl.slug}`,
      })),
    }),
    []
  );

  return (
    <UserWorkspaceShell adaptive={true} activeNav="/templates">
      {/* Schema.org Structured Data */}
      <JsonLd data={breadcrumbs} />
      <JsonLd data={itemListSchema} />

      <Suspense fallback={<div className="flex-1 flex items-center justify-center p-20 text-xs text-slate-400">Loading catalog...</div>}>
        <CatalogContent />
      </Suspense>
    </UserWorkspaceShell>
  );
}
