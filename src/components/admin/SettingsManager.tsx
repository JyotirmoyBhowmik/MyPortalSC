"use client";

import { useState, useTransition } from "react";
import { toggleFeature, updateSettingValue } from "@/app/admin/actions/settings";
import type { SiteSetting } from "@/lib/data/settings";

const tierLabels: Record<string, { label: string; icon: string; color: string }> = {
    tier1: { label: "Tier 1 — Executive Presence & i18n", icon: "🏛️", color: "from-blue-500/10 to-indigo-500/10" },
    tier2: { label: "Tier 2 — Security & Trust", icon: "🔒", color: "from-red-500/10 to-rose-500/10" },
    tier3: { label: "Tier 3 — Visual Excellence", icon: "🎨", color: "from-purple-500/10 to-violet-500/10" },
    tier4: { label: "Tier 4 — Data & Analytics", icon: "📊", color: "from-emerald-500/10 to-green-500/10" },
    tier5: { label: "Tier 5 — Admin Power Features", icon: "🛠️", color: "from-amber-500/10 to-yellow-500/10" },
    tier6: { label: "Tier 6 — SEO & Performance", icon: "🌐", color: "from-cyan-500/10 to-teal-500/10" },
    tier7: { label: "Tier 7 — Enterprise Features", icon: "🏢", color: "from-pink-500/10 to-rose-500/10" },
    appearance: { label: "Appearance & Theme", icon: "🖌️", color: "from-pink-500/10 to-purple-500/10" },
    general: { label: "General", icon: "⚙️", color: "from-gray-500/10 to-slate-500/10" },
};

const tierOrder = ["appearance", "tier1", "tier2", "tier3", "tier4", "tier5", "tier6", "tier7", "general"];

interface Props {
    grouped: Record<string, SiteSetting[]>;
}

export default function SettingsManager({ grouped }: Props) {
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [localState, setLocalState] = useState<Record<string, any>>(() => {
        const state: Record<string, any> = {};
        for (const settings of Object.values(grouped)) {
            for (const s of settings) {
                // Parse value if it is a string boolean, otherwise keep as is
                let val = s.value;
                if (val === "true") val = true;
                if (val === "false") val = false;
                state[s.key] = val;
            }
        }
        return state;
    });

    function handleChange(key: string, newValue: any) {
        const oldValue = localState[key];
        setLocalState((prev) => ({ ...prev, [key]: newValue }));

        startTransition(async () => {
            // Use updateSettingValue for everything (it handles booleans too)
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

    const sortedCategories = tierOrder.filter((t) => grouped[t]);

    return (
        <div className="space-y-6">
            {/* Toast */}
            {message && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium shadow-lg ${message.type === "success" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
                    {message.text}
                </div>
            )}

            {/* Stats bar */}
            <div className="flex items-center gap-6 mb-2">
                <div className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">
                        {Object.values(localState).filter(Boolean).length}
                    </span>{" "}
                    of {Object.keys(localState).length} features enabled
                </div>
            </div>

            {sortedCategories.map((category) => {
                const tier = tierLabels[category] || tierLabels.general;
                const settings = grouped[category];
                // Count enabled only for booleans
                const enabledCount = settings.filter((s) => localState[s.key] === true).length;

                return (
                    <div key={category} className={`glass rounded-xl overflow-hidden bg-gradient-to-br ${tier.color}`}>
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-xl">{tier.icon}</span>
                                <div>
                                    <h2 className="text-base font-bold">{tier.label}</h2>
                                    {category !== "appearance" && (
                                        <p className="text-xs text-muted-foreground">
                                            {enabledCount} of {settings.length} enabled
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Settings list */}
                        <div className="divide-y divide-border/30">
                            {settings.map((setting) => {
                                const value = localState[setting.key];
                                const isBoolean = typeof value === "boolean" || value === "true" || value === "false";

                                return (
                                    <div
                                        key={setting.key}
                                        className="flex items-center justify-between px-6 py-4 hover:bg-surface/30 transition-colors"
                                    >
                                        <div className="flex-1 min-w-0 pr-4">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-sm font-semibold text-foreground">
                                                    {setting.label}
                                                </h3>
                                                {isBoolean && value === true && (
                                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-500/15 text-green-400">
                                                        ON
                                                    </span>
                                                )}
                                            </div>
                                            {setting.description && (
                                                <p className="text-xs text-muted-foreground mt-0.5 truncate">
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
                                                <option value="classic">Classic</option>
                                                <option value="premium">Premium</option>
                                                <option value="glass">Glass</option>
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
                    </div>
                );
            })}
        </div>
    );
}
