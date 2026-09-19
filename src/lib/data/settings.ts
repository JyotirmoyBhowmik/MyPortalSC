/**
 * Site Settings & Feature Flags — Data Access Layer (DAL).
 * All feature flag reads go through this module. Uses React cache()
 * to deduplicate DB calls within a single server-side render pass.
 */
import { createClient, createPublicClient } from "@/lib/supabase/server";
import { cache } from "react";
import { logDbError } from "@/lib/supabase/error";
import { unstable_cache, revalidateTag } from "next/cache";

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

export const getAllSettings = cache(
    unstable_cache(
        async function (): Promise<SiteSetting[]> {
            try {
                const supabase = createPublicClient();
                const { data, error } = await supabase
                    .from("site_settings")
                    .select("*")
                    .order("category", { ascending: true })
                    .order("key", { ascending: true });
                if (error) {
                    logDbError("Error fetching settings", error);
                    return [];
                }
                return (data ?? []) as SiteSetting[];
            } catch (e) {
                console.error("Critical error in getAllSettings:", e);
                return [];
            }
        },
        ["all-site-settings"],
        {
            tags: ["settings"],
            revalidate: 3600
        }
    )
);

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
    (revalidateTag as any)("settings");
    return { success: true };
}

export const DEFAULT_FEATURE_FLAGS: Record<string, boolean> = {
    feature_timeline: true,
    feature_downloads: true,
    feature_executive_summary: true,
    feature_contact_crm: true,
    feature_strict_security_headers: true,
    feature_i18n: true,
    feature_3d_globe: true,
    feature_particle_bg: true,
    feature_network_topology: true,
    feature_content_versioning: true,
    feature_bulk_actions: true,
    feature_pwa: true,
    feature_og_images: true,
    feature_jsonld: true,
    feature_newsletter: true,
    feature_budget_mock_disclaimer: true,
    feature_cost_comparison: true,
    feature_ping_dashboard: true,
    feature_security_scorecard: true,
    feature_rich_editor: true,
    feature_media_library: true,
    feature_drag_drop: true,
    feature_video_intro: true,
    feature_activity_feed: true,
    feature_contact_analytics: true,
    feature_analytics_dashboard: true,
    feature_scroll_animations: true,
    feature_initiative_heatmap: true,
    feature_page_transitions: true,
    feature_magnetic_buttons: true,
    feature_light_theme: true,
    feature_session_management: true,
    feature_rbac: true,
    feature_enhanced_audit: true,
    feature_captcha: true,
    feature_2fa: true,
    feature_pdf_export: true,
    feature_admin_search: true,
    feature_scheduled_publish: true,
    feature_available_for_opportunities: true,
    feature_speaking: false,
    feature_publications: false,
    feature_blog: false,
    feature_case_studies: false,
    feature_testimonials: false,
    feature_retro_mode: false,
};

export async function getFeatureFlags(): Promise<Record<string, boolean>> {
    const settings = await getAllSettings();
    const flags: Record<string, boolean> = { ...DEFAULT_FEATURE_FLAGS };

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

