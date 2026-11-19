import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - FreeDocForge Account",
  description: "Sign in to your FreeDocForge merchant account to access saved presets and document history.",
  alternates: {
    canonical: "https://freedocforge.com/login",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
