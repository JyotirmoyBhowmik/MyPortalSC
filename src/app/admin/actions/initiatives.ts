"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/* ─── Initiatives ─── */

export async function createInitiative(formData: FormData) {
    const supabase = await createClient();

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string ||
        `${Date.now()}-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
    const program_id = formData.get("program_id") as string || null;
    const fiscal_year = formData.get("fiscal_year") as string;
    const strategic_area = formData.get("strategic_area") as string;
    const criticality = formData.get("criticality") as string || "Medium";
    const delivery_focus = formData.get("delivery_focus") as string || null;
    const status = formData.get("status") as string || "published";
    const order_index = parseInt(formData.get("order_index") as string || "0", 10);

    const { error } = await supabase.from("initiatives").insert({
        title,
        slug,
        program_id: program_id || null,
        fiscal_year,
        strategic_area,
        criticality,
        delivery_focus,
        status,
        order_index,
    });

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/initiatives");
    revalidatePath("/admin/initiatives");
    return { success: true };
}

export async function updateInitiative(id: string, formData: FormData) {
    const supabase = await createClient();

    const updates: Record<string, unknown> = {};
    const fields = [
        "title", "slug", "program_id", "fiscal_year",
        "strategic_area", "criticality", "delivery_focus",
        "status",
    ];

    for (const field of fields) {
        const value = formData.get(field);
        if (value !== null) {
            updates[field] = value === "" ? null : value;
        }
    }

    const orderIndex = formData.get("order_index");
    if (orderIndex !== null) {
        updates.order_index = parseInt(orderIndex as string, 10);
    }

    const { error } = await supabase
        .from("initiatives")
        .update(updates)
        .eq("id", id);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/initiatives");
    revalidatePath("/admin/initiatives");
    return { success: true };
}

export async function deleteInitiative(id: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("initiatives")
        .delete()
        .eq("id", id);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/initiatives");
    revalidatePath("/admin/initiatives");
    return { success: true };
}

/* ─── Programs ─── */

export async function createProgram(formData: FormData) {
    const supabase = await createClient();

    const { error } = await supabase.from("programs").insert({
        code: formData.get("code") as string,
        name: formData.get("name") as string,
        description: formData.get("description") as string || null,
        icon: formData.get("icon") as string || "📋",
        order_index: parseInt(formData.get("order_index") as string || "0", 10),
    });

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/initiatives");
    revalidatePath("/admin/initiatives");
    return { success: true };
}

export async function updateProgram(id: string, formData: FormData) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("programs")
        .update({
            code: formData.get("code") as string,
            name: formData.get("name") as string,
            description: formData.get("description") as string || null,
            icon: formData.get("icon") as string || "📋",
            order_index: parseInt(formData.get("order_index") as string || "0", 10),
        })
        .eq("id", id);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/initiatives");
    revalidatePath("/admin/initiatives");
    return { success: true };
}

export async function deleteProgram(id: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("programs")
        .delete()
        .eq("id", id);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/initiatives");
    revalidatePath("/admin/initiatives");
    return { success: true };
}

export async function reorderInitiatives(
    orderedIds: { id: string; sort_order: number }[]
) {
    const supabase = await createClient();

    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase.from("initiatives").upsert(
        orderedIds.map((item) => ({
            id: item.id,
            order_index: item.sort_order,
        })),
        { onConflict: "id", ignoreDuplicates: false }
    );
    if (error) throw new Error(error.message);

    revalidatePath("/admin/initiatives");
    revalidatePath("/initiatives");
}

export async function reorderPrograms(
    orderedIds: { id: string; sort_order: number }[]
) {
    const supabase = await createClient();

    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase.from("programs").upsert(
        orderedIds.map((item) => ({
            id: item.id,
            order_index: item.sort_order,
        })),
        { onConflict: "id", ignoreDuplicates: false }
    );
    if (error) throw new Error(error.message);

    revalidatePath("/admin/initiatives");
    revalidatePath("/initiatives");
}
