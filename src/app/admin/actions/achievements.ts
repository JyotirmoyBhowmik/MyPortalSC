"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { InsertTables, UpdateTables } from "@/lib/database.types";

export async function createAchievement(
    data: Omit<InsertTables<"achievements">, "id" | "created_at" | "updated_at">
) {
    const supabase = await createClient();
    const { error } = await supabase.from("achievements").insert(data);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/achievements");
    revalidatePath("/about");
}

export async function updateAchievement(
    id: string,
    data: UpdateTables<"achievements">
) {
    const supabase = await createClient();
    const { error } = await supabase.from("achievements").update(data).eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/achievements");
    revalidatePath("/about");
}

export async function deleteAchievement(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("achievements").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/achievements");
    revalidatePath("/about");
}
