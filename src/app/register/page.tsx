"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Lock,
  Mail,
  Phone,
  User,
  ArrowRight,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  Globe,
  Moon,
  Sun,
  Info,
  X,
} from "lucide-react";
import { useGlobalSettings } from "@/context/GlobalSettingsContext";

function RegisterForm() {
  const router = useRouter();
  const { lang, toggleLang, theme, toggleTheme, t } = useGlobalSettings();

  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload: Record<string, any> = {
        name,
        password,
        rememberMe,
      };

      if (authMethod === "email") {
        if (!email) throw new Error(lang === "bn" ? "ইমেইল প্রদান করা আবশ্যক" : "Email is required");
        payload.email = email;
        if (phone) payload.phone = phone;
      } else {
        if (!phone) throw new Error(lang === "bn" ? "মোবাইল নম্বর প্রদান করা আবশ্যক" : "Phone number is required");
        payload.phone = phone;
        if (email) payload.email = email;
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || (lang === "bn" ? "অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে" : "Failed to create account"));
      }

      router.push(data.redirect || "/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    try {
      const res = await fetch("/api/auth/google/status");
      const data = await res.json();

      if (!data.configured) {
        setGoogleLoading(false);
        setShowGoogleModal(true);
        return;
      }

      window.location.href = "/api/auth/google";
    } catch {
      window.location.href = "/api/auth/google";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors">
      {/* Top Floating Controls: Back to Home & Language / Theme Switcher */}
      <div className="max-w-md mx-auto w-full px-4 mb-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t("backToHome")}</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <button
            type="button"
            onClick={toggleLang}
            className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer shadow-2xs"
            title={lang === "en" ? "বাংলা ভাষায় পরিবর্তন করুন" : "Switch to English"}
          >
            <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{lang === "en" ? "বাংলা" : "EN"}</span>
          </button>

          {/* Theme Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer shadow-2xs"
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {theme === "light" ? (
              <Moon className="w-3.5 h-3.5 text-slate-700" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            )}
          </button>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        <Link href="/" className="inline-flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
            <FileText className="w-5 h-5" />
          </div>
          <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white">
            FreeDocForge<span className="text-blue-600 dark:text-blue-400">.com</span>
          </span>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {t("registerOrgTitle")}
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {t("registerOrgSubtitle")}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-8 shadow-xl rounded-3xl border border-slate-200 dark:border-slate-800 transition-colors">
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. GOOGLE ONE-CLICK SIGN UP */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold shadow-2xs hover:shadow-sm transition cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>
              {googleLoading
                ? lang === "bn"
                  ? "গুগলের সাথে সংযুক্ত হচ্ছে..."
                  : "Connecting to Google..."
                : t("signUpWithGoogle")}
            </span>
          </button>

          {/* DIVIDER */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
              <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 dark:text-slate-500 font-semibold">
                {t("orSignUpWith")}
              </span>
            </div>
          </div>

          {/* METHOD TOGGLE (EMAIL vs PHONE) */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-4 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setAuthMethod("email");
                setError("");
              }}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                authMethod === "email"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs font-bold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{t("emailTab")}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod("phone");
                setError("");
              }}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                authMethod === "phone"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs font-bold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{t("phoneTab")}</span>
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                {t("fullNameLabel")}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder={lang === "bn" ? "যেমন: তানভীর ফ্যাশন অথবা আদর্শ ফার্মেসি" : "e.g. Tanvir Fashion or Ideal Pharmacy"}
                  className="w-full text-xs pl-10 pr-3.5 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-2xs"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            {authMethod === "email" ? (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    {t("emailAddressLabel")}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="w-full text-xs pl-10 pr-3.5 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-2xs"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    {t("phoneNumberOptional")}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      placeholder="01712345678"
                      className="w-full text-xs pl-10 pr-3.5 py-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-2xs"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    {t("phoneNumberLabel")}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="01712345678 or +8801..."
                      className="w-full text-xs pl-10 pr-3.5 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-2xs"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    {lang === "bn" ? "ইমেইল ঠিকানা (ঐচ্ছিক)" : "Email Address (Optional)"}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full text-xs pl-10 pr-3.5 py-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-2xs"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                {t("passwordMinChars")}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full text-xs pl-10 pr-10 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-2xs"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* KEEP LOGGED IN (REMEMBER ME) */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
                />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  {t("keepMeLoggedIn")}
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl transition text-xs sm:text-sm shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50 mt-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{loading ? t("creatingAccount") : t("createAccountBtn")}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
            {t("haveAccountPrompt")}{" "}
            <Link href="/login" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
              {t("signInHere")}
            </Link>
          </div>
        </div>

        {/* Value Proposition Pills */}
        <div className="mt-5 space-y-1.5 text-center text-[11px] text-slate-400 dark:text-slate-500 font-medium">
          <div className="flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>
              {lang === "bn"
                ? "দোকানের ফোন, ঠিকানা ও লোগো বারবার টাইপ করার ঝামেলা নেই"
                : "Never rewrite your phone number, logo, and terms manually"}
            </span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            <span>
              {lang === "bn"
                ? "আজীবন ১০০% সম্পূর্ণ ফ্রি • কোনো কার্ড লাগবে না"
                : "100% Free Forever • No Credit Card Required"}
            </span>
          </div>
        </div>
      </div>

      {/* GOOGLE SETUP INSTRUCTIONS MODAL */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{t("googleSetupRequired")}</span>
              </div>
              <button
                onClick={() => setShowGoogleModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 text-xs text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed">
              <p>
                {lang === "bn"
                  ? "১-ক্লিক গুগল সাইন আপ সক্রিয় করতে আপনার প্রজেক্টের .env ফাইলে গুগল OAuth ক্রিডেনশিয়াল যোগ করতে হবে:"
                  : "To enable 1-click Google Sign-Up, add your Google OAuth credentials to the project's .env file:"}
              </p>

              <div className="bg-slate-950 text-slate-200 p-3 rounded-xl font-mono text-[11px] space-y-1">
                <div>GOOGLE_CLIENT_ID=&quot;your-client-id.apps.googleusercontent.com&quot;</div>
                <div>GOOGLE_CLIENT_SECRET=&quot;your-client-secret&quot;</div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 p-3 rounded-xl text-blue-800 dark:text-blue-300 text-[11px] space-y-1">
                <div className="font-bold">
                  {lang === "bn"
                    ? "গুগল কনসোলে অনুমোদিত রিডাইরেক্ট URI:"
                    : "Authorized Redirect URI to add in Google Console:"}
                </div>
                <div className="font-mono break-all bg-white/70 dark:bg-slate-900/70 p-1.5 rounded border border-blue-100 dark:border-blue-900/50">
                  http://localhost:3000/api/auth/callback/google
                </div>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {lang === "bn"
                  ? "এর মধ্যে আপনি সরাসরি ইমেইল বা মোবাইল নম্বর দিয়ে অ্যাকাউন্ট খুলতে পারবেন।"
                  : "In the meantime, you can register using Email or Phone Number."}
              </p>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition cursor-pointer"
              >
                {t("gotItBtn")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
