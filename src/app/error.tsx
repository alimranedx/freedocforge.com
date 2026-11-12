"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertOctagon, RotateCcw, Home, LifeBuoy } from "lucide-react";

export default function GlobalRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log exception to monitoring service
    console.error("[Route Exception Caught]:", error);
  }, [error]);

  const isDev = process.env.NODE_ENV !== "production";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center items-center px-4 py-16 font-sans">
      <div className="max-w-md w-full text-center space-y-6">
        {/* ICON BADGE */}
        <div className="w-20 h-20 rounded-3xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400 shadow-xl shadow-amber-500/10">
          <AlertOctagon className="w-10 h-10" />
        </div>

        {/* HEADINGS */}
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Something Went Wrong
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            An unexpected error occurred while rendering this view. Our system has safely isolated the incident.
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
            সাময়িক যান্ত্রিক ত্রুটি ঘটেছে • অনুগ্রহ করে পুনরায় চেষ্টা করুন
          </p>
        </div>

        {/* ERROR DIGEST / TRACE (IN DEV ONLY) */}
        {isDev && error?.message && (
          <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-xl text-left font-mono text-[11px] text-red-700 dark:text-red-300 overflow-x-auto max-h-36">
            <span className="font-bold block mb-1">Developer Debug Notice:</span>
            <span>{error.message}</span>
            {error.digest && (
              <span className="block text-[10px] text-red-500 dark:text-red-400 mt-1">
                Digest: {error.digest}
              </span>
            )}
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Try Again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition border border-slate-300 dark:border-slate-700"
          >
            <Home className="w-3.5 h-3.5" /> Return Home
          </Link>
        </div>

        {/* FOOTER NOTE */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500">
          If this issue persists, please clear your browser cache or refresh the page.
        </div>
      </div>
    </div>
  );
}
