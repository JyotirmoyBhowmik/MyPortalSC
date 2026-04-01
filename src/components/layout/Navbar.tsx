/**
 * Navbar Router Component — Dynamically loads the selected navbar variant.
 * Currently defaults to NavbarSidebar cleanly, but structured to support
 * swapping out standard classic/minimal variants based on settings later.
 */
"use client";

import dynamic from "next/dynamic";

const NavbarSidebar = dynamic(() => import("./NavbarSidebar"), { ssr: true });

export default function Navbar({ settings = {} }: { settings?: Record<string, unknown> }) {
    const flags = settings as Record<string, boolean>;
    return <NavbarSidebar flags={flags} />;
}
