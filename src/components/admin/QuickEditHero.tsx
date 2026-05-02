"use client";

/**
 * QuickEditHero — Inline hero editor on the admin dashboard.
 * Allows fast editing of hero title, subtitle, and description
 * without navigating to the Pages editor.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
    initialTitle: string;
    initialSubtitle: string;
    initialDescription: string;
}

export default function QuickEditHero({ initialTitle, initialSubtitle, initialDescription }: Props) {
    const [title, setTitle] = useState(initialTitle);
    const [subtitle, setSubtitle] = useState(initialSubtitle);
    const [description, setDescription] = useState(initialDescription);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const isDirty =
        title !== initialTitle ||
        subtitle !== initialSubtitle ||
        description !== initialDescription;

    async function handleSave() {
        setSaving(true);
        setError(null);
        try {
            const res = await fetch("/api/admin/quick-edit-hero", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ hero_title: title, hero_subtitle: subtitle, hero_description: description }),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "Save failed");
            }
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Failed to save");
        } finally {
            setSaving(false);
        }
    }

    function handleReset() {
        setTitle(initialTitle);
        setSubtitle(initialSubtitle);
        setDescription(initialDescription);
        setError(null);
    }

    return (
        <div className="glass rounded-xl p-6 space-y-4">
            {/* Preview strip */}
            <div className="p-4 rounded-lg bg-surface/50 border border-border/50 mb-2">
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-widest font-bold">Live Preview</p>
                <h3 className="text-xl font-black gradient-text">{title || "—"}</h3>
                <p className="text-sm text-primary font-semibold mt-1">{subtitle || "—"}</p>
                {description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>}
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">
                        Hero Title
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="admin-input w-full"
                        placeholder="Your Name"
                        maxLength={80}
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">
                        Subtitle / Role
                    </label>
                    <input
                        type="text"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        className="admin-input w-full"
                        placeholder="IT Infrastructure & Cloud Specialist"
                        maxLength={120}
                    />
                </div>
            </div>
            <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">
                    Description
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="admin-input w-full resize-none"
                    rows={3}
                    placeholder="Brief professional summary shown below the name..."
                    maxLength={400}
                />
                <p className="text-xs text-muted-foreground mt-1 text-right">{description.length}/400</p>
            </div>

            {/* Error */}
            {error && (
                <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 justify-end pt-2">
                {isDirty && (
                    <button
                        onClick={handleReset}
                        className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-surface transition-all"
                    >
                        Reset
                    </button>
                )}
                <button
                    onClick={handleSave}
                    disabled={saving || !isDirty}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:brightness-110 disabled:opacity-40 transition-all"
                >
                    {saving ? (
                        <>
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                            Saving...
                        </>
                    ) : saved ? (
                        <>✓ Saved!</>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            Save to Site
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
