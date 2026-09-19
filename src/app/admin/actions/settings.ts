"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function toggleFeature(key: string, enabled: boolean) {
    const supabase = await createClient();

    // Validate caller is authorized super_admin
    const { data: { user: caller } } = await supabase.auth.getUser();
    if (!caller) return { success: false, error: "Unauthorized" };

    const { data: callerRecord } = await supabase.from("admin_users").select("role").eq("user_id", caller.id).single();
    if (!callerRecord || callerRecord.role !== "super_admin") {
        return { success: false, error: "Insufficient permissions to toggle features." };
    }

    const { data: existing } = await supabase
        .from("site_settings")
        .select("id")
        .eq("key", key)
        .maybeSingle();

    let error;
    if (existing) {
        const res = await supabase
            .from("site_settings")
            .update({ value: enabled })
            .eq("key", key);
        error = res.error;
    } else {
        const res = await supabase
            .from("site_settings")
            .insert({
                key,
                value: enabled,
                label: key.replace(/^feature_/, "").replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
                category: "content",
            });
        error = res.error;
    }

    if (error) {
        return { success: false, error: error.message };
    }

    // Revalidate settings cache tag and pages
    (revalidateTag as any)("settings");
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

    const { data: existing } = await supabase
        .from("site_settings")
        .select("id")
        .eq("key", key)
        .maybeSingle();

    let error;
    if (existing) {
        const res = await supabase
            .from("site_settings")
            .update({ value: JSON.parse(JSON.stringify(value)) })
            .eq("key", key);
        error = res.error;
    } else {
        const res = await supabase
            .from("site_settings")
            .insert({
                key,
                value: JSON.parse(JSON.stringify(value)),
                label: key.replace(/^feature_/, "").replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
                category: "content",
            });
        error = res.error;
    }

    if (error) {
        return { success: false, error: error.message };
    }

    // Revalidate settings cache tag and pages
    (revalidateTag as any)("settings");
    revalidatePath("/", "layout");
    return { success: true };
}
