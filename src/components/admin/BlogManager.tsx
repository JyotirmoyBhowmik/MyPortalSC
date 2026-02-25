"use client";

import { useTransition, useState, useEffect } from "react";
import { DatePicker } from "./DatePicker";
import { createBlogPost, updateBlogPost, deleteBlogPost } from "@/app/admin/actions/enterprise";
import RichTextEditor from "./RichTextEditor";
import MediaPickerModal from "./MediaPickerModal";
import { useConfirmDialog } from "@/components/ui/ConfirmDialog";

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
    const { dialog, confirm: confirmDelete } = useConfirmDialog();
    const [publishedAt, setPublishedAt] = useState<Date | undefined>(undefined);
    const [editorContent, setEditorContent] = useState("");

    function handleSubmit(formData: FormData) {
        if (publishedAt) {
            formData.set("published_at", publishedAt.toISOString());
        }

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
        confirmDelete("This blog post will be permanently deleted.", async () => {
            startTransition(async () => {
                await deleteBlogPost(id);
                setMessage({ type: "success", text: "Deleted!" });
                setTimeout(() => setMessage(null), 2000);
            });
        }, { title: "Delete Post?" });
    }

    // Sync editor content and cover image when modal opens
    useEffect(() => {
        if (showModal) {
            setEditorContent(editing ? editing.content : "");
            setCoverImage(editing?.cover_image_url || "");
            setPublishedAt(editing?.published_at ? new Date(editing.published_at) : undefined);
        }
    }, [showModal, editing]);

    return (
        <>
            {dialog}
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
                            {posts.map((post) => (
                                <tr key={post.id} className="hover:bg-surface/30 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="text-sm font-medium">{post.title}</div>
                                        <div className="text-xs text-muted-foreground hidden sm:block">{post.slug}</div>
                                    </td>
                                    <td className="px-4 py-3 hidden md:table-cell text-sm text-muted-foreground capitalize">{post.category}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${post.is_published ? "bg-green-500/15 text-green-400" : "bg-gray-500/15 text-gray-400"}`}>
                                            {post.is_published ? "Published" : "Draft"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button onClick={() => { setEditing(post); setShowModal(true); }} className="text-xs text-primary hover:underline mr-3">Edit</button>
                                        <button onClick={() => handleDelete(post.id)} className="text-xs text-red-400 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {posts.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No posts yet.</p>}
                </div>

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
                                        content={editing ? (editing.content || "") : ""}
                                        onChange={(html: string) => setEditorContent(html)}
                                    />
                                    <input type="hidden" name="content" value={editorContent || (editing?.content ?? "")} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <input name="category" defaultValue={editing?.category ?? "general"} placeholder="Category" className="px-4 py-2 bg-surface rounded-lg border border-border text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none" />
                                    <input name="reading_time" type="number" defaultValue={editing?.reading_time ?? 5} placeholder="Reading time (min)" className="px-4 py-2 bg-surface rounded-lg border border-border text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none" />
                                </div>

                                <div className="flex items-center gap-4 p-3 bg-surface/50 rounded-lg border border-border">
                                    <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                                        <input type="checkbox" name="is_published" value="true" defaultChecked={editing?.is_published} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                                        Publish
                                    </label>

                                    <div className="h-4 w-px bg-border mx-2"></div>

                                    <div className="flex items-center gap-2 flex-1">
                                        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">Schedule:</span>
                                        <DatePicker date={publishedAt} setDate={setPublishedAt} className="flex-1" />
                                    </div>
                                </div>

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
        </>
    );
}
