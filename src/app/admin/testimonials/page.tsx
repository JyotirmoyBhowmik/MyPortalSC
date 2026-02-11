import { createClient } from "@/lib/supabase/server";
import TestimonialsManager from "@/components/admin/TestimonialsManager";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
    const supabase = await createClient();
    const { data } = await supabase.from("testimonials").select("*").order("sort_order");

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Testimonials</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Manage stakeholder endorsements and quotes.
                </p>
            </div>
            <TestimonialsManager testimonials={data ?? []} />
        </div>
    );
}
