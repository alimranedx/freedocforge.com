import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InvoiceEditor from "@/components/InvoiceEditor";
import MedicalPrescriptionEditor from "@/components/MedicalPrescriptionEditor";
import SchoolTemplateEditor from "@/components/SchoolTemplateEditor";
import AdSenseSlot from "@/components/AdSenseSlot";
import TemplateLanguageBar from "@/components/TemplateLanguageBar";
import { INITIAL_TEMPLATES } from "@/lib/templates";

export function generateStaticParams() {
  return INITIAL_TEMPLATES.map((t) => ({ slug: t.slug }));
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

  // Domain-Specific Specialized Editor Dispatcher
  const isMedical =
    template.category === "Healthcare" ||
    slug.startsWith("doctor-") ||
    slug.startsWith("medical-");

  const isSchool =
    template.category === "Education" || slug.startsWith("school-");

  return (
    <>
      {/* Breadcrumb, Title & Dedicated Language Switcher */}
      <TemplateLanguageBar
        category={template.category}
        title={template.title}
        description={template.description}
      />

      {/* Top Header AdSense (Hidden until approved) */}
      <AdSenseSlot slotId="template-top-ad" format="horizontal" className="print:hidden" />

      {/* Core Interactive Editor Component */}
      {isMedical ? (
        <MedicalPrescriptionEditor
          initialData={template.defaultData}
          locales={template.locales}
          templateSlug={template.slug}
        />
      ) : isSchool ? (
        <SchoolTemplateEditor
          initialData={template.defaultData}
          locales={template.locales}
          templateSlug={template.slug}
        />
      ) : (
        <InvoiceEditor
          initialData={template.defaultData}
          locales={template.locales}
        />
      )}
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
