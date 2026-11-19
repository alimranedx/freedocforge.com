import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service & Free Use Policy | FreeDocForge.com",
  description:
    "Read the FreeDocForge.com terms of service. 100% free document creation, commercial use permissions, and zero liability printing guidelines.",
  alternates: {
    canonical: "https://freedocforge.com/terms",
  },
  openGraph: {
    title: "Terms of Service - FreeDocForge.com",
    description: "Guidelines, rights, and ethical usage terms for FreeDocForge free printable documents.",
    url: "https://freedocforge.com/terms",
    siteName: "FreeDocForge.com",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://freedocforge.com/og-preview.png",
        width: 1200,
        height: 630,
        alt: "FreeDocForge Terms of Service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service & Free Use Policy | FreeDocForge.com",
    description: "Read the FreeDocForge.com terms of service.",
    images: ["https://freedocforge.com/og-preview.png"],
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
