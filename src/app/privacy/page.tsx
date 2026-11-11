import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 prose prose-slate">
        <h1 className="text-3xl font-black text-slate-900 mb-6">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-6">Last updated: November 2026</p>

        <section className="space-y-4 text-sm leading-relaxed">
          <p>
            At <strong>FreeDocForge.com</strong>, the privacy of our visitors and registered shop owners is of extreme importance to us. This Privacy Policy document outlines the types of personal information that is received and collected by FreeDocForge.com and how it is used.
          </p>

          <h2 className="text-lg font-bold text-slate-900 mt-6">Client-Side Document Processing</h2>
          <p>
            All document customization, PDF compilation, and financial calculations take place directly in your browser. We do not store or transmit your customer's personal data or invoices on external servers unless you explicitly sign in and save them to your account.
          </p>

          <h2 className="text-lg font-bold text-slate-900 mt-6">Google AdSense & Cookies</h2>
          <p>
            Google, as a third-party vendor, uses cookies to serve ads on FreeDocForge.com. Google's use of the DART cookie enables it to serve ads to users based on their visit to FreeDocForge.com and other sites on the Internet. Users may opt out of the use of the DART cookie by visiting the Google ad and content network privacy policy.
          </p>

          <h2 className="text-lg font-bold text-slate-900 mt-6">Third-Party Privacy Policies</h2>
          <p>
            You should consult the respective privacy policies of these third-party ad servers for more detailed information on their practices as well as for instructions about how to opt-out of certain practices.
          </p>

          <h2 className="text-lg font-bold text-slate-900 mt-6">Contact Us</h2>
          <p>
            If you require any more information or have any questions about our privacy policy, please feel free to contact us at support@freedocforge.com.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
