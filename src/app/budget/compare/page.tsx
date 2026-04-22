import { Metadata } from "next";
import { getAllBudgets, getFiscalYears } from "@/lib/data/finances";
import FYCompareView from "@/components/budget/FYCompareView";
import AnimatedSection from "@/components/animations/AnimatedSection";
import Link from "next/link";

export const metadata: Metadata = {
    title: "FY Comparison | Enterprise IT Ledger",
    description: "Compare fiscal years side-by-side to track growth and newly introduced initiatives.",
};

export const revalidate = 60;

export default async function FYComparePage() {
    const allBudgets = await getAllBudgets();
    const fiscalYears = await getFiscalYears();

    // Default to the two most recent FYs if available
    const sortedFys = [...fiscalYears].sort((a, b) => b.label.localeCompare(a.label));
    const defaultFy1 = sortedFys.length > 1 ? sortedFys[1].label : "";
    const defaultFy2 = sortedFys.length > 0 ? sortedFys[0].label : "";

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
                    
                    <div className="flex items-center gap-3 mb-3">
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">FY Comparison</h1>
                        <span className="px-3 py-1 bg-surface border border-border rounded-full text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Analytics</span>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl mb-10">
                        Select two fiscal years to run a side-by-side variance analysis of capital and operational expenditures.
                    </p>
                </AnimatedSection>

                <AnimatedSection delay={0.1}>
                    <FYCompareView 
                        allBudgets={allBudgets} 
                        fiscalYears={sortedFys} 
                        defaultFy1={defaultFy1} 
                        defaultFy2={defaultFy2} 
                    />
                </AnimatedSection>
            </div>
        </main>
    );
}
