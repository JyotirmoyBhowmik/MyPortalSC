import { Metadata } from "next";
import { getAllBudgets } from "@/lib/data/finances";
import { formatINR, convertToINR } from "@/lib/utils/currency";
import AnimatedSection from "@/components/animations/AnimatedSection";
import { BudgetVarianceChart, BudgetTrendChart, PrintExportButton } from "@/components/budget/BudgetCharts";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Enterprise IT Financial Ledger — SOW/Budget Tracker",
    description: "10-year IT Roadmap financial view: CAPEX & OPEX breakdown by fiscal year with project & regular expense mapping.",
};

export const revalidate = 60;

// Categorize a budget item
function categorize(b: any): "capex_project" | "capex_regular" | "opex_project" | "opex_regular" {
    const isProject = !!(b.initiative_id || b.project_id);
    if (b.investment_model === "CapEx") return isProject ? "capex_project" : "capex_regular";
    return isProject ? "opex_project" : "opex_regular";
}

// Row INR conversion
function toINR(b: any): number {
    if (b.exchange_rate_to_inr && b.exchange_rate_to_inr > 0 && b.currency !== "INR") {
        return b.expense_amount * b.exchange_rate_to_inr;
    }
    return convertToINR(b.expense_amount, b.currency || "INR");
}
function planINR(b: any): number {
    if (b.exchange_rate_to_inr && b.exchange_rate_to_inr > 0 && b.currency !== "INR") {
        return b.planning_amount * b.exchange_rate_to_inr;
    }
    return convertToINR(b.planning_amount, b.currency || "INR");
}

function fmtLakhs(n: number): string {
    if (n >= 10000000) return `${(n / 10000000).toFixed(1)}Cr`;
    if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
    return n.toLocaleString("en-IN");
}

// FY ordering (descending for table)
const FY_ORDER = [
    "2030-31","2029-30","2028-29","2027-28","2026-27",
    "2025-26","2024-25","2023-24","2022-23","2021-22",
    "2020-21","2019-20","2018-19","2017-18","2016-17"
];

const renderStatusDot = (status: string | undefined) => {
    if (status === 'Approved') return 'bg-emerald-500';
    if (status === 'Submitted') return 'bg-blue-500';
    if (status === 'Closed') return 'bg-slate-500';
    return 'bg-yellow-500';
};

