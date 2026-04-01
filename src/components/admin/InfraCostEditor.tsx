"use client";

import { useState, useTransition } from "react";
import { updateSettingValue } from "@/app/admin/actions/settings";
import { v4 as uuidv4 } from "uuid";

interface CostCategory {
    id: string;
    name: string;
    onPrem: number;
    cloud: number;
    hybrid: number;
    icon: string;
}

interface Props {
    initialConfig: CostCategory[];
    settingKey: string;
}

export default function InfraCostEditor({ initialConfig, settingKey }: Props) {
    const [categories, setCategories] = useState<CostCategory[]>(initialConfig || []);
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleUpdate = (id: string, field: keyof CostCategory, value: string | number) => {
        setCategories(prev => prev.map(cat => {
            if (cat.id === id) {
                return { ...cat, [field]: value };
            }
            return cat;
        }));
    };

    const handleAdd = () => {
        setCategories(prev => [
            ...prev,
            { id: uuidv4(), name: "New Category", onPrem: 0, cloud: 0, hybrid: 0, icon: "📦" }
        ]);
    };

    const handleRemove = (id: string) => {
        setCategories(prev => prev.filter(cat => cat.id !== id));
    };

    const handleSave = async () => {
        startTransition(async () => {
            try {
                // Settings action expects a string (JSON will be parsed on server if the column is JSONB, 
                // but the action sets the jsonb column via a string parameter or object). 
                // Since our action accepts string values, we will stringify it.
                const res = await updateSettingValue(settingKey, JSON.stringify(categories));
                if (res.error) throw new Error(res.error);

                setMessage({ type: "success", text: "Configuration saved successfully!" });
                setTimeout(() => setMessage(null), 3000);
            } catch (err: any) {
                setMessage({ type: "error", text: err.message || "Failed to save configuration." });
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold">Infrastructure Cost Model</h3>
                    <p className="text-sm text-muted-foreground">Adjust the default values for the cost comparison tool.</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Category
                </button>
            </div>

            <div className="border border-border/50 rounded-xl overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-surface/50 border-b border-border/50 text-xs uppercase text-muted-foreground">
                        <tr>
                            <th className="px-4 py-3 font-medium">Icon & Name</th>
                            <th className="px-4 py-3 font-medium text-right">On-Premises ($)</th>
                            <th className="px-4 py-3 font-medium text-right">Full Cloud ($)</th>
                            <th className="px-4 py-3 font-medium text-right">Hybrid ($)</th>
                            <th className="px-4 py-3 font-medium text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50 bg-surface/20">
                        {categories.map((cat) => (
                            <tr key={cat.id} className="hover:bg-surface/30 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={cat.icon}
                                            onChange={(e) => handleUpdate(cat.id, "icon", e.target.value)}
                                            className="w-10 px-1 py-1.5 bg-background border border-border/50 rounded text-center focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                        />
                                        <input
                                            type="text"
                                            value={cat.name}
                                            onChange={(e) => handleUpdate(cat.id, "name", e.target.value)}
                                            className="w-full px-2 py-1.5 bg-background border border-border/50 rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-medium"
                                        />
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <input
                                        type="number"
                                        value={cat.onPrem}
                                        onChange={(e) => handleUpdate(cat.id, "onPrem", Number(e.target.value))}
                                        className="w-full px-2 py-1.5 bg-background border border-border/50 rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-right font-mono"
                                    />
                                </td>
                                <td className="px-4 py-3">
                                    <input
                                        type="number"
                                        value={cat.cloud}
                                        onChange={(e) => handleUpdate(cat.id, "cloud", Number(e.target.value))}
                                        className="w-full px-2 py-1.5 bg-background border border-border/50 rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-right font-mono"
                                    />
                                </td>
                                <td className="px-4 py-3">
                                    <input
                                        type="number"
                                        value={cat.hybrid}
                                        onChange={(e) => handleUpdate(cat.id, "hybrid", Number(e.target.value))}
                                        className="w-full px-2 py-1.5 bg-background border border-border/50 rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-right font-mono"
                                    />
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <button
                                        onClick={() => handleRemove(cat.id)}
                                        className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                                        title="Remove category"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between mt-4">
                {message ? (
                    <p className={`text-sm ${message.type === "error" ? "text-red-400" : "text-green-400"}`}>
                        {message.text}
                    </p>
                ) : <div />}

                <button
                    onClick={handleSave}
                    disabled={isPending}
                    className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50"
                >
                    {isPending ? (
                        <>
                            <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Save Configuration
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
