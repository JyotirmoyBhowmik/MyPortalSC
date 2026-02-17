"use client";

import { useState, useTransition, useEffect } from "react";
import { createTestimonial, updateTestimonial, deleteTestimonial, updateTestimonialOrder } from "@/app/admin/actions/testimonials";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableRow } from "./SortableRow";

interface Testimonial {
    id: string;
    name: string;
    role: string;
    organization: string;
    quote_en: string;
    quote_hi: string | null;
    quote_bn: string | null;
    featured: boolean;
    is_published: boolean;
    sort_order: number;
}


export default function TestimonialsManager({ testimonials }: { testimonials: Testimonial[] }) {
    const [items, setItems] = useState(testimonials);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Testimonial | null>(null);
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

    useEffect(() => { setItems(testimonials); }, [testimonials]);

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
                    await updateTestimonialOrder(updates);
                });

                return newItems;
            });
        }
    }

    function openAdd() { setEditing(null); setShowModal(true); }
    function openEdit(t: Testimonial) { setEditing(t); setShowModal(true); }

    function handleSubmit(formData: FormData) {
        startTransition(async () => {
            const result = editing
                ? await updateTestimonial(editing.id, formData)
                : await createTestimonial(formData);
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
        if (!confirm("Delete this testimonial?")) return;
        startTransition(async () => {
            await deleteTestimonial(id);
            setMessage({ type: "success", text: "Deleted!" });
            setTimeout(() => setMessage(null), 2000);
        });
    }


    return (
        <div>
            {/* ... (keep message) */}

            <div className="flex justify-end mb-4">
                <button onClick={openAdd} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">
                    + Add Testimonial
                </button>
            </div>

            {/* Table */}
            <div className="glass rounded-xl overflow-hidden">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <table className="w-full">
                        <thead className="bg-surface/50">
                            <tr>
                                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Name</th>
                                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden md:table-cell">Organization</th>
                                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Featured</th>
                                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Status</th>
                                <th className="text-right text-xs font-semibold text-muted-foreground px-4 py-3">Actions</th>
                                <th className="w-8"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            <SortableContext items={items} strategy={verticalListSortingStrategy}>
                                {items.map((t) => (
                                    <SortableRow key={t.id} id={t.id} className="hover:bg-surface/30 transition-colors bg-surface/10">
                                        <td className="px-4 py-3">
                                            <div className="text-sm font-medium">{t.name}</div>
                                            <div className="text-xs text-muted-foreground">{t.role}</div>
                                        </td>
                                        <td className="px-4 py-3 hidden md:table-cell text-sm text-muted-foreground">{t.organization}</td>
                                        <td className="px-4 py-3">
                                            {t.featured && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400">⭐ Featured</span>}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${t.is_published ? "bg-green-500/15 text-green-400" : "bg-gray-500/15 text-gray-400"}`}>
                                                {t.is_published ? "Published" : "Draft"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button onClick={() => openEdit(t)} className="text-xs text-primary hover:underline mr-3">Edit</button>
                                            <button onClick={() => handleDelete(t.id)} className="text-xs text-red-400 hover:underline">Delete</button>
                                        </td>
                                    </SortableRow>
                                ))}
                            </SortableContext>
                        </tbody>
                    </table>
                </DndContext>
                {items.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">No testimonials yet.</p>
                )}
            </div>
            {testimonials.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">No testimonials yet.</p>
            )}

            {/* Modal */}
            {
                showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="glass rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto mx-4">
                            <h2 className="text-lg font-bold mb-4">{editing ? "Edit Testimonial" : "Add Testimonial"}</h2>
                            <form action={handleSubmit} className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <input name="name" defaultValue={editing?.name} placeholder="Name" required className="col-span-2 px-3 py-2 bg-surface rounded-lg border border-border text-sm text-foreground" />
                                    <input name="role" defaultValue={editing?.role} placeholder="Role / Title" required className="px-3 py-2 bg-surface rounded-lg border border-border text-sm text-foreground" />
                                    <input name="organization" defaultValue={editing?.organization} placeholder="Organization" required className="px-3 py-2 bg-surface rounded-lg border border-border text-sm text-foreground" />
                                </div>
                                <textarea name="quote_en" defaultValue={editing?.quote_en} placeholder="Quote (English) *" required rows={3} className="w-full px-3 py-2 bg-surface rounded-lg border border-border text-sm text-foreground" />
                                <textarea name="quote_hi" defaultValue={editing?.quote_hi ?? ""} placeholder="Quote (Hindi)" rows={2} className="w-full px-3 py-2 bg-surface rounded-lg border border-border text-sm text-foreground" />
                                <textarea name="quote_bn" defaultValue={editing?.quote_bn ?? ""} placeholder="Quote (Bengali)" rows={2} className="w-full px-3 py-2 bg-surface rounded-lg border border-border text-sm text-foreground" />
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 text-sm">
                                        <input type="hidden" name="featured" value="false" />
                                        <input type="checkbox" name="featured" value="true" defaultChecked={editing?.featured} className="rounded" />
                                        Featured
                                    </label>
                                    <label className="flex items-center gap-2 text-sm">
                                        <input type="hidden" name="is_published" value="false" />
                                        <input type="checkbox" name="is_published" value="true" defaultChecked={editing?.is_published ?? true} className="rounded" />
                                        Published
                                    </label>
                                    <input name="sort_order" type="number" defaultValue={editing?.sort_order ?? 0} className="w-20 px-3 py-2 bg-surface rounded-lg border border-border text-sm text-foreground" placeholder="Order" />
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
                )
            }
        </div >
    );
}
