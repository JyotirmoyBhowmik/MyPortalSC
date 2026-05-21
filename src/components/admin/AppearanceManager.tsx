"use client";
import Image from "next/image";

import { useState, useRef, useTransition } from "react";
import { uploadSiteIcon, resetSiteIcon } from "@/app/admin/actions/appearance";

export default function AppearanceManager({ currentIcon }: { currentIcon: string }) {
    const [preview, setPreview] = useState<string>(currentIcon);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [isPending, startTransition] = useTransition();
    const fileRef = useRef<HTMLInputElement>(null);

    function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setPreview(url);
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
            if (fileRef.current) fileRef.current.value = "";
            setMessage({ type: "success", text: "Icon reset to default." });
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
            <div className="glass rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-4">Site Icon / Favicon</h2>
                <p className="text-sm text-muted-foreground mb-6">
                    Upload a custom icon that appears in browser tabs, bookmarks, and mobile home screens. Recommended size: 256×256 or larger. Supports PNG, ICO, SVG, JPEG, WebP (max 512KB).
                </p>

                <div className="flex items-start gap-8">
                    {/* Preview */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-24 h-24 rounded-2xl bg-surface border-2 border-dashed border-border flex items-center justify-center overflow-hidden">
                            {preview ? (
                                 
                                <img src={preview} alt="Site icon preview" className="w-full h-full object-contain" />
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
                        <div className="flex items-center gap-3">
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
                                disabled={isPending || !fileRef.current?.files?.length}
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
                                <div className="w-8 h-8 rounded bg-surface border border-border flex items-center justify-center overflow-hidden mb-1">
                                    {preview ? (
                                         
                                        <img src={preview} alt="" className="w-full h-full object-contain" />
                                    ) : (
                                        <span className="text-[6px] font-bold">JB</span>
                                    )}
                                </div>
                                <span className="text-[10px] text-muted-foreground">32px</span>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 rounded-lg bg-surface border border-border flex items-center justify-center overflow-hidden mb-1">
                                    {preview ? (
                                         
                                        <img src={preview} alt="" className="w-full h-full object-contain" />
                                    ) : (
                                        <span className="text-xs font-bold">JB</span>
                                    )}
                                </div>
                                <span className="text-[10px] text-muted-foreground">48px</span>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-xl bg-surface border border-border flex items-center justify-center overflow-hidden mb-1">
                                    {preview ? (
                                         
                                        <img src={preview} alt="" className="w-full h-full object-contain" />
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
        </div>
    );
}
