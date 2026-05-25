"use client";
import Image from "next/image";
import { useState, useRef, useTransition } from "react";
import { uploadSiteIcon, resetSiteIcon } from "@/app/admin/actions/appearance";
import { updateSettingValue } from "@/app/admin/actions/settings";

const templates = [
    {
        id: "ceramic",
        name: "Ceramic Dark",
        tag: "Default",
        description: "Unglazed ceramic feel with dark tactile minimalism, bold typography, and smooth interactions.",
        bg: "#0d1b1e",
        primary: "#d9f24a",
        accent: "#ffffff",
        border: "#1e353a",
        badge: "Tactile Dark"
    },
    {
        id: "ceramic-light",
        name: "Ceramic Light",
        tag: "New",
        description: "Unglazed light porcelain aesthetic, generous negative space, top centered navbar, and slate blue accents.",
        bg: "#f9f9f7",
        primary: "#1a1c1b",
        accent: "#505f76",
        border: "#e5e5e1",
        badge: "Porcelain"
    },
    {
        id: "glass-dark",
        name: "Glass Exec Dark",
        tag: "Secondary",
        description: "Premium glassmorphism effects, dark backdrop-blur container UI, and ultra-modern neon-cyan accents.",
        bg: "#030712",
        primary: "#22d3ee",
        accent: "#a78bfa",
        border: "#374151",
        badge: "Glassmorphism"
    },
    {
        id: "light-modern",
        name: "Light Exec Modern",
        tag: "Minimalist",
        description: "Clean modern canvas, minimalist thin outlines, fluid margins, and spacious layouts.",
        bg: "#ffffff",
        primary: "#0f172a",
        accent: "#3b82f6",
        border: "#e2e8f0",
        badge: "Minimalist"
    },
    {
        id: "classic",
        name: "Classic Slate",
        tag: "Legacy",
        description: "Standard left-sidebar layout, traditional typography, solid interfaces, and reliable routing.",
        bg: "#0b0f19",
        primary: "#38bdf8",
        accent: "#94a3b8",
        border: "#1e293b",
        badge: "Legacy"
    }
];

