import { createClient } from "@/lib/supabase/server";
import { getFeatureFlag, getSiteSettingsMap } from "@/lib/data/settings";
import Link from "next/link";
import nextDynamic from "next/dynamic";
import QuickEditHero from "@/components/admin/QuickEditHero";

const AnalyticsDashboard = nextDynamic(() => import("@/components/admin/AnalyticsDashboard"), {
    loading: () => <div className="h-[400px] w-full rounded-xl bg-surface/10 animate-pulse mt-8" />,
});

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
    const supabase = await createClient();
    const [allowActivityFeed, settingsMap] = await Promise.all([
        getFeatureFlag("feature_activity_feed"),
        getSiteSettingsMap(),
    ]);

    const availableForOpportunities = !!settingsMap["feature_available_for_opportunities"];

    // Fetch counts and analytics
    const [
        projectsRes, skillsRes, certsRes,
        analyticsRes, auditRes, initiativesRes, clicksRes, contactsRes
    ] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("skills").select("id", { count: "exact", head: true }),
        supabase.from("certifications").select("id", { count: "exact", head: true }),

        supabase.from("page_analytics").select("*"),
        supabase.from("audit_log").select("*").order("timestamp", { ascending: false }).limit(10),
        supabase.from("initiatives").select("id", { count: "exact", head: true }),
        supabase.from("click_events").select("*"),
        supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }).limit(10),
    ]);

    const totalViews =
        analyticsRes.data?.reduce((sum, a) => sum + (a.view_count || 0), 0) ?? 0;

    const stats = [
        { label: "Projects", value: projectsRes.count ?? 0, icon: "📁", color: "from-indigo-500/20 to-indigo-600/20", href: "/admin/projects" },
        { label: "Skills", value: skillsRes.count ?? 0, icon: "💡", color: "from-violet-500/20 to-violet-600/20", href: "/admin/skills" },
        { label: "Certifications", value: certsRes.count ?? 0, icon: "🏆", color: "from-amber-500/20 to-amber-600/20", href: "/admin/certifications" },
        { label: "Initiatives", value: initiativesRes.count ?? 0, icon: "⚡", color: "from-cyan-500/20 to-cyan-600/20", href: "/admin/initiatives" },
        { label: "Page Views", value: totalViews, icon: "📊", color: "from-emerald-500/20 to-emerald-600/20", href: "/admin/analytics" },
    ];

    // Hero content for quick edit
    let heroTitle = "Jyotirmoy Bhowmik";
    let heroSubtitle = "IT Infrastructure & Cloud Specialist";
    let heroDescription = "";
    try {
        const { data: pageRow } = await supabase
            .from("content_pages")
            .select("content")
            .eq("page_key", "home")
            .single();
        if (pageRow?.content) {
            const c = pageRow.content as Record<string, string>;
            heroTitle = c.hero_title || heroTitle;
            heroSubtitle = c.hero_subtitle || heroSubtitle;
            heroDescription = c.hero_description || heroDescription;
        }
    } catch { /* page may not exist yet */ }

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Welcome back! Here&apos;s an overview of your portfolio.
                    </p>
                </div>
                <Link
                    href="/admin/settings"
                    className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-xl text-sm font-medium hover:bg-surface-hover hover:text-primary transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                {stats.map((stat) => (
                    <Link
                        key={stat.label}
                        href={stat.href}
                        className={`glass rounded-xl p-5 bg-gradient-to-br ${stat.color} hover:scale-[1.02] transition-transform`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-2xl">{stat.icon}</span>
                        </div>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                    </Link>
                ))}
            </div>

            {/* Quick-Edit Hero Panel */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-lg font-bold">Quick-Edit Hero</h2>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">Inline</span>
                    <div className="ml-auto flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${availableForOpportunities ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                            {availableForOpportunities ? "● Available for Opportunities" : "○ Not Available"}
                        </span>
                        <Link href="/admin/settings" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                            Change →
                        </Link>
                    </div>
                </div>
                <QuickEditHero
                    initialTitle={heroTitle}
                    initialSubtitle={heroSubtitle}
                    initialDescription={heroDescription}
                />
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {[
                    { href: "/admin/profile", label: "Profile Photo", icon: "🖼️" },
                    { href: "/admin/certifications", label: "Certifications", icon: "🏆" },
                    { href: "/admin/inactive-pages", label: "Inactive Pages", icon: "🚫" },
                    { href: "/admin/sitemap", label: "Codebase Map", icon: "🗺️" },
                ].map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="glass rounded-xl p-4 flex items-center gap-3 hover:bg-primary/5 hover:border-primary/20 border border-transparent transition-all group"
                    >
                        <span className="text-xl">{link.icon}</span>
                        <span className="text-sm font-medium group-hover:text-primary transition-colors">{link.label}</span>
                    </Link>
                ))}
            </div>

            {/* Recent Activity */}
            {allowActivityFeed && (
                <div className="glass rounded-xl p-6 mb-8">
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
                                        <span className="text-sm font-medium">{log.operation}</span>
                                        <span className="text-sm text-muted-foreground mx-2">on</span>
                                        <span className="text-sm font-medium text-primary">{log.table_name}</span>
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
            )}

            <AnalyticsDashboard
                clickEvents={clicksRes.data ?? []}
                pageAnalytics={analyticsRes.data ?? []}
                recentContacts={contactsRes.data ?? []}
            />
        </div>
    );
}
