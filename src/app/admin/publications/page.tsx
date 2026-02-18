import { createClient } from "@/lib/supabase/server";
import PublicationsManager from "@/components/admin/PublicationsManager";

export const dynamic = "force-dynamic";

export default async function AdminPublicationsPage() {
    const supabase = await createClient();
    const { data: items } = await supabase.from("publications").select("*").order("published_date", { ascending: false });

    return <PublicationsManager publications={items ?? []} />;
}
