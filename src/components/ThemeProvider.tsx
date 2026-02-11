"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type ThemeName = "deep-navy" | "midnight-purple" | "carbon" | "emerald-forest";

interface ThemeContextValue {
    theme: ThemeName;
    setTheme: (t: ThemeName) => void;
    themes: { name: ThemeName; label: string; swatch: string }[];
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
});

export function useTheme() {
    return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<ThemeName>("deep-navy");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem("portfolio-theme") as ThemeName | null;
        if (stored && themes.some((t) => t.name === stored)) {
            setThemeState(stored);
            document.documentElement.setAttribute("data-theme", stored);
        }
    }, []);

    function setTheme(t: ThemeName) {
        setThemeState(t);
        localStorage.setItem("portfolio-theme", t);
        document.documentElement.setAttribute("data-theme", t);
    }

    // Prevent flash: apply theme attribute on mount
    useEffect(() => {
        if (mounted) {
            document.documentElement.setAttribute("data-theme", theme);
        }
    }, [theme, mounted]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, themes }}>
            {children}
        </ThemeContext.Provider>
    );
}
