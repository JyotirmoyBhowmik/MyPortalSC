"use client";

import { useState, useTransition, useEffect } from "react";
import { createBlogPost, updateBlogPost, deleteBlogPost } from "@/app/admin/actions/enterprise";
import RichTextEditor from "./RichTextEditor";

import MediaPickerModal from "./MediaPickerModal";

interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    cover_image_url: string | null;
    category: string;
    reading_time: number;
    is_published: boolean;
    published_at: string | null;
}

export default function BlogManager({ posts }: { posts: Post[] }) {
    const [showModal, setShowModal] = useState(false);
    const [showCoverPicker, setShowCoverPicker] = useState(false);
    const [coverImage, setCoverImage] = useState("");
    const [editing, setEditing] = useState<Post | null>(null);
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

    // ... (keep handleSubmit and handleDelete)

    const [editorContent, setEditorContent] = useState("");

    // Sync editor content and cover image when modal opens
    useEffect(() => {
        if (showModal) {
            setEditorContent(editing ? editing.content : "");
            setCoverImage(editing?.cover_image_url || "");
        }
    }, [showModal, editing]);

    return (
        <div>
            {/* ... (keep message and create button) */}

            {/* ... (keep table) */}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="glass rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
                        <h2 className="text-lg font-bold mb-4">{editing ? "Edit Post" : "New Post"}</h2>
                        <form action={handleSubmit} className="space-y-4">
                            <input name="title" defaultValue={editing?.title} placeholder="Title *" required className="w-full px-4 py-2 bg-surface rounded-lg border border-border text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none" />
                            <input name="slug" defaultValue={editing?.slug} placeholder="Slug (optional)" className="w-full px-4 py-2 bg-surface rounded-lg border border-border text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none" />

                            {/* Cover Image Picker */}
                            <div className="flex gap-4 items-center">
                                <div className="flex-1">
                                    <div className="flex gap-2">
                                        <input
                                            name="cover_image_url"
                                            value={coverImage}
                                            onChange={(e) => setCoverImage(e.target.value)}
                                            placeholder="Cover Image URL"
                                            className="w-full px-4 py-2 bg-surface rounded-lg border border-border text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCoverPicker(true)}
                                            className="px-3 py-2 bg-muted text-muted-foreground hover:text-foreground rounded-lg border border-border transition-colors"
                                        >
                                            📷 Select
                                        </button>
                                    </div>
                                    {coverImage && (
                                        <div className="mt-2 h-24 w-40 relative rounded-lg overflow-hidden border border-border">
                                            <img src={coverImage} alt="Cover" className="object-cover w-full h-full" />
                                        </div>
                                    )}
                                </div>
                            </div>

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

            {showCoverPicker && (
                <MediaPickerModal
                    onSelect={(url) => setCoverImage(url)}
                    onClose={() => setShowCoverPicker(false)}
                />
            )}
        </div>
    );
}
