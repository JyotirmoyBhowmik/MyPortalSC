"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createTestimonial(formData: FormData) {
    const supabase = await createClient();
    const { error } = await supabase.from("testimonials").insert({
        name: formData.get("name") as string,
        role: formData.get("role") as string,
        organization: formData.get("organization") as string,
        quote_en: formData.get("quote_en") as string,
        quote_hi: (formData.get("quote_hi") as string) || null,
        quote_bn: (formData.get("quote_bn") as string) || null,
        featured: formData.get("featured") === "true",
        sort_order: parseInt(formData.get("sort_order") as string) || 0,
        is_published: formData.get("is_published") === "true",
    });
    if (error) return { success: false, error: error.message };
    revalidatePath("/testimonials");
    revalidatePath("/executive-summary");
    revalidatePath("/admin/testimonials");
    return { success: true };
}

export async function updateTestimonial(id: string, formData: FormData) {
    const supabase = await createClient();
    const { error } = await supabase.from("testimonials").update({
        name: formData.get("name") as string,
        role: formData.get("role") as string,
        organization: formData.get("organization") as string,
        quote_en: formData.get("quote_en") as string,
        quote_hi: (formData.get("quote_hi") as string) || null,
        quote_bn: (formData.get("quote_bn") as string) || null,
        featured: formData.get("featured") === "true",
        sort_order: parseInt(formData.get("sort_order") as string) || 0,
        is_published: formData.get("is_published") === "true",
    }).eq("id", id);
    if (error) return { success: false, error: error.message };
    revalidatePath("/testimonials");
    revalidatePath("/executive-summary");
    revalidatePath("/admin/testimonials");
    return { success: true };
}

export async function deleteTestimonial(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) return { success: false, error: error.message };
    revalidatePath("/testimonials");
    revalidatePath("/executive-summary");
    revalidatePath("/admin/testimonials");
    return { success: true };
}

export async function createTimelineEntry(formData: FormData) {
    const supabase = await createClient();
    const { error } = await supabase.from("timeline_entries").insert({
        year_start: parseInt(formData.get("year_start") as string),
        year_end: formData.get("year_end") ? parseInt(formData.get("year_end") as string) : null,
        title_en: formData.get("title_en") as string,
        title_hi: (formData.get("title_hi") as string) || null,
        title_bn: (formData.get("title_bn") as string) || null,
        organization: formData.get("organization") as string,
        description_en: (formData.get("description_en") as string) || null,
        description_hi: (formData.get("description_hi") as string) || null,
        description_bn: (formData.get("description_bn") as string) || null,
        entry_type: formData.get("entry_type") as string || "role",
        sort_order: parseInt(formData.get("sort_order") as string) || 0,
        is_published: formData.get("is_published") === "true",
    });
    if (error) return { success: false, error: error.message };
    revalidatePath("/timeline");
    revalidatePath("/admin/timeline");
    return { success: true };
}

export async function updateTimelineEntry(id: string, formData: FormData) {
    const supabase = await createClient();
    const { error } = await supabase.from("timeline_entries").update({
        year_start: parseInt(formData.get("year_start") as string),
        year_end: formData.get("year_end") ? parseInt(formData.get("year_end") as string) : null,
        title_en: formData.get("title_en") as string,
        title_hi: (formData.get("title_hi") as string) || null,
        title_bn: (formData.get("title_bn") as string) || null,
        organization: formData.get("organization") as string,
        description_en: (formData.get("description_en") as string) || null,
        description_hi: (formData.get("description_hi") as string) || null,
        description_bn: (formData.get("description_bn") as string) || null,
        entry_type: formData.get("entry_type") as string || "role",
        sort_order: parseInt(formData.get("sort_order") as string) || 0,
        is_published: formData.get("is_published") === "true",
    }).eq("id", id);
    if (error) return { success: false, error: error.message };
    revalidatePath("/timeline");
    revalidatePath("/admin/timeline");
    return { success: true };
}

export async function deleteTimelineEntry(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("timeline_entries").delete().eq("id", id);
    if (error) return { success: false, error: error.message };
    revalidatePath("/timeline");
    revalidatePath("/admin/timeline");
    return { success: true };
}
export async function updateTestimonialOrder(items: { id: string; sort_order: number }[]) {
    const supabase = await createClient();

    // Using upsert for batch updates is efficient
    const { error } = await supabase.from("testimonials").upsert(
        items.map((item) => ({
            id: item.id,
            sort_order: item.sort_order,
            updated_at: new Date().toISOString(),
        })),
        { onConflict: "id", ignoreDuplicates: false }
    );

    if (error) return { success: false, error: error.message };

    revalidatePath("/testimonials");
    revalidatePath("/executive-summary");
    revalidatePath("/admin/testimonials");
    return { success: true };
}

export async function updateTimelineOrder(items: { id: string; sort_order: number }[]) {
    const supabase = await createClient();

    const { error } = await supabase.from("timeline_entries").upsert(
        items.map((item) => ({
            id: item.id,
            sort_order: item.sort_order,
            updated_at: new Date().toISOString(),
        })),
        { onConflict: "id", ignoreDuplicates: false }
    );

    if (error) return { success: false, error: error.message };

    revalidatePath("/timeline");
    revalidatePath("/admin/timeline");
    return { success: true };
}
