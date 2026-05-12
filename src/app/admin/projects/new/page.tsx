"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { createProject } from "@/app/admin/actions/projects";
import ImageUpload from "@/components/admin/ImageUpload";
import DocumentUpload from "@/components/admin/DocumentUpload";

export default function NewProjectPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [image, setImage] = useState<string | null>(null);
    const [documents, setDocuments] = useState<{ url: string, name: string }[]>([]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);

        try {
            await createProject({
                title: formData.get("title") as string,
                slug: (formData.get("title") as string)
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-|-$/g, ""),
                short_description: formData.get("short_description") as string,
                detailed_description: formData.get("detailed_description") as string,
                status: formData.get("status") as "draft" | "published",
                domain: (formData.get("domain") as string)
                    .split(",")
                    .map((d) => d.trim())
                    .filter(Boolean),
                technologies: (formData.get("technologies") as string)
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
                start_date: (formData.get("start_date") as string) || null,
                end_date: (formData.get("end_date") as string) || null,
                github_url: (formData.get("github_url") as string) || null,
                live_url: (formData.get("live_url") as string) || null,
                order_index: parseInt(formData.get("order_index") as string) || 0,
                featured_image_url: image, // Add image
                documents: documents as any, // Add documents
            } as any);
            router.push("/admin/projects");
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to create project"
            );
        }
        setLoading(false);
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">New Project</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Add a new project to your portfolio
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="glass rounded-xl p-6 space-y-6 max-w-2xl"
            >
                {error && (
                    <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium mb-1.5">
                        Title <span className="text-danger">*</span>
                    </label>
                    <input
                        name="title"
                        className="admin-input"
                        placeholder="My Awesome Project"
                        required
                    />
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium mb-3">
                        Featured Image
                    </label>
                    <ImageUpload
                        value={image}
                        onChange={setImage}
                        onRemove={() => setImage(null)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1.5">
                        Short Description
                    </label>
                    <input
                        name="short_description"
                        className="admin-input"
                        placeholder="A brief overview of the project"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1.5">
                        Detailed Description
                    </label>
                    <textarea
                        name="detailed_description"
                        rows={6}
                        className="admin-input resize-none"
                        placeholder="In-depth description of the project, technologies used, challenges, and outcomes…"
                    />
                </div>

                {/* Document Upload */}
                <div>
                    <label className="block text-sm font-medium mb-3">
                        Project Documents
                    </label>
                    <DocumentUpload
                        value={documents}
                        onChange={setDocuments}
                        onRemove={(index) => {
                            const newDocs = [...documents];
                            newDocs.splice(index, 1);
                            setDocuments(newDocs);
                        }}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1.5">Status</label>
                        <select name="status" className="admin-input">
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1.5">
                            Order Index
                        </label>
                        <input
                            name="order_index"
                            type="number"
                            className="admin-input"
                            defaultValue="0"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1.5">
                        Domain <span className="text-xs text-muted-foreground">(comma-separated)</span>
                    </label>
                    <input
                        name="domain"
                        className="admin-input"
                        placeholder="Web Development, SaaS, Analytics"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1.5">
                        Technologies <span className="text-xs text-muted-foreground">(comma-separated)</span>
                    </label>
                    <input
                        name="technologies"
                        className="admin-input"
                        placeholder="Next.js, TypeScript, Supabase, Tailwind CSS"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1.5">
                            Start Date
                        </label>
                        <input name="start_date" type="date" className="admin-input" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1.5">
                            End Date
                        </label>
                        <input name="end_date" type="date" className="admin-input" />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1.5">
                            GitHub URL
                        </label>
                        <input
                            name="github_url"
                            type="url"
                            className="admin-input"
                            placeholder="https://github.com/user/repo"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1.5">
                            Live URL
                        </label>
                        <input
                            name="live_url"
                            type="url"
                            className="admin-input"
                            placeholder="https://myproject.com"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <Button type="submit" variant="primary" isLoading={loading}>
                        Create Project
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}
