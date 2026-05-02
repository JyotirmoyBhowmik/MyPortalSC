/**
 * Inactive Pages Admin — shows all public routes that have feature flags
 * currently disabled, plus WIP pages that are not yet live.
 */
import Link from "next/link";
import { getSiteSettingsMap } from "@/lib/data/settings";

export const dynamic = "force-dynamic";

// All known public routes with their controlling feature flag (if any)
const PAGE_REGISTRY = [
    // Always active
    { path: "/", label: "Home", flag: null, status: "active" as const },
    { path: "/about", label: "About Me", flag: null, status: "active" as const },
    { path: "/projects", label: "Projects", flag: null, status: "active" as const },
    { path: "/skills", label: "Skills", flag: null, status: "active" as const },
    { path: "/contact", label: "Contact", flag: null, status: "active" as const },
    { path: "/initiatives", label: "Initiatives", flag: null, status: "active" as const },
    { path: "/budget", label: "IT Financial Ledger", flag: null, status: "active" as const },
    { path: "/timeline", label: "Timeline", flag: null, status: "active" as const },
    { path: "/downloads", label: "Downloads", flag: "feature_downloads", status: "conditional" as const },
    { path: "/executive-summary", label: "Executive Summary", flag: "feature_executive_summary", status: "conditional" as const },
    // Feature-gated
    { path: "/blog", label: "Blog", flag: "feature_blog", status: "conditional" as const },
    { path: "/testimonials", label: "Testimonials", flag: "feature_testimonials", status: "conditional" as const },
    { path: "/speaking", label: "Speaking", flag: "feature_speaking", status: "conditional" as const },
    { path: "/publications", label: "Publications", flag: "feature_publications", status: "conditional" as const },
    { path: "/case-studies", label: "Case Studies", flag: "feature_case_studies", status: "conditional" as const },
    { path: "/security", label: "Security Scorecard", flag: "feature_security_scorecard", status: "conditional" as const },
    { path: "/site-map", label: "Public Site Map", flag: null, status: "active" as const },
];

export default async function InactivePagesPage() {
    const settings = await getSiteSettingsMap();

    const pages = PAGE_REGISTRY.map((p) => {
        const isEnabled = p.flag ? !!settings[p.flag] : true;
        return { ...p, isEnabled };
    });

    const inactive = pages.filter((p) => !p.isEnabled);
    const active = pages.filter((p) => p.isEnabled);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Inactive Pages</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Public routes that are currently hidden or disabled via feature flags.
                    Enable them in{" "}
                    <Link href="/admin/settings" className="text-primary hover:underline">
                        Settings → Feature Toggles
                    </Link>
                    .
                </p>
            </div>

            {/* Inactive pages */}
            {inactive.length > 0 ? (
                <div className="glass rounded-xl overflow-hidden mb-8">
                    <div className="px-6 py-4 border-b border-border/50 flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <h2 className="font-bold text-red-400">{inactive.length} Inactive / Disabled Pages</h2>
                    </div>
                    <div className="divide-y divide-border/30">
                        {inactive.map((page) => (
                            <div key={page.path} className="flex items-center justify-between px-6 py-4 hover:bg-surface/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-2 h-2 rounded-full bg-red-500/60 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-sm">{page.label}</p>
                                        <p className="text-xs font-mono text-muted-foreground">{page.path}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {page.flag && (
                                        <span className="text-xs font-mono bg-surface border border-border px-2 py-0.5 rounded text-muted-foreground">
                                            {page.flag}
                                        </span>
                                    )}
                                    <Link
                                        href="/admin/settings"
                                        className="text-xs px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 font-medium transition-colors"
                                    >
                                        Enable →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="glass rounded-xl p-8 text-center mb-8">
                    <div className="text-3xl mb-3">✅</div>
                    <p className="font-semibold text-green-400">All pages are active!</p>
                    <p className="text-sm text-muted-foreground mt-1">No feature flags are currently disabled.</p>
                </div>
            )}

            {/* Active pages summary */}
            <div className="glass rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border/50 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    <h2 className="font-bold text-green-400">{active.length} Active Pages</h2>
                </div>
                <div className="divide-y divide-border/30">
                    {active.map((page) => (
                        <div key={page.path} className="flex items-center justify-between px-6 py-4 hover:bg-surface/30 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 rounded-full bg-green-500/60 flex-shrink-0" />
                                <div>
                                    <p className="font-medium text-sm">{page.label}</p>
                                    <p className="text-xs font-mono text-muted-foreground">{page.path}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {page.flag ? (
                                    <span className="text-xs px-2 py-0.5 rounded bg-green-500/10 text-green-400 font-medium">flag-gated</span>
                                ) : (
                                    <span className="text-xs px-2 py-0.5 rounded bg-surface border border-border text-muted-foreground">always-on</span>
                                )}
                                <a
                                    href={page.path}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:underline"
                                >
                                    View ↗
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
