"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Locale = "en" | "hi" | "bn";

interface LanguageContextType {
    locale: Locale;
    setLocale: (l: Locale) => void;
    // Helper to gracefully fallback to English if translation is missing
    t: (obj: any, field: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>("en");

    useEffect(() => {
        // Load from local storage on mount
        let isMounted = true;
        const saved = localStorage.getItem("site_locale") as Locale;
        if (saved && ["en", "hi", "bn"].includes(saved) && isMounted) {
            setLocaleState(saved);
        }
        return () => { isMounted = false };
    }, []);

    const setLocale = (l: Locale) => {
        setLocaleState(l);
        localStorage.setItem("site_locale", l);
    };

    const t = (obj: any, field: string) => {
        if (!obj) return "";
        if (locale === "en") return obj[field] || "";

        const localizedField = `${field}_${locale}`;
        return obj[localizedField] || obj[field] || ""; // Fallback to English
    };

    return (
        <LanguageContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
