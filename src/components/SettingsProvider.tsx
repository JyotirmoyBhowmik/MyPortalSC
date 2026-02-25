"use client";

import { createContext, useContext, ReactNode } from "react";

const SettingsContext = createContext<Record<string, boolean>>({});

export function SettingsProvider({ settings, children }: { settings: Record<string, boolean>; children: ReactNode }) {
    return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
    return useContext(SettingsContext);
}
