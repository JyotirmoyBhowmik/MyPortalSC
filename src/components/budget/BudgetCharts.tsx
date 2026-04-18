"use client";

import dynamic from "next/dynamic";
const BarChart = dynamic(() => import("recharts").then(m => m.BarChart), { ssr: false });
const Bar = dynamic(() => import("recharts").then(m => m.Bar), { ssr: false });
const XAxis = dynamic(() => import("recharts").then(m => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then(m => m.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then(m => m.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then(m => m.Tooltip), { ssr: false });
const Legend = dynamic(() => import("recharts").then(m => m.Legend), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then(m => m.ResponsiveContainer), { ssr: false });
const AreaChart = dynamic(() => import("recharts").then(m => m.AreaChart), { ssr: false });
const Area = dynamic(() => import("recharts").then(m => m.Area), { ssr: false });

interface FYData {
    fy: string;
    planned: number;
    spent: number;
    capex: number;
    opex: number;
    variance: number;
}

function fmtLakhs(val: number): string {
    if (val >= 10000000) return `${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `${(val / 100000).toFixed(0)}L`;
    if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
    return val.toFixed(0);
}

function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="glass rounded-lg p-3 border border-border shadow-xl text-xs">
            <div className="font-bold text-foreground mb-1.5">FY {label}</div>
            {payload.map((p: any) => (
                <div key={p.name} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                    <span className="text-muted-foreground">{p.name}:</span>
                    <span className="font-mono font-bold text-foreground">₹{fmtLakhs(p.value)}</span>
                </div>
            ))}
        </div>
    );
}

export function BudgetVarianceChart({ data }: { data: FYData[] }) {
    // Ascending order for charts
    const sorted = [...data].reverse();

    return (
        <div className="glass rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-foreground">Budget vs Actual</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Planned budget against actual spend per fiscal year</p>
                </div>
                <div className="flex items-center gap-4 text-[10px]">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/70" /> Planned</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-amber-500/70" /> Spent</span>
                </div>
            </div>
            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sorted} barCategoryGap="20%">
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
                        <XAxis dataKey="fy" tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={fmtLakhs} width={48} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="planned" name="Planned" fill="rgba(16,185,129,0.5)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="spent" name="Spent" fill="rgba(245,158,11,0.6)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            {/* Variance indicators */}
            <div className="mt-4 flex flex-wrap gap-2">
                {sorted.filter(d => d.spent > 0).map(d => {
                    const pct = d.planned > 0 ? ((d.spent - d.planned) / d.planned * 100) : 0;
                    const isOver = pct > 0;
                    return (
                        <div key={d.fy} className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-1 rounded-md bg-surface/50">
                            <span className="text-muted-foreground">{d.fy}:</span>
                            <span className={isOver ? "text-red-400" : "text-emerald-400"}>
                                {isOver ? "+" : ""}{pct.toFixed(1)}%
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export function BudgetTrendChart({ data }: { data: FYData[] }) {
    const sorted = [...data].reverse();

    return (
        <div className="glass rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-foreground">CAPEX vs OPEX Trend</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Multi-year investment model split over 10 fiscal years</p>
                </div>
                <div className="flex items-center gap-4 text-[10px]">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-purple-500/70" /> CAPEX</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500/70" /> OPEX</span>
                </div>
            </div>
            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sorted}>
                        <defs>
                            <linearGradient id="capexGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="rgb(168,85,247)" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="rgb(168,85,247)" stopOpacity={0.02} />
                            </linearGradient>
                            <linearGradient id="opexGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="rgb(59,130,246)" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="rgb(59,130,246)" stopOpacity={0.02} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
                        <XAxis dataKey="fy" tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={fmtLakhs} width={48} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="capex" name="CAPEX" stroke="rgb(168,85,247)" fill="url(#capexGrad)" strokeWidth={2} dot={{ r: 3, fill: "rgb(168,85,247)" }} />
                        <Area type="monotone" dataKey="opex" name="OPEX" stroke="rgb(59,130,246)" fill="url(#opexGrad)" strokeWidth={2} dot={{ r: 3, fill: "rgb(59,130,246)" }} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export function PrintExportButton() {
    return (
        <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-all print:hidden"
            title="Print / Export PDF"
        >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Export PDF
        </button>
    );
}
