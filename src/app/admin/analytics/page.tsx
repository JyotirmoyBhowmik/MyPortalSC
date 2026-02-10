import { createClient } from "@/lib/supabase/server";

export default async function AdminAnalyticsPage() {
    const supabase = await createClient();

    const { data: analytics } = await supabase
        .from("page_analytics")
        .select("*")
        .order("view_count", { ascending: false });

    const totalViews = analytics?.reduce((s, a) => s + (a.view_count || 0), 0) ?? 0;
    const totalVisitors = analytics?.reduce(
        (s, a) => s + (a.unique_visitors || 0),
        0
    ) ?? 0;
    const maxViews = Math.max(...(analytics?.map((a) => a.view_count) ?? [1]));

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Analytics</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Page views and visitor statistics
                </p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="glass rounded-xl p-5">
                    <div className="text-3xl font-bold gradient-text">{totalViews}</div>
                    <div className="text-sm text-muted-foreground mt-1">Total Page Views</div>
                </div>
                <div className="glass rounded-xl p-5">
                    <div className="text-3xl font-bold gradient-text">{totalVisitors}</div>
                    <div className="text-sm text-muted-foreground mt-1">Unique Visitors</div>
                </div>
                <div className="glass rounded-xl p-5">
                    <div className="text-3xl font-bold gradient-text">
                        {analytics?.length ?? 0}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Tracked Pages</div>
                </div>
            </div>

            {/* Bar Chart */}
            <div className="glass rounded-xl p-6 mb-8">
                <h2 className="text-lg font-semibold mb-6">Page Views by Path</h2>
                <div className="space-y-4">
                    {analytics?.map((a) => (
                        <div key={a.id} className="flex items-center gap-4">
                            <div className="w-24 text-sm font-mono text-muted-foreground truncate flex-shrink-0">
                                {a.page_path}
                            </div>
                            <div className="flex-1">
                                <div className="h-7 bg-muted rounded-lg overflow-hidden relative">
                                    <div
                                        className="h-full rounded-lg gradient-bg flex items-center justify-end pr-3 transition-all duration-700"
                                        style={{
                                            width: `${Math.max((a.view_count / maxViews) * 100, 8)}%`,
                                        }}
                                    >
                                        <span className="text-xs font-medium text-white">
                                            {a.view_count}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-xs text-muted-foreground w-16 text-right flex-shrink-0">
                                {a.unique_visitors} unique
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="glass rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="text-left p-4 font-medium text-muted-foreground">Page</th>
                            <th className="text-right p-4 font-medium text-muted-foreground">Views</th>
                            <th className="text-right p-4 font-medium text-muted-foreground">Visitors</th>
                            <th className="text-right p-4 font-medium text-muted-foreground hidden sm:table-cell">Last Viewed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {analytics?.map((a) => (
                            <tr key={a.id} className="border-b border-border/50 hover:bg-surface/50">
                                <td className="p-4 font-mono">{a.page_path}</td>
                                <td className="p-4 text-right">{a.view_count}</td>
                                <td className="p-4 text-right">{a.unique_visitors}</td>
                                <td className="p-4 text-right text-muted-foreground hidden sm:table-cell">
                                    {new Date(a.last_viewed).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
