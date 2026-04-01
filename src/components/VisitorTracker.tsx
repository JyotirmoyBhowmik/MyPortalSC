"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface ClickEvent {
    page_path: string;
    x_percent: number;
    y_percent: number;
    element_selector: string | null;
}

/**
 * Lightweight, privacy-first visitor tracking component.
 * Records page views to `visitor_events` and click positions to `click_events`.
 * No cookies, no fingerprinting — just basic page visit + click analytics.
 */
export default function VisitorTracker() {
    const pathname = usePathname();
    const clickBuffer = useRef<ClickEvent[]>([]);
    const flushTimer = useRef<NodeJS.Timeout | null>(null);

    // Flush buffered clicks to Supabase
    const flushClicks = useCallback(async () => {
        if (clickBuffer.current.length === 0) return;
        const events = [...clickBuffer.current];
        clickBuffer.current = [];

        try {
            const supabase = createClient();
            await supabase.from("click_events").insert(events);
        } catch {
            // Silently fail — analytics should never break the site
        }
    }, []);

    // Track page views
    useEffect(() => {
        if (pathname.startsWith("/admin")) return;

        const trackVisit = async () => {
            try {
                const supabase = createClient();
                const deviceType = /Mobi|Android/i.test(navigator.userAgent)
                    ? "mobile"
                    : /Tablet|iPad/i.test(navigator.userAgent)
                        ? "tablet"
                        : "desktop";

                await supabase.from("visitor_events").insert({
                    page_path: pathname,
                    event_type: "pageview",
                    referrer: document.referrer || null,
                    device_type: deviceType,
                    user_agent: navigator.userAgent.substring(0, 255),
                });
            } catch {
                // Silently fail
            }
        };

        const timer = setTimeout(trackVisit, 500);
        return () => clearTimeout(timer);
    }, [pathname]);

    // Track clicks with batching
    useEffect(() => {
        if (pathname.startsWith("/admin")) return;

        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target) return;

            // Calculate relative position as percentages
            const xPercent = Math.round((e.clientX / window.innerWidth) * 10000) / 100;
            const yPercent = Math.round(((e.clientY + window.scrollY) / document.documentElement.scrollHeight) * 10000) / 100;

            // Get a useful selector for the clicked element
            let selector: string | null = null;
            if (target.id) {
                selector = `#${target.id}`;
            } else if (target.className && typeof target.className === "string") {
                selector = target.tagName.toLowerCase() + "." + target.className.split(" ").slice(0, 2).join(".");
            } else {
                selector = target.tagName.toLowerCase();
            }

            clickBuffer.current.push({
                page_path: pathname,
                x_percent: xPercent,
                y_percent: yPercent,
                element_selector: selector?.substring(0, 200) || null,
            });

            // Auto-flush every 10 seconds or when buffer hits 20
            if (clickBuffer.current.length >= 20) {
                flushClicks();
            }
        };

        document.addEventListener("click", handleClick, { passive: true });

        // Set up periodic flush
        flushTimer.current = setInterval(flushClicks, 10000);

        // Flush on page unload
        const handleUnload = () => flushClicks();
        window.addEventListener("beforeunload", handleUnload);

        return () => {
            document.removeEventListener("click", handleClick);
            if (flushTimer.current) clearInterval(flushTimer.current);
            window.removeEventListener("beforeunload", handleUnload);
            flushClicks(); // Final flush
        };
    }, [pathname, flushClicks]);

    return null; // Invisible component
}
