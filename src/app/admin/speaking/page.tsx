import { createClient } from "@/lib/supabase/server";
import SpeakingManager from "@/components/admin/SpeakingManager";

export const dynamic = "force-dynamic";

export default async function AdminSpeakingPage() {
    const supabase = await createClient();
    const { data: events } = await supabase.from("speaking_events").select("*").order("event_date", { ascending: false });

    return <SpeakingManager events={events ?? []} />;
}
