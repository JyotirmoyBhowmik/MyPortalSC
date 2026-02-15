"use client";

import { useState, useTransition, useEffect } from "react";
import { createBlogPost, updateBlogPost, deleteBlogPost } from "@/app/admin/actions/enterprise";
import RichTextEditor from "./RichTextEditor";

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

    const [editorContent, setEditorContent] = useState("");

    // Sync editor content when modal opens or editing target changes
    useEffect(() => {
        if (showModal) {
            setEditorContent(editing ? editing.content : "");
        }
    }, [showModal, editing]);

    // Better: use useEffect to sync when editing changes
    // Actually, simple key trick on the modal or form is easier to reset state.

    return (
        <div>
            {/* ... existing code ... */}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="glass rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
                        <h2 className="text-lg font-bold mb-4">{editing ? "Edit Post" : "New Post"}</h2>
                        <form action={handleSubmit} className="space-y-4">
                            <input name="title" defaultValue={editing?.title} placeholder="Title *" required className="w-full px-4 py-2 bg-surface rounded-lg border border-border text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none" />
                            <input name="excerpt" defaultValue={editing?.excerpt ?? ""} placeholder="Excerpt" className="w-full px-4 py-2 bg-surface rounded-lg border border-border text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none" />

                            {/* Rich Text Editor */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-muted-foreground ml-1">Content</label>
                                <RichTextEditor
                                    content={editing ? editing.content : ""}
                                    onChange={(html) => setEditorContent(html)}
                                />
                                <input type="hidden" name="content" value={editorContent || (editing?.content ?? "")} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <input name="category" defaultValue={editing?.category ?? "general"} placeholder="Category" className="px-4 py-2 bg-surface rounded-lg border border-border text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none" />
                                <input name="reading_time" type="number" defaultValue={editing?.reading_time ?? 5} placeholder="Reading time (min)" className="px-4 py-2 bg-surface rounded-lg border border-border text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none" />
                            </div>
                            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                                <input type="hidden" name="is_published" value="false" />
                                <input type="checkbox" name="is_published" value="true" defaultChecked={editing?.is_published} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                                Publish immediately
                            </label>
                            <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
                                <button type="submit" disabled={isPending} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:bg-primary-hover disabled:opacity-50 transition-all shadow-lg shadow-primary/20">
                                    {isPending ? "Saving..." : "Save Post"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
