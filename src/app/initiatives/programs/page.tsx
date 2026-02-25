import type { Metadata } from "next";
import Link from "next/link";
import {
    getAllPrograms,
    getInitiativesByProgram,
    getInitiativeStats,
} from "@/lib/data/initiatives";

export const revalidate = 60;

export const metadata: Metadata = {
    title: "Programs",
    description:
        "12 strategic programs spanning OT security, network modernization, cloud foundations, and more — organized by Jyotirmoy Bhowmik.",
};

export default async function ProgramsPage() {
    const [programs, stats] = await Promise.all([
        getAllPrograms(),
        getInitiativeStats(),
    ]);

    // Fetch initiatives per program
    const programsWithInitiatives = await Promise.all(
        programs.map(async (program) => {
            const initiatives = await getInitiativesByProgram(program.id);
            const critical = initiatives.filter((i) => i.criticality === "Critical").length;
            const high = initiatives.filter((i) => i.criticality === "High").length;
            return { ...program, initiatives, critical, high };
        })
    );

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
                    <Link
                        href="/initiatives"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                        </svg>
                        Back to Initiatives
                    </Link>
                    <h1 className="text-4xl sm:text-5xl font-bold mb-6 animate-slide-up">
                        Strategic <span className="gradient-text">Programs</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up stagger-1">
                        {stats.total} initiatives organized across {stats.programCount} strategic
                        program categories — each designed to advance specific dimensions
                        of enterprise technology.
                    </p>
                </div>
            </section>

            {/* Programs Grid */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {programsWithInitiatives.map((program) => (
                            <div
                                key={program.code}
                                className="glass rounded-xl p-6 hover-lift transition-all duration-300"
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="text-3xl">{program.icon}</div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                {program.code}
                                            </span>
                                            <h3 className="text-lg font-bold text-foreground">
                                                {program.name}
                                            </h3>
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                                            {program.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Stats row */}
                                <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                                    <span className="text-sm font-medium text-foreground">
                                        {program.initiatives.length} initiative{program.initiatives.length !== 1 ? "s" : ""}
                                    </span>
                                    {program.critical > 0 && (
                                        <span className="text-xs px-2 py-0.5 rounded bg-red-500/10 text-red-400">
                                            {program.critical} Critical
                                        </span>
                                    )}
                                    {program.high > 0 && (
                                        <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">
                                            {program.high} High
                                        </span>
                                    )}
                                </div>

                                {/* Initiative list */}
                                <div className="mt-4 space-y-2">
                                    {program.initiatives.slice(0, 4).map((init) => (
                                        <Link
                                            key={init.id}
                                            href={`/initiatives/${init.slug}`}
                                            className="block text-sm text-muted-foreground hover:text-primary transition-colors truncate pl-4 border-l-2 border-border/50 hover:border-primary/50"
                                        >
                                            {init.title}
                                        </Link>
                                    ))}
                                    {program.initiatives.length > 4 && (
                                        <p className="text-sm text-primary font-medium pl-4">
                                            +{program.initiatives.length - 4} more
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
