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
    const exchange_rate_to_inr = parseFloat(formData.get("exchange_rate_to_inr") as string || "1");
    
    // IT Department fields
    const cost_center = formData.get("cost_center") as string || null;
    const profit_center = formData.get("profit_center") as string || null;
    const account_head = formData.get("account_head") as string || null;
    
    // Status
    const status = formData.get("status") as string || "Draft";

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
        exchange_rate_to_inr,
        cost_center,
        profit_center,
        account_head,
        status,
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
    const exchange_rate_to_inr = parseFloat(formData.get("exchange_rate_to_inr") as string || "1");
    
    const cost_center = formData.get("cost_center") as string || null;
    const profit_center = formData.get("profit_center") as string || null;
    const account_head = formData.get("account_head") as string || null;
    
    const status = formData.get("status") as string || "Draft";

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
            exchange_rate_to_inr,
            cost_center,
            profit_center,
            account_head,
            status,
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
