/**
 * AppearanceProvider — Client-side site template context.
 * Manages the active site layout preset template (e.g. ceramic-light, classic, minimal).
 * Synchronizes selection with React state and applies the data-template attribute
 * to document.documentElement for dynamic theme switching.
 */
"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type TemplateName =
    | "classic"
    | "ceramic"
    | "ceramic-light"
    | "glass-dark"
    | "light-modern"
    | "minimal"
    | "executive";

interface AppearanceContextValue {
    template: TemplateName;
    setTemplate: (t: TemplateName) => void;
}

const AppearanceContext = createContext<AppearanceContextValue>({
    template: "classic",
    setTemplate: () => {},
});

export function useAppearance() {
    return useContext(AppearanceContext);
}

export function AppearanceProvider({
    children,
    initialTemplate = "classic",
}: {
    children: ReactNode;
    initialTemplate?: TemplateName;
}) {
    const [template, setTemplateState] = useState<TemplateName>(initialTemplate);
    const [mounted, setMounted] = useState(false);

    // Sync state with layout changes on the server or storage
    useEffect(() => {
        setMounted(true);
        if (initialTemplate) {
            setTemplateState(initialTemplate);
            document.documentElement.setAttribute("data-template", initialTemplate);
        }
    }, [initialTemplate]);

    function setTemplate(t: TemplateName) {
        setTemplateState(t);
        document.documentElement.setAttribute("data-template", t);
    }

    useEffect(() => {
        if (mounted) {
            document.documentElement.setAttribute("data-template", template);
        }
    }, [template, mounted]);

    return (
        <AppearanceContext.Provider value={{ template, setTemplate }}>
            {children}
        </AppearanceContext.Provider>
    );
}
