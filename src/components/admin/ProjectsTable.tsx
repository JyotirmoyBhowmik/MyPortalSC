"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { Project } from "@/lib/database.types";
import { deleteProject, toggleProjectStatus, reorderProjects } from "@/app/admin/actions/projects";
import { useConfirmDialog } from "@/components/ui/ConfirmDialog";

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableRow } from "@/components/admin/SortableRow";
import { useToast } from "@/components/ui/ToastProvider";

export default function ProjectsTable({
    projects: initialProjects,
    allowDragDrop = true,
    allowBulkActions = false,
}: {
    projects: Project[];
    allowDragDrop?: boolean;
    allowBulkActions?: boolean;
}) {
    const [deleting, setDeleting] = useState<string | null>(null);
    const [items, setItems] = useState(initialProjects);
    const { dialog, confirm: confirmDelete } = useConfirmDialog();
    const { showToast } = useToast();

    useEffect(() => {
        setItems(initialProjects);
    }, [initialProjects]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    async function handleDragEnd(event: DragEndEvent) {
        if (!allowDragDrop) return;
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((i) => i.id === active.id);
            const newIndex = items.findIndex((i) => i.id === over.id);

            const newItems = arrayMove(items, oldIndex, newIndex);

            // Optimistic UI update
            setItems(newItems);

            // Re-calculate all sort_order indices. Lowest index = Highest order (e.g. 1st item = order 10)
            const orderedPayload = newItems.map((item: Project, index: number) => ({
                id: item.id,
                sort_order: index + 1,
            }));

            try {
                await reorderProjects(orderedPayload);
                showToast("Project order updated", "success");
            } catch (err) {
                console.error("Failed to reorder projects:", err);
                showToast("Failed to reorder projects", "error");
                // Revert on failure
                setItems(initialProjects);
            }
        }
    }

    function handleDelete(id: string) {
        confirmDelete(
            "This project will be permanently deleted. This action cannot be undone.",
            async () => {
                setDeleting(id);
                try {
                    await deleteProject(id);
                    showToast("Project deleted", "success");
                } catch (err) {
                    showToast(err instanceof Error ? err.message : "Failed to delete", "error");
                }
                setDeleting(null);
            },
            { title: "Delete Project?" }
        );
    }

    async function handleToggleStatus(id: string, currentStatus: string) {
        try {
            await toggleProjectStatus(id, currentStatus);
            showToast(`Status updated to ${currentStatus === "published" ? "draft" : "published"}`, "success");
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Failed to update status", "error");
        }
    }

    return (
        <>
            {dialog}
            <div className="glass rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border">
                                {allowBulkActions && (
                                    <th className="text-left p-4 font-medium text-muted-foreground w-8">
                                        <input type="checkbox" className="rounded border-border text-primary focus:ring-primary" />
                                    </th>
                                )}
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
                                {allowDragDrop && <th className="text-left p-4 font-medium text-muted-foreground w-8"></th>}
                            </tr>
                        </thead>
                        <tbody>
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext items={items} strategy={verticalListSortingStrategy}>
                                    {items.map((project) => (
                                        <SortableRow
                                            key={project.id}
                                            id={project.id}
                                            className="border-b border-border/50 hover:bg-surface/50 transition-colors"
                                            disabled={!allowDragDrop}
                                        >
                                            {allowBulkActions && (
                                                <td className="p-4">
                                                    <input type="checkbox" className="rounded border-border text-primary focus:ring-primary" />
                                                </td>
                                            )}
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
                                        </SortableRow>
                                    ))}
                                    {items.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="p-8 text-center text-muted-foreground"
                                            >
                                                No projects yet. Create your first one!
                                            </td>
                                        </tr>
                                    )}
                                </SortableContext>
                            </DndContext>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
