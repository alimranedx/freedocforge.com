import type { Metadata } from "next";
import "./globals.css";
import { GlobalSettingsProvider } from "@/context/GlobalSettingsContext";

export const metadata: Metadata = {
  title: "FreeDocForge.com - Free Smart Business Invoices, School Marksheets & Printables",
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
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body
        className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200"
        suppressHydrationWarning
      >
        <GlobalSettingsProvider>{children}</GlobalSettingsProvider>
      </body>
    </html>
  );
}
