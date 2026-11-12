export type DesignThemeId =
  | "modern-blue"
  | "luxury-gold"
  | "thermal-pos"
  | "royal-academic"
  | "clinical-teal"
  | "cyber-slate";

export interface DesignThemeConfig {
  id: DesignThemeId;
  nameEn: string;
  nameBn: string;
  icon: string;
  descriptionEn: string;
  descriptionBn: string;
  fontFamily: "font-sans" | "font-serif" | "font-mono";
  // Printable Sheet Canvas Styles
  containerClass: string;
  headerBorderClass: string;
  titleClass: string;
  accentTextClass: string;
  accentBgClass: string;
  accentBorderClass: string;
  badgeClass: string;
  tableHeaderClass: string;
  tableRowClass: string;
  totalBoxClass: string;
  stampBorderClass: string;
  // Bento Metadata Architecture
  bentoCardClass: string;
  bentoLabelClass: string;
  bentoValueClass: string;
  // Tabular Lining Numerals
  numeralClass: string;
  // Hero Callouts & Accolades
  duePillClass: string;
  // Security & Seal Effects
  sealClass: string;
  // Outer UI Preview Card
  cardOuterBg: string;
  cardBorder: string;
  cardGlow: string;
}

export const DESIGN_THEMES: Record<DesignThemeId, DesignThemeConfig> = {
  "modern-blue": {
    id: "modern-blue",
    nameEn: "Modern Clean Blue",
    nameBn: "মডার্ন ব্লু (F-Commerce)",
    icon: "🛍️",
    descriptionEn: "Agile, high-contrast blue for Facebook shops, apparel, and courier parcels.",
    descriptionBn: "অনলাইন ফেসবুক শপ ও কুরিয়ার পার্সেলের জন্য সবচেয়ে জনপ্রিয় আধুনিক ফরম্যাট।",
    fontFamily: "font-sans",
    containerClass: "bg-white text-slate-900 border border-slate-200/80 rounded-2xl shadow-xl",
    headerBorderClass: "border-b-2 border-blue-600 pb-5",
    titleClass: "text-slate-900 font-black tracking-tight",
    accentTextClass: "text-blue-600 dark:text-blue-400",
    accentBgClass: "bg-blue-50/80 text-blue-900 border border-blue-200/70",
    accentBorderClass: "border-blue-600",
    badgeClass: "bg-blue-600 text-white font-extrabold text-[10px] px-3 py-1 rounded-full shadow-xs tracking-wider uppercase",
    tableHeaderClass: "bg-slate-900 text-white uppercase font-black text-[9.5px] tracking-wider",
    tableRowClass: "hover:bg-slate-50/60 border-b border-slate-100/80 transition-colors",
    totalBoxClass: "bg-gradient-to-br from-blue-50/90 to-indigo-50/60 border border-blue-200/90 rounded-2xl p-4 text-slate-900 shadow-2xs",
    stampBorderClass: "border-b-2 border-slate-900",
    bentoCardClass: "bg-slate-50/90 border border-slate-200/80 rounded-2xl p-4 shadow-2xs",
    bentoLabelClass: "text-[9px] uppercase font-bold tracking-widest text-slate-400 block mb-1",
    bentoValueClass: "text-xs font-bold text-slate-900",
    numeralClass: "tabular-nums font-mono font-bold tracking-tight",
    duePillClass: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black px-3.5 py-1.5 rounded-xl shadow-xs",
    sealClass: "border-2 border-blue-600/70 rounded-full text-blue-700 font-bold text-[9px] px-3 py-1 uppercase tracking-wider inline-flex items-center gap-1",
    cardOuterBg: "from-blue-50 via-indigo-50/30 to-slate-100 dark:from-slate-900 dark:via-blue-950/20 dark:to-slate-900",
    cardBorder: "border-blue-300/80 dark:border-blue-800/60",
    cardGlow: "shadow-blue-500/10 hover:shadow-blue-500/20",
  },

  "luxury-gold": {
    id: "luxury-gold",
    nameEn: "Rose Gold & Luxury Boutique",
    nameBn: "লাক্সারি বুটিক ও গোল্ডেন (Haute Couture)",
    icon: "⚜️",
    descriptionEn: "Opulent champagne gold filigree, serif typography, and elegant letterhead for high-end boutiques & jewelry.",
    descriptionBn: "প্রিমিয়াম ফ্যাশন বুটিক, জামদানি শাড়ি ও জুয়েলারির জন্য অভিজাত গোল্ডেন ফরম্যাট।",
    fontFamily: "font-serif",
    containerClass: "bg-[#FDFAF5] text-stone-900 border-2 border-amber-300/80 rounded-2xl shadow-2xl",
    headerBorderClass: "border-y-2 border-amber-300/80 py-5 text-center",
    titleClass: "text-stone-900 font-normal tracking-widest uppercase italic",
    accentTextClass: "text-amber-800 dark:text-amber-400",
    accentBgClass: "bg-amber-50/90 text-amber-900 border border-amber-200/80",
    accentBorderClass: "border-amber-700",
    badgeClass: "bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-white font-serif tracking-widest text-[9px] px-3.5 py-1 rounded-full shadow-xs uppercase",
    tableHeaderClass: "border-y-2 border-amber-300/80 text-stone-800 uppercase tracking-widest font-serif text-[9px] bg-amber-50/40",
    tableRowClass: "hover:bg-amber-50/30 border-b border-stone-200/60 font-sans transition-colors",
    totalBoxClass: "bg-[#FBF6EE] border border-amber-300/80 rounded-2xl p-4 text-stone-900 shadow-2xs font-serif",
    stampBorderClass: "border-b border-amber-600",
    bentoCardClass: "bg-[#FAF6EE]/90 border border-amber-200/90 rounded-2xl p-4 shadow-2xs font-serif",
    bentoLabelClass: "text-[8.5px] uppercase font-serif tracking-widest text-amber-800/70 block mb-1",
    bentoValueClass: "text-xs font-medium text-stone-900 font-sans",
    numeralClass: "tabular-nums font-serif font-bold tracking-normal",
    duePillClass: "bg-gradient-to-r from-amber-700 via-amber-800 to-stone-900 text-white font-serif tracking-widest px-3.5 py-1.5 rounded-full shadow-xs",
    sealClass: "border-2 border-amber-600/80 rounded-full text-amber-900 font-serif text-[9px] px-3.5 py-1 uppercase tracking-widest inline-flex items-center gap-1",
    cardOuterBg: "from-amber-50/70 via-stone-50 to-amber-100/40 dark:from-stone-900 dark:via-amber-950/20 dark:to-stone-900",
    cardBorder: "border-amber-300 dark:border-amber-800/80",
    cardGlow: "shadow-amber-500/10 hover:shadow-amber-500/25",
  },

  "thermal-pos": {
    id: "thermal-pos",
    nameEn: "Thermal Dot-Matrix POS (80mm)",
    nameBn: "থার্মাল পিওএস রসিদ (80mm Roll)",
    icon: "🧾",
    descriptionEn: "Monochrome dot-matrix monospace with serrated cut edges and large order token numbers.",
    descriptionBn: "রেস্তোরাঁ, কফি শপ, বেকারি ও সুপার শপের জন্য রিয়েল থার্মাল রোল ফরম্যাট।",
    fontFamily: "font-mono",
    containerClass: "bg-[#FAFAFA] text-zinc-900 border border-dashed border-zinc-400 rounded-lg shadow-md max-w-[80mm]",
    headerBorderClass: "border-b-2 border-dashed border-zinc-500 pb-3 text-center",
    titleClass: "text-zinc-900 font-black uppercase tracking-wider text-base",
    accentTextClass: "text-zinc-900",
    accentBgClass: "bg-zinc-200 text-zinc-900",
    accentBorderClass: "border-zinc-900",
    badgeClass: "bg-black text-white font-mono font-black text-[9px] px-2.5 py-0.5 rounded-none tracking-widest",
    tableHeaderClass: "border-y border-dashed border-zinc-500 text-zinc-900 uppercase font-black text-[9px]",
    tableRowClass: "border-b border-zinc-200/60",
    totalBoxClass: "border-t-2 border-b-2 border-dashed border-zinc-900 py-2.5 my-2 font-mono",
    stampBorderClass: "border-b border-dashed border-zinc-500",
    bentoCardClass: "bg-zinc-100/90 border border-dashed border-zinc-400 rounded-none p-2.5 font-mono",
    bentoLabelClass: "text-[8px] uppercase font-mono font-bold tracking-wider text-zinc-500 block mb-0.5",
    bentoValueClass: "text-[11px] font-mono font-black text-zinc-900",
    numeralClass: "tabular-nums font-mono font-bold tracking-tight",
    duePillClass: "bg-black text-white font-mono font-black px-2.5 py-1 rounded-none tracking-wider",
    sealClass: "border border-dashed border-zinc-700 font-mono text-[8px] px-2 py-0.5 uppercase tracking-widest inline-flex items-center gap-1",
    cardOuterBg: "from-zinc-100 via-stone-100 to-zinc-200 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-950",
    cardBorder: "border-dashed border-zinc-400 dark:border-zinc-700",
    cardGlow: "shadow-zinc-500/10 hover:shadow-zinc-500/20",
  },

  "royal-academic": {
    id: "royal-academic",
    nameEn: "Royal Academic & Crest",
    nameBn: "রয়্যাল একাডেমিক ও স্কুল ক্রেস্ট (Exam/Marksheet)",
    icon: "🎓",
    descriptionEn: "Formal double-line Oxford navy frame, institutional seal, and official GPA honors accolades.",
    descriptionBn: "বিদ্যালয়, কলেজ, মাদ্রাসা ও কোচিং সেন্টারের আনুষ্ঠানিক রেজাল্ট শিট ও রসিদ।",
    fontFamily: "font-serif",
    containerClass: "bg-[#FCFBF7] text-blue-950 border-4 border-double border-blue-950 rounded-2xl shadow-xl",
    headerBorderClass: "border-b-2 border-blue-950 pb-4 text-center",
    titleClass: "text-blue-950 font-black tracking-wide uppercase",
    accentTextClass: "text-blue-950",
    accentBgClass: "bg-blue-50/80 text-blue-950 border border-blue-200/80",
    accentBorderClass: "border-blue-950",
    badgeClass: "bg-blue-950 text-white font-bold text-[9px] px-3.5 py-1 rounded-full border border-amber-400 tracking-wider uppercase",
    tableHeaderClass: "bg-blue-950 text-white font-bold uppercase text-[9px] border border-blue-950 tracking-wider",
    tableRowClass: "hover:bg-blue-50/40 border-b border-blue-100 font-sans transition-colors",
    totalBoxClass: "bg-blue-50/80 border-2 border-blue-950 rounded-2xl p-4 text-blue-950 font-bold shadow-2xs font-sans",
    stampBorderClass: "border-b-2 border-blue-950",
    bentoCardClass: "bg-blue-50/70 border border-blue-200/90 rounded-2xl p-4 shadow-2xs font-sans",
    bentoLabelClass: "text-[9px] uppercase font-bold tracking-widest text-blue-900/60 block mb-1",
    bentoValueClass: "text-xs font-bold text-blue-950",
    numeralClass: "tabular-nums font-mono font-bold tracking-tight",
    duePillClass: "bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black px-3.5 py-1.5 rounded-xl shadow-xs border border-emerald-400",
    sealClass: "border-4 border-double border-blue-950 rounded-full text-blue-950 font-serif font-black text-[9px] px-3.5 py-1 uppercase tracking-wider inline-flex items-center gap-1",
    cardOuterBg: "from-blue-50/80 via-indigo-50/40 to-blue-100/50 dark:from-blue-950/40 dark:via-slate-900 dark:to-indigo-950/40",
    cardBorder: "border-blue-900/40 dark:border-blue-700/60",
    cardGlow: "shadow-blue-900/15 hover:shadow-blue-900/30",
  },

  "clinical-teal": {
    id: "clinical-teal",
    nameEn: "Clinical Caduceus & Emerald",
    nameBn: "ক্লিনিক্যাল প্রেসক্রিপশন ও ড্রাগ চার্ট (Doctor Rx)",
    icon: "🩺",
    descriptionEn: "Sterile medical teal lines, authentic BMDC certification layout, and prominent ℞ prescription pad.",
    descriptionBn: "ডাক্তার, ডেন্টাল সার্জন, শিশু বিশেষজ্ঞ ও ক্লিনিক্যাল প্রেসক্রিপশন প্যাড।",
    fontFamily: "font-sans",
    containerClass: "bg-white text-slate-800 border-2 border-teal-600/50 rounded-2xl shadow-xl",
    headerBorderClass: "border-b-2 border-teal-600 pb-4",
    titleClass: "text-teal-950 font-black tracking-tight",
    accentTextClass: "text-teal-700 dark:text-teal-400",
    accentBgClass: "bg-teal-50/80 text-teal-900 border border-teal-200/80",
    accentBorderClass: "border-teal-600",
    badgeClass: "bg-teal-700 text-white font-black text-[9px] px-3 py-1 rounded-full shadow-xs uppercase tracking-wider",
    tableHeaderClass: "bg-teal-800 text-white font-black uppercase text-[9px] tracking-wider",
    tableRowClass: "hover:bg-teal-50/40 border-b border-slate-100/80 transition-colors",
    totalBoxClass: "bg-gradient-to-br from-teal-50/90 to-emerald-50/60 border border-teal-200/90 rounded-2xl p-4 text-slate-900 shadow-2xs",
    stampBorderClass: "border-b-2 border-teal-700",
    bentoCardClass: "bg-teal-50/70 border border-teal-200/80 rounded-2xl p-4 shadow-2xs font-sans",
    bentoLabelClass: "text-[9px] uppercase font-bold tracking-widest text-teal-800/70 block mb-1",
    bentoValueClass: "text-xs font-bold text-teal-950",
    numeralClass: "tabular-nums font-mono font-bold tracking-tight",
    duePillClass: "bg-gradient-to-r from-teal-700 to-emerald-700 text-white font-black px-3.5 py-1.5 rounded-xl shadow-xs",
    sealClass: "border-2 border-teal-700 rounded-full text-teal-800 font-bold text-[9px] px-3.5 py-1 uppercase tracking-wider inline-flex items-center gap-1",
    cardOuterBg: "from-teal-50/70 via-emerald-50/30 to-slate-100 dark:from-teal-950/30 dark:via-slate-900 dark:to-emerald-950/30",
    cardBorder: "border-teal-300 dark:border-teal-800",
    cardGlow: "shadow-teal-500/10 hover:shadow-teal-500/25",
  },

  "cyber-slate": {
    id: "cyber-slate",
    nameEn: "Cyber Tech & Warranty Slate",
    nameBn: "সাইবার টেক ও ইলেকট্রনিক্স ওয়ারেন্টি (Gadgets/IMEI)",
    icon: "⚡",
    descriptionEn: "High-tech cyan and dark slate with barcode simulation, IMEI/serial validation, and security seals.",
    descriptionBn: "স্মার্টফোন, ল্যাপটপ ও গ্যাজেটের সিরিয়াল নাম্বার এবং সিকিউরিটি ওয়ারেন্টি স্লিপ।",
    fontFamily: "font-sans",
    containerClass: "bg-white text-slate-900 border-2 border-cyan-500/50 rounded-2xl shadow-xl",
    headerBorderClass: "border-b-2 border-cyan-600 pb-4",
    titleClass: "text-slate-900 font-black tracking-tight uppercase",
    accentTextClass: "text-cyan-700 dark:text-cyan-400",
    accentBgClass: "bg-cyan-50/80 text-cyan-900 border border-cyan-200/80",
    accentBorderClass: "border-cyan-600",
    badgeClass: "bg-slate-900 text-cyan-400 font-mono font-bold text-[9px] px-3 py-1 rounded-sm border border-cyan-500 tracking-wider uppercase",
    tableHeaderClass: "bg-slate-900 text-cyan-300 uppercase font-mono font-bold text-[9px] border-b-2 border-cyan-500 tracking-wider",
    tableRowClass: "hover:bg-cyan-50/30 border-b border-slate-100/80 font-mono transition-colors",
    totalBoxClass: "bg-slate-900 text-white border-2 border-cyan-500/80 rounded-2xl p-4 shadow-xs font-mono",
    stampBorderClass: "border-b-2 border-cyan-600",
    bentoCardClass: "bg-slate-900/95 border border-cyan-500/60 rounded-2xl p-4 text-white shadow-xs font-mono",
    bentoLabelClass: "text-[8.5px] uppercase font-mono tracking-widest text-cyan-400/80 block mb-1",
    bentoValueClass: "text-xs font-mono font-bold text-cyan-200",
    numeralClass: "tabular-nums font-mono font-bold tracking-tight",
    duePillClass: "bg-cyan-500 text-slate-950 font-mono font-black px-3.5 py-1.5 rounded-md shadow-xs tracking-wider",
    sealClass: "border border-cyan-500 rounded text-cyan-300 font-mono text-[8.5px] px-3 py-1 uppercase tracking-widest inline-flex items-center gap-1",
    cardOuterBg: "from-cyan-50/60 via-slate-100 to-sky-100/40 dark:from-slate-900 dark:via-cyan-950/20 dark:to-slate-900",
    cardBorder: "border-cyan-400 dark:border-cyan-700",
    cardGlow: "shadow-cyan-500/10 hover:shadow-cyan-500/25",
  },
};

export const THEME_LIST = Object.values(DESIGN_THEMES);

export function getThemeById(themeId?: string): DesignThemeConfig {
  if (themeId && themeId in DESIGN_THEMES) {
    return DESIGN_THEMES[themeId as DesignThemeId];
  }
  return DESIGN_THEMES["modern-blue"];
}

export function detectDefaultThemeForTemplate(category: string, slug: string, paperSize?: string): DesignThemeId {
  if (paperSize === "POS_80MM" || slug.includes("pos") || slug.includes("thermal")) {
    return "thermal-pos";
  }
  if (category === "Healthcare" || slug.startsWith("doctor-") || slug.startsWith("dental-") || slug.startsWith("medical-")) {
    return "clinical-teal";
  }
  if (category === "Education" || slug.startsWith("school-") || slug.startsWith("coaching-") || slug.startsWith("madrasah-")) {
    return "royal-academic";
  }
  if (slug.includes("boutique") || slug.includes("jewelry") || slug.includes("fashion")) {
    return "luxury-gold";
  }
  if (slug.includes("warranty") || slug.includes("electronics") || slug.includes("tech") || slug.includes("repair")) {
    return "cyber-slate";
  }
  return "modern-blue";
}
