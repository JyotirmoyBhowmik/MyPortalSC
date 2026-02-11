import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
    const supabase = await createClient();

    // Fetch counts
    const [projectsRes, skillsRes, certsRes, achievementsRes, analyticsRes, auditRes, initiativesRes] =
        await Promise.all([
            supabase.from("projects").select("id", { count: "exact", head: true }),
            supabase.from("skills").select("id", { count: "exact", head: true }),
            supabase.from("certifications").select("id", { count: "exact", head: true }),
            supabase.from("achievements").select("id", { count: "exact", head: true }),
            supabase.from("page_analytics").select("*"),
            supabase
                .from("audit_log")
                .select("*")
                .order("timestamp", { ascending: false })
                .limit(10),
            supabase.from("initiatives").select("id", { count: "exact", head: true }),
        ]);

    const totalViews =
        analyticsRes.data?.reduce((sum, a) => sum + (a.view_count || 0), 0) ?? 0;

    const stats = [
        {
            label: "Projects",
            value: projectsRes.count ?? 0,
            icon: "📁",
            color: "from-indigo-500/20 to-indigo-600/20",
        },
        {
            label: "Skills",
            value: skillsRes.count ?? 0,
            icon: "💡",
            color: "from-violet-500/20 to-violet-600/20",
        },
        {
            label: "Certifications",
            value: certsRes.count ?? 0,
            icon: "🏆",
            color: "from-amber-500/20 to-amber-600/20",
        },
        {
            label: "Initiatives",
            value: initiativesRes.count ?? 0,
            icon: "⚡",
            color: "from-cyan-500/20 to-cyan-600/20",
        },
        {
            label: "Page Views",
            value: totalViews,
            icon: "📊",
            color: "from-emerald-500/20 to-emerald-600/20",
        },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Welcome back! Here&apos;s an overview of your portfolio.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className={`glass rounded-xl p-5 bg-gradient-to-br ${stat.color}`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-2xl">{stat.icon}</span>
                        </div>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="glass rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                {auditRes.data && auditRes.data.length > 0 ? (
                    <div className="space-y-3">
                        {auditRes.data.map((log) => (
                            <div
                                key={log.id}
                                className="flex items-center gap-4 p-3 rounded-lg bg-surface/50"
                            >
                                <div
                                    className={`w-2 h-2 rounded-full ${log.operation === "INSERT"
                                        ? "bg-success"
                                        : log.operation === "UPDATE"
                                            ? "bg-warning"
                                            : "bg-danger"
                                        }`}
                                />
                                <div className="flex-1 min-w-0">
                                    <span className="text-sm font-medium">
                                        {log.operation}
                                    </span>
                                    <span className="text-sm text-muted-foreground mx-2">
                                        on
                                    </span>
                                    <span className="text-sm font-medium text-primary">
                                        {log.table_name}
                                    </span>
                                </div>
                                <span className="text-xs text-muted-foreground flex-shrink-0">
                                    {new Date(log.timestamp).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground py-4 text-center">
                        No recent activity yet. Start managing your content!
                    </p>
                )}
            </div>
        </div>
    );
}
