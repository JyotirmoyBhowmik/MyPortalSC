import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminAuditPage() {
    const supabase = await createClient();
    const { data: logs } = await supabase
        .from("audit_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Audit Log</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Complete history of admin actions and system changes.
                </p>
            </div>

            <div className="glass rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-surface/50">
                        <tr>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Action</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden md:table-cell">Table</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden lg:table-cell">Details</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {logs?.map((log) => {
                            const actionColors: Record<string, string> = {
                                create: "bg-green-500/15 text-green-400",
                                update: "bg-blue-500/15 text-blue-400",
                                delete: "bg-red-500/15 text-red-400",
                            };
                            return (
                                <tr key={log.id} className="hover:bg-surface/30 transition-colors">
                                    <td className="px-4 py-2">
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${actionColors[log.action] || "bg-gray-500/15 text-gray-400"}`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 text-sm text-muted-foreground hidden md:table-cell">{log.table_name}</td>
                                    <td className="px-4 py-2 text-xs text-muted-foreground hidden lg:table-cell truncate max-w-xs">
                                        {log.record_id ? `ID: ${log.record_id}` : "—"}
                                    </td>
                                    <td className="px-4 py-2 text-xs text-muted-foreground">{new Date(log.created_at).toLocaleString()}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {(!logs || logs.length === 0) && (
                    <p className="text-sm text-muted-foreground text-center py-8">No audit entries yet.</p>
                )}
            </div>
        </div>
    );
}
