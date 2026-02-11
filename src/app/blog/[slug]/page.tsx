import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createClient();
    const { data } = await supabase.from("blog_posts").select("title, excerpt").eq("slug", slug).single();
    return {
        title: data ? `${data.title} | Blog` : "Blog Post",
        description: data?.excerpt || "",
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const supabase = await createClient();
    const { data: post } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

    if (!post) return notFound();

    return (
        <main className="min-h-screen pt-24 pb-16">
            <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary uppercase tracking-wider">
                            {post.category}
                        </span>
                        <span className="text-xs text-muted-foreground">{post.reading_time} min read</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4">{post.title}</h1>
                    {post.excerpt && (
                        <p className="text-lg text-muted-foreground">{post.excerpt}</p>
                    )}
                    <div className="flex items-center gap-4 mt-6 text-sm text-muted-foreground">
                        <span>{post.author_name}</span>
                        <span>•</span>
                        <span>
                            {post.published_at ? new Date(post.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : ""}
                        </span>
                    </div>
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {post.tags.map((tag: string) => (
                                <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-surface text-muted-foreground">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </header>
                {post.cover_image_url && (
                    <div className="rounded-2xl overflow-hidden mb-10">
                        <img src={post.cover_image_url} alt={post.title} className="w-full h-auto" />
                    </div>
                )}
                <div
                    className="prose prose-invert max-w-none prose-headings:font-bold prose-a:text-primary prose-p:text-muted-foreground prose-pre:bg-surface prose-pre:rounded-xl"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </article>
        </main>
    );
}
