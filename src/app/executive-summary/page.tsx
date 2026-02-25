import { createClient } from "@/lib/supabase/server";
import ExecutiveSummaryContent from "@/components/executive/ExecutiveSummaryContent";
import { getFeatureFlag } from "@/lib/data/settings";
import { notFound } from "next/navigation";

export const revalidate = 60;

export const metadata = {
    title: "Executive Summary | Jyotirmoy Bhowmik",
    description: "IT Infrastructure & Project Management Leader — Board-ready executive summary with key performance indicators.",
};

export default async function ExecutiveSummaryPage() {
    const isEnabled = await getFeatureFlag("feature_executive_summary");
    if (!isEnabled) notFound();

    const allowPdf = await getFeatureFlag("feature_pdf_export");

    const supabase = await createClient();

    const [kpisRes, testimonialsRes] = await Promise.all([
        supabase.from("executive_kpis").select("*").eq("is_published", true).order("sort_order"),
        supabase.from("testimonials").select("*").eq("is_published", true).eq("featured", true).order("sort_order"),
    ]);

    return (
        <main className="min-h-screen pt-24 pb-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <ExecutiveSummaryContent
                    kpis={kpisRes.data ?? []}
                    testimonials={testimonialsRes.data ?? []}
                    allowPdf={allowPdf}
                />
            </div>
        </main>
    );
}
