"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldAlert,
  Layers,
  Users,
  DollarSign,
  BarChart3,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user.role === "ADMIN") {
          setAdmin(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  const navItems = [
    { label: "Master Dashboard", href: "/admin/dashboard", icon: BarChart3 },
    { label: "Users & Merchants", href: "/admin/users", icon: Users },
    { label: "Document Compliance", href: "/admin/documents", icon: FileText },
    { label: "Template Studio", href: "/admin/templates", icon: Layers },
    { label: "AdSense Monetization", href: "/admin/ads", icon: DollarSign },
    { label: "Platform Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-zinc-950 text-zinc-100 font-sans">
      {/* ADMIN SIDEBAR (Dedicated Dark High-Tech Theme) */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Header */}
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-black shadow-md">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <span className="font-black text-sm text-white tracking-wider uppercase">
                  DocForge Admin
                </span>
                <span className="text-[10px] text-red-400 block font-mono font-semibold">
                  SUPERUSER ACCESS
                </span>
              </div>
            </div>
          </div>

          {/* Admin Identity Card */}
          <div className="m-4 p-3 bg-zinc-800/80 border border-zinc-700/60 rounded-xl">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
              Logged in as
            </span>
            <h4 className="text-xs font-bold text-white truncate">{admin?.name || "System Admin"}</h4>
            <p className="text-[10px] text-zinc-400 font-mono truncate">{admin?.email}</p>
          </div>

          {/* Nav Links */}
          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? "bg-red-600 text-white shadow-sm"
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-zinc-800 space-y-2">
          <div className="w-full py-2 px-3 rounded-lg bg-zinc-800/60 border border-zinc-800 text-[11px] font-mono text-zinc-400 flex items-center justify-between">
            <span>Security Zone</span>
            <span className="text-emerald-400 font-bold">ISOLATED</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-950/40 font-semibold py-2 rounded-lg text-xs transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Exit Admin
          </button>
        </div>
      </aside>

      {/* ADMIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 bg-zinc-950">
        <header className="h-16 bg-zinc-900 border-b border-zinc-800 px-8 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide uppercase">
              DocForge Platform Management Console
            </h2>
            <p className="text-[11px] text-zinc-400">Manage categories, templates, ads, and system health.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-1 rounded-md font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> MySQL Engine Online
            </span>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
