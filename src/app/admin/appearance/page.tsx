import AppearanceManager from "@/components/admin/AppearanceManager";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminAppearancePage() {
    const supabase = await createClient();

    let currentIcon = "";
    try {
        const { data } = await supabase
            .from("site_settings")
            .select("value")
            .eq("key", "site_icon")
            .single();
        currentIcon = (data?.value as string) || "";
    } catch {
        // site_icon row may not exist yet
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Appearance</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Customize the visual identity of your portfolio — icon, branding, and template.
                </p>
            </div>
            <AppearanceManager currentIcon={currentIcon} />
        </div>
    );
}
