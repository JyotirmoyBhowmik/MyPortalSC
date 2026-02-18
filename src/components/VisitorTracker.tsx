"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Lightweight, privacy-first visitor tracking component.
 * Records page views to the `visitor_events` table.
 * No cookies, no fingerprinting — just basic page visit analytics.
 */
export default function VisitorTracker() {
    const pathname = usePathname();

    useEffect(() => {
        // Don't track admin pages
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
                // Silently fail — analytics should never break the site
            }
        };

        // Small delay to avoid tracking quick navigations
        const timer = setTimeout(trackVisit, 500);
        return () => clearTimeout(timer);
    }, [pathname]);

    return null; // Invisible component
}
