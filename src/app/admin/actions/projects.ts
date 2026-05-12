"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { InsertTables, UpdateTables } from "@/lib/database.types";

export async function createProject<T extends Record<string, any>>(
    data: Omit<InsertTables<"projects">, "id" | "created_at" | "updated_at">
) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("projects").insert({
        ...data,
        created_by: user?.id,
    });

    if (error) throw new Error(error.message);
    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath("/");
}

export async function updateProject(
    id: string,
    data: UpdateTables<"projects">
) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("projects")
        .update(data)
        .eq("id", id);

    if (error) throw new Error(error.message);
    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath("/");
}

export async function deleteProject(id: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", id);

    if (error) throw new Error(error.message);
    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath("/");
}

export async function toggleProjectStatus(
    id: string,
    currentStatus: string
) {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    await updateProject(id, { status: newStatus as "draft" | "published" });
}

export async function reorderProjects(
    orderedIds: { id: string; sort_order: number }[]
) {
    const supabase = await createClient();

    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Supabase JS doesn't have a single-query batch update via REST nicely without an RPC. 
    // For small arrays (like projects), a Promise.all over single updates is acceptable.
    const updates = orderedIds.map((item) =>
        supabase.from("projects").update({ sort_order: item.sort_order }).eq("id", item.id)
    );

    await Promise.all(updates);

    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath("/");
}
