"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function uploadSiteIcon(formData: FormData) {
    const supabase = await createClient();
    const file = formData.get("icon") as File;

    if (!file || file.size === 0) {
        return { success: false, error: "No file provided." };
    }

    // Validate file type
    const allowed = ["image/png", "image/x-icon", "image/svg+xml", "image/jpeg", "image/webp"];
    if (!allowed.includes(file.type)) {
        return { success: false, error: "Invalid file type. Please upload PNG, ICO, SVG, JPEG, or WebP." };
    }

    // Max 512KB
    if (file.size > 512 * 1024) {
        return { success: false, error: "File too large. Maximum size is 512KB." };
    }

    const fileExt = file.name.split(".").pop() || "png";
    const fileName = `site-icon-${Date.now()}.${fileExt}`;
    const filePath = `branding/${fileName}`;

    // Ensure the storage bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    if (!buckets?.find((b) => b.name === "media")) {
        await supabase.storage.createBucket("media", { public: true });
    }

    // Upload to Supabase storage
    const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, file, { upsert: true });

    if (uploadError) {
        console.error("Icon upload error:", uploadError);
        return { success: false, error: "Failed to upload icon." };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from("media")
        .getPublicUrl(filePath);

    // Save to site_settings
    const { error: upsertError } = await supabase
        .from("site_settings")
        .upsert(
            { key: "site_icon", value: publicUrl, category: "appearance" },
            { onConflict: "key" }
        );

    if (upsertError) {
        console.error("Settings upsert error:", upsertError);
        return { success: false, error: "Failed to save icon setting." };
    }

    revalidatePath("/admin/appearance");
    revalidatePath("/");
    return { success: true, url: publicUrl };
}

export async function resetSiteIcon() {
    const supabase = await createClient();

    await supabase
        .from("site_settings")
        .upsert(
            { key: "site_icon", value: "", category: "appearance" },
            { onConflict: "key" }
        );

    revalidatePath("/admin/appearance");
    revalidatePath("/");
    return { success: true };
}
