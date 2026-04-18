"use client";

import { useEffect, useState } from "react";
import { convertToINR, formatINR } from "@/lib/utils/currency";

interface DashboardBudget {
    id: string;
    title: string;
    fiscal_year: string;
    investment_model: string; // 'OpEx' or 'CapEx'
    planning_amount: number;
    outlook_amount: number;
    expense_amount: number;
    carry_over_amount: number;
    currency?: string;
}

interface Props {
    budgets: DashboardBudget[];
}

export default function FinanceCharts({ budgets }: Props) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    // Convert everything to INR internally for Chart representation
    const safelyGetINR = (amount: number, currency: string = "USD") => convertToINR(amount, currency);

    const opExTotal = budgets
        .filter(b => b.investment_model === 'OpEx')
        .reduce((sum, b) => sum + safelyGetINR(b.expense_amount, b.currency), 0);
        
    const capExTotal = budgets
        .filter(b => b.investment_model === 'CapEx')
        .reduce((sum, b) => sum + safelyGetINR(b.expense_amount, b.currency), 0);
        
    const totalExpense = opExTotal + capExTotal;

    const opExPlan = budgets
        .filter(b => b.investment_model === 'OpEx')
        .reduce((sum, b) => sum + safelyGetINR(b.planning_amount, b.currency), 0);
        
    const capExPlan = budgets
        .filter(b => b.investment_model === 'CapEx')
        .reduce((sum, b) => sum + safelyGetINR(b.planning_amount, b.currency), 0);
        
    const totalPlan = opExPlan + capExPlan;

    // Sort by expense desc in INR
    const topBudgets = [...budgets].sort((a, b) => 
        safelyGetINR(b.expense_amount, b.currency) - safelyGetINR(a.expense_amount, a.currency)
    ).slice(0, 3);

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
                    <h3 className="font-bold text-foreground mb-4 text-lg">Investment Matrix</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-semibold text-blue-400">Operational Expenditure (OpEx)</span>
                                <span>{formatINR(opExTotal)} <span className="text-xs text-muted-foreground">/ {formatINR(opExPlan)}</span></span>
                            </div>
                            <div className="w-full bg-background rounded-full h-2.5 border border-border/50">
                                <div className="bg-blue-400 h-2.5 rounded-full" style={{ width: `${Math.min((opExTotal / (opExPlan || 1)) * 100, 100)}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-semibold text-purple-400">Capital Expenditure (CapEx)</span>
                                <span>{formatINR(capExTotal)} <span className="text-xs text-muted-foreground">/ {formatINR(capExPlan)}</span></span>
                            </div>
                            <div className="w-full bg-background rounded-full h-2.5 border border-border/50">
                                <div className="bg-purple-400 h-2.5 rounded-full" style={{ width: `${Math.min((capExTotal / (capExPlan || 1)) * 100, 100)}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fiscal Year Top Budgets */}
                <div className="glass rounded-xl p-6 overflow-hidden hover:scale-[1.01] transition-transform">
                    <h3 className="font-bold text-foreground mb-4 text-lg">Top Initiatives by Expense</h3>
                    <div className="space-y-4">
                        {topBudgets.map(b => (
                            <div key={b.id} className="group cursor-default">
                                <div className="flex justify-between text-sm mb-1">
                                    <div className="flex items-center gap-2 truncate pr-2">
                                        <span className="font-medium truncate" title={b.title}>{b.title}</span>
                                        <span className="text-[10px] bg-surface border border-border px-1.5 rounded text-muted-foreground">{b.fiscal_year}</span>
                                    </div>
                                    <span className="flex-shrink-0 font-mono text-muted-foreground group-hover:text-primary transition-colors">{formatINR(safelyGetINR(b.expense_amount, b.currency))}</span>
                                </div>
                                <div className="w-full bg-background rounded-full h-1.5 border border-border/50 overflow-hidden">
                                     <div className={`h-1.5 rounded-full transition-all duration-1000 ease-out ${b.investment_model === 'OpEx' ? 'bg-blue-400/80 shadow-[0_0_8px_rgba(96,165,250,0.5)]' : 'bg-purple-400/80 shadow-[0_0_8px_rgba(192,132,252,0.5)]'}`} style={{ width: `${Math.min((safelyGetINR(b.expense_amount, b.currency) / (safelyGetINR(b.planning_amount, b.currency) || 1)) * 100, 100)}%` }}></div>
                                </div>
                            </div>
                        ))}
                        {budgets.length === 0 && <p className="text-sm text-muted-foreground italic">No financial data mapped yet.</p>}
                    </div>
                    {budgets.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-border/50 text-right">
                             <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Final Total Output</div>
                             <div className="text-2xl font-black font-mono tracking-tight">{formatINR(totalExpense)}</div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
