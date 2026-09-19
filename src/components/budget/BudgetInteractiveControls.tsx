"use client";

import React, { useState } from "react";
import { formatCurrency } from "@/lib/utils/currency";
import type { DashboardBudget } from "@/lib/data/finances";

interface Props {
    budgets: DashboardBudget[];
    grandPlanINR: number;
    grandExpenseINR: number;
    capexTotalINR: number;
    opexTotalINR: number;
}

export default function BudgetInteractiveControls({
    budgets,
    grandPlanINR,
    grandExpenseINR,
    capexTotalINR,
    opexTotalINR,
}: Props) {
    // Interactive states
    const [selectedCurrency, setSelectedCurrency] = useState<string>("INR");
    const [isScenarioOpen, setIsScenarioOpen] = useState(false);
    const [inflationPct, setInflationPct] = useState<number>(0);
    const [capexShiftPct, setCapexShiftPct] = useState<number>(0);

    // Calculate scenario values
    const inflationMultiplier = 1 + inflationPct / 100;
    const capexShiftFraction = capexShiftPct / 100;

    // Shift capex to opex based on slider
    const simulatedCapex = (capexTotalINR * (1 - capexShiftFraction)) * inflationMultiplier;
    const simulatedOpex = (opexTotalINR + (capexTotalINR * capexShiftFraction)) * inflationMultiplier;
    const simulatedExpense = (grandExpenseINR * inflationMultiplier);
    const simulatedPlan = grandPlanINR; // Baseline planned budget remains fixed
    const simulatedVariance = simulatedPlan > 0 ? ((simulatedExpense - simulatedPlan) / simulatedPlan) * 100 : 0;
    const costDelta = simulatedExpense - grandExpenseINR;

    // CSV Exporter
    const handleExportCSV = () => {
        if (!budgets || budgets.length === 0) return;

        const headers = [
            "Fiscal Year",
            "Line Item Title",
            "Investment Model",
            "Original Planning Amount",
            "Original Expense Amount",
            "Original Currency",
            "Carry Over Amount",
            "Status"
        ];

        const rows = budgets.map((b) => [
            `"${(b.fiscal_year || "").replace(/"/g, '""')}"`,
            `"${(b.title || "").replace(/"/g, '""')}"`,
            `"${(b.investment_model || "").replace(/"/g, '""')}"`,
            b.planning_amount ?? 0,
            b.expense_amount ?? 0,
            `"${(b.currency || "USD").replace(/"/g, '""')}"`,
            b.carry_over_amount ?? 0,
            `"${(b.status || "Approved").replace(/"/g, '""')}"`
        ]);

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `enterprise_it_budget_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="mb-8 space-y-4 print:hidden">
            {/* Control Bar */}
            <div className="glass rounded-2xl p-4 border border-border/80 flex flex-wrap items-center justify-between gap-4">
                {/* Currency Selector */}
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Currency:</span>
                    <div className="inline-flex rounded-lg bg-surface border border-border p-1">
                        {[
                            { code: "INR", label: "₹ INR" },
                            { code: "USD", label: "$ USD" },
                            { code: "EUR", label: "€ EUR" },
                            { code: "GBP", label: "£ GBP" },
                        ].map((c) => (
                            <button
                                key={c.code}
                                type="button"
                                onClick={() => setSelectedCurrency(c.code)}
                                className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                                    selectedCurrency === c.code
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                                }`}
                            >
                                {c.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setIsScenarioOpen(!isScenarioOpen)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all flex items-center gap-1.5 ${
                            isScenarioOpen
                                ? "bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-sm"
                                : "bg-surface border-border text-muted-foreground hover:bg-background hover:text-foreground"
                        }`}
                    >
                        <span>📊</span>
                        <span>{isScenarioOpen ? "Close What-If Simulator" : "What-If Simulator"}</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleExportCSV}
                        className="px-3 py-1.5 rounded-lg border border-border bg-surface text-muted-foreground hover:bg-background hover:text-foreground text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
                        title="Download complete ledger as CSV"
                    >
                        <span>📥</span>
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>

            {/* Currency Converted Snapshot (when foreign currency selected) */}
            {selectedCurrency !== "INR" && (
                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-foreground font-medium">
                            Displaying converted values in <strong>{selectedCurrency}</strong> (at indicative corporate treasury exchange rates)
                        </span>
                    </div>
                    <div className="flex items-center gap-4 font-mono font-bold text-foreground">
                        <span>Plan: {formatCurrency(grandPlanINR, selectedCurrency)}</span>
                        <span>Spent: {formatCurrency(grandExpenseINR, selectedCurrency)}</span>
                    </div>
                </div>
            )}

            {/* What-If Scenario Simulator Drawer */}
            {isScenarioOpen && (
                <div className="glass rounded-2xl p-6 border border-purple-500/30 bg-purple-950/10 shadow-xl space-y-6">
                    <div className="flex items-center justify-between border-b border-border/50 pb-3">
                        <div>
                            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                                <span>🔮</span>
                                <span>Executive "What-If" Sensitivity Simulator</span>
                            </h4>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Simulate macroeconomic inflation or strategic CapEx-to-OpEx cloud transition scenarios.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setInflationPct(0);
                                setCapexShiftPct(0);
                            }}
                            className="text-[11px] text-purple-400 hover:text-purple-300 underline font-medium"
                        >
                            Reset Sliders
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Inflation Slider */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-semibold text-foreground">Cost Variance / Inflation Adjustment:</span>
                                <span className="font-mono font-bold text-purple-400">
                                    {inflationPct > 0 ? `+${inflationPct}%` : `${inflationPct}%`}
                                </span>
                            </div>
                            <input
                                type="range"
                                min="-20"
                                max="20"
                                step="1"
                                value={inflationPct}
                                onChange={(e) => setInflationPct(Number(e.target.value))}
                                className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                            <div className="flex justify-between text-[10px] text-muted-foreground">
                                <span>-20% (Austerity)</span>
                                <span>0% (Baseline)</span>
                                <span>+20% (Inflation)</span>
                            </div>
                        </div>

                        {/* CapEx to OpEx Slider */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-semibold text-foreground">CapEx &rarr; OpEx Cloud Shift:</span>
                                <span className="font-mono font-bold text-purple-400">
                                    {capexShiftPct}%
                                </span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="50"
                                step="5"
                                value={capexShiftPct}
                                onChange={(e) => setCapexShiftPct(Number(e.target.value))}
                                className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                            <div className="flex justify-between text-[10px] text-muted-foreground">
                                <span>0% (Traditional On-Prem)</span>
                                <span>25% (Hybrid)</span>
                                <span>50% (Pure Cloud OpEx)</span>
                            </div>
                        </div>
                    </div>

                    {/* Simulated Results Matrix */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-background/60 border border-border">
                        <div>
                            <div className="text-[10px] text-muted-foreground uppercase font-bold">Simulated Spend</div>
                            <div className="text-base font-black text-foreground font-mono mt-0.5">
                                {formatCurrency(simulatedExpense, selectedCurrency)}
                            </div>
                            <div className={`text-[10px] font-semibold mt-0.5 ${costDelta > 0 ? "text-red-400" : costDelta < 0 ? "text-emerald-400" : "text-muted-foreground"}`}>
                                {costDelta > 0 ? `+${formatCurrency(costDelta, selectedCurrency)}` : costDelta < 0 ? `-${formatCurrency(Math.abs(costDelta), selectedCurrency)}` : "Baseline"}
                            </div>
                        </div>

                        <div>
                            <div className="text-[10px] text-muted-foreground uppercase font-bold">Simulated Variance</div>
                            <div className={`text-base font-black font-mono mt-0.5 ${simulatedVariance > 0 ? "text-red-400" : "text-emerald-400"}`}>
                                {simulatedVariance > 0 ? "+" : ""}{simulatedVariance.toFixed(1)}%
                            </div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">vs Baseline Plan</div>
                        </div>

                        <div>
                            <div className="text-[10px] text-purple-400 uppercase font-bold">Adjusted CapEx</div>
                            <div className="text-base font-black text-purple-400 font-mono mt-0.5">
                                {formatCurrency(simulatedCapex, selectedCurrency)}
                            </div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">
                                {capexShiftPct > 0 ? `-${capexShiftPct}% shifted` : "Unmodified"}
                            </div>
                        </div>

                        <div>
                            <div className="text-[10px] text-blue-400 uppercase font-bold">Adjusted OpEx</div>
                            <div className="text-base font-black text-blue-400 font-mono mt-0.5">
                                {formatCurrency(simulatedOpex, selectedCurrency)}
                            </div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">
                                {capexShiftPct > 0 ? `+${formatCurrency(simulatedOpex - opexTotalINR, selectedCurrency)}` : "Unmodified"}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
