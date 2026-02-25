"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useSettings } from "@/components/SettingsProvider";

interface Props {
    children: ReactNode;
    className?: string;
    delay?: number;
    direction?: "up" | "down" | "left" | "right" | "fade";
}

export default function ScrollReveal({ children, className = "", delay = 0, direction = "up" }: Props) {
    const settings = useSettings();
    const isScrollEnabled = settings?.feature_scroll_animations !== false;
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(!isScrollEnabled);

    useEffect(() => {
        if (!isScrollEnabled) return;

        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
            { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [isScrollEnabled]);

    const transforms: Record<string, string> = {
        up: "translateY(40px)",
        down: "translateY(-40px)",
        left: "translateX(40px)",
        right: "translateX(-40px)",
        fade: "translateY(0)",
    };

    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translate(0, 0)" : transforms[direction],
                transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
            }}
        >
            {children}
        </div>
    );
}
