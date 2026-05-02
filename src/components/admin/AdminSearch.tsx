"use client";

/**
 * AdminSearch — Functional command-palette style search for the admin shell.
 * Filters all sidebar links by label and navigates on click or Enter.
 */
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface SidebarLink {
    href: string;
    label: string;
    icon?: React.ReactNode;
    badge?: string;
}

interface SidebarSection {
    title: string;
    links: SidebarLink[];
}

interface AdminSearchProps {
    sections: SidebarSection[];
}

export default function AdminSearch({ sections }: AdminSearchProps) {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const allLinks = sections.flatMap((s) =>
        s.links.map((l) => ({ ...l, section: s.title }))
    );

    const results = query.trim()
        ? allLinks.filter((l) =>
            l.label.toLowerCase().includes(query.toLowerCase()) ||
            l.href.toLowerCase().includes(query.toLowerCase())
        )
        : [];

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
                setQuery("");
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Escape") {
            setOpen(false);
            setQuery("");
        }
        if (e.key === "Enter" && results.length > 0) {
            window.location.href = results[0].href;
        }
    }

    return (
        <div ref={containerRef} className="relative hidden sm:block mr-2">
            <div className="relative">
                <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
                    onFocus={() => setOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search admin..."
                    className="w-52 pl-9 pr-4 py-1.5 bg-surface border border-border rounded-lg text-sm transition-all text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder-muted-foreground focus:w-64"
                />
            </div>

            {open && results.length > 0 && (
                <div className="absolute top-full mt-2 right-0 w-72 bg-surface border border-border rounded-xl shadow-2xl overflow-hidden z-50">
                    <div className="p-2 space-y-0.5 max-h-72 overflow-y-auto">
                        {results.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => { setOpen(false); setQuery(""); }}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-all group"
                            >
                                {link.icon && (
                                    <span className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0">
                                        {link.icon}
                                    </span>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{link.label}</p>
                                    <p className="text-xs text-muted-foreground font-mono">{link.href}</p>
                                </div>
                                {link.badge && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary font-bold">
                                        {link.badge}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {open && query.trim() && results.length === 0 && (
                <div className="absolute top-full mt-2 right-0 w-64 bg-surface border border-border rounded-xl shadow-2xl overflow-hidden z-50 p-4 text-center">
                    <p className="text-sm text-muted-foreground">No results for &ldquo;{query}&rdquo;</p>
                </div>
            )}
        </div>
    );
}
