import { createClient } from "@/lib/supabase/server";
import AnalyticsCharts from "@/components/admin/AnalyticsCharts";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
    const supabase = await createClient();

    // Fetch up to 1000 recent events for charting (approx 30 days if low traffic)
    // For a real production app with high traffic, this should be aggregated via a materialized view or RPC.
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: recentEvents } = await supabase
        .from("visitor_events")
        .select("page_path, event_type, created_at, referrer, device_type, country")
        .gte("created_at", thirtyDaysAgo.toISOString())
        .order("created_at", { ascending: false })
        .limit(1000);

    // Aggregations
    const pageCounts: Record<string, number> = {};
    const deviceCounts: Record<string, number> = {};
    const countryCounts: Record<string, number> = {};
    const dateCounts: Record<string, number> = {};

    // Initialize last 30 days with 0 views
    for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split("T")[0];
        dateCounts[dateStr] = 0;
    }

    recentEvents?.forEach((e) => {
        // Page Views
        pageCounts[e.page_path] = (pageCounts[e.page_path] || 0) + 1;

        // Devices
        const device = e.device_type || "unknown";
        deviceCounts[device] = (deviceCounts[device] || 0) + 1;

        // Countries
        if (e.country) countryCounts[e.country] = (countryCounts[e.country] || 0) + 1;

        // Date grouping
        const dateStr = e.created_at.split("T")[0];
        if (dateCounts[dateStr] !== undefined) {
            dateCounts[dateStr]++;
        }
    });

    const timeSeriesData = Object.entries(dateCounts).map(([date, views]) => ({ date, views }));

    // Sort array of top pages
    const topPages = Object.entries(pageCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([name, value]) => ({ name, value }));

    const deviceStats = Object.entries(deviceCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([name, value]) => ({ name, value }));

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Analytics</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Visitor analytics and engagement metrics for the last 30 days.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="glass rounded-xl p-6 text-center">
                    <p className="text-3xl font-black text-primary">{recentEvents?.length || 0}</p>
                    <p className="text-xs text-muted-foreground mt-1">Total Views (30d)</p>
                </div>
                <div className="glass rounded-xl p-6 text-center">
                    <p className="text-3xl font-black text-primary">{Object.keys(pageCounts).length}</p>
                    <p className="text-xs text-muted-foreground mt-1">Unique Pages</p>
                </div>
                <div className="glass rounded-xl p-6 text-center">
                    <p className="text-3xl font-black text-primary">{Math.round((recentEvents?.length || 0) / 30)}</p>
                    <p className="text-xs text-muted-foreground mt-1">Avg. Views/Day</p>
                </div>
                <div className="glass rounded-xl p-6 text-center">
                    <p className="text-3xl font-black text-primary">{deviceStats.find(d => d.name === 'mobile')?.value || 0}</p>
                    <p className="text-xs text-muted-foreground mt-1">Mobile Users</p>
                </div>
            </div>

            <div className="mb-8">
                <AnalyticsCharts
                    timeSeries={timeSeriesData}
                    deviceStats={deviceStats}
                    topPages={topPages}
                />
            </div>

            {/* Recent Events Table */}
            <div className="glass rounded-xl overflow-hidden mt-8">
                <div className="p-4 border-b border-border/50">
                    <h3 className="text-sm font-bold">Recent Live Events</h3>
                </div>
                <table className="w-full">
                    <thead className="bg-surface/50">
                        <tr>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Page</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Type</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden md:table-cell">Device</th>
                            <th className="text-right text-xs font-semibold text-muted-foreground px-4 py-3">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {recentEvents?.slice(0, 10).map((e, i) => (
                            <tr key={i} className="hover:bg-surface/30 transition-colors">
                                <td className="px-4 py-3 text-sm text-foreground">{e.page_path}</td>
                                <td className="px-4 py-3">
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">{e.event_type}</span>
                                </td>
                                <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell capitalize">{e.device_type || "—"}</td>
                                <td className="px-4 py-3 text-xs text-muted-foreground text-right">{new Date(e.created_at).toLocaleString()}</td>
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
