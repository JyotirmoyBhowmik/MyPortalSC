"use client";

/**
 * AdminProfilePhotoManager — Admin UI for managing the profile photo.
 * Allows uploading a new photo to /public/images/profile.jpg via the media API,
 * or setting a Supabase storage URL via the site_settings key "profile_photo_url".
 */

import { useState, useRef } from "react";
import Image from "next/image";
import { updateSettingValue } from "@/app/admin/actions/settings";

interface Props {
    currentPhotoUrl: string;
}

export default function AdminProfilePhotoManager({ currentPhotoUrl }: Props) {
    const [photoUrl, setPhotoUrl] = useState(currentPhotoUrl);
    const [urlInput, setUrlInput] = useState(currentPhotoUrl);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function showMsg(type: "success" | "error", text: string) {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 3500);
    }

    async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            showMsg("error", "Please select an image file (JPG, PNG, WEBP).");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            showMsg("error", "Image must be under 5MB.");
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("path", "profile/profile.jpg");

            // Upload via existing media API
            const res = await fetch("/api/storage/sign-upload", {
                method: "POST",
                body: JSON.stringify({ filename: "profile.jpg", contentType: file.type }),
                headers: { "Content-Type": "application/json" },
            });

            if (res.ok) {
                const { signedUrl, publicUrl } = await res.json();
                // Upload directly to signed URL
                await fetch(signedUrl, {
                    method: "PUT",
                    body: file,
                    headers: { "Content-Type": file.type },
                });
                // Save the public URL to settings
                const newUrl = publicUrl || signedUrl.split("?")[0];
                await savePhotoUrl(newUrl);
            } else {
                // Fallback: use object URL for preview and show instructions
                const localUrl = URL.createObjectURL(file);
                setPhotoUrl(localUrl);
                showMsg("error", "Storage upload failed. Please place the photo manually at public/images/profile.jpg");
            }
        } catch {
            showMsg("error", "Upload failed. Please place the photo at public/images/profile.jpg and set the URL below.");
        } finally {
            setUploading(false);
        }
    }

    async function savePhotoUrl(url: string) {
        setSaving(true);
        try {
            const result = await updateSettingValue("profile_photo_url", url);
            if (result.success) {
                setPhotoUrl(url);
                setUrlInput(url);
                showMsg("success", "Profile photo URL saved! The site will update within 60 seconds.");
            } else {
                showMsg("error", result.error || "Failed to save URL.");
            }
        } catch {
            showMsg("error", "Failed to save URL.");
        } finally {
            setSaving(false);
        }
    }

    async function handleUrlSave() {
        if (!urlInput.trim()) {
            showMsg("error", "Please enter a valid URL.");
            return;
        }
        await savePhotoUrl(urlInput.trim());
    }

    const displaySrc = photoUrl || "/images/profile.jpg";

    return (
        <div className="space-y-8">
            {/* Toast */}
            {message && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium shadow-lg transition-all ${message.type === "success" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
                    {message.text}
                </div>
            )}

            {/* Current photo preview */}
            <div className="glass rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-8">
                <div className="relative flex-shrink-0">
                    <div className="relative w-36 h-36 rounded-2xl overflow-hidden ring-4 ring-primary/30 shadow-2xl">
                        <Image
                            src={displaySrc}
                            alt="Profile photo preview"
                            fill
                            className="object-cover"
                            sizes="144px"
                            key={displaySrc}
                            onError={() => { /* fallback handled below */ }}
                            unoptimized={displaySrc.startsWith("blob:")}
                        />
                        {/* Gradient fallback */}
                        <div className="absolute inset-0 gradient-bg flex items-center justify-center text-white text-4xl font-bold select-none -z-10">
                            JB
                        </div>
                    </div>
                    {/* Status badge */}
                    <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-lg border-2 border-background ${photoUrl ? "bg-green-500" : "bg-yellow-500"}`}>
                        {photoUrl ? "✓" : "!"}
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-bold mb-1">Profile Photo</h2>
                    <p className="text-sm text-muted-foreground mb-4 max-w-sm leading-relaxed">
                        This photo appears in the <strong>About Me</strong> page hero section. Recommended: square crop, 400×400px or larger, professional headshot.
                    </p>
                    {photoUrl ? (
                        <p className="text-xs font-mono text-primary break-all max-w-xs">{photoUrl}</p>
                    ) : (
                        <p className="text-xs text-yellow-400">⚠ No photo configured — showing initials fallback</p>
                    )}
                </div>
            </div>

            {/* Upload Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Option A: File Upload */}
                <div className="glass rounded-xl p-6 bg-gradient-to-br from-blue-500/5 to-indigo-500/5">
                    <h3 className="font-bold mb-1 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-black">A</span>
                        Upload from Device
                    </h3>
                    <p className="text-xs text-muted-foreground mb-4">Upload a JPG/PNG image directly from your computer.</p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-sm font-medium disabled:opacity-50"
                    >
                        {uploading ? (
                            <>
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                Uploading...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                Choose Photo
                            </>
                        )}
                    </button>
                    <p className="text-xs text-muted-foreground mt-3 text-center">Max 5MB · JPG, PNG, WEBP</p>
                </div>

                {/* Option B: URL */}
                <div className="glass rounded-xl p-6 bg-gradient-to-br from-purple-500/5 to-pink-500/5">
                    <h3 className="font-bold mb-1 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-black">B</span>
                        Set from URL
                    </h3>
                    <p className="text-xs text-muted-foreground mb-4">Paste a direct image URL (Supabase storage, CDN, etc.).</p>
                    <div className="flex gap-2">
                        <input
                            type="url"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            placeholder="https://example.com/photo.jpg"
                            className="admin-input flex-1 text-xs"
                        />
                        <button
                            onClick={handleUrlSave}
                            disabled={saving}
                            className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:brightness-110 disabled:opacity-50 transition-all flex-shrink-0"
                        >
                            {saving ? "..." : "Save"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Option C: Manual instructions */}
            <div className="glass rounded-xl p-5 bg-gradient-to-br from-amber-500/5 to-yellow-500/5 border border-amber-500/20">
                <h3 className="font-bold mb-2 flex items-center gap-2 text-amber-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Manual Fallback (Always Works)
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                    Place your photo file at <code className="text-primary bg-primary/10 px-1 rounded">public/images/profile.jpg</code> in the project root.
                    Then set the URL to <code className="text-primary bg-primary/10 px-1 rounded">/images/profile.jpg</code> in Option B above and click Save.
                    The About Me page will automatically display it.
                </p>
            </div>
        </div>
    );
}
