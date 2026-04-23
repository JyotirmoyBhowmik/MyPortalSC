"use client";

import React from 'react';
import MermaidDiagram from '@/components/admin/MermaidDiagram';
import AnimatedSection from '@/components/animations/AnimatedSection';
import { chartData } from '@/lib/data/architecture';

const ghostFiles = [
  "app/api/assets/route.ts",
  "app/api/audio/route.ts",
  "app/api/chat/route.ts",
  "app/api/ephemeral-token/route.ts",
  "app/api/gemini-token/route.ts",
  "app/api/health/route.ts",
  "app/api/og/route.tsx",
  "app/api/security-check/route.ts",
  "app/api/send-email/route.ts",
  "app/budget/loading.tsx",
  "app/icon.tsx",
  "app/initiatives/loading.tsx",
  "app/loading.tsx",
  "app/manifest.ts",
  "app/not-found.tsx",
  "app/robots.ts",
  "components/admin/AnalyticsDashboard.tsx",
  "components/animations/CountUp.tsx",
  "components/animations/ParticleBackground.tsx",
  "components/animations/TypewriterText.tsx",
  "components/chat/VoiceWidget copy.tsx",
  "components/layout/LanguageProvider.tsx",
  "components/pdf/DownloadPdfButton.tsx",
  "components/visuals/CostComparison.tsx",
  "components/visuals/DeliveryGlobe.tsx",
  "components/visuals/GlobalOperationsDashboard.tsx",
  "components/visuals/NetworkTopology.tsx",
  "components/visuals/PingDashboard.tsx",
  "components/visuals/SecurityScorecard.tsx",
  "components/visuals/ServerStatusWidget.tsx",
  "components/visuals/WorldMap.tsx"
];

const hotspots = [
    { name: "lib/supabase/server.ts", incoming: 58 },
    { name: "lib/data/settings.ts", incoming: 31 },
    { name: "lib/database.types.ts", incoming: 21 },
    { name: "components/ui/ToastProvider.tsx", incoming: 18 },
    { name: "components/ui/ConfirmDialog.tsx", incoming: 16 },
    { name: "lib/data/finances.ts", incoming: 14 },
    { name: "components/ui/Button.tsx", incoming: 11 },
];

export default function SiteMapPage() {
    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
            <AnimatedSection>
                <div className="mb-8">
                    <h1 className="text-3xl font-black mb-2">Architecture & Site Map</h1>
                    <p className="text-muted-foreground">
                        A real-time structural scan of the codebase modules, dependencies, and hotspots.
                    </p>
                </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <h2 className="text-xl font-bold">Module Dependency Graph</h2>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary uppercase tracking-widest">Interactive</span>
                    </div>
                    <div className="bg-surface/30 p-2 rounded-2xl border border-border shadow-xl">
                        <MermaidDiagram chart={chartData} id="architecture-map" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-3 italic text-center">
                        * Nodes highlighted in purple indicate system hotspots (high incoming dependencies). Dashed lines indicate implicit connections.
                    </p>
                </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <AnimatedSection delay={0.2}>
                    <div className="h-full bg-surface border border-border rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                            <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <div>
                                <h3 className="font-bold">System Hotspots</h3>
                                <p className="text-xs text-muted-foreground">Files with the highest number of imports/prop-drilling.</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {hotspots.map((h, i) => (
                                <div key={i} className="flex justify-between items-center bg-background/50 p-3 rounded-lg border border-border/50">
                                    <span className="font-mono text-xs text-primary">{h.name}</span>
                                    <span className="px-2 py-1 bg-surface border border-border rounded text-[10px] font-bold text-muted-foreground">
                                        {h.incoming} links
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </AnimatedSection>

                <AnimatedSection delay={0.3}>
                    <div className="h-full bg-surface border border-border rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                            <div className="p-2 bg-slate-500/10 rounded-lg text-slate-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" /></svg>
                            </div>
                            <div>
                                <h3 className="font-bold">Ghost Files (0 Connections)</h3>
                                <p className="text-xs text-muted-foreground">Files with no internal imports (APIs, Next config, dead code).</p>
                            </div>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
                            {ghostFiles.map((gf, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs py-1.5 border-b border-border/30 last:border-0">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500/50"></span>
                                    <span className="font-mono text-muted-foreground truncate">{gf}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </AnimatedSection>
            </div>
        </div>
    );
}
