"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updatePageContent(pageKey: string, newContent: Record<string, string | number | boolean | null | undefined | Record<string, unknown> | unknown[]>) {
    const supabase = await createClient();

    // 1. Validate caller is an admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const { data: adminRecord } = await supabase
        .from("admin_users")
        .select("role")
        .eq("user_id", user.id)
        .single();

    if (!adminRecord || (adminRecord.role !== "super_admin" && adminRecord.role !== "admin" && adminRecord.role !== "editor")) {
        return { success: false, error: "Insufficient permissions to edit pages." };
    }

    // 2. Fetch existing content to merge instead of overwrite wholesale
    const { data: existingPage } = await supabase
        .from("content_pages")
        .select("content")
        .eq("page_key", pageKey)
        .single();

    let mergedContent = { ...newContent };

    // If the page already exists, merge the new fields into the old ones
    if (existingPage && existingPage.content && typeof existingPage.content === "object" && !Array.isArray(existingPage.content)) {
        mergedContent = { ...existingPage.content, ...newContent };
    }

    // 3. Upsert the data
    const { error } = await supabase
        .from("content_pages")
        .upsert({
            page_key: pageKey,
            content: mergedContent,
            title: pageKey.charAt(0).toUpperCase() + pageKey.slice(1) // basic title fallback
        }, { onConflict: 'page_key' });

    if (error) {
        return { success: false, error: error.message };
    }

    // Revalidate the frontend paths to reflect changes immediately
    revalidatePath(`/${pageKey === "home" ? "" : pageKey}`);
    return { success: true };
}
