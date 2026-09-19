"use client";

import React, { useState, useEffect, useMemo } from "react";

export default function RepoMapViewer({ initialContent = "" }: { initialContent?: string }) {
    const [content, setContent] = useState<string>(initialContent);
    const [loading, setLoading] = useState(!initialContent);
    const [search, setSearch] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!content) {
            fetch("/REPO_MAP.md")
                .then((res) => {
                    if (!res.ok) throw new Error("Failed to load /REPO_MAP.md");
                    return res.text();
                })
                .then((text) => {
                    setContent(text);
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                });
        }
    }, [content]);

    // Parse sections and files from markdown
    const sections = useMemo(() => {
        if (!content) return [];

        const lines = content.split("\n");
        const parsedSections: Array<{
            name: string;
            files: Array<{
                path: string;
                loc: string;
                lines: string[];
            }>;
        }> = [];

        let currentSection: (typeof parsedSections)[0] | null = null;
        let currentFile: (typeof parsedSections)[0]["files"][0] | null = null;

        for (const line of lines) {
            if (line.startsWith("## ")) {
                currentSection = {
                    name: line.replace("## ", "").trim(),
                    files: [],
                };
                parsedSections.push(currentSection);
                currentFile = null;
            } else if (line.startsWith("### `")) {
                const match = line.match(/### `([^`]+)`\s*\(([^)]+)\)/);
                if (match && currentSection) {
                    currentFile = {
                        path: match[1],
                        loc: match[2],
                        lines: [],
                    };
                    currentSection.files.push(currentFile);
                }
            } else if (currentFile && line.trim()) {
                currentFile.lines.push(line);
            }
        }

        return parsedSections;
    }, [content]);

    // Filter by search term
    const filteredSections = useMemo(() => {
        if (!search.trim()) return sections;
        const q = search.toLowerCase();

        return sections
            .map((sec) => {
                const matchingFiles = sec.files.filter((f) => {
                    if (f.path.toLowerCase().includes(q)) return true;
                    return f.lines.some((l) => l.toLowerCase().includes(q));
                });
                return {
                    ...sec,
                    files: matchingFiles,
                };
            })
            .filter((sec) => sec.files.length > 0);
    }, [sections, search]);

    const handleCopy = () => {
        if (!content) return;
        navigator.clipboard.writeText(content).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    if (loading) {
        return (
            <div className="w-full h-[600px] bg-slate-950/80 border border-border rounded-2xl flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="font-mono text-sm text-muted-foreground">Loading REPO_MAP.md...</span>
            </div>
        );
    }

    return (
        <div className="w-full border border-border rounded-2xl overflow-hidden bg-slate-950 flex flex-col shadow-2xl">
            {/* Header Toolbar */}
            <div className="p-4 border-b border-border/60 bg-slate-900/80 backdrop-blur flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-semibold">
                        Aider-Style Tree Outline
                    </span>
                    <span className="text-xs text-muted-foreground hidden sm:inline font-mono">
                        Bodies elided for AI context efficiency
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Filter files or signatures..."
                        className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary font-mono w-52 sm:w-64"
                    />

                    <button
                        onClick={handleCopy}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 transition font-mono"
                    >
                        {copied ? "✓ Copied!" : "Copy Map"}
                    </button>

                    <a
                        href="/REPO_MAP.md"
                        download="REPO_MAP.md"
                        className="px-3 py-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 border border-primary/40 text-xs text-primary font-semibold transition font-mono"
                    >
                        Download .md
                    </a>
                </div>
            </div>

            {/* Content List */}
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[720px] font-mono text-xs space-y-6 select-text">
                {filteredSections.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 italic">No files matching &quot;{search}&quot;</div>
                ) : (
                    filteredSections.map((sec, sIdx) => (
                        <div key={sIdx} className="space-y-3">
                            <div className="text-sm font-bold text-primary border-b border-border/50 pb-1 flex items-center justify-between">
                                <span>{sec.name}</span>
                                <span className="text-xs text-slate-500 font-normal">{sec.files.length} files</span>
                            </div>

                            <div className="grid grid-cols-1 gap-2 pl-2">
                                {sec.files.map((file, fIdx) => (
                                    <div
                                        key={fIdx}
                                        className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-3 hover:border-slate-700 transition"
                                    >
                                        <div className="flex items-baseline justify-between mb-1.5">
                                            <span className="font-semibold text-slate-200 text-xs">{file.path}</span>
                                            <span className="text-[10px] text-slate-500">{file.loc}</span>
                                        </div>

                                        <div className="space-y-0.5 text-slate-400">
                                            {file.lines.map((l, lIdx) => {
                                                const isClass = l.includes("class ");
                                                const isSig = /^\s*│\s*\d+:/.test(l);
                                                return (
                                                    <div
                                                        key={lIdx}
                                                        className={`whitespace-pre overflow-x-auto ${
                                                            isClass
                                                                ? "text-purple-300 font-bold"
                                                                : isSig
                                                                ? "text-slate-300"
                                                                : "text-slate-500 italic"
                                                        }`}
                                                    >
                                                        {l}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
