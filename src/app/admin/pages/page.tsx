import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PagesManager from "@/components/admin/PagesManager";

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

    // Fetch existing settings
    const [aboutRes, contactRes] = await Promise.all([
        supabase.from("content_pages").select("content").eq("page_key", "about").single(),
        supabase.from("content_pages").select("content").eq("page_key", "contact").single()
    ]);

    const initialAbout = (aboutRes.data?.content || {}) as Record<string, any>;
    const initialContact = (contactRes.data?.content || {}) as Record<string, any>;

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

            <PagesManager initialAbout={initialAbout} initialContact={initialContact} />
        </div>
    );
}
