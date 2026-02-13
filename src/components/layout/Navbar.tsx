"use client";

import dynamic from "next/dynamic";

const NavbarClassic = dynamic(() => import("./NavbarClassic"), { ssr: true });
const NavbarPremium = dynamic(() => import("./NavbarPremium"), { ssr: true });

export default function Navbar({ settings = {} }: { settings?: Record<string, unknown> }) {
    const template = (settings["site_template"] as string)?.replace(/"/g, "") || "classic";
    const flags = settings as Record<string, boolean>;

    if (template === "premium" || template === "glass") {
        return <NavbarPremium flags={flags} />;
    }

    return <NavbarClassic flags={flags} />;
}
