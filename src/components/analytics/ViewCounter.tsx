import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { logDbError } from "@/lib/supabase/error";

// Cache the view count for 60 seconds so we don't hammer the database on every page load
const getCachedViewCount = unstable_cache(
    async () => {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) return 0;

        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
        
        const { count, error } = await supabaseAdmin
            .from("visitor_events")
            .select("*", { count: "exact", head: true })
            .eq("event_type", "pageview");

        if (error) {
            logDbError("Failed to fetch view count", error);
            return 0;
        }

        return count || 0;
    },
    ["global-view-count"],
    { revalidate: 60 }
);

export default async function ViewCounter() {
    const realViews = await getCachedViewCount();
    // Add a base of 1,500 just so the portfolio looks established even if freshly deployed
    const totalViews = 1500 + realViews;

    return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface/50 border border-border/50 text-xs font-medium text-muted-foreground shadow-sm transition-colors hover:text-foreground hover:border-primary/30">
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-40"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            {totalViews.toLocaleString()} Views
        </div>
    );
}
