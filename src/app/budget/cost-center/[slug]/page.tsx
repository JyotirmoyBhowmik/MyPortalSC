import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllBudgets } from "@/lib/data/finances";
import { formatINR, convertToINR } from "@/lib/utils/currency";
import AnimatedSection from "@/components/animations/AnimatedSection";
import Link from "next/link";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const decodedSlug = decodeURIComponent(params.slug);
    return {
        title: `${decodedSlug} | Cost Center Budgets`,
        description: `Detailed financial breakdown and roadmap for the ${decodedSlug} cost center.`,
    };
}

export const revalidate = 60;

function toINR(b: { exchange_rate_to_inr?: number, currency?: string, expense_amount: number }): number {
    if (b.exchange_rate_to_inr && b.exchange_rate_to_inr > 0 && b.currency !== "INR") {
        return b.expense_amount * b.exchange_rate_to_inr;
    }
    return convertToINR(b.expense_amount, b.currency || "INR");
}

const renderStatusDot = (status: string | undefined) => {
    if (status === 'Approved') return 'bg-emerald-500';
    if (status === 'Submitted') return 'bg-blue-500';
    if (status === 'Closed') return 'bg-slate-500';
    return 'bg-yellow-500';
};

export default async function CostCenterPage({ params }: { params: { slug: string } }) {
    const costCenter = decodeURIComponent(params.slug);
    const allBudgets = await getAllBudgets();
    
    // Filter to only this cost center
    const budgets = allBudgets.filter(b => b.cost_center === costCenter);

    if (budgets.length === 0) {
        notFound();
    }

    const totalSpend = budgets.reduce((sum, b) => sum + toINR(b), 0);
    const capexTotal = budgets.filter(b => b.investment_model === "CapEx").reduce((sum, b) => sum + toINR(b), 0);
    const opexTotal = budgets.filter(b => b.investment_model === "OpEx").reduce((sum, b) => sum + toINR(b), 0);
    
    // Group by FY
    const byFY: Record<string, typeof budgets> = {};
    budgets.forEach(b => {
        if (!byFY[b.fiscal_year]) byFY[b.fiscal_year] = [];
        byFY[b.fiscal_year].push(b);
    });
    
    const sortedFYs = Object.keys(byFY).sort((a, b) => b.localeCompare(a)); // Descending

    return (
        <main className="min-h-screen pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <AnimatedSection>
                    <Link href="/budget" className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors mb-6 group">
                        <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Enterprise Ledger
                    </Link>
                    
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">{costCenter}</h1>
                                <span className="px-3 py-1 bg-surface border border-border rounded-full text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Cost Center</span>
                            </div>
                            <p className="text-lg text-muted-foreground max-w-2xl">
                                Financial breakdown and ledger trace for all projects and expenses categorized under the {costCenter} department.
                            </p>
                        </div>
                    </div>
                </AnimatedSection>

                {/* KPI Summary */}
                <AnimatedSection delay={0.1}>
                    <div className="glass rounded-2xl p-6 mb-10 print:hidden border border-border/50 shadow-sm relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent pointer-events-none"></div>
                        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 divide-x divide-border/30">
                            <div className="text-center md:text-left md:pl-4">
                                <div className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] font-bold mb-1">Total Allocated</div>
                                <div className="text-xl sm:text-2xl font-black text-foreground">{formatINR(totalSpend)}</div>
                            </div>
                            <div className="text-center md:text-left pl-4">
                                <div className="text-[10px] text-purple-400 uppercase tracking-[0.15em] font-bold mb-1">CAPEX Subtotal</div>
                                <div className="text-lg sm:text-xl font-bold font-mono text-purple-400">{formatINR(capexTotal)}</div>
                            </div>
                            <div className="text-center md:text-left pl-4">
                                <div className="text-[10px] text-blue-400 uppercase tracking-[0.15em] font-bold mb-1">OPEX Subtotal</div>
                                <div className="text-lg sm:text-xl font-bold font-mono text-blue-400">{formatINR(opexTotal)}</div>
                            </div>
                            <div className="text-center md:text-left pl-4">
                                <div className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] font-bold mb-1">Total Items</div>
                                <div className="text-xl sm:text-2xl font-black text-foreground">{budgets.length} <span className="text-sm font-normal text-muted-foreground">across {sortedFYs.length} FYs</span></div>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>

                {/* Main Ledger Feed */}
                <AnimatedSection delay={0.2}>
                    <div className="space-y-6">
                        {sortedFYs.map(fy => {
                            const items = byFY[fy];
                            const fyTotal = items.reduce((s, b) => s + toINR(b), 0);
                            
                            return (
                                <div key={fy} className="glass rounded-xl overflow-hidden border border-border/50">
                                    <div className="bg-surface/80 p-4 border-b border-border/50 flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <h3 className="font-bold text-xl">{fy}</h3>
                                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                                Apr {fy.split('-')[0]} - Mar 20{fy.split('-')[1]}
                                            </span>
                                        </div>
                                        <div className="font-mono font-bold">{formatINR(fyTotal)}</div>
                                    </div>
                                    <div className="divide-y divide-border/30">
                                        {items.map(b => (
                                            <div key={b.id} className="p-4 hover:bg-surface/30 transition-colors flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`w-2 h-2 rounded-full ${renderStatusDot(b.status)}`} title={b.status || 'Draft'}></span>
                                                        <span className="font-semibold text-foreground">{b.title}</span>
                                                        {b.projects?.title && <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface border border-border text-muted-foreground ml-2">Project: {b.projects.title}</span>}
                                                        {b.initiatives?.title && <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface border border-border text-muted-foreground ml-2">Initiative: {b.initiatives.title}</span>}
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                        <span className={`font-bold ${b.investment_model === 'OpEx' ? 'text-blue-400' : 'text-purple-400'}`}>{b.investment_model}</span>
                                                        {b.account_head && <span>• Head: {b.account_head}</span>}
                                                        {b.profit_center && <span>• Profit Center: {b.profit_center}</span>}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-mono text-foreground font-bold">{formatINR(toINR(b))}</div>
                                                    <div className="text-[10px] text-muted-foreground mt-0.5">{b.currency} {Number(b.expense_amount).toLocaleString()}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </AnimatedSection>
            </div>
        </main>
    );
}
