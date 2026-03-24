"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type ThemeName = "deep-navy" | "midnight-purple" | "carbon" | "emerald-forest";

interface ThemeContextValue {
    theme: ThemeName;
    setTheme: (t: ThemeName) => void;
    themes: { name: ThemeName; label: string; swatch: string }[];
    isRetro: boolean;
    toggleRetro: () => void;
}

const themes: ThemeContextValue["themes"] = [
    { name: "deep-navy", label: "Deep Navy", swatch: "#0a192f" },
    { name: "midnight-purple", label: "Midnight Purple", swatch: "#0f0a1e" },
    { name: "carbon", label: "Carbon", swatch: "#111111" },
    { name: "emerald-forest", label: "Emerald Forest", swatch: "#081c15" },
];

const ThemeContext = createContext<ThemeContextValue>({
    theme: "deep-navy",
    setTheme: () => { },
    themes,
    isRetro: false,
    toggleRetro: () => { },
});

export function useTheme() {
    return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<ThemeName>("deep-navy");
    const [isRetro, setIsRetro] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem("portfolio-theme") as ThemeName | null;
        if (stored && themes.some((t) => t.name === stored)) {
            setThemeState(stored);
            document.documentElement.setAttribute("data-theme", stored);
        }
        const retroStored = localStorage.getItem("portfolio-retro");
        if (retroStored === "true") {
            setIsRetro(true);
            document.documentElement.setAttribute("data-retro", "true");
        }
    }, []);

    function setTheme(t: ThemeName) {
        setThemeState(t);
        localStorage.setItem("portfolio-theme", t);
        document.documentElement.setAttribute("data-theme", t);
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
            if (isRetro) {
                document.documentElement.setAttribute("data-retro", "true");
            } else {
                document.documentElement.removeAttribute("data-retro");
            }
        }
    }, [theme, isRetro, mounted]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, themes, isRetro, toggleRetro }}>
            {children}
        </ThemeContext.Provider>
    );
}
