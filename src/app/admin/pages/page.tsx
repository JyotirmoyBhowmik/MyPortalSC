import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PagesManager from "@/components/admin/PagesManager";
import { getFeatureFlag } from "@/lib/data/settings";

export default async function PagesAdminHub() {
    const supabase = await createClient();

    // Check auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect("/admin/login");
    }

    // Verify admin
    const { data: adminUser } = await supabase
        .from("admin_users")
        .select("role")
        .eq("user_id", user.id)
        .single();

    if (!adminUser || (adminUser.role !== "super_admin" && adminUser.role !== "admin" && adminUser.role !== "editor")) {
        redirect("/");
    }

    // Fetch existing settings & feature flags
    const [aboutRes, contactRes, allowVersioning, allowScheduledPublish] = await Promise.all([
        supabase.from("content_pages").select("content").eq("page_key", "about").single(),
        supabase.from("content_pages").select("content").eq("page_key", "contact").single(),
        getFeatureFlag("feature_content_versioning"),
        getFeatureFlag("feature_scheduled_publish"),
    ]);

    const initialAbout = (aboutRes.data?.content || {}) as Record<string, string | number | boolean | null | undefined>;
    const initialContact = (contactRes.data?.content || {}) as Record<string, string | number | boolean | null | undefined>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                    Pages Content Manager
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Manage the static strings, videos, and fields powering the core portfolio pages.
                </p>
            </div>

            <PagesManager
                initialAbout={initialAbout}
                initialContact={initialContact}
                allowVersioning={allowVersioning}
                allowScheduledPublish={allowScheduledPublish}
            />
        </div>
    );
}
