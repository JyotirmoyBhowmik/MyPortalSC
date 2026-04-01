"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface PingResult {
    latency: number;
    status: "ok" | "error";
    timestamp: number;
}

const MAX_HISTORY = 30;

export default function PingDashboard() {
    const [history, setHistory] = useState<PingResult[]>([]);
    const [isRunning, setIsRunning] = useState(true);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const ping = useCallback(async () => {
        const start = performance.now();
        try {
            const res = await fetch("/api/health", { cache: "no-store" });
            const latency = Math.round(performance.now() - start);
            if (res.ok) {
                setHistory((prev) => [
                    ...prev.slice(-(MAX_HISTORY - 1)),
                    { latency, status: "ok", timestamp: Date.now() },
                ]);
            } else {
                setHistory((prev) => [
                    ...prev.slice(-(MAX_HISTORY - 1)),
                    { latency: -1, status: "error", timestamp: Date.now() },
                ]);
            }
        } catch {
            setHistory((prev) => [
                ...prev.slice(-(MAX_HISTORY - 1)),
                { latency: -1, status: "error", timestamp: Date.now() },
            ]);
        }
    }, []);

    useEffect(() => {
        if (!isRunning) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }
        ping();
        intervalRef.current = setInterval(ping, 5000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning, ping]);

    const validPings = history.filter((p) => p.status === "ok");
    const avgLatency = validPings.length > 0
        ? Math.round(validPings.reduce((s, p) => s + p.latency, 0) / validPings.length)
        : 0;
    const lastPing = history[history.length - 1];
    const maxLatency = validPings.length > 0 ? Math.max(...validPings.map((p) => p.latency)) : 100;

    const getStatusColor = (latency: number) => {
        if (latency < 0) return "text-red-400";
        if (latency < 100) return "text-green-400";
        if (latency < 300) return "text-amber-400";
        return "text-red-400";
    };

    const getBarColor = (latency: number) => {
        if (latency < 0) return "bg-red-500";
        if (latency < 100) return "bg-green-500";
        if (latency < 300) return "bg-amber-500";
        return "bg-red-500";
    };

    return (
        <div className="glass rounded-xl p-6 border border-border/50">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${lastPing?.status === "ok" ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
                    <h3 className="text-sm font-bold text-foreground tracking-wide uppercase">
                        Live Diagnostics
                    </h3>
                </div>
                <button
                    onClick={() => setIsRunning(!isRunning)}
                    className="text-[10px] font-bold px-2 py-1 rounded bg-surface hover:bg-surface-hover text-muted-foreground transition-colors"
                >
                    {isRunning ? "PAUSE" : "RESUME"}
                </button>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                    <p className={`text-2xl font-bold font-mono ${lastPing ? getStatusColor(lastPing.latency) : "text-muted-foreground"}`}>
                        {lastPing ? (lastPing.latency >= 0 ? `${lastPing.latency}` : "ERR") : "—"}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Current ms</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold font-mono text-primary">{avgLatency || "—"}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Avg ms</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold font-mono text-foreground">
                        {validPings.length > 0 ? `${Math.round((validPings.length / history.length) * 100)}%` : "—"}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Uptime</p>
                </div>
            </div>

            {/* Sparkline / Bar Chart */}
            <div className="flex items-end gap-[2px] h-16 px-1 bg-background/30 rounded-lg p-2">
                {Array.from({ length: MAX_HISTORY }).map((_, i) => {
                    const point = history[i];
                    if (!point) {
                        return (
                            <div key={i} className="flex-1 bg-border/20 rounded-t-sm" style={{ height: "4px" }} />
                        );
                    }
                    const height = point.latency >= 0
                        ? Math.max(8, (point.latency / Math.max(maxLatency, 100)) * 100)
                        : 100;
                    return (
                        <div
                            key={i}
                            className={`flex-1 rounded-t-sm transition-all duration-300 ${getBarColor(point.latency)}`}
                            style={{ height: `${Math.min(height, 100)}%` }}
                            title={`${point.latency >= 0 ? point.latency + "ms" : "Error"}`}
                        />
                    );
                })}
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-2">
                Pinging /api/health every 5s · {history.length}/{MAX_HISTORY} samples
            </p>
        </div>
    );
}
