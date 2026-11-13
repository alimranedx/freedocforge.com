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
import { INITIAL_TEMPLATES, TemplateDefinition } from "@/lib/templates";
import { prisma } from "@/lib/prisma";

async function getTemplateBySlug(slug: string): Promise<TemplateDefinition | null> {
  const systemTemplate = INITIAL_TEMPLATES.find((t) => t.slug === slug);
  if (systemTemplate) return systemTemplate;

  try {
    const dbTemplate = await prisma.template.findUnique({
      where: { slug },
      include: { category: true },
    });

    if (dbTemplate) {
      const fieldSchema = (dbTemplate.fieldSchema as any) || {};
      return {
        id: dbTemplate.id,
        slug: dbTemplate.slug,
        title: dbTemplate.title,
        description: dbTemplate.description || "",
        category: (dbTemplate.category?.name as any) || "Business",
        paperSize: (dbTemplate.paperSize as any) || "A4",
        badge: dbTemplate.isFeatured ? "Featured" : "Custom Template",
        defaultData: fieldSchema.locales?.en?.defaultData || fieldSchema.defaultData || {
          businessName: dbTemplate.title,
          currency: "৳",
          items: [{ name: "Sample Service or Product", quantity: 1, price: 100 }],
        },
        locales: {
          en: fieldSchema.locales?.en || {
            title: dbTemplate.title,
            description: dbTemplate.description || "",
            badge: "English Edition",
            defaultData: {
              businessName: dbTemplate.title,
              currency: "৳",
              items: [{ name: "Sample Service or Product", quantity: 1, price: 100 }],
            },
          },
          bn: fieldSchema.locales?.bn || {
            title: dbTemplate.title,
            description: dbTemplate.description || "",
            badge: "বাংলা সংস্করণ",
            defaultData: {
              businessName: dbTemplate.title,
              currency: "৳",
              items: [{ name: "নমুনা পণ্য বা সেবা", quantity: 1, price: 100 }],
            },
          },
        },
      };
    }
  } catch (err) {
    // Database offline fallback during static pre-rendering
  }

  return null;
}

export function generateStaticParams() {
  return INITIAL_TEMPLATES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const template = await getTemplateBySlug(slug);

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
  const template = await getTemplateBySlug(slug);

  if (!template) {
    notFound();
  }

  // Production-Grade Specialized Editor Dispatcher:
  // 1. Specialized Education & Academic Documents (Class Routines, Exam Schedules, Marksheets, Admit Cards, Certificates, ID Cards)
  const isSchoolAcademic =
    template.category === "Education" ||
    slug.includes("routine") ||
    slug.includes("timetable") ||
    slug.includes("schedule") ||
    slug.includes("marksheet") ||
    slug.includes("result-sheet") ||
    slug.includes("admit-card") ||
    slug.includes("progress-report") ||
    slug.includes("certificate") ||
    slug.startsWith("school-") ||
    slug.startsWith("student-") ||
    slug.startsWith("highschool-") ||
    slug.startsWith("university-") ||
    slug.startsWith("kindergarten-") ||
    slug.startsWith("teacher-") ||
    slug.startsWith("private-tutor-") ||
    slug.startsWith("lab-practical-") ||
    slug.startsWith("online-class-");

  // 2. Specialized Medical Prescriptions, Clinical Tokens & Discharge Records (Clinical Rx, Non-Billing)
  const isMedicalClinical =
    !isSchoolAcademic &&
    (slug === "doctor-prescription" ||
      slug === "medical-appointment-token" ||
      slug === "medical-discharge-slip" ||
      slug === "dental-treatment-record" ||
      slug === "pediatric-vaccine-card" ||
      slug === "eye-prescription-pad" ||
      slug === "radiology-report-pad" ||
      slug === "hospital-admission-slip" ||
      (template.category === "Healthcare" &&
        !slug.includes("bill") &&
        !slug.includes("receipt") &&
        !slug.includes("money") &&
        !slug.includes("fee") &&
        !slug.includes("pharmacy") &&
        !slug.includes("ambulance")));

  // 3. Commercial Invoices, Receipts, and Healthcare Financial Receipts (Cash Memos, POS Slips, Diagnostic Bills, Pharmacy Memos)
  const isInvoiceBill = !isSchoolAcademic && !isMedicalClinical;

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
