import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminPublicationsPage() {
    const supabase = await createClient();
    const { data: items } = await supabase.from("publications").select("*").order("published_date", { ascending: false });

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Publications & Awards</h1>
                <p className="text-sm text-muted-foreground mt-1">Manage papers, certifications, and recognitions.</p>
            </div>
            <div className="glass rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-surface/50">
                        <tr>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Title</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Type</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden md:table-cell">Publisher</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {items?.map((item) => (
                            <tr key={item.id} className="hover:bg-surface/30">
                                <td className="px-4 py-3 text-sm font-medium">{item.title}</td>
                                <td className="px-4 py-3"><span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary uppercase">{item.publication_type}</span></td>
                                <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{item.publisher || "—"}</td>
                                <td className="px-4 py-3 text-xs text-muted-foreground">{item.published_date ? new Date(item.published_date).toLocaleDateString() : "—"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {(!items || items.length === 0) && <p className="text-sm text-muted-foreground text-center py-8">No publications yet.</p>}
            </div>
        </div>
    );
}
