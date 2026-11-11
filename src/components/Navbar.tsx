"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Sparkles, User, Shield, LogOut } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 text-gray-900 group">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm group-hover:bg-blue-700 transition">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-gray-900 flex items-center gap-1.5">
              FreeDocForge<span className="text-blue-600 text-xs px-1.5 py-0.5 rounded bg-blue-50 font-bold">.com</span>
            </span>
            <span className="text-[10px] text-gray-400 block -mt-0.5 font-medium">Free Printable & Smart Document Studio</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/templates" className="hover:text-blue-600 transition">
            Templates Gallery
          </Link>
          <Link href="/templates/f-commerce-invoice" className="hover:text-blue-600 transition flex items-center gap-1">
            Cash Memo & Invoice
            <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">BD</span>
          </Link>
          <Link href="/templates/school-result-sheet" className="hover:text-blue-600 transition">
            School Marksheets
          </Link>
          <Link href="/templates/doctor-prescription" className="hover:text-blue-600 transition">
            Prescriptions
          </Link>
        </nav>

        {/* Right CTA / Auth Status */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              {user.role === "ADMIN" ? (
                <Link
                  href="/admin"
                  className="flex items-center gap-1 text-xs bg-purple-600 hover:bg-purple-700 text-white font-semibold px-3 py-2 rounded-lg transition"
                >
                  <Shield className="w-3.5 h-3.5" /> Admin Panel
                </Link>
              ) : null}

              <Link
                href="/dashboard"
                className="flex items-center gap-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-3 py-2 rounded-lg transition border border-blue-200"
              >
                <User className="w-3.5 h-3.5" /> {user.name.split(" ")[0]}'s Shop
              </Link>

              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-lg transition"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs font-semibold text-gray-700 hover:text-gray-900 px-3 py-2 transition"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg shadow-sm transition"
              >
                Save My Shop
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
