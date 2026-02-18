"use client";

import { useTransition, useState } from "react";
import { createDownload, updateDownload, deleteDownload } from "@/app/admin/actions/downloads";

interface Download {
    id: string;
    title: string;
    description: string | null;
    file_url: string;
    file_size: string | null;
    file_type: string;
    category: string;
    download_count: number;
    is_published: boolean;
}

export default function DownloadsManager({ downloads }: { downloads: Download[] }) {
    const [isPending, startTransition] = useTransition();
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Download | null>(null);

    function handleSubmit(formData: FormData) {
        startTransition(async () => {
            if (editing) {
                await updateDownload(editing.id, formData);
            } else {
                await createDownload(formData);
            }
            setShowForm(false);
            setEditing(null);
        });
    }

    function handleDelete(id: string) {
        if (!confirm("Delete this download?")) return;
        startTransition(() => deleteDownload(id));
    }

    function openEdit(d: Download) {
        setEditing(d);
        setShowForm(true);
    }

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Downloads</h1>
                    <p className="text-sm text-muted-foreground mt-1">Manage downloadable resources and documents.</p>
                </div>
                <button
                    onClick={() => { setEditing(null); setShowForm(!showForm); }}
                    className="px-4 py-2 rounded-lg gradient-bg text-white text-sm font-medium shadow-lg shadow-primary/20"
                >
                    {showForm ? "Cancel" : "+ Add Download"}
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
                            <label className="block text-sm font-medium mb-1">File URL *</label>
                            <input name="file_url" type="url" className="admin-input" required placeholder="https://..." defaultValue={editing?.file_url || ""} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea name="description" rows={3} className="admin-input resize-none" defaultValue={editing?.description || ""} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">File Type</label>
                            <select name="file_type" className="admin-input" defaultValue={editing?.file_type || "pdf"}>
                                <option value="pdf">PDF</option>
                                <option value="doc">DOC</option>
                                <option value="xlsx">XLSX</option>
                                <option value="pptx">PPTX</option>
                                <option value="zip">ZIP</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">File Size</label>
                            <input name="file_size" className="admin-input" placeholder="2.5 MB" defaultValue={editing?.file_size || ""} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <input name="category" className="admin-input" placeholder="general" defaultValue={editing?.category || "general"} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="hidden" name="is_published" value="false" />
                        <input type="checkbox" name="is_published" value="true" id="dl_pub" defaultChecked={editing?.is_published ?? true} className="rounded" />
                        <label htmlFor="dl_pub" className="text-sm">Published</label>
                    </div>
                    <button type="submit" disabled={isPending} className="px-6 py-2 rounded-lg gradient-bg text-white text-sm font-medium disabled:opacity-50">
                        {isPending ? "Saving..." : editing ? "Update Download" : "Create Download"}
                    </button>
                </form>
            )}

            <div className="glass rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-surface/50">
                        <tr>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Title</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Type</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden md:table-cell">Size</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Downloads</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {downloads.map((dl) => (
                            <tr key={dl.id} className="hover:bg-surface/30 transition-colors">
                                <td className="px-4 py-3 text-sm font-medium">{dl.title}</td>
                                <td className="px-4 py-3">
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-surface text-muted-foreground uppercase">{dl.file_type}</span>
                                </td>
                                <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">{dl.file_size || "—"}</td>
                                <td className="px-4 py-3 text-sm font-mono text-primary">{dl.download_count}</td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        <button onClick={() => openEdit(dl)} className="text-xs text-primary hover:underline">Edit</button>
                                        <button onClick={() => handleDelete(dl.id)} disabled={isPending} className="text-xs text-red-400 hover:underline">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {downloads.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">No downloads yet. Click &quot;+ Add Download&quot; to create one.</p>
                )}
            </div>
        </div>
    );
}
