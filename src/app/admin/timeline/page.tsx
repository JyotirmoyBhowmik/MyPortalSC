import { createClient } from "@/lib/supabase/server";
import TimelineManager from "@/components/admin/TimelineManager";

export const dynamic = "force-dynamic";

export default async function AdminTimelinePage() {
    const supabase = await createClient();
    const { data } = await supabase.from("timeline_entries").select("*").order("sort_order");

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Career Timeline</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Manage career timeline entries, milestones, and education.
                </p>
            </div>
            <TimelineManager entries={data ?? []} />
        </div>
    );
}
