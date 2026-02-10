"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { InsertTables, UpdateTables } from "@/lib/database.types";

export async function createCertification(
    data: Omit<InsertTables<"certifications">, "id" | "created_at" | "updated_at">
) {
    const supabase = await createClient();
    const { error } = await supabase.from("certifications").insert(data);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/certifications");
    revalidatePath("/");
}

export async function updateCertification(
    id: string,
    data: UpdateTables<"certifications">
) {
    const supabase = await createClient();
    const { error } = await supabase.from("certifications").update(data).eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/certifications");
    revalidatePath("/");
}

export async function deleteCertification(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("certifications").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/certifications");
    revalidatePath("/");
}
