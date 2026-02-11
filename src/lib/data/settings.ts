/* ─────────────────────────────────────────────────────
   Site Settings / Feature Flags — Supabase-backed
   ───────────────────────────────────────────────────── */
import { createClient } from "@/lib/supabase/server";

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

export async function getAllSettings(): Promise<SiteSetting[]> {
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
}

export async function getSettingsByCategory(category: string): Promise<SiteSetting[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("category", category)
        .order("key", { ascending: true });
    if (error) return [];
    return (data ?? []) as SiteSetting[];
}

export async function getFeatureFlag(key: string): Promise<boolean> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", key)
        .single();
    if (error || !data) return false;
    // value is stored as JSONB — could be boolean true/false or string "true"/"false"
    const val = data.value;
    if (typeof val === "boolean") return val;
    if (val === "true" || val === true) return true;
    return false;
}

export async function getSetting(key: string): Promise<unknown> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", key)
        .single();
    if (error || !data) return null;
    return data.value;
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
