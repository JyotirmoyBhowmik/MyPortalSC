"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function uploadMedia(formData: FormData) {
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

    // 2. Get Public URL
    const { data: { publicUrl } } = supabase.storage
        .from("media")
        .getPublicUrl(filePath);

    // 3. Insert into Database
    const { error: dbError } = await supabase.from("media_library").insert({
        original_name: file.name,
        storage_path: filePath,
        public_url: publicUrl,
        mime_type: file.type,
        size_bytes: file.size,
        folder: "uploads", // Default folder for now
    });

    if (dbError) {
        console.error("DB error:", dbError);
        return { success: false, error: "Failed to save file metadata" };
    }

    revalidatePath("/admin/media");
    return { success: true, publicUrl };
}

export async function deleteMedia(id: string, storagePath: string) {
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
