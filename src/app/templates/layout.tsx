import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Document Templates Library - 60+ Cash Memos, Routines & Prescriptions",
  description:
    "Explore 60+ free printable document templates. Create Facebook shop cash memos, A4 class routines, school exam schedules, and doctor prescriptions with zero watermarks.",
  alternates: {
    canonical: "https://freedocforge.com/templates",
  },
  openGraph: {
    title: "Free Document Templates Library (60+ Formats) - FreeDocForge Studio",
    description:
      "Instant free templates for business, school, and healthcare. 100% Free forever, no registration, 1-click vector PDF and A4/POS 80mm print.",
    url: "https://freedocforge.com/templates",
    siteName: "FreeDocForge.com",
    locale: "en_US",
    alternateLocale: "bn_BD",
    type: "website",
    images: [
      {
        url: "https://freedocforge.com/og-preview.png",
        width: 1200,
        height: 630,
        alt: "FreeDocForge Templates Library",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Document Templates Library (60+ Formats) - FreeDocForge Studio",
    description: "Instant free templates for business, school, and healthcare with dual English & বাংলা support.",
    images: ["https://freedocforge.com/og-preview.png"],
  },
};

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
