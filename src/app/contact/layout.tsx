import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us & Support Hotline | FreeDocForge.com",
  description:
    "Get 24/7 support for FreeDocForge.com. Connect with our Dhaka headquarters via email or WhatsApp hotline for document and print assistance.",
  alternates: {
    canonical: "https://freedocforge.com/contact",
  },
  openGraph: {
    title: "Contact FreeDocForge Support & Assistance",
    description: "Get prompt technical support, report print issues, or propose new document template designs.",
    url: "https://freedocforge.com/contact",
    siteName: "FreeDocForge.com",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://freedocforge.com/og-preview.png",
        width: 1200,
        height: 630,
        alt: "Contact FreeDocForge",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us & Support Hotline | FreeDocForge.com",
    description: "Get prompt technical support or propose new document template designs.",
    images: ["https://freedocforge.com/og-preview.png"],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
