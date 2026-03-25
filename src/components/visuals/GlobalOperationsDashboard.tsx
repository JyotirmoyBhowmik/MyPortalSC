"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamically import the map because it depends on window/document SVG APIs sometimes, 
// and to keep the initial load lighter.
const WorldMap = dynamic(() => import("./WorldMap"), { ssr: false });

type TabId = "map" | "metrics" | "radar";

export default function GlobalOperationsDashboard() {
    const [activeTab, setActiveTab] = useState<TabId>("map");

    return (
        <div className="w-full flex flex-col glass rounded-xl overflow-hidden glow-border relative">
            {/* Tab Navigation */}
            <div className="flex w-full border-b border-border/50 bg-black/40 backdrop-blur-md sticky top-0 z-20">
                <button
                    onClick={() => setActiveTab("map")}
                    className={`flex-1 py-4 text-xs font-semibold uppercase tracking-widest transition-colors relative
                        ${activeTab === "map" ? "text-primary" : "text-muted-foreground hover:text-white"}`}
                >
                    Interactive Map
                    {activeTab === "map" && (
                        <motion.div layoutId="global-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_8px_var(--primary)]" />
                    )}
                </button>
                <div className="w-px bg-border/50" />
                <button
                    onClick={() => setActiveTab("metrics")}
                    className={`flex-1 py-4 text-xs font-semibold uppercase tracking-widest transition-colors relative
                        ${activeTab === "metrics" ? "text-primary" : "text-muted-foreground hover:text-white"}`}
                >
                    Live Metrics
                    {activeTab === "metrics" && (
                        <motion.div layoutId="global-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_8px_var(--primary)]" />
                    )}
                </button>
                <div className="w-px bg-border/50" />
                <button
                    onClick={() => setActiveTab("radar")}
                    className={`flex-1 py-4 text-xs font-semibold uppercase tracking-widest transition-colors relative
                        ${activeTab === "radar" ? "text-primary" : "text-muted-foreground hover:text-white"}`}
                >
                    NOC Radar
                    {activeTab === "radar" && (
                        <motion.div layoutId="global-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_8px_var(--primary)]" />
                    )}
                </button>
            </div>

            {/* Content Area */}
            <div className="relative w-full h-[450px] bg-[#050505] overflow-hidden flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {activeTab === "map" && (
                        <motion.div
                            key="map"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 w-full h-full"
                        >
                            <WorldMap />
                        </motion.div>
                    )}

                    {activeTab === "metrics" && (
                        <motion.div
                            key="metrics"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="w-full h-full p-6 sm:p-10 flex flex-col justify-center"
                        >
                            <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto w-full h-full">
                                <MetricCard title="Countries Deployed" value="15+" subtitle="Across South Asia & Gulf" icon="🌍" delay={0.1} />
                                <MetricCard title="Core Uptime" value="99.99%" subtitle="Five Nines Reliability" icon="⚡" delay={0.2} />
                                <MetricCard title="Datacenter Hubs" value="3" subtitle="Kathmandu, India, Singapore" icon="🏢" delay={0.3} />
                                <MetricCard title="Active Networks" value="Secure" subtitle="Zscaler SASE & IPsec" icon="🔒" delay={0.4} />
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "radar" && (
                        <motion.div
                            key="radar"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 w-full h-full flex items-center justify-center bg-[#020502]"
                        >
                            <NOCRadar />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

// Sub-component for Metrics tab
function MetricCard({ title, value, subtitle, icon, delay }: { title: string; value: string; subtitle: string; icon: string; delay: number }) {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.4 }}
            className="bg-[#0a0f0a] border border-[#00ff41]/20 rounded-xl p-6 flex flex-col justify-center relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 text-8xl opacity-5 group-hover:opacity-10 transition-opacity grayscale">{icon}</div>
            <h4 className="text-[#00ff41]/70 text-xs font-bold uppercase tracking-widest mb-2">{title}</h4>
            <div className="text-4xl sm:text-5xl font-black text-white mb-2 tracking-tight">{value}</div>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
        </motion.div>
    );
}

// Sub-component for NOC Radar tab
function NOCRadar() {
    return (
        <div className="relative w-[400px] h-[400px] rounded-full border border-[#00ff41]/30 shadow-[inset_0_0_50px_rgba(0,255,65,0.1)] flex items-center justify-center">
            {/* Concentric rings */}
            <div className="absolute inset-4 rounded-full border border-[#00ff41]/20" />
            <div className="absolute inset-16 rounded-full border border-[#00ff41]/20" />
            <div className="absolute inset-32 rounded-full border border-[#00ff41]/20" />
            <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                <div className="w-full h-px bg-[#00ff41]/20" />
                <div className="absolute h-full w-px bg-[#00ff41]/20" />
            </div>

            {/* Sweeping radar scanner */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className="absolute inset-0 rounded-full"
                style={{
                    background: "conic-gradient(from 0deg, transparent 70%, rgba(0, 255, 65, 0.4) 100%)",
                }}
            >
                {/* The solid leading edge line */}
                <div className="absolute top-0 left-1/2 w-[2px] h-1/2 bg-[#00ff41] shadow-[0_0_10px_#00ff41] origin-bottom transform -translate-x-1/2" />
            </motion.div>

            {/* Static random "blips" */}
            <div className="absolute w-2 h-2 bg-[#00ff41] rounded-full top-20 left-32 animate-ping" />
            <div className="absolute w-2 h-2 bg-white rounded-full bottom-24 right-20 animate-pulse shadow-[0_0_8px_white]" />
            <div className="absolute w-1.5 h-1.5 bg-[#00ff41] rounded-full top-1/2 right-1/4 animate-pulse" />
            
            <div className="absolute bottom-4 z-10 text-[10px] text-[#00ff41] tracking-widest uppercase font-mono bg-black/50 px-2 py-1 rounded">
                Monitoring Sector 7G
            </div>
        </div>
    );
}
