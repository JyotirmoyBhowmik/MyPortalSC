"use client";

import { useState, useTransition, useEffect } from "react";
import { createTimelineEntry, updateTimelineEntry, deleteTimelineEntry, updateTimelineOrder } from "@/app/admin/actions/testimonials";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableRow } from "./SortableRow";
import { useConfirmDialog } from "@/components/ui/ConfirmDialog";

interface TimelineEntry {
    id: string;
    year_start: number;
    year_end: number | null;
    title_en: string;
    title_hi: string | null;
    title_bn: string | null;
    organization: string;
    description_en: string | null;
    description_hi: string | null;
    description_bn: string | null;
    entry_type: string;
    sort_order: number;
    is_published: boolean;
}

const entryTypes = ["role", "milestone", "education", "award"];

export default function TimelineManager({ entries }: { entries: TimelineEntry[] }) {
    const [items, setItems] = useState(entries);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<TimelineEntry | null>(null);
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
    const { dialog, confirm: confirmDelete } = useConfirmDialog();

    useEffect(() => { setItems(entries); }, [entries]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor)
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (active.id !== over?.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over?.id);
                const newItems = arrayMove(items, oldIndex, newIndex);

                // Update order in backend
                const updates = newItems.map((item, index) => ({
                    id: item.id,
                    sort_order: index,
                }));
                startTransition(async () => {
                    await updateTimelineOrder(updates);
                });

                return newItems;
            });
        }
    }

    // ... (keep handleSubmit and handleDelete)

    function handleSubmit(formData: FormData) {
        startTransition(async () => {
            const result = editing
                ? await updateTimelineEntry(editing.id, formData)
                : await createTimelineEntry(formData);
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
        confirmDelete("This timeline entry will be permanently deleted.", async () => {
            startTransition(async () => {
                await deleteTimelineEntry(id);
                setMessage({ type: "success", text: "Deleted!" });
                setTimeout(() => setMessage(null), 2000);
            });
        }, { title: "Delete Entry?" });
    }

    const typeColors: Record<string, string> = {
        role: "bg-primary/15 text-primary",
        milestone: "bg-amber-500/15 text-amber-400",
        education: "bg-violet-500/15 text-violet-400",
        award: "bg-emerald-500/15 text-emerald-400",
    };

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
                        + Add Entry
                    </button>
                </div>

                <div className="glass rounded-xl overflow-hidden">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <table className="w-full">
                            <thead className="bg-surface/50">
                                <tr>
                                    <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Year</th>
                                    <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Title</th>
                                    <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden md:table-cell">Organization</th>
                                    <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Type</th>
                                    <th className="text-right text-xs font-semibold text-muted-foreground px-4 py-3">Actions</th>
                                    <th className="w-8"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                <SortableContext items={items} strategy={verticalListSortingStrategy}>
                                    {items.map((e) => (
                                        <SortableRow key={e.id} id={e.id} className="hover:bg-surface/30 transition-colors">
                                            <td className="px-4 py-3 text-sm font-mono">{e.year_start}{e.year_end ? `–${e.year_end}` : "–Now"}</td>
                                            <td className="px-4 py-3 text-sm font-medium">{e.title_en}</td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{e.organization}</td>
                                            <td className="px-4 py-3">
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${typeColors[e.entry_type] || "bg-gray-500/15 text-gray-400"}`}>
                                                    {e.entry_type}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button onClick={() => { setEditing(e); setShowModal(true); }} className="text-xs text-primary hover:underline mr-3">Edit</button>
                                                <button onClick={() => handleDelete(e.id)} className="text-xs text-red-400 hover:underline">Delete</button>
                                            </td>
                                        </SortableRow>
                                    ))}
                                </SortableContext>
                            </tbody>
                        </table>
                    </DndContext>
                    {items.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No timeline entries yet.</p>}
                </div>

                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="glass rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto mx-4">
                            <h2 className="text-lg font-bold mb-4">{editing ? "Edit Entry" : "Add Entry"}</h2>
                            <form action={handleSubmit} className="space-y-3">
                                <div className="grid grid-cols-3 gap-3">
                                    <input name="year_start" type="number" defaultValue={editing?.year_start ?? 2024} placeholder="Start Year" required className="px-3 py-2 bg-surface rounded-lg border border-border text-sm text-foreground" />
                                    <input name="year_end" type="number" defaultValue={editing?.year_end ?? ""} placeholder="End Year" className="px-3 py-2 bg-surface rounded-lg border border-border text-sm text-foreground" />
                                    <select name="entry_type" defaultValue={editing?.entry_type ?? "role"} className="px-3 py-2 bg-surface rounded-lg border border-border text-sm text-foreground">
                                        {entryTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <input name="organization" defaultValue={editing?.organization} placeholder="Organization" required className="w-full px-3 py-2 bg-surface rounded-lg border border-border text-sm text-foreground" />
                                <input name="title_en" defaultValue={editing?.title_en} placeholder="Title (English) *" required className="w-full px-3 py-2 bg-surface rounded-lg border border-border text-sm text-foreground" />
                                <input name="title_hi" defaultValue={editing?.title_hi ?? ""} placeholder="Title (Hindi)" className="w-full px-3 py-2 bg-surface rounded-lg border border-border text-sm text-foreground" />
                                <input name="title_bn" defaultValue={editing?.title_bn ?? ""} placeholder="Title (Bengali)" className="w-full px-3 py-2 bg-surface rounded-lg border border-border text-sm text-foreground" />
                                <textarea name="description_en" defaultValue={editing?.description_en ?? ""} placeholder="Description (English)" rows={2} className="w-full px-3 py-2 bg-surface rounded-lg border border-border text-sm text-foreground" />
                                <textarea name="description_hi" defaultValue={editing?.description_hi ?? ""} placeholder="Description (Hindi)" rows={2} className="w-full px-3 py-2 bg-surface rounded-lg border border-border text-sm text-foreground" />
                                <textarea name="description_bn" defaultValue={editing?.description_bn ?? ""} placeholder="Description (Bengali)" rows={2} className="w-full px-3 py-2 bg-surface rounded-lg border border-border text-sm text-foreground" />
                                <div className="flex gap-4 items-center">
                                    <input name="sort_order" type="number" defaultValue={editing?.sort_order ?? 0} className="w-20 px-3 py-2 bg-surface rounded-lg border border-border text-sm text-foreground" placeholder="Order" />
                                    <label className="flex items-center gap-2 text-sm">
                                        <input type="checkbox" name="is_published" value="true" defaultChecked={editing?.is_published ?? true} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                                        Published
                                    </label>
                                </div>
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
        </>
    );
}
