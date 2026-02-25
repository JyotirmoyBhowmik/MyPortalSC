import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    getInitiativeBySlug,
    getInitiativesByProgram,
} from "@/lib/data/initiatives";

export const revalidate = 60;

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const initiative = await getInitiativeBySlug(slug);
    if (!initiative) return { title: "Initiative Not Found" };
    return {
        title: initiative.title,
        description: `${initiative.title} — ${initiative.programs?.name ?? "Program"} (FY ${initiative.fiscal_year}). Strategic Area: ${initiative.strategic_area}. Criticality: ${initiative.criticality}.`,
    };
}

const criticalityColors: Record<string, string> = {
    Critical: "bg-red-500/15 text-red-400 border-red-500/30",
    High: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    Medium: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    Low: "bg-gray-500/15 text-gray-400 border-gray-500/30",
};

export default async function InitiativeDetailPage({ params }: Props) {
    const { slug } = await params;
    const initiative = await getInitiativeBySlug(slug);
    if (!initiative) notFound();

    const program = initiative.programs;
    const relatedInitiatives = initiative.program_id
        ? (await getInitiativesByProgram(initiative.program_id))
            .filter((i) => i.id !== initiative.id)
            .slice(0, 6)
        : [];

    return (
        <>
            {/* Back link */}
            <section className="pt-24 px-4">
                <div className="max-w-4xl mx-auto">
                    <Link
                        href="/initiatives"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                        </svg>
                        Back to Initiatives
                    </Link>
                </div>
            </section>

            {/* Initiative Detail */}
            <section className="px-4 pb-16">
                <div className="max-w-4xl mx-auto">
                    {/* Header card */}
                    <div className="glass rounded-2xl p-8 sm:p-10 mb-8">
                        {/* Top badges */}
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                                FY {initiative.fiscal_year}
                            </span>
                            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border ${criticalityColors[initiative.criticality]}`}>
                                {initiative.criticality}
                            </span>
                            <span className="text-xs px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
                                {initiative.strategic_area}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">
                            {initiative.title}
                        </h1>

                        {/* Info grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                    Program
                                </h3>
                                <Link
                                    href="/initiatives/programs"
                                    className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                                >
                                    <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                        {program?.code ?? "–"}
                                    </span>
                                    <span className="font-medium">{program?.name ?? "Unassigned"}</span>
                                </Link>
                            </div>
                            <div>
                                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                    Strategic Area
                                </h3>
                                <p className="text-foreground font-medium">{initiative.strategic_area}</p>
                            </div>
                            <div>
                                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                    Fiscal Year
                                </h3>
                                <p className="text-foreground font-medium">FY {initiative.fiscal_year}</p>
                            </div>
                            <div>
                                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                    Criticality
                                </h3>
                                <p className="text-foreground font-medium">{initiative.criticality}</p>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Focus */}
                    {initiative.delivery_focus && (
                        <div className="glass rounded-xl p-8 mb-8">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <span className="w-2 h-6 bg-primary rounded-full" />
                                Delivery Focus
                            </h2>
                            <div className="space-y-3">
                                {initiative.delivery_focus.split(";").map((focus, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0 mt-0.5">
                                            {idx + 1}
                                        </div>
                                        <p className="text-muted-foreground leading-relaxed">{focus.trim()}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Program Context */}
                    {program && (
                        <div className="glass rounded-xl p-8 mb-8 border-l-4 border-primary/40">
                            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                <span className="text-2xl">{program.icon}</span>
                                Program {program.code}: {program.name}
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                {program.description}
                            </p>
                        </div>
                    )}

                    {/* Related Initiatives */}
                    {relatedInitiatives.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <span className="w-2 h-6 bg-accent rounded-full" />
                                Related Initiatives in Program {program?.code}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {relatedInitiatives.map((ri) => (
                                    <Link
                                        key={ri.id}
                                        href={`/initiatives/${ri.slug}`}
                                        className="group glass rounded-xl p-5 hover-lift"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs text-muted-foreground">FY {ri.fiscal_year}</span>
                                            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${criticalityColors[ri.criticality]}`}>
                                                {ri.criticality}
                                            </span>
                                        </div>
                                        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                                            {ri.title}
                                        </h3>
                                        <p className="text-xs text-muted-foreground mt-1">{ri.strategic_area}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
