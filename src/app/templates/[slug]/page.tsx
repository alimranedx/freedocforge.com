import React from "react";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InvoiceEditor from "@/components/InvoiceEditor";
import AdSenseSlot from "@/components/AdSenseSlot";
import { INITIAL_TEMPLATES } from "@/lib/templates";

export function generateStaticParams() {
  return INITIAL_TEMPLATES.map((t) => ({ slug: t.slug }));
}

export default async function TemplatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const template = INITIAL_TEMPLATES.find((t) => t.slug === slug);

  if (!template) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumb & Title */}
        <div className="mb-6 print:hidden">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <span>Templates</span>
            <span>/</span>
            <span className="font-semibold text-blue-600">{template.category}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{template.title}</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">{template.description}</p>
        </div>

        {/* Top Header AdSense */}
        <AdSenseSlot slotId="template-top-ad" format="horizontal" className="print:hidden" />

        {/* The Core Interactive Editor Component */}
        <InvoiceEditor initialData={template.defaultData} />
      </main>

      <Footer />
    </div>
  );
}
