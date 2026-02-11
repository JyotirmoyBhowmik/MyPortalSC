"use client";

import { useTranslation, type Locale } from "@/lib/i18n";

interface TimelineEntry {
    id: string;
    year_start: number;
    year_end: number | null;
    title_en: string;
    title_hi: string | null;
    title_bn: string | null;
    organization: string;
    description_en: string | null;
    description_hi: string | null;
    description_bn: string | null;
    logo_url: string | null;
    entry_type: string;
}

const typeColors: Record<string, string> = {
    role: "bg-primary",
    milestone: "bg-amber-500",
    education: "bg-violet-500",
    award: "bg-emerald-500",
};

const typeLabels: Record<string, string> = {
    role: "Role",
    milestone: "Milestone",
    education: "Education",
    award: "Award",
};

export default function TimelineContent({ entries }: { entries: TimelineEntry[] }) {
    const { locale, t } = useTranslation();

    function getTitle(e: TimelineEntry): string {
        const map: Record<Locale, string | null> = { en: e.title_en, hi: e.title_hi, bn: e.title_bn };
        return map[locale] || e.title_en;
    }

    function getDescription(e: TimelineEntry): string {
        const map: Record<Locale, string | null> = { en: e.description_en, hi: e.description_hi, bn: e.description_bn };
        return map[locale] || e.description_en || "";
    }

    return (
        <div>
            {/* Hero */}
            <section className="text-center py-12">
                <h1 className="text-4xl md:text-5xl font-black mb-4">{t.timeline.title}</h1>
                <p className="text-lg text-muted-foreground max-w-xl mx-auto">{t.timeline.subtitle}</p>
            </section>

            {/* Timeline */}
            <div className="relative max-w-3xl mx-auto">
                {/* Vertical line */}
                <div className="absolute left-4 md:left-1/2 md:-translate-x-0.5 top-0 bottom-0 w-0.5 bg-border" />

                <div className="space-y-8">
                    {entries.map((entry, idx) => {
                        const isLeft = idx % 2 === 0;
                        const yearRange = entry.year_end
                            ? `${entry.year_start} – ${entry.year_end}`
                            : `${entry.year_start} – ${t.timeline.present}`;

                        return (
                            <div
                                key={entry.id}
                                className={`relative flex items-start gap-6 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} pl-12 md:pl-0`}
                            >
                                {/* Dot */}
                                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-background z-10"
                                    style={{ top: "1.5rem" }}
                                >
                                    <div className={`w-full h-full rounded-full ${typeColors[entry.entry_type] || "bg-primary"}`} />
                                </div>

                                {/* Card */}
                                <div className={`flex-1 ${isLeft ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                                    <div className="glass rounded-xl p-5 hover:scale-[1.01] transition-transform">
                                        <div className={`flex items-center gap-2 mb-2 ${isLeft ? "md:justify-end" : ""}`}>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${typeColors[entry.entry_type] || "bg-primary"}`}>
                                                {typeLabels[entry.entry_type] || entry.entry_type}
                                            </span>
                                            <span className="text-xs text-muted-foreground font-mono">{yearRange}</span>
                                        </div>
                                        <h3 className="text-base font-bold text-foreground mb-1">{getTitle(entry)}</h3>
                                        <p className="text-sm text-primary font-medium mb-2">{entry.organization}</p>
                                        {getDescription(entry) && (
                                            <p className="text-xs text-muted-foreground leading-relaxed">
                                                {getDescription(entry)}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Spacer for opposite side */}
                                <div className="hidden md:block flex-1" />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
