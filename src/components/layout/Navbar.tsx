/**
 * Navbar Router Component — Dynamically loads the selected navbar variant based
 * on the active site_template setting. Supports Ceramic UI and Legacy UI.
 */
"use client";

import dynamic from "next/dynamic";

const NavbarSidebar = dynamic(() => import("./NavbarSidebar"), { ssr: true });
const NavbarCeramic = dynamic(() => import("./NavbarCeramic"), { ssr: true });
const NavbarGlassDark = dynamic(() => import("./NavbarGlassDark"), { ssr: true });

export default function Navbar({ settings = {} }: { settings?: Record<string, unknown> }) {
    const flags = settings as Record<string, boolean>;
    const template = ((settings["site_template"] as string) || "classic").replace(/"/g, "");

    if (template === "ceramic") {
        return <NavbarCeramic flags={flags} />;
    }
    
    if (template === "glass-dark") {
        return <NavbarGlassDark flags={flags} />;
    }

    if (template === "light-modern") {
        return <NavbarCeramic flags={flags} />;
    }

    // Default to the Legacy sidebar UI
    return <NavbarSidebar flags={flags} />;
}
