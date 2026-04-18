"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";

const navIcons: Record<string, string> = {
    "/": "🏠",
    "/executive-summary": "📊",
    "/testimonials": "💬",
    "/timeline": "📅",
    "/about": "👤",
    "/skills": "⚡",
    "/initiatives": "🚀",
    "/projects": "📁",
    "/blog": "📝",
    "/case-studies": "📋",
    "/speaking": "🎤",
    "/publications": "📰",
    "/downloads": "📥",
    "/budget": "💰",
    "/contact": "✉️",
};

interface NavLink {
    href: string;
    label: string;
    visible: boolean;
}

interface NavGroup {
    title: string;
    links: NavLink[];
}

type ScreenSize = "mobile" | "tablet" | "desktop";

export default function NavbarSidebar({ flags = {} }: { flags?: Record<string, boolean> }) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [screenSize, setScreenSize] = useState<ScreenSize>("desktop");
    const [hovered, setHovered] = useState(false);
    const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

    // Skip rendering on admin pages
    if (pathname.startsWith("/admin")) return null;

    useEffect(() => {
        const check = () => {
            const w = window.innerWidth;
            if (w < 768) setScreenSize("mobile");
            else if (w < 1024) setScreenSize("tablet");
            else setScreenSize("desktop");
        };
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    useEffect(() => {
        if (screenSize === "mobile") setMobileOpen(false);
    }, [pathname, screenSize]);

    const isExpanded =
        screenSize === "desktop" ? true :
        screenSize === "tablet" ? hovered :
        mobileOpen;

    const toggleGroup = (title: string) => {
        setCollapsedGroups(prev => ({ ...prev, [title]: !prev[title] }));
    };

    const navGroups: NavGroup[] = [
        {
            title: "",
            links: [
                { href: "/", label: "Home", visible: true },
            ]
        },
        {
            title: "Portfolio",
            links: [
                { href: "/about", label: "About", visible: true },
                { href: "/skills", label: "Skills", visible: true },
                { href: "/initiatives", label: "Initiatives", visible: true },
                { href: "/projects", label: "Projects", visible: true },
                { href: "/timeline", label: "Timeline", visible: !!flags["feature_timeline"] },
                { href: "/testimonials", label: "Testimonials", visible: !!flags["feature_testimonials"] },
            ]
        },
        {
            title: "Knowledge",
            links: [
                { href: "/blog", label: "Blog", visible: !!flags["feature_blog"] },
                { href: "/case-studies", label: "Case Studies", visible: !!flags["feature_case_studies"] },
                { href: "/speaking", label: "Speaking", visible: !!flags["feature_speaking"] },
                { href: "/publications", label: "Publications", visible: !!flags["feature_publications"] },
            ]
        },
        {
            title: "Finance",
            links: [
                { href: "/budget", label: "IT Budgets", visible: true },
                { href: "/executive-summary", label: "Executive Summary", visible: !!flags["feature_executive_summary"] },
            ]
        },
        {
            title: "Connect",
            links: [
                { href: "/downloads", label: "Downloads", visible: !!flags["feature_downloads"] },
                { href: "/contact", label: "Contact", visible: true },
            ]
        },
    ];

    // Filter out groups with no visible links
    const visibleGroups = navGroups
        .map(g => ({ ...g, links: g.links.filter(l => l.visible) }))
        .filter(g => g.links.length > 0);

    return (
        <>
            {/* Mobile hamburger */}
            {screenSize === "mobile" && (
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="fixed top-4 left-4 z-[60] w-10 h-10 rounded-xl glass border border-border flex items-center justify-center hover:bg-surface-hover transition-all"
                    aria-label="Toggle navigation"
                >
                    <div className="flex flex-col gap-1 items-center justify-center w-5">
                        <span className={`block h-0.5 w-full bg-foreground rounded transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-[3px]" : ""}`} />
                        <span className={`block h-0.5 w-full bg-foreground rounded transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
                        <span className={`block h-0.5 w-full bg-foreground rounded transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-[3px]" : ""}`} />
                    </div>
                </button>
            )}

            {/* Mobile backdrop */}
            {mobileOpen && screenSize === "mobile" && (
                <div
                    className="fixed inset-0 z-[49] bg-black/50 backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                onMouseEnter={() => screenSize === "tablet" && setHovered(true)}
                onMouseLeave={() => screenSize === "tablet" && setHovered(false)}
                className={`fixed top-0 left-0 z-[55] h-full flex flex-col transition-all duration-300 ease-in-out glass border-r border-border
                    ${screenSize === "desktop"
                        ? "w-56"
                        : screenSize === "tablet"
                            ? (hovered ? "w-56 shadow-2xl shadow-black/20" : "w-14")
                            : (mobileOpen ? "w-64" : "w-0 -translate-x-full")
                    }`}
                style={{ overflowX: "hidden" }}
            >
                {/* Logo */}
                <div className="flex items-center px-3 h-14 shrink-0 border-b border-border/50">
                    <Link href="/" className="flex items-center gap-2.5 group" onClick={() => screenSize === "mobile" && setMobileOpen(false)}>
                        <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-white font-bold text-sm shrink-0">
                            JB
                        </div>
                        <span className={`text-base font-bold text-foreground group-hover:text-primary whitespace-nowrap transition-all duration-300 ${isExpanded ? "opacity-100" : "opacity-0 invisible w-0"}`}>
                            Jyotirmoy
                        </span>
                    </Link>
                </div>

                {/* Nav links with groups */}
                <nav className="flex-1 overflow-y-auto py-2 px-1.5">
                    {visibleGroups.map((group, gIdx) => {
                        const isCollapsed = collapsedGroups[group.title];
                        const hasActiveChild = group.links.some(l =>
                            pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href))
                        );

                        return (
                            <div key={group.title || "root"} className={gIdx > 0 ? "mt-1" : ""}>
                                {/* Group header */}
                                {group.title && isExpanded && (
                                    <button
                                        onClick={() => toggleGroup(group.title)}
                                        className="w-full flex items-center justify-between px-2.5 py-1.5 mb-0.5 rounded-md text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/60 hover:text-muted-foreground hover:bg-surface-hover/50 transition-all"
                                    >
                                        <span>{group.title}</span>
                                        <svg
                                            className={`w-3 h-3 transition-transform duration-200 ${isCollapsed ? "-rotate-90" : ""}`}
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                )}
                                {/* Collapsed separator for icon-only mode */}
                                {group.title && !isExpanded && gIdx > 0 && (
                                    <div className="mx-2 my-1.5 border-t border-border/30" />
                                )}
                                {/* Links */}
                                {(!isCollapsed || !isExpanded) && (
                                    <div className="space-y-0.5">
                                        {group.links.map((link) => {
                                            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                                            const icon = navIcons[link.href] || "📄";
                                            return (
                                                <Link
                                                    key={link.href}
                                                    href={link.href}
                                                    onClick={() => screenSize === "mobile" && setMobileOpen(false)}
                                                    title={!isExpanded ? link.label : undefined}
                                                    className={`flex items-center px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all group relative overflow-hidden ${isActive
                                                            ? "bg-primary/15 text-primary border border-primary/20"
                                                            : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
                                                        }`}
                                                >
                                                    <span className={`text-sm shrink-0 flex items-center justify-center transition-all ${!isExpanded ? "w-full" : "mr-2.5 w-5"}`}>
                                                        {icon}
                                                    </span>
                                                    <span className={`whitespace-nowrap transition-all duration-300 ${isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 absolute"}`}>
                                                        {link.label}
                                                    </span>
                                                    {isActive && isExpanded && (
                                                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shrink-0 animate-pulse" />
                                                    )}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* Bottom controls */}
                <div className="shrink-0 px-2 py-3 border-t border-border/50 space-y-2 flex flex-col items-center">
                    <div className={`flex items-center gap-2 transition-all duration-300 ${isExpanded ? "opacity-100" : "opacity-0 h-0 overflow-hidden"}`}>
                        <LanguageSwitcher />
                        <ThemeSwitcher />
                    </div>
                    {isExpanded ? (
                        <Link
                            href="/contact"
                            onClick={() => screenSize === "mobile" && setMobileOpen(false)}
                            className="flex items-center justify-center w-full px-4 py-2 rounded-xl gradient-bg text-white text-sm font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all whitespace-nowrap"
                        >
                            Get in touch
                        </Link>
                    ) : (
                        <Link
                            href="/contact"
                            title="Get in touch"
                            className="flex items-center justify-center w-9 h-9 rounded-xl gradient-bg text-white text-lg hover:shadow-lg shadow-primary/30 transition-all shrink-0"
                        >
                            ✉️
                        </Link>
                    )}
                </div>
            </aside>
        </>
    );
}
