"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Initiative, ProgramMeta } from "@/lib/data/initiatives";

interface InitiativesGridProps {
    initiatives: Initiative[];
    programs: ProgramMeta[];
    fiscalYears: string[];
    strategicAreas: string[];
}

const criticalityColors: Record<string, string> = {
    Critical: "bg-red-500/15 text-red-400 border-red-500/30",
    High: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    Medium: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    Low: "bg-gray-500/15 text-gray-400 border-gray-500/30",
};

const criticalityDots: Record<string, string> = {
    Critical: "bg-red-400",
    High: "bg-amber-400",
    Medium: "bg-blue-400",
    Low: "bg-gray-400",
};

export default function InitiativesGrid({
    initiatives,
    programs,
    fiscalYears,
    strategicAreas,
}: InitiativesGridProps) {
    const [search, setSearch] = useState("");
    const [selectedFY, setSelectedFY] = useState<string | null>(null);
    const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
    const [selectedArea, setSelectedArea] = useState<string | null>(null);
    const [selectedCriticality, setSelectedCriticality] = useState<string | null>(null);

    const filtered = useMemo(() => {
        return initiatives.filter((init) => {
            const matchesSearch =
                !search ||
                init.title.toLowerCase().includes(search.toLowerCase()) ||
                init.strategicArea.toLowerCase().includes(search.toLowerCase());
            const matchesFY = !selectedFY || init.fiscalYear === selectedFY;
            const matchesProgram = !selectedProgram || init.program === selectedProgram;
            const matchesArea = !selectedArea || init.strategicArea === selectedArea;
            const matchesCriticality = !selectedCriticality || init.criticality === selectedCriticality;
            return matchesSearch && matchesFY && matchesProgram && matchesArea && matchesCriticality;
        });
    }, [initiatives, search, selectedFY, selectedProgram, selectedArea, selectedCriticality]);

    const hasFilters = search || selectedFY || selectedProgram || selectedArea || selectedCriticality;

    return (
        <>
            {/* ─── Filters ─── */}
            <div className="glass rounded-xl p-6 mb-8">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search initiatives…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="admin-input pl-10"
                            />
                        </div>
                    </div>

                    {/* Fiscal Year */}
                    <select
                        value={selectedFY || ""}
                        onChange={(e) => setSelectedFY(e.target.value || null)}
                        className="admin-input sm:w-40"
                    >
                        <option value="">All Years</option>
                        {fiscalYears.map((fy) => (
                            <option key={fy} value={fy}>FY {fy}</option>
                        ))}
                    </select>

                    {/* Program */}
                    <select
                        value={selectedProgram || ""}
                        onChange={(e) => setSelectedProgram(e.target.value || null)}
                        className="admin-input sm:w-56"
                    >
                        <option value="">All Programs</option>
                        {programs.map((p) => (
                            <option key={p.code} value={p.code}>{p.code}. {p.name}</option>
                        ))}
                    </select>

                    {/* Criticality */}
                    <select
                        value={selectedCriticality || ""}
                        onChange={(e) => setSelectedCriticality(e.target.value || null)}
                        className="admin-input sm:w-36"
                    >
                        <option value="">All Levels</option>
                        {["Critical", "High", "Medium", "Low"].map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                {/* Active filters display */}
                {hasFilters && (
                    <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border">
                        <span className="text-xs text-muted-foreground">Filters:</span>
                        {search && (
                            <button onClick={() => setSearch("")} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                                &quot;{search}&quot; ×
                            </button>
                        )}
                        {selectedFY && (
                            <button onClick={() => setSelectedFY(null)} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                                FY {selectedFY} ×
                            </button>
                        )}
                        {selectedProgram && (
                            <button onClick={() => setSelectedProgram(null)} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                                Program {selectedProgram} ×
                            </button>
                        )}
                        {selectedCriticality && (
                            <button onClick={() => setSelectedCriticality(null)} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                                {selectedCriticality} ×
                            </button>
                        )}
                        <button
                            onClick={() => { setSearch(""); setSelectedFY(null); setSelectedProgram(null); setSelectedArea(null); setSelectedCriticality(null); }}
                            className="text-xs text-muted-foreground hover:text-foreground ml-2 transition-colors"
                        >
                            Clear all
                        </button>
                    </div>
                )}
            </div>

            {/* Results count */}
            <p className="text-sm text-muted-foreground mb-6">
                Showing {filtered.length} of {initiatives.length} initiatives
            </p>

            {/* ─── Initiative Cards ─── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((init) => (
                    <Link
                        key={init.id}
                        href={`/initiatives/${init.slug}`}
                        className="group glass rounded-xl p-5 hover-lift flex flex-col h-full"
                    >
                        {/* Top row: FY and Criticality */}
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium text-muted-foreground">
                                FY {init.fiscalYear}
                            </span>
                            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border ${criticalityColors[init.criticality]}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${criticalityDots[init.criticality]}`} />
                                {init.criticality}
                            </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors mb-2 flex-1">
                            {init.title}
                        </h3>

                        {/* Strategic Area */}
                        <p className="text-xs text-muted-foreground mb-3">{init.strategicArea}</p>

                        {/* Program Badge */}
                        <div className="flex items-center gap-2 mt-auto pt-3 border-t border-border/50">
                            <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">
                                {init.program}
                            </span>
                            <span className="text-xs text-muted-foreground truncate">
                                {init.programName}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Empty state */}
            {filtered.length === 0 && (
                <div className="text-center py-16">
                    <div className="text-4xl mb-4">🔍</div>
                    <h3 className="text-lg font-semibold mb-2">No initiatives found</h3>
                    <p className="text-muted-foreground text-sm">
                        Try adjusting your search or filters.
                    </p>
                </div>
            )}
        </>
    );
}
