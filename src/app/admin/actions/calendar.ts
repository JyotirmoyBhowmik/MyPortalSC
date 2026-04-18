"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createFiscalYear(formData: FormData) {
    const supabase = await createClient();

    const label = formData.get("label") as string;
    const start_date = formData.get("start_date") as string;
    const end_date = formData.get("end_date") as string;

    const { error } = await supabase.from("fiscal_years").insert({
        label,
        start_date,
        end_date,
        is_active: true
    });

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/admin/finances");
    return { success: true };
}

export async function deleteFiscalYear(id: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("fiscal_years")
        .delete()
        .eq("id", id);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/admin/finances");
    return { success: true };
}
