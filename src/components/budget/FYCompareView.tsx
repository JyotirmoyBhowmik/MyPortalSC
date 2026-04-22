"use client";

import { useState } from "react";
import { DashboardBudget } from "@/lib/data/finances";
import { formatINR, convertToINR } from "@/lib/utils/currency";

interface Props {
    allBudgets: DashboardBudget[];
    fiscalYears: { id: string; label: string }[];
    defaultFy1: string;
    defaultFy2: string;
}

export default function FYCompareView({ allBudgets, fiscalYears, defaultFy1, defaultFy2 }: Props) {
    const [fy1, setFy1] = useState(defaultFy1);
    const [fy2, setFy2] = useState(defaultFy2);

    const toINR = (b: DashboardBudget): number => {
        if (b.exchange_rate_to_inr && b.exchange_rate_to_inr > 0 && b.currency !== "INR") {
            return b.expense_amount * b.exchange_rate_to_inr;
        }
        return convertToINR(b.expense_amount, b.currency || "INR");
    };

    const getMetrics = (fy: string) => {
        const items = allBudgets.filter(b => b.fiscal_year === fy);
        const capexItems = items.filter(b => b.investment_model === "CapEx");
        const opexItems = items.filter(b => b.investment_model === "OpEx");
        
        return {
            items,
            total: items.reduce((s, b) => s + toINR(b), 0),
            capex: capexItems.reduce((s, b) => s + toINR(b), 0),
            opex: opexItems.reduce((s, b) => s + toINR(b), 0),
            itemCount: items.length,
            projectsCount: items.filter(b => b.project_id).length,
            initiativesCount: items.filter(b => b.initiative_id).length,
        };
    };

    const m1 = getMetrics(fy1);
    const m2 = getMetrics(fy2);

    const calcGrowth = (oldVal: number, newVal: number) => {
        if (oldVal === 0) return newVal > 0 ? 100 : 0;
        return ((newVal - oldVal) / oldVal) * 100;
    };

    const formatGrowth = (pct: number) => {
        if (pct === 0) return <span className="text-muted-foreground">0.0%</span>;
        if (pct > 0) return <span className="text-red-400">+{pct.toFixed(1)}%</span>;
        return <span className="text-emerald-400">{pct.toFixed(1)}%</span>;
    };

    const renderColumn = (fy: string, setter: (val: string) => void, metrics: ReturnType<typeof getMetrics>) => (
        <div className="flex-1 min-w-0 bg-surface/40 rounded-2xl border border-border/50 p-6">
            <div className="mb-6">
                <select
                    value={fy}
                    onChange={(e) => setter(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-lg font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow appearance-none"
                >
                    <option value="">-- Select FY --</option>
                    {fiscalYears.map(f => (
                        <option key={f.id} value={f.label}>{f.label}</option>
                    ))}
                </select>
            </div>

            {fy ? (
                <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-background/50 border border-border/50">
                        <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Total Expenses</div>
                        <div className="text-3xl font-black font-mono text-foreground">{formatINR(metrics.total)}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
                            <div className="text-xs text-purple-400 uppercase tracking-widest font-bold mb-1">CapEx</div>
                            <div className="text-xl font-bold font-mono text-purple-300">{formatINR(metrics.capex)}</div>
                        </div>
                        <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                            <div className="text-xs text-blue-400 uppercase tracking-widest font-bold mb-1">OpEx</div>
                            <div className="text-xl font-bold font-mono text-blue-300">{formatINR(metrics.opex)}</div>
                        </div>
                    </div>
                    <div className="pt-4 border-t border-border/50">
                        <h4 className="font-semibold text-sm mb-3">Line Items ({metrics.itemCount})</h4>
                        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {metrics.items.map(b => (
                                <div key={b.id} className="flex justify-between items-start gap-4 text-sm p-2 rounded-lg hover:bg-surface transition-colors">
                                    <div>
                                        <div className="font-medium">{b.title}</div>
                                        <div className="text-[10px] text-muted-foreground mt-0.5">
                                            {b.investment_model} {b.cost_center ? `• ${b.cost_center}` : ''}
                                        </div>
                                    </div>
                                    <div className="font-mono text-xs text-right shrink-0">{formatINR(toINR(b))}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground italic">
                    Select a Fiscal Year
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col lg:flex-row gap-6">
                {renderColumn(fy1, setFy1, m1)}
                
                {fy1 && fy2 && (
                    <div className="flex lg:flex-col items-center justify-center gap-2 shrink-0 px-2 lg:py-16">
                        <div className="w-px h-8 lg:w-8 lg:h-px bg-border"></div>
                        <div className="bg-surface border border-border rounded-full p-3 shadow-lg">
                            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                        </div>
                        <div className="w-px h-8 lg:w-8 lg:h-px bg-border"></div>
                    </div>
                )}

                {renderColumn(fy2, setFy2, m2)}
            </div>

            {fy1 && fy2 && (
                <div className="glass rounded-2xl border border-border/50 p-6">
                    <h3 className="text-xl font-bold mb-6">Variance Analysis ({fy1} vs {fy2})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 rounded-xl bg-surface/50 border border-border">
                            <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Total Variance</div>
                            <div className="text-2xl font-black font-mono mb-2">{formatGrowth(calcGrowth(m1.total, m2.total))}</div>
                            <div className="text-xs text-muted-foreground">Absolute: {formatINR(m2.total - m1.total)}</div>
                        </div>
                        <div className="p-4 rounded-xl bg-surface/50 border border-border">
                            <div className="text-xs text-purple-400 uppercase tracking-wider font-bold mb-1">CapEx Variance</div>
                            <div className="text-2xl font-black font-mono mb-2">{formatGrowth(calcGrowth(m1.capex, m2.capex))}</div>
                            <div className="text-xs text-muted-foreground">Absolute: {formatINR(m2.capex - m1.capex)}</div>
                        </div>
                        <div className="p-4 rounded-xl bg-surface/50 border border-border">
                            <div className="text-xs text-blue-400 uppercase tracking-wider font-bold mb-1">OpEx Variance</div>
                            <div className="text-2xl font-black font-mono mb-2">{formatGrowth(calcGrowth(m1.opex, m2.opex))}</div>
                            <div className="text-xs text-muted-foreground">Absolute: {formatINR(m2.opex - m1.opex)}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
