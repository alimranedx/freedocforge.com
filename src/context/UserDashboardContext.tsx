"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { translations, Language } from "@/lib/translations";

type TranslationKey = keyof typeof translations.en;

interface UserDashboardContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
  lang: Language;
  toggleLang: () => void;
  setLang: (lang: Language) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  t: (key: TranslationKey) => string;
}

const UserDashboardContext = createContext<UserDashboardContextType | undefined>(undefined);

export function UserDashboardProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [lang, setLangState] = useState<Language>("en");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load persisted theme
    const savedTheme = localStorage.getItem("user_theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }

    // Load persisted language
    const savedLang = localStorage.getItem("user_lang") as Language | null;
    if (savedLang && (savedLang === "en" || savedLang === "bn")) {
      setLangState(savedLang);
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("user_theme", nextTheme);
  };

  const toggleLang = () => {
    const nextLang: Language = lang === "en" ? "bn" : "en";
    setLangState(nextLang);
    localStorage.setItem("user_lang", nextLang);
  };

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("user_lang", newLang);
  };

  const t = (key: TranslationKey): string => {
    const dict = translations[lang] || translations.en;
    return dict[key] || translations.en[key] || key;
  };

  return (
    <UserDashboardContext.Provider
      value={{
        theme,
        toggleTheme,
        lang,
        toggleLang,
        setLang,
        mobileMenuOpen,
        setMobileMenuOpen,
        t,
      }}
    >
      <div className={theme === "dark" ? "dark" : ""}>
        {children}
      </div>
    </UserDashboardContext.Provider>
  );
}

export function useUserDashboard() {
  const context = useContext(UserDashboardContext);
  if (!context) {
    throw new Error("useUserDashboard must be used within UserDashboardProvider");
  }
  return context;
}
