"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  ShieldCheck,
  Printer,
  Sparkles,
  FileCheck,
  Scale,
  Zap,
} from "lucide-react";
import { useGlobalSettings } from "@/context/GlobalSettingsContext";

interface FAQItem {
  questionEn: string;
  questionBn: string;
  answerEn: string;
  answerBn: string;
}

interface TemplateEditorialGuideProps {
  slug: string;
  category: string;
  title: string;
  description: string;
  paperSize?: string;
}

const PILLAR_FAQS: Record<string, FAQItem[]> = {
  ClassRoutine: [
    {
      questionEn: "How do I customize class periods (P1 to P7) and timetable hours?",
      questionBn: "ক্লাসের পিরিয়ড (১ম থেকে ৭ম) এবং সময়সূচি কীভাবে পরিবর্তন করব?",
      answerEn: "You can click directly on any period time slot or subject badge in the interactive routine grid to edit class timings, room numbers, and assigned faculty members.",
      answerBn: "ইন্টারেক্টিভ রুটিন গ্রিডের যেকোনো সময় বা বিষয়ের উপর ক্লিক করে আপনি খুব সহজেই ক্লাসের সময়, কক্ষ নম্বর ও শিক্ষকের নাম এডিট করতে পারবেন।",
    },
    {
      questionEn: "Can I print this class routine on standard ISO A4 paper?",
      questionBn: "এই ক্লাস রুটিনটি কি সাধারণ A4 কাগজে পরিষ্কার প্রিন্ট হবে?",
      answerEn: "Yes, our routine layouts are precision-crafted for standard ISO A4 sheets with crystal-clear borders and zero margin cut-offs on both desktop and laser printers.",
      answerBn: "হ্যাঁ, আমাদের সব ক্লাস রুটিন স্ট্যান্ডার্ড A4 পেপারের মাপে নিখুঁতভাবে মার্জিন সেট করা, যাতে যেকোনো লেজার বা কালার প্রিন্টারে সম্পূর্ণ স্পষ্ট প্রিন্ট হয়।",
    },
    {
      questionEn: "Does this routine support dual shifts (Morning & Day) and lab practicals?",
      questionBn: "এটি কি মর্নিং/ডে শিফট এবং সাইন্স ল্যাব প্র্যাকটিক্যাল ক্লাসের জন্য উপযোগী?",
      answerEn: "Yes. You can organize morning and day sections, specify double laboratory blocks, and add a teacher workload directory at the bottom of the sheet.",
      answerBn: "হ্যাঁ। মর্নিং ও ডে শিফটের আলাদা সেকশন তৈরি, ডাবল ল্যাব পিরিয়ড নির্ধারণ এবং নিচে শিক্ষকগণের নাম ও বিষয়ের ডিরেক্টরি যুক্ত করার সম্পূর্ণ সুবিধা রয়েছে।",
    },
    {
      questionEn: "Is this routine generator completely free without watermarks?",
      questionBn: "এই রুটিন মেকার কি কোনো ওয়াটারমার্ক ছাড়া সম্পূর্ণ ফ্রি?",
      answerEn: "100% free forever. FreeDocForge does not place any watermarks, require account signups, or restrict how many routines you can export and print.",
      answerBn: "হ্যাঁ, আজীবনের জন্য ১০০% ফ্রি। এতে কোনো ওয়াটারমার্ক থাকবে না এবং কোনো রেজিস্ট্রেশন ছাড়াই যত খুশি রুটিন প্রিন্ট ও ডাউনলোড করতে পারবেন।",
    },
  ],
  ExamRoutine: [
    {
      questionEn: "How do I set up exam shifts, dates, and subject codes?",
      questionBn: "পরীক্ষার তারিখ, সময়, শিফট ও বিষয় কোড কীভাবে সাজাব?",
      answerEn: "Enter exam dates, day names, start/end times, shifts (Morning / Afternoon), subject titles, and official board or institutional subject codes in the structured schedule table.",
      answerBn: "পরীক্ষার রুটিন টেবিলে তারিখ, দিন, সময়, শিফট (মর্নিং/ডে), বিষয়ের নাম ও অফিসিয়াল বিষয় কোড লিখে খুব সহজেই একটি পেশাদার পরীক্ষার সময়সূচি তৈরি করুন।",
    },
    {
      questionEn: "Can I customize the candidate examination rules and instructions?",
      questionBn: "পরীক্ষার্থীদের জন্য নিয়মাবলী ও জরুরি নির্দেশনাবলী কি এডিট করা যাবে?",
      answerEn: "Yes, you can edit or add official examination guidelines, including admit card presentation, OMR circle filling rules, prohibited items, and hall entry deadlines.",
      answerBn: "হ্যাঁ, এডমিট কার্ড প্রদর্শন, OMR বৃত্ত ভরাট, মোবাইল বা ক্যালকুলেটর নিষেধাজ্ঞা এবং হলে প্রবেশের সময় সংক্রান্ত সকল নিয়মাবলী আপনার মতো করে কাস্টমাইজ করতে পারেন।",
    },
    {
      questionEn: "Can I add the Controller of Examinations and Principal signatures?",
      questionBn: "পরীক্ষা নিয়ন্ত্রক ও অধ্যক্ষের সিল-স্বাক্ষর কি যুক্ত করা যাবে?",
      answerEn: "Yes. You can upload high-resolution digital signatures and institutional seals, or leave signature lines for manual endorsement after printing.",
      answerBn: "হ্যাঁ। প্রতিষ্ঠানের সিল ও অধ্যক্ষের ডিজিটাল স্বাক্ষর আপলোড করতে পারেন, অথবা প্রিন্ট করার পর হাতে স্বাক্ষরের জন্য ফাঁকা দাগও রাখতে পারেন।",
    },
    {
      questionEn: "Can students download this exam routine on mobile devices?",
      questionBn: "শিক্ষার্থীরা কি মোবাইল থেকে এই পরীক্ষার রুটিন সরাসরি ডাউনলোড করতে পারবে?",
      answerEn: "Absolutely! Mobile users can download the complete schedule as a high-resolution vector PDF in 1 click or share it directly to WhatsApp and Messenger study groups.",
      answerBn: "অবশ্যই! যেকোনো স্মার্টফোন থেকে ১-ক্লিকে ঝকঝকে PDF ডাউনলোড করা যায় অথবা সরাসরি হোয়াটসঅ্যাপ ও ফেসবুক স্টাডি গ্রুপে শেয়ার করা যায়।",
    },
  ],
  MedicalReceipt: [
    {
      questionEn: "Does this diagnostic test bill track specimen collection and delivery times?",
      questionBn: "এই ডায়াগনস্টিক বিলে কি স্যাম্পল কালেকশন ও রিপোর্ট ডেলিভারির সময় উল্লেখ থাকে?",
      answerEn: "Yes. It features dedicated fields for specimen collection timestamp, expected report delivery date/time, referring doctor name, and hospital bed/ward number.",
      answerBn: "হ্যাঁ। এতে রক্ত/নমুনা সংগ্রহের সময়, রিপোর্ট ডেলিভারির সম্ভাব্য সময়, রেফার্ড চিকিৎসকের নাম এবং রোগীর বয়স/লিঙ্গ লেখার স্পষ্ট ফিল্ড রয়েছে।",
    },
    {
      questionEn: "How does the advance payment, discount, and due balance calculation work?",
      questionBn: "অগ্রিম জমা, ডিসকাউন্ট এবং বাকি টাকার হিসাব কীভাবে হয়?",
      answerEn: "The billing engine automatically computes the investigation total, applies discounts or VAT, subtracts advance received, and highlights the net balance due in prominent tabular numbers.",
      answerBn: "আমাদের বিলিং ইঞ্জিন স্বয়ংক্রিয়ভাবে মোট পরীক্ষা ফি, ছাড়, অগ্রিম জমা বাদ দিয়ে নিখুঁতভাবে বকেয়া টাকা বের করে দেয়।",
    },
    {
      questionEn: "Can pathology labs add authorized medical technologist seals?",
      questionBn: "প্যাথলজি ল্যাব বা ক্লিনিক কি মেডিকেল টেকনোলজিস্টের সিল যুক্ত করতে পারে?",
      answerEn: "Yes. It includes authorized signatures for both cashier and certified medical laboratory technologist, ensuring compliance with DGDA and healthcare audit norms.",
      answerBn: "হ্যাঁ। ক্যাশিয়ারের মানি রিসিট স্বাক্ষরের পাশাপাশি ল্যাব টেকনোলজিস্টের সত্যায়ন স্বাক্ষরের জায়গা রাখা হয়েছে।",
    },
    {
      questionEn: "Is patient demographic data kept strictly private?",
      questionBn: "রোগী ও টেস্টের তথ্যের গোপনীয়তা কি সুরক্ষিত থাকে?",
      answerEn: "100% private. All processing occurs entirely in your browser memory. We never store or transmit patient health records or diagnostic test details to external cloud databases.",
      answerBn: "১০০% নিরাপদ ও গোপন। সমস্ত বিল ও টেস্টের তথ্য সম্পূর্ণ আপনার ব্রাউজারে প্রক্রিয়াজাত হয়, কোনো সার্ভারে সংরক্ষিত বা শেয়ার করা হয় না।",
    },
  ],
  CommercialReceipts: [
    {
      questionEn: "Is this invoice and cash memo template completely free for commercial use?",
      questionBn: "এই ক্যাশ মেমো ও ইনভয়েস টেমপ্লেটটি কি বাণিজ্যিক ব্যবহারের জন্য সম্পূর্ণ ফ্রি?",
      answerEn: "Yes, 100% free forever for all businesses, shops, and freelancers. FreeDocForge does not add watermarks or require credit cards.",
      answerBn: "হ্যাঁ, যেকোনো ব্যবসা, দোকান ও ফ্রিল্যান্সারদের জন্য সম্পূর্ণ বিনামূল্যে আজীবনের জন্য ফ্রি। এতে কোনো ওয়াটারমার্ক থাকবে না।",
    },
    {
      questionEn: "Can I print this on both standard A4 and 80mm POS thermal receipt rolls?",
      questionBn: "এটি কি সাধারণ A4 এবং POS ৮০মিমি থার্মাল পেপার উভয়েই প্রিন্ট করা যাবে?",
      answerEn: "Yes! Choose standard A4 for laser/inkjet letterheads, or select the POS 80mm format for thermal receipt printers widely used in retail and restaurants.",
      answerBn: "হ্যাঁ! সাধারণ প্রিন্টারের জন্য A4 ফরম্যাট অথবা রেস্টুরেন্ট ও সুপারশপের জন্য POS ৮০মিমি থার্মাল স্লিপ ফরম্যাট বেছে নিয়ে প্রিন্ট করতে পারেন।",
    },
    {
      questionEn: "How does the Bengali Voice Typing feature work?",
      questionBn: "বাংলা ভয়েস টাইপিং ফিচারটি কীভাবে কাজ করে?",
      answerEn: "Click on the microphone icon next to any input field and speak naturally in Bengali or English. Our speech engine automatically types item names and amounts.",
      answerBn: "যেকোনো ইনপুট বক্সের পাশের মাইক আইকনে ক্লিক করে বাংলায় কথা বলুন। আমাদের স্মার্ট ভয়েস ইঞ্জিন স্বয়ংক্রিয়ভাবে পণ্য ও টাকার পরিমাণ বাংলায় টাইপ করে দেবে।",
    },
    {
      questionEn: "How do I share this invoice directly with customers on WhatsApp?",
      questionBn: "গ্রাহককে হোয়াটসঅ্যাপে কীভাবে এই মেমো সরাসরি পাঠানো যায়?",
      answerEn: "Click the 'Share to WhatsApp' button to instantly open a pre-formatted chat with invoice number, total amount, and item breakdown directly addressed to your customer.",
      answerBn: "১-ক্লিকে 'Share to WhatsApp' বাটনে চাপলেই গ্রাহকের নম্বরে মোট টাকা ও মেমো নম্বরসহ সুন্দর ফরম্যাটেড মেসেজ চলে যাবে।",
    },
  ],
  Healthcare: [
    {
      questionEn: "Is this doctor prescription pad legally compliant for clinic consultations?",
      questionBn: "এই প্রেসক্রিপশন প্যাডটি কি ক্লিনিক বা চেম্বার পরামর্শের জন্য গ্রহণযোগ্য?",
      answerEn: "Yes. It follows standard medical prescription layouts including Rx symbol, patient demographic details (Age, Gender, Weight, BP), diagnosis, structured medicine dosages, and digital seal/signature.",
      answerBn: "হ্যাঁ। এটি আধুনিক চিকিৎসা নির্দেশিকা অনুযায়ী তৈরি। এতে রোগীর তথ্য (বয়স, রক্তচাপ), Rx সিম্বল, ওষুধের মাত্রা (ডোজ), এবং ডাক্তারের ডিজিটাল সিল ও স্বাক্ষরের ঘর রয়েছে।",
    },
    {
      questionEn: "Can I save custom medicine lists and dosages for instant repeat prescribing?",
      questionBn: "ওষুধের তালিকা কি পরবর্তীতে ব্যবহারের জন্য সেভ রাখা যায়?",
      answerEn: "Yes! Click 'Save Document' to archive the completed prescription in your cloud history. You can reopen, edit, and re-print it anytime from your dashboard.",
      answerBn: "হ্যাঁ! প্রেসক্রিপশন তৈরি করে 'Save Document' বাটনে ক্লিক করলেই আপনার ড্যাশবোর্ডে সংরক্ষিত থাকবে। যেকোনো সময় রি-প্রিন্ট বা এডিট করতে পারবেন।",
    },
  ],
  Education: [
    {
      questionEn: "How does the GPA and marks calculation work on academic sheets?",
      questionBn: "মার্কশিট ও রেজাল্ট শিটে GPA ও গ্রেড কীভাবে হিসাব করা হয়?",
      answerEn: "The template includes built-in automated grading calculations aligned with Bangladeshi Board and standard grading scales (A+, A, A-, B, C, F, and 5.00 GPA).",
      answerBn: "এই মার্কশিটে জাতীয় শিক্ষাবোর্ড অনুযায়ী স্বয়ংক্রিয়ভাবে বিষয়ভিত্তিক নম্বর, লেটার গ্রেড এবং মোট GPA (যেমন: ৫.০০) হিসাব করার সুযোগ রয়েছে।",
    },
    {
      questionEn: "Can schools and coaching centers add their official crest and principal signature?",
      questionBn: "স্কুল বা কোচিং সেন্টারের লোগো এবং অধ্যক্ষের স্বাক্ষর কি যুক্ত করা যাবে?",
      answerEn: "Yes. You can upload high-resolution school crest logos and authorized signatures, which render crisply on both PDF export and direct color printing.",
      answerBn: "হ্যাঁ। প্রতিষ্ঠানের লোগো এবং প্রধান শিক্ষকের ডিজিটাল সিল আপলোড করে সরাসরি A4 সাইজে ঝকঝকে কালার প্রিন্ট নিতে পারবেন।",
    },
  ],
};

