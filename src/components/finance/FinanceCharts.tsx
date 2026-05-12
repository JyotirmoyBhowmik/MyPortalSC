"use client";

import { useEffect, useState } from "react";
import { convertToINR, formatINR } from "@/lib/utils/currency";
import type { DashboardBudget } from "@/lib/data/finances";

interface Props {
    budgets: DashboardBudget[];
}

export default function FinanceCharts({ budgets }: Props) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            setMounted(true);
        }
        return () => { isMounted = false };
    }, []);

    if (!mounted) return null;

    // Helper using row's custom INR rate if available, fallbacks to static rate
    const safelyGetINR = (amount: number, row: DashboardBudget) => {
        if (row.exchange_rate_to_inr && row.exchange_rate_to_inr > 0 && row.currency !== 'INR') {
            return amount * row.exchange_rate_to_inr;
        }
        return convertToINR(amount, row.currency || "INR");
    };

    // Calculate Totals specifically
    const opExTotal = budgets
        .filter(b => b.investment_model === 'OpEx')
        .reduce((sum, b) => sum + safelyGetINR(b.expense_amount, b), 0);
        
    const capExTotal = budgets
        .filter(b => b.investment_model === 'CapEx')
        .reduce((sum, b) => sum + safelyGetINR(b.expense_amount, b), 0);
        
    const totalExpense = opExTotal + capExTotal;

    const opExPlan = budgets
        .filter(b => b.investment_model === 'OpEx')
        .reduce((sum, b) => sum + safelyGetINR(b.planning_amount, b), 0);
        
    const capExPlan = budgets
        .filter(b => b.investment_model === 'CapEx')
        .reduce((sum, b) => sum + safelyGetINR(b.planning_amount, b), 0);
        
    const totalPlan = opExPlan + capExPlan;

    // Build Cost Center aggregated Subtotals
    const costCenterMap: Record<string, { opex: number, capex: number }> = {};
    budgets.forEach(b => {
        const cc = b.cost_center || 'Unassigned';
        if (!costCenterMap[cc]) {
            costCenterMap[cc] = { opex: 0, capex: 0 };
        }
        const val = safelyGetINR(b.expense_amount, b);
        if (b.investment_model === 'OpEx') {
            costCenterMap[cc].opex += val;
        } else {
            costCenterMap[cc].capex += val;
        }
    });

    const costCenters = Object.entries(costCenterMap)
        .map(([name, data]) => ({ name, opex: data.opex, capex: data.capex, total: data.opex + data.capex }))
        .sort((a, b) => b.total - a.total);


    return (
        <section className="print:break-inside-avoid print:mt-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <h2 className="text-2xl font-bold print:text-xl">Financial Overview (Converted to INR)</h2>
                <div className="text-sm font-medium text-muted-foreground px-3 py-1.5 bg-surface rounded-full border border-border shadow-sm flex items-center gap-2">
                    Total Enterprise Allocation: <span className="text-primary font-black text-base">{formatINR(totalPlan)}</span>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* OpEx vs CapEx Breakdown */}
                <div className="glass rounded-xl p-6 relative overflow-hidden group hover:scale-[1.01] transition-transform">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/></svg>
                    </div>
                    <h3 className="font-bold text-foreground mb-4 text-lg">Investment Aggregation</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-semibold text-blue-400">Operational Expenditure (OpEx Subtotal)</span>
                                <span>{formatINR(opExTotal)} <span className="text-xs text-muted-foreground">/ {formatINR(opExPlan)}</span></span>
                            </div>
                            <div className="w-full bg-background rounded-full h-2.5 border border-border/50">
                                <div className="bg-blue-400 h-2.5 rounded-full" style={{ width: `${Math.min((opExTotal / (opExPlan || 1)) * 100, 100)}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-semibold text-purple-400">Capital Expenditure (CapEx Subtotal)</span>
                                <span>{formatINR(capExTotal)} <span className="text-xs text-muted-foreground">/ {formatINR(capExPlan)}</span></span>
                            </div>
                            <div className="w-full bg-background rounded-full h-2.5 border border-border/50">
                                <div className="bg-purple-400 h-2.5 rounded-full" style={{ width: `${Math.min((capExTotal / (capExPlan || 1)) * 100, 100)}%` }}></div>
                            </div>
                        </div>
                    </div>
                     <div className="mt-8 pt-4 border-t border-border/50 text-right">
                         <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1 flex items-center justify-end gap-2">Final Output Total</div>
                         <div className="text-3xl font-black font-mono tracking-tight">{formatINR(totalExpense)}</div>
                    </div>
                </div>

                {/* Subtotals Grouped by Cost Center */}
                <div className="glass rounded-xl p-6 overflow-hidden hover:scale-[1.01] transition-transform">
                    <h3 className="font-bold text-foreground mb-4 text-lg">Subtotals by Cost Center</h3>
                    <div className="space-y-4 max-h-[250px] overflow-y-auto">
                        {costCenters.map(cc => (
                            <div key={cc.name} className="group cursor-default border-b border-border/50 pb-2 last:border-none">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-foreground">{cc.name}</span>
                                    <span className="font-mono text-muted-foreground group-hover:text-primary transition-colors">{formatINR(cc.total)}</span>
                                </div>
                                <div className="flex text-[10px] text-muted-foreground gap-3">
                                    {cc.opex > 0 && <span>OpEx: {formatINR(cc.opex)}</span>}
                                    {cc.capex > 0 && <span>CapEx: {formatINR(cc.capex)}</span>}
                                </div>
                            </div>
                        ))}
                        {costCenters.length === 0 && <p className="text-sm text-muted-foreground italic">No cost centers mapped yet.</p>}
                    </div>
                </div>
            </div>
        </section>
    );
}
