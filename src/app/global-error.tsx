"use client";

import React, { useEffect } from "react";
import { AlertOctagon, RotateCcw } from "lucide-react";

export default function GlobalApplicationError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Root Layout Crash Caught]:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center p-4 font-sans antialiased">
        <div className="max-w-md w-full text-center space-y-6 bg-slate-800/80 p-8 rounded-2xl border border-slate-700 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-800 text-red-400 flex items-center justify-center mx-auto">
            <AlertOctagon className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-black text-white uppercase tracking-wider">
              Application Error
            </h1>
            <p className="text-xs text-slate-300">
              A critical runtime exception occurred. The page cannot be loaded in its current state.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => reset()}
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Reload Application
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
