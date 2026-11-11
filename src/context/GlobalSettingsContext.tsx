"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { translations, Language } from "@/lib/translations";

type TranslationKey = keyof typeof translations.en;

interface GlobalSettingsContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
  lang: Language;
  toggleLang: () => void;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const GlobalSettingsContext = createContext<GlobalSettingsContextType | undefined>(undefined);

export function GlobalSettingsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [lang, setLangState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 1. Theme sync
    const savedTheme = localStorage.getItem("app_theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      applyTheme("dark");
    } else {
      applyTheme("light");
    }

    // 2. Language sync
    const savedLang = localStorage.getItem("app_lang") as Language | null;
    if (savedLang && (savedLang === "en" || savedLang === "bn")) {
      setLangState(savedLang);
    }
    setMounted(true);
  }, []);

  const applyTheme = (th: "light" | "dark") => {
    if (th === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("app_theme", nextTheme);
    localStorage.setItem("user_theme", nextTheme);
    applyTheme(nextTheme);
  };

  const toggleLang = () => {
    const nextLang: Language = lang === "en" ? "bn" : "en";
    setLangState(nextLang);
    localStorage.setItem("app_lang", nextLang);
    localStorage.setItem("user_lang", nextLang);
  };

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("app_lang", newLang);
    localStorage.setItem("user_lang", newLang);
  };

  const t = (key: TranslationKey): string => {
    const dict = translations[lang] || translations.en;
    return dict[key] || translations.en[key] || key;
  };

  return (
    <GlobalSettingsContext.Provider
      value={{
        theme,
        toggleTheme,
        lang,
        toggleLang,
        setLang,
        t,
      }}
    >
      <div className={theme === "dark" ? "dark" : ""}>
        {children}
      </div>
    </GlobalSettingsContext.Provider>
  );
}

export function useGlobalSettings() {
  const context = useContext(GlobalSettingsContext);
  if (!context) {
    throw new Error("useGlobalSettings must be used within GlobalSettingsProvider");
  }
  return context;
}
