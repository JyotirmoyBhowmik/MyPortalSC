import { createClient } from "@/lib/supabase/server";
import CaseStudiesManager from "@/components/admin/CaseStudiesManager";

export const dynamic = "force-dynamic";

export default async function AdminCaseStudiesPage() {
    const supabase = await createClient();
    const { data } = await supabase.from("case_studies").select("*").order("sort_order");

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Case Studies</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Manage enterprise transformation case studies with measurable outcomes.
                </p>
            </div>
            <CaseStudiesManager cases={data ?? []} />
        </div>
    );
}
