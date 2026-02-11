"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/skills", label: "Skills" },
    { href: "/initiatives", label: "Initiatives" },
    { href: "/projects", label: "Projects" },
    { href: "/contact", label: "Contact" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
            <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 group"
                    >
                        <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-white font-bold text-sm">
                            JB
                        </div>
                        <span className="text-lg font-bold text-foreground group-hover:text-primary transition-colors hidden sm:block">
                            Jyotirmoy
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`
                    relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
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

                    {/* CTA + Mobile Toggle */}
                    <div className="flex items-center gap-3">
                        <Link
                            href="/contact"
                            className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover transition-all shadow-lg shadow-primary/20"
                        >
                            Get in touch
                        </Link>

                        {/* Mobile Hamburger */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-surface transition-colors text-muted-foreground"
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
                    <div className="md:hidden pb-4 animate-slide-down">
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
        </header>
    );
}
