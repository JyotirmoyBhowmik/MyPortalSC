"use client";

import { useTranslation, type Locale } from "@/lib/i18n";

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

export default function TestimonialsContent({ testimonials }: { testimonials: Testimonial[] }) {
    const { locale, t } = useTranslation();

    function getQuote(test: Testimonial): string {
        const map: Record<Locale, string | null> = { en: test.quote_en, hi: test.quote_hi, bn: test.quote_bn };
        return map[locale] || test.quote_en;
    }

    return (
        <div>
            {/* Hero */}
            <section className="text-center py-12">
                <h1 className="text-4xl md:text-5xl font-black mb-4">{t.testimonials.title}</h1>
                <p className="text-lg text-muted-foreground max-w-xl mx-auto">{t.testimonials.subtitle}</p>
            </section>

            {/* Grid */}
            {testimonials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {testimonials.map((test, idx) => (
                        <div
                            key={test.id}
                            className={`glass rounded-2xl p-8 hover:scale-[1.01] transition-all duration-300 ${idx === 0 ? "md:col-span-2" : ""}`}
                        >
                            <svg className="w-8 h-8 text-primary/30 mb-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                            </svg>
                            <p className={`text-foreground leading-relaxed mb-6 italic ${idx === 0 ? "text-lg" : "text-sm"}`}>
                                &ldquo;{getQuote(test)}&rdquo;
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-primary/20">
                                    {test.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-foreground">{test.name}</p>
                                    <p className="text-sm text-muted-foreground">{test.role}</p>
                                    <p className="text-xs text-primary">{test.organization}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-muted-foreground py-12">{t.testimonials.noTestimonials}</p>
            )}
        </div>
    );
}