function resolveFaqs(slug: string, category: string): FAQItem[] {
  if (
    (slug.includes("routine") || slug.includes("timetable")) &&
    !slug.includes("exam")
  ) {
    return PILLAR_FAQS.ClassRoutine;
  }
  if (slug.includes("exam") || slug.includes("schedule")) {
    return PILLAR_FAQS.ExamRoutine;
  }
  if (
    slug.includes("diagnostic") ||
    slug.includes("pathology") ||
    slug.includes("radiology") ||
    slug.includes("blood") ||
    slug.includes("money-receipt") ||
    slug.includes("pharmacy") ||
    slug.includes("dental-procedure") ||
    slug.includes("spectacle") ||
    slug.includes("physiotherapy") ||
    slug.includes("hospital-bed") ||
    slug.includes("discharge-clearance")
  ) {
    return PILLAR_FAQS.MedicalReceipt;
  }
  if (
    category === "Business" ||
    category === "Restaurant" ||
    slug.includes("invoice") ||
    slug.includes("chalan") ||
    slug.includes("quotation") ||
    slug.includes("pos") ||
    slug.includes("bill") ||
    slug.includes("memo")
  ) {
    return PILLAR_FAQS.CommercialReceipts;
  }
  if (category === "Healthcare") {
    return PILLAR_FAQS.Healthcare;
  }
  return PILLAR_FAQS.Education;
}

