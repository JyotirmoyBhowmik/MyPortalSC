import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { getFeatureFlag } from "@/lib/data/settings";
import { notFound } from "next/navigation";

export const revalidate = 60;

export const metadata = {
    title: "Blog | Jyotirmoy Bhowmik",
    description: "Insights on IT infrastructure, project management, cloud strategy, and enterprise technology.",
};

export default async function BlogPage() {
    const isEnabled = await getFeatureFlag("feature_blog");
    if (!isEnabled) notFound();

    const supabase = await createClient();
    const { data: posts } = await supabase
        .from("blog_posts")
        .select("id, slug, title, excerpt, cover_image_url, category, tags, reading_time, published_at, author_name")
        .eq("is_published", true)
        .order("published_at", { ascending: false });

    return (
        <main className="min-h-screen pt-24 pb-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <section className="text-center py-12">
                    <h1 className="text-4xl md:text-5xl font-black mb-4">Blog</h1>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                        Insights on IT infrastructure, cloud strategy, and enterprise technology leadership.
                    </p>
                </section>

                {posts && posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                                <article className="glass rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform">
                                    {post.cover_image_url && (
                                        <div className="h-48 bg-surface relative overflow-hidden">
                                            <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                    )}
                                    <div className="p-5">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase tracking-wider">
                                                {post.category}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground">{post.reading_time} min read</span>
                                        </div>
                                        <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                                            {post.title}
                                        </h2>
                                        {post.excerpt && (
                                            <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                                        )}
                                        <div className="mt-4 flex items-center justify-between">
                                            <span className="text-xs text-muted-foreground">
                                                {post.published_at ? new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}
                                            </span>
                                            <span className="text-xs text-primary font-medium group-hover:underline">Read →</span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-2xl mb-2">📝</p>
                        <p className="text-muted-foreground">No blog posts published yet.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
