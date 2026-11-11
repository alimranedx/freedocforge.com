"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800 print:hidden text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Description */}
        <div className="space-y-3 md:col-span-1">
          <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
            FreeDocForge<span className="text-blue-400 text-xs px-1.5 py-0.5 rounded bg-blue-900/50 font-bold">.com</span>
          </span>
          <p className="text-gray-400 text-xs leading-relaxed">
            100% Free Smart Printable & Business Document Studio. Customize invoices, school marksheets, prescriptions, and daily planners in seconds.
          </p>
          <div className="flex items-center gap-1 text-[11px] text-gray-400 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Client-side generation. Your data never leaves your computer.
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px]">Free Templates</h4>
          <ul className="space-y-2 text-gray-400">
            <li>
              <Link href="/templates/f-commerce-invoice" className="hover:text-white transition">
                F-Commerce Cash Memo (BD)
              </Link>
            </li>
            <li>
              <Link href="/templates/school-result-sheet" className="hover:text-white transition">
                School & Coaching Marksheet
              </Link>
            </li>
            <li>
              <Link href="/templates/doctor-prescription" className="hover:text-white transition">
                Doctor Prescription Pad
              </Link>
            </li>
            <li>
              <Link href="/templates/restaurant-pos-bill" className="hover:text-white transition">
                Restaurant 80mm Thermal Bill
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal & Policy (Crucial for AdSense) */}
        <div>
          <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px]">Policies & Trust</h4>
          <ul className="space-y-2 text-gray-400">
            <li>
              <Link href="/privacy" className="hover:text-white transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white transition">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition">
                Contact & Support
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Help */}
        <div>
          <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px]">For Small Businesses</h4>
          <p className="text-gray-400 text-xs leading-relaxed mb-3">
            Save your Facebook shop or institute profile once. Never rewrite your phone number, logo, and address manually again!
          </p>
          <Link
            href="/register"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1.5 rounded transition text-xs"
          >
            Create Free Account
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-gray-400 text-[11px]">
        <p>© 2026 FreeDocForge.com. All rights reserved.</p>
        <p className="flex items-center gap-1 mt-2 sm:mt-0">
          Designed with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for entrepreneurs & creators worldwide.
        </p>
      </div>
    </footer>
  );
}
