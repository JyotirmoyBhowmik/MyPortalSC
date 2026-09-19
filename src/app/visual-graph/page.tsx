"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ArchitectureGraph from "@/components/visual-graph/ArchitectureGraph";
import RepoMapViewer from "@/components/visual-graph/RepoMapViewer";

export default function VisualGraphPage() {
    const [activeTab, setActiveTab] = useState<"graph" | "repomap">("graph");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get("tab");
        if (tab === "repomap" || tab === "graph") {
            setActiveTab(tab);
        }
    }, []);

    return (
        <div className="min-h-screen pt-20 md:pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/60 pb-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link
                            href="/site-map"
                            className="text-xs text-muted-foreground hover:text-primary transition flex items-center gap-1 font-mono"
                        >
                            ← Back to Site Map
                        </Link>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
                        Visual <span className="gradient-text">Graph</span>
                    </h1>
                    <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl">
                        Interactive module architecture graph and token-optimized Aider-style repository map. 
                        Generated locally with Tree-Sitter static analysis at zero LLM cost.
                    </p>
                </div>

                {/* View Switcher */}
                <div className="flex items-center p-1 bg-surface border border-border rounded-xl shrink-0">
                    <button
                        onClick={() => setActiveTab("graph")}
                        className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
                            activeTab === "graph"
                                ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        Architecture Graph
                    </button>
                    <button
                        onClick={() => setActiveTab("repomap")}
                        className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
                            activeTab === "repomap"
                                ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        Repository Map
                    </button>
                </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-surface/50 border border-border/80 rounded-xl p-3 sm:p-4 text-center">
                    <div className="text-xl sm:text-2xl font-bold font-mono text-primary">280+</div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground mt-0.5">Source Files</div>
                </div>
                <div className="bg-surface/50 border border-border/80 rounded-xl p-3 sm:p-4 text-center">
                    <div className="text-xl sm:text-2xl font-bold font-mono text-sky-400">350+</div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground mt-0.5">Architecture Nodes</div>
                </div>
                <div className="bg-surface/50 border border-border/80 rounded-xl p-3 sm:p-4 text-center">
                    <div className="text-xl sm:text-2xl font-bold font-mono text-pink-400">710+</div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground mt-0.5">Dependency Edges</div>
                </div>
                <div className="bg-surface/50 border border-border/80 rounded-xl p-3 sm:p-4 text-center">
                    <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">$0.00</div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground mt-0.5">LLM Token Cost</div>
                </div>
            </div>

            {/* Main Interactive Display */}
            <div>
                {activeTab === "graph" ? (
                    <ArchitectureGraph />
                ) : (
                    <RepoMapViewer />
                )}
            </div>
        </div>
    );
}
