"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";



function isValidDate(dateString: string | null): boolean {
    if (!dateString) return false;
    const date = new Date(dateString);
    return !isNaN(date.getTime());
}

export async function createBlogPost(formData: FormData) {
    const supabase = await createClient();
    const title = formData.get("title") as string;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const is_published = formData.get("is_published") === "true";
    let published_at = formData.get("published_at") as string | null;

    if (is_published && (!published_at || !isValidDate(published_at))) {
        published_at = new Date().toISOString();
    } else if (published_at && !isValidDate(published_at)) {
        return { success: false, error: "Invalid date format provided." };
    }

    const { error } = await supabase.from("blog_posts").insert({
        title,
        slug,
        excerpt: (formData.get("excerpt") as string) || null,
        content: formData.get("content") as string,
        category: (formData.get("category") as string) || "general",
        reading_time: parseInt(formData.get("reading_time") as string) || 5,
        is_published,
        published_at,
    });
    if (error) return { success: false, error: error.message };
    revalidatePath("/blog");
    revalidatePath("/admin/blog");
    return { success: true };
}

export async function updateBlogPost(id: string, formData: FormData) {
    const supabase = await createClient();
    const is_published = formData.get("is_published") === "true";
    let published_at = formData.get("published_at") as string | null;

    // If publishing for the first time or actively setting published status, ensure date is set
    // However, if we are just updating content, we might want to keep existing date if not provided in form.
    // Simplifying logic: if form provides date, use it. If is_published is true and no date, default to now only if it was null before? 
    // For simplicity: if is_published and no date provided, default to now.
    if (is_published && (!published_at || !isValidDate(published_at))) {
        // If publishing and no valid date, default to now
        published_at = new Date().toISOString();
    } else if (published_at && !isValidDate(published_at)) {
        return { success: false, error: "Invalid date format provided." };
    }

    const { error } = await supabase.from("blog_posts").update({
        title: formData.get("title") as string,
        excerpt: (formData.get("excerpt") as string) || null,
        content: formData.get("content") as string,
        category: (formData.get("category") as string) || "general",
        reading_time: parseInt(formData.get("reading_time") as string) || 5,
        is_published,
        published_at,
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
    const is_published = formData.get("is_published") === "true";
    let published_at = formData.get("published_at") as string | null;

    if (is_published && (!published_at || !isValidDate(published_at))) {
        published_at = new Date().toISOString();
    } else if (published_at && !isValidDate(published_at)) {
        return { success: false, error: "Invalid date format provided." };
    }

    const { error } = await supabase.from("case_studies").insert({
        title, slug,
        client: (formData.get("client") as string) || null,
        industry: (formData.get("industry") as string) || null,
        challenge: (formData.get("challenge") as string) || null,
        solution: (formData.get("solution") as string) || null,
        outcome: (formData.get("outcome") as string) || null,
        duration: (formData.get("duration") as string) || null,
        is_published,
        published_at,
        sort_order: parseInt(formData.get("sort_order") as string) || 0,
    });
    if (error) return { success: false, error: error.message };
    revalidatePath("/case-studies");
    revalidatePath("/admin/case-studies");
    return { success: true };
}

export async function updateCaseStudy(id: string, formData: FormData) {
    const supabase = await createClient();
    const is_published = formData.get("is_published") === "true";
    let published_at = formData.get("published_at") as string | null;

    if (is_published && (!published_at || !isValidDate(published_at))) {
        published_at = new Date().toISOString();
    } else if (published_at && !isValidDate(published_at)) {
        return { success: false, error: "Invalid date format provided." };
    }

    const { error } = await supabase.from("case_studies").update({
        title: formData.get("title") as string,
        client: (formData.get("client") as string) || null,
        industry: (formData.get("industry") as string) || null,
        challenge: (formData.get("challenge") as string) || null,
        solution: (formData.get("solution") as string) || null,
        outcome: (formData.get("outcome") as string) || null,
        duration: (formData.get("duration") as string) || null,
        is_published,
        published_at,
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
