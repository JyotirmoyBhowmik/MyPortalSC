"use client";

import { useTranslation, type Locale } from "@/lib/i18n";
import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

const DownloadPdfButton = dynamic(() => import("@/components/pdf/DownloadPdfButton"), {
    ssr: false,
    loading: () => <button className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-primary/20 animate-pulse shadow-lg print:hidden"><div className="w-6 h-6" /></button>
});

interface KPI {
    key: string;
    value: string;
    label_en: string;
    label_hi: string | null;
    label_bn: string | null;
    icon: string;
    suffix: string | null;
    sort_order: number;
}

interface Testimonial {
    id: string;
    name: string;
    role: string;
    organization: string;
    quote_en: string;
    quote_hi: string | null;
    quote_bn: string | null;
    avatar_url: string | null;
}

interface Props {
    kpis: KPI[];
    testimonials: Testimonial[];
}

/* ─── Animated Counter ─── */
function AnimatedCounter({ value, suffix }: { value: string; suffix: string | null }) {
    const [count, setCount] = useState(0);
    const numVal = parseFloat(value);
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!visible) return;
        const duration = 2000;
        const steps = 60;
        const increment = numVal / steps;
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= numVal) {
                setCount(numVal);
                clearInterval(timer);
            } else {
                setCount(current);
            }
        }, duration / steps);
        return () => clearInterval(timer);
    }, [visible, numVal]);

    const isDecimal = value.includes(".");
    const formatted = isDecimal ? count.toFixed(1) : Math.floor(count).toString();

    return (
        <div ref={ref} className="text-4xl md:text-5xl font-black text-primary tabular-nums">
            {formatted}{suffix && <span className="text-xl text-muted-foreground ml-1">{suffix}</span>}
        </div>
    );
}

/* ─── Main Component ─── */
export default function ExecutiveSummaryContent({ kpis, testimonials }: Props) {
    const { locale, t } = useTranslation();

    function getLabel(kpi: KPI): string {
        if (locale === "hi" && kpi.label_hi) return kpi.label_hi;
        if (locale === "bn" && kpi.label_bn) return kpi.label_bn;
        return kpi.label_en;
    }

    function getQuote(test: Testimonial): string {
        const map: Record<Locale, string | null> = { en: test.quote_en, hi: test.quote_hi, bn: test.quote_bn };
        return map[locale] || test.quote_en;
    }

    const contentRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <DownloadPdfButton contentRef={contentRef} />
            <div ref={contentRef} className="space-y-16 print:p-8 print:space-y-8">
                {/* Hero */}
                <section className="text-center py-16 md:py-24 print:py-8">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 print:hidden">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        {t.executive.title}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-foreground mb-4 leading-tight print:text-4xl print:mb-2">
                        Jyotirmoy <span className="text-primary">Bhowmik</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-2 print:text-lg">
                        {t.executive.subtitle}
                    </p>
                    <p className="text-sm text-muted-foreground/70 max-w-xl mx-auto print:text-xs">
                        {t.executive.tagline}
                    </p>
                    <div className="hidden print:block mt-4 text-xs text-muted-foreground">
                        https://jyotirmoy.bhowmik.com/executive-summary
                    </div>
                </section>

                {/* KPI Grid */}
                <section className="print:break-inside-avoid">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 print:grid-cols-3 print:gap-4">
                        {kpis.map((kpi) => (
                            <div key={kpi.key} className="glass rounded-2xl p-6 md:p-8 text-center group hover:scale-[1.02] transition-transform print:shadow-none print:border print:border-gray-200">
                                <span className="text-3xl mb-3 block">{kpi.icon}</span>
                                <AnimatedCounter value={kpi.value} suffix={kpi.suffix} />
                                <p className="text-sm text-muted-foreground mt-2 font-medium">{getLabel(kpi)}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Key Competencies */}
                <section className="print:break-inside-avoid">
                    <h2 className="text-2xl font-bold mb-6 text-center print:text-xl print:mb-4">{t.executive.sections.coreCompetencies}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:grid-cols-2">
                        {[
                            { icon: "🏗️", title: "IT Infrastructure", desc: "Enterprise architecture, datacenter ops, cloud migration (AWS/Azure/GCP)" },
                            { icon: "📋", title: "Project Management", desc: "PMP-certified, Agile/Waterfall, multi-million dollar program delivery" },
                            { icon: "🔒", title: "Security & Compliance", desc: "ISO 27001, NIST frameworks, SOC compliance, risk assessment" },
                            { icon: "☁️", title: "Cloud & DevOps", desc: "Multi-cloud strategy, IaC, CI/CD pipelines, container orchestration" },
                            { icon: "👥", title: "Team Leadership", desc: "150+ engineers managed, mentoring, cross-cultural team building" },
                            { icon: "📊", title: "IT Governance", desc: "ITIL, COBIT, service management, vendor negotiation, budgeting" },
                        ].map((item) => (
                            <div key={item.title} className="glass rounded-xl p-5 hover:bg-surface/50 transition-colors print:shadow-none print:border print:border-gray-200">
                                <span className="text-2xl mb-3 block">{item.icon}</span>
                                <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                                <p className="text-xs text-muted-foreground">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Featured Testimonials */}
                {testimonials.length > 0 && (
                    <section className="print:break-inside-avoid">
                        <h2 className="text-2xl font-bold mb-6 text-center print:text-xl print:mb-4">{t.testimonials.title}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {testimonials.slice(0, 4).map((test) => (
                                <div key={test.id} className="glass rounded-xl p-6 print:shadow-none print:border print:border-gray-200">
                                    <svg className="w-6 h-6 text-primary/40 mb-3" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                    </svg>
                                    <p className="text-sm text-foreground leading-relaxed mb-4 italic">
                                        &ldquo;{getQuote(test)}&rdquo;
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-bold print:border print:border-gray-300 print:text-black">
                                            {test.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">{test.name}</p>
                                            <p className="text-xs text-muted-foreground">{test.role}, {test.organization}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </>
    );
}
