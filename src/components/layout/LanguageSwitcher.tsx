"use client";

import { useTranslation } from "@/lib/i18n";

export default function LanguageSwitcher({ collapsed = false }: { collapsed?: boolean }) {
    const { locale, setLocale, locales } = useTranslation();

    if (collapsed) {
        return (
            <div className="flex gap-2 p-2">
                {locales.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => setLocale(lang.code as "en" | "hi" | "bn")}
                        className={`text-xs px-2 py-1 rounded-md transition-colors ${locale === lang.code
                            ? "bg-primary text-primary-foreground font-bold"
                            : "text-muted-foreground hover:bg-surface-hover"
                            }`}
                    >
                        {lang.label}
                    </button>
                ))}
            </div>
        );
    }

    return (
        <div className="relative group">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface rounded-full transition-all">
                {locales.find(l => l.code === locale)?.label}
            </button>
            <div className="absolute right-0 top-full mt-2 w-32 py-1 bg-surface/90 backdrop-blur-xl border border-border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {locales.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => setLocale(lang.code as "en" | "hi" | "bn")}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${locale === lang.code
                            ? "text-primary font-bold bg-primary/10"
                            : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
                            }`}
                    >
                        {lang.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
