"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function inviteUser(email: string, role: string) {
    const supabase = await createClient();

    try {
        // Authenticate the current user to verify they have permission to invite
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, error: "Unauthorized" };

        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!serviceRoleKey || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
            return {
                success: false,
                error: "SUPABASE_SERVICE_ROLE_KEY is not configured on the server. Please add it to your environment variables to invite users."
            };
        }

        const adminAuthClient = createSupabaseClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            serviceRoleKey,
            { auth: { autoRefreshToken: false, persistSession: false } }
        );

        // 1. Send invitation via Supabase Auth Admin API
        const { data: inviteData, error: inviteError } = await adminAuthClient.auth.admin.inviteUserByEmail(email);

        if (inviteError) {
            // Check if user already exists
            if (inviteError.message.includes("already registered")) {
                return { success: false, error: "A user with this email is already registered." };
            }
            return { success: false, error: inviteError.message };
        }

        if (!inviteData.user?.id) {
            return { success: false, error: "Failed to retrieve user ID from invitation." };
        }

        // 2. Add the user to the admin_users table with the selected role
        // We use adminAuthClient here to bypass RLS, since we just created the user
        const { error: insertError } = await adminAuthClient.from("admin_users").insert({
            user_id: inviteData.user.id,
            role: role
        });

        if (insertError) {
            // Try to cleanup auth user if admin_users insert fails
            await adminAuthClient.auth.admin.deleteUser(inviteData.user.id);
            return { success: false, error: "Failed to set user role. " + insertError.message };
        }

        revalidatePath("/admin/users");
        return { success: true };

    } catch (error: any) {
        return { success: false, error: error.message || "An unexpected error occurred." };
    }
}

export async function updateUserRole(userId: string, role: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("admin_users")
        .update({ role })
        .eq("user_id", userId);

    if (error) return { success: false, error: error.message };
    revalidatePath("/admin/users");
    return { success: true };
}

export async function removeUser(userId: string) {
    const supabase = await createClient();

    // Check if we have service role to also delete from Auth
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (serviceRoleKey && process.env.NEXT_PUBLIC_SUPABASE_URL) {
        const adminAuthClient = createSupabaseClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            serviceRoleKey,
            { auth: { autoRefreshToken: false, persistSession: false } }
        );
        // Optionally delete the auth user so they can't login at all
        // Only do this if they shouldn't have ANY access. If they can still be a normal user, skip this.
        // For an admin portal, usually we want to delete them.
        await adminAuthClient.auth.admin.deleteUser(userId);
    }

    // Delete from admin_users
    const { error } = await supabase
        .from("admin_users")
        .delete()
        .eq("user_id", userId);

    if (error) return { success: false, error: error.message };
    revalidatePath("/admin/users");
    return { success: true };
}
