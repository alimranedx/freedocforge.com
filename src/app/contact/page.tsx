"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, HelpCircle, Sparkles } from "lucide-react";
import { useGlobalSettings } from "@/context/GlobalSettingsContext";

export default function ContactPage() {
  const { lang } = useGlobalSettings();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

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
      q: lang === "bn" ? "FreeDocForge কি সম্পূর্ণ ফ্রি?" : "Is FreeDocForge really 100% free?",
      a: lang === "bn"
        ? "হ্যাঁ, সম্পূর্ণ ফ্রি। কোনো ক্রেডিট কার্ড বা পেমেন্ট ছাড়াই আপনি আনলিমিটেড ক্যাশ মেমো, মার্কশিট ও প্রেসক্রিপশন তৈরি ও প্রিন্ট করতে পারবেন।"
        : "Yes, completely free. You can generate, customize, and print unlimited invoices, marksheets, and prescriptions with zero watermarks.",
    },
    {
      q: lang === "bn" ? "আমার শপের তথ্য কি প্রতিবার লিখতে হবে?" : "Do I need to type my shop info every time?",
      a: lang === "bn"
        ? "না! একটি ফ্রি অ্যাকাউন্ট খুলে 'My Shop Preset'-এ লোগো, ফোন ও ঠিকানা সেভ করে রাখলে প্রতিটি টেমপ্লেটে স্বয়ংক্রিয়ভাবে তথ্য বসে যাবে।"
        : "No! Create a free account and save your business preset once. All 30 templates will auto-fill your logo, address, and signature in 1 click.",
    },
    {
      q: lang === "bn" ? "ভয়েস টাইপিং কি বাংলা ভাষায় কাজ করে?" : "Does voice typing support Bangla language?",
      a: lang === "bn"
        ? "হ্যাঁ! প্রতিটি ফিল্ডের পাশের মাইক আইকনে ক্লিক করে আপনি বাংলায় বা ইংরেজিতে কথা বলে সাথে সাথে টাইপ করতে পারবেন।"
        : "Yes! Click the microphone icon on any input field to speak in Bangla (bn-BD) or English (en-US) for instant auto-filling.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3 border border-blue-200 dark:border-blue-900">
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
            <span>{lang === "bn" ? "যোগাযোগ ও সহায়তা" : "24/7 Support & Feedback"}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {lang === "bn" ? "আমাদের সাথে যোগাযোগ করুন" : "Get in Touch with Our Team"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl mx-auto leading-relaxed">
            {lang === "bn"
              ? "নতুন কোনো টেমপ্লেটের অনুরোধ, টেকনিক্যাল সহায়তা বা যেকোনো ফিডব্যাকের জন্য নির্দ্বিধায় বার্তা পাঠান।"
              : "Have a template suggestion, custom requirement, or feedback? Send us a message and we will respond promptly."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details & Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {lang === "bn" ? "সরাসরি যোগাযোগ মাধ্যম" : "Direct Contact Channels"}
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Official Support Email</span>
                    <a href="mailto:support@freedocforge.com" className="font-bold text-blue-600 dark:text-blue-400 hover:underline text-sm">
                      support@freedocforge.com
                    </a>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Response within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Helpline & WhatsApp</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">+880 1700-000000</span>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Saturday - Thursday, 10 AM - 8 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Headquarters</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">Dhaka, Bangladesh</span>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Serving creators & shops worldwide</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick FAQs */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {lang === "bn" ? "সাধারণ জিজ্ঞাসা (FAQs)" : "Frequently Asked Questions"}
                </h4>
              </div>

              <div className="space-y-3 text-xs">
                {faqs.map((faq, i) => (
                  <div key={i} className="space-y-1">
                    <h5 className="font-bold text-slate-900 dark:text-white">{faq.q}</h5>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1">
              {lang === "bn" ? "একটি বার্তা পাঠান" : "Send Us a Message"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              {lang === "bn"
                ? "আমাদের দল আপনার বার্তার দ্রুত উত্তর প্রদান করবে।"
                : "Fill out the form below and we will get back to you as soon as possible."}
            </p>

            {submitted ? (
              <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200 p-6 rounded-2xl text-center space-y-2 animate-in fade-in">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h4 className="font-bold text-sm">
                  {lang === "bn" ? "বার্তা সফলভাবে পাঠানো হয়েছে!" : "Message Sent Successfully!"}
                </h4>
                <p className="text-xs">
                  {lang === "bn" ? "ধন্যবাদ! আমরা খুব শীঘ্রই যোগাযোগ করব।" : "Thank you for reaching out. We will get back to you shortly."}
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
                    placeholder="e.g. Request for Medical Diagnostic Slip Format"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    {lang === "bn" ? "বিস্তারিত বার্তা" : "Your Message"}
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder={
                      lang === "bn"
                        ? "আপনার প্রশ্ন বা পরামর্শ বিস্তারিত লিখুন..."
                        : "Describe your inquiry or template suggestion in detail..."
                    }
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition shadow-xs cursor-pointer text-xs sm:text-sm"
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
