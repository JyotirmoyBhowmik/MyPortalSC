"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface SecurityCheck {
    name: string;
    key: string;
    present: boolean;
    value: string | null;
    severity: string;
    description: string;
}

interface SecurityData {
    score: number;
    passed: number;
    total: number;
    checks: SecurityCheck[];
    scannedAt: string;
    targetUrl: string;
}

const severityColors: Record<string, string> = {
    critical: "text-red-400",
    high: "text-amber-400",
    medium: "text-blue-400",
    low: "text-slate-400",
};

export default function SecurityScorecard() {
    const [data, setData] = useState<SecurityData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/security-check")
            .then((r) => r.json())
            .then((d) => { setData(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-20 text-muted-foreground">
                Unable to perform security scan.
            </div>
        );
    }

    const scoreColor = data.score >= 90 ? "text-green-400" : data.score >= 70 ? "text-amber-400" : "text-red-400";
    const scoreRingColor = data.score >= 90 ? "#4ade80" : data.score >= 70 ? "#fbbf24" : "#ef4444";
    const circumference = 2 * Math.PI * 60;
    const dashOffset = circumference - (data.score / 100) * circumference;

    return (
        <div className="space-y-8">
            {/* Score Ring + Summary */}
            <div className="flex flex-col md:flex-row items-center gap-8 glass rounded-2xl p-8 sm:p-10">
                {/* Animated Ring */}
                <div className="relative w-40 h-40 flex-shrink-0">
                    <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
                        <circle cx="70" cy="70" r="60" fill="none" stroke="currentColor" strokeWidth="8" className="text-surface" />
                        <motion.circle
                            cx="70" cy="70" r="60" fill="none"
                            stroke={scoreRingColor}
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: dashOffset }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-4xl font-black ${scoreColor}`}>{data.score}</span>
                        <span className="text-xs text-muted-foreground">/ 100</span>
                    </div>
                </div>

                {/* Summary text */}
                <div className="text-center md:text-left flex-1">
                    <h2 className="text-2xl font-bold mb-2">
                        Security Rating: <span className={scoreColor}>
                            {data.score >= 90 ? "Excellent" : data.score >= 70 ? "Good" : "Needs Work"}
                        </span>
                    </h2>
                    <p className="text-muted-foreground mb-4">
                        {data.passed} of {data.total} security headers are correctly configured.
                        This site implements enterprise-grade HTTP security hardening.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        Last scanned: {new Date(data.scannedAt).toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Check Items */}
            <div className="space-y-3">
                {data.checks.map((check, i) => (
                    <motion.div
                        key={check.key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`glass rounded-xl p-5 border ${
                            check.present ? "border-green-500/20" : "border-red-500/20"
                        }`}
                    >
                        <div className="flex items-start gap-4">
                            {/* Status icon */}
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg flex-shrink-0 ${
                                check.present ? "bg-green-500/10" : "bg-red-500/10"
                            }`}>
                                {check.present ? "✅" : "❌"}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-foreground text-sm">{check.name}</h3>
                                    <span className={`text-[10px] font-bold uppercase ${severityColors[check.severity]}`}>
                                        {check.severity}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground mb-2">{check.description}</p>
                                {check.value && (
                                    <div className="font-mono text-[11px] text-muted-foreground bg-background/50 rounded px-3 py-2 overflow-x-auto break-all border border-border/30">
                                        {check.value}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