export default function TemplateEditorialGuide({
  slug,
  category,
  title,
  description,
  paperSize = "A4",
}: TemplateEditorialGuideProps) {
  const { lang } = useGlobalSettings();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = resolveFaqs(slug, category);
  const siteUrl =
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://freedocforge.com";

  // 1. Schema.org FAQPage JSON-LD
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: lang === "bn" ? faq.questionBn : faq.questionEn,
      acceptedAnswer: {
        "@type": "Answer",
        text: lang === "bn" ? faq.answerBn : faq.answerEn,
      },
    })),
  };

  // 2. Schema.org SoftwareApplication JSON-LD
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${title} - FreeDocForge Studio`,
    operatingSystem: "All (Web Browser, Chrome, Safari, Edge, Firefox, Android, iOS)",
    applicationCategory:
      category === "Healthcare"
        ? "HealthApplication"
        : category === "Education"
        ? "EducationalApplication"
        : "BusinessApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BDT",
      availability: "https://schema.org/InStock",
    },
    description: description,
  };

  // 3. Schema.org WebApplication JSON-LD
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${title} Generator Online`,
    url: `${siteUrl}/templates/${slug}`,
    description: description,
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    softwareVersion: "2.4.0",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BDT",
    },
  };

  // 4. Schema.org BreadcrumbList JSON-LD
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Templates",
        item: `${siteUrl}/templates`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category,
        item: `${siteUrl}/templates?category=${encodeURIComponent(category)}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: title,
        item: `${siteUrl}/templates/${slug}`,
      },
    ],
  };

  return (
    <section className="mt-12 space-y-10 print:hidden text-slate-800 dark:text-slate-200">
      {/* Schema.org Structured Data Injection for Googlebot Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }}
      />

      {/* 1. COMPREHENSIVE EDITORIAL GUIDE & HOW-TO */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{lang === "bn" ? "ব্যবহার ও প্রিন্টিং নির্দেশিকা" : "Complete Usage & Printing Guide"}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {lang === "bn"
              ? `${title} তৈরি, কাস্টমাইজ ও প্রিন্ট করার নিয়মাবলী`
              : `How to Create, Customize, and Print Your ${title}`}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {lang === "bn"
              ? "আপনার ফেসবুক পেজ, দোকান, ক্লিনিক বা স্কুলের জন্য পরিষ্কার ও আকর্ষণীয় ডকুমেন্ট তৈরি করুন খুব সহজেই। নিচের ৪টি সহজ ধাপ অনুসরণ করে মুহূর্তেই প্রিন্ট বা ডাউনলোড করুন:"
              : "Whether you run a Facebook clothing shop, grocery store, private clinic, or school, having a clean, standardized printable document builds instant customer confidence. Follow these 4 simple steps to generate your document in seconds:"}
          </p>
        </div>

        {/* 4 Step Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center mb-3 shadow-xs">
                1
              </span>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                {lang === "bn" ? "লেটারহেড কাস্টমাইজ করুন" : "Customize Letterhead"}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {lang === "bn"
                  ? "আপনার শপ বা প্রতিষ্ঠানের নাম, লোগো, ফোন এবং ঠিকানা বসান। অথবা ১ ক্লিকে আপনার সংরক্ষিত প্রিসেট লোড করুন।"
                  : "Add your business name, logo, contact phone, and address. Or load your saved preset in 1 click."}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center mb-3 shadow-xs">
                2
              </span>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                {lang === "bn" ? "ভয়েস টাইপিং দিয়ে আইটেম যোগ" : "Input Items via Voice"}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {lang === "bn"
                  ? "পণ্য বা সেবার বিবরণ ও মূল্য মুখে বলুন বা লিখুন। স্বয়ংক্রিয়ভাবে মোট ও বকেয়া হিসাব হয়ে যাবে।"
                  : "Type or speak product descriptions and prices in Bengali or English. Auto-calculates totals and due amounts."}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center mb-3 shadow-xs">
                3
              </span>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                {lang === "bn" ? "শর্তাবলী ও ডিজিটাল সিল" : "Terms & Digital Seal"}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {lang === "bn"
                  ? "কুরিয়ার নোট, রিটার্ন পলিসি এবং ডিজিটাল সিল বা স্বাক্ষর যুক্ত করুন।"
                  : "Specify courier notes, return policies, warranty terms, and upload your authorized signature seal."}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <span className="w-7 h-7 rounded-lg bg-rose-600 text-white font-extrabold text-xs flex items-center justify-center mb-3 shadow-xs">
                4
              </span>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                {lang === "bn" ? "প্রিন্ট বা PDF সংরক্ষণ" : "Print or Save PDF"}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {lang === "bn"
                  ? "লেজার বা POS থার্মাল প্রিন্টারে সরাসরি প্রিন্ট করুন অথবা ওয়াটারমার্ক ছাড়া PDF ডাউনলোড করুন।"
                  : "Print directly to laser or POS thermal printers, or download clean PDF without any watermarks."}
              </p>
            </div>
          </div>
        </div>

        {/* Commercial Benefit Callouts */}
        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                {lang === "bn" ? "কুরিয়ার রিটার্ন ও ভুল দূর করে" : "Reduces Courier & COD Returns"}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {lang === "bn"
                  ? "গ্রাহকের স্পষ্ট ঠিকানা ও বকেয়া টাকার উল্লেখ থাকায় কুরিয়ার ডেলিভারিতে ভুল হয় না।"
                  : "Clearly printed customer addresses and COD due amounts prevent delivery mix-ups with courier partners."}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                {lang === "bn" ? "বাংলা ও ইংরেজি উভয়ে প্রিন্ট সাপোর্ট" : "Bilingual Compliance (EN & BN)"}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {lang === "bn"
                  ? "ওয়েবসাইট ও ডকুমেন্টের ভাষা সম্পূর্ণ স্বাধীন। বাংলায় অংক ও বিবরণ সহজে প্রিন্ট করতে পারেন।"
                  : "Fully separates document language from website UI. Print Bengali numerals and terms effortlessly."}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                {lang === "bn" ? "সম্পূর্ণ ফ্রি ও ওয়াটারমার্কহীন" : "Zero Watermarks & No Fees"}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {lang === "bn"
                  ? "অন্যান্য টুলের মতো টাকা দাবি না করে, FreeDocForge আজীবন ১০০% ফ্রি ও আনলিমিটেড।"
                  : "Unlike other tools that charge after 3 invoices, FreeDocForge is 100% free with unlimited generation."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FREQUENTLY ASKED QUESTIONS (FAQ) ACCORDION */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs">
        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>{lang === "bn" ? "সাধারণ প্রশ্নোত্তর" : "Frequently Asked Questions"}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {lang === "bn" ? `${title} সম্পর্কিত সাধারণ প্রশ্নোত্তর` : `Common Questions About ${title}`}
        </h2>

        <div className="mt-6 divide-y divide-slate-100 dark:divide-slate-800">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            const q = lang === "bn" ? faq.questionBn : faq.questionEn;
            const a = lang === "bn" ? faq.answerBn : faq.answerEn;
            return (
              <div key={index} className="py-4">
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between text-left gap-4 font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
                >
                  <span className="font-bold">{q}</span>
                  <div className="shrink-0 p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed animate-in fade-in duration-200">
                    <p>{a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
