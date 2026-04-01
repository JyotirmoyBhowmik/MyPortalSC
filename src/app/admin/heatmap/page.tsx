import { createClient } from "@/lib/supabase/server";

export default async function HeatmapPage() {
    const supabase = await createClient();

    // Fetch aggregated click data per page (last 7 days)
    const { data: clicks } = await supabase
        .from("click_events")
        .select("page_path, x_percent, y_percent, element_selector, created_at")
        .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order("created_at", { ascending: false })
        .limit(5000);

    // Group by page
    const pageGroups: Record<string, { x: number; y: number; count: number }[]> = {};
    const pageCounts: Record<string, number> = {};
    const topElements: Record<string, Record<string, number>> = {};

    for (const click of clicks || []) {
        const path = click.page_path;
        if (!pageGroups[path]) pageGroups[path] = [];
        if (!pageCounts[path]) pageCounts[path] = 0;
        pageCounts[path]++;

        // Grid-based aggregation (10% buckets)
        const gridX = Math.floor(click.x_percent / 10) * 10;
        const gridY = Math.floor(click.y_percent / 10) * 10;
        const existing = pageGroups[path].find((p) => p.x === gridX && p.y === gridY);
        if (existing) {
            existing.count++;
        } else {
            pageGroups[path].push({ x: gridX, y: gridY, count: 1 });
        }

        // Track top clicked elements
        if (click.element_selector) {
            if (!topElements[path]) topElements[path] = {};
            topElements[path][click.element_selector] = (topElements[path][click.element_selector] || 0) + 1;
        }
    }

    const sortedPages = Object.entries(pageCounts).sort(([, a], [, b]) => b - a);
    const totalClicks = clicks?.length || 0;

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Click Heatmap</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Aggregated click positions from the last 7 days. {totalClicks.toLocaleString()} total clicks tracked.
                </p>
            </div>

            {totalClicks === 0 ? (
                <div className="glass rounded-xl p-12 text-center">
                    <p className="text-4xl mb-4">🖱️</p>
                    <h3 className="text-lg font-semibold mb-2">No click data yet</h3>
                    <p className="text-sm text-muted-foreground">
                        Click events will appear here once visitors interact with the site.
                        <br />Run the SQL migration (018_click_events_and_integrity.sql) then deploy.
                    </p>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Page Overview */}
                    <div className="glass rounded-xl p-6">
                        <h2 className="text-base font-bold mb-4">Clicks by Page</h2>
                        <div className="space-y-2">
                            {sortedPages.map(([path, count]) => {
                                const pct = Math.round((count / totalClicks) * 100);
                                return (
                                    <div key={path} className="flex items-center gap-3">
                                        <span className="text-sm font-mono text-primary w-48 truncate">{path}</span>
                                        <div className="flex-1 bg-surface rounded-full h-3 overflow-hidden">
                                            <div
                                                className="h-full bg-primary/60 rounded-full transition-all"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-muted-foreground w-20 text-right">
                                            {count} ({pct}%)
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Heatmap Grid per Page */}
                    {sortedPages.slice(0, 5).map(([path]) => {
                        const grid = pageGroups[path] || [];
                        const maxCount = Math.max(...grid.map((g) => g.count), 1);
                        const elements = topElements[path] || {};
                        const topEls = Object.entries(elements).sort(([, a], [, b]) => b - a).slice(0, 5);

                        return (
                            <div key={path} className="glass rounded-xl p-6">
                                <h3 className="text-sm font-bold text-primary mb-3 font-mono">{path}</h3>

                                {/* Visual grid */}
                                <div className="relative w-full bg-background/30 rounded-lg border border-border/30 overflow-hidden" style={{ paddingBottom: "60%" }}>
                                    {grid.map((cell, i) => {
                                        const intensity = cell.count / maxCount;
                                        const hue = 60 - intensity * 60; // yellow → red
                                        return (
                                            <div
                                                key={i}
                                                className="absolute rounded-sm"
                                                style={{
                                                    left: `${cell.x}%`,
                                                    top: `${cell.y}%`,
                                                    width: "10%",
                                                    height: "10%",
                                                    backgroundColor: `hsla(${hue}, 90%, 50%, ${0.15 + intensity * 0.6})`,
                                                }}
                                                title={`${cell.count} clicks at (${cell.x}%, ${cell.y}%)`}
                                            />
                                        );
                                    })}
                                    <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground pointer-events-none">
                                        Click density overlay
                                    </div>
                                </div>

                                {/* Top clicked elements */}
                                {topEls.length > 0 && (
                                    <div className="mt-4">
                                        <p className="text-xs text-muted-foreground mb-2">Top clicked elements:</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {topEls.map(([sel, count]) => (
                                                <span key={sel} className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface text-muted-foreground">
                                                    {sel.substring(0, 40)} ({count})
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
