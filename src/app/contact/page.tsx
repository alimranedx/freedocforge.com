"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { getBreadcrumbListSchema, SITE_URL } from "@/lib/seo";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  MessageSquare,
  HelpCircle,
  Sparkles,
  Clock,
  ShieldCheck,
  FileText,
  Printer,
} from "lucide-react";
import { useGlobalSettings } from "@/context/GlobalSettingsContext";

export default function ContactPage() {
  const { lang } = useGlobalSettings();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const breadcrumbs = getBreadcrumbListSchema([
    { name: "Home", url: "/" },
    { name: "Contact & Support", url: "/contact" },
  ]);

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact FreeDocForge Support & Editorial Team",
    url: `${SITE_URL}/contact`,
    description: "Reach the FreeDocForge support, engineering, and editorial team.",
    mainEntity: {
      "@type": "Organization",
      name: "FreeDocForge.com",
      url: SITE_URL,
      email: "support@freedocforge.com",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Customer Support & Partnerships",
        email: "support@freedocforge.com",
        availableLanguage: ["English", "Bengali"],
      },
    },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 4000);
  };

  const faqs = [
    {
      q: lang === "bn" ? "FreeDocForge কি সম্পূর্ণ ফ্রি? কোনো লুকানো ফি আছে?" : "Is FreeDocForge really 100% free with no hidden fees?",
      a: lang === "bn"
        ? "হ্যাঁ, সম্পূর্ণ ১০০% আজীবন ফ্রি। কোনো ক্রেডিট কার্ড, সাবস্ক্রিপশন ফি বা সাইন-আপ ছাড়াই আপনি আনলিমিটেড ক্যাশ মেমো, রুটিন ও প্রেসক্রিপশন তৈরি ও ভেক্টর PDF ডাউনলোড করতে পারবেন।"
        : "Yes, 100% free forever. There are zero subscription fees, no credit card paywalls, and no hidden charges. All 60+ templates can be customized and downloaded as pristine vector PDFs immediately.",
    },
    {
      q: lang === "bn" ? "ডাউনলোড করা ডকুমেন্টে কি কোনো ওয়াটারমার্ক থাকে?" : "Are generated documents watermarked?",
      a: lang === "bn"
        ? "না! আমাদের তৈরি কোনো ডকুমেন্টে কোনো ধরনের ওয়াটারমার্ক বা ওয়েবসাইট লোগো থাকে না। আপনি সম্পূর্ণ প্রফেশনাল ও ক্লিন ডকুমেন্ট পাবেন যা সরাসরি আপনার কাস্টমার বা শিক্ষার্থীদের দেওয়া যায়।"
        : "Never. FreeDocForge produces 100% clean, professional PDFs with zero platform watermarks, ready for direct distribution to your clients, students, or patients.",
    },
    {
      q: lang === "bn" ? "আমার কাস্টমার বা রোগীর তথ্যের গোপনীয়তা কিভাবে বজায় থাকে?" : "How is my customer, student, or patient data protected?",
      a: lang === "bn"
        ? "আমাদের সম্পূর্ণ ডকুমেন্ট এডিটিং এবং হিসাব-নিকাশ আপনার নিজস্ব ডিভাইসের ব্রাউজারেই সরাসরি সম্পন্ন হয় (Client-Side)। আপনার কাস্টমার বা রোগীর কোনো গোপন তথ্য আমরা সার্ভারে বিক্রি বা সংরক্ষণ করি না।"
        : "All calculations, voice typing, and PDF rendering occur client-side inside your web browser sandbox. We never store, sell, or monetize confidential invoice or medical records.",
    },
    {
      q: lang === "bn" ? "আপনারা এটি কিভাবে বিনামূল্যে পরিচালনা করেন?" : "How do you fund this service without charging users?",
      a: lang === "bn"
        ? "আমরা গুগল অ্যাডসেন্স (Google AdSense) ডিসপ্লে বিজ্ঞাপনের মাধ্যমে নৈতিকভাবে সাইটটি চালাই। বিজ্ঞাপনের আয় দিয়ে সার্ভার ও ইঞ্জিনিয়ারিং ব্যয় বহন করা হয়, যার ফলে আপনার জন্য সেবাটি আজীবন ফ্রি থাকে।"
        : "FreeDocForge is funded transparently through ethical Google AdSense display advertisements on our website. Ads are never included on printed documents and strictly fund our compute infrastructure.",
    },
    {
      q: lang === "bn" ? "থার্মাল ৮০মিমি পিওএস রসিদ প্রিন্টারে কি প্রিন্ট করা যায়?" : "Does it support 80mm POS thermal receipt printers?",
      a: lang === "bn"
        ? "হ্যাঁ! আমাদের ক্যাশ মেমো ও রেস্তোরাঁ বিল ক্যাটাগরিতে ৮০মিমি থার্মাল পিওএস রসিদের বিশেষ লেআউট রয়েছে যা যেকোনো স্ট্যান্ডার্ড থার্মাল রোল প্রিন্টারে নিখুঁতভাবে প্রিন্ট হয়।"
        : "Yes! Our commercial receipt suite includes dedicated continuous 80mm thermal roll formats (ESC/POS standard) formatted with monospace tabular rules for instant counter receipt printing.",
    },
    {
      q: lang === "bn" ? "নতুন কোনো টেমপ্লেট অনুরোধ করা যাবে?" : "Can I request a custom template for my institution?",
      a: lang === "bn"
        ? "অবশ্যই! পাশের ফর্মটি পূরণ করে আপনার প্রয়োজনীয় ফরম্যাটের বিবরণ পাঠান। আমাদের ডিজাইন টিম তা তৈরি করে ফ্রি গ্যালারিতে যুক্ত করে দেবে।"
        : "Absolutely! Send us your requirement using the contact form, and our engineering team will build and publish the template to the public library for free.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Schema.org Structured Data */}
      <JsonLd data={breadcrumbs} />
      <JsonLd data={contactSchema} />

      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3 border border-blue-200 dark:border-blue-900 shadow-2xs">
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
            <span>{lang === "bn" ? "যোগাযোগ ও সহায়তা কেন্দ্র" : "Editorial & Support Office"}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {lang === "bn" ? "আমাদের সাথে যোগাযোগ করুন" : "Get in Touch with FreeDocForge"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl mx-auto leading-relaxed">
            {lang === "bn"
              ? "নতুন কোনো টেমপ্লেটের অনুরোধ, টেকনিক্যাল সহায়তা, বিজ্ঞাপন নীতিমালা বা ফিডব্যাকের জন্য আমাদের টিম প্রস্তুত।"
              : "Have a template suggestion, custom business requirement, or editorial feedback? Send us a message and our team will respond within 24 hours."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Direct Contact Details */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {lang === "bn" ? "অফিসিয়াল যোগাযোগ চ্যানেল" : "Official Support Channels"}
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Support & Editorial Email</span>
                    <a
                      href="mailto:support@freedocforge.com"
                      className="font-bold text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    >
                      support@freedocforge.com
                    </a>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                      Guaranteed response within 24 business hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Helpline & WhatsApp Hotline</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">+880 1700-000000</span>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                      Saturday - Thursday, 10:00 AM - 08:00 PM (BST)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Editorial Headquarters</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">Dhaka, Bangladesh</span>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                      Global document publishing & digital tools studio
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick FAQs Accordion Box */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {lang === "bn" ? "সাধারণ জিজ্ঞাসা (FAQs)" : "Frequently Asked Questions"}
                </h4>
              </div>

              <div className="space-y-3.5 text-xs">
                {faqs.map((faq, i) => (
                  <div key={i} className="space-y-1">
                    <h5 className="font-bold text-slate-900 dark:text-white">{faq.q}</h5>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Message Form */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1">
              {lang === "bn" ? "আমাদের বার্তা পাঠান" : "Send Us a Message"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              {lang === "bn"
                ? "ফরমটি পূরণ করে সাবমিট করুন। আমাদের টিম দ্রুত আপনার সাথে যোগাযোগ করবে।"
                : "Fill out the form below with your inquiry, custom format proposal, or feedback."}
            </p>

            {submitted ? (
              <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200 p-8 rounded-2xl text-center space-y-2 animate-in fade-in">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h4 className="font-bold text-base">
                  {lang === "bn" ? "বার্তা সফলভাবে পাঠানো হয়েছে!" : "Message Delivered Successfully!"}
                </h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                  {lang === "bn"
                    ? "ধন্যবাদ! আমাদের টিম ২৪ ঘণ্টার মধ্যে আপনার ইমেইলে উত্তর দেবে।"
                    : "Thank you for reaching out. Our support team will respond to your email within 24 hours."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      {lang === "bn" ? "আপনার নাম" : "Your Full Name"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Md. Tanvir Ahmed"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      {lang === "bn" ? "ইমেইল ঠিকানা" : "Email Address"}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    {lang === "bn" ? "বিষয়" : "Subject"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Template Request: Madrasah Hifz Exam Schedule"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    {lang === "bn" ? "বিস্তারিত বার্তা" : "Your Detailed Message"}
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder={
                      lang === "bn"
                        ? "আপনার প্রশ্ন বা পরামর্শের বিস্তারিত বিবরণ লিখুন..."
                        : "Describe your inquiry or template suggestion in detail..."
                    }
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-7 py-3 rounded-xl transition shadow-xs cursor-pointer text-xs sm:text-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>{lang === "bn" ? "বার্তা পাঠান" : "Send Message"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
