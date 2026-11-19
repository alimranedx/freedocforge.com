import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - FreeDocForge Mission & Publishing Standards",
  description:
    "Learn about FreeDocForge.com, our mission to provide 100% free printable document tools without subscriptions, our ISO standards, and privacy guarantee.",
  alternates: {
    canonical: "https://freedocforge.com/about",
  },
  openGraph: {
    title: "About FreeDocForge.com - Free Printable & Smart Document Studio",
    description:
      "Dedicated digital document publishing studio engineered to eliminate costly software subscriptions and formatting headaches for businesses, schools, and clinics.",
    url: "https://freedocforge.com/about",
    siteName: "FreeDocForge.com",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://freedocforge.com/og-preview.png",
        width: 1200,
        height: 630,
        alt: "About FreeDocForge",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us - FreeDocForge Mission & Publishing Standards",
    description: "Learn about FreeDocForge.com, our mission to provide 100% free printable document tools.",
    images: ["https://freedocforge.com/og-preview.png"],
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
