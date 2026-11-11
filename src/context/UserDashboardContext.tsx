"use client";

import React, { createContext, useContext, useState } from "react";
import { translations, Language } from "@/lib/translations";
import { useGlobalSettings } from "@/context/GlobalSettingsContext";

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
  const { theme, toggleTheme, lang, toggleLang, setLang, t } = useGlobalSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      {children}
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
