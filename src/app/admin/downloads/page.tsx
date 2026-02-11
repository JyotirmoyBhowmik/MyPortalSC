import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminDownloadsPage() {
    const supabase = await createClient();
    const { data: downloads } = await supabase.from("downloads").select("*").order("sort_order");

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Downloads</h1>
                <p className="text-sm text-muted-foreground mt-1">Manage downloadable resources and documents.</p>
            </div>
            <div className="glass rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-surface/50">
                        <tr>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Title</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Type</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden md:table-cell">Size</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Downloads</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {downloads?.map((dl) => (
                            <tr key={dl.id} className="hover:bg-surface/30">
                                <td className="px-4 py-3 text-sm font-medium">{dl.title}</td>
                                <td className="px-4 py-3"><span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-surface text-muted-foreground uppercase">{dl.file_type}</span></td>
                                <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">{dl.file_size || "—"}</td>
                                <td className="px-4 py-3 text-sm font-mono text-primary">{dl.download_count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {(!downloads || downloads.length === 0) && <p className="text-sm text-muted-foreground text-center py-8">No downloads yet.</p>}
            </div>
        </div>
    );
}
