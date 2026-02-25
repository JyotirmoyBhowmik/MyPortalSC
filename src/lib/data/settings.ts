/* ─────────────────────────────────────────────────────
   Site Settings / Feature Flags — Supabase-backed
   ───────────────────────────────────────────────────── */
import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

export interface SiteSetting {
    id: string;
    key: string;
    value: unknown;
    category: string;
    label: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}

/* ─── Read ─── */

export const getAllSettings = cache(async function getAllSettings(): Promise<SiteSetting[]> {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("site_settings")
            .select("*")
            .order("category", { ascending: true })
            .order("key", { ascending: true });
        if (error) {
            console.error("Error fetching settings:", error);
            return [];
        }
        return (data ?? []) as SiteSetting[];
    } catch (e) {
        console.error("Critical error in getAllSettings:", e);
        return [];
    }
});

export async function getSettingsByCategory(category: string): Promise<SiteSetting[]> {
    try {
        const allSettings = await getAllSettings();
        return allSettings.filter(s => s.category === category);
    } catch (e) {
        return [];
    }
}

export async function getFeatureFlag(key: string): Promise<boolean> {
    try {
        const flags = await getFeatureFlags();
        return !!flags[key];
    } catch (e) {
        return false;
    }
}

export async function getSetting(key: string): Promise<unknown> {
    try {
        const settingsMap = await getSiteSettingsMap();
        return settingsMap[key] ?? null;
    } catch (e) {
        return null;
    }
}

/* ─── Write ─── */

export async function updateSetting(key: string, value: unknown) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("site_settings")
        .update({ value: JSON.parse(JSON.stringify(value)) })
        .eq("key", key);
    if (error) {
        return { success: false, error: error.message };
    }
    return { success: true };
}

export async function getFeatureFlags(): Promise<Record<string, boolean>> {
    const settings = await getAllSettings();
    const flags: Record<string, boolean> = {};

    settings.forEach((setting) => {
        let isEnabled = false;
        if (typeof setting.value === "boolean") {
            isEnabled = setting.value;
        } else if (setting.value === "true" || setting.value === true) {
            isEnabled = true;
        }
        flags[setting.key] = isEnabled;
    });

    return flags;
}

export async function getSiteSettingsMap(): Promise<Record<string, unknown>> {
    const settings = await getAllSettings();
    const map: Record<string, unknown> = {};

    settings.forEach((setting) => {
        let val: unknown = setting.value;
        // Normalize "true"/"false" strings to booleans if meaningful, but keep others as strings
        if (val === "true") val = true;
        if (val === "false") val = false;
        map[setting.key] = val;
    });

    return map;
}

