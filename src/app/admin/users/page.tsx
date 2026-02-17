import { createClient } from "@/lib/supabase/server";
import UsersManager from "@/components/admin/UsersManager";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
    const supabase = await createClient();
    const { data: admins } = await supabase.from("admin_users").select("*").order("created_at", { ascending: false });

    // Note: To get emails, we'd need to fetch from auth.users via admin client which we simulate or might accept as missing for now.
    // In a real app, we would join this data.

    return <UsersManager users={admins || []} />;
}
