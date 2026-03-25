"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ServerStatusWidget() {
    const [cpuLoad, setCpuLoad] = useState(12);
    const [ramUsage, setRamUsage] = useState(48);
    const [networkTx, setNetworkTx] = useState(1.2);

    // Simulate live telemetry
    useEffect(() => {
        const interval = setInterval(() => {
            setCpuLoad((prev) => Math.max(5, Math.min(95, prev + (Math.random() * 10 - 5))));
            setRamUsage((prev) => Math.max(30, Math.min(85, prev + (Math.random() * 4 - 2))));
            setNetworkTx((prev) => Math.max(0.1, Math.min(5.0, prev + (Math.random() * 0.8 - 0.4))));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="glass rounded-xl p-6 glow-border h-full flex flex-col relative overflow-hidden group">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                Infrastructure Telemetry
            </h3>

            <div className="space-y-4 flex-1 flex flex-col justify-center">
                {/* CPU Load */}
                <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>CPU Load (Cluster)</span>
                        <span className="font-mono text-foreground">{cpuLoad.toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-primary"
                            animate={{ width: `${cpuLoad}%` }}
                            transition={{ ease: "linear", duration: 2 }}
                        />
                    </div>
                </div>

                {/* RAM Usage */}
                <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Memory Utilization</span>
                        <span className="font-mono text-foreground">{ramUsage.toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-accent"
                            animate={{ width: `${ramUsage}%` }}
                            transition={{ ease: "linear", duration: 2 }}
                        />
                    </div>
                </div>

                {/* Status Items */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-border/50">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground uppercase">Nodes Active</span>
                        <span className="font-mono font-medium text-sm">12/12</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground uppercase">Net TX/RX</span>
                        <span className="font-mono font-medium text-sm">{networkTx.toFixed(2)} MB/s</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground uppercase">Security</span>
                        <span className="font-mono font-medium text-sm text-success flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            AES-256
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground uppercase">Uptime</span>
                        <span className="font-mono font-medium text-sm">99.99%</span>
                    </div>
                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity duration-700 w-32 h-32 transform translate-x-8 translate-y-8">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5 3v18H3V3h2zm14 0v18h-2V3h2zm-7 0v18H9V3h3zm-3 4v10H6V7h3zm7 0v10h-3V7h3z" />
                </svg>
            </div>
        </div>
    );
}
