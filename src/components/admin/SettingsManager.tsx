"use client";

import { useState, useTransition } from "react";
import { updateSettingValue } from "@/app/admin/actions/settings";
import type { SiteSetting } from "@/lib/data/settings";
import InfraCostEditor from "./InfraCostEditor";

const settingGroups = [
    {
        id: "content",
        title: "Content & Core",
        icon: "📝",
        color: "from-blue-500/10 to-indigo-500/10",
        keys: [
            "feature_executive_summary",
            "feature_timeline",
            "feature_video_intro",
            "feature_rich_editor",
            "feature_drag_drop",
            "feature_content_versioning",
            "feature_scheduled_publish",
            "feature_case_studies",
            "feature_available_for_opportunities",
        ]
    },
    {
        id: "recognition",
        title: "Recognition",
        icon: "🏆",
        color: "from-amber-500/10 to-yellow-500/10",
        keys: [
            // While Testimonials & Publications are Recognition features, they are categorized as WIP. 
            // We'll leave this empty for now so the UI correctly displays 0/0 and future features drop here.
        ]
    },
    {
        id: "engagement",
        title: "Engagement & CRM",
        icon: "🤝",
        color: "from-green-500/10 to-emerald-500/10",
        keys: [
            "feature_contact_crm",
            "feature_downloads",
            "feature_newsletter",
            "feature_ping_dashboard",
        ]
    },
    {
        id: "system",
        title: "System & Config",
        icon: "⚙️",
        color: "from-slate-500/10 to-gray-500/10",
        keys: [
            "navbar_style",
            "site_template",
            "feature_retro_mode",
            "feature_i18n",
            "feature_pdf_export",
            "feature_2fa",
            "feature_captcha",
            "feature_csp_headers",
            "feature_strict_security_headers",
            "feature_enhanced_audit",
            "feature_rbac",
            "feature_session_management",
            "feature_3d_globe",
            "feature_light_theme",
            "feature_magnetic_buttons",
            "feature_page_transitions",
            "feature_particle_bg",
            "feature_scroll_animations",
            "feature_analytics_dashboard",
            "feature_contact_analytics",
            "feature_initiative_heatmap",
            "feature_activity_feed",
            "feature_admin_search",
            "feature_bulk_actions",
            "feature_media_library",
            "feature_jsonld",
            "feature_og_images",
            "feature_pwa",
            "feature_network_topology",
            "feature_cost_comparison",
            "feature_security_scorecard",
        ]
    },
    {
        id: "wip",
        title: "Under Development",
        icon: "🚧",
        color: "from-orange-500/10 to-red-500/10",
        keys: [
            "feature_blog",
            "feature_testimonials",
            "feature_speaking",
            "feature_publications",
        ]
    }
];

interface Props {
    grouped: Record<string, SiteSetting[]>;
}

