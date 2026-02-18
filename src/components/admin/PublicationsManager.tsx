"use client";

import { useTransition, useState } from "react";
import { createPublication, updatePublication, deletePublication } from "@/app/admin/actions/publications";

interface Publication {
    id: string;
    title: string;
    publication_type: string;
    publisher: string | null;
    published_date: string | null;
    url: string | null;
    description: string | null;
    is_published: boolean;
}

export default function PublicationsManager({ publications }: { publications: Publication[] }) {
    const [isPending, startTransition] = useTransition();
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Publication | null>(null);

    function handleSubmit(formData: FormData) {
        startTransition(async () => {
            if (editing) {
                await updatePublication(editing.id, formData);
            } else {
                await createPublication(formData);
            }
            setShowForm(false);
            setEditing(null);
        });
    }

    function handleDelete(id: string) {
        if (!confirm("Delete this publication?")) return;
        startTransition(() => deletePublication(id));
    }

    function openEdit(p: Publication) {
        setEditing(p);
        setShowForm(true);
    }

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Publications &amp; Awards</h1>
                    <p className="text-sm text-muted-foreground mt-1">Manage papers, certifications, and recognitions.</p>
                </div>
                <button
                    onClick={() => { setEditing(null); setShowForm(!showForm); }}
                    className="px-4 py-2 rounded-lg gradient-bg text-white text-sm font-medium shadow-lg shadow-primary/20"
                >
                    {showForm ? "Cancel" : "+ Add Publication"}
                </button>
            </div>

            {showForm && (
                <form action={handleSubmit} className="glass rounded-xl p-6 mb-8 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Title *</label>
                            <input name="title" className="admin-input" required defaultValue={editing?.title || ""} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Type</label>
                            <select name="publication_type" className="admin-input" defaultValue={editing?.publication_type || "paper"}>
                                <option value="paper">Paper</option>
                                <option value="award">Award</option>
                                <option value="recognition">Recognition</option>
                                <option value="certification">Certification</option>
                                <option value="article">Article</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Publisher</label>
                            <input name="publisher" className="admin-input" placeholder="IEEE, ACM, etc." defaultValue={editing?.publisher || ""} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Date</label>
                            <input name="published_date" type="date" className="admin-input" defaultValue={editing?.published_date || ""} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">URL</label>
                        <input name="url" type="url" className="admin-input" placeholder="https://..." defaultValue={editing?.url || ""} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea name="description" rows={3} className="admin-input resize-none" defaultValue={editing?.description || ""} />
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="hidden" name="is_published" value="false" />
                        <input type="checkbox" name="is_published" value="true" id="pub_pub" defaultChecked={editing?.is_published ?? true} className="rounded" />
                        <label htmlFor="pub_pub" className="text-sm">Published</label>
                    </div>
                    <button type="submit" disabled={isPending} className="px-6 py-2 rounded-lg gradient-bg text-white text-sm font-medium disabled:opacity-50">
                        {isPending ? "Saving..." : editing ? "Update Publication" : "Create Publication"}
                    </button>
                </form>
            )}

            <div className="glass rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-surface/50">
                        <tr>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Title</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Type</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden md:table-cell">Publisher</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Date</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {publications.map((item) => (
                            <tr key={item.id} className="hover:bg-surface/30 transition-colors">
                                <td className="px-4 py-3 text-sm font-medium">{item.title}</td>
                                <td className="px-4 py-3">
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary uppercase">{item.publication_type}</span>
                                </td>
                                <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{item.publisher || "—"}</td>
                                <td className="px-4 py-3 text-xs text-muted-foreground">{item.published_date ? new Date(item.published_date).toLocaleDateString() : "—"}</td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        <button onClick={() => openEdit(item)} className="text-xs text-primary hover:underline">Edit</button>
                                        <button onClick={() => handleDelete(item.id)} disabled={isPending} className="text-xs text-red-400 hover:underline">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {publications.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">No publications yet. Click &quot;+ Add Publication&quot; to create one.</p>
                )}
            </div>
        </div>
    );
}
