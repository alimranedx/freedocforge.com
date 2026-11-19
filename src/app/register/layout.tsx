import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Free Merchant Account - FreeDocForge",
  description: "Create a free merchant account on FreeDocForge to save your organization letterhead, logo, and document history.",
  alternates: {
    canonical: "https://freedocforge.com/register",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
