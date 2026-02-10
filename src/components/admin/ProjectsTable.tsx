"use client";

import { useState } from "react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { Project } from "@/lib/database.types";
import { deleteProject, toggleProjectStatus } from "@/app/admin/actions/projects";

export default function ProjectsTable({ projects }: { projects: Project[] }) {
    const [deleting, setDeleting] = useState<string | null>(null);

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this project?")) return;
        setDeleting(id);
        try {
            await deleteProject(id);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to delete");
        }
        setDeleting(null);
    }

    async function handleToggleStatus(id: string, currentStatus: string) {
        try {
            await toggleProjectStatus(id, currentStatus);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to update status");
        }
    }

    return (
        <div className="glass rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="text-left p-4 font-medium text-muted-foreground">
                                Title
                            </th>
                            <th className="text-left p-4 font-medium text-muted-foreground">
                                Status
                            </th>
                            <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">
                                Technologies
                            </th>
                            <th className="text-left p-4 font-medium text-muted-foreground hidden lg:table-cell">
                                Created
                            </th>
                            <th className="text-right p-4 font-medium text-muted-foreground">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((project) => (
                            <tr
                                key={project.id}
                                className="border-b border-border/50 hover:bg-surface/50 transition-colors"
                            >
                                <td className="p-4">
                                    <div>
                                        <div className="font-medium">{project.title}</div>
                                        <div className="text-xs text-muted-foreground">
                                            /{project.slug}
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <Badge
                                        variant={
                                            project.status === "published"
                                                ? "success"
                                                : project.status === "draft"
                                                    ? "warning"
                                                    : "outline"
                                        }
                                    >
                                        {project.status}
                                    </Badge>
                                </td>
                                <td className="p-4 hidden md:table-cell">
                                    <div className="flex flex-wrap gap-1">
                                        {project.technologies?.slice(0, 3).map((t) => (
                                            <span
                                                key={t}
                                                className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="p-4 hidden lg:table-cell text-muted-foreground">
                                    {new Date(project.created_at).toLocaleDateString()}
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() =>
                                                handleToggleStatus(project.id, project.status)
                                            }
                                            className="text-xs px-2 py-1 rounded bg-surface hover:bg-surface-hover border border-border transition-colors"
                                            title={
                                                project.status === "published"
                                                    ? "Unpublish"
                                                    : "Publish"
                                            }
                                        >
                                            {project.status === "published" ? "Unpublish" : "Publish"}
                                        </button>
                                        <Link
                                            href={`/admin/projects/${project.id}/edit`}
                                            className="text-xs px-2 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                        >
                                            Edit
                                        </Link>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(project.id)}
                                            isLoading={deleting === project.id}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {projects.length === 0 && (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="p-8 text-center text-muted-foreground"
                                >
                                    No projects yet. Create your first one!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
