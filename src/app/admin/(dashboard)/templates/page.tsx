"use client";

import React, { useState } from "react";
import {
  Layers,
  Plus,
  Eye,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Globe,
  Trash2,
  X,
  Save,
  Check,
} from "lucide-react";
import { INITIAL_TEMPLATES, TemplateDefinition } from "@/lib/templates";

export default function AdminTemplatesManagerPage() {
  const [templates, setTemplates] = useState<TemplateDefinition[]>([...INITIAL_TEMPLATES]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"en" | "bn">("en");
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [validationError, setValidationError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Form State with mandatory EN and BN fields
  const [formData, setFormData] = useState({
    slug: "",
    category: "Business",
    paperSize: "A4",
    // English Version
    en_title: "",
    en_description: "",
    en_signatory: "Authorized Signature",
    en_currency: "৳",
    // Bangla Version (Mandatory!)
    bn_title: "",
    bn_description: "",
    bn_signatory: "অনুমোদিত স্বাক্ষর",
    bn_currency: "৳",
  });

  const handleOpenAddModal = () => {
    setEditingTemplate(null);
    setValidationError("");
    setFormData({
      slug: "",
      category: "Business",
      paperSize: "A4",
      en_title: "",
      en_description: "",
      en_signatory: "Authorized Signature",
      en_currency: "৳",
      bn_title: "",
      bn_description: "",
      bn_signatory: "অনুমোদিত স্বাক্ষর",
      bn_currency: "৳",
    });
    setActiveTab("en");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (t: TemplateDefinition) => {
    setEditingTemplate(t);
    setValidationError("");
    setFormData({
      slug: t.slug,
      category: t.category,
      paperSize: t.paperSize,
      en_title: t.locales?.en?.title || t.title,
      en_description: t.locales?.en?.description || t.description,
      en_signatory: t.locales?.en?.defaultData?.signatoryTitle || "Authorized Signature",
      en_currency: t.locales?.en?.defaultData?.currency || "৳",
      bn_title: t.locales?.bn?.title || "",
      bn_description: t.locales?.bn?.description || "",
      bn_signatory: t.locales?.bn?.defaultData?.signatoryTitle || "অনুমোদিত স্বাক্ষর",
      bn_currency: t.locales?.bn?.defaultData?.currency || "৳",
    });
    setActiveTab("en");
    setIsModalOpen(true);
  };

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    // 1. Validate English fields
    if (!formData.slug || !formData.en_title || !formData.en_description) {
      setActiveTab("en");
      setValidationError("Mandatory Requirement: English Title, Slug, and Description must be provided.");
      return;
    }

    // 2. Strict Requirement: Validate Bangla fields
    if (!formData.bn_title || !formData.bn_description) {
      setActiveTab("bn");
      setValidationError("Mandatory Requirement: You MUST provide the Bangla (বাংলা) version of this template as well before publishing!");
      return;
    }

    const newTemplate: TemplateDefinition = {
      id: editingTemplate ? editingTemplate.id : `template-${Date.now()}`,
      slug: formData.slug.toLowerCase().replace(/\s+/g, "-"),
      title: formData.en_title,
      description: formData.en_description,
      category: formData.category as any,
      paperSize: formData.paperSize as any,
      badge: "Dual Locale Ready",
      defaultData: {
        businessName: "Sample Business",
        invoiceNumber: "INV-001",
        date: "2026-11-11",
        currency: formData.en_currency,
        items: [{ name: "Sample Service", quantity: 1, price: 1000 }],
        signatoryTitle: formData.en_signatory,
      },
      locales: {
        en: {
          title: formData.en_title,
          description: formData.en_description,
          badge: "English Edition",
          defaultData: {
            businessName: "Sample Business",
            invoiceNumber: "INV-001",
            date: "2026-11-11",
            currency: formData.en_currency,
            items: [{ name: "Sample Service", quantity: 1, price: 1000 }],
            signatoryTitle: formData.en_signatory,
          },
        },
        bn: {
          title: formData.bn_title,
          description: formData.bn_description,
          badge: "বাংলা সংস্করণ",
          defaultData: {
            businessName: "নমুনা প্রতিষ্ঠান",
            invoiceNumber: "মেমো-০০১",
            date: "১১/১১/২০২৬",
            currency: formData.bn_currency,
            items: [{ name: "নমুনা পণ্য বা সেবা", quantity: 1, price: 1000 }],
            signatoryTitle: formData.bn_signatory,
          },
        },
      },
    };

    if (editingTemplate) {
      setTemplates(templates.map((t) => (t.id === editingTemplate.id ? newTemplate : t)));
      setSuccessMsg("Template updated successfully with verified English & Bangla locales!");
    } else {
      setTemplates([newTemplate, ...templates]);
      setSuccessMsg("New template published successfully with verified English & Bangla locales!");
    }

    setIsModalOpen(false);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  return (
    <div className="space-y-8 max-w-7xl font-sans">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h2 className="text-xl font-black uppercase tracking-wider text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-red-500" />
            Template CMS & Dual-Locale Engine
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Every template on FreeDocForge strictly requires both an <strong>English Edition</strong> and a <strong>Bangla (বাংলা) Edition</strong>.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-md cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Dual-Locale Template
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-950/60 border border-emerald-800 text-emerald-300 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* TEMPLATE LIST TABLE */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead>
              <tr className="border-b border-zinc-800 text-[10px] uppercase font-mono text-zinc-500">
                <th className="pb-3">Template Name</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Format</th>
                <th className="pb-3">Locale Compliance</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono">
              {templates.map((t) => (
                <tr key={t.id} className="hover:bg-zinc-800/40 transition">
                  <td className="py-4 font-sans">
                    <div className="font-bold text-white text-sm">{t.locales?.en?.title || t.title}</div>
                    <div className="text-[11px] text-zinc-400 mt-0.5 font-normal">
                      বাংলা: <span className="text-zinc-300 font-semibold">{t.locales?.bn?.title || "বাংলা প্রস্তুত"}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded text-[10px]">
                      {t.category}
                    </span>
                  </td>
                  <td className="py-4 text-zinc-400">{t.paperSize}</td>
                  <td className="py-4">
                    <span className="inline-flex items-center gap-1.5 text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 px-2.5 py-1 rounded-md font-mono">
                      <Check className="w-3 h-3 text-emerald-400" />
                      EN + BN Active
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-3 font-sans">
                      <button
                        onClick={() => handleOpenEditModal(t)}
                        className="text-zinc-400 hover:text-white inline-flex items-center gap-1 text-xs transition cursor-pointer"
                        title="Edit Template & Bangla Version"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <a
                        href={`/templates/${t.slug}`}
                        target="_blank"
                        className="text-red-400 hover:text-red-300 inline-flex items-center gap-1 text-xs transition"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DUAL-LOCALE CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-red-500" />
                  {editingTemplate ? "Modify Template Locales" : "Add New Dual-Locale Template"}
                </h3>
                <p className="text-[11px] text-zinc-400">
                  You must fill out both the English and Bangla editions before saving.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-500 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {validationError && (
              <div className="bg-red-950/60 border border-red-800 text-red-300 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{validationError}</span>
              </div>
            )}

            <form onSubmit={handleSaveTemplate} className="space-y-4">
              {/* Meta Settings */}
              <div className="grid grid-cols-3 gap-3 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">
                    Slug (URL identifier)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. madrasah-receipt"
                    className="w-full text-xs bg-zinc-800 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">
                    Category
                  </label>
                  <select
                    className="w-full text-xs bg-zinc-800 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-white focus:outline-none"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Business">Business</option>
                    <option value="Education">Education</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Printables">Printables</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">
                    Paper Format
                  </label>
                  <select
                    className="w-full text-xs bg-zinc-800 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-white focus:outline-none"
                    value={formData.paperSize}
                    onChange={(e) => setFormData({ ...formData, paperSize: e.target.value })}
                  >
                    <option value="A4">A4 Standard Sheet</option>
                    <option value="POS_80MM">80mm POS Thermal Roll</option>
                  </select>
                </div>
              </div>

              {/* DUAL LOCALE TABS */}
              <div className="flex border-b border-zinc-800">
                <button
                  type="button"
                  onClick={() => setActiveTab("en")}
                  className={`flex-1 py-2 text-xs font-bold transition flex items-center justify-center gap-1.5 border-b-2 cursor-pointer ${
                    activeTab === "en"
                      ? "border-red-500 text-white bg-zinc-800/40"
                      : "border-transparent text-zinc-400 hover:text-white"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" /> 1. English Version (Required)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("bn")}
                  className={`flex-1 py-2 text-xs font-bold transition flex items-center justify-center gap-1.5 border-b-2 cursor-pointer ${
                    activeTab === "bn"
                      ? "border-red-500 text-white bg-zinc-800/40"
                      : "border-transparent text-zinc-400 hover:text-white"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-400" /> 2. বাংলা সংস্করণ (Mandatory!)
                </button>
              </div>

              {/* TAB 1: ENGLISH FIELDS */}
              {activeTab === "en" && (
                <div className="space-y-3 p-1">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      English Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. School Student Fee Receipt"
                      className="w-full text-xs bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none"
                      value={formData.en_title}
                      onChange={(e) => setFormData({ ...formData, en_title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      English Description
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Detailed explanation of the template for English users..."
                      className="w-full text-xs bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none"
                      value={formData.en_description}
                      onChange={(e) => setFormData({ ...formData, en_description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Signatory Label (EN)
                      </label>
                      <input
                        type="text"
                        className="w-full text-xs bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none"
                        value={formData.en_signatory}
                        onChange={(e) => setFormData({ ...formData, en_signatory: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Currency
                      </label>
                      <input
                        type="text"
                        className="w-full text-xs bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none"
                        value={formData.en_currency}
                        onChange={(e) => setFormData({ ...formData, en_currency: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: BANGLA FIELDS (MANDATORY) */}
              {activeTab === "bn" && (
                <div className="space-y-3 p-1">
                  <div>
                    <label className="block text-xs font-semibold text-emerald-400 mb-1 flex items-center justify-between">
                      <span>বাংলা শিরোনাম (Bangla Title - Mandatory)</span>
                      <span className="text-[10px] text-zinc-400 font-mono">*বাধ্যতামূলক</span>
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: বিদ্যালয়ের মাসিক বেতন রসিদ"
                      className="w-full text-xs bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none"
                      value={formData.bn_title}
                      onChange={(e) => setFormData({ ...formData, bn_title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-emerald-400 mb-1 flex items-center justify-between">
                      <span>বাংলা বিবরণ (Bangla Description - Mandatory)</span>
                      <span className="text-[10px] text-zinc-400 font-mono">*বাধ্যতামূলক</span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder="টেমপ্লেটটির ব্যবহার ও সুবিধা সম্পর্কে বাংলায় লিখুন..."
                      className="w-full text-xs bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none"
                      value={formData.bn_description}
                      onChange={(e) => setFormData({ ...formData, bn_description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-emerald-400 mb-1">
                        স্বাক্ষর পদবি (BN Signatory Title)
                      </label>
                      <input
                        type="text"
                        className="w-full text-xs bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none"
                        value={formData.bn_signatory}
                        onChange={(e) => setFormData({ ...formData, bn_signatory: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-emerald-400 mb-1">
                        মুদ্রা প্রতীক (Currency)
                      </label>
                      <input
                        type="text"
                        className="w-full text-xs bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none"
                        value={formData.bn_currency}
                        onChange={(e) => setFormData({ ...formData, bn_currency: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                <span className="text-[11px] text-zinc-500 font-mono">
                  *Both EN & BN must be filled before saving.
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="text-xs text-zinc-400 hover:text-white px-3 py-2 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition shadow-md cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Both Locales & Publish
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
