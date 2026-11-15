import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminSession } from "@/lib/auth";
import {
  sanitizeText,
  sanitizeLineItems,
  TemplateBlock,
  TemplateStyleTokens,
  DEFAULT_TEMPLATE_BLOCKS,
} from "../route";

interface AiGeneratePayload {
  prompt?: string;
  imageBase64?: string;
  category?: string;
  paperSize?: "A4" | "POS_80MM";
}

interface SynthesizedTemplate {
  slug: string;
  category: string;
  subCategory: string;
  paperSize: "A4" | "POS_80MM";
  en_title: string;
  bn_title: string;
  en_description: string;
  bn_description: string;
  en_signatory: string;
  bn_signatory: string;
  en_currency: string;
  bn_currency: string;
  styles: TemplateStyleTokens;
  blocks: TemplateBlock[];
  defaultDataEn: Record<string, any>;
  defaultDataBn: Record<string, any>;
}

// Helper to generate clean unique slug
function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 45);
  const suffix = Date.now().toString(36).slice(-5);
  return `${base || "ai-template"}-${suffix}`;
}

// Intelligent Heuristic Layout Synthesizer
function synthesizeHeuristicTemplate(payload: AiGeneratePayload): SynthesizedTemplate {
  const p = (payload.prompt || "").toLowerCase();
  const requestedCat = (payload.category || "").toLowerCase();
  const requestedPaper = payload.paperSize;

  // 1. Detect archetype
  const isPos =
    requestedPaper === "POS_80MM" ||
    p.includes("pos") ||
    p.includes("thermal") ||
    p.includes("restaurant") ||
    p.includes("receipt") ||
    p.includes("৮০মিমি") ||
    p.includes("ক্যাফে") ||
    p.includes("food");

  const isMedical =
    requestedCat === "healthcare" ||
    p.includes("diagnostic") ||
    p.includes("doctor") ||
    p.includes("prescription") ||
    p.includes("patient") ||
    p.includes("pathology") ||
    p.includes("medical") ||
    p.includes("clinic") ||
    p.includes("হাসপাতাল") ||
    p.includes("ডাক্তার") ||
    p.includes("রোগী") ||
    p.includes("টেস্ট");

  const isEducation =
    requestedCat === "education" ||
    p.includes("routine") ||
    p.includes("timetable") ||
    p.includes("exam") ||
    p.includes("marksheet") ||
    p.includes("certificate") ||
    p.includes("admit") ||
    p.includes("school") ||
    p.includes("college") ||
    p.includes("স্কুল") ||
    p.includes("ক্লাস") ||
    p.includes("পরীক্ষা");

  const isAutomobile =
    p.includes("auto") ||
    p.includes("car") ||
    p.includes("garage") ||
    p.includes("repair") ||
    p.includes("workshop") ||
    p.includes("গাড়ি") ||
    p.includes("গ্যারেজ");

  // Determine paper size
  const paperSize: "A4" | "POS_80MM" = isPos ? "POS_80MM" : "A4";

  // Branch archetype definitions
  if (isPos) {
    const enTitle = "80mm Thermal Restaurant & Retail POS Slip";
    const bnTitle = "৮০মিমি রেস্তোরাঁ ও রিটেইল পিওএস ক্যাশ স্লিপ";
    const slug = generateSlug("pos-thermal-bill");

    const styles: TemplateStyleTokens = {
      designStyle: "thermal-pos",
      bgColor: "#ffffff",
      fontColor: "#0f172a",
      accentColor: "#059669",
      secondaryColor: "#64748b",
      fontSize: "small",
      fontFamily: "mono",
    };

    const itemsEn = [
      { name: "Chicken Supreme Pizza (Large)", quantity: 1, price: 850 },
      { name: "Crispy Fried Chicken (4 Pcs)", quantity: 2, price: 340 },
      { name: "Chilled Mint Lemonade", quantity: 3, price: 120 },
    ];
    const itemsBn = [
      { name: "চিকেন সুপ্রিম পিজ্জা (লার্জ)", quantity: 1, price: 850 },
      { name: "ক্রিস্পি ফ্রাইড চিকেন (৪ পিস)", quantity: 2, price: 340 },
      { name: "মিন্ট লেমোনেড", quantity: 3, price: 120 },
    ];

    return {
      slug,
      category: "Restaurant",
      subCategory: "pos",
      paperSize: "POS_80MM",
      en_title: enTitle,
      bn_title: bnTitle,
      en_description: "Continuous 80mm ESC/POS dot-matrix bill with waiter ID, table number, 5% VAT, and Wi-Fi password.",
      bn_description: "৮০মিমি রসিদ প্রিন্টারের জন্য ডট-ম্যাট্রিক্স স্লিপ, টেবিল নম্বর, ভ্যাট এবং ওয়াইফাই কোডসহ।",
      en_signatory: "Manager / Cashier",
      bn_signatory: "ম্যানেজার / ক্যাশিয়ার",
      en_currency: "৳",
      bn_currency: "৳",
      styles,
      blocks: DEFAULT_TEMPLATE_BLOCKS,
      defaultDataEn: {
        businessName: "The Bistro & Culinary Lounge",
        tagline: "Authentic Charcoal Grill & Espresso Bar",
        phone: "+880 1712-345678",
        address: "Plot 18, Block G, Banani, Dhaka-1213",
        invoiceNumber: "POS-2026-904",
        date: new Date().toISOString().split("T")[0],
        customerName: "Guest Table #04 (Captain: Robin)",
        customerPhone: "+880 1819-000000",
        customerAddress: "Dine-In Customer",
        currency: "৳",
        items: itemsEn,
        deliveryCharge: 0,
        discount: 50,
        paidAmount: 1800,
        notes: "Wi-Fi: BistroGuest / Key: coffee2026. Please visit again!",
        signatoryTitle: "Cashier",
        ...styles,
      },
      defaultDataBn: {
        businessName: "দি বিস্ট্রো কালিনারি লাউঞ্জ",
        tagline: "সুস্বাদু খাবার ও প্রিমিয়াম পরিবেশ",
        phone: "০১৭১২-৩৪৫৬৭৮",
        address: "প্লট ১৮, ব্লক জি, বনানী, ঢাকা-১২১৩",
        invoiceNumber: "পিওএস-২০২৬-৯০৪",
        date: new Date().toISOString().split("T")[0],
        customerName: "টেবিল নং ০৪ (পরিবেশক: রবিন)",
        customerPhone: "০১৮১৯-০০০০০০",
        customerAddress: "ডাইন-ইন কাস্টমার",
        currency: "৳",
        items: itemsBn,
        deliveryCharge: 0,
        discount: 50,
        paidAmount: 1800,
        notes: "ওয়াইফাই: BistroGuest / পাসওয়ার্ড: coffee2026। আবার আসার আমন্ত্রণ রইল!",
        signatoryTitle: "ক্যাশিয়ার",
        ...styles,
      },
    };
  }

  if (isMedical) {
    const enTitle = "Clinical Diagnostic Center & Pathology Bill";
    const bnTitle = "ডায়াগনস্টিক সেন্টার ও প্যাথলজি টেস্ট মানি রিসিট";
    const slug = generateSlug("diagnostic-money-receipt");

    const styles: TemplateStyleTokens = {
      designStyle: "clinical-teal",
      bgColor: "#ffffff",
      fontColor: "#0f172a",
      accentColor: "#0d9488",
      secondaryColor: "#475569",
      fontSize: "normal",
      fontFamily: "sans",
    };

    const itemsEn = [
      { name: "Complete Blood Count (CBC) with ESR", quantity: 1, price: 450 },
      { name: "Ultrasonography (USG) of Whole Abdomen", quantity: 1, price: 1500 },
      { name: "Serum Creatinine & Lipid Profile", quantity: 1, price: 950 },
    ];
    const itemsBn = [
      { name: "কমপ্লিট ব্লাড কাউন্ট (সিবিসি) সাথে ইএসআর", quantity: 1, price: 450 },
      { name: "আল্ট্রাসনোগ্রাফি (হোল অ্যাবডোমেন)", quantity: 1, price: 1500 },
      { name: "সিরাম ক্রিয়েটিনিন ও লিপিড প্রোফাইল", quantity: 1, price: 950 },
    ];

    return {
      slug,
      category: "Healthcare",
      subCategory: "bill",
      paperSize: "A4",
      en_title: enTitle,
      bn_title: bnTitle,
      en_description: "Diagnostic billing slip with specimen collection schedule, report delivery time, PID, and technologist seal.",
      bn_description: "নমুনা সংগ্রহের সময়, রিপোর্ট ডেলিভারি তারিখ, রোগীর বয়স এবং চিকিৎসকের তথ্যসহ মানি রিসিট।",
      en_signatory: "Medical Technologist / Cashier",
      bn_signatory: "মেডিকেল টেকনোলজিস্ট / ক্যাশিয়ার",
      en_currency: "৳",
      bn_currency: "৳",
      styles,
      blocks: DEFAULT_TEMPLATE_BLOCKS,
      defaultDataEn: {
        businessName: "CarePoint Specialized Diagnostic & Consultation",
        tagline: "ISO 15189 Certified Automated Pathology & Imaging",
        phone: "+880 1711-234567",
        address: "Green Road, Dhanmondi, Dhaka - 1205",
        invoiceNumber: "LAB-2026-4412",
        date: new Date().toISOString().split("T")[0],
        courierPartner: "Sample Collection: 09:30 AM | Delivery: 06:00 PM",
        customerName: "Mrs. Nasrin Akter (Age: 38, Female)",
        customerPhone: "+880 1712-998877",
        customerAddress: "Referred by: Prof. Dr. M. Rahman (FCPS)",
        currency: "৳",
        items: itemsEn,
        deliveryCharge: 0,
        discount: 200,
        paidAmount: 2000,
        notes: "Please bring this receipt when collecting laboratory investigation reports.",
        signatoryTitle: "Authorized Technologist",
        ...styles,
      },
      defaultDataBn: {
        businessName: "কেয়ারপয়েন্ট স্পেশালাইজড ডায়াগনস্টিক সেন্টার",
        tagline: "আইএসও সার্টিফাইড স্বয়ংক্রিয় প্যাথলজি ও ডিজিটাল ইমেজিং",
        phone: "০১৭১১-২৩৪৫৬৭",
        address: "গ্রিন রোড, ধানমন্ডি, ঢাকা - ১২০৫",
        invoiceNumber: "ল্যাব-২০২৬-৪৪১২",
        date: new Date().toISOString().split("T")[0],
        courierPartner: "নমুনা সংগ্রহ: সকাল ০৯:৩০ | রিপোর্ট ডেলিভারি: সন্ধ্যা ০৬:০০",
        customerName: "মোসাম্মৎ নাসরিন আক্তার (বয়স: ৩৮, মহিলা)",
        customerPhone: "০১৭১২-৯৯৮৮৭৭",
        customerAddress: "রেফার্ড বাই: প্রফেসর ডা. এম. রহমান (এফসিপিএস)",
        currency: "৳",
        items: itemsBn,
        deliveryCharge: 0,
        discount: 200,
        paidAmount: 2000,
        notes: "রিপোর্ট গ্রহণের সময় অনুগ্রহপূর্বক এই মূল মানি রিসিটটি সাথে নিয়ে আসবেন।",
        signatoryTitle: "অনুমোদিত টেকনোলজিস্ট",
        ...styles,
      },
    };
  }

  if (isEducation) {
    const enTitle = "Academic Weekly Class Routine & Timetable";
    const bnTitle = "প্রাতিষ্ঠানিক সাপ্তাহিক ক্লাস রুটিন ও সময়সূচি";
    const slug = generateSlug("school-class-timetable");

    const styles: TemplateStyleTokens = {
      designStyle: "royal-academic",
      bgColor: "#ffffff",
      fontColor: "#0f172a",
      accentColor: "#1e3a8a",
      secondaryColor: "#475569",
      fontSize: "normal",
      fontFamily: "serif",
    };

    const itemsEn = [
      { name: "Period 1: Mathematics & Geometry (Room 301)", quantity: 6, price: 0, unit: "Classes" },
      { name: "Period 2: Physics & Practical Lab (Lab 2)", quantity: 4, price: 0, unit: "Classes" },
      { name: "Period 3: Chemistry & Organic Synthesis", quantity: 4, price: 0, unit: "Classes" },
      { name: "Period 4: English Language & Literature", quantity: 5, price: 0, unit: "Classes" },
    ];
    const itemsBn = [
      { name: "১ম পিরিয়ড: উচ্চতর গণিত ও জ্যামিতি (কক্ষ ৩০১)", quantity: 6, price: 0, unit: "পিরিয়ড" },
      { name: "২য় পিরিয়ড: পদার্থবিজ্ঞান ও ব্যবহারিক (ল্যাব ২)", quantity: 4, price: 0, unit: "পিরিয়ড" },
      { name: "৩য় পিরিয়ড: রসায়ন ও বিক্রিয়া", quantity: 4, price: 0, unit: "পিরিয়ড" },
      { name: "৪র্থ পিরিয়ড: ইংরেজি ভাষা ও সাহিত্য", quantity: 5, price: 0, unit: "পিরিয়ড" },
    ];

    return {
      slug,
      category: "Education",
      subCategory: "routine",
      paperSize: "A4",
      en_title: enTitle,
      bn_title: bnTitle,
      en_description: "Master academic timetable with period schedules, teacher initials, shifts, and principal authorization seal.",
      bn_description: "পিরিয়ড সময়সূচি, শিক্ষক পরিচিতি, ক্লাসরুম এবং অধ্যক্ষের স্বাক্ষর সম্বলিত একাডেমিক রুটিন।",
      en_signatory: "Principal / Headmaster",
      bn_signatory: "অধ্যক্ষ / প্রধান শিক্ষক",
      en_currency: "৳",
      bn_currency: "৳",
      styles,
      blocks: DEFAULT_TEMPLATE_BLOCKS,
      defaultDataEn: {
        businessName: "Oxford Model School & College",
        tagline: "Excellence in Education & Character Building",
        phone: "+880 2-9876543",
        address: "Campus Road, Uttara Sector 4, Dhaka-1230",
        invoiceNumber: "RTN-2026-C9",
        date: new Date().toISOString().split("T")[0],
        courierPartner: "Morning Shift: 08:00 AM - 01:30 PM",
        customerName: "Class: Grade 9 (Science Section A)",
        customerPhone: "Class Teacher: Md. Rafiqul Islam",
        customerAddress: "Academic Session: 2026-2027",
        currency: "৳",
        items: itemsEn,
        deliveryCharge: 0,
        discount: 0,
        paidAmount: 0,
        notes: "Attendance is compulsory for all periods. Lab coats required for practical sessions.",
        signatoryTitle: "Principal Signature & Seal",
        ...styles,
      },
      defaultDataBn: {
        businessName: "অক্সফোর্ড মডেল স্কুল অ্যান্ড কলেজ",
        tagline: "আলোকিত মানুষ গড়ার প্রত্যয়ে নিবেদিত শিক্ষা প্রতিষ্ঠান",
        phone: "০২-৯৮৭৬৫৪৩",
        address: "ক্যাম্পাস রোড, উত্তরা সেক্টর ৪, ঢাকা-১২৩০",
        invoiceNumber: "রুটিন-২০২৬-৯ম",
        date: new Date().toISOString().split("T")[0],
        courierPartner: "প্রভাতি শাখা: সকাল ০৮:০০ - দুপুর ০১:৩০",
        customerName: "শ্রেণি: ৯ম শ্রেণি (বিজ্ঞান বিভাগ - শাখা ক)",
        customerPhone: "শ্রেণি শিক্ষক: মো: রফিকুল ইসলাম",
        customerAddress: "শিক্ষাবর্ষ: ২০২৬-২০২৭",
        currency: "৳",
        items: itemsBn,
        deliveryCharge: 0,
        discount: 0,
        paidAmount: 0,
        notes: "সকল শিক্ষার্থীর জন্য প্রতিদিনের প্রতিটি ক্লাসে নিয়মিত উপস্থিতি বাধ্যতামূলক।",
        signatoryTitle: "অধ্যক্ষের স্বাক্ষর ও সিল",
        ...styles,
      },
    };
  }

  if (isAutomobile) {
    const enTitle = "Automobile Repair Workshop & Job Card";
    const bnTitle = "অটোমোবাইল ওয়ার্কশপ বিল ও সার্ভিস জব কার্ড";
    const slug = generateSlug("auto-workshop-bill");

    const styles: TemplateStyleTokens = {
      designStyle: "cyber-slate",
      bgColor: "#ffffff",
      fontColor: "#0f172a",
      accentColor: "#ea580c",
      secondaryColor: "#475569",
      fontSize: "normal",
      fontFamily: "mono",
    };

    const itemsEn = [
      { name: "Synthetic Engine Oil (5W-30 4L)", quantity: 1, price: 3800 },
      { name: "Genuine Brake Pad Set (Front)", quantity: 1, price: 4200 },
      { name: "AC Blower Filter & Cabin Cleaning", quantity: 1, price: 1200 },
      { name: "Full Computerized Diagnostics & Labor", quantity: 1, price: 1500 },
    ];
    const itemsBn = [
      { name: "সিন্থেটিক ইঞ্জিন অয়েল (5W-30 ৪ লিটার)", quantity: 1, price: 3800 },
      { name: "অরিজিনাল ব্রেক প্যাড সেট (সামনে)", quantity: 1, price: 4200 },
      { name: "এসি ফিল্টার পরিবর্তন ও ক্লিনিং", quantity: 1, price: 1200 },
      { name: "কম্পিউটারাইজড ডায়াগনস্টিক ও লেবার ফি", quantity: 1, price: 1500 },
    ];

    return {
      slug,
      category: "Business",
      subCategory: "invoice",
      paperSize: "A4",
      en_title: enTitle,
      bn_title: bnTitle,
      en_description: "Automotive repair invoice with vehicle registration, chassis number, odometer reading, and mechanic warranty.",
      bn_description: "গাড়ির নম্বর, চেসিস নম্বর, মাইলেজ এবং ওয়ার্কশপ মেকানিক সিলসহ প্রফেশনাল সার্ভিস বিল।",
      en_signatory: "Chief Automotive Engineer",
      bn_signatory: "প্রধান অটোমোটিভ ইঞ্জিনিয়ার",
      en_currency: "৳",
      bn_currency: "৳",
      styles,
      blocks: DEFAULT_TEMPLATE_BLOCKS,
      defaultDataEn: {
        businessName: "SpeedMaster Auto Care & Service Hub",
        tagline: "Certified Japanese & European Vehicle Specialists",
        phone: "+880 1819-334455",
        address: "Tejgaon Industrial Area, Dhaka-1208",
        invoiceNumber: "SRV-2026-789",
        date: new Date().toISOString().split("T")[0],
        courierPartner: "Chassis: NZE141-8923011 | Odo: 64,250 KM",
        customerName: "Engr. Zahidul Hassan",
        customerPhone: "+880 1711-445566",
        customerAddress: "Vehicle: Toyota Corolla Axio (Dhaka Metro-GA 24-8901)",
        currency: "৳",
        items: itemsEn,
        deliveryCharge: 0,
        discount: 500,
        paidAmount: 10200,
        notes: "Warranty: 6 months or 10,000 KM on all installed original spare parts.",
        signatoryTitle: "Chief Engineer & Inspector",
        ...styles,
      },
      defaultDataBn: {
        businessName: "স্পিডমাস্টার অটো কেয়ার অ্যান্ড সার্ভিস হাব",
        tagline: "জাপানি ও ইউরোপীয় গাড়ির নির্ভরযোগ্য সার্ভিস সেন্টার",
        phone: "০১৮১৯-৩৩৪৪৫৫",
        address: "তেজগাঁও শিল্প এলাকা, ঢাকা-১২০৮",
        invoiceNumber: "সার্ভিস-২০২৬-৭৮৯",
        date: new Date().toISOString().split("T")[0],
        courierPartner: "চেসিস: NZE141-8923011 | ওডোমিটার: ৬৪,২৫০ কিমি",
        customerName: "প্রকৌশলী জাহিদুল হাসান",
        customerPhone: "০১৭১১-৪৪৫৫৬৬",
        customerAddress: "গাড়ি: টয়োটা করোলা এক্সিও (ঢাকা মেট্রো-গ ২৪-৮৯০১)",
        currency: "৳",
        items: itemsBn,
        deliveryCharge: 0,
        discount: 500,
        paidAmount: 10200,
        notes: "ওয়ারেন্টি: সংস্থাপিত মূল যন্ত্রাংশের উপর ৬ মাস বা ১০,০০০ কিমি ওয়ারেন্টি প্রযোজ্য।",
        signatoryTitle: "চিফ ইঞ্জিনিয়ার ও ইন্সপেক্টর",
        ...styles,
      },
    };
  }

  // Default: General Modern F-Commerce / Retail Invoice
  const enTitle = payload.prompt
    ? sanitizeText(payload.prompt.slice(0, 50), 50) + " Invoice"
    : "Smart F-Commerce Shop & Boutique Memo";
  const bnTitle = payload.prompt
    ? sanitizeText(payload.prompt.slice(0, 50), 50) + " ক্যাশ মেমো"
    : "স্মার্ট এফ-কমার্স ও অনলাইন শপ ক্যাশ মেমো";
  const slug = generateSlug("f-commerce-invoice");

  const styles: TemplateStyleTokens = {
    designStyle: "modern-blue",
    bgColor: "#ffffff",
    fontColor: "#0f172a",
    accentColor: "#2563eb",
    secondaryColor: "#64748b",
    fontSize: "normal",
    fontFamily: "sans",
  };

  const itemsEn = [
    { name: "Premium Casual Cotton Panjabi (Navy)", quantity: 1, price: 1650 },
    { name: "Designer Silk Dupatta / Scarf", quantity: 1, price: 750 },
    { name: "Handcrafted Leather Wallet", quantity: 1, price: 950 },
  ];
  const itemsBn = [
    { name: "প্রিমিয়াম ক্যাজুয়াল কটন পাঞ্জাবি (নেভি ব্লু)", quantity: 1, price: 1650 },
    { name: "ডিজাইনার সিল্ক ওড়না", quantity: 1, price: 750 },
    { name: "হস্তনির্মিত চামড়ার মানিব্যাগ", quantity: 1, price: 950 },
  ];

  return {
    slug,
    category: "Business",
    subCategory: "invoice",
    paperSize: "A4",
    en_title: enTitle,
    bn_title: bnTitle,
    en_description: "Professional multi-channel retail invoice with courier tracking, bKash payment notes, and delivery fee calculation.",
    bn_description: "কুরিয়ার ট্র্যাকিং, বিকাশ পেমেন্ট ও ডেলিভারি চার্জ হিসাবসহ পেশাদার অনলাইন শপ ক্যাশ মেমো।",
    en_signatory: "Authorized Signature",
    bn_signatory: "অনুমোদিত স্বাক্ষর",
    en_currency: "৳",
    bn_currency: "৳",
    styles,
    blocks: DEFAULT_TEMPLATE_BLOCKS,
    defaultDataEn: {
      businessName: "FashionNova Lifestyle & Wardrobe",
      tagline: "Trending Styles & Next-Day Nationwide Delivery",
      phone: "+880 1912-345678",
      address: "House 14, Road 8, Dhanmondi, Dhaka-1205",
      invoiceNumber: "INV-2026-882",
      date: new Date().toISOString().split("T")[0],
      courierPartner: "Steadfast Courier (Tracking #ST-89021)",
      customerName: "Mrs. Shahnaz Parvin",
      customerPhone: "+880 1819-112233",
      customerAddress: "Flat 4B, Green View Tower, Mirpur DOHS, Dhaka",
      currency: "৳",
      items: itemsEn,
      deliveryCharge: 80,
      discount: 150,
      paidAmount: 500,
      notes: "Please inspect parcel upon delivery. Exchanges allowed within 48 hours with receipt.",
      signatoryTitle: "Authorized Signature",
      ...styles,
    },
    defaultDataBn: {
      businessName: "ফ্যাশন নোভা লাইফস্টাইল",
      tagline: "গুণগত পোশাক ও দ্রুততম হোম ডেলিভারি",
      phone: "০১৯১২-৩৪৫৬৭৮",
      address: "বাড়ি ১৪, রোড ৮, ধানমন্ডি, ঢাকা-১২০৫",
      invoiceNumber: "মেমো-২০২৬-৮৮২",
      date: new Date().toISOString().split("T")[0],
      courierPartner: "স্টেডফাস্ট কুরিয়ার (ট্র্যাকিং #ST-89021)",
      customerName: "মোসাঃ শাহনাজ পারভীন",
      customerPhone: "০১৮১৯-১১২২৩৩",
      customerAddress: "ফ্ল্যাট ৪বি, গ্রিন ভিউ টাওয়ার, মিরপুর ডিওএইচএস, ঢাকা",
      currency: "৳",
      items: itemsBn,
      deliveryCharge: 80,
      discount: 150,
      paidAmount: 500,
      notes: "ডেলিভারিম্যানের উপস্থিতিতে পণ্য যাচাই করুন। পণ্য পরিবর্তনের সুযোগ রয়েছে ৪৮ ঘণ্টার মধ্যে।",
      signatoryTitle: "অনুমোদিত স্বাক্ষর",
      ...styles,
    },
  };
}