export default async function BudgetPage({ searchParams }: { searchParams: Promise<{ role?: string; forecast?: string }> }) {
    const rawBudgets = await getAllBudgets();
    const params = await searchParams;

    // Point 15: Budget Forecasting
    const budgets = [...rawBudgets];
    const isForecast = params.forecast === 'true';
    if (isForecast) {
        // Calculate average historical CapEx and OpEx
        const histCapEx = budgets.filter(b => b.investment_model === 'CapEx').reduce((s, b) => s + b.expense_amount, 0);
        const histOpEx = budgets.filter(b => b.investment_model === 'OpEx').reduce((s, b) => s + b.expense_amount, 0);
        const histYears = new Set(budgets.map(b => b.fiscal_year)).size || 1;
        
        const avgCapEx = histCapEx / histYears;
        const avgOpEx = histOpEx / histYears;
        
        const forecastYears = ["2026-27", "2027-28", "2028-29", "2029-30", "2030-31"];
        forecastYears.forEach((fy, idx) => {
            if (!budgets.some(b => b.fiscal_year === fy)) {
                // Add 5% YoY growth
                const growth = Math.pow(1.05, idx + 1);
                budgets.push({
                    id: `forecast-capex-${fy}`, title: `Forecasted CapEx Plan`, fiscal_year: fy, investment_model: 'CapEx',
                    planning_amount: avgCapEx * growth, expense_amount: 0, carry_over_amount: 0, outlook_amount: 0,
                    project_id: null, initiative_id: null, skill_id: null, currency: 'USD', status: 'Draft'
                });
                budgets.push({
                    id: `forecast-opex-${fy}`, title: `Forecasted OpEx Run-Rate`, fiscal_year: fy, investment_model: 'OpEx',
                    planning_amount: avgOpEx * growth, expense_amount: 0, carry_over_amount: 0, outlook_amount: 0,
                    project_id: null, initiative_id: null, skill_id: null, currency: 'USD', status: 'Draft'
                });
            }
        });
    }

    const role = params.role || 'CFO';

    // Group by FY
    const byFY: Record<string, any[]> = {};
    budgets.forEach(b => {
        if (!byFY[b.fiscal_year]) byFY[b.fiscal_year] = [];
        byFY[b.fiscal_year].push(b);
    });

    const sortedFYs = FY_ORDER.filter(fy => byFY[fy]);

    // Grand totals
    const grandPlan = budgets.reduce((s, b) => s + planINR(b), 0);
    const grandExpense = budgets.reduce((s, b) => s + toINR(b), 0);
    const capexTotal = budgets.filter(b => b.investment_model === "CapEx").reduce((s, b) => s + toINR(b), 0);
    const opexTotal = budgets.filter(b => b.investment_model === "OpEx").reduce((s, b) => s + toINR(b), 0);
    const variancePct = grandPlan > 0 ? ((grandExpense - grandPlan) / grandPlan * 100) : 0;

    // Chart data (per FY)
    const chartData = sortedFYs.map(fy => {
        const items = byFY[fy];
        const planned = items.reduce((s: number, b: any) => s + planINR(b), 0);
        const spent = items.reduce((s: number, b: any) => s + toINR(b), 0);
        const capex = items.filter((b: any) => b.investment_model === "CapEx").reduce((s: number, b: any) => s + toINR(b), 0);
        const opex = items.filter((b: any) => b.investment_model === "OpEx").reduce((s: number, b: any) => s + toINR(b), 0);
        return { fy, planned, spent, capex, opex, variance: planned > 0 ? (spent - planned) / planned * 100 : 0 };
    });

    return (
        <div className="py-20 px-4 min-h-screen relative print:py-4 print:px-2">
            {/* Background watermark */}
            <div className="absolute top-0 right-0 p-20 opacity-[0.03] pointer-events-none print:hidden">
                <svg className="w-80 h-80" fill="currentColor" viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>
            </div>
            
            <div className="max-w-[1400px] mx-auto relative z-10">
                {/* Header */}
                <AnimatedSection>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-12">
                        <div className="text-center md:text-left flex-1">
                            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-widest mb-4">
                                IT Financial Controller View
                            </div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 tracking-tight">
                                Enterprise <span className="gradient-text">Financial Ledger</span>
                            </h1>
                            <p className="text-base text-muted-foreground max-w-3xl leading-relaxed">
                                10-Year IT Roadmap SOW — Statement of Work & Budget Tracker.<br/>
                                <span className="text-xs opacity-70">Showing {budgets.length} budget line items across {sortedFYs.length} fiscal years</span>
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 items-end">
                            <div className="flex bg-surface border border-border rounded-lg p-1 print:hidden">
                                <Link href={`?role=CTO${isForecast ? '&forecast=true' : ''}`} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${role === 'CTO' ? 'bg-primary text-primary-foreground' : 'hover:bg-background text-muted-foreground'}`}>CTO View</Link>
                                <Link href={`?role=CFO${isForecast ? '&forecast=true' : ''}`} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${role === 'CFO' ? 'bg-primary text-primary-foreground' : 'hover:bg-background text-muted-foreground'}`}>CFO View</Link>
                                <Link href={`?role=IT_MANAGER${isForecast ? '&forecast=true' : ''}`} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${role === 'IT_MANAGER' ? 'bg-primary text-primary-foreground' : 'hover:bg-background text-muted-foreground'}`}>IT Manager</Link>
                            </div>
                            <div className="flex gap-2">
                                <Link href={`?role=${role}${!isForecast ? '&forecast=true' : ''}`} className={`px-3 py-1.5 rounded border text-xs font-bold transition-colors print:hidden ${isForecast ? 'bg-purple-500/20 text-purple-400 border-purple-500/50' : 'bg-surface border-border text-muted-foreground hover:bg-background'}`}>
                                    {isForecast ? '🔮 Forecasting Active' : '🔮 Auto-Forecast'}
                                </Link>
                                <PrintExportButton />
                            </div>
                        </div>
                    </div>
                </AnimatedSection>

                {/* KPI Summary Bar — 6 items */}
                <AnimatedSection delay={0.1}>
                    <div className="glass rounded-2xl p-6 mb-10 border-primary/20 bg-primary/5 shadow-lg print:shadow-none print:border">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                            <div className="text-center">
                                <div className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] font-bold mb-1">Total Budget Plan</div>
                                <div className="text-xl sm:text-2xl font-black gradient-text">{formatINR(grandPlan)}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] font-bold mb-1">Total Spent</div>
                                <div className="text-xl sm:text-2xl font-black text-foreground">{formatINR(grandExpense)}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] font-bold mb-1">Variance</div>
                                <div className={`text-xl sm:text-2xl font-black font-mono ${variancePct > 0 ? "text-red-400" : "text-emerald-400"}`}>
                                    {variancePct > 0 ? "+" : ""}{variancePct.toFixed(1)}%
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-[10px] text-purple-400 uppercase tracking-[0.15em] font-bold mb-1">CAPEX Total</div>
                                <div className="text-lg sm:text-xl font-bold font-mono text-purple-400">{formatINR(capexTotal)}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-[10px] text-blue-400 uppercase tracking-[0.15em] font-bold mb-1">OPEX Total</div>
                                <div className="text-lg sm:text-xl font-bold font-mono text-blue-400">{formatINR(opexTotal)}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] font-bold mb-1">Fiscal Years</div>
                                <div className="text-xl sm:text-2xl font-black text-foreground">{sortedFYs.length}</div>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>

                {/* Charts Row */}
                {role !== 'IT_MANAGER' && (
                    <AnimatedSection delay={0.15}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10 print:hidden">
                            <BudgetVarianceChart data={chartData} />
                            <BudgetTrendChart data={chartData} />
                        </div>
                    </AnimatedSection>
                )}

                {/* Main Table */}
                <AnimatedSection delay={0.2}>
                    <div className="glass rounded-2xl overflow-hidden shadow-xl print:shadow-none print:border">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border-collapse" id="budget-ledger-table">
                                {/* Dual-row header */}
                                <thead>
                                    <tr className="bg-surface/80">
                                        <th rowSpan={2} className="text-left p-4 font-bold text-foreground border-b-2 border-r border-border w-28 sticky left-0 bg-surface/95 z-10">
                                            Fiscal Year
                                        </th>
                                        <th colSpan={2} className="text-center p-3 font-bold text-purple-400 border-b border-r border-border bg-purple-500/5">
                                            <div className="flex items-center justify-center gap-2">
                                                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                                                CAPEX (Capital Expenditure)
                                            </div>
                                        </th>
                                        <th colSpan={2} className="text-center p-3 font-bold text-blue-400 border-b border-r border-border bg-blue-500/5">
                                            <div className="flex items-center justify-center gap-2">
                                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                                                OPEX (Operating Expenditure)
                                            </div>
                                        </th>
                                        <th rowSpan={2} className="text-right p-4 font-bold text-foreground border-b-2 border-border w-32 bg-surface/80">
                                            FY Total (₹)
                                        </th>
                                    </tr>
                                    <tr className="bg-surface/60 text-xs">
                                        <th className="text-center p-2.5 font-semibold text-purple-300/80 border-b-2 border-r border-border/50 w-[22%]">Projects & Initiatives</th>
                                        <th className="text-center p-2.5 font-semibold text-purple-300/60 border-b-2 border-r border-border/50 w-[14%]">Regular / Non-Project</th>
                                        <th className="text-center p-2.5 font-semibold text-blue-300/80 border-b-2 border-r border-border/50 w-[22%]">Projects & Initiatives</th>
                                        <th className="text-center p-2.5 font-semibold text-blue-300/60 border-b-2 border-r border-border/50 w-[14%]">Regular / Non-Project</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedFYs.map((fy, fyIdx) => {
                                        const items = byFY[fy];
                                        const cp = items.filter(b => categorize(b) === "capex_project");
                                        const cr = items.filter(b => categorize(b) === "capex_regular");
                                        const op = items.filter(b => categorize(b) === "opex_project");
                                        const or2 = items.filter(b => categorize(b) === "opex_regular");
                                        const fyTotal = items.reduce((s: number, b: any) => s + toINR(b), 0);
                                        const fyPlan = items.reduce((s: number, b: any) => s + planINR(b), 0);
                                        const isCurrent = fy === "2024-25";
                                        const fyVariance = fyPlan > 0 ? ((fyTotal - fyPlan) / fyPlan * 100) : 0;

                                        return (
                                            <tr key={fy} className={`border-b border-border/40 align-top transition-colors hover:bg-surface/40 ${isCurrent ? "bg-primary/[0.03] ring-1 ring-inset ring-primary/10" : fyIdx % 2 === 1 ? "bg-surface/[0.08]" : "bg-transparent"}`}>
                                                {/* FY Label */}
                                                <td className={`p-4 font-bold text-foreground border-r border-border/50 sticky left-0 z-10 ${isCurrent ? "bg-primary/[0.06]" : fyIdx % 2 === 1 ? "bg-surface/20" : "bg-background/95"}`}>
                                                    <div className="flex flex-col items-start gap-1">
                                                        <span className="text-base font-black">FY {fy}</span>
                                                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-1">
                                                            Apr {fy.split('-')[0]} - Mar 20{fy.split('-')[1]}
                                                        </span>
                                                        {isCurrent && <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/20 text-primary font-bold uppercase mb-1">Current</span>}
                                                        <span className="text-[10px] text-muted-foreground font-mono mt-1">₹{fmtLakhs(fyTotal)}</span>
                                                        {fyPlan > 0 && fyTotal > 0 && (
                                                            <span className={`text-[9px] font-mono ${fyVariance > 0 ? "text-red-400" : "text-emerald-400"}`}>
                                                                {fyVariance > 0 ? "▲" : "▼"} {Math.abs(fyVariance).toFixed(1)}%
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                {/* CAPEX Projects */}
                                                <td className="p-3 border-r border-border/30 align-top">
                                                    <div className="space-y-1.5">
                                                        {cp.map(b => (
                                                            <div key={b.id} className="flex justify-between items-start gap-2 text-xs group">
                                                                <span className="text-foreground/90 leading-tight group-hover:text-purple-300 transition-colors flex items-center gap-1.5">
                                                                    <span className={`w-1.5 h-1.5 rounded-full ${renderStatusDot(b.status)}`} title={b.status || 'Draft'}></span>
                                                                    {b.cost_center ? <Link href={`/budget/cost-center/${encodeURIComponent(b.cost_center)}`} className="hover:underline">{b.title}</Link> : b.title}
                                                                </span>
                                                                <span className="text-muted-foreground font-mono shrink-0 text-[10px]">₹{fmtLakhs(toINR(b))}</span>
                                                            </div>
                                                        ))}
                                                        {cp.length === 0 && <span className="text-muted-foreground/40 italic text-xs">—</span>}
                                                    </div>
                                                    {cp.length > 0 && (
                                                        <div className="mt-2 pt-1.5 border-t border-purple-500/10 text-right">
                                                            <span className="text-[10px] font-bold font-mono text-purple-400/70">₹{fmtLakhs(cp.reduce((s: number, b: any) => s + toINR(b), 0))}</span>
                                                        </div>
                                                    )}
                                                </td>
                                                {/* CAPEX Regular */}
                                                {role !== 'CTO' && (
                                                    <td className="p-3 border-r border-border/30 align-top">
                                                        <div className="space-y-1.5">
                                                            {cr.map(b => (
                                                                <div key={b.id} className="flex justify-between items-start gap-2 text-xs group">
                                                                    <span className="text-foreground/70 leading-tight group-hover:text-purple-300 transition-colors flex items-center gap-1.5">
                                                                        <span className={`w-1.5 h-1.5 rounded-full ${renderStatusDot(b.status)}`} title={b.status || 'Draft'}></span>
                                                                        {b.cost_center ? <Link href={`/budget/cost-center/${encodeURIComponent(b.cost_center)}`} className="hover:underline">{b.title}</Link> : b.title}
                                                                    </span>
                                                                    <span className="text-muted-foreground font-mono shrink-0 text-[10px]">₹{fmtLakhs(toINR(b))}</span>
                                                                </div>
                                                            ))}
                                                            {cr.length === 0 && <span className="text-muted-foreground/40 italic text-xs">—</span>}
                                                        </div>
                                                        {cr.length > 0 && (
                                                            <div className="mt-2 pt-1.5 border-t border-purple-500/10 text-right">
                                                                <span className="text-[10px] font-bold font-mono text-purple-400/70">₹{fmtLakhs(cr.reduce((s: number, b: any) => s + toINR(b), 0))}</span>
                                                            </div>
                                                        )}
                                                    </td>
                                                )}
                                                {/* OPEX Projects */}
                                                <td className="p-3 border-r border-border/30 align-top">
                                                    <div className="space-y-1.5">
                                                        {op.map(b => (
                                                            <div key={b.id} className="flex justify-between items-start gap-2 text-xs group">
                                                                <span className="text-foreground/90 leading-tight group-hover:text-blue-300 transition-colors flex items-center gap-1.5">
                                                                    <span className={`w-1.5 h-1.5 rounded-full ${renderStatusDot(b.status)}`} title={b.status || 'Draft'}></span>
                                                                    {b.cost_center ? <Link href={`/budget/cost-center/${encodeURIComponent(b.cost_center)}`} className="hover:underline">{b.title}</Link> : b.title}
                                                                </span>
                                                                <span className="text-muted-foreground font-mono shrink-0 text-[10px]">₹{fmtLakhs(toINR(b))}</span>
                                                            </div>
                                                        ))}
                                                        {op.length === 0 && <span className="text-muted-foreground/40 italic text-xs">—</span>}
                                                    </div>
                                                    {op.length > 0 && (
                                                        <div className="mt-2 pt-1.5 border-t border-blue-500/10 text-right">
                                                            <span className="text-[10px] font-bold font-mono text-blue-400/70">₹{fmtLakhs(op.reduce((s: number, b: any) => s + toINR(b), 0))}</span>
                                                        </div>
                                                    )}
                                                </td>
                                                {/* OPEX Regular */}
                                                {role !== 'CTO' && (
                                                    <td className="p-3 border-r border-border/30 align-top">
                                                        <div className="space-y-1.5">
                                                            {or2.map(b => (
                                                                <div key={b.id} className="flex justify-between items-start gap-2 text-xs group">
                                                                    <span className="text-foreground/70 leading-tight group-hover:text-blue-300 transition-colors flex items-center gap-1.5">
                                                                        <span className={`w-1.5 h-1.5 rounded-full ${renderStatusDot(b.status)}`} title={b.status || 'Draft'}></span>
                                                                        {b.cost_center ? <Link href={`/budget/cost-center/${encodeURIComponent(b.cost_center)}`} className="hover:underline">{b.title}</Link> : b.title}
                                                                    </span>
                                                                    <span className="text-muted-foreground font-mono shrink-0 text-[10px]">₹{fmtLakhs(toINR(b))}</span>
                                                                </div>
                                                            ))}
                                                            {or2.length === 0 && <span className="text-muted-foreground/40 italic text-xs">—</span>}
                                                        </div>
                                                        {or2.length > 0 && (
                                                            <div className="mt-2 pt-1.5 border-t border-blue-500/10 text-right">
                                                                <span className="text-[10px] font-bold font-mono text-blue-400/70">₹{fmtLakhs(or2.reduce((s: number, b: any) => s + toINR(b), 0))}</span>
                                                            </div>
                                                        )}
                                                    </td>
                                                )}
                                                {/* FY Total */}
                                                <td className="p-4 text-right align-top">
                                                    <div className="font-bold font-mono text-foreground text-sm">{formatINR(fyTotal)}</div>
                                                    <div className="text-[9px] text-muted-foreground mt-1">
                                                        {items.length} items
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                                {/* Footer totals */}
                                <tfoot>
                                    <tr className="bg-surface/80 border-t-2 border-border font-bold">
                                        <td className="p-4 font-black text-foreground border-r border-border sticky left-0 bg-surface/95 z-10">
                                            GRAND TOTAL
                                        </td>
                                        <td className="p-4 text-right border-r border-border/50 font-mono text-purple-400">
                                            {formatINR(budgets.filter(b => categorize(b) === "capex_project").reduce((s, b) => s + toINR(b), 0))}
                                        </td>
                                        {role !== 'CTO' && (
                                            <td className="p-4 text-right border-r border-border/50 font-mono text-purple-400/70">
                                                {formatINR(budgets.filter(b => categorize(b) === "capex_regular").reduce((s, b) => s + toINR(b), 0))}
                                            </td>
                                        )}
                                        <td className="p-4 text-right border-r border-border/50 font-mono text-blue-400">
                                            {formatINR(budgets.filter(b => categorize(b) === "opex_project").reduce((s, b) => s + toINR(b), 0))}
                                        </td>
                                        {role !== 'CTO' && (
                                            <td className="p-4 text-right border-r border-border/50 font-mono text-blue-400/70">
                                                {formatINR(budgets.filter(b => categorize(b) === "opex_regular").reduce((s, b) => s + toINR(b), 0))}
                                            </td>
                                        )}
                                        <td className="p-4 text-right">
                                            <div className="text-lg font-black font-mono gradient-text">{formatINR(grandExpense)}</div>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </AnimatedSection>

                {/* Legend */}
                <AnimatedSection delay={0.3}>
                    <div className="mt-8 glass rounded-xl p-5 text-xs text-muted-foreground print:mt-4">
                        <div className="font-bold text-foreground mb-3 uppercase tracking-wider text-[10px]">Classification Logic Applied</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                            <div><span className="text-purple-400 font-bold">CAPEX Projects:</span> One-time, tangible strategic deployments — Network, Storage, Security, Surveillance, DR infrastructure.</div>
                            <div><span className="text-purple-400/70 font-bold">CAPEX Regular:</span> Recurring hardware assets — Laptops, Desktops, Printers, UPS, Spares. Capitalized but non-strategic.</div>
                            <div><span className="text-blue-400 font-bold">OPEX Projects:</span> Professional services & consulting — Cloud Migration, Assessments, Blueprints, Audits, Application Development.</div>
                            <div><span className="text-blue-400/70 font-bold">OPEX Regular:</span> Recurring operational — SaaS Subscriptions, AMC, Internet, Hosting, Repair & Maintenance, Managed Services.</div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-border/30 italic">
                            All amounts converted to INR using row-level exchange rates. FY format: April–March (Indian fiscal year). Showing {budgets.length} of 88+ mapped initiatives.
                        </div>
                    </div>
                </AnimatedSection>
            </div>
        </div>
    );
}
