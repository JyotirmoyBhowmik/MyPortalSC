import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminSpeakingPage() {
    const supabase = await createClient();
    const { data: events } = await supabase.from("speaking_events").select("*").order("event_date", { ascending: false });

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Speaking Events</h1>
                <p className="text-sm text-muted-foreground mt-1">Manage conferences, webinars, and workshops.</p>
            </div>
            <div className="glass rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-surface/50">
                        <tr>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Title</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden md:table-cell">Event</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Type</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {events?.map((e) => (
                            <tr key={e.id} className="hover:bg-surface/30">
                                <td className="px-4 py-3 text-sm font-medium">{e.title}</td>
                                <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{e.event_name}</td>
                                <td className="px-4 py-3"><span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary uppercase">{e.event_type}</span></td>
                                <td className="px-4 py-3 text-xs text-muted-foreground">{e.event_date ? new Date(e.event_date).toLocaleDateString() : "—"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {(!events || events.length === 0) && <p className="text-sm text-muted-foreground text-center py-8">No speaking events yet.</p>}
            </div>
        </div>
    );
}
