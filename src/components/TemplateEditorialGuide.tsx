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

const CATEGORY_FAQS: Record<string, FAQItem[]> = {
  Business: [
    {
      questionEn: "Is this invoice and cash memo template completely free to use?",
      questionBn: "এই ক্যাশ মেমো ও ইনভয়েস টেমপ্লেটটি কি সম্পূর্ণ ফ্রি?",
      answerEn: "Yes, 100% free forever. FreeDocForge does not add any watermarks, require credit cards, or limit how many invoices you can create, download, or print.",
      answerBn: "হ্যাঁ, এটি সম্পূর্ণ বিনামূল্যে আজীবনের জন্য ফ্রি। এতে কোনো ওয়াটারমার্ক থাকবে না এবং কোনো লিমিটেশন ছাড়াই যত খুশি ইনভয়েস প্রিন্ট ও ডাউনলোড করতে পারবেন।",
    },
    {
      questionEn: "Can I print this on both standard A4 and POS thermal receipt paper?",
      questionBn: "এটি কি সাধারণ A4 এবং POS থার্মাল পেপার উভয়েই প্রিন্ট করা যাবে?",
      answerEn: "Yes! You can choose standard A4 format for regular laser/inkjet printers, or select the POS 80mm format for thermal receipt printers widely used in retail and restaurants.",
      answerBn: "হ্যাঁ! সাধারণ প্রিন্টারের জন্য A4 ফরম্যাট অথবা রেস্টুরেন্ট ও খুচরা দোকানের জন্য POS ৮০মিমি থার্মাল স্লিপ ফরম্যাট বেছে নিয়ে প্রিন্ট করতে পারেন।",
    },
    {
      questionEn: "How does the Bengali Voice Typing (ভয়েস টাইপিং) feature work?",
      questionBn: "বাংলা ভয়েস টাইপিং ফিচারটি কীভাবে কাজ করে?",
      answerEn: "Click on the microphone icon next to any input field and speak naturally in Bengali or English. Our speech engine automatically recognizes item names, amounts, and converts Bengali numbers into standardized figures.",
      answerBn: "যেকোনো ইনপুট বক্সের পাশের মাইক আইকনে ক্লিক করে বাংলায় কথা বলুন। আমাদের স্মার্ট ভয়েস ইঞ্জিন স্বয়ংক্রিয়ভাবে পণ্য ও টাকার পরিমাণ বাংলায় টাইপ করে দেবে।",
    },
    {
      questionEn: "How do I save my shop logo and address so I don't have to retype it every time?",
      questionBn: "প্রতিবার নতুন করে না লিখে শপের লোগো ও ঠিকানা কীভাবে স্থায়ীভাবে সেভ রাখব?",
      answerEn: "Simply enter your business details once and click 'Save Brand Preset'. You can also create a free account to sync your profile across all your computers and mobile devices.",
      answerBn: "একবার শপের নাম ও লোগো বসিয়ে 'Save Brand Preset' বাটনে ক্লিক করুন। অথবা একটি ফ্রি অ্যাকাউন্ট খুললে যেকোনো ডিভাইস থেকে আপনার শপ প্রোফাইল অটো-লোড হবে।",
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
  Restaurant: [
    {
      questionEn: "Does this template support 80mm and 58mm thermal POS roll printers?",
      questionBn: "এটি কি ৮০ মিমি ও ৫৮ মিমি থার্মাল রোল প্রিন্টারে সাপোর্ট করে?",
      answerEn: "Yes, our POS billing templates are pixel-crafted specifically for 80mm thermal paper with high-contrast monochrome rendering for instant kitchen and customer tokens.",
      answerBn: "হ্যাঁ, রেস্টুরেন্ট বিল টেমপ্লেটটি ৮০মিমি থার্মাল রোল প্রিন্টারের মাপে নিখুঁতভাবে তৈরি। এক ক্লিকে কিচেন টোকেন ও কাস্টমার কপি প্রিন্ট নেওয়া যায়।",
    },
  ],
};

export default function TemplateEditorialGuide({
  slug,
  category,
  title,
  description,
  paperSize = "A4",
}: TemplateEditorialGuideProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = CATEGORY_FAQS[category] || CATEGORY_FAQS["Business"];

  // Schema.org FAQPage Microdata JSON-LD
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.questionEn,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answerEn,
      },
    })),
  };

  // Schema.org SoftwareApplication JSON-LD
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${title} - FreeDocForge Studio`,
    operatingSystem: "All (Web Browser, Chrome, Safari, Edge)",
    applicationCategory: "BusinessApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BDT",
    },
    description: description,
  };

  return (
    <section className="mt-12 space-y-10 print:hidden text-slate-800 dark:text-slate-200">
      {/* Schema.org Structured Data Injection for Googlebot Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />

      {/* 1. COMPREHENSIVE EDITORIAL GUIDE & HOW-TO */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Complete Usage & Printing Guide / নির্দেশিকা</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            How to Create, Customize, and Print Your {title}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Whether you run a Facebook clothing shop, grocery store, private clinic, or school, having a clean, standardized printable document builds instant customer confidence. Follow these 4 simple steps to generate your document in seconds:
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
                Customize Letterhead
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Add your business name, logo, contact phone, and address. Or load your saved preset in 1 click.
              </p>
            </div>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold mt-3 block">
              লোগো ও শপের নাম বসান
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center mb-3 shadow-xs">
                2
              </span>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                Input Items via Voice
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Type or speak product descriptions and prices in Bengali or English. Auto-calculates totals and due amounts.
              </p>
            </div>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold mt-3 block">
              ভয়েস টাইপিং দিয়ে আইটেম যোগ
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center mb-3 shadow-xs">
                3
              </span>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                Terms & Digital Seal
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Specify courier notes, return policies, warranty terms, and upload your authorized signature seal.
              </p>
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-3 block">
              শর্তাবলী ও ডিজিটাল স্বাক্ষর
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <span className="w-7 h-7 rounded-lg bg-rose-600 text-white font-extrabold text-xs flex items-center justify-center mb-3 shadow-xs">
                4
              </span>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                Print or Save PDF
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Print directly to laser or POS thermal printers, or download clean PDF without any watermarks.
              </p>
            </div>
            <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold mt-3 block">
              ফ্রি প্রিন্ট বা PDF ডাউনলোড
            </span>
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
                Reduces Courier & COD Returns
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Clearly printed customer addresses and COD due amounts prevent delivery mix-ups with courier partners.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                Bilingual Compliance (EN & BN)
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Fully separates document language from website UI. Print Bengali numerals and terms effortlessly.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                Zero Watermarks & No Fees
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Unlike other tools that charge after 3 invoices, FreeDocForge is 100% free with unlimited generation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FREQUENTLY ASKED QUESTIONS (FAQ) ACCORDION */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs">
        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Frequently Asked Questions / সাধারণ প্রশ্নোত্তর</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Common Questions About {title}
        </h2>

        <div className="mt-6 divide-y divide-slate-100 dark:divide-slate-800">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={index} className="py-4">
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between text-left gap-4 font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
                >
                  <div>
                    <div>{faq.questionEn}</div>
                    <div className="text-[11px] font-normal text-slate-500 dark:text-slate-400 mt-0.5">
                      {faq.questionBn}
                    </div>
                  </div>
                  <div className="shrink-0 p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="mt-3 text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed animate-in fade-in duration-200">
                    <p>{faq.answerEn}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 border-l-2 border-blue-500 pl-3 italic">
                      {faq.answerBn}
                    </p>
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
