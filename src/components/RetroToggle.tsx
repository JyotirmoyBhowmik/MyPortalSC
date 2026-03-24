"use client";

import { useTheme } from "./ThemeProvider";
import { motion } from "framer-motion";

export default function RetroToggle() {
    const { isRetro, toggleRetro } = useTheme();

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="fixed top-4 right-4 z-[9999] flex items-center gap-2"
        >
            <span
                className="retro-toggle-label text-xs font-semibold uppercase tracking-wider select-none"
                style={{
                    color: isRetro ? "#00ff41" : "var(--muted-fg)",
                    fontFamily: isRetro ? "'Courier New', monospace" : "inherit",
                    textShadow: isRetro ? "0 0 8px #00ff41" : "none",
                }}
            >
                Retro Mode
            </span>
            <button
                onClick={toggleRetro}
                aria-label="Toggle Retro Mode"
                className="retro-toggle-switch"
                style={{
                    position: "relative",
                    width: "48px",
                    height: "26px",
                    borderRadius: isRetro ? "4px" : "13px",
                    border: isRetro ? "2px solid #00ff41" : "2px solid var(--border-color)",
                    background: isRetro ? "#0a0a0a" : "var(--surface)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: isRetro ? "0 0 12px rgba(0,255,65,0.4), inset 0 0 6px rgba(0,255,65,0.1)" : "none",
                    padding: 0,
                }}
            >
                <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    style={{
                        position: "absolute",
                        top: "2px",
                        left: isRetro ? "22px" : "2px",
                        width: "18px",
                        height: "18px",
                        borderRadius: isRetro ? "3px" : "50%",
                        background: isRetro ? "#00ff41" : "var(--muted-fg)",
                        boxShadow: isRetro ? "0 0 8px #00ff41" : "none",
                        transition: "border-radius 0.3s ease",
                    }}
                />
            </button>
        </motion.div>
    );
}
