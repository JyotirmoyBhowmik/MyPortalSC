"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/ToastProvider";
import { createBudget, updateBudget, deleteBudget } from "@/app/admin/actions/finance";
import type { DashboardBudget } from "@/lib/data/finances";
import { convertToINR, formatINR, EXCHANGE_RATES_TO_INR } from "@/lib/utils/currency";

interface SelectOption {
    id: string;
    label: string;
}

interface Props {
    budgets: DashboardBudget[];
    projects: SelectOption[];
    initiatives: SelectOption[];
    skills: SelectOption[];
    fiscalYears: SelectOption[];
    currencies: string[];
}

export default function FinanceManager({ budgets, projects, initiatives, skills, fiscalYears, currencies }: Props) {
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const { dialog, confirm: confirmDelete } = useConfirmDialog();
    const { showToast } = useToast();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData(e.currentTarget);
        try {
            let res;
            if (isEditing && isEditing !== "new") {
                res = await updateBudget(isEditing, formData);
            } else {
                res = await createBudget(formData);
            }

            if (!res.success) throw new Error(res.error);
            
            showToast(`Budget ${isEditing && isEditing !== "new" ? 'updated' : 'created'} successfully`, "success");
            setIsEditing(null);
        } catch (err: any) {
            showToast(err.message || "An error occurred", "error");
        } finally {
            setSubmitting(false);
        }
    }

    function handleDelete(id: string) {
        confirmDelete(
            "Are you sure you want to delete this budget record?",
            async () => {
                try {
                    const res = await deleteBudget(id);
                    if (!res.success) throw new Error(res.error);
                    showToast("Budget deleted", "success");
                } catch (err: any) {
                    showToast(err.message || "Failed to delete", "error");
                }
            },
            { title: "Delete Budget?" }
        );
    }

    // Helper using row's custom INR rate if available
    const getRowINR = (amount: number, row: DashboardBudget) => {
        if (row.exchange_rate_to_inr && row.exchange_rate_to_inr !== 1) {
            return amount * row.exchange_rate_to_inr;
        }
        return convertToINR(amount, row.currency || "USD");
    };

    // Advanced Table Aggregations in INR
    const opexSubtotalINR = budgets
        .filter(b => b.investment_model === 'OpEx')
        .reduce((sum, b) => sum + getRowINR(b.expense_amount, b), 0);
    const capexSubtotalINR = budgets
        .filter(b => b.investment_model === 'CapEx')
        .reduce((sum, b) => sum + getRowINR(b.expense_amount, b), 0);
    const totalINR = opexSubtotalINR + capexSubtotalINR;

    const editItem = budgets.find((b) => b.id === isEditing) || null;

    if (isEditing) {
        return (
            <div className="glass p-6 rounded-xl relative max-w-4xl mx-auto mb-8">
                <button
                    onClick={() => setIsEditing(null)}
                    className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h3 className="text-xl font-bold mb-6">{isEditing === "new" ? "Add New Budget" : "Edit Budget"}</h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="p-4 rounded-lg bg-surface/30 border border-border space-y-4">
                        <h4 className="font-semibold text-sm text-primary uppercase tracking-wider">General Information</h4>
                        <Input
                            label="Title / Description"
                            name="title"
                            defaultValue={editItem?.title || ""}
                            required
                        />
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-foreground">Fiscal Year</label>
                                <select
                                    name="fiscal_year"
                                    defaultValue={editItem?.fiscal_year || ""}
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow appearance-none"
                                    required
                                >
                                    <option value="">-- Select Master FY --</option>
                                    {fiscalYears.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-foreground">Inv. Model</label>
                                <select
                                    name="investment_model"
                                    defaultValue={editItem?.investment_model || "OpEx"}
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow appearance-none"
                                >
                                    <option value="OpEx">OpEx</option>
                                    <option value="CapEx">CapEx</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-foreground">Currency</label>
                                <select
                                    name="currency"
                                    defaultValue={editItem?.currency || "USD"}
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow appearance-none"
                                >
                                    {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <Input
                                type="number"
                                step="0.0001"
                                label="Custom Exchange Rate (to INR)"
                                name="exchange_rate_to_inr"
                                placeholder={`ex: ${EXCHANGE_RATES_TO_INR['USD']}`}
                                defaultValue={editItem?.exchange_rate_to_inr || EXCHANGE_RATES_TO_INR[editItem?.currency || 'USD'] || 1}
                                required
                            />
                        </div>
                    </div>

                    {/* IT Department specific accounting */}
                    <div className="p-4 rounded-lg bg-surface/30 border border-border space-y-4">
                        <h4 className="font-semibold text-sm text-primary uppercase tracking-wider">Accounting Map</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                label="Cost Center"
                                name="cost_center"
                                placeholder="eg: IT-Infrastructure"
                                defaultValue={editItem?.cost_center || ""}
                            />
                            <Input
                                label="Profit Center"
                                name="profit_center"
                                placeholder="eg: Global Retail"
                                defaultValue={editItem?.profit_center || ""}
                            />
                            <Input
                                label="Account Head"
                                name="account_head"
                                placeholder="eg: Cloud Hosting"
                                defaultValue={editItem?.account_head || ""}
                            />
                        </div>
                    </div>

                    {/* Financial Blocks */}
                    <div className="p-4 rounded-lg bg-surface/30 border border-border space-y-4">
                        <h4 className="font-semibold text-sm text-primary uppercase tracking-wider">Values</h4>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <Input
                                type="number"
                                step="0.01"
                                label="Planning Amount"
                                name="planning_amount"
                                defaultValue={editItem?.planning_amount || 0}
                                required
                            />
                            <Input
                                type="number"
                                step="0.01"
                                label="Outlook Amount"
                                name="outlook_amount"
                                defaultValue={editItem?.outlook_amount || 0}
                                required
                            />
                            <Input
                                type="number"
                                step="0.01"
                                label="Expense Amount"
                                name="expense_amount"
                                defaultValue={editItem?.expense_amount || 0}
                                required
                            />
                            <Input
                                type="number"
                                step="0.01"
                                label="Carry-over Amount"
                                name="carry_over_amount"
                                defaultValue={editItem?.carry_over_amount || 0}
                                required
                            />
                        </div>
                    </div>

                    {/* Platform Mapping */}
                    <div className="p-4 rounded-lg bg-surface/30 border border-border space-y-4">
                        <h4 className="font-semibold text-sm text-primary uppercase tracking-wider">Project System Links</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             <div className="space-y-1">
                                <label className="text-sm font-medium text-foreground">Map to Project</label>
                                <select
                                    name="project_id"
                                    defaultValue={editItem?.project_id || ""}
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow appearance-none"
                                >
                                    <option value="">-- None --</option>
                                    {projects.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                                </select>
                            </div>
                             <div className="space-y-1">
                                <label className="text-sm font-medium text-foreground">Map to Initiative</label>
                                <select
                                    name="initiative_id"
                                    defaultValue={editItem?.initiative_id || ""}
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow appearance-none"
                                >
                                    <option value="">-- None --</option>
                                    {initiatives.map(i => <option key={i.id} value={i.id}>{i.label}</option>)}
                                </select>
                            </div>
                             <div className="space-y-1">
                                <label className="text-sm font-medium text-foreground">Map to Skill</label>
                                <select
                                    name="skill_id"
                                    defaultValue={editItem?.skill_id || ""}
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow appearance-none"
                                >
                                    <option value="">-- None --</option>
                                    {skills.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => setIsEditing(null)}>Cancel</Button>
                        <Button type="submit" isLoading={submitting}>Save Budget Entry</Button>
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
                <Button onClick={() => setIsEditing("new")}>Add Budget Entry</Button>
            </div>

            <div className="glass rounded-xl overflow-hidden mb-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-surface/50">
                                <th className="text-left p-4 font-medium text-muted-foreground w-1/4">Title / Accnt Info</th>
                                <th className="text-left p-4 font-medium text-muted-foreground hidden lg:table-cell">Mapping</th>
                                <th className="text-right p-4 font-medium text-muted-foreground">Planning</th>
                                <th className="text-right p-4 font-medium text-muted-foreground">Expense</th>
                                <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {budgets.map((b) => (
                                <tr key={b.id} className="border-b border-border/50 hover:bg-surface/50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium text-foreground">{b.title}</div>
                                        <div className="text-xs text-muted-foreground gap-1 flex items-center mt-1">
                                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${b.investment_model === 'OpEx' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'}`}>{b.investment_model}</span>
                                            {b.fiscal_year}
                                        </div>
                                        {b.cost_center && (
                                            <div className="text-[10px] text-muted-foreground mt-1 tracking-wider uppercase">
                                                CC: {b.cost_center} {b.account_head ? `| Head: ${b.account_head}` : ''}
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4 hidden lg:table-cell">
                                        <div className="flex flex-col gap-1 text-xs">
                                            {b.projects?.title && <span className="text-muted-foreground">P: <span className="text-foreground">{b.projects.title}</span></span>}
                                            {b.initiatives?.title && <span className="text-muted-foreground">I: <span className="text-foreground">{b.initiatives.title}</span></span>}
                                            {b.skills?.name && <span className="text-muted-foreground">S: <span className="text-foreground">{b.skills.name}</span></span>}
                                            {!b.project_id && !b.initiative_id && !b.skill_id && <span className="italic text-muted-foreground">Unmapped</span>}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right font-mono font-medium">
                                        <div>{b.currency || 'USD'} {Number(b.planning_amount).toLocaleString()}</div>
                                        <div className="text-[10px] text-muted-foreground italic">~ {formatINR(getRowINR(b.planning_amount, b))}</div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="font-mono text-foreground font-bold">{b.currency || 'USD'} {Number(b.expense_amount).toLocaleString()}</div>
                                        <div className="text-[10px] text-muted-foreground italic flex flex-col pt-1">
                                            <span>~ {formatINR(getRowINR(b.expense_amount, b))}</span>
                                            {b.exchange_rate_to_inr && <span className="text-[8px] opacity-70">Rate: {b.exchange_rate_to_inr}</span>}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="outline" size="sm" onClick={() => setIsEditing(b.id)}>Edit</Button>
                                            <Button variant="danger" size="sm" onClick={() => handleDelete(b.id)}>Delete</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {budgets.length === 0 && (
                                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No financial records found. Map your first budget.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Financial Aggregation Bar */}
            {budgets.length > 0 && (
                <div className="glass rounded-xl p-6 bg-primary/5 border-primary/20 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex gap-8 w-full md:w-auto overflow-x-auto pb-4 md:pb-0">
                        <div>
                            <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">OpEx Subtotal</div>
                            <div className="text-xl font-bold font-mono text-blue-500">{formatINR(opexSubtotalINR)}</div>
                        </div>
                        <div className="border-l border-border/50 pl-8">
                            <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">CapEx Subtotal</div>
                            <div className="text-xl font-bold font-mono text-purple-500">{formatINR(capexSubtotalINR)}</div>
                        </div>
                    </div>
                    <div className="w-full md:w-auto text-right border-t border-border/50 md:border-none pt-4 md:pt-0">
                        <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Final Total Expenses (INR Converted)</div>
                        <div className="text-3xl font-black font-mono text-foreground">{formatINR(totalINR)}</div>
                    </div>
                </div>
            )}
        </>
    );
}
