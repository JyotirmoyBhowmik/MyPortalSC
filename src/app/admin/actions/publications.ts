"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createPublication(formData: FormData) {
    const supabase = await createClient();
    const { error } = await supabase.from("publications").insert({
        title: formData.get("title") as string,
        publication_type: (formData.get("publication_type") as string) || "paper",
        publisher: (formData.get("publisher") as string) || null,
        published_date: (formData.get("published_date") as string) || null,
        url: (formData.get("url") as string) || null,
        description: (formData.get("description") as string) || null,
        is_published: formData.get("is_published") === "true",
    });
    if (error) throw new Error(error.message);
    revalidatePath("/admin/publications");
    revalidatePath("/publications");
}

export async function updatePublication(id: string, formData: FormData) {
    const supabase = await createClient();
    const { error } = await supabase.from("publications").update({
        title: formData.get("title") as string,
        publication_type: (formData.get("publication_type") as string) || "paper",
        publisher: (formData.get("publisher") as string) || null,
        published_date: (formData.get("published_date") as string) || null,
        url: (formData.get("url") as string) || null,
        description: (formData.get("description") as string) || null,
        is_published: formData.get("is_published") === "true",
    }).eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/publications");
    revalidatePath("/publications");
}

export async function deletePublication(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("publications").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/publications");
    revalidatePath("/publications");
}