// Multimodal Call to Gemini (if API Key is configured)
async function tryGeminiGeneration(
  payload: AiGeneratePayload,
  apiKey: string
): Promise<SynthesizedTemplate | null> {
  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const promptText = `
You are an expert document template designer for FreeDocForge.com.
Design a complete, high-quality, bilingual (English & Bengali) document template based on:
User Prompt: "${payload.prompt || "Professional Business Document"}"
Preferred Category: "${payload.category || "Business"}"
Preferred Paper Size: "${payload.paperSize || "A4"}"

Return ONLY a pure JSON object (no markdown, no code fencing) with this schema:
{
  "slug": "unique-slug-string",
  "category": "Business" | "Healthcare" | "Education" | "Restaurant" | "Printables",
  "subCategory": "invoice" | "receipt" | "pos" | "routine" | "exam" | "bill" | "prescription" | "marksheet",
  "paperSize": "A4" | "POS_80MM",
  "en_title": "English Title",
  "bn_title": "বাংলা শিরোনাম",
  "en_description": "English description",
  "bn_description": "বাংলা বিবরণ",
  "en_signatory": "Authorized Signature",
  "bn_signatory": "অনুমোদিত স্বাক্ষর",
  "en_currency": "৳",
  "bn_currency": "৳",
  "styles": {
    "designStyle": "modern-blue" | "luxury-gold" | "thermal-pos" | "royal-academic" | "clinical-teal" | "cyber-slate",
    "bgColor": "#ffffff",
    "fontColor": "#0f172a",
    "accentColor": "#2563eb",
    "secondaryColor": "#64748b",
    "fontSize": "normal",
    "fontFamily": "sans"
  },
  "defaultDataEn": {
    "businessName": "...",
    "tagline": "...",
    "phone": "...",
    "address": "...",
    "invoiceNumber": "...",
    "date": "2026-11-14",
    "customerName": "...",
    "customerPhone": "...",
    "customerAddress": "...",
    "currency": "৳",
    "items": [{"name": "...", "quantity": 1, "price": 100}],
    "deliveryCharge": 60,
    "discount": 0,
    "paidAmount": 0,
    "notes": "..."
  },
  "defaultDataBn": {
    "businessName": "...",
    "tagline": "...",
    "phone": "...",
    "address": "...",
    "invoiceNumber": "...",
    "date": "2026-11-14",
    "customerName": "...",
    "customerPhone": "...",
    "customerAddress": "...",
    "currency": "৳",
    "items": [{"name": "...", "quantity": 1, "price": 100}],
    "deliveryCharge": 60,
    "discount": 0,
    "paidAmount": 0,
    "notes": "..."
  }
}
`;

    const parts: any[] = [{ text: promptText }];

    // If imageBase64 is passed, append inlineData
    if (payload.imageBase64) {
      const match = payload.imageBase64.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      if (match) {
        parts.push({
          inlineData: {
            mimeType: match[1],
            data: match[2],
          },
        });
      }
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      }),
      signal: AbortSignal.timeout(10000), // 10s timeout
    });

    if (!response.ok) return null;
    const json = await response.json();
    const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return null;

    const parsed = JSON.parse(rawText.replace(/```json/g, "").replace(/```/g, "").trim());
    if (!parsed || !parsed.en_title || !parsed.bn_title) return null;

    return {
      slug: generateSlug(parsed.slug || parsed.en_title),
      category: sanitizeText(parsed.category || "Business", 40),
      subCategory: sanitizeText(parsed.subCategory || "invoice", 40),
      paperSize: parsed.paperSize === "POS_80MM" ? "POS_80MM" : "A4",
      en_title: sanitizeText(parsed.en_title, 120),
      bn_title: sanitizeText(parsed.bn_title, 120),
      en_description: sanitizeText(parsed.en_description, 500),
      bn_description: sanitizeText(parsed.bn_description, 500),
      en_signatory: sanitizeText(parsed.en_signatory || "Authorized Signature", 60),
      bn_signatory: sanitizeText(parsed.bn_signatory || "অনুমোদিত স্বাক্ষর", 60),
      en_currency: sanitizeText(parsed.en_currency || "৳", 10),
      bn_currency: sanitizeText(parsed.bn_currency || "৳", 10),
      styles: {
        designStyle: sanitizeText(parsed.styles?.designStyle || "modern-blue", 40),
        bgColor: sanitizeText(parsed.styles?.bgColor || "#ffffff", 30),
        fontColor: sanitizeText(parsed.styles?.fontColor || "#0f172a", 30),
        accentColor: sanitizeText(parsed.styles?.accentColor || "#2563eb", 30),
        secondaryColor: sanitizeText(parsed.styles?.secondaryColor || "#64748b", 30),
        fontSize: sanitizeText(parsed.styles?.fontSize || "normal", 30),
        fontFamily: sanitizeText(parsed.styles?.fontFamily || "sans", 50),
      },
      blocks: DEFAULT_TEMPLATE_BLOCKS,
      defaultDataEn: {
        ...parsed.defaultDataEn,
        items: sanitizeLineItems(parsed.defaultDataEn?.items),
      },
      defaultDataBn: {
        ...parsed.defaultDataBn,
        items: sanitizeLineItems(parsed.defaultDataBn?.items),
      },
    };
  } catch (e) {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    // 1. RBAC Check: Ensure caller is authenticated Administrator (SEC-RBAC-02)
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    const admin = await getAdminSession(token);

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized. Admin privileges required for AI Template Generation." },
        { status: 401 }
      );
    }

    // 2. Parse and validate input payload
    const body: AiGeneratePayload = await req.json();
    const prompt = body.prompt ? sanitizeText(body.prompt, 1000) : "";
    const imageBase64 = body.imageBase64 && typeof body.imageBase64 === "string" ? body.imageBase64 : "";

    if (!prompt && !imageBase64) {
      return NextResponse.json(
        { error: "Please provide either a prompt idea or an uploaded document screenshot." },
        { status: 400 }
      );
    }

    // 3. Check for Gemini / OpenAI API Key in environment
    const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
    let synthesized: SynthesizedTemplate | null = null;
    let usedProvider = "heuristic_engine";

    if (apiKey) {
      synthesized = await tryGeminiGeneration({ ...body, prompt }, apiKey);
      if (synthesized) {
        usedProvider = "gemini";
      }
    }

    // 4. Fallback to resilient heuristic synthesis engine
    if (!synthesized) {
      synthesized = synthesizeHeuristicTemplate({ ...body, prompt });
    }

    // 5. Sanitize all synthesized fields against XSS
    const cleanTemplate: SynthesizedTemplate = {
      slug: sanitizeText(synthesized.slug, 60),
      category: sanitizeText(synthesized.category, 40),
      subCategory: sanitizeText(synthesized.subCategory, 40),
      paperSize: synthesized.paperSize === "POS_80MM" ? "POS_80MM" : "A4",
      en_title: sanitizeText(synthesized.en_title, 120),
      bn_title: sanitizeText(synthesized.bn_title, 120),
      en_description: sanitizeText(synthesized.en_description, 500),
      bn_description: sanitizeText(synthesized.bn_description, 500),
      en_signatory: sanitizeText(synthesized.en_signatory, 60),
      bn_signatory: sanitizeText(synthesized.bn_signatory, 60),
      en_currency: sanitizeText(synthesized.en_currency, 10),
      bn_currency: sanitizeText(synthesized.bn_currency, 10),
      styles: synthesized.styles,
      blocks: synthesized.blocks,
      defaultDataEn: {
        ...synthesized.defaultDataEn,
        ...synthesized.styles,
      },
      defaultDataBn: {
        ...synthesized.defaultDataBn,
        ...synthesized.styles,
      },
    };

    return NextResponse.json({
      success: true,
      provider: usedProvider,
      template: cleanTemplate,
    });
  } catch (error: any) {
    console.error("AI Template Generation Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate AI template layout." },
      { status: 500 }
    );
  }
}
