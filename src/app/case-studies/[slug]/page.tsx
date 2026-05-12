import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import Link from "next/link";
import Image from "next/image";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createClient();
    const { data } = await supabase.from("case_studies").select("title, challenge, published_at").eq("slug", slug).single();

    if (!data) return { title: "Case Study not found" };

    const ogUrl = new URL(`${process.env.NEXT_PUBLIC_SITE_URL || "https://jyotirmoy.bhowmik.com"}/api/og`);
    ogUrl.searchParams.set("title", data.title);
    if (data.challenge) ogUrl.searchParams.set("subtitle", data.challenge.substring(0, 100) + "...");

    return {
        title: `${data.title} | Case Study`,
        description: data.challenge || "",
        openGraph: {
            title: data.title,
            description: data.challenge || "",
            type: "article",
            publishedTime: data.published_at,
            images: [
                {
                    url: ogUrl.toString(),
                    width: 1200,
                    height: 630,
                    alt: data.title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: data.title,
            description: data.challenge || "",
            images: [ogUrl.toString()],
        },
    };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const supabase = await createClient();
    const { data: study } = await supabase
        .from("case_studies")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

    if (!study) return notFound();

    return (
        <main className="min-h-screen pt-24 pb-16">
            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="mb-12">
                    <Link href="/case-studies" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        Back to Case Studies
                    </Link>

                    <div className="flex items-center gap-3 mb-4">
                        {study.industry && (
                            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary uppercase tracking-wider">
                                {study.industry}
                            </span>
                        )}
                        {study.duration && (
                            <span className="text-xs text-muted-foreground">{study.duration}</span>
                        )}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4">{study.title}</h1>
                    {study.client && (
                        <p className="text-xl text-primary font-medium mb-4">Client: {study.client}</p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 border-y border-border py-8">
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Challenge</h3>
                            <p className="text-sm">{study.challenge}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Solution</h3>
                            <p className="text-sm">{study.solution}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Outcome</h3>
                            <p className="text-sm">{study.outcome}</p>
                        </div>
                    </div>
                </header>

                {study.cover_image_url && (
                    <div className="rounded-2xl overflow-hidden mb-12 shadow-2xl">
                        <Image src={study.cover_image_url} alt={study.title} width={1200} height={630} className="w-full h-auto object-cover" />
                    </div>
                )}

                <div className="space-y-12">
                    {/* If rich text content existed, it would go here. Currently Schema uses challenge/solution/outcome as text fields. 
                        If there is a 'content' field in text, we can use it. 
                        Let's check schema. case_studies has: title, slug, client, industry, challenge, solution, outcome, duration, is_published, published_at, sort_order, cover_image_url, technologies.
                        It seems "content" is split into challenge/solution/outcome.
                    */}
                </div>
            </article>
        </main >
    );
}
