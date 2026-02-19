"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { en, type Translations } from "./translations/en";
import { hi } from "./translations/hi";
import { bn } from "./translations/bn";

export type Locale = "en" | "hi" | "bn";

const translations: Record<Locale, Translations> = { en, hi, bn };

const localeLabels: Record<Locale, string> = {
    en: "English",
    hi: "हिन्दी",
    bn: "বাংলা",
};

interface I18nContextValue {
    locale: Locale;
    setLocale: (l: Locale) => void;
    t: Translations;
    tDB: (obj: any, field: string) => string;
    locales: { code: Locale; label: string }[];
}

const I18nContext = createContext<I18nContextValue>({
    locale: "en",
    setLocale: () => { },
    t: en,
    tDB: () => "",
    locales: Object.entries(localeLabels).map(([code, label]) => ({
        code: code as Locale,
        label,
    })),
});

export function useTranslation() {
    return useContext(I18nContext);
}

export function I18nProvider({ children }: { children: ReactNode }): React.JSX.Element {
    const [locale, setLocaleState] = useState<Locale>("en");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem("portfolio-locale") as Locale | null;
        if (stored && translations[stored]) {
            setLocaleState(stored);
        }
    }, []);

    function setLocale(l: Locale) {
        setLocaleState(l);
        localStorage.setItem("portfolio-locale", l);
        document.documentElement.setAttribute("lang", l);
    }

    useEffect(() => {
        if (mounted) {
            document.documentElement.setAttribute("lang", locale);
        }
    }, [locale, mounted]);

    const t = translations[locale] || en;

    const tDB = (obj: any, field: string) => {
        if (!obj) return "";
        if (locale === "en") return obj[field] || "";

        const localizedField = `${field}_${locale}`;
        return obj[localizedField] || obj[field] || ""; // Fallback to English
    };

    const locales = Object.entries(localeLabels).map(([code, label]) => ({
        code: code as Locale,
        label,
    }));

    const contextValue: I18nContextValue = { locale, setLocale, t, tDB, locales };

    return (
        <I18nContext.Provider value={contextValue}>
            {children}
        </I18nContext.Provider>
    );
}
