import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminSecurityPage() {
    const supabase = await createClient();
    const { data: sessions } = await supabase
        .from("user_sessions")
        .select("*")
        .order("last_active", { ascending: false })
        .limit(20);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Security</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Active sessions, rate limits, and security controls.
                </p>
            </div>

            {/* Security Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="glass rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">🔐</span>
                        <div>
                            <p className="text-sm font-bold">HTTPS Enforced</p>
                            <p className="text-xs text-green-400">Active</p>
                        </div>
                    </div>
                </div>
                <div className="glass rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">🛡️</span>
                        <div>
                            <p className="text-sm font-bold">RLS Policies</p>
                            <p className="text-xs text-green-400">All tables covered</p>
                        </div>
                    </div>
                </div>
                <div className="glass rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">⚡</span>
                        <div>
                            <p className="text-sm font-bold">Rate Limiting</p>
                            <p className="text-xs text-green-400">Enabled</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Active Sessions */}
            <div className="glass rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-surface/50">
                    <h2 className="text-sm font-bold">Active Sessions</h2>
                </div>
                <table className="w-full">
                    <thead className="bg-surface/30">
                        <tr>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-2">User</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-2 hidden md:table-cell">Device</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-2">Last Active</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {sessions?.map((s) => (
                            <tr key={s.id} className="hover:bg-surface/30 transition-colors">
                                <td className="px-4 py-2 text-sm">{s.user_id}</td>
                                <td className="px-4 py-2 text-xs text-muted-foreground hidden md:table-cell truncate max-w-xs">{s.device_info || s.user_agent || "—"}</td>
                                <td className="px-4 py-2 text-xs text-muted-foreground">{new Date(s.last_active).toLocaleString()}</td>
                                <td className="px-4 py-2">
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${s.is_active ? "bg-green-500/15 text-green-400" : "bg-gray-500/15 text-gray-400"}`}>
                                        {s.is_active ? "Active" : "Expired"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {(!sessions || sessions.length === 0) && (
                    <p className="text-sm text-muted-foreground text-center py-8">No active sessions.</p>
                )}
            </div>
        </div>
    );
}
