import { createClient } from "@/lib/supabase/server";
import TestimonialsContent from "@/components/executive/TestimonialsContent";
import { getFeatureFlag } from "@/lib/data/settings";
import { notFound } from "next/navigation";

export const revalidate = 60;

export const metadata = {
    title: "Testimonials | Jyotirmoy Bhowmik",
    description: "Endorsements from stakeholders, CXOs, and industry peers.",
};

export default async function TestimonialsPage() {
    const isEnabled = await getFeatureFlag("feature_testimonials");
    if (!isEnabled) notFound();

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