export default function AppearanceManager({ 
    currentIcon,
    currentTemplate 
}: { 
    currentIcon: string;
    currentTemplate: string;
}) {
    const [preview, setPreview] = useState<string>(currentIcon);
    const [template, setTemplate] = useState<string>(currentTemplate || "ceramic");
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [isPending, startTransition] = useTransition();
    const [hasSelectedFile, setHasSelectedFile] = useState<boolean>(false);
    const fileRef = useRef<HTMLInputElement>(null);

    function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) {
            setHasSelectedFile(false);
            return;
        }
        const url = URL.createObjectURL(file);
        setPreview(url);
        setHasSelectedFile(true);
    }

    function handleUpload() {
        const file = fileRef.current?.files?.[0];
        if (!file) return;

        const fd = new FormData();
        fd.append("icon", file);

        startTransition(async () => {
            const result = await uploadSiteIcon(fd);
            if (result.success) {
                setPreview(result.url || preview);
                setHasSelectedFile(false);
                setMessage({ type: "success", text: "Icon updated! It may take a moment to refresh across the site." });
            } else {
                setMessage({ type: "error", text: result.error || "Failed to upload" });
            }
            setTimeout(() => setMessage(null), 5000);
        });
    }

    function handleReset() {
        startTransition(async () => {
            await resetSiteIcon();
            setPreview("");
            setHasSelectedFile(false);
            if (fileRef.current) fileRef.current.value = "";
            setMessage({ type: "success", text: "Icon reset to default." });
            setTimeout(() => setMessage(null), 5000);
        });
    }

    function handleTemplateSelect(id: string) {
        const previousTemplate = template;
        setTemplate(id);
        startTransition(async () => {
            const result = await updateSettingValue("site_template", id);
            if (result.success) {
                // Apply instantaneous data-template switch for local live preview
                document.documentElement.setAttribute("data-template", id);
                setMessage({ type: "success", text: `Template updated to "${id}" successfully! Live preview active.` });
            } else {
                setTemplate(previousTemplate); // Revert on failure
                setMessage({ type: "error", text: result.error || "Failed to update template" });
            }
            setTimeout(() => setMessage(null), 5000);
        });
    }

    return (
        <div className="space-y-8">
            {/* Toast */}
            {message && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium shadow-lg animate-slide-down ${message.type === "success" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
                    {message.text}
                </div>
            )}

            {/* Icon Preview & Upload */}
            <div className="glass rounded-2xl p-6 bg-surface/50 border border-border">
                <h2 className="text-lg font-semibold mb-4">Site Icon / Favicon</h2>
                <p className="text-sm text-muted-foreground mb-6">
                    Upload a custom icon that appears in browser tabs, bookmarks, and mobile home screens. Recommended size: 256×256 or larger. Supports PNG, ICO, SVG, JPEG, WebP (max 512KB).
                </p>

                <div className="flex flex-col lg:flex-row items-start gap-8">
                    {/* Preview */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-24 h-24 rounded-2xl bg-surface border-2 border-dashed border-border flex items-center justify-center overflow-hidden relative">
                            {preview ? (
                                <Image src={preview} alt="Site icon preview" fill className="object-contain" unoptimized />
                            ) : (
                                <div className="w-16 h-16 rounded-xl bg-[#D9F24A] flex items-center justify-center text-[#0D1B1E] font-extrabold text-xl">
                                    JB
                                </div>
                            )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                            {preview ? "Custom Icon" : "Default Icon"}
                        </span>
                    </div>

                    {/* Upload Controls */}
                    <div className="flex-1 space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:bg-primary-hover transition-all">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Browse Icon
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept=".png,.ico,.svg,.jpg,.jpeg,.webp"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                            </label>
                            <button
                                onClick={handleUpload}
                                disabled={isPending || !hasSelectedFile}
                                className="px-4 py-2.5 rounded-xl text-sm font-medium bg-green-600 hover:bg-green-700 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPending ? "Uploading…" : "Save Icon"}
                            </button>
                            {preview && (
                                <button
                                    onClick={handleReset}
                                    disabled={isPending}
                                    className="px-4 py-2.5 rounded-xl text-sm font-medium bg-surface hover:bg-surface-hover text-red-400 transition-all disabled:opacity-50"
                                >
                                    Reset to Default
                                </button>
                            )}
                        </div>

                        {/* Size previews */}
                        <div className="flex items-center gap-6 pt-2">
                            <div className="text-center">
                                <div className="w-8 h-8 rounded bg-surface border border-border flex items-center justify-center overflow-hidden mb-1 relative">
                                    {preview ? (
                                        <Image src={preview} alt="" fill className="object-contain" unoptimized />
                                    ) : (
                                        <span className="text-[6px] font-bold">JB</span>
                                    )}
                                </div>
                                <span className="text-[10px] text-muted-foreground">32px</span>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 rounded-lg bg-surface border border-border flex items-center justify-center overflow-hidden mb-1 relative">
                                    {preview ? (
                                        <Image src={preview} alt="" fill className="object-contain" unoptimized />
                                    ) : (
                                        <span className="text-xs font-bold">JB</span>
                                    )}
                                </div>
                                <span className="text-[10px] text-muted-foreground">48px</span>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-xl bg-surface border border-border flex items-center justify-center overflow-hidden mb-1 relative">
                                    {preview ? (
                                        <Image src={preview} alt="" fill className="object-contain" unoptimized />
                                    ) : (
                                        <span className="text-sm font-bold">JB</span>
                                    )}
                                </div>
                                <span className="text-[10px] text-muted-foreground">64px</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Template Selection Grid */}
            <div className="glass rounded-2xl p-6 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-border">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                        </svg>
                        Site Template & Visual Theme
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Choose a design system preset to instantly restyle your portfolio&apos;s layouts, backgrounds, borders, and navbar configurations.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {templates.map((tpl) => {
                        const isActive = template.replace(/"/g, "") === tpl.id;
                        return (
                            <button
                                key={tpl.id}
                                disabled={isPending}
                                onClick={() => handleTemplateSelect(tpl.id)}
                                className={`text-left rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col group h-full ${
                                    isActive
                                        ? "bg-surface border-primary shadow-[0_0_25px_rgba(217,242,74,0.1)] ring-1 ring-primary"
                                        : "bg-surface/40 hover:bg-surface/60 border-border/80 hover:border-border-hover shadow-sm"
                                }`}
                            >
                                {/* Active subtle glow overlay */}
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent pointer-events-none" />
                                )}

                                {/* Card Header */}
                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-bold text-base text-foreground tracking-tight flex items-center gap-2">
                                                {tpl.name}
                                            </h3>
                                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                                                tpl.tag === "New"
                                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                                                    : tpl.tag === "Default"
                                                    ? "bg-primary/10 text-primary border-primary/20"
                                                    : "bg-muted text-muted-foreground border-border"
                                            }`}>
                                                {tpl.tag}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            {tpl.description}
                                        </p>
                                    </div>

                                    {/* Mock Visual Layout Swatch Preview */}
                                    <div className="mt-5 rounded-lg border border-border/60 bg-surface p-3 h-28 flex flex-col justify-between overflow-hidden relative transition-all group-hover:border-border-hover" style={{ backgroundColor: tpl.bg }}>
                                        {/* Layout Representation */}
                                        {tpl.id === "ceramic-light" || tpl.id === "light-modern" ? (
                                            /* Top Header Navigation Mock */
                                            <div className="flex flex-col h-full justify-between">
                                                <div className="h-3 rounded flex items-center justify-between px-2" style={{ backgroundColor: tpl.border }}>
                                                    <div className="w-8 h-1 rounded" style={{ backgroundColor: tpl.primary }} />
                                                    <div className="flex gap-1">
                                                        <div className="w-3 h-1 rounded" style={{ backgroundColor: tpl.accent }} />
                                                        <div className="w-3 h-1 rounded" style={{ backgroundColor: tpl.accent }} />
                                                    </div>
                                                </div>
                                                <div className="flex-1 flex gap-2 items-center justify-center p-1">
                                                    <div className="w-16 h-10 rounded border" style={{ borderColor: tpl.border, backgroundColor: tpl.bg }} />
                                                    <div className="w-16 h-10 rounded border" style={{ borderColor: tpl.border, backgroundColor: tpl.bg }} />
                                                </div>
                                            </div>
                                        ) : (
                                            /* Sidebar Navigation Mock */
                                            <div className="flex h-full gap-2">
                                                <div className="w-6 rounded flex flex-col gap-1.5 p-1 items-center" style={{ backgroundColor: tpl.border }}>
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tpl.primary }} />
                                                    <div className="w-3 h-1 rounded" style={{ backgroundColor: tpl.accent }} />
                                                    <div className="w-3 h-1 rounded" style={{ backgroundColor: tpl.accent }} />
                                                </div>
                                                <div className="flex-1 flex flex-col gap-1.5 justify-center">
                                                    <div className="h-6 rounded border" style={{ borderColor: tpl.border, backgroundColor: tpl.bg }} />
                                                    <div className="h-6 rounded border" style={{ borderColor: tpl.border, backgroundColor: tpl.bg }} />
                                                </div>
                                            </div>
                                        )}

                                        {/* Color circles overlay in corner */}
                                        <div className="absolute bottom-2 right-2 flex gap-1 bg-surface/80 backdrop-blur-sm p-1 rounded-full border border-border">
                                            <span className="w-3 h-3 rounded-full border border-border/50" style={{ backgroundColor: tpl.bg }} title="Background" />
                                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: tpl.primary }} title="Primary" />
                                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: tpl.accent }} title="Accent" />
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Selection Indicator */}
                                <div className={`w-full px-5 py-3.5 border-t text-xs font-semibold flex items-center justify-between transition-colors ${
                                    isActive
                                        ? "bg-primary/5 border-primary/10 text-primary font-bold"
                                        : "bg-surface/20 border-border/50 text-muted-foreground group-hover:text-foreground"
                                }`}>
                                    <span className="flex items-center gap-1.5">
                                        {isActive ? (
                                            <>
                                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Active Theme
                                            </>
                                        ) : (
                                            "Select Theme"
                                        )}
                                    </span>
                                    {!isActive && (
                                        <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
