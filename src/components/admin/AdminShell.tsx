"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ThemeSwitcher from "@/components/ThemeSwitcher";

/* ─── Sidebar link definitions ─── */
const sidebarSections = [
    {
        title: "Content",
        links: [
            {
                href: "/admin",
                label: "Dashboard",
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                ),
            },
            {
                href: "/admin/projects",
                label: "Projects",
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                ),
            },
            {
                href: "/admin/initiatives",
                label: "Initiatives",
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                ),
                badge: "New",
            },
            {
                href: "/admin/skills",
                label: "Skills",
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                ),
            },
        ],
    },
    {
        title: "Recognition",
        links: [
            {
                href: "/admin/certifications",
                label: "Certifications",
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                ),
            },
            {
                href: "/admin/achievements",
                label: "Achievements",
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                ),
            },
        ],
    },
    {
        title: "Insights",
        links: [
            {
                href: "/admin/analytics",
                label: "Analytics",
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                ),
            },
        ],
    },
];

/* ─── Breadcrumb helper ─── */
function getBreadcrumbs(pathname: string): { label: string; href: string }[] {
    const parts = pathname.split("/").filter(Boolean); // ["admin", "initiatives"]
    const crumbs: { label: string; href: string }[] = [];
    let path = "";
    for (const part of parts) {
        path += `/${part}`;
        const label = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, " ");
        crumbs.push({ label, href: path });
    }
    return crumbs;
}

/* ─── Component ─── */
export default function AdminShell({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    async function handleLogout() {
        await supabase.auth.signOut();
        router.push("/admin/login");
        router.refresh();
    }

    const breadcrumbs = getBreadcrumbs(pathname);

    const sidebarWidth = sidebarCollapsed ? "w-16" : "w-64";

    return (
        <div className="min-h-screen bg-background flex">
            {/* ─── Mobile overlay ─── */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* ─── Sidebar ─── */}
            <aside
                className={`
                    ${sidebarWidth} border-r border-border bg-surface/30 backdrop-blur-lg
                    flex flex-col fixed top-16 bottom-0 left-0 z-50
                    transition-all duration-300 ease-in-out
                    ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
                `}
            >
                {/* Collapse toggle — desktop only */}
                <div className="hidden lg:flex items-center justify-end p-2">
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface transition-all"
                        title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        <svg className={`w-4 h-4 transition-transform ${sidebarCollapsed ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                        </svg>
                    </button>
                </div>

                {/* Nav links */}
                <nav className="flex-1 px-2 py-2 overflow-y-auto space-y-6">
                    {sidebarSections.map((section) => (
                        <div key={section.title}>
                            {!sidebarCollapsed && (
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 px-3">
                                    {section.title}
                                </p>
                            )}
                            <div className="space-y-0.5">
                                {section.links.map((link) => {
                                    const isActive =
                                        pathname === link.href ||
                                        (link.href !== "/admin" && pathname.startsWith(link.href));
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setMobileOpen(false)}
                                            title={sidebarCollapsed ? link.label : undefined}
                                            className={`
                                                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative group
                                                ${isActive
                                                    ? "bg-primary/10 text-primary shadow-sm shadow-primary/5"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
                                                }
                                            `}
                                        >
                                            {/* Active indicator bar */}
                                            {isActive && (
                                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                                            )}
                                            <span className={`flex-shrink-0 ${sidebarCollapsed ? "mx-auto" : ""}`}>
                                                {link.icon}
                                            </span>
                                            {!sidebarCollapsed && (
                                                <>
                                                    <span className="truncate">{link.label}</span>
                                                    {"badge" in link && link.badge && (
                                                        <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary font-bold">
                                                            {link.badge}
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Bottom actions */}
                <div className="p-2 border-t border-border space-y-1">
                    {!sidebarCollapsed && (
                        <Link
                            href="/"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            View Site
                        </Link>
                    )}
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-danger hover:bg-danger/10 transition-all w-full ${sidebarCollapsed ? "justify-center" : ""}`}
                    >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        {!sidebarCollapsed && "Sign Out"}
                    </button>
                </div>
            </aside>

            {/* ─── Main content area ─── */}
            <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
                {/* Top bar */}
                <header className="sticky top-16 z-30 bg-background/80 backdrop-blur-lg border-b border-border">
                    <div className="flex items-center justify-between px-4 sm:px-6 h-14">
                        {/* Left: Mobile hamburger + Breadcrumbs */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <nav className="flex items-center gap-1.5 text-sm">
                                {breadcrumbs.map((crumb, i) => (
                                    <span key={crumb.href} className="flex items-center gap-1.5">
                                        {i > 0 && (
                                            <svg className="w-3.5 h-3.5 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        )}
                                        <Link
                                            href={crumb.href}
                                            className={`${i === breadcrumbs.length - 1
                                                ? "text-foreground font-semibold"
                                                : "text-muted-foreground hover:text-foreground"
                                                } transition-colors`}
                                        >
                                            {crumb.label}
                                        </Link>
                                    </span>
                                ))}
                            </nav>
                        </div>

                        {/* Right: Theme switcher */}
                        <div className="flex items-center gap-2">
                            <ThemeSwitcher />
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <div className="p-4 sm:p-6 lg:p-8">{children}</div>
            </div>
        </div>
    );
}
