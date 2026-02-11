"use client";

import { useState, useTransition } from "react";
import type { Program, InitiativeWithProgram } from "@/lib/database.types";
import {
    createInitiative,
    updateInitiative,
    deleteInitiative,
} from "@/app/admin/actions/initiatives";

interface InitiativesManagerProps {
    initiatives: InitiativeWithProgram[];
    programs: Program[];
}

const criticalityColors: Record<string, string> = {
    Critical: "bg-red-500/15 text-red-400",
    High: "bg-amber-500/15 text-amber-400",
    Medium: "bg-blue-500/15 text-blue-400",
    Low: "bg-gray-500/15 text-gray-400",
};

const statusColors: Record<string, string> = {
    published: "bg-green-500/15 text-green-400",
    draft: "bg-yellow-500/15 text-yellow-400",
    archived: "bg-gray-500/15 text-gray-400",
};

export default function InitiativesManager({
    initiatives,
    programs,
}: InitiativesManagerProps) {
    const [search, setSearch] = useState("");
    const [selectedProgram, setSelectedProgram] = useState<string>("");
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        program_id: "",
        fiscal_year: "",
        strategic_area: "",
        criticality: "Medium",
        delivery_focus: "",
        status: "published",
        order_index: "0",
    });

    const filtered = initiatives.filter((i) => {
        const matchesSearch = !search ||
            i.title.toLowerCase().includes(search.toLowerCase()) ||
            i.strategic_area.toLowerCase().includes(search.toLowerCase());
        const matchesProgram = !selectedProgram || i.programs?.code === selectedProgram;
        return matchesSearch && matchesProgram;
    });

    function openCreate() {
        setEditingId(null);
        setFormData({
            title: "",
            slug: "",
            program_id: "",
            fiscal_year: "2024-25",
            strategic_area: "",
            criticality: "Medium",
            delivery_focus: "",
            status: "published",
            order_index: String(initiatives.length + 1),
        });
        setShowModal(true);
    }

    function openEdit(i: InitiativeWithProgram) {
        setEditingId(i.id);
        setFormData({
            title: i.title,
            slug: i.slug,
            program_id: i.program_id || "",
            fiscal_year: i.fiscal_year,
            strategic_area: i.strategic_area,
            criticality: i.criticality,
            delivery_focus: i.delivery_focus || "",
            status: i.status,
            order_index: String(i.order_index),
        });
        setShowModal(true);
    }

    function handleSubmit() {
        const fd = new FormData();
        Object.entries(formData).forEach(([k, v]) => fd.set(k, v));

        startTransition(async () => {
            let result;
            if (editingId) {
                result = await updateInitiative(editingId, fd);
            } else {
                result = await createInitiative(fd);
            }
            if (result.success) {
                setMessage({ type: "success", text: editingId ? "Initiative updated!" : "Initiative created!" });
                setShowModal(false);
            } else {
                setMessage({ type: "error", text: result.error || "Failed to save" });
            }
            setTimeout(() => setMessage(null), 3000);
        });
    }

    function handleDelete(id: string, title: string) {
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
        startTransition(async () => {
            const result = await deleteInitiative(id);
            if (result.success) {
                setMessage({ type: "success", text: "Initiative deleted!" });
            } else {
                setMessage({ type: "error", text: result.error || "Failed to delete" });
            }
            setTimeout(() => setMessage(null), 3000);
        });
    }

    function generateSlug(title: string) {
        return `${Date.now()}-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`.substring(0, 80);
    }

    return (
        <div>
            {/* Toast message */}
            {message && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium shadow-lg animate-slide-down ${message.type === "success" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
                    {message.text}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="relative flex-1 max-w-sm">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="admin-input pl-10"
                        />
                    </div>
                    <select
                        value={selectedProgram}
                        onChange={(e) => setSelectedProgram(e.target.value)}
                        className="admin-input w-44"
                    >
                        <option value="">All Programs</option>
                        {programs.map((p) => (
                            <option key={p.code} value={p.code}>{p.code}. {p.name}</option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={openCreate}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary-hover transition-colors flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Initiative
                </button>
            </div>

            {/* Summary */}
            <p className="text-sm text-muted-foreground mb-4">
                {filtered.length} of {initiatives.length} initiatives
            </p>

            {/* Table */}
            <div className="glass rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border text-left">
                                <th className="px-4 py-3 font-semibold text-muted-foreground">#</th>
                                <th className="px-4 py-3 font-semibold text-muted-foreground">Title</th>
                                <th className="px-4 py-3 font-semibold text-muted-foreground">Program</th>
                                <th className="px-4 py-3 font-semibold text-muted-foreground">FY</th>
                                <th className="px-4 py-3 font-semibold text-muted-foreground">Criticality</th>
                                <th className="px-4 py-3 font-semibold text-muted-foreground">Status</th>
                                <th className="px-4 py-3 font-semibold text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {filtered.map((init, idx) => (
                                <tr key={init.id} className="hover:bg-surface/50 transition-colors">
                                    <td className="px-4 py-3 text-muted-foreground">{idx + 1}</td>
                                    <td className="px-4 py-3 font-medium text-foreground max-w-xs truncate">{init.title}</td>
                                    <td className="px-4 py-3">
                                        <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">
                                            {init.programs?.code ?? "–"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">{init.fiscal_year}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${criticalityColors[init.criticality]}`}>
                                            {init.criticality}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${statusColors[init.status]}`}>
                                            {init.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button onClick={() => openEdit(init)} className="text-muted-foreground hover:text-primary transition-colors mr-3" title="Edit">
                                            <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button onClick={() => handleDelete(init.id, init.title)} className="text-muted-foreground hover:text-danger transition-colors" title="Delete">
                                            <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-6">
                            {editingId ? "Edit Initiative" : "New Initiative"}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => {
                                        setFormData((p) => ({
                                            ...p,
                                            title: e.target.value,
                                            ...(!editingId ? { slug: generateSlug(e.target.value) } : {}),
                                        }));
                                    }}
                                    className="admin-input"
                                    placeholder="Initiative title"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Slug</label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
                                    className="admin-input"
                                    placeholder="url-friendly-slug"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">Program</label>
                                    <select
                                        value={formData.program_id}
                                        onChange={(e) => setFormData((p) => ({ ...p, program_id: e.target.value }))}
                                        className="admin-input"
                                    >
                                        <option value="">Select program</option>
                                        {programs.map((p) => (
                                            <option key={p.id} value={p.id}>{p.code}. {p.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">Fiscal Year</label>
                                    <input
                                        type="text"
                                        value={formData.fiscal_year}
                                        onChange={(e) => setFormData((p) => ({ ...p, fiscal_year: e.target.value }))}
                                        className="admin-input"
                                        placeholder="2024-25"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">Strategic Area</label>
                                    <input
                                        type="text"
                                        value={formData.strategic_area}
                                        onChange={(e) => setFormData((p) => ({ ...p, strategic_area: e.target.value }))}
                                        className="admin-input"
                                        placeholder="OT Security"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">Criticality</label>
                                    <select
                                        value={formData.criticality}
                                        onChange={(e) => setFormData((p) => ({ ...p, criticality: e.target.value }))}
                                        className="admin-input"
                                    >
                                        {["Critical", "High", "Medium", "Low"].map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Delivery Focus</label>
                                <textarea
                                    value={formData.delivery_focus}
                                    onChange={(e) => setFormData((p) => ({ ...p, delivery_focus: e.target.value }))}
                                    className="admin-input"
                                    rows={3}
                                    placeholder="Phase 1; Phase 2; Phase 3"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))}
                                        className="admin-input"
                                    >
                                        <option value="published">Published</option>
                                        <option value="draft">Draft</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">Order</label>
                                    <input
                                        type="number"
                                        value={formData.order_index}
                                        onChange={(e) => setFormData((p) => ({ ...p, order_index: e.target.value }))}
                                        className="admin-input"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-border">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isPending || !formData.title || !formData.fiscal_year}
                                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPending ? "Saving…" : editingId ? "Update" : "Create"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
