"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import type { Skill } from "@/lib/database.types";
import { createSkill, updateSkill, deleteSkill } from "@/app/admin/actions/skills";

export default function SkillsManager({ skills }: { skills: Skill[] }) {
    const [editing, setEditing] = useState<string | null>(null);
    const [showNew, setShowNew] = useState(false);
    const [loading, setLoading] = useState(false);

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
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed");
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
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed");
        }
        setLoading(false);
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this skill?")) return;
        try {
            await deleteSkill(id);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed");
        }
    }

    return (
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
                            <th className="text-left p-4 font-medium text-muted-foreground">Name</th>
                            <th className="text-left p-4 font-medium text-muted-foreground">Category</th>
                            <th className="text-left p-4 font-medium text-muted-foreground">Level</th>
                            <th className="text-left p-4 font-medium text-muted-foreground hidden sm:table-cell">Experience</th>
                            <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {skills.map((skill) =>
                            editing === skill.id ? (
                                <tr key={skill.id} className="border-b border-border/50">
                                    <td colSpan={5} className="p-3">
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
                                <tr key={skill.id} className="border-b border-border/50 hover:bg-surface/50 transition-colors">
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
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
