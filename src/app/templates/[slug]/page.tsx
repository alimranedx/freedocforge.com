import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InvoiceEditor from "@/components/InvoiceEditor";
import MedicalPrescriptionEditor from "@/components/MedicalPrescriptionEditor";
import SchoolTemplateEditor from "@/components/SchoolTemplateEditor";
import AdSenseSlot from "@/components/AdSenseSlot";
import TemplateLanguageBar from "@/components/TemplateLanguageBar";
import TemplateEditorialGuide from "@/components/TemplateEditorialGuide";
import { INITIAL_TEMPLATES } from "@/lib/templates";

export function generateStaticParams() {
  return INITIAL_TEMPLATES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const template = INITIAL_TEMPLATES.find((t) => t.slug === slug);

  if (!template) {
    return {
      title: "Template Not Found - FreeDocForge",
    };
  }

  const bnTitle = template.locales?.bn?.title || template.title;

  return {
    title: `${template.title} | ${bnTitle} (Free Printable)`,
    description: `${template.description} 100% Free instant customization, Bengali voice typing, and A4/POS 80mm print without watermarks.`,
    keywords: [
      template.title,
      bnTitle,
      `${template.category} template`,
      "free printable memo",
      "bangla bill maker",
      "freedocforge",
    ],
    openGraph: {
      title: `${template.title} - FreeDocForge Printable Studio`,
      description: template.description,
      type: "article",
    },
  };
}

async function TemplateContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const template = INITIAL_TEMPLATES.find((t) => t.slug === slug);

  if (!template) {
    notFound();
  }

  // Production-Grade Specialized Editor Dispatcher:
  // 1. Any template with itemized line items (products, services, diagnostic tests, goods) MUST use InvoiceEditor
  const isInvoiceBill =
    Array.isArray(template.defaultData?.items) ||
    slug === "medical-money-receipt" ||
    template.subCategory === "invoice" ||
    template.subCategory === "receipt" ||
    template.subCategory === "chalan" ||
    template.subCategory === "quotation" ||
    template.subCategory === "bill";

  // 2. Specialized Medical Prescriptions, Clinical Tokens & Discharge Records
  const isMedicalClinical =
    !isInvoiceBill &&
    (template.category === "Healthcare" ||
      slug.startsWith("doctor-") ||
      slug.startsWith("medical-") ||
      slug.startsWith("dental-") ||
      slug.startsWith("pediatric-") ||
      slug.startsWith("eye-") ||
      slug.startsWith("radiology-") ||
      slug.startsWith("hospital-") ||
      slug.startsWith("physiotherapy-"));

  // 3. Specialized Education & Academic Documents (Marksheets, Routines, Admit Cards, Certificates)
  const isSchoolAcademic =
    !isInvoiceBill &&
    (template.category === "Education" ||
      slug.startsWith("school-") ||
      slug.startsWith("coaching-") ||
      slug.startsWith("madrasah-") ||
      slug.startsWith("student-"));

  return (
    <>
      {/* Breadcrumb, Title & Dedicated Language Switcher */}
      <TemplateLanguageBar
        category={template.category}
        title={template.title}
        description={template.description}
        locales={template.locales}
      />

      {/* Top Header AdSense (Hidden until approved) */}
      <AdSenseSlot slotId="template-top-ad" format="horizontal" className="print:hidden" />

      {/* Core Interactive Editor Component */}
      {isInvoiceBill ? (
        <InvoiceEditor
          initialData={template.defaultData}
          locales={template.locales}
          templateSlug={template.slug}
        />
      ) : isMedicalClinical ? (
        <MedicalPrescriptionEditor
          initialData={template.defaultData}
          locales={template.locales}
          templateSlug={template.slug}
        />
      ) : isSchoolAcademic ? (
        <SchoolTemplateEditor
          initialData={template.defaultData}
          locales={template.locales}
          templateSlug={template.slug}
        />
      ) : (
        <InvoiceEditor
          initialData={template.defaultData}
          locales={template.locales}
          templateSlug={template.slug}
        />
      )}

      {/* Mid-Content AdSense Banner */}
      <AdSenseSlot slotId="template-guide-top-ad" format="horizontal" className="print:hidden my-6" />

      {/* 400+ Words Editorial Guide, FAQs & Schema.org Structured Data */}
      <TemplateEditorialGuide
        slug={template.slug}
        category={template.category}
        title={template.title}
        description={template.description}
        paperSize={template.paperSize}
      />
    </>
  );
}

export default function TemplatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
            </div>
          }
        >
          <TemplateContent params={params} />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
