"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import type { Achievement } from "@/lib/database.types";
import {
    createAchievement,
    updateAchievement,
    deleteAchievement,
} from "@/app/admin/actions/achievements";
import { useConfirmDialog } from "@/components/ui/ConfirmDialog";

export default function AchievementsManager({
    achievements,
}: {
    achievements: Achievement[];
}) {
    const [showNew, setShowNew] = useState(false);
    const [editing, setEditing] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { dialog, confirm: confirmDelete } = useConfirmDialog();

    async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const fd = new FormData(e.currentTarget);
        try {
            await createAchievement({
                title: fd.get("title") as string,
                description: (fd.get("description") as string) || null,
                achievement_date: fd.get("achievement_date") as string,
                category: (fd.get("category") as string) || null,
                order_index: parseInt(fd.get("order_index") as string) || 0,
            });
            setShowNew(false);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed");
        }
        setLoading(false);
    }

    async function handleUpdate(e: React.FormEvent<HTMLFormElement>, id: string) {
        e.preventDefault();
        setLoading(true);
        const fd = new FormData(e.currentTarget);
        try {
            await updateAchievement(id, {
                title: fd.get("title") as string,
                description: (fd.get("description") as string) || null,
                achievement_date: fd.get("achievement_date") as string,
                category: (fd.get("category") as string) || null,
                order_index: parseInt(fd.get("order_index") as string) || 0,
            });
            setEditing(null);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed");
        }
        setLoading(false);
    }

    function handleDelete(id: string) {
        confirmDelete("This achievement will be permanently deleted.", async () => {
            await deleteAchievement(id);
        }, { title: "Delete Achievement?" });
    }

    const AchForm = ({
        ach,
        onSubmit,
        onCancel,
    }: {
        ach?: Achievement;
        onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
        onCancel: () => void;
    }) => (
        <form onSubmit={onSubmit} className="glass rounded-xl p-5 mb-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input name="title" className="admin-input" placeholder="Achievement title" defaultValue={ach?.title || ""} required />
                <input name="category" className="admin-input" placeholder="Category (e.g. Competition)" defaultValue={ach?.category || ""} />
            </div>
            <textarea name="description" rows={3} className="admin-input resize-none" placeholder="Description" defaultValue={ach?.description || ""} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input name="achievement_date" type="date" className="admin-input" defaultValue={ach?.achievement_date || ""} required />
                <input name="order_index" type="number" className="admin-input" placeholder="Order" defaultValue={ach?.order_index || 0} />
            </div>
            <div className="flex gap-2">
                <Button type="submit" variant="primary" size="sm" isLoading={loading}>
                    {ach ? "Save" : "Create"}
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
            </div>
        </form>
    );

    return (
        <>
            {dialog}
            <div>
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold">Achievements</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Manage your awards and recognition
                        </p>
                    </div>
                    <Button variant="primary" onClick={() => setShowNew(true)}>
                        + Add Achievement
                    </Button>
                </div>

                {showNew && (
                    <AchForm onSubmit={handleCreate} onCancel={() => setShowNew(false)} />
                )}

                <div className="space-y-3">
                    {achievements.map((ach) =>
                        editing === ach.id ? (
                            <AchForm
                                key={ach.id}
                                ach={ach}
                                onSubmit={(e) => handleUpdate(e, ach.id)}
                                onCancel={() => setEditing(null)}
                            />
                        ) : (
                            <div
                                key={ach.id}
                                className="glass rounded-xl p-5 flex items-center justify-between gap-4"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-lg">🏅</span>
                                        <span className="font-medium">{ach.title}</span>
                                        {ach.category && (
                                            <span className="text-xs px-2 py-0.5 rounded bg-accent/10 text-accent">
                                                {ach.category}
                                            </span>
                                        )}
                                    </div>
                                    {ach.description && (
                                        <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                                            {ach.description}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => setEditing(ach.id)}
                                        className="text-xs px-2 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(ach.id)}
                                        className="text-xs px-2 py-1 rounded bg-danger/10 text-danger hover:bg-danger/20 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                    {achievements.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-8">
                            No achievements yet.
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}
