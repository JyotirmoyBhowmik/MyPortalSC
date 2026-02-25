import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { getFeatureFlag } from "@/lib/data/settings";

export const revalidate = 3600; // Regenerate sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jyotirmoy.dev";
    const supabase = await createClient();

    // Static routes — always included
    const staticRoutes: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: new Date(), changeFrequency: "monthly", priority: 1.0 },
        { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
        { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
        { url: `${baseUrl}/projects`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
        { url: `${baseUrl}/skills`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
        { url: `${baseUrl}/initiatives`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
        { url: `${baseUrl}/initiatives/programs`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    ];

    // Dynamic project slugs
    const { data: projects } = await supabase
        .from("projects")
        .select("slug, updated_at")
        .eq("status", "published");

    const projectRoutes: MetadataRoute.Sitemap = (projects || []).map((p) => ({
        url: `${baseUrl}/projects/${p.slug}`,
        lastModified: new Date(p.updated_at),
        changeFrequency: "monthly" as const,
        priority: 0.7,
    }));

    // Feature-gated routes
    const [showBlog, showCaseStudies, showTestimonials, showTimeline, showSpeaking, showPublications, showDownloads, showExecSummary] =
        await Promise.all([
            getFeatureFlag("feature_blog"),
            getFeatureFlag("feature_case_studies"),
            getFeatureFlag("feature_testimonials"),
            getFeatureFlag("feature_timeline"),
            getFeatureFlag("feature_speaking"),
            getFeatureFlag("feature_publications"),
            getFeatureFlag("feature_downloads"),
            getFeatureFlag("feature_executive_summary"),
        ]);

    const gatedRoutes: MetadataRoute.Sitemap = [];

    if (showExecSummary) gatedRoutes.push({ url: `${baseUrl}/executive-summary`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 });
    if (showTestimonials) gatedRoutes.push({ url: `${baseUrl}/testimonials`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 });
    if (showTimeline) gatedRoutes.push({ url: `${baseUrl}/timeline`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 });
    if (showSpeaking) gatedRoutes.push({ url: `${baseUrl}/speaking`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 });
    if (showPublications) gatedRoutes.push({ url: `${baseUrl}/publications`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 });
    if (showDownloads) gatedRoutes.push({ url: `${baseUrl}/downloads`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 });

    // Dynamic blog slugs (if enabled)
    if (showBlog) {
        gatedRoutes.push({ url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 });
        const { data: posts } = await supabase.from("blog_posts").select("slug, updated_at").eq("status", "published");
        (posts || []).forEach((post) => {
            gatedRoutes.push({
                url: `${baseUrl}/blog/${post.slug}`,
                lastModified: new Date(post.updated_at),
                changeFrequency: "monthly" as const,
                priority: 0.6,
            });
        });
    }

    // Dynamic case study slugs (if enabled)
    if (showCaseStudies) {
        gatedRoutes.push({ url: `${baseUrl}/case-studies`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 });
        const { data: studies } = await supabase.from("case_studies").select("slug, updated_at").eq("status", "published");
        (studies || []).forEach((cs) => {
            gatedRoutes.push({
                url: `${baseUrl}/case-studies/${cs.slug}`,
                lastModified: new Date(cs.updated_at),
                changeFrequency: "monthly" as const,
                priority: 0.6,
            });
        });
    }

    return [...staticRoutes, ...projectRoutes, ...gatedRoutes];
}
