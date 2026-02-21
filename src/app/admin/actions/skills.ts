"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { InsertTables, UpdateTables } from "@/lib/database.types";

export async function createSkill(
    data: Omit<InsertTables<"skills">, "id" | "created_at" | "updated_at">
) {
    const supabase = await createClient();
    const { error } = await supabase.from("skills").insert(data);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/skills");
    revalidatePath("/about");
    revalidatePath("/");
}

export async function updateSkill(
    id: string,
    data: UpdateTables<"skills">
) {
    const supabase = await createClient();
    const { error } = await supabase.from("skills").update(data).eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/skills");
    revalidatePath("/about");
    revalidatePath("/");
}

export async function deleteSkill(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/skills");
    revalidatePath("/about");
    revalidatePath("/");
}

export async function reorderSkills(
    orderedIds: { id: string; sort_order: number }[]
) {
    const supabase = await createClient();

    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const updates = orderedIds.map((item) =>
        supabase.from("skills").update({ sort_order: item.sort_order }).eq("id", item.id)
    );

    await Promise.all(updates);

    revalidatePath("/admin/skills");
    revalidatePath("/about");
    revalidatePath("/");
}
