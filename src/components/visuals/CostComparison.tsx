"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";

interface CostCategory {
    id?: string;
    name: string;
    onPrem: number;
    cloud: number;
    hybrid: number;
    icon: string;
}

const defaultCategories: CostCategory[] = [
    { name: "Compute", onPrem: 450, cloud: 280, hybrid: 340, icon: "⚡" },
    { name: "Storage", onPrem: 120, cloud: 85, hybrid: 95, icon: "💾" },
    { name: "Networking", onPrem: 80, cloud: 45, hybrid: 60, icon: "🌐" },
    { name: "Security", onPrem: 200, cloud: 150, hybrid: 170, icon: "🛡️" },
    { name: "Personnel", onPrem: 600, cloud: 250, hybrid: 400, icon: "👨‍💻" },
    { name: "Power & Cooling", onPrem: 180, cloud: 0, hybrid: 90, icon: "❄️" },
    { name: "Licensing", onPrem: 300, cloud: 350, hybrid: 320, icon: "📜" },
    { name: "DR / Backup", onPrem: 250, cloud: 120, hybrid: 180, icon: "🔄" },
];

const modelColors = {
    onPrem: { bar: "bg-red-500", text: "text-red-400" },
    cloud: { bar: "bg-blue-500", text: "text-blue-400" },
    hybrid: { bar: "bg-green-500", text: "text-green-400" },
};

export default function CostComparison({ initialCategories }: { initialCategories?: CostCategory[] }) {
    const [serverCount, setServerCount] = useState(20);
    const categories = initialCategories || defaultCategories;

    const totals = useMemo(() => {
        const onPrem = categories.reduce((s, c) => s + c.onPrem, 0) * serverCount;
        const cloud = categories.reduce((s, c) => s + c.cloud, 0) * serverCount;
        const hybrid = categories.reduce((s, c) => s + c.hybrid, 0) * serverCount;
        return { onPrem, cloud, hybrid };
    }, [serverCount]);

    const savings = Math.round(((totals.onPrem - totals.hybrid) / totals.onPrem) * 100);
    const formatCurrency = (n: number) => n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}`;

    return (
        <div className="glass rounded-2xl p-6 sm:p-8 border border-border/50">
            <h3 className="text-xl font-bold mb-1 flex items-center gap-3">
                <span className="w-2 h-8 bg-primary rounded-full" />
                Infrastructure <span className="gradient-text">Cost Model</span>
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
                Estimated TCO comparison per month based on enterprise workloads.
            </p>

            {/* Server slider */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-foreground">Workload Scale</label>
                    <span className="text-sm font-mono text-primary font-bold">{serverCount} servers</span>
                </div>
                <input type="range" min="5" max="100" step="5" value={serverCount}
                    onChange={(e) => setServerCount(Number(e.target.value))}
                    className="w-full h-2 bg-surface rounded-full appearance-none cursor-pointer accent-primary" />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span>5</span><span>50</span><span>100</span>
                </div>
            </div>

            {/* Category bars */}
            <div className="space-y-3 mb-8">
                {categories.map((cat) => {
                    const maxCost = Math.max(cat.onPrem, cat.cloud, cat.hybrid);
                    return (
                        <div key={cat.name} className="space-y-1.5">
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-lg">{cat.icon}</span>
                                <span className="font-medium text-foreground flex-1">{cat.name}</span>
                            </div>
                            <div className="flex gap-1 h-5">
                                {(["onPrem", "cloud", "hybrid"] as const).map((model) => (
                                    <motion.div key={model}
                                        className={`${modelColors[model].bar} rounded-sm relative group`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(cat[model] / maxCost) * 100}%` }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                    >
                                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block text-[10px] bg-surface px-1.5 py-0.5 rounded shadow-lg whitespace-nowrap z-10 text-foreground border border-border/50">
                                            ${cat[model] * serverCount}/mo
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mb-6 justify-center">
                {[["On-Premises", "bg-red-500"], ["Full Cloud", "bg-blue-500"], ["Hybrid", "bg-green-500"]].map(([label, color]) => (
                    <div key={label} className="flex items-center gap-2 text-xs">
                        <div className={`w-3 h-3 rounded ${color}`} />
                        <span className="text-muted-foreground">{label}</span>
                    </div>
                ))}
            </div>

            {/* TCO Summary */}
            <div className="grid grid-cols-3 gap-3">
                {([
                    { label: "On-Premises", key: "onPrem" as const, color: modelColors.onPrem },
                    { label: "Full Cloud", key: "cloud" as const, color: modelColors.cloud },
                    { label: "Hybrid", key: "hybrid" as const, color: modelColors.hybrid },
                ]).map((model) => (
                    <div key={model.key} className="glass rounded-xl p-4 text-center">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{model.label}</p>
                        <p className={`text-xl font-bold font-mono ${model.color.text}`}>{formatCurrency(totals[model.key])}</p>
                        <p className="text-[10px] text-muted-foreground">/month</p>
                    </div>
                ))}
            </div>

            {/* Savings */}
            <div className="mt-4 rounded-lg bg-green-500/5 border border-green-500/20 p-3 text-center">
                <p className="text-sm text-green-400 font-medium">
                    Hybrid saves ~<span className="font-bold">{savings}%</span> vs on-prem
                    ({formatCurrency(totals.onPrem - totals.hybrid)}/mo at {serverCount} servers)
                </p>
            </div>
        </div>
    );
}
