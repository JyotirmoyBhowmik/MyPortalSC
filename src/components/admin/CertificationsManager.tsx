"use client";

import { useState } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { Certification } from "@/lib/database.types";
import {
    createCertification,
    updateCertification,
    deleteCertification,
} from "@/app/admin/actions/certifications";
import { useConfirmDialog } from "@/components/ui/ConfirmDialog";

export default function CertificationsManager({
    certifications,
}: {
    certifications: Certification[];
}) {
    const [showNew, setShowNew] = useState(false);
    const [editing, setEditing] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { dialog, confirm: confirmDelete } = useConfirmDialog();

    async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const fd = new FormData(e.currentTarget);
        try {
            await createCertification({
                title: fd.get("title") as string,
                issuing_organization: fd.get("issuing_organization") as string,
                issue_date: fd.get("issue_date") as string,
                expiry_date: (fd.get("expiry_date") as string) || null,
                credential_id: (fd.get("credential_id") as string) || null,
                credential_url: (fd.get("credential_url") as string) || null,
                status: fd.get("status") as "active" | "expired",
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
            await updateCertification(id, {
                title: fd.get("title") as string,
                issuing_organization: fd.get("issuing_organization") as string,
                issue_date: fd.get("issue_date") as string,
                expiry_date: (fd.get("expiry_date") as string) || null,
                credential_id: (fd.get("credential_id") as string) || null,
                credential_url: (fd.get("credential_url") as string) || null,
                status: fd.get("status") as "active" | "expired" | "archived",
            });
            setEditing(null);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed");
        }
        setLoading(false);
    }

    function handleDelete(id: string) {
        confirmDelete("This certification will be permanently deleted.", async () => {
            await deleteCertification(id);
        }, { title: "Delete Certification?" });
    }

    const CertForm = ({
        cert,
        onSubmit,
        onCancel,
    }: {
        cert?: Certification;
        onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
        onCancel: () => void;
    }) => (
        <form onSubmit={onSubmit} className="glass rounded-xl p-5 mb-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input name="title" className="admin-input" placeholder="Certification title" defaultValue={cert?.title || ""} required />
                <input name="issuing_organization" className="admin-input" placeholder="Issuing organization" defaultValue={cert?.issuing_organization || ""} required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input name="issue_date" type="date" className="admin-input" defaultValue={cert?.issue_date || ""} required />
                <input name="expiry_date" type="date" className="admin-input" defaultValue={cert?.expiry_date || ""} />
                <select name="status" className="admin-input" defaultValue={cert?.status || "active"}>
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="archived">Archived</option>
                </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input name="credential_id" className="admin-input" placeholder="Credential ID" defaultValue={cert?.credential_id || ""} />
                <input name="credential_url" type="url" className="admin-input" placeholder="Verification URL" defaultValue={cert?.credential_url || ""} />
            </div>
            <div className="flex gap-2">
                <Button type="submit" variant="primary" size="sm" isLoading={loading}>
                    {cert ? "Save" : "Create"}
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </form>
    );

    return (
        <>
            {dialog}
            <div>
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold">Certifications</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Manage your certifications and badges
                        </p>
                    </div>
                    <Button variant="primary" onClick={() => setShowNew(true)}>
                        + Add Certification
                    </Button>
                </div>

                {showNew && (
                    <CertForm onSubmit={handleCreate} onCancel={() => setShowNew(false)} />
                )}

                <div className="space-y-3">
                    {certifications.map((cert) =>
                        editing === cert.id ? (
                            <CertForm
                                key={cert.id}
                                cert={cert}
                                onSubmit={(e) => handleUpdate(e, cert.id)}
                                onCancel={() => setEditing(null)}
                            />
                        ) : (
                            <div
                                key={cert.id}
                                className="glass rounded-xl p-5 flex items-center justify-between gap-4"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium">{cert.title}</span>
                                        <Badge
                                            variant={cert.status === "active" ? "success" : cert.status === "expired" ? "danger" : "outline"}
                                        >
                                            {cert.status}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {cert.issuing_organization} ·{" "}
                                        {new Date(cert.issue_date).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => setEditing(cert.id)}
                                        className="text-xs px-2 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cert.id)}
                                        className="text-xs px-2 py-1 rounded bg-danger/10 text-danger hover:bg-danger/20 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                    {certifications.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-8">
                            No certifications yet.
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}
