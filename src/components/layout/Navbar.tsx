/**
 * Navbar Router Component — Dynamically loads the selected navbar variant based
 * on the active site_template setting. Supports Ceramic UI and Legacy UI.
 */
"use client";

import dynamic from "next/dynamic";

const NavbarSidebar = dynamic(() => import("./NavbarSidebar"), { ssr: true });
const NavbarCeramic = dynamic(() => import("./NavbarCeramic"), { ssr: true });

export default function Navbar({ settings = {} }: { settings?: Record<string, unknown> }) {
    const flags = settings as Record<string, boolean>;
    const template = ((settings["site_template"] as string) || "classic").replace(/"/g, "");

    if (template === "light-modern") {
        return <NavbarCeramic flags={flags} />;
    }

    // Default to the Legacy sidebar UI for classic, ceramic, and glass-dark
    return <NavbarSidebar flags={flags} />;
}
