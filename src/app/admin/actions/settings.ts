"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleFeature(key: string, enabled: boolean) {
    const supabase = await createClient();

    // Validate caller is authorized super_admin
    const { data: { user: caller } } = await supabase.auth.getUser();
    if (!caller) return { success: false, error: "Unauthorized" };

    const { data: callerRecord } = await supabase.from("admin_users").select("role").eq("user_id", caller.id).single();
    if (!callerRecord || callerRecord.role !== "super_admin") {
        return { success: false, error: "Insufficient permissions to toggle features." };
    }

    const { error } = await supabase
        .from("site_settings")
        .update({ value: enabled })
        .eq("key", key);

    if (error) {
        return { success: false, error: error.message };
    }

    // Revalidate everything since features affect many pages
    revalidatePath("/", "layout");
    return { success: true };
}

export async function updateSettingValue(key: string, value: unknown) {
    const supabase = await createClient();

    // Validate caller is authorized super_admin
    const { data: { user: caller } } = await supabase.auth.getUser();
    if (!caller) return { success: false, error: "Unauthorized" };

    const { data: callerRecord } = await supabase.from("admin_users").select("role").eq("user_id", caller.id).single();
    if (!callerRecord || callerRecord.role !== "super_admin") {
        return { success: false, error: "Insufficient permissions to update settings." };
    }

    const { error } = await supabase
        .from("site_settings")
        .update({ value: JSON.parse(JSON.stringify(value)) })
        .eq("key", key);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/", "layout");
    return { success: true };
}
