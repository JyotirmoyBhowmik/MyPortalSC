import MediaLibrary from "@/components/admin/MediaLibrary";
import { createClient } from "@/lib/supabase/server";
import { getFeatureFlag } from "@/lib/data/settings";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
    const isEnabled = await getFeatureFlag("feature_media_library");
    if (!isEnabled) notFound();

    const supabase = await createClient();
    const { data: media } = await supabase.from("media_library").select("*").order("created_at", { ascending: false });

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Media Library</h1>
                <p className="text-sm text-muted-foreground mt-1">Manage uploaded images, documents, and assets.</p>
            </div>

            <MediaLibrary initialMedia={media || []} />
        </div>
    );
}
