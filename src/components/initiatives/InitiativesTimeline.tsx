"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Initiative {
    id: string;
    title: string;
    fiscal_year: string;
    strategic_area: string;
    criticality: "Critical" | "High" | "Medium" | "Low";
    programCode: string;
    programName: string;
}

interface Props {
    initiatives: Initiative[];
}

const criticalityColors: Record<string, { bar: string; text: string; bg: string }> = {
    Critical: { bar: "bg-red-500", text: "text-red-400", bg: "bg-red-500/10" },
    High: { bar: "bg-amber-500", text: "text-amber-400", bg: "bg-amber-500/10" },
    Medium: { bar: "bg-blue-500", text: "text-blue-400", bg: "bg-blue-500/10" },
    Low: { bar: "bg-slate-500", text: "text-slate-400", bg: "bg-slate-500/10" },
};

export default function InitiativesTimeline({ initiatives }: Props) {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    // Group by fiscal year
    const grouped = useMemo(() => {
        const map: Record<string, Initiative[]> = {};
        for (const init of initiatives) {
            const fy = init.fiscal_year || "Unknown";
            if (!map[fy]) map[fy] = [];
            map[fy].push(init);
        }
        // Sort fiscal years
        return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
    }, [initiatives]);

    return (
        <div className="space-y-8">
            {/* Legend */}
            <div className="flex flex-wrap gap-4 justify-center">
                {Object.entries(criticalityColors).map(([level, colors]) => (
                    <div key={level} className="flex items-center gap-2 text-xs">
                        <div className={`w-3 h-3 rounded-full ${colors.bar}`} />
                        <span className="text-muted-foreground">{level}</span>
                    </div>
                ))}
            </div>

            {/* Timeline */}
            <div className="relative">
                {/* Vertical spine */}
                <div className="absolute left-6 top-0 bottom-0 w-px bg-border/50 hidden md:block" />

                {grouped.map(([fy, items], fyIdx) => (
                    <div key={fy} className="mb-10">
                        {/* Fiscal Year Header */}
                        <div className="flex items-center gap-4 mb-4 relative">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm z-10 flex-shrink-0">
                                {fy}
                            </div>
                            <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
                            <span className="text-xs text-muted-foreground">{items.length} initiatives</span>
                        </div>

                        {/* Horizontal scrollable bar chart */}
                        <div className="ml-0 md:ml-16 space-y-2">
                            {items.map((init, idx) => {
                                const colors = criticalityColors[init.criticality] || criticalityColors.Medium;
                                const isExpanded = expandedId === init.id;

                                return (
                                    <motion.div
                                        key={init.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: fyIdx * 0.05 + idx * 0.03 }}
                                    >
                                        <button
                                            onClick={() => setExpandedId(isExpanded ? null : init.id)}
                                            className="w-full text-left group"
                                        >
                                            <div className="flex items-center gap-3">
                                                {/* Criticality dot */}
                                                <div className={`w-2.5 h-2.5 rounded-full ${colors.bar} flex-shrink-0`} />
                                                {/* Bar */}
                                                <div className="flex-1 relative">
                                                    <div
                                                        className={`h-9 rounded-lg ${colors.bg} border border-white/5 flex items-center px-3 gap-2 overflow-hidden group-hover:border-white/15 transition-colors cursor-pointer`}
                                                    >
                                                        <span className="text-xs font-medium text-foreground truncate flex-1">
                                                            {init.title}
                                                        </span>
                                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${colors.bg} ${colors.text} flex-shrink-0`}>
                                                            {init.criticality}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>

                                        {/* Expanded detail */}
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden ml-5"
                                                >
                                                    <div className="glass rounded-lg p-4 mt-2 text-sm space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-muted-foreground">Program:</span>
                                                            <span className="text-primary font-medium">{init.programName}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-muted-foreground">Strategic Area:</span>
                                                            <span className="text-foreground">{init.strategic_area}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-muted-foreground">Code:</span>
                                                            <span className="font-mono text-xs text-accent">{init.programCode}</span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
