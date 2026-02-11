"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleFeature(key: string, enabled: boolean) {
    const supabase = await createClient();

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
