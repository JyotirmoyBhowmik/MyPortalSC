import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
    const supabase = await createClient();
    const { data: admins } = await supabase.from("admin_users").select("*").order("created_at", { ascending: false });

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Users</h1>
                <p className="text-sm text-muted-foreground mt-1">Manage admin users and RBAC roles.</p>
            </div>
            <div className="glass rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-surface/50">
                        <tr>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">User ID</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Role</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Since</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {admins?.map((a) => (
                            <tr key={a.id} className="hover:bg-surface/30">
                                <td className="px-4 py-3 text-sm font-mono">{a.user_id}</td>
                                <td className="px-4 py-3">
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary uppercase">
                                        {a.role || "editor"}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {(!admins || admins.length === 0) && <p className="text-sm text-muted-foreground text-center py-8">No admin users configured.</p>}
            </div>
        </div>
    );
}
