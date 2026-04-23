"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";

export default function NavbarPremium({ flags = {} }: { flags?: Record<string, boolean> }) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const navLinks = [
        { href: "/", label: "Home", visible: true },
        { href: "/executive-summary", label: "Executive Summary", visible: flags["feature_executive_summary"] },
        { href: "/testimonials", label: "Testimonials", visible: flags["feature_testimonials"] },
        { href: "/timeline", label: "Timeline", visible: true },
        { href: "/budget", label: "Budget", visible: true },
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
        <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
            <nav className="w-full max-w-6xl glass rounded-full border border-white/10 shadow-2xl backdrop-blur-xl bg-black/60 px-6 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                            JB
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center justify-center gap-1 flex-1 px-4 overflow-x-auto no-scrollbar">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`
                                        relative px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-full transition-all duration-300
                                        ${isActive ? "text-white bg-white/10" : "text-gray-400 hover:text-white hover:bg-white/5"}
                                    `}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3 shrink-0">
                        {flags["feature_i18n"] !== false && <LanguageSwitcher />}
                        {flags["feature_light_theme"] !== false && <ThemeSwitcher />}
                        {/* Mobile Hamburger */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="lg:hidden p-2 rounded-full hover:bg-white/10 text-gray-300 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="lg:hidden mt-4 pt-4 border-t border-white/10 animate-slide-down">
                        <div className="grid grid-cols-2 gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`
                                        px-4 py-3 text-sm font-medium rounded-xl transition-all text-center
                                        ${pathname === link.href ? "text-white bg-white/10" : "text-gray-400 hover:text-white hover:bg-white/5"}
                                    `}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
