"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/ToastProvider";
import { createFiscalYear, deleteFiscalYear } from "@/app/admin/actions/calendar";

export interface FiscalYear {
    id: string;
    label: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
}

interface Props {
    fiscalYears: FiscalYear[];
}

export default function CalendarManager({ fiscalYears }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const { dialog, confirm: confirmDelete } = useConfirmDialog();
    const { showToast } = useToast();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData(e.currentTarget);
        try {
            const res = await createFiscalYear(formData);
            if (!res.success) throw new Error(res.error);
            
            showToast("Fiscal Year created securely.", "success");
            setIsEditing(false);
        } catch (err: any) {
            showToast(err.message || "An error occurred", "error");
        } finally {
            setSubmitting(false);
        }
    }

    function handleDelete(id: string) {
        confirmDelete(
            "Are you sure you want to delete this Fiscal Year? It may break mapped budgets.",
            async () => {
                try {
                    const res = await deleteFiscalYear(id);
                    if (!res.success) throw new Error(res.error);
                    showToast("Fiscal Year deleted", "success");
                } catch (err: any) {
                    showToast(err.message || "Failed to delete", "error");
                }
            },
            { title: "Delete Fiscal Year?" }
        );
    }

    if (isEditing) {
        return (
            <div className="glass p-6 rounded-xl relative max-w-xl mx-auto">
                <button
                    onClick={() => setIsEditing(false)}
                    className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h3 className="text-xl font-bold mb-6">Add New Fiscal Year</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Label (e.g. 2024-25)"
                        name="label"
                        placeholder="2024-25"
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            type="date"
                            label="Start Date (April)"
                            name="start_date"
                            required
                        />
                        <Input
                            type="date"
                            label="End Date (March)"
                            name="end_date"
                            required
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                        <Button type="submit" isLoading={submitting}>Save</Button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <>
            {dialog}
            <div className="mb-6 flex justify-between items-center">
                <div></div>
                <Button onClick={() => setIsEditing(true)}>Add Fiscal Year</Button>
            </div>

            <div className="glass rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left p-4 font-medium text-muted-foreground">Label</th>
                                <th className="text-left p-4 font-medium text-muted-foreground">Start Date</th>
                                <th className="text-left p-4 font-medium text-muted-foreground">End Date</th>
                                <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fiscalYears.map((fy) => (
                                <tr key={fy.id} className="border-b border-border/50 hover:bg-surface/50 transition-colors">
                                    <td className="p-4 font-medium">{fy.label}</td>
                                    <td className="p-4">{new Date(fy.start_date).toLocaleDateString()}</td>
                                    <td className="p-4">{new Date(fy.end_date).toLocaleDateString()}</td>
                                    <td className="p-4 text-right">
                                        <Button variant="danger" size="sm" onClick={() => handleDelete(fy.id)}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                            {fiscalYears.length === 0 && (
                                <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No matching fiscal years defined.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
