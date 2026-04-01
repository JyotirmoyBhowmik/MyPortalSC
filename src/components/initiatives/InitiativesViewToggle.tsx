"use client";

import { useState } from "react";
import InitiativesGrid from "./InitiativesGrid";
import InitiativesTimeline from "./InitiativesTimeline";
import type { Program } from "@/lib/database.types";

interface InitiativeItem {
    id: string;
    title: string;
    slug: string;
    fiscal_year: string;
    strategic_area: string;
    criticality: "Critical" | "High" | "Medium" | "Low";
    programCode: string;
    programName: string;
}

interface Props {
    initiatives: InitiativeItem[];
    programs: Program[];
    fiscalYears: string[];
    strategicAreas: string[];
}

type ViewMode = "grid" | "timeline";

export default function InitiativesViewToggle({ initiatives, programs, fiscalYears, strategicAreas }: Props) {
    const [view, setView] = useState<ViewMode>("grid");

    return (
        <>
            {/* View Toggle */}
            <div className="flex items-center justify-center gap-1 mb-8">
                <div className="glass rounded-lg p-1 inline-flex">
                    <button
                        onClick={() => setView("grid")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            view === "grid"
                                ? "bg-primary text-primary-foreground shadow-lg"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        Grid
                    </button>
                    <button
                        onClick={() => setView("timeline")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            view === "timeline"
                                ? "bg-primary text-primary-foreground shadow-lg"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Timeline
                    </button>
                </div>
            </div>

            {/* View Content */}
            {view === "grid" ? (
                <InitiativesGrid
                    initiatives={initiatives}
                    programs={programs}
                    fiscalYears={fiscalYears}
                    strategicAreas={strategicAreas}
                />
            ) : (
                <InitiativesTimeline initiatives={initiatives} />
            )}
        </>
    );
}
