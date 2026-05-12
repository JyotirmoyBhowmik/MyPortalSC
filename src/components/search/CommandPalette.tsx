"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

interface SearchItem {
    title: string;
    href: string;
    category: string;
    icon: string;
    meta?: string;
}

interface Props {
    items: SearchItem[];
}

export default function CommandPalette({ items }: Props) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [selectedIdx, setSelectedIdx] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const filtered = query.length > 0
        ? items.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase()) ||
            (item.meta || "").toLowerCase().includes(query.toLowerCase())
        ).slice(0, 12)
        : items.slice(0, 8);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setOpen(prev => !prev);
            }
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (open) {
            setQuery("");
            setSelectedIdx(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [open]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIdx(prev => Math.min(prev + 1, filtered.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIdx(prev => Math.max(prev - 1, 0));
        } else if (e.key === "Enter" && filtered[selectedIdx]) {
            setOpen(false);
            router.push(filtered[selectedIdx].href);
        }
    }, [filtered, selectedIdx, router]);

    // Group by category
    const grouped: Record<string, SearchItem[]> = {};
    filtered.forEach(item => {
        if (!grouped[item.category]) grouped[item.category] = [];
        grouped[item.category].push(item);
    });

    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-xl glass border border-border shadow-lg flex items-center justify-center hover:bg-surface-hover transition-all group"
                title="Search (⌘K)"
            >
                <svg className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-[100]" onClick={() => setOpen(false)}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Dialog */}
            <div className="relative max-w-xl mx-auto mt-[15vh]" onClick={e => e.stopPropagation()}>
                <div className="glass rounded-2xl overflow-hidden shadow-2xl border border-border/50">
                    {/* Search input */}
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-border/50">
                        <svg className="w-5 h-5 text-muted-foreground shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search initiatives, projects, budgets, pages…"
                            value={query}
                            onChange={e => { setQuery(e.target.value); setSelectedIdx(0); }}
                            onKeyDown={handleKeyDown}
                            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/50 text-sm outline-none"
                        />
                        <kbd className="text-[10px] border border-border px-1.5 py-0.5 rounded text-muted-foreground font-mono">ESC</kbd>
                    </div>

                    {/* Results */}
                    <div className="max-h-[50vh] overflow-y-auto py-2">
                        {Object.entries(grouped).map(([cat, catItems]) => (
                            <div key={cat}>
                                <div className="px-5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                                    {cat}
                                </div>
                                {catItems.map((item) => {
                                    const globalIdx = filtered.indexOf(item);
                                    return (
                                        <button
                                            key={item.href + item.title}
                                            onClick={() => { setOpen(false); router.push(item.href); }}
                                            onMouseEnter={() => setSelectedIdx(globalIdx)}
                                            className={`w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors ${globalIdx === selectedIdx
                                                    ? "bg-primary/10 text-primary"
                                                    : "text-foreground hover:bg-surface-hover"
                                                }`}
                                        >
                                            <span className="text-base w-6 flex items-center justify-center shrink-0">{item.icon}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium truncate">{item.title}</div>
                                                {item.meta && <div className="text-[10px] text-muted-foreground truncate">{item.meta}</div>}
                                            </div>
                                            <svg className="w-3.5 h-3.5 text-muted-foreground/30 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    );
                                })}
                            </div>
                        ))}

                        {filtered.length === 0 && (
                            <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                                No results for &quot;{query}&quot;
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center gap-4 px-5 py-2.5 border-t border-border/30 text-[10px] text-muted-foreground/60">
                        <span className="flex items-center gap-1"><kbd className="border border-border px-1 rounded font-mono">↑↓</kbd> Navigate</span>
                        <span className="flex items-center gap-1"><kbd className="border border-border px-1 rounded font-mono">↵</kbd> Open</span>
                        <span className="flex items-center gap-1"><kbd className="border border-border px-1 rounded font-mono">⌘K</kbd> Toggle</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
