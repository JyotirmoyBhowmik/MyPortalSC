"use client";

import dynamic from "next/dynamic";

const NavbarSidebar = dynamic(() => import("./NavbarSidebar"), { ssr: true });

export default function Navbar({ settings = {} }: { settings?: Record<string, unknown> }) {
    const flags = settings as Record<string, boolean>;
    return <NavbarSidebar flags={flags} />;
}
