"use client";

import { useTransition, useState } from "react";
import { createSpeakingEvent, updateSpeakingEvent, deleteSpeakingEvent } from "@/app/admin/actions/speaking";
import { useConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/ToastProvider";

interface SpeakingEvent {
    id: string;
    title: string;
    event_name: string;
    event_date: string | null;
    location: string | null;
    event_type: string;
    description: string | null;
    slides_url: string | null;
    video_url: string | null;
    is_published: boolean;
}

export default function SpeakingManager({ events }: { events: SpeakingEvent[] }) {
    const [isPending, startTransition] = useTransition();
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<SpeakingEvent | null>(null);
    const { dialog, confirm: confirmDelete } = useConfirmDialog();
    const { showToast } = useToast();

    function handleSubmit(formData: FormData) {
        startTransition(async () => {
            try {
                if (editing) {
                    await updateSpeakingEvent(editing.id, formData);
                    showToast("Event updated successfully", "success");
                } else {
                    await createSpeakingEvent(formData);
                    showToast("Event created successfully", "success");
                }
                setShowForm(false);
                setEditing(null);
            } catch (err) {
                showToast(err instanceof Error ? err.message : "Failed to save event", "error");
            }
        });
    }

    function handleDelete(id: string) {
        confirmDelete("This speaking event will be permanently deleted.", async () => {
            startTransition(async () => {
                try {
                    await deleteSpeakingEvent(id);
                    showToast("Event deleted successfully", "success");
                } catch (err) {
                    showToast(err instanceof Error ? err.message : "Failed to delete event", "error");
                }
            });
        }, { title: "Delete Speaking Event?" });
    }

    function openEdit(e: SpeakingEvent) {
        setEditing(e);
        setShowForm(true);
    }

    return (
        <>
            {dialog}
            <div>
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Speaking Events</h1>
                        <p className="text-sm text-muted-foreground mt-1">Manage conferences, webinars, and workshops.</p>
                    </div>
                    <button
                        onClick={() => { setEditing(null); setShowForm(!showForm); }}
                        className="px-4 py-2 rounded-lg gradient-bg text-white text-sm font-medium shadow-lg shadow-primary/20"
                    >
                        {showForm ? "Cancel" : "+ Add Event"}
                    </button>
                </div>

                {showForm && (
                    <form action={handleSubmit} className="glass rounded-xl p-6 mb-8 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Title *</label>
                                <input name="title" className="admin-input" required defaultValue={editing?.title || ""} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Event Name *</label>
                                <input name="event_name" className="admin-input" required defaultValue={editing?.event_name || ""} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Date</label>
                                <input name="event_date" type="date" className="admin-input" defaultValue={editing?.event_date || ""} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Location</label>
                                <input name="location" className="admin-input" placeholder="City, Country" defaultValue={editing?.location || ""} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Type</label>
                                <select name="event_type" className="admin-input" defaultValue={editing?.event_type || "conference"}>
                                    <option value="conference">Conference</option>
                                    <option value="webinar">Webinar</option>
                                    <option value="panel">Panel</option>
                                    <option value="workshop">Workshop</option>
                                    <option value="keynote">Keynote</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea name="description" className="admin-input resize-none" rows={3} defaultValue={editing?.description || ""} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Slides URL</label>
                                <input name="slides_url" type="url" className="admin-input" defaultValue={editing?.slides_url || ""} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Video URL</label>
                                <input name="video_url" type="url" className="admin-input" defaultValue={editing?.video_url || ""} />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" name="is_published" value="true" id="sp_pub" defaultChecked={editing?.is_published ?? true} className="rounded" />
                            <label htmlFor="sp_pub" className="text-sm">Published</label>
                        </div>
                        <button type="submit" disabled={isPending} className="px-6 py-2 rounded-lg gradient-bg text-white text-sm font-medium disabled:opacity-50">
                            {isPending ? "Saving..." : editing ? "Update Event" : "Create Event"}
                        </button>
                    </form>
                )}

                <div className="glass rounded-xl overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-surface/50">
                            <tr>
                                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Title</th>
                                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden md:table-cell">Event</th>
                                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Type</th>
                                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Date</th>
                                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {events.map((e) => (
                                <tr key={e.id} className="hover:bg-surface/30 transition-colors">
                                    <td className="px-4 py-3 text-sm font-medium">{e.title}</td>
                                    <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{e.event_name}</td>
                                    <td className="px-4 py-3">
                                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary uppercase">{e.event_type}</span>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-muted-foreground">{e.event_date ? new Date(e.event_date).toLocaleDateString() : "—"}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button onClick={() => openEdit(e)} className="text-xs text-primary hover:underline">Edit</button>
                                            <button onClick={() => handleDelete(e.id)} disabled={isPending} className="text-xs text-red-400 hover:underline">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {events.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-8">No speaking events yet. Click &quot;+ Add Event&quot; to create one.</p>
                    )}
                </div>
            </div>
        </>
    );
}
