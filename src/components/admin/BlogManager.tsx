"use client";

import { useState, useTransition } from "react";
import { createBlogPost, updateBlogPost, deleteBlogPost } from "@/app/admin/actions/enterprise";

interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    category: string;
    reading_time: number;
    is_published: boolean;
    published_at: string | null;
}

export default function BlogManager({ posts }: { posts: Post[] }) {
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Post | null>(null);
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

    function handleSubmit(formData: FormData) {
        startTransition(async () => {
            const result = editing
                ? await updateBlogPost(editing.id, formData)
                : await createBlogPost(formData);
            if (result.success) {
                setMessage({ type: "success", text: editing ? "Updated!" : "Created!" });
                setShowModal(false);
            } else {
                setMessage({ type: "error", text: result.error || "Failed" });
            }
            setTimeout(() => setMessage(null), 2000);
        });
    }

    function handleDelete(id: string) {
        if (!confirm("Delete this post?")) return;
        startTransition(async () => {
            await deleteBlogPost(id);
            setMessage({ type: "success", text: "Deleted!" });
            setTimeout(() => setMessage(null), 2000);
        });
    }

    return (
        <div>
            {message && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium shadow-lg ${message.type === "success" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
                    {message.text}
                </div>
            )}

            <div className="flex justify-end mb-4">
                <button onClick={() => { setEditing(null); setShowModal(true); }} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">
                    + New Post
                </button>
            </div>

            <div className="glass rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-surface/50">
                        <tr>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Title</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden md:table-cell">Category</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Status</th>
                            <th className="text-right text-xs font-semibold text-muted-foreground px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {posts.map((p) => (
                            <tr key={p.id} className="hover:bg-surface/30 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="text-sm font-medium">{p.title}</div>
                                    <div className="text-xs text-muted-foreground">/{p.slug}</div>
                                </td>
                                <td className="px-4 py-3 hidden md:table-cell">
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary uppercase">{p.category}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${p.is_published ? "bg-green-500/15 text-green-400" : "bg-gray-500/15 text-gray-400"}`}>
                                        {p.is_published ? "Published" : "Draft"}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button onClick={() => { setEditing(p); setShowModal(true); }} className="text-xs text-primary hover:underline mr-3">Edit</button>
                                    <button onClick={() => handleDelete(p.id)} className="text-xs text-red-400 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {posts.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No blog posts yet.</p>}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="glass rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
                        <h2 className="text-lg font-bold mb-4">{editing ? "Edit Post" : "New Post"}</h2>
                        <form action={handleSubmit} className="space-y-3">
                            <input name="title" defaultValue={editing?.title} placeholder="Title *" required className="w-full px-3 py-2 bg-surface rounded-lg border border-border text-sm text-foreground" />
                            <input name="excerpt" defaultValue={editing?.excerpt ?? ""} placeholder="Excerpt" className="w-full px-3 py-2 bg-surface rounded-lg border border-border text-sm text-foreground" />
                            <textarea name="content" defaultValue={editing?.content} placeholder="Content (HTML) *" required rows={10} className="w-full px-3 py-2 bg-surface rounded-lg border border-border text-sm text-foreground font-mono" />
                            <div className="grid grid-cols-2 gap-3">
                                <input name="category" defaultValue={editing?.category ?? "general"} placeholder="Category" className="px-3 py-2 bg-surface rounded-lg border border-border text-sm text-foreground" />
                                <input name="reading_time" type="number" defaultValue={editing?.reading_time ?? 5} placeholder="Reading time (min)" className="px-3 py-2 bg-surface rounded-lg border border-border text-sm text-foreground" />
                            </div>
                            <label className="flex items-center gap-2 text-sm">
                                <input type="hidden" name="is_published" value="false" />
                                <input type="checkbox" name="is_published" value="true" defaultChecked={editing?.is_published} />
                                Publish
                            </label>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
                                <button type="submit" disabled={isPending} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary-hover disabled:opacity-50">
                                    {isPending ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
