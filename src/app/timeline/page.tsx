import { createClient } from "@/lib/supabase/server";
import TimelineContent from "@/components/executive/TimelineContent";
import { getFeatureFlag } from "@/lib/data/settings";
import { notFound } from "next/navigation";

export const revalidate = 60;

export const metadata = {
    title: "Career Timeline | Jyotirmoy Bhowmik",
    description: "15+ year career journey across enterprise IT infrastructure and project management.",
};

export default async function TimelinePage() {
    const isEnabled = await getFeatureFlag("feature_timeline");
    if (!isEnabled) notFound();

    const supabase = await createClient();
    const { data } = await supabase
        .from("timeline_entries")
        .select("*")
        .eq("is_published", true)
        .order("sort_order");

    return (
        <main className="min-h-screen pt-24 pb-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <TimelineContent entries={data ?? []} />
            </div>
        </main>
    );
}
