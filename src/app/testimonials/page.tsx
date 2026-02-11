import { createClient } from "@/lib/supabase/server";
import TestimonialsContent from "@/components/executive/TestimonialsContent";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Testimonials | Jyotirmoy Bhowmik",
    description: "Endorsements from stakeholders, CXOs, and industry peers.",
};

export default async function TestimonialsPage() {
    const supabase = await createClient();
    const { data } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_published", true)
        .order("sort_order");

    return (
        <main className="min-h-screen pt-24 pb-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <TestimonialsContent testimonials={data ?? []} />
            </div>
        </main>
    );
}
