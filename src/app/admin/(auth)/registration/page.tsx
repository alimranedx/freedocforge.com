"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert, Lock, Mail, User, ArrowRight, AlertCircle, KeyRound, Sparkles } from "lucide-react";

export default function AdminRegistrationPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/admin-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, secretKey }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to register admin account");
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-red-600 text-white shadow-lg mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-black tracking-wider uppercase text-white">
          Administrator Registration
        </h2>
        <p className="mt-2 text-xs font-mono text-zinc-400">
          PROVISION NEW SYSTEM SUPERUSER
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-zinc-900 py-8 px-6 shadow-2xl rounded-2xl border border-zinc-800">
          {error && (
            <div className="mb-5 bg-red-950/60 border border-red-800 text-red-300 px-4 py-3 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                Full Legal Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="System Administrator"
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                Admin Email ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="admin@freedocforge.com"
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:outline-none font-mono"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                Master Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1 flex items-center justify-between">
                <span>Admin Provisioning Key</span>
                <span className="text-[10px] text-zinc-500">(Default: admin2026)</span>
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="admin2026"
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:outline-none font-mono"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-lg transition text-xs shadow-md cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? "Registering..." : "Provision Admin Account"} <Sparkles className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-zinc-500 border-t border-zinc-800 pt-4 flex items-center justify-between">
            <Link href="/" className="hover:text-zinc-300 transition">
              ← Return to Site
            </Link>
            <Link href="/admin/login" className="text-red-400 hover:text-red-300 font-mono transition">
              Already Admin? Log In →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
