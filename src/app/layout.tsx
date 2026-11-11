import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { GlobalSettingsProvider } from "@/context/GlobalSettingsContext";

const siteUrl = process.env.NEXTAUTH_URL || "https://freedocforge.com";
const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
const enableAds = process.env.NEXT_PUBLIC_ENABLE_ADS === "true";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "FreeDocForge.com - Free Smart Business Invoices, School Marksheets & Printables",
    template: "%s | FreeDocForge.com",
  },
  description:
    "100% Free instant document and printable generator. Create Facebook shop invoices, cash memos in BDT (৳), school marksheets, doctor prescriptions, and POS receipts without login or watermarks.",
  keywords: [
    "free invoice generator",
    "f-commerce cash memo",
    "bangladesh shop bill maker",
    "school marksheet generator",
    "doctor prescription pad maker",
    "thermal pos receipt print",
    "freedocforge",
    "free printable templates",
    "bangla invoice generator",
  ],
  authors: [{ name: "FreeDocForge Studio" }],
  creator: "FreeDocForge.com",
  publisher: "FreeDocForge.com",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "bn_BD",
    url: siteUrl,
    title: "FreeDocForge.com - Free Printable & Smart Document Studio",
    description:
      "Generate, customize, and print high-quality cash memos, invoices, school marksheets, and prescriptions in seconds with dual-language support and voice typing.",
    siteName: "FreeDocForge.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "FreeDocForge.com - Free Printable Document Studio",
    description:
      "Instant free invoices, medical prescription pads, and academic marksheets with dual English & বাংলা support.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        {/* Google AdSense Verification Script */}
        {enableAds && adsenseClientId && !adsenseClientId.includes("placeholder") && (
          <Script
            id="google-adsense"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body
        className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200"
        suppressHydrationWarning
      >
        <GlobalSettingsProvider>{children}</GlobalSettingsProvider>
      </body>
    </html>
  );
}
