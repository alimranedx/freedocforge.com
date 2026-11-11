import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 prose prose-slate">
        <h1 className="text-3xl font-black text-slate-900 mb-6">Terms of Service</h1>
        <p className="text-sm text-slate-500 mb-6">Last updated: November 2026</p>

        <section className="space-y-4 text-sm leading-relaxed">
          <p>
            Welcome to <strong>FreeDocForge.com</strong>. By accessing or using our website and smart document services, you agree to be bound by these Terms of Service.
          </p>

          <h2 className="text-lg font-bold text-slate-900 mt-6">Use of Templates & Free Tools</h2>
          <p>
            You are granted a worldwide, royalty-free license to generate, download, print, and distribute documents created using FreeDocForge.com for personal or commercial business purposes (such as issuing customer invoices, student marks, or medical prescriptions).
          </p>

          <h2 className="text-lg font-bold text-slate-900 mt-6">Prohibited Activities</h2>
          <p>
            You may not use our service to generate fraudulent, deceptive, or illegal documents, including counterfeit legal instruments, forged government certificates, or misleading financial statements.
          </p>

          <h2 className="text-lg font-bold text-slate-900 mt-6">Disclaimer of Warranties</h2>
          <p>
            The services and templates are provided "as is" without warranty of any kind. FreeDocForge.com does not provide certified legal, medical, or tax advice. Users are responsible for ensuring compliance with local laws.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
