"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { ShieldAlert, RotateCcw, BarChart3, AlertTriangle } from "lucide-react";

export default function AdminErrorSegment({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Admin Console Runtime Exception]:", error);
  }, [error]);

  const isDev = process.env.NODE_ENV !== "production";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-center items-center px-4 py-16 font-sans">
      <div className="max-w-md w-full text-center space-y-6">
        {/* ICON BADGE */}
        <div className="w-20 h-20 rounded-2xl bg-red-950/60 border border-red-800 flex items-center justify-center mx-auto text-red-500 shadow-xl shadow-red-900/20">
          <ShieldAlert className="w-10 h-10" />
        </div>

        {/* HEADINGS */}
        <div className="space-y-2">
          <h1 className="text-xl font-black uppercase tracking-wider text-white">
            Admin Console Exception
          </h1>
          <p className="text-xs text-zinc-400">
            A runtime error occurred inside this administrative module. Access and state remain contained.
          </p>
          <span className="text-[10px] font-mono text-zinc-600 block">
            SUPERUSER PERIMETER • ISOLATED
          </span>
        </div>

        {/* DEVELOPER DEBUG IN DEV */}
        {isDev && error?.message && (
          <div className="p-3 bg-red-950/80 border border-red-900 rounded-xl text-left font-mono text-[11px] text-red-300 overflow-x-auto max-h-36">
            <span className="font-bold block mb-1">Exception Trace:</span>
            <span>{error.message}</span>
            {error.digest && (
              <span className="block text-[10px] text-zinc-500 mt-1">Digest: {error.digest}</span>
            )}
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Retry Module
          </button>
          <Link
            href="/admin/dashboard"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs transition border border-zinc-700"
          >
            <BarChart3 className="w-3.5 h-3.5" /> Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
