import React from "react";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InvoiceEditor from "@/components/InvoiceEditor";
import AdSenseSlot from "@/components/AdSenseSlot";
import TemplateLanguageBar from "@/components/TemplateLanguageBar";
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
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumb, Title & Dedicated Language Switcher */}
        <TemplateLanguageBar
          category={template.category}
          title={template.title}
          description={template.description}
        />

        {/* Top Header AdSense */}
        <AdSenseSlot slotId="template-top-ad" format="horizontal" className="print:hidden" />

        {/* The Core Interactive Editor Component */}
        <InvoiceEditor initialData={template.defaultData} />
      </main>

      <Footer />
    </div>
  );
}
