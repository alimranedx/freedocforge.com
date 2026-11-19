import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy & Zero Cloud Storage Guarantee | FreeDocForge.com",
  description:
    "FreeDocForge.com privacy policy. Discover how our client-side document engine ensures your customer data and financial numbers never touch our servers.",
  alternates: {
    canonical: "https://freedocforge.com/privacy",
  },
  openGraph: {
    title: "Privacy Policy - Client-Side Data Protection Guarantee | FreeDocForge.com",
    description: "Learn how FreeDocForge protects user confidentiality through client-side browser document rendering.",
    url: "https://freedocforge.com/privacy",
    siteName: "FreeDocForge.com",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://freedocforge.com/og-preview.png",
        width: 1200,
        height: 630,
        alt: "FreeDocForge Privacy Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy & Zero Cloud Storage Guarantee | FreeDocForge.com",
    description: "Learn how FreeDocForge protects user confidentiality through client-side browser document rendering.",
    images: ["https://freedocforge.com/og-preview.png"],
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
