"use client";

import { useState } from "react";
import { inviteUser } from "@/app/admin/actions/users";

interface UserInviteModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function UserInviteModal({ isOpen, onClose }: UserInviteModalProps) {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("viewer");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ success?: boolean; message?: string } | null>(null);

    if (!isOpen) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            const result = await inviteUser(email, role);
            if (result.success) {
                setStatus({ success: true, message: "Invitation sent successfully!" });
                setTimeout(() => {
                    onClose();
                    setEmail("");
                    setStatus(null);
                }, 1500);
            } else {
                setStatus({ success: false, message: result.error || "Failed to send invitation." });
            }
        } catch (err) {
            setStatus({ success: false, message: "An unexpected error occurred." });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="glass w-full max-w-md p-6 rounded-xl shadow-2xl animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Invite New User</h2>
                    <button onClick={onClose} className="p-2 hover:bg-surface rounded-full transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="admin-input w-full"
                            placeholder="colleague@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="admin-input w-full appearance-none"
                        >
                            <option value="viewer">Viewer (Read-only)</option>
                            <option value="editor">Editor (Can edit content)</option>
                            <option value="admin">Admin (Full access)</option>
                        </select>
                    </div>

                    {status && (
                        <div className={`p-3 rounded-lg text-sm ${status.success ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                            {status.message}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm hover:bg-surface transition-colors">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 disabled:opacity-50 transition-all"
                        >
                            {loading ? "Sending..." : "Send Invitation"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
