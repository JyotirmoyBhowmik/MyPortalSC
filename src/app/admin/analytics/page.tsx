import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
    const supabase = await createClient();

    const { data: recentEvents } = await supabase
        .from("visitor_events")
        .select("page_path, event_type, created_at, referrer, device_type, country")
        .order("created_at", { ascending: false })
        .limit(50);

    // Aggregate page views
    const pageCounts: Record<string, number> = {};
    const deviceCounts: Record<string, number> = {};
    const countryCounts: Record<string, number> = {};

    recentEvents?.forEach((e) => {
        pageCounts[e.page_path] = (pageCounts[e.page_path] || 0) + 1;
        if (e.device_type) deviceCounts[e.device_type] = (deviceCounts[e.device_type] || 0) + 1;
        if (e.country) countryCounts[e.country] = (countryCounts[e.country] || 0) + 1;
    });

    const topPages = Object.entries(pageCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Analytics</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Visitor analytics and engagement metrics (privacy-first, no cookies).
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="glass rounded-xl p-6 text-center">
                    <p className="text-3xl font-black text-primary">{recentEvents?.length || 0}</p>
                    <p className="text-xs text-muted-foreground mt-1">Recent Events</p>
                </div>
                <div className="glass rounded-xl p-6 text-center">
                    <p className="text-3xl font-black text-primary">{Object.keys(pageCounts).length}</p>
                    <p className="text-xs text-muted-foreground mt-1">Unique Pages</p>
                </div>
                <div className="glass rounded-xl p-6 text-center">
                    <p className="text-3xl font-black text-primary">{Object.keys(countryCounts).length}</p>
                    <p className="text-xs text-muted-foreground mt-1">Countries</p>
                </div>
            </div>

            {/* Top Pages */}
            <div className="glass rounded-xl p-6 mb-6">
                <h2 className="text-sm font-bold mb-4">Top Pages</h2>
                {topPages.length > 0 ? (
                    <div className="space-y-2">
                        {topPages.map(([page, count]) => (
                            <div key={page} className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground truncate">{page}</span>
                                <span className="font-mono text-primary font-bold">{count}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No analytics data yet.</p>
                )}
            </div>

            {/* Recent Events Table */}
            <div className="glass rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-surface/50">
                        <tr>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Page</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Type</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden md:table-cell">Device</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {recentEvents?.slice(0, 20).map((e, i) => (
                            <tr key={i} className="hover:bg-surface/30 transition-colors">
                                <td className="px-4 py-2 text-sm text-foreground">{e.page_path}</td>
                                <td className="px-4 py-2">
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">{e.event_type}</span>
                                </td>
                                <td className="px-4 py-2 text-sm text-muted-foreground hidden md:table-cell">{e.device_type || "—"}</td>
                                <td className="px-4 py-2 text-xs text-muted-foreground">{new Date(e.created_at).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {(!recentEvents || recentEvents.length === 0) && (
                    <p className="text-sm text-muted-foreground text-center py-8">No events recorded yet.</p>
                )}
            </div>
        </div>
    );
}
