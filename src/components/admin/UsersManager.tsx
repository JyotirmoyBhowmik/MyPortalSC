"use client";

import { useState } from "react";
import { inviteUser, updateUserRole, removeUser } from "@/app/admin/actions/users";
import UserInviteModal from "./UserInviteModal";
import { useRouter } from "next/navigation";

interface AdminUser {
    id: string;
    user_id: string;
    role: string;
    created_at: string;
    email?: string; // Might be joined or custom
}

interface UsersManagerProps {
    users: AdminUser[];
}

export default function UsersManager({ users }: UsersManagerProps) {
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [updating, setUpdating] = useState<string | null>(null);
    const router = useRouter();

    async function handleRoleChange(userId: string, newRole: string) {
        setUpdating(userId);
        try {
            await updateUserRole(userId, newRole);
            router.refresh(); // Refresh server data
        } catch (error) {
            console.error("Failed to update role:", error);
            alert("Failed to update role");
        } finally {
            setUpdating(null);
        }
    }

    async function handleDelete(userId: string) {
        if (!confirm("Are you sure you want to remove this user? This action cannot be undone.")) return;
        setUpdating(userId);
        try {
            await removeUser(userId);
            router.refresh();
        } catch (error) {
            console.error("Failed to remove user:", error);
            alert("Failed to remove user");
        } finally {
            setUpdating(null);
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Users</h1>
                    <p className="text-sm text-muted-foreground mt-1">Manage admin users and RBAC roles.</p>
                </div>
                <button
                    onClick={() => setIsInviteOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:brightness-110 transition-all font-medium"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Invite User
                </button>
            </div>

            <div className="glass rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-surface/50">
                        <tr>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">User ID / Email</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Role</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Since</th>
                            <th className="text-right text-xs font-semibold text-muted-foreground px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {users.map((u) => (
                            <tr key={u.id} className="hover:bg-surface/30 group">
                                <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
                                    {u.email || u.user_id}
                                    {/* If email is missing, show ID. In real auth, we'd join auth.users data via server component if possible */}
                                </td>
                                <td className="px-4 py-3">
                                    <select
                                        value={u.role || "viewer"}
                                        onChange={(e) => handleRoleChange(u.user_id, e.target.value)}
                                        disabled={updating === u.user_id}
                                        className={`text-xs font-bold px-2 py-1 rounded border-none focus:ring-1 focus:ring-primary bg-primary/10 text-primary uppercase cursor-pointer ${updating === u.user_id ? "opacity-50" : ""}`}
                                    >
                                        <option value="viewer">Viewer</option>
                                        <option value="editor">Editor</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                                <td className="px-4 py-3 text-right">
                                    <button
                                        onClick={() => handleDelete(u.user_id)}
                                        disabled={updating === u.user_id}
                                        className="text-muted-foreground hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1"
                                        title="Remove User"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No admin users configured.</p>}
            </div>

            <UserInviteModal isOpen={isInviteOpen} onClose={() => { setIsInviteOpen(false); router.refresh(); }} />
        </div>
    );
}
