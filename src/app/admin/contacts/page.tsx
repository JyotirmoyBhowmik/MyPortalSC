import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminContactsPage() {
    const supabase = await createClient();
    const { data: contacts } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

    const statusColors: Record<string, string> = {
        new: "bg-blue-500/15 text-blue-400",
        read: "bg-amber-500/15 text-amber-400",
        replied: "bg-green-500/15 text-green-400",
        archived: "bg-gray-500/15 text-gray-400",
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Contacts CRM</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Manage contact form submissions and correspondence.
                </p>
            </div>

            <div className="glass rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-surface/50">
                        <tr>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Name</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden md:table-cell">Email</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden lg:table-cell">Message</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Status</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {contacts?.map((c) => (
                            <tr key={c.id} className="hover:bg-surface/30 transition-colors">
                                <td className="px-4 py-3 text-sm font-medium">{c.name}</td>
                                <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{c.email}</td>
                                <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell truncate max-w-xs">{c.message}</td>
                                <td className="px-4 py-3">
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${statusColors[c.status] || statusColors.new}`}>
                                        {c.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-xs text-muted-foreground">
                                    {new Date(c.created_at).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {(!contacts || contacts.length === 0) && (
                    <p className="text-sm text-muted-foreground text-center py-8">No contact submissions yet.</p>
                )}
            </div>
        </div>
    );
}
