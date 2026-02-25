"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getFeatureFlag } from "@/lib/data/settings";

export async function uploadMedia(formData: FormData) {
    const isLibraryEnabled = await getFeatureFlag("feature_media_library");
    if (!isLibraryEnabled) {
        return { success: false, error: "Media Library is currently disabled." };
    }

    const supabase = await createClient();
    const file = formData.get("file") as File;

    if (!file) {
        return { success: false, error: "No file provided" };
    }

    // 1. Upload to Supabase Storage
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, file);

    if (uploadError) {
        console.error("Upload error:", uploadError);
        return { success: false, error: "Failed to upload file to storage" };
    }

    // 2. Determine correct Public URL based on Feature Toggles
    const { data: settings } = await supabase.from("site_settings").select("feature_secure_storage").single();
    const useProxy = settings?.feature_secure_storage ?? false;

    let finalPublicUrl = "";
    if (useProxy) {
        finalPublicUrl = `/api/media/${filePath}`;
    } else {
        const { data: { publicUrl } } = supabase.storage
            .from("media")
            .getPublicUrl(filePath);
        finalPublicUrl = publicUrl;
    }

    // 3. Insert into Database
    const { error: dbError } = await supabase.from("media_library").insert({
        original_name: file.name,
        storage_path: filePath,
        public_url: finalPublicUrl,
        mime_type: file.type,
        size_bytes: file.size,
        folder: "uploads", // Default folder for now
    });

    if (dbError) {
        console.error("DB error:", dbError);
        return { success: false, error: "Failed to save file metadata" };
    }

    revalidatePath("/admin/media");
    return { success: true, publicUrl: finalPublicUrl };
}

export async function registerMedia(formData: FormData) {
    const isLibraryEnabled = await getFeatureFlag("feature_media_library");
    if (!isLibraryEnabled) {
        return { success: false, error: "Media Library is currently disabled." };
    }

    const supabase = await createClient();

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, error: "Unauthorized" };
    }

    const { data: adminUser } = await supabase
        .from("admin_users")
        .select("role")
        .eq("id", user.id)
        .single();

    if (!adminUser || !["super_admin", "admin", "editor"].includes(adminUser.role)) {
        return { success: false, error: "Insufficient permissions to register media" };
    }

    const original_name = formData.get("file_name") as string;
    const storage_path = formData.get("storage_path") as string;
    const public_url = formData.get("public_url") as string;
    const mime_type = formData.get("mime_type") as string;
    const size_bytes = parseInt(formData.get("size_bytes") as string, 10);

    const { error: dbError } = await supabase.from("media_library").insert({
        original_name,
        storage_path,
        public_url,
        mime_type,
        size_bytes,
        folder: "uploads", // Default folder
    });

    if (dbError) {
        console.error("DB error:", dbError);
        return { success: false, error: "Failed to save file metadata" };
    }

    revalidatePath("/admin/media");
    return { success: true };
}

export async function deleteMedia(id: string, storagePath: string) {
    const isLibraryEnabled = await getFeatureFlag("feature_media_library");
    if (!isLibraryEnabled) {
        return { success: false, error: "Media Library is currently disabled." };
    }

    const supabase = await createClient();

    // 1. Delete from Storage
    const { error: storageError } = await supabase.storage
        .from("media")
        .remove([storagePath]);

    if (storageError) {
        console.error("Storage delete error:", storageError);
        return { success: false, error: "Failed to delete file from storage" };
    }

    // 2. Delete from Database
    const { error: dbError } = await supabase.from("media_library").delete().eq("id", id);

    if (dbError) {
        return { success: false, error: "Failed to delete file metadata" };
    }

    revalidatePath("/admin/media");
    return { success: true };
}

export async function getMedia() {
    const supabase = await createClient();
    const { data } = await supabase.from("media_library").select("*").order("created_at", { ascending: false });
    return data || [];
}
