import { TemplateDefinition } from "@/lib/templates";

export interface FAQItem {
  questionEn: string;
  questionBn: string;
  answerEn: string;
  answerBn: string;
}

/**
 * Canonical production domain for Schema.org structured data, sitemaps, and search engines.
 * Must be a stable constant across both SSR and client hydration to prevent React hydration mismatch.
 */
export const SITE_URL = "https://freedocforge.com";

/**
 * Schema.org WebSite structured data with SearchAction
 */
export function getWebsiteSchema(baseUrl: string = SITE_URL) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "FreeDocForge.com",
    alternateName: "FreeDocForge Free Printable & Smart Document Studio",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/templates?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Schema.org WebApplication structured data
 */
export function getWebApplicationSchema(baseUrl: string = SITE_URL) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "FreeDocForge.com Smart Document Studio",
    url: baseUrl,
    description:
      "100% Free instant document and printable generator. Create Facebook shop invoices, cash memos in BDT (৳), class routines, exam schedules, doctor prescriptions, and POS receipts without login or watermarks.",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Printable Document Publishing & Invoicing",
    operatingSystem: "All (Web Browser, Chrome, Safari, Firefox, Edge, Android, iOS)",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    softwareVersion: "2.4.0",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BDT",
      availability: "https://schema.org/InStock",
    },
    featureList: [
      "100% Free Instant Document Generation",
      "Zero Watermarks & No Mandatory Registration",
      "Native Dual English & Bengali (বাংলা) Support",
      "Bengali Speech-to-Text Voice Typing",
      "ISO 216 Standard A4 & 80mm POS Thermal Receipt Sizing",
      "Direct 1-Click Vector PDF Download & High-DPI JPG Export",
      "Client-Side Document Privacy (Zero Cloud Storage of Customer PII for Guests)",
      "Instant WhatsApp Document Sharing",
    ],
  };
}

/**
 * Schema.org Organization structured data
 */
export function getOrganizationSchema(baseUrl: string = SITE_URL) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "FreeDocForge.com",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description:
      "Dedicated digital document publishing studio engineered to eliminate costly software subscriptions and formatting headaches for businesses, schools, and healthcare providers.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dhaka",
      addressCountry: "BD",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: "support@freedocforge.com",
      availableLanguage: ["English", "Bengali"],
    },
  };
}

/**
 * Schema.org BreadcrumbList structured data
 */
export function getBreadcrumbListSchema(
  items: { name: string; url: string }[],
  baseUrl: string = SITE_URL
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${baseUrl}${item.url}`,
    })),
  };
}

/**
 * Schema.org SoftwareApplication structured data for a specific document template
 */
export function getTemplateSoftwareAppSchema(
  template: TemplateDefinition,
  baseUrl: string = SITE_URL
) {
  let appCategory = "BusinessApplication";
  if (template.category === "Healthcare") appCategory = "HealthApplication";
  if (template.category === "Education") appCategory = "EducationalApplication";

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${template.title} - FreeDocForge Studio`,
    url: `${baseUrl}/templates/${template.slug}`,
    description: template.description,
    applicationCategory: appCategory,
    operatingSystem: "All (Web Browser, Chrome, Safari, Edge, Firefox)",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BDT",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "128",
      bestRating: "5",
      worstRating: "1",
    },
  };
}

/**
 * Schema.org FAQPage structured data
 */
export function getFaqPageSchema(faqs: FAQItem[], lang: "en" | "bn" = "en") {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: lang === "bn" ? faq.questionBn : faq.questionEn,
      acceptedAnswer: {
        "@type": "Answer",
        text: lang === "bn" ? faq.answerBn : faq.answerEn,
      },
    })),
  };
}
