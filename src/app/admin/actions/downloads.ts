"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createDownload(formData: FormData) {
    const supabase = await createClient();
    const { error } = await supabase.from("downloads").insert({
        title: formData.get("title") as string,
        description: (formData.get("description") as string) || null,
        file_url: formData.get("file_url") as string,
        file_size: (formData.get("file_size") as string) || null,
        file_type: (formData.get("file_type") as string) || "pdf",
        category: (formData.get("category") as string) || "general",
        is_published: formData.get("is_published") === "true",
    });
    if (error) throw new Error(error.message);
    revalidatePath("/admin/downloads");
    revalidatePath("/downloads");
}

export async function updateDownload(id: string, formData: FormData) {
    const supabase = await createClient();
    const { error } = await supabase.from("downloads").update({
        title: formData.get("title") as string,
        description: (formData.get("description") as string) || null,
        file_url: formData.get("file_url") as string,
        file_size: (formData.get("file_size") as string) || null,
        file_type: (formData.get("file_type") as string) || "pdf",
        category: (formData.get("category") as string) || "general",
        is_published: formData.get("is_published") === "true",
    }).eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/downloads");
    revalidatePath("/downloads");
}

export async function deleteDownload(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("downloads").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/downloads");
    revalidatePath("/downloads");
}
