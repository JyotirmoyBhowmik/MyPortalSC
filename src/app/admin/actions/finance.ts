"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createBudget(formData: FormData) {
    const supabase = await createClient();

    const title = formData.get("title") as string;
    const fiscal_year = formData.get("fiscal_year") as string;
    const investment_model = formData.get("investment_model") as string || "OpEx";
    
    // Numeric values
    const planning_amount = parseFloat(formData.get("planning_amount") as string || "0");
    const outlook_amount = parseFloat(formData.get("outlook_amount") as string || "0");
    const expense_amount = parseFloat(formData.get("expense_amount") as string || "0");
    const carry_over_amount = parseFloat(formData.get("carry_over_amount") as string || "0");
    
    // Foreign keys
    const project_id = formData.get("project_id") as string || null;
    const initiative_id = formData.get("initiative_id") as string || null;
    const skill_id = formData.get("skill_id") as string || null;
    
    const currency = formData.get("currency") as string || "USD";

    const { error } = await supabase.from("financial_budgets").insert({
        title,
        fiscal_year,
        investment_model,
        planning_amount,
        outlook_amount,
        expense_amount,
        carry_over_amount,
        project_id,
        initiative_id,
        skill_id,
        currency,
    });

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/admin/finances");
    return { success: true };
}

export async function updateBudget(id: string, formData: FormData) {
    const supabase = await createClient();

    const title = formData.get("title") as string;
    const fiscal_year = formData.get("fiscal_year") as string;
    const investment_model = formData.get("investment_model") as string || "OpEx";
    
    const planning_amount = parseFloat(formData.get("planning_amount") as string || "0");
    const outlook_amount = parseFloat(formData.get("outlook_amount") as string || "0");
    const expense_amount = parseFloat(formData.get("expense_amount") as string || "0");
    const carry_over_amount = parseFloat(formData.get("carry_over_amount") as string || "0");
    
    const project_id = formData.get("project_id") as string || null;
    const initiative_id = formData.get("initiative_id") as string || null;
    const skill_id = formData.get("skill_id") as string || null;
    
    const currency = formData.get("currency") as string || "USD";

    const { error } = await supabase
        .from("financial_budgets")
        .update({
            title,
            fiscal_year,
            investment_model,
            planning_amount,
            outlook_amount,
            expense_amount,
            carry_over_amount,
            project_id,
            initiative_id,
            skill_id,
            currency,
        })
        .eq("id", id);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/admin/finances");
    return { success: true };
}

export async function deleteBudget(id: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("financial_budgets")
        .delete()
        .eq("id", id);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/admin/finances");
    return { success: true };
}
