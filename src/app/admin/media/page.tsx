import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
    const supabase = await createClient();
    const { data: media } = await supabase.from("media_library").select("*").order("created_at", { ascending: false });

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Media Library</h1>
                <p className="text-sm text-muted-foreground mt-1">Manage uploaded images, documents, and assets.</p>
            </div>

            {media && media.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {media.map((item) => (
                        <div key={item.id} className="glass rounded-xl overflow-hidden group">
                            {item.mime_type?.startsWith("image/") ? (
                                <div className="h-32 bg-surface">
                                    <img src={item.public_url || ""} alt={item.alt_text || item.original_name} className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="h-32 bg-surface flex items-center justify-center">
                                    <span className="text-3xl">📄</span>
                                </div>
                            )}
                            <div className="p-2">
                                <p className="text-[10px] font-medium truncate">{item.original_name}</p>
                                <p className="text-[9px] text-muted-foreground">{item.folder}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-2xl mb-2">🖼️</p>
                    <p className="text-muted-foreground">No media uploaded yet.</p>
                </div>
            )}
        </div>
    );
}
