import { createClient } from "@/lib/supabase/server";
import { getFeatureFlag } from "@/lib/data/settings";
import { notFound } from "next/navigation";

export const revalidate = 60;

export const metadata = {
    title: "Publications & Awards | Jyotirmoy Bhowmik",
    description: "Published papers, certifications, awards, and industry recognitions.",
};

export default async function PublicationsPage() {
    const isEnabled = await getFeatureFlag("feature_publications");
    if (!isEnabled) notFound();

    const supabase = await createClient();
    const { data: items } = await supabase
        .from("publications")
        .select("*")
        .eq("is_published", true)
        .order("published_date", { ascending: false });

    const typeIcons: Record<string, string> = {
        paper: "📄",
        award: "🏆",
        recognition: "⭐",
        certification: "🎓",
        article: "📝",
    };

    return (
        <main className="min-h-screen pt-24 pb-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <section className="text-center py-12">
                    <h1 className="text-4xl md:text-5xl font-black mb-4">Publications & Awards</h1>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                        Published research, certifications, and industry recognitions.
                    </p>
                </section>

                {items && items.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {items.map((item) => (
                            <div key={item.id} className="glass rounded-xl p-5 hover:scale-[1.01] transition-transform">
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">{typeIcons[item.publication_type] || "📄"}</span>
                                    <div className="flex-1">
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase tracking-wider">
                                            {item.publication_type}
                                        </span>
                                        <h2 className="text-base font-bold mt-2">{item.title}</h2>
                                        {item.publisher && <p className="text-sm text-primary/70 font-medium">{item.publisher}</p>}
                                        {item.published_date && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {new Date(item.published_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                                            </p>
                                        )}
                                        {item.description && <p className="text-sm text-muted-foreground mt-2">{item.description}</p>}
                                        {item.url && (
                                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-xs text-primary hover:underline">
                                                View →
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-2xl mb-2">📄</p>
                        <p className="text-muted-foreground">No publications or awards published yet.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
