"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function inviteUser(email: string, role: string, providedFullName?: string) {
    const supabase = await createClient();

    try {
        // Authenticate the current user to verify they have permission to invite
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, error: "Unauthorized" };

        const { data: callerRecord } = await supabase.from("admin_users").select("role").eq("user_id", user.id).single();
        if (!callerRecord || callerRecord.role !== "super_admin") {
            return { success: false, error: "Insufficient permissions to invite users." };
        }

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
        // Derive a display name from the email (e.g. "john.doe@example.com" → "John Doe")
        const namePart = (providedFullName || email.split('@')[0]).replace(/[._-]+/g, ' ');
        const fullName = namePart
            .split(' ')
            .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ') || 'Admin User';

        const { error: insertError } = await adminAuthClient.from("admin_users").insert({
            user_id: inviteData.user.id,
            role: role,
            full_name: fullName,
        });

        if (insertError) {
            // Try to cleanup auth user if admin_users insert fails
            await adminAuthClient.auth.admin.deleteUser(inviteData.user.id);
            return { success: false, error: "Failed to set user role. " + insertError.message };
        }

        revalidatePath("/admin/users");
        return { success: true };

    } catch (error: unknown) {
        return { success: false, error: (error as Error).message || "An unexpected error occurred." };
    }
}

export async function updateUserRole(userId: string, role: string) {
    const supabase = await createClient();

    // Validate caller is authorized
    const { data: { user: caller } } = await supabase.auth.getUser();
    if (!caller) return { success: false, error: "Unauthorized" };

    const { data: callerRecord } = await supabase.from("admin_users").select("role").eq("user_id", caller.id).single();
    if (!callerRecord || callerRecord.role !== "super_admin") {
        return { success: false, error: "Insufficient permissions to change roles." };
    }

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        return { success: false, error: "Service configuration missing." };
    }

    const adminClient = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        serviceRoleKey,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { error } = await adminClient
        .from("admin_users")
        .update({ role })
        .eq("user_id", userId);

    if (error) return { success: false, error: (error as Error).message };
    revalidatePath("/admin/users");
    return { success: true };
}

export async function removeUser(userId: string) {
    const supabase = await createClient();

    // Validate caller is authorized
    const { data: { user: caller } } = await supabase.auth.getUser();
    if (!caller) return { success: false, error: "Unauthorized" };

    const { data: callerRecord } = await supabase.from("admin_users").select("role").eq("user_id", caller.id).single();
    if (!callerRecord || callerRecord.role !== "super_admin") {
        return { success: false, error: "Insufficient permissions to remove users." };
    }

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (serviceRoleKey && process.env.NEXT_PUBLIC_SUPABASE_URL) {
        const adminAuthClient = createSupabaseClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            serviceRoleKey,
            { auth: { autoRefreshToken: false, persistSession: false } }
        );

        await adminAuthClient.auth.admin.deleteUser(userId);

        const { error } = await adminAuthClient
            .from("admin_users")
            .delete()
            .eq("user_id", userId);

        if (error) return { success: false, error: (error as Error).message };
    } else {
        return { success: false, error: "Service configuration missing." };
    }

    revalidatePath("/admin/users");
    return { success: true };
}

