"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createBlogPost(formData: FormData) {
    const supabase = await createClient();
    const title = formData.get("title") as string;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const { error } = await supabase.from("blog_posts").insert({
        title,
        slug,
        excerpt: (formData.get("excerpt") as string) || null,
        content: formData.get("content") as string,
        category: (formData.get("category") as string) || "general",
        reading_time: parseInt(formData.get("reading_time") as string) || 5,
        is_published: formData.get("is_published") === "true",
        published_at: formData.get("is_published") === "true" ? new Date().toISOString() : null,
    });
    if (error) return { success: false, error: error.message };
    revalidatePath("/blog");
    revalidatePath("/admin/blog");
    return { success: true };
}

export async function updateBlogPost(id: string, formData: FormData) {
    const supabase = await createClient();
    const { error } = await supabase.from("blog_posts").update({
        title: formData.get("title") as string,
        excerpt: (formData.get("excerpt") as string) || null,
        content: formData.get("content") as string,
        category: (formData.get("category") as string) || "general",
        reading_time: parseInt(formData.get("reading_time") as string) || 5,
        is_published: formData.get("is_published") === "true",
        published_at: formData.get("is_published") === "true" ? new Date().toISOString() : null,
    }).eq("id", id);
    if (error) return { success: false, error: error.message };
    revalidatePath("/blog");
    revalidatePath("/admin/blog");
    return { success: true };
}

export async function deleteBlogPost(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) return { success: false, error: error.message };
    revalidatePath("/blog");
    revalidatePath("/admin/blog");
    return { success: true };
}

export async function createCaseStudy(formData: FormData) {
    const supabase = await createClient();
    const title = formData.get("title") as string;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const { error } = await supabase.from("case_studies").insert({
        title, slug,
        client: (formData.get("client") as string) || null,
        industry: (formData.get("industry") as string) || null,
        challenge: (formData.get("challenge") as string) || null,
        solution: (formData.get("solution") as string) || null,
        outcome: (formData.get("outcome") as string) || null,
        duration: (formData.get("duration") as string) || null,
        is_published: formData.get("is_published") === "true",
        sort_order: parseInt(formData.get("sort_order") as string) || 0,
    });
    if (error) return { success: false, error: error.message };
    revalidatePath("/case-studies");
    revalidatePath("/admin/case-studies");
    return { success: true };
}

export async function updateCaseStudy(id: string, formData: FormData) {
    const supabase = await createClient();
    const { error } = await supabase.from("case_studies").update({
        title: formData.get("title") as string,
        client: (formData.get("client") as string) || null,
        industry: (formData.get("industry") as string) || null,
        challenge: (formData.get("challenge") as string) || null,
        solution: (formData.get("solution") as string) || null,
        outcome: (formData.get("outcome") as string) || null,
        duration: (formData.get("duration") as string) || null,
        is_published: formData.get("is_published") === "true",
        sort_order: parseInt(formData.get("sort_order") as string) || 0,
    }).eq("id", id);
    if (error) return { success: false, error: error.message };
    revalidatePath("/case-studies");
    revalidatePath("/admin/case-studies");
    return { success: true };
}

export async function deleteCaseStudy(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("case_studies").delete().eq("id", id);
    if (error) return { success: false, error: error.message };
    revalidatePath("/case-studies");
    revalidatePath("/admin/case-studies");
    return { success: true };
}

export async function updateContactStatus(id: string, status: string, notes?: string) {
    const supabase = await createClient();
    const update: Record<string, string> = { status };
    if (notes !== undefined) update.notes = notes;
    const { error } = await supabase.from("contact_submissions").update(update).eq("id", id);
    if (error) return { success: false, error: error.message };
    revalidatePath("/admin/contacts");
    return { success: true };
}

export async function deleteContact(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
    if (error) return { success: false, error: error.message };
    revalidatePath("/admin/contacts");
    return { success: true };
}