export default function SettingsManager({ grouped }: Props) {
    const [activeTab, setActiveTab] = useState<"toggles" | "configs">("toggles");
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Flatten settings to map by key efficiently
    const [localState, setLocalState] = useState<Record<string, unknown>>(() => {
        const state: Record<string, unknown> = {};
        for (const categorySettings of Object.values(grouped)) {
            for (const s of categorySettings) {
                let val: unknown = s.value;
                if (val === "true") val = true;
                if (val === "false") val = false;
                state[s.key] = val;
            }
        }
        return state;
    });

    const flatSettingsMap: Record<string, SiteSetting> = {};
    for (const categorySettings of Object.values(grouped)) {
        for (const s of categorySettings) {
            flatSettingsMap[s.key] = s;
        }
    }

    function handleChange(key: string, newValue: unknown) {
        const oldValue = localState[key];
        setLocalState((prev) => ({ ...prev, [key]: newValue }));

        startTransition(async () => {
            const result = await updateSettingValue(key, newValue);
            if (result.success) {
                setMessage({ type: "success", text: "Saved!" });
            } else {
                setLocalState((prev) => ({ ...prev, [key]: oldValue }));
                setMessage({ type: "error", text: result.error || "Failed to update" });
            }
            setTimeout(() => setMessage(null), 2000);
        });
    }

    return (
        <div className="space-y-6">
            {/* Toast */}
            {message && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium shadow-lg ${message.type === "success" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
                    {message.text}
                </div>
            )}

            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-border mb-6 pb-2">
                <button
                    onClick={() => setActiveTab("toggles")}
                    className={`px-4 py-2 text-sm font-medium transition-all border-b-2 -mb-[9px] ${activeTab === "toggles" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                >
                    Feature Flags
                </button>
                <button
                    onClick={() => setActiveTab("configs")}
                    className={`px-4 py-2 text-sm font-medium transition-all border-b-2 -mb-[9px] ${activeTab === "configs" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                >
                    Component Configurations
                </button>
            </div>

            {activeTab === "toggles" ? (
                <>
                    {/* Stats bar */}
                    <div className="flex items-center gap-6 mb-2">
                        <div className="text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground">
                                {Object.values(localState).filter(val => val === true).length}
                            </span>{" "}
                            of {Object.keys(localState).length} boolean features enabled
                        </div>
                    </div>

                    {settingGroups.map((group) => {
                const groupSettings = group.keys.map(k => flatSettingsMap[k]).filter(Boolean);
                const enabledCount = groupSettings.filter(s => localState[s.key] === true).length;
                const totalBooleans = groupSettings.filter(s => typeof localState[s.key] === 'boolean').length;

                if (groupSettings.length === 0 && group.id !== "recognition") return null;

                return (
                    <div key={group.id} className={`glass rounded-xl overflow-hidden bg-gradient-to-br ${group.color}`}>
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-xl">{group.icon}</span>
                                <div>
                                    <h2 className="text-base font-bold">{group.title}</h2>
                                    {group.id !== "wip" && totalBooleans > 0 && (
                                        <p className="text-xs text-muted-foreground">
                                            {enabledCount} of {totalBooleans} enabled
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Settings list */}
                        {groupSettings.length > 0 ? (
                            <div className="divide-y divide-border/30">
                                {groupSettings.map((setting) => {
                                    const value = localState[setting.key];
                                    const isBoolean = typeof value === "boolean";

                                    return (
                                        <div
                                            key={setting.key}
                                            className="flex items-center justify-between px-6 py-4 hover:bg-surface/30 transition-colors"
                                        >
                                            <div className="flex-1 min-w-0 pr-4 mt-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-sm font-semibold text-foreground">
                                                        {setting.label}
                                                    </h3>
                                                    {isBoolean && value === true && (
                                                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-500/15 text-green-400">
                                                            ON
                                                        </span>
                                                    )}
                                                    {group.id === "wip" && (
                                                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-500/15 text-orange-400">
                                                            WIP
                                                        </span>
                                                    )}
                                                </div>
                                                {setting.description && (
                                                    <p className="text-xs text-muted-foreground mt-1 whitespace-normal break-words leading-relaxed">
                                                        {setting.description}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Control */}
                                            {setting.key === "site_template" ? (
                                                <select
                                                    value={String(value).replace(/"/g, "")}
                                                    onChange={(e) => handleChange(setting.key, e.target.value)}
                                                    disabled={isPending}
                                                    className="bg-surface border border-border rounded-lg text-xs px-2 py-1 focus:ring-2 focus:ring-primary/50 outline-none"
                                                >
                                                    <option value="classic">Old UI (Legacy)</option>
                                                    <option value="ceramic">New Ceramic UI (Default)</option>
                                                    <option value="ceramic-light">Ceramic Light (Tactile Minimalism)</option>
                                                    <option value="glass-dark">Glass Exec Dark (Secondary)</option>
                                                    <option value="light-modern">Light Exec Modern Legacy</option>
                                                    <option value="premium">Premium Themes Ext.</option>
                                                    <option value="compact-ceramic">Compact Ceramic Light (Premium)</option>
                                                </select>
                                            ) : setting.key === "navbar_style" ? (
                                                <select
                                                    value={String(value).replace(/"/g, "")}
                                                    onChange={(e) => handleChange(setting.key, e.target.value)}
                                                    disabled={isPending}
                                                    className="bg-surface border border-border rounded-lg text-xs px-2 py-1 focus:ring-2 focus:ring-primary/50 outline-none"
                                                >
                                                    <option value="solid">Solid</option>
                                                    <option value="glass">Glass</option>
                                                    <option value="floating">Floating</option>
                                                </select>
                                            ) : (
                                                <button
                                                    onClick={() => handleChange(setting.key, !value)}
                                                    disabled={isPending}
                                                    className={`
                                                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out
                                                    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background
                                                    ${value ? "bg-primary" : "bg-border"}
                                                    ${isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                                                `}
                                                >
                                                    <span
                                                        className={`
                                                        inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out
                                                        ${value ? "translate-x-6" : "translate-x-1"}
                                                    `}
                                                    />
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="px-6 py-8 text-center text-muted-foreground text-sm flex flex-col items-center">
                                <span className="text-3xl mb-2 grayscale opacity-50">{group.icon}</span>
                                No flags active in this category
                            </div>
                        )}
                    </div>
                );
            })}
                </>
            ) : (
                <div className="glass rounded-xl p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                    <InfraCostEditor 
                        settingKey="config_infra_cost"
                        initialConfig={
                            typeof flatSettingsMap["config_infra_cost"]?.value === "string" 
                            ? JSON.parse(flatSettingsMap["config_infra_cost"].value as string)
                            : (flatSettingsMap["config_infra_cost"]?.value || [])
                        } 
                    />
                </div>
            )}
        </div>
    );
}
