import { Metadata } from "next";
import { getAllBudgets } from "@/lib/data/finances";
import { formatINR, convertToINR } from "@/lib/utils/currency";
import AnimatedSection, { AnimatedCard } from "@/components/animations/AnimatedSection";
import Badge from "@/components/ui/Badge";

export const metadata: Metadata = {
    title: "IT Budgets & Financials",
    description: "Overview of enterprise IT operational expenditures, capital investments, and mapped initiatives.",
};

export const revalidate = 60; // ISR cache

export default async function BudgetPage() {
    const rawBudgets = await getAllBudgets();
    
    // Sort logically by cost center or alphabetically
    const budgets = [...rawBudgets].sort((a, b) => 
        (a.cost_center || "").localeCompare(b.cost_center || "")
    );

    // Shared helper to get INR value per row
    const getINR = (amount: number, b: typeof budgets[0]) => {
        if (b.exchange_rate_to_inr && b.exchange_rate_to_inr > 0 && b.currency !== 'INR') {
            return amount * b.exchange_rate_to_inr;
        }
        return convertToINR(amount, b.currency || 'INR');
    };

    const totalSpend = budgets.reduce((sum, b) => sum + getINR(b.expense_amount, b), 0);
    const capexSpend = budgets.filter(b => b.investment_model === 'CapEx').reduce((sum, b) => sum + getINR(b.expense_amount, b), 0);
    const opexSpend = budgets.filter(b => b.investment_model === 'OpEx').reduce((sum, b) => sum + getINR(b.expense_amount, b), 0);

    let formattedSpend = "0";
    if (totalSpend >= 10000000) formattedSpend = `₹${(totalSpend / 10000000).toFixed(1)}Cr+`;
    else if (totalSpend >= 100000) formattedSpend = `₹${(totalSpend / 100000).toFixed(0)}L+`;
    else formattedSpend = `₹${totalSpend.toLocaleString()}`;

    return (
        <div className="py-24 px-4 min-h-screen relative">
            <div className="absolute top-0 right-0 p-32 opacity-5 pointer-events-none">
                 <svg className="w-96 h-96" fill="currentColor" viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>
            </div>
            
            <div className="max-w-6xl mx-auto relative z-10">
                <AnimatedSection>
                    <div className="text-center mb-16">
                        <h1 className="text-4xl sm:text-5xl font-black mb-6 tracking-tight">
                            Enterprise <span className="gradient-text">Financial Ledger</span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Comprehensive mapping of IT expenditure, capital investments, and subscription infrastructure directly tied to active enterprise initiatives. 
                        </p>
                    </div>
                </AnimatedSection>

                {/* Aggregation Bar */}
                <AnimatedSection delay={0.1}>
                   <div className="glass rounded-xl p-6 sm:p-8 mb-16 border-primary/20 bg-primary/5 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border/50 items-center justify-center shadow-lg gap-8 md:gap-0">
                        <div className="text-center px-8 w-full md:w-1/3">
                            <div className="text-sm text-muted-foreground uppercase tracking-widest font-bold mb-2">Total Managed Budget</div>
                            <div className="text-4xl sm:text-5xl font-black gradient-text">{formattedSpend}</div>
                        </div>
                        <div className="text-center px-8 pt-6 md:pt-0 w-full md:w-1/3">
                            <div className="text-sm text-muted-foreground uppercase tracking-widest font-bold mb-2 text-purple-400">CapEx Execution</div>
                            <div className="text-2xl font-bold font-mono text-purple-300">{formatINR(capexSpend)}</div>
                        </div>
                        <div className="text-center px-8 pt-6 md:pt-0 w-full md:w-1/3">
                            <div className="text-sm text-muted-foreground uppercase tracking-widest font-bold mb-2 text-blue-400">OpEx Operations</div>
                            <div className="text-2xl font-bold font-mono text-blue-300">{formatINR(opexSpend)}</div>
                        </div>
                   </div>
                </AnimatedSection>

                {/* Ledger Listing */}
                <div className="space-y-12">
                    {/* CapEx Section */}
                    <div>
                        <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-2">
                             <div className="w-8 h-8 rounded bg-purple-500/10 flex items-center justify-center"><span className="text-purple-500 font-bold">C</span></div>
                             <h2 className="text-2xl font-bold text-foreground">Capital Expenditures (Projects)</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {budgets.filter(b => b.investment_model === 'CapEx').map((budget, idx) => (
                                <AnimatedCard key={budget.id} delay={idx * 0.05} className="glass rounded-xl p-5 hover:border-primary/50 transition-colors flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-3">
                                         <Badge variant="outline" className="border-purple-500/30 text-purple-400">{budget.fiscal_year}</Badge>
                                         <span className="font-mono font-bold text-sm bg-surface px-2 py-1 rounded">{budget.currency} {Number(budget.expense_amount).toLocaleString()}</span>
                                    </div>
                                    <h3 className="font-bold text-lg mb-2 text-foreground line-clamp-2">{budget.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-4 font-mono">
                                        CC: <span className="text-foreground">{budget.cost_center || 'Unassigned'}</span><br/>
                                        Head: <span className="text-foreground">{budget.account_head || 'Generic'}</span>
                                    </p>
                                    <div className="mt-auto pt-4 border-t border-border/50 text-xs text-muted-foreground">
                                        {budget.projects?.title ? `Project: ${budget.projects.title}` : (budget.project_id ? 'Unmapped Project' : 'Independent Asset')}
                                    </div>
                                </AnimatedCard>
                            ))}
                            {budgets.filter(b => b.investment_model === 'CapEx').length === 0 && (
                                <p className="col-span-full text-center py-8 text-muted-foreground italic">No capital expenditure entries found.</p>
                            )}
                        </div>
                    </div>

                    {/* OpEx Section */}
                     <div>
                        <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-2">
                             <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center"><span className="text-blue-500 font-bold">O</span></div>
                             <h2 className="text-2xl font-bold text-foreground">Operational Expenditures (Initiatives)</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {budgets.filter(b => b.investment_model === 'OpEx').map((budget, idx) => (
                                <AnimatedCard key={budget.id} delay={idx * 0.05} className="glass rounded-xl p-5 hover:border-primary/50 transition-colors flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-3">
                                         <Badge variant="outline" className="border-blue-500/30 text-blue-400">{budget.fiscal_year}</Badge>
                                         <span className="font-mono font-bold text-sm bg-surface px-2 py-1 rounded">{budget.currency} {Number(budget.expense_amount).toLocaleString()}</span>
                                    </div>
                                    <h3 className="font-bold text-lg mb-2 text-foreground line-clamp-2">{budget.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-4 font-mono">
                                        CC: <span className="text-foreground">{budget.cost_center || 'Unassigned'}</span><br/>
                                        Head: <span className="text-foreground">{budget.account_head || 'Generic'}</span>
                                    </p>
                                    <div className="mt-auto pt-4 border-t border-border/50 text-xs text-muted-foreground">
                                        {budget.initiatives?.title ? `Initiative: ${budget.initiatives.title}` : (budget.initiative_id ? 'Unmapped Initiative' : 'Independent Subs')}
                                    </div>
                                </AnimatedCard>
                            ))}
                            {budgets.filter(b => b.investment_model === 'OpEx').length === 0 && (
                                <p className="col-span-full text-center py-8 text-muted-foreground italic">No operational expenditure entries found.</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
