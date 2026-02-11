import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Case Studies | Jyotirmoy Bhowmik",
    description: "Real-world enterprise IT transformation case studies with measurable outcomes.",
};

export default async function CaseStudiesPage() {
    const supabase = await createClient();
    const { data: cases } = await supabase
        .from("case_studies")
        .select("id, slug, title, client, industry, challenge, outcome, cover_image_url, technologies, duration")
        .eq("is_published", true)
        .order("sort_order");

    return (
        <main className="min-h-screen pt-24 pb-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <section className="text-center py-12">
                    <h1 className="text-4xl md:text-5xl font-black mb-4">Case Studies</h1>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                        Enterprise-scale IT transformations with measurable business impact.
                    </p>
                </section>

                {cases && cases.length > 0 ? (
                    <div className="space-y-8">
                        {cases.map((cs) => (
                            <Link key={cs.id} href={`/case-studies/${cs.slug}`} className="block group">
                                <article className="glass rounded-2xl p-6 md:p-8 hover:scale-[1.01] transition-transform">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        {cs.cover_image_url && (
                                            <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden bg-surface flex-shrink-0">
                                                <img src={cs.cover_image_url} alt={cs.title} className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                {cs.industry && (
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase tracking-wider">
                                                        {cs.industry}
                                                    </span>
                                                )}
                                                {cs.duration && (
                                                    <span className="text-[10px] text-muted-foreground">{cs.duration}</span>
                                                )}
                                            </div>
                                            <h2 className="text-xl font-bold group-hover:text-primary transition-colors mb-2">{cs.title}</h2>
                                            {cs.client && <p className="text-sm text-primary/70 font-medium mb-2">{cs.client}</p>}
                                            {cs.challenge && <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{cs.challenge}</p>}
                                            {cs.technologies && cs.technologies.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {cs.technologies.slice(0, 5).map((tech: string) => (
                                                        <span key={tech} className="text-[10px] px-2 py-0.5 rounded bg-surface text-muted-foreground">{tech}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-2xl mb-2">📊</p>
                        <p className="text-muted-foreground">No case studies published yet.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
