"use client";

import { useState, useTransition, useEffect } from "react";
import { createCaseStudy, updateCaseStudy, deleteCaseStudy } from "@/app/admin/actions/enterprise";
import RichTextEditor from "./RichTextEditor";

interface CaseStudy {
    id: string;
    title: string;
    slug: string;
    client: string | null;
    industry: string | null;
    challenge: string | null;
    solution: string | null;
    outcome: string | null;
    duration: string | null;
    is_published: boolean;
    sort_order: number;
}

export default function CaseStudiesManager({ cases }: { cases: CaseStudy[] }) {
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<CaseStudy | null>(null);
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

    function handleSubmit(formData: FormData) {
        startTransition(async () => {
            const result = editing
                ? await updateCaseStudy(editing.id, formData)
                : await createCaseStudy(formData);
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
        if (!confirm("Delete this case study?")) return;
        startTransition(async () => {
            await deleteCaseStudy(id);
            setMessage({ type: "success", text: "Deleted!" });
            setTimeout(() => setMessage(null), 2000);
        });
    }

    const [challengeContent, setChallengeContent] = useState("");
    const [solutionContent, setSolutionContent] = useState("");
    const [outcomeContent, setOutcomeContent] = useState("");

    useEffect(() => {
        if (showModal) {
            setChallengeContent(editing?.challenge ?? "");
            setSolutionContent(editing?.solution ?? "");
            setOutcomeContent(editing?.outcome ?? "");
        }
    }, [showModal, editing]);

    return (
        <div>
            {message && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium shadow-lg ${message.type === "success" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
                    {message.text}
                </div>
            )}

            <div className="flex justify-end mb-4">
                <button onClick={() => { setEditing(null); setShowModal(true); }} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">
                    + Add Case Study
                </button>
            </div>

            <div className="glass rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-surface/50">
                        <tr>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Title</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden md:table-cell">Industry</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Status</th>
                            <th className="text-right text-xs font-semibold text-muted-foreground px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {cases.map((cs) => (
                            <tr key={cs.id} className="hover:bg-surface/30 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="text-sm font-medium">{cs.title}</div>
                                    {cs.client && <div className="text-xs text-muted-foreground">{cs.client}</div>}
                                </td>
                                <td className="px-4 py-3 hidden md:table-cell text-sm text-muted-foreground">{cs.industry || "—"}</td>
                                <td className="px-4 py-3">
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${cs.is_published ? "bg-green-500/15 text-green-400" : "bg-gray-500/15 text-gray-400"}`}>
                                        {cs.is_published ? "Published" : "Draft"}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button onClick={() => { setEditing(cs); setShowModal(true); }} className="text-xs text-primary hover:underline mr-3">Edit</button>
                                    <button onClick={() => handleDelete(cs.id)} className="text-xs text-red-400 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {cases.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No case studies yet.</p>}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="glass rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto mx-4">
                        <h2 className="text-lg font-bold mb-4">{editing ? "Edit Case Study" : "Add Case Study"}</h2>
                        <form action={handleSubmit} className="space-y-3">
                            <input name="title" defaultValue={editing?.title} placeholder="Title *" required className="w-full px-3 py-2 bg-surface rounded-lg border border-border text-sm text-foreground" />
                            <div className="grid grid-cols-2 gap-3">
                                <input name="client" defaultValue={editing?.client ?? ""} placeholder="Client" className="px-3 py-2 bg-surface rounded-lg border border-border text-sm text-foreground" />
                                <input name="industry" defaultValue={editing?.industry ?? ""} placeholder="Industry" className="px-3 py-2 bg-surface rounded-lg border border-border text-sm text-foreground" />
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground ml-1">Challenge</label>
                                    <RichTextEditor
                                        content={editing ? (editing.challenge || "") : ""}
                                        onChange={(html) => setChallengeContent(html)}
                                        minHeight="min-h-[150px]"
                                    />
                                    <input type="hidden" name="challenge" value={challengeContent || (editing?.challenge ?? "")} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground ml-1">Solution</label>
                                    <RichTextEditor
                                        content={editing ? (editing.solution || "") : ""}
                                        onChange={(html) => setSolutionContent(html)}
                                        minHeight="min-h-[150px]"
                                    />
                                    <input type="hidden" name="solution" value={solutionContent || (editing?.solution ?? "")} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground ml-1">Outcome</label>
                                    <RichTextEditor
                                        content={editing ? (editing.outcome || "") : ""}
                                        onChange={(html) => setOutcomeContent(html)}
                                        minHeight="min-h-[150px]"
                                    />
                                    <input type="hidden" name="outcome" value={outcomeContent || (editing?.outcome ?? "")} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <input name="duration" defaultValue={editing?.duration ?? ""} placeholder="Duration" className="px-3 py-2 bg-surface rounded-lg border border-border text-sm text-foreground" />
                                <input name="sort_order" type="number" defaultValue={editing?.sort_order ?? 0} placeholder="Order" className="px-3 py-2 bg-surface rounded-lg border border-border text-sm text-foreground" />
                            </div>
                            <label className="flex items-center gap-2 text-sm">
                                <input type="hidden" name="is_published" value="false" />
                                <input type="checkbox" name="is_published" value="true" defaultChecked={editing?.is_published} />
                                Publish
                            </label>
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
    );
}
