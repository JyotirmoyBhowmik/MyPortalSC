"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { updateProject } from "@/app/admin/actions/projects";
import type { Project } from "@/lib/database.types";

export default function EditProjectForm({ project }: { project: Project }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);

        try {
            await updateProject(project.id, {
                title: formData.get("title") as string,
                slug: (formData.get("title") as string)
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-|-$/g, ""),
                short_description: formData.get("short_description") as string,
                detailed_description: formData.get("detailed_description") as string,
                status: formData.get("status") as "draft" | "published" | "archived",
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
            });
            router.push("/admin/projects");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update");
        }
        setLoading(false);
    }

    return (
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
                <label className="block text-sm font-medium mb-1.5">Title</label>
                <input
                    name="title"
                    className="admin-input"
                    defaultValue={project.title}
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1.5">
                    Short Description
                </label>
                <input
                    name="short_description"
                    className="admin-input"
                    defaultValue={project.short_description || ""}
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
                    defaultValue={project.detailed_description || ""}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1.5">Status</label>
                    <select
                        name="status"
                        className="admin-input"
                        defaultValue={project.status}
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
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
                        defaultValue={project.order_index}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1.5">Domain</label>
                <input
                    name="domain"
                    className="admin-input"
                    defaultValue={project.domain?.join(", ") || ""}
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1.5">Technologies</label>
                <input
                    name="technologies"
                    className="admin-input"
                    defaultValue={project.technologies?.join(", ") || ""}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1.5">Start Date</label>
                    <input
                        name="start_date"
                        type="date"
                        className="admin-input"
                        defaultValue={project.start_date || ""}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1.5">End Date</label>
                    <input
                        name="end_date"
                        type="date"
                        className="admin-input"
                        defaultValue={project.end_date || ""}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1.5">GitHub URL</label>
                    <input
                        name="github_url"
                        type="url"
                        className="admin-input"
                        defaultValue={project.github_url || ""}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1.5">Live URL</label>
                    <input
                        name="live_url"
                        type="url"
                        className="admin-input"
                        defaultValue={project.live_url || ""}
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-border">
                <Button type="submit" variant="primary" isLoading={loading}>
                    Save Changes
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
    );
}
