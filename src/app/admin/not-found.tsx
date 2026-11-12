import React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  BarChart3,
  Users,
  FileText,
  Layers,
  ArrowRight,
  Lock,
} from "lucide-react";

export default function AdminNotFoundPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-center items-center px-4 py-16 font-sans">
      <div className="max-w-md w-full text-center space-y-6">
        {/* BADGE */}
        <div className="relative inline-block">
          <div className="w-20 h-20 rounded-2xl bg-red-950/60 border border-red-800 flex items-center justify-center mx-auto text-red-500 shadow-xl shadow-red-900/20">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <span className="absolute -bottom-2 -right-2 bg-red-600 text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded-full">
            404 NOT FOUND
          </span>
        </div>

        {/* HEADINGS */}
        <div className="space-y-2">
          <h1 className="text-xl font-black uppercase tracking-wider text-white">
            Admin Endpoint Not Found
          </h1>
          <p className="text-xs text-zinc-400">
            The requested administrative resource or module does not exist within this portal.
          </p>
          <span className="text-[10px] font-mono text-zinc-600 block">
            SUPERUSER CONSOLE • ACCESS CONTAINED
          </span>
        </div>

        {/* RECOVERY ACTION BUTTONS */}
        <div className="pt-2">
          <Link
            href="/admin/dashboard"
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl transition text-xs shadow-md"
          >
            <BarChart3 className="w-4 h-4" /> Return to Master Dashboard
          </Link>
        </div>

        {/* INTERNAL MODULE SHORTCUTS */}
        <div className="pt-6 border-t border-zinc-800 text-left space-y-2 font-mono">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 block text-center">
            Valid Administrative Consoles
          </span>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <Link
              href="/admin/users"
              className="p-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg text-zinc-300 hover:text-white flex items-center gap-2 transition"
            >
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>Users</span>
            </Link>

            <Link
              href="/admin/documents"
              className="p-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg text-zinc-300 hover:text-white flex items-center gap-2 transition"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Documents</span>
            </Link>

            <Link
              href="/admin/templates"
              className="p-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg text-zinc-300 hover:text-white flex items-center gap-2 transition"
            >
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>Templates</span>
            </Link>

            <Link
              href="/admin/ads"
              className="p-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg text-zinc-300 hover:text-white flex items-center gap-2 transition"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>AdSense</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
