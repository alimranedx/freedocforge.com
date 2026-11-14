"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  MessageCircle,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Smartphone,
  Phone,
  Send,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

export interface ShareDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  documentNumber: string;
  recipientName: string;
  recipientPhone?: string;
  amountOrDetails?: string;
  fullFormattedText: string;
  docLang?: "en" | "bn";
  documentUrl?: string;
}

export default function ShareDocumentModal({
  isOpen,
  onClose,
  documentTitle,
  documentNumber,
  recipientName,
  recipientPhone = "",
  amountOrDetails = "",
  fullFormattedText,
  docLang = "en",
  documentUrl,
}: ShareDocumentModalProps) {
  const isBn = docLang === "bn";
  const [phone, setPhone] = useState(recipientPhone);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"whatsapp" | "messenger" | "sms">("whatsapp");

  useEffect(() => {
    setPhone(recipientPhone || "");
  }, [recipientPhone]);

  if (!isOpen) return null;

  const cleanDigits = phone.replace(/[^0-9]/g, "");
  const formattedWhatsAppPhone =
    cleanDigits.length >= 10
      ? cleanDigits.startsWith("88")
        ? cleanDigits
        : `88${cleanDigits}`
      : "";

  // 1. WhatsApp with specific phone
  const handleSendToSpecificWhatsApp = () => {
    if (formattedWhatsAppPhone) {
      const url = `https://api.whatsapp.com/send/?phone=${formattedWhatsAppPhone}&text=${encodeURIComponent(
        fullFormattedText
      )}`;
      window.open(url, "_blank");
    } else {
      handleSendToGeneralWhatsApp();
    }
  };

  // 2. WhatsApp without phone (user picks contact inside WhatsApp)
  const handleSendToGeneralWhatsApp = () => {
    const url = `https://api.whatsapp.com/send/?text=${encodeURIComponent(fullFormattedText)}`;
    window.open(url, "_blank");
  };

  // 3. Facebook Messenger
  const handleOpenMessenger = () => {
    // Open Messenger web
    window.open("https://www.messenger.com", "_blank");
    handleCopyText();
  };

  // 4. Native SMS
  const handleSendSMS = () => {
    const clean = phone.replace(/[^0-9+]/g, "");
    const smsUrl = `sms:${clean}?body=${encodeURIComponent(fullFormattedText)}`;
    window.open(smsUrl, "_blank");
  };

  // Copy text to clipboard
  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(fullFormattedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = fullFormattedText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in print:hidden font-sans"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                {isBn ? "গ্রাহককে মেমো / স্লিপ পাঠান" : "Share Document with Customer"}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {documentTitle} • #{documentNumber}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CHANNEL SELECTION TABS */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <button
            onClick={() => setActiveTab("whatsapp")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === "whatsapp"
                ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={() => setActiveTab("messenger")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === "messenger"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Facebook / Messenger</span>
          </button>

          <button
            onClick={() => setActiveTab("sms")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === "sms"
                ? "bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>SMS</span>
          </button>
        </div>

        {/* TAB 1: WHATSAPP */}
        {activeTab === "whatsapp" && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                {isBn
                  ? "গ্রাহকের হোয়াটসঅ্যাপ নম্বর (বিকল্প নম্বর দিতে পারেন):"
                  : "Customer WhatsApp Number (Enter alternate number if needed):"}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={isBn ? "যেমন: 01819987654" : "e.g. 01819987654"}
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition font-mono"
                />
              </div>

              {/* HELPER CALLOUT FOR UNREGISTERED WHATSAPP NUMBERS */}
              <div className="mt-2 p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 rounded-xl text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-bold">
                    {isBn ? "নম্বর হোয়াটসঅ্যাপে না থাকলে?" : "If this number is not on WhatsApp:"}
                  </span>{" "}
                  {isBn
                    ? "উপরে গ্রাহকের অন্য হোয়াটসঅ্যাপ নম্বর লিখুন, অথবা নিচের বাটনে চাপ দিয়ে হোয়াটসঅ্যাপের চ্যাট লিস্ট থেকে বেছে নিন।"
                    : "Enter their alternate WhatsApp number above, or click 'Choose from WhatsApp Chats' below to send to any contact."}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {/* Button A: Send to typed number */}
              <button
                type="button"
                onClick={handleSendToSpecificWhatsApp}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-3 rounded-xl shadow-xs transition text-xs cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>
                  {phone ? (isBn ? "এই নম্বরে পাঠান" : "Send to Number") : isBn ? "হোয়াটসঅ্যাপে পাঠান" : "Open WhatsApp"}
                </span>
              </button>

              {/* Button B: General WhatsApp (No number required - picks from chat list) */}
              <button
                type="button"
                onClick={handleSendToGeneralWhatsApp}
                className="w-full flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-2.5 px-3 rounded-xl transition text-xs cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isBn ? "চ্যাট লিস্ট থেকে বাছাই" : "Pick from Chat List"}</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: FACEBOOK & MESSENGER */}
        {activeTab === "messenger" && (
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 rounded-xl text-xs text-blue-900 dark:text-blue-300 leading-relaxed">
              <p className="font-bold">
                {isBn
                  ? "ফেসবুক পেজ ইনবক্স বা মেসেঞ্জারে মেমো পাঠানোর নিয়ম:"
                  : "How to send this bill via Facebook Page Inbox or Messenger:"}
              </p>
              <p className="text-[11px] text-blue-800/80 dark:text-blue-300/80 mt-1">
                {isBn
                  ? "নিচের বাটনে চাপ দিয়ে পুরো মেমো মেসেজটি কপি করুন, এরপর আপনার ফেসবুক পেজের মেসেঞ্জারে গিয়ে গ্রাহকের চ্যাটে পেস্ট (Ctrl + V) করে পাঠিয়ে দিন।"
                  : "Click 'Copy Bill Text' below, then paste directly into your Facebook Page Inbox or Messenger customer chat."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleCopyText}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-3 rounded-xl shadow-xs transition text-xs cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? (isBn ? "কপি হয়েছে!" : "Copied!") : isBn ? "মেমো টেক্সট কপি করুন" : "Copy Bill Text"}</span>
              </button>

              <button
                type="button"
                onClick={handleOpenMessenger}
                className="w-full flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-2.5 px-3 rounded-xl transition text-xs cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                <span>{isBn ? "মেসেঞ্জার ওপেন করুন" : "Open Messenger.com"}</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: SMS */}
        {activeTab === "sms" && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                {isBn ? "গ্রাহকের মোবাইল নম্বর:" : "Customer Mobile Number:"}
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01712345678"
                className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none transition font-mono"
              />
            </div>

            <button
              type="button"
              onClick={handleSendSMS}
              className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-3 rounded-xl shadow-xs transition text-xs cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>{isBn ? "মোবাইলে সরাসরি এসএমএস পাঠান" : "Send via Mobile SMS"}</span>
            </button>
          </div>
        )}

        {/* PREVIEW BOX */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {isBn ? "প্রেরিতব্য মেসেজের প্রিভিউ" : "Message Preview"}
            </span>
            <button
              type="button"
              onClick={handleCopyText}
              className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? (isBn ? "কপি হয়েছে!" : "Copied!") : isBn ? "কপি করুন" : "Copy"}</span>
            </button>
          </div>
          <pre className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-[11px] text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-sans max-h-36 overflow-y-auto leading-relaxed">
            {fullFormattedText}
          </pre>
        </div>

        {/* FOOTER */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
          >
            {isBn ? "বন্ধ করুন" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
