"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Store,
  FileText,
  Printer,
  Sparkles,
  Settings,
  LogOut,
  PlusCircle,
  Home,
  CheckCircle,
} from "lucide-react";

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  const navItems = [
    { label: "Overview & Quick Print", href: "/dashboard", icon: Home },
    { label: "My Shop Preset", href: "/dashboard/shop-profile", icon: Store },
    { label: "Saved Documents", href: "/dashboard/history", icon: FileText },
    { label: "AI Template Designer", href: "/dashboard/ai-designer", icon: Sparkles, badge: "AI" },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* USER SIDEBAR (Distinct blue/slate theme) */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-sm text-slate-900">Shop Dashboard</span>
                <span className="text-[10px] text-emerald-600 block font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active Business
                </span>
              </div>
            </Link>
          </div>

          {/* User Shop Badge */}
          <div className="m-4 p-3 bg-blue-50/70 border border-blue-100 rounded-xl">
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">
              Active Shop
            </span>
            <h4 className="text-xs font-bold text-slate-900 truncate">
              {user?.profiles?.[0]?.businessName || user?.name || "Loading..."}
            </h4>
            <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                        isActive ? "bg-white text-blue-700" : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <Link
            href="/templates/f-commerce-invoice"
            className="w-full flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-lg text-xs transition shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" /> Instant Print Memo
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 font-semibold py-2 rounded-lg text-xs transition"
          >
            <LogOut className="w-3.5 h-3.5" /> Log Out
          </button>
        </div>
      </aside>

      {/* USER MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-slate-900">
              Welcome back, {user?.name || "Business Owner"}!
            </h1>
            <p className="text-xs text-slate-500">Your custom presets are ready for instant document generation.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-600 hover:text-blue-600 transition"
            >
              Public Gallery
            </Link>
            <span className="text-xs bg-slate-100 text-slate-700 font-bold px-3 py-1.5 rounded-lg border border-slate-200">
              User ID: #{user?.id?.substring(0, 6) || "..."}
            </span>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
