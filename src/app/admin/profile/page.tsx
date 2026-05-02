import { createClient } from "@/lib/supabase/server";
import ProfilePhotoManager from "@/components/admin/ProfilePhotoManager";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Profile Photo — Admin",
};

export default async function AdminProfilePage() {
    const supabase = await createClient();

    let currentPhotoUrl = "";
    try {
        const { data } = await supabase
            .from("site_settings")
            .select("value")
            .eq("key", "profile_photo_url")
            .single();
        currentPhotoUrl = (data?.value as string) || "";
    } catch {
        // Row may not exist yet — that's fine
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Profile Photo</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Manage the professional photo shown on the public About Me page.
                </p>
            </div>
            <ProfilePhotoManager currentPhotoUrl={currentPhotoUrl} />
        </div>
    );
}
