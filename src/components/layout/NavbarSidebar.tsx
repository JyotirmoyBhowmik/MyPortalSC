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
    "/contact": "✉️",
};

export default function NavbarSidebar({ flags = {} }: { flags?: Record<string, boolean> }) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Skip rendering on admin pages
    if (pathname.startsWith("/admin")) return null;

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    // Close sidebar on route change (mobile)
    useEffect(() => {
        if (isMobile) setIsOpen(false);
    }, [pathname, isMobile]);

    const navLinks = [
        { href: "/", label: "Home", visible: true },
        { href: "/executive-summary", label: "Executive Summary", visible: flags["feature_executive_summary"] },
        { href: "/testimonials", label: "Testimonials", visible: flags["feature_testimonials"] },
        { href: "/timeline", label: "Timeline", visible: flags["feature_timeline"] },
        { href: "/about", label: "About", visible: true },
        { href: "/skills", label: "Skills", visible: true },
        { href: "/initiatives", label: "Initiatives", visible: true },
        { href: "/projects", label: "Projects", visible: true },
        { href: "/blog", label: "Blog", visible: flags["feature_blog"] },
        { href: "/case-studies", label: "Case Studies", visible: flags["feature_case_studies"] },
        { href: "/speaking", label: "Speaking", visible: flags["feature_speaking"] },
        { href: "/publications", label: "Publications", visible: flags["feature_publications"] },
        { href: "/downloads", label: "Downloads", visible: flags["feature_downloads"] },
        { href: "/contact", label: "Contact", visible: true },
    ].filter(link => link.visible);

    return (
        <>
            {/* Toggle Button — always visible */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-[60] w-10 h-10 rounded-xl glass border border-border flex items-center justify-center hover:bg-surface-hover transition-all group"
                aria-label="Toggle navigation"
            >
                <div className="flex flex-col gap-1 items-center justify-center w-5">
                    <span className={`block h-0.5 w-full bg-foreground rounded transition-all duration-300 ${isOpen ? "rotate-45 translate-y-[3px]" : ""}`} />
                    <span className={`block h-0.5 w-full bg-foreground rounded transition-all duration-300 ${isOpen ? "opacity-0" : ""}`} />
                    <span className={`block h-0.5 w-full bg-foreground rounded transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-[3px]" : ""}`} />
                </div>
            </button>

            {/* Backdrop (mobile) */}
            {isOpen && isMobile && (
                <div
                    className="fixed inset-0 z-[49] bg-black/50 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-[55] h-full flex flex-col transition-all duration-300 ease-in-out glass border-r border-border ${isOpen ? "w-64" : isMobile ? "w-0 -translate-x-full" : "w-16"
                    }`}
                style={{ overflowX: "hidden" }}
            >
                {/* Logo area */}
                <div className="flex items-center px-4 h-16 shrink-0 border-b border-border/50">
                    <Link href="/" className="flex items-center gap-3 group" onClick={() => isMobile && setIsOpen(false)}>
                        <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-white font-bold text-sm shrink-0">
                            JB
                        </div>
                        <span className={`text-lg font-bold text-foreground group-hover:text-primary transition-opacity duration-300 whitespace-nowrap ${isOpen ? "opacity-100" : "opacity-0 invisible w-0"}`}>
                            Jyotirmoy
                        </span>
                    </Link>
                </div>

                {/* Nav links */}
                <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                        const icon = navIcons[link.href] || "📄";
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => isMobile && setIsOpen(false)}
                                title={!isOpen ? link.label : undefined}
                                className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative overflow-hidden ${isActive
                                        ? "bg-primary/15 text-primary border border-primary/20"
                                        : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
                                    }`}
                            >
                                <span className={`text-base shrink-0 flex items-center justify-center transition-all ${!isOpen ? "w-full" : "mr-3"}`}>
                                    {icon}
                                </span>
                                <span className={`whitespace-nowrap transition-all duration-300 ${isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 absolute"
                                    }`}>
                                    {link.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom controls */}
                <div className="shrink-0 px-2 py-4 border-t border-border/50 space-y-3 flex flex-col items-center">
                    <div className={`flex items-center gap-2 transition-opacity ${isOpen ? "opacity-100" : "opacity-0 h-0 overflow-hidden"}`}>
                        <LanguageSwitcher />
                        <ThemeSwitcher />
                    </div>
                    {isOpen ? (
                        <Link
                            href="/contact"
                            onClick={() => isMobile && setIsOpen(false)}
                            className="flex items-center justify-center w-full px-4 py-2.5 rounded-xl gradient-bg text-white text-sm font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all whitespace-nowrap"
                        >
                            Get in touch
                        </Link>
                    ) : (
                        <Link
                            href="/contact"
                            title="Get in touch"
                            className="flex items-center justify-center w-10 h-10 rounded-xl gradient-bg text-white text-lg hover:shadow-lg shadow-primary/30 transition-all shrink-0"
                        >
                            ✉️
                        </Link>
                    )}
                </div>
            </aside>
        </>
    );
}
