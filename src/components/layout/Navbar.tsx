"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ThemeSwitcher from "@/components/ThemeSwitcher";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/skills", label: "Skills" },
    { href: "/initiatives", label: "Initiatives" },
    { href: "/projects", label: "Projects" },
    { href: "/contact", label: "Contact" },
];

export default function Navbar({ flags = {} }: { flags?: Record<string, boolean> }) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const navLinks = [
        { href: "/", label: "Home", visible: true },
        // Tier 1
        { href: "/executive-summary", label: "Executive Summary", visible: flags["feature_executive_summary"] },
        { href: "/testimonials", label: "Testimonials", visible: flags["feature_testimonials"] },
        { href: "/timeline", label: "Timeline", visible: flags["feature_timeline"] },
        // Standard
        { href: "/about", label: "About", visible: true },
        { href: "/skills", label: "Skills", visible: true },
        { href: "/initiatives", label: "Initiatives", visible: true },
        { href: "/projects", label: "Projects", visible: true },
        // Tier 7
        { href: "/blog", label: "Blog", visible: flags["feature_blog"] },
        { href: "/case-studies", label: "Case Studies", visible: flags["feature_case_studies"] },
        { href: "/speaking", label: "Speaking", visible: flags["feature_speaking"] },
        { href: "/publications", label: "Publications", visible: flags["feature_publications"] },
        { href: "/downloads", label: "Downloads", visible: flags["feature_downloads"] },
        // Contact
        { href: "/contact", label: "Contact", visible: true },
    ].filter(link => link.visible);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 group shrink-0"
                    >
                        <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-white font-bold text-sm">
                            JB
                        </div>
                        <span className="text-lg font-bold text-foreground group-hover:text-primary transition-colors hidden lg:block">
                            Jyotirmoy
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden xl:flex items-center gap-1 overflow-x-auto no-scrollbar">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`
                    relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap
                    ${isActive
                                            ? "text-primary bg-primary/10"
                                            : "text-muted-foreground hover:text-foreground hover:bg-surface"
                                        }
                  `}
                                >
                                    {link.label}
                                    {isActive && (
                                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* CTA + Theme + Mobile Toggle */}
                    <div className="flex items-center gap-2 shrink-0">
                        <ThemeSwitcher />
                        <Link
                            href="/contact"
                            className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover transition-all shadow-lg shadow-primary/20"
                        >
                            Get in touch
                        </Link>

                        {/* Mobile Hamburger */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="xl:hidden p-2 rounded-lg hover:bg-surface transition-colors text-muted-foreground"
                            aria-label="Toggle navigation"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {mobileOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="xl:hidden pb-4 animate-slide-down max-h-[80vh] overflow-y-auto">
                        <div className="flex flex-col gap-1 pt-2 border-t border-border">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={`
                      px-4 py-2.5 text-sm font-medium rounded-lg transition-all
                      ${isActive
                                                ? "text-primary bg-primary/10"
                                                : "text-muted-foreground hover:text-foreground hover:bg-surface"
                                            }
                    `}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </nav>
        </header >
    );
}
