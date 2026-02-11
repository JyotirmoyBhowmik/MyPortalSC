"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n";

export default function LanguageSwitcher() {
    const { locale, setLocale, locales } = useTranslation();
    const [open, setOpen] = useState(false);

    const current = locales.find((l) => l.code === locale);

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-surface transition-all"
                title="Change Language"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span className="hidden sm:inline text-xs font-medium">{current?.label}</span>
            </button>

            {open && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 z-50 w-40 glass rounded-xl p-2 shadow-xl border border-border animate-scale-in">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                            Language
                        </p>
                        {locales.map((l) => (
                            <button
                                key={l.code}
                                onClick={() => { setLocale(l.code); setOpen(false); }}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${locale === l.code
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:text-foreground hover:bg-surface"
                                    }`}
                            >
                                {l.label}
                                {locale === l.code && (
                                    <svg className="w-4 h-4 inline ml-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
