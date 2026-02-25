"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import type { Skill } from "@/lib/database.types";
import { createSkill, updateSkill, deleteSkill, reorderSkills } from "@/app/admin/actions/skills";
import { useConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useEffect } from "react";
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

export default function SkillsManager({
    skills,
    allowDragDrop = true,
    allowBulkActions = false,
}: {
    skills: Skill[];
    allowDragDrop?: boolean;
    allowBulkActions?: boolean;
}) {
    const [editing, setEditing] = useState<string | null>(null);
    const [showNew, setShowNew] = useState(false);
    const [loading, setLoading] = useState(false);
    const { dialog, confirm: confirmDelete } = useConfirmDialog();
    const { showToast } = useToast();

    async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const fd = new FormData(e.currentTarget);
        try {
            await createSkill({
                name: fd.get("name") as string,
                category: fd.get("category") as string,
                proficiency_level: parseInt(fd.get("proficiency_level") as string) || 3,
                years_of_experience: parseFloat(fd.get("years_of_experience") as string) || 0,
                order_index: parseInt(fd.get("order_index") as string) || 0,
            });
            setShowNew(false);
            showToast("Skill created successfully", "success");
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Failed to create skill", "error");
        }
        setLoading(false);
    }

    async function handleUpdate(e: React.FormEvent<HTMLFormElement>, id: string) {
        e.preventDefault();
        setLoading(true);
        const fd = new FormData(e.currentTarget);
        try {
            await updateSkill(id, {
                name: fd.get("name") as string,
                category: fd.get("category") as string,
                proficiency_level: parseInt(fd.get("proficiency_level") as string) || 3,
                years_of_experience: parseFloat(fd.get("years_of_experience") as string) || 0,
                order_index: parseInt(fd.get("order_index") as string) || 0,
            });
            setEditing(null);
            showToast("Skill updated successfully", "success");
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Failed to update skill", "error");
        }
        setLoading(false);
    }

    function handleDelete(id: string) {
        confirmDelete(
            "This skill will be permanently removed. This cannot be undone.",
            async () => {
                try {
                    await deleteSkill(id);
                    showToast("Skill deleted successfully", "success");
                } catch (err) {
                    showToast(err instanceof Error ? err.message : "Failed to delete skill", "error");
                }
            },
            { title: "Delete Skill?" }
        );
    }

    const [items, setItems] = useState(skills);

    useEffect(() => {
        setItems(skills);
    }, [skills]);

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

            // Optimistic update
            setItems(newItems);

            const orderedPayload = newItems.map((item: Skill, index: number) => ({
                id: item.id,
                sort_order: index + 1,
            }));

            try {
                await reorderSkills(orderedPayload);
                showToast("Skills reordered successfully", "success");
            } catch (err) {
                showToast("Failed to reorder skills", "error");
                setItems(skills);
            }
        }
    }

    return (
        <>
            {dialog}
            <div>
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold">Skills</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Manage your technical skills
                        </p>
                    </div>
                    <Button variant="primary" onClick={() => setShowNew(true)}>
                        + Add Skill
                    </Button>
                </div>

                {/* New Skill Form */}
                {showNew && (
                    <form
                        onSubmit={handleCreate}
                        className="glass rounded-xl p-5 mb-6 grid grid-cols-2 sm:grid-cols-6 gap-3 items-end"
                    >
                        <input name="name" placeholder="Skill name" className="admin-input" required />
                        <input name="category" placeholder="Category" className="admin-input" required />
                        <input name="proficiency_level" type="number" min="1" max="5" placeholder="Level (1-5)" className="admin-input" defaultValue="3" />
                        <input name="years_of_experience" type="number" step="0.5" placeholder="Years" className="admin-input" defaultValue="1" />
                        <input name="order_index" type="number" placeholder="Order" className="admin-input" defaultValue="0" />
                        <div className="flex gap-2">
                            <Button type="submit" variant="primary" size="sm" isLoading={loading}>Save</Button>
                            <Button type="button" variant="ghost" size="sm" onClick={() => setShowNew(false)}>Cancel</Button>
                        </div>
                    </form>
                )}

                {/* Skills Table */}
                <div className="glass rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border">
                                {allowBulkActions && (
                                    <th className="text-left p-4 font-medium text-muted-foreground w-8">
                                        <input type="checkbox" className="rounded border-border text-primary focus:ring-primary" />
                                    </th>
                                )}
                                <th className="text-left p-4 font-medium text-muted-foreground">Name</th>
                                <th className="text-left p-4 font-medium text-muted-foreground">Category</th>
                                <th className="text-left p-4 font-medium text-muted-foreground">Level</th>
                                <th className="text-left p-4 font-medium text-muted-foreground hidden sm:table-cell">Experience</th>
                                <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
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
                                    {items.map((skill) =>
                                        editing === skill.id ? (
                                            <tr key={skill.id} className="border-b border-border/50">
                                                <td colSpan={6} className="p-3">
                                                    <form
                                                        onSubmit={(e) => handleUpdate(e, skill.id)}
                                                        className="grid grid-cols-2 sm:grid-cols-6 gap-3 items-end"
                                                    >
                                                        <input name="name" className="admin-input" defaultValue={skill.name} required />
                                                        <input name="category" className="admin-input" defaultValue={skill.category} required />
                                                        <input name="proficiency_level" type="number" min="1" max="5" className="admin-input" defaultValue={skill.proficiency_level ?? 3} />
                                                        <input name="years_of_experience" type="number" step="0.5" className="admin-input" defaultValue={skill.years_of_experience ?? 0} />
                                                        <input name="order_index" type="number" className="admin-input" defaultValue={skill.order_index} />
                                                        <div className="flex gap-2">
                                                            <Button type="submit" variant="primary" size="sm" isLoading={loading}>Save</Button>
                                                            <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(null)}>Cancel</Button>
                                                        </div>
                                                    </form>
                                                </td>
                                            </tr>
                                        ) : (
                                            <SortableRow key={skill.id} id={skill.id} className="border-b border-border/50 hover:bg-surface/50 transition-colors" disabled={!allowDragDrop}>
                                                {allowBulkActions && (
                                                    <td className="p-4">
                                                        <input type="checkbox" className="rounded border-border text-primary focus:ring-primary" />
                                                    </td>
                                                )}
                                                <td className="p-4 font-medium">{skill.name}</td>
                                                <td className="p-4 text-muted-foreground">{skill.category}</td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                                                            <div className="h-full rounded-full bg-primary" style={{ width: `${((skill.proficiency_level ?? 0) / 5) * 100}%` }} />
                                                        </div>
                                                        <span className="text-xs text-muted-foreground">{skill.proficiency_level}/5</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-muted-foreground hidden sm:table-cell">{skill.years_of_experience}y</td>
                                                <td className="p-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button onClick={() => setEditing(skill.id)} className="text-xs px-2 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors">Edit</button>
                                                        <button onClick={() => handleDelete(skill.id)} className="text-xs px-2 py-1 rounded bg-danger/10 text-danger hover:bg-danger/20 transition-colors">Delete</button>
                                                    </div>
                                                </td>
                                            </SortableRow>
                                        )
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
