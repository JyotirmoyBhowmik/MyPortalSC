import type { Metadata } from "next";
import Link from "next/link";
import {
    getAllInitiatives,
    getAllPrograms,
    getAllFiscalYears,
    getAllStrategicAreas,
    getInitiativeStats,
} from "@/lib/data/initiatives";
import { getAllBudgets } from "@/lib/data/finances";
import { formatINR, convertToINR } from "@/lib/utils/currency";
import InitiativesViewToggle from "@/components/initiatives/InitiativesViewToggle";

export const revalidate = 60;

export const metadata: Metadata = {
    title: "Initiatives",
    description:
        "88 enterprise initiatives across IT infrastructure, security, cloud, and operational technology delivered by Jyotirmoy Bhowmik.",
};

function toINR(b: any): number {
    if (b.exchange_rate_to_inr && b.exchange_rate_to_inr > 0 && b.currency !== "INR") {
        return b.expense_amount * b.exchange_rate_to_inr;
    }
    return convertToINR(b.expense_amount, b.currency || "INR");
}

export default async function InitiativesPage() {
    const [initiatives, programs, fiscalYears, strategicAreas, stats, budgets] = await Promise.all([
        getAllInitiatives(),
        getAllPrograms(),
        getAllFiscalYears(),
        getAllStrategicAreas(),
        getInitiativeStats(),
        getAllBudgets(),
    ]);

    // Program budget rollup: map initiative_id → program_code → total INR
    const initProgramMap: Record<string, string> = {};
    initiatives.forEach(i => {
        if (i.programs?.code) initProgramMap[i.id] = i.programs.code;
    });
    const programBudgets: Record<string, number> = {};
    budgets.forEach(b => {
        if (b.initiative_id && initProgramMap[b.initiative_id]) {
            const code = initProgramMap[b.initiative_id];
            programBudgets[code] = (programBudgets[code] || 0) + toINR(b);
        }
    });
    const totalBudgetMapped = Object.values(programBudgets).reduce((s, v) => s + v, 0);

    return (
        <>
            {/* Hero */}
            <section className="py-24 px-4 relative overflow-hidden">
                <div className="absolute inset-0 dot-pattern opacity-20" />
                <div
                    className="absolute inset-0"
                    style={{ background: "var(--gradient-hero)" }}
                />

                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-6 animate-slide-up">
                        Enterprise <span className="gradient-text">Initiatives</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12 animate-slide-up stagger-1">
                        A comprehensive portfolio of {stats.total} technology initiatives
                        spanning {stats.fyCount} fiscal years across {stats.programCount} strategic
                        programs — from OT security to cloud modernization.
                    </p>

                    {/* Stats */}
                    <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 animate-fade-in stagger-2">
                        <div className="text-center">
                            <div className="text-2xl sm:text-3xl font-bold gradient-text">{stats.total}</div>
                            <div className="text-xs text-muted-foreground mt-1">Total Initiatives</div>
                        </div>
                        <div className="w-px h-10 bg-border" />
                        <div className="text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-red-400">{stats.critical}</div>
                            <div className="text-xs text-muted-foreground mt-1">Critical</div>
                        </div>
                        <div className="w-px h-10 bg-border" />
                        <div className="text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-amber-400">{stats.high}</div>
                            <div className="text-xs text-muted-foreground mt-1">High Priority</div>
                        </div>
                        <div className="w-px h-10 bg-border" />
                        <div className="text-center">
                            <div className="text-2xl sm:text-3xl font-bold gradient-text">{stats.programCount}</div>
                            <div className="text-xs text-muted-foreground mt-1">Programs</div>
                        </div>
                        {totalBudgetMapped > 0 && (
                            <>
                                <div className="w-px h-10 bg-border" />
                                <div className="text-center">
                                    <div className="text-2xl sm:text-3xl font-bold text-emerald-400">{formatINR(totalBudgetMapped)}</div>
                                    <div className="text-xs text-muted-foreground mt-1">Total IT Budget</div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Program Budget Rollup */}
            {totalBudgetMapped > 0 && (
                <section className="px-4 -mt-8 mb-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="glass rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Budget by Program</h2>
                                <Link href="/budget" className="text-xs text-primary hover:underline">View Full Ledger →</Link>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                {programs.filter(p => programBudgets[p.code]).map(p => {
                                    const amount = programBudgets[p.code] || 0;
                                    const pct = totalBudgetMapped > 0 ? (amount / totalBudgetMapped * 100) : 0;
                                    return (
                                        <div key={p.code} className="relative p-3 rounded-xl bg-surface/50 border border-border/30 hover:border-primary/30 transition-colors group overflow-hidden">
                                            {/* Background fill bar */}
                                            <div className="absolute bottom-0 left-0 h-1 bg-primary/20 transition-all" style={{ width: `${pct}%` }} />
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span className="text-lg">{p.icon}</span>
                                                <span className="text-[10px] font-bold text-muted-foreground">{p.code}</span>
                                            </div>
                                            <div className="text-sm font-bold font-mono text-foreground">{formatINR(amount)}</div>
                                            <div className="text-[9px] text-muted-foreground mt-0.5 truncate" title={p.name}>{p.name}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Initiatives Grid */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <InitiativesViewToggle
                        initiatives={initiatives.map((i) => ({
                            ...i,
                            programCode: i.programs?.code ?? "",
                            programName: i.programs?.name ?? "Other",
                        }))}
                        programs={programs}
                        fiscalYears={fiscalYears}
                        strategicAreas={strategicAreas}
                    />
                </div>
            </section>

            {/* Programs overview link */}
            <section className="pb-24 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="glass rounded-2xl p-10 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
                        <div className="relative z-10">
                            <h2 className="text-2xl font-bold mb-3">
                                Explore by <span className="gradient-text">Program</span>
                            </h2>
                            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                                See how initiatives are organized across {stats.programCount} strategic
                                programs — from OT modernization and network upgrades to cloud
                                foundations and compliance enablement.
                            </p>
                            <a
                                href="/initiatives/programs"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg gradient-bg text-white font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
                            >
                                View All Programs
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
