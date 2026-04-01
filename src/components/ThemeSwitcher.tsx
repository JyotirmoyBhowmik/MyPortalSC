"use client";

import { useState } from "react";
import { useTheme } from "./ThemeProvider";

export default function ThemeSwitcher() {
    const { theme, setTheme, themes } = useTheme();
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            {/* Toggle button */}
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-surface transition-all"
                title="Change Theme"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <span className="hidden sm:inline">Theme</span>
            </button>

            {/* Dropdown */}
            {open && (
                <>
                    {/* Click-away overlay */}
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

                    <div className="absolute right-0 top-full mt-2 z-50 w-52 glass rounded-xl p-3 shadow-xl border border-border animate-scale-in">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
                            Color Theme
                        </p>
                        <div className="space-y-1">
                            {themes.map((t) => (
                                <button
                                    key={t.name}
                                    onClick={() => {
                                        // Smooth morph: add transition class briefly
                                        document.documentElement.classList.add('theme-transitioning');
                                        setTheme(t.name);
                                        setOpen(false);
                                        setTimeout(() => {
                                            document.documentElement.classList.remove('theme-transitioning');
                                        }, 600);
                                    }}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${theme === t.name
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:text-foreground hover:bg-surface"
                                        }`}
                                >
                                    <span
                                        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${theme === t.name ? "border-primary" : "border-border"}`}
                                        style={{ background: t.swatch }}
                                    />
                                    {t.label}
                                    {theme === t.name && (
                                        <svg className="w-4 h-4 ml-auto text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
