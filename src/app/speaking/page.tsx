import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Speaking | Jyotirmoy Bhowmik",
    description: "Conference talks, webinars, panels, and workshops on enterprise IT transformation.",
};

export default async function SpeakingPage() {
    const supabase = await createClient();
    const { data: events } = await supabase
        .from("speaking_events")
        .select("*")
        .eq("is_published", true)
        .order("event_date", { ascending: false });

    const typeIcons: Record<string, string> = {
        conference: "🎤",
        webinar: "💻",
        panel: "🗣️",
        workshop: "🛠️",
        keynote: "⭐",
    };

    return (
        <main className="min-h-screen pt-24 pb-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <section className="text-center py-12">
                    <h1 className="text-4xl md:text-5xl font-black mb-4">Speaking</h1>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                        Conference talks, panels, and workshops on IT infrastructure and digital transformation.
                    </p>
                </section>

                {events && events.length > 0 ? (
                    <div className="space-y-4">
                        {events.map((event) => (
                            <div key={event.id} className="glass rounded-xl p-6 hover:scale-[1.005] transition-transform">
                                <div className="flex items-start gap-4">
                                    <span className="text-3xl">{typeIcons[event.event_type] || "🎤"}</span>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase tracking-wider">
                                                {event.event_type}
                                            </span>
                                            {event.event_date && (
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(event.event_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                                                </span>
                                            )}
                                        </div>
                                        <h2 className="text-lg font-bold mb-1">{event.title}</h2>
                                        <p className="text-sm text-primary/70 font-medium">{event.event_name}</p>
                                        {event.location && <p className="text-xs text-muted-foreground mt-1">📍 {event.location}</p>}
                                        {event.description && <p className="text-sm text-muted-foreground mt-2">{event.description}</p>}
                                        <div className="flex gap-3 mt-3">
                                            {event.slides_url && (
                                                <a href={event.slides_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                                                    📄 Slides
                                                </a>
                                            )}
                                            {event.video_url && (
                                                <a href={event.video_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                                                    🎬 Video
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-2xl mb-2">🎤</p>
                        <p className="text-muted-foreground">No speaking events published yet.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
