"use client";

import React, { useState, useRef } from "react";
import { Printer, Download, Plus, Trash2, Building, Upload, Check, Mic, Globe, FileText } from "lucide-react";
import { numberToWordsEnglish, numberToWordsBengali } from "@/lib/numberToWords";
import AdSenseSlot from "@/components/AdSenseSlot";
import VoiceInputButton from "@/components/VoiceInputButton";
import { useGlobalSettings } from "@/context/GlobalSettingsContext";

interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
}

export default function InvoiceEditor({
  initialData,
  locales,
  isUserSaved = false,
}: {
  initialData: any;
  locales?: {
    en: { defaultData: any; title: string; description: string };
    bn: { defaultData: any; title: string; description: string };
  };
  isUserSaved?: boolean;
}) {
  // 1. SYSTEM LANGUAGE (Controls Website UI Chrome)
  const { lang: sysLang } = useGlobalSettings();

  // 2. TEMPLATE / DOCUMENT LANGUAGE (Independent! Controls Printed Document Output)
  const [docLang, setDocLang] = useState<"en" | "bn">("en");

  const [data, setData] = useState({ ...initialData });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // Switch Document Locale independently of system language
  const handleSwitchDocLang = (targetLang: "en" | "bn") => {
    setDocLang(targetLang);
    if (locales && locales[targetLang]) {
      setData({ ...locales[targetLang].defaultData });
    }
  };

  // Calculations
  const itemsList: InvoiceItem[] = Array.isArray(data.items) ? data.items : [];
  const subtotal = itemsList.reduce(
    (acc: number, item: InvoiceItem) =>
      acc + Number(item.quantity || 0) * Number(item.price || 0),
    0
  );
  const delivery = Number(data.deliveryCharge || 0);
  const discount = Number(data.discount || 0);
  const grandTotal = Math.max(0, subtotal + delivery - discount);
  const paid = Number(data.paidAmount || 0);
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
    window.print();
  };

  const handleSaveToProfile = async () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
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
                ? "সিস্টেম ল্যাঙ্গুয়েজের বাইরে সম্পূর্ণ আলাদাভাবে ডকুমেন্টের ভাষা পরিবর্তন করতে পারেন।"
                : "Manage document output language independently of the website UI language."}
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
            English Invoice
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
            বাংলা ক্যাশ মেমো
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Input Form Controls (Hidden during printing) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs print:hidden space-y-6 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{docLang === "bn" ? "ডকুমেন্ট সেটিংস" : "Document Settings"}</span>
                <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <Mic className="w-3 h-3 text-red-500" />
                  {docLang === "bn" ? "ভয়েস ইনপুট রেডি (বাংলা)" : "Voice Input (EN)"}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {docLang === "bn"
                  ? "দোকান ও কাস্টমারের তথ্য টাইপ করুন বা মাইকে বাংলায় বলুন।"
                  : "Type details or speak into the microphone to auto-fill."}
              </p>
            </div>
            <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2.5 py-1 rounded-full font-semibold shrink-0">
              {docLang === "bn" ? "ফ্রি PDF" : "Instant PDF"}
            </span>
          </div>

          {/* 1. Business Details */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              {docLang === "bn" ? "১. আপনার দোকান / প্রতিষ্ঠানের তথ্য" : "1. Your Business / Shop Details"}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 relative flex items-center">
                <input
                  type="text"
                  placeholder={docLang === "bn" ? "দোকান বা পেজের নাম" : "Shop / Company Name"}
                  className="w-full text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-9 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                  value={data.businessName}
                  onChange={(e) => setData({ ...data, businessName: e.target.value })}
                />
                <div className="absolute right-2">
                  <VoiceInputButton
                    lang={docLang}
                    onTranscript={(txt) => setData({ ...data, businessName: txt })}
                  />
                </div>
              </div>

              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder={docLang === "bn" ? "মোবাইল নম্বর" : "Phone Number"}
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                  value={data.phone}
                  onChange={(e) => setData({ ...data, phone: e.target.value })}
                />
                <div className="absolute right-1">
                  <VoiceInputButton
                    lang={docLang}
                    onTranscript={(txt) => setData({ ...data, phone: txt })}
                  />
                </div>
              </div>

              <div>
                <input
                  type="text"
                  placeholder={docLang === "bn" ? "মেমো নং" : "Invoice #"}
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                  value={data.invoiceNumber}
                  onChange={(e) => setData({ ...data, invoiceNumber: e.target.value })}
                />
              </div>

              <div className="col-span-2 relative flex items-center">
                <input
                  type="text"
                  placeholder={docLang === "bn" ? "দোকানের ঠিকানা / লোকেশন" : "Shop Address / Location"}
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-9 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                  value={data.address}
                  onChange={(e) => setData({ ...data, address: e.target.value })}
                />
                <div className="absolute right-2">
                  <VoiceInputButton
                    lang={docLang}
                    onTranscript={(txt) => setData({ ...data, address: txt })}
                  />
                </div>
              </div>

              <div className="col-span-2 flex flex-wrap items-center gap-2">
                <label className="cursor-pointer flex items-center gap-1.5 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 transition">
                  <Upload className="w-3.5 h-3.5" />
                  {docLang === "bn" ? "লোগো আপলোড" : "Upload Shop Logo"}
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

          {/* 2. Customer / Client Details */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              {docLang === "bn" ? "২. কাস্টমার / ক্রেতার বিবরণ" : "2. Customer / Client Details"}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder={docLang === "bn" ? "কাস্টমারের নাম" : "Customer Name"}
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                  value={data.customerName}
                  onChange={(e) => setData({ ...data, customerName: e.target.value })}
                />
                <div className="absolute right-1">
                  <VoiceInputButton
                    lang={docLang}
                    onTranscript={(txt) => setData({ ...data, customerName: txt })}
                  />
                </div>
              </div>

              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder={docLang === "bn" ? "কাস্টমারের ফোন" : "Customer Phone"}
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                  value={data.customerPhone}
                  onChange={(e) => setData({ ...data, customerPhone: e.target.value })}
                />
                <div className="absolute right-1">
                  <VoiceInputButton
                    lang={docLang}
                    onTranscript={(txt) => setData({ ...data, customerPhone: txt })}
                  />
                </div>
              </div>

              <div className="col-span-2 relative flex items-center">
                <input
                  type="text"
                  placeholder={docLang === "bn" ? "ডেলিভারি ঠিকানা (জেলা, থানা, বাসা)" : "Delivery Address"}
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-9 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                  value={data.customerAddress}
                  onChange={(e) => setData({ ...data, customerAddress: e.target.value })}
                />
                <div className="absolute right-2">
                  <VoiceInputButton
                    lang={docLang}
                    onTranscript={(txt) => setData({ ...data, customerAddress: txt })}
                  />
                </div>
              </div>

              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder={
                    docLang === "bn" ? "কুরিয়ার (যেমন: Steadfast/Pathao)" : "Courier Partner"
                  }
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                  value={data.courierPartner}
                  onChange={(e) => setData({ ...data, courierPartner: e.target.value })}
                />
                <div className="absolute right-1">
                  <VoiceInputButton
                    lang={docLang}
                    onTranscript={(txt) => setData({ ...data, courierPartner: txt })}
                  />
                </div>
              </div>

              <div>
                <input
                  type="text"
                  placeholder={docLang === "bn" ? "তারিখ (যেমন: 11/11/2026)" : "Date"}
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                  value={data.date}
                  onChange={(e) => setData({ ...data, date: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* 3. Items & Pricing */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {docLang === "bn" ? "৩. পণ্যের বিবরণ ও মূল্য তালিকা" : "3. Items & Pricing"}
              </label>
              <button
                onClick={handleAddItem}
                className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> {docLang === "bn" ? "+ পণ্য যোগ করুন" : "+ Add Item"}
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {itemsList.map((item: InvoiceItem, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex-1 relative flex items-center">
                    <input
                      type="text"
                      placeholder={docLang === "bn" ? "পণ্যের নাম" : "Item name"}
                      className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1.5 pr-7 text-slate-900 dark:text-white focus:outline-none"
                      value={item.name}
                      onChange={(e) => handleItemChange(idx, "name", e.target.value)}
                    />
                    <div className="absolute right-1">
                      <VoiceInputButton
                        lang={docLang}
                        onTranscript={(txt) => handleItemChange(idx, "name", txt)}
                      />
                    </div>
                  </div>

                  <input
                    type="number"
                    placeholder="Qty"
                    className="w-14 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1.5 focus:outline-none text-center text-slate-900 dark:text-white"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(idx, "quantity", Number(e.target.value))}
                  />

                  <input
                    type="number"
                    placeholder="Price"
                    className="w-20 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1.5 focus:outline-none text-right text-slate-900 dark:text-white"
                    value={item.price}
                    onChange={(e) => handleItemChange(idx, "price", Number(e.target.value))}
                  />

                  <button
                    onClick={() => handleRemoveItem(idx)}
                    className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                    title="Remove Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2">
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">
                  {docLang === "bn" ? "ডেলিভারি চার্জ" : "Delivery Fee"}
                </span>
                <input
                  type="number"
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded px-2 py-1.5 focus:outline-none"
                  value={data.deliveryCharge}
                  onChange={(e) => setData({ ...data, deliveryCharge: e.target.value })}
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">
                  {docLang === "bn" ? "ডিসকাউন্ট" : "Discount"}
                </span>
                <input
                  type="number"
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded px-2 py-1.5 focus:outline-none"
                  value={data.discount}
                  onChange={(e) => setData({ ...data, discount: e.target.value })}
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">
                  {docLang === "bn" ? "অগ্রিম পেমেন্ট" : "Advance Paid"}
                </span>
                <input
                  type="number"
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded px-2 py-1.5 focus:outline-none"
                  value={data.paidAmount}
                  onChange={(e) => setData({ ...data, paidAmount: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <button
              onClick={handlePrint}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-xs transition text-xs sm:text-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              {docLang === "bn" ? "প্রিন্ট করুন / PDF ডাউনলোড" : "Print / Save as PDF"}
            </button>

            <button
              onClick={handleSaveToProfile}
              className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium py-2.5 rounded-xl transition text-xs cursor-pointer"
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
                    ? "পরবর্তী ব্যবহারের জন্য শপ সেভ রাখুন"
                    : "Save Brand Preset for Next Time"}
                </>
              )}
            </button>
          </div>

          {/* In-sidebar AdSense Ad (Hidden when disabled) */}
          <AdSenseSlot slotId="editor-sidebar-slot" format="rectangle" label="Sponsored Partner" />
        </div>

        {/* RIGHT COLUMN: Live Printable A4 Canvas */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3 print:hidden">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {docLang === "bn" ? "A4 লাইভ প্রিন্ট প্রিভিউ (বাংলা)" : "A4 Pixel-Perfect Live Preview (English)"}
            </div>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              {docLang === "bn" ? "সরাসরি প্রিন্ট" : "Direct Download"}
            </button>
          </div>

          {/* ACTUAL PRINTABLE SHEET (Clean White A4 Page) */}
          <div
            ref={printRef}
            id="printable-document"
            className="w-full max-w-[210mm] min-h-[297mm] bg-white text-gray-900 p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-200 print:border-none print:shadow-none print:p-0 print:m-0 print:w-full print:max-w-none text-xs flex flex-col justify-between"
          >
            <div>
              {/* Header: Brand & Document Number */}
              <div className="flex justify-between items-start border-b-2 border-gray-900 pb-6">
                <div className="space-y-1">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="h-14 object-contain mb-2" />
                  ) : (
                    <h1 className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 uppercase">
                      {data.businessName || (docLang === "bn" ? "আপনার দোকানের নাম" : "Your Shop Name")}
                    </h1>
                  )}
                  <p className="text-xs text-gray-600 font-medium">{data.tagline}</p>
                  <p className="text-xs text-gray-500">{data.address}</p>
                  <p className="text-xs text-gray-500">
                    {docLang === "bn" ? "মোবাইল:" : "Phone:"} {data.phone}
                  </p>
                </div>

                <div className="text-right space-y-1">
                  <span className="inline-block bg-gray-900 text-white font-black tracking-widest text-xs sm:text-sm px-4 py-1.5 uppercase rounded-sm">
                    {docLang === "bn" ? "ক্যাশ মেমো" : "CASH MEMO"}
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

              {/* Bill To / Recipient Info */}
              <div className="grid grid-cols-2 gap-4 my-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-1">
                    {docLang === "bn" ? "ক্রেতার বিবরণ / কাস্টমার:" : "Billed To / Customer:"}
                  </span>
                  <h3 className="text-sm font-bold text-gray-900">
                    {data.customerName || (docLang === "bn" ? "ক্রেতার নাম" : "Customer Name")}
                  </h3>
                  <p className="text-xs text-gray-600">{data.customerPhone}</p>
                  <p className="text-xs text-gray-600 mt-1">{data.customerAddress}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-1">
                    {docLang === "bn" ? "পেমেন্ট অবস্থা:" : "Payment Status:"}
                  </span>
                  <span
                    className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${
                      due <= 0 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {due <= 0
                      ? docLang === "bn"
                        ? "সম্পূর্ণ পরিশোধিত"
                        : "PAID IN FULL"
                      : docLang === "bn"
                      ? `বাকি (COD): ${data.currency} ${due.toLocaleString()}`
                      : `COD DUE: ${data.currency} ${due.toLocaleString()}`}
                  </span>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left border-collapse my-6">
                <thead>
                  <tr className="border-b border-gray-900 text-gray-900 uppercase text-[10px] font-bold">
                    <th className="py-2.5 w-10">{docLang === "bn" ? "নং" : "#"}</th>
                    <th className="py-2.5">{docLang === "bn" ? "পণ্যের বিবরণ" : "Item Description"}</th>
                    <th className="py-2.5 text-center w-20">{docLang === "bn" ? "পরিমাণ" : "Qty"}</th>
                    <th className="py-2.5 text-right w-28">{docLang === "bn" ? "দর (টাকা)" : "Unit Price"}</th>
                    <th className="py-2.5 text-right w-32">{docLang === "bn" ? "মোট টাকা" : "Total"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {itemsList.map((item: InvoiceItem, idx: number) => (
                    <tr key={idx} className="hover:bg-gray-50/50">
                      <td className="py-3 text-gray-400 font-medium">{idx + 1}</td>
                      <td className="py-3 font-semibold text-gray-800">{item.name}</td>
                      <td className="py-3 text-center text-gray-700">{item.quantity}</td>
                      <td className="py-3 text-right text-gray-700">
                        {data.currency} {Number(item.price).toLocaleString()}
                      </td>
                      <td className="py-3 text-right font-bold text-gray-900">
                        {data.currency} {(item.quantity * item.price).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Calculations & Words Breakdown */}
              <div className="grid grid-cols-12 gap-6 pt-4 border-t border-gray-300">
                <div className="col-span-7 space-y-2">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">
                      {docLang === "bn" ? "কথায়:" : "In Words:"}
                    </span>
                    <p className="text-xs font-semibold text-gray-800 italic">
                      {docLang === "bn" ? numberToWordsBengali(grandTotal) : numberToWordsEnglish(grandTotal)}
                    </p>
                  </div>
                  {data.notes && (
                    <p className="text-[11px] text-gray-500 leading-relaxed mt-2">
                      <strong className="text-gray-700">
                        {docLang === "bn" ? "শর্তাবলী:" : "Terms & Notes:"}
                      </strong>{" "}
                      {data.notes}
                    </p>
                  )}
                </div>

                <div className="col-span-5 space-y-2 text-right">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>{docLang === "bn" ? "উপমোট:" : "Subtotal:"}</span>
                    <span className="font-semibold">
                      {data.currency} {subtotal.toLocaleString()}
                    </span>
                  </div>
                  {delivery > 0 && (
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{docLang === "bn" ? "ডেলিভারি চার্জ:" : "Delivery Charge:"}</span>
                      <span>
                        +{data.currency} {delivery.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {discount > 0 && (
                    <div className="flex justify-between text-xs text-emerald-600">
                      <span>{docLang === "bn" ? "বিশেষ ছাড়:" : "Special Discount:"}</span>
                      <span>
                        -{data.currency} {discount.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-black border-t-2 border-gray-900 pt-2 text-gray-900">
                    <span>{docLang === "bn" ? "সর্বমোট বিল:" : "Grand Total:"}</span>
                    <span>
                      {data.currency} {grandTotal.toLocaleString()}
                    </span>
                  </div>
                  {paid > 0 && (
                    <div className="flex justify-between text-xs text-gray-600 pt-1">
                      <span>{docLang === "bn" ? "অগ্রিম জমা:" : "Advance Received:"}</span>
                      <span>
                        {data.currency} {paid.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs font-bold text-gray-800 pt-1">
                    <span>{docLang === "bn" ? "ডেলিভারির সময় প্রদেয়:" : "Net Due on Delivery:"}</span>
                    <span className="text-blue-700 font-black">
                      {data.currency} {due.toLocaleString()}
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
                    (docLang === "bn" ? "অনুমোদিত স্বাক্ষর" : "Authorized Signature")}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Banner AdSense */}
          <AdSenseSlot slotId="canvas-bottom-banner" format="horizontal" className="print:hidden" />
        </div>
      </div>
    </div>
  );
}
