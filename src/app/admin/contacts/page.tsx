import { createClient } from "@/lib/supabase/server";
import ContactsManager from "@/components/admin/ContactsManager";
import { getFeatureFlag } from "@/lib/data/settings";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminContactsPage() {
    const isEnabled = await getFeatureFlag("feature_contact_crm");
    if (!isEnabled) notFound();

    const showAnalytics = await getFeatureFlag("feature_contact_analytics");

    const supabase = await createClient();
    const { data: contacts } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

    const statusColors: Record<string, string> = {
        new: "bg-blue-500/15 text-blue-400",
        read: "bg-amber-500/15 text-amber-400",
        replied: "bg-green-500/15 text-green-400",
        archived: "bg-gray-500/15 text-gray-400",
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Contacts CRM</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Manage contact form submissions and correspondence.
                </p>
            </div>

            <ContactsManager contacts={contacts || []} showAnalytics={showAnalytics} />
        </div>
    );
}
