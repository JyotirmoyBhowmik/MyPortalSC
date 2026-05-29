/**
 * ThemeProvider — Client-side color scheme context.
 * Manages 5 named themes (Deep Navy, Midnight Purple, Carbon, Emerald Forest, Compact Ceramic Light)
 * plus a retro CRT mode. Persists selection in localStorage and applies
 * data-theme / data-retro attributes to <html> for CSS variable switching.
 */
"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type ThemeName = "deep-navy" | "midnight-purple" | "carbon" | "emerald-forest" | "compact-ceramic";

interface ThemeContextValue {
    theme: ThemeName;
    setTheme: (t: ThemeName) => void;
    themes: { name: ThemeName; label: string; swatch: string }[];
    isRetro: boolean;
    toggleRetro: () => void;
    activeTemplate: string;
}

const themes: ThemeContextValue["themes"] = [
    { name: "deep-navy", label: "Deep Navy", swatch: "#0a192f" },
    { name: "midnight-purple", label: "Midnight Purple", swatch: "#0f0a1e" },
    { name: "carbon", label: "Carbon", swatch: "#111111" },
    { name: "emerald-forest", label: "Emerald Forest", swatch: "#081c15" },
    { name: "compact-ceramic", label: "Compact Ceramic Light", swatch: "#F9F9F7" },
];

const ThemeContext = createContext<ThemeContextValue>({
    theme: "deep-navy",
    setTheme: () => { },
    themes,
    isRetro: false,
    toggleRetro: () => { },
    activeTemplate: "classic",
});

export function useTheme() {
    return useContext(ThemeContext);
}

export function ThemeProvider({ children, initialRetro = false }: { children: ReactNode; initialRetro?: boolean }) {
    const [theme, setThemeState] = useState<ThemeName>("deep-navy");
    const [isRetro, setIsRetro] = useState(initialRetro);
    const [activeTemplate, setActiveTemplate] = useState<string>("classic");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        
        // Capture server-rendered template to restore it when switching back to non-ceramic themes
        const initial = document.body?.getAttribute("data-template") || "classic";
        document.documentElement.setAttribute("data-initial-template", initial);
        if (document.body) {
            document.body.setAttribute("data-initial-template", initial);
        }

        const stored = localStorage.getItem("portfolio-theme") as ThemeName | null;
        if (stored && themes.some((t) => t.name === stored)) {
            setThemeState(stored);
            document.documentElement.setAttribute("data-theme", stored);
            if (stored === "compact-ceramic") {
                setActiveTemplate("compact-ceramic");
                document.documentElement.setAttribute("data-template", "compact-ceramic");
                document.body?.setAttribute("data-template", "compact-ceramic");
                document.documentElement.classList.remove("dark");
            } else {
                let tempInitial = initial;
                if (tempInitial === "compact-ceramic") {
                    tempInitial = "classic";
                }
                setActiveTemplate(tempInitial);
                document.documentElement.setAttribute("data-template", tempInitial);
                document.body?.setAttribute("data-template", tempInitial);
                document.documentElement.classList.add("dark");
            }
        } else {
            // First time visitor with empty localStorage:
            // If the server-rendered default template is compact-ceramic, initialize the theme and activeTemplate as compact-ceramic.
            if (initial === "compact-ceramic") {
                setThemeState("compact-ceramic");
                document.documentElement.setAttribute("data-theme", "compact-ceramic");
                setActiveTemplate("compact-ceramic");
                document.documentElement.setAttribute("data-template", "compact-ceramic");
                if (document.body) {
                    document.body.setAttribute("data-template", "compact-ceramic");
                }
                document.documentElement.classList.remove("dark");
            } else {
                setActiveTemplate(initial);
                document.documentElement.classList.add("dark");
            }
        }
        // Retro mode: DB setting (initialRetro) is authoritative; localStorage is ignored
        // so it's purely admin-controlled
        if (initialRetro) {
            setIsRetro(true);
            document.documentElement.setAttribute("data-retro", "true");
        } else {
            document.documentElement.removeAttribute("data-retro");
        }
    }, [initialRetro]);

    function setTheme(t: ThemeName) {
        setThemeState(t);
        localStorage.setItem("portfolio-theme", t);
        document.documentElement.setAttribute("data-theme", t);
        if (t === "compact-ceramic") {
            setActiveTemplate("compact-ceramic");
            document.documentElement.setAttribute("data-template", "compact-ceramic");
            document.body?.setAttribute("data-template", "compact-ceramic");
            document.documentElement.classList.remove("dark");
        } else {
            let initial = document.documentElement.getAttribute("data-initial-template") || "classic";
            if (initial === "compact-ceramic") {
                initial = "classic";
            }
            setActiveTemplate(initial);
            document.documentElement.setAttribute("data-template", initial);
            document.body?.setAttribute("data-template", initial);
            document.documentElement.classList.add("dark");
        }
    }

    function toggleRetro() {
        setIsRetro((prev) => {
            const next = !prev;
            localStorage.setItem("portfolio-retro", String(next));
            if (next) {
                document.documentElement.setAttribute("data-retro", "true");
            } else {
                document.documentElement.removeAttribute("data-retro");
            }
            return next;
        });
    }

    useEffect(() => {
        if (mounted) {
            document.documentElement.setAttribute("data-theme", theme);
            if (theme === "compact-ceramic") {
                setActiveTemplate("compact-ceramic");
                document.documentElement.setAttribute("data-template", "compact-ceramic");
                document.body?.setAttribute("data-template", "compact-ceramic");
                document.documentElement.classList.remove("dark");
            } else {
                let initial = document.documentElement.getAttribute("data-initial-template") || "classic";
                if (initial === "compact-ceramic") {
                    initial = "classic";
                }
                setActiveTemplate(initial);
                document.documentElement.setAttribute("data-template", initial);
                document.body?.setAttribute("data-template", initial);
                document.documentElement.classList.add("dark");
            }
            if (isRetro) {
                document.documentElement.setAttribute("data-retro", "true");
            } else {
                document.documentElement.removeAttribute("data-retro");
            }
        }
    }, [theme, isRetro, mounted]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, themes, isRetro, toggleRetro, activeTemplate }}>
            {children}
        </ThemeContext.Provider>
    );
}
