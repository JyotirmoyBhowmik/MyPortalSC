"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import RealtimeNotifications from "./RealtimeNotifications";

/* ─── Sidebar link definitions ─── */
const sidebarSections = [
    {
        title: "Content & Core",
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
                href: "/admin/pages",
                label: "Pages",
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
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
            {
                href: "/admin/timeline",
                label: "Timeline",
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
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
        title: "Engagement & CRM",
        links: [
            {
                href: "/admin/contacts",
                label: "Contacts CRM",
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                ),
            },
            {
                href: "/admin/downloads",
                label: "Downloads",
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                ),
            },
        ],
    },
    {
        title: "System & Config",
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
            {
                href: "/admin/media",
                label: "Media Library",
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                ),
            },
            {
                href: "/admin/audit",
                label: "Audit Log",
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                ),
            },
            {
                href: "/admin/security",
                label: "Security",
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                ),
            },
            {
                href: "/admin/users",
                label: "Users & Roles",
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                ),
            },
            {
                href: "/admin/appearance",
                label: "Appearance",
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                ),
            },
            {
                href: "/admin/settings",
                label: "Settings & Feature Toggles",
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                ),
            },
        ],
    },
    {
        title: "Under Development",
        links: [
            {
                href: "/admin/blog",
                label: "Blog",
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                ),
                badge: "WIP",
            },
            {
                href: "/admin/case-studies",
                label: "Case Studies",
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                ),
                badge: "WIP",
            },
            {
                href: "/admin/testimonials",
                label: "Testimonials",
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                ),
                badge: "WIP",
            },
            {
                href: "/admin/speaking",
                label: "Speaking",
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                ),
                badge: "WIP",
            },
            {
                href: "/admin/publications",
                label: "Publications",
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                ),
                badge: "WIP",
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
    allowAdminSearch = false,
    enableRbac = false,
}: {
    children: React.ReactNode;
    allowAdminSearch?: boolean;
    enableRbac?: boolean;
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
                    {sidebarSections.map((section) => {
                        /* When RBAC is enabled, hide admin-only configuration links
                           (Users & Roles, Settings) from the sidebar. In the future
                           this would check the user's actual role from the DB. */
                        const rbacRestrictedPaths = ["/admin/users", "/admin/settings"];
                        const visibleLinks = enableRbac
                            ? section.links.filter((l) => !rbacRestrictedPaths.includes(l.href))
                            : section.links;
                        if (visibleLinks.length === 0) return null;
                        return (
                            <div key={section.title}>
                                {!sidebarCollapsed && (
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 px-3">
                                        {section.title}
                                    </p>
                                )}
                                <div className="space-y-0.5">
                                    {visibleLinks.map((link) => {
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
                                                        {"badge" in link && (link as any).badge && (
                                                            <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary font-bold">
                                                                {(link as any).badge}
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
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
                            {allowAdminSearch && (
                                <div className="relative hidden sm:block mr-2">
                                    <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input type="text" placeholder="Search admin..." className="w-64 pl-9 pr-4 py-1.5 bg-surface border border-border rounded-lg text-sm transition-shadow text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder-muted-foreground" />
                                </div>
                            )}
                            <ThemeSwitcher />
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <div className="p-4 sm:p-6 lg:p-8">{children}</div>
            </div>

            <RealtimeNotifications />
        </div >
    );
}
