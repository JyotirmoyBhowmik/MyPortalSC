import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Downloads | Jyotirmoy Bhowmik",
    description: "Download executive briefs, white papers, and professional resources.",
};

export default async function DownloadsPage() {
    const supabase = await createClient();
    const { data: downloads } = await supabase
        .from("downloads")
        .select("*")
        .eq("is_published", true)
        .order("sort_order");

    const fileIcons: Record<string, string> = {
        pdf: "📕",
        doc: "📘",
        ppt: "📙",
        xls: "📗",
        zip: "📦",
        default: "📁",
    };

    return (
        <main className="min-h-screen pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <section className="text-center py-12">
                    <h1 className="text-4xl md:text-5xl font-black mb-4">Downloads</h1>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                        Executive briefs, white papers, and professional resources.
                    </p>
                </section>

                {downloads && downloads.length > 0 ? (
                    <div className="space-y-3">
                        {downloads.map((dl) => (
                            <a
                                key={dl.id}
                                href={dl.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block glass rounded-xl p-5 hover:scale-[1.005] transition-transform group"
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-3xl">{fileIcons[dl.file_type] || fileIcons.default}</span>
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-base font-bold group-hover:text-primary transition-colors">{dl.title}</h2>
                                        {dl.description && <p className="text-sm text-muted-foreground mt-0.5 truncate">{dl.description}</p>}
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface text-muted-foreground uppercase">
                                            {dl.file_type}
                                        </span>
                                        {dl.file_size && <p className="text-[10px] text-muted-foreground mt-1">{dl.file_size}</p>}
                                    </div>
                                    <svg className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </a>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-2xl mb-2">📦</p>
                        <p className="text-muted-foreground">No downloads available yet.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
