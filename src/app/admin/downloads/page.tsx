import { createClient } from "@/lib/supabase/server";
import DownloadsManager from "@/components/admin/DownloadsManager";

export const dynamic = "force-dynamic";

export default async function AdminDownloadsPage() {
    const supabase = await createClient();
    const { data: downloads } = await supabase.from("downloads").select("*").order("sort_order");

    return <DownloadsManager downloads={downloads ?? []} />;
}
