import { createClient } from "@/lib/supabase/server";

export interface DashboardBudget {
    id: string;
    title: string;
    fiscal_year: string;
    investment_model: string;
    planning_amount: number;
    outlook_amount: number;
    expense_amount: number;
    carry_over_amount: number;
    project_id: string | null;
    initiative_id: string | null;
    skill_id: string | null;
    currency: string;
    projects?: { id: string, title: string };
    initiatives?: { id: string, title: string };
    skills?: { id: string, name: string };
}

export async function getAllBudgets(): Promise<DashboardBudget[]> {
    const supabase = await createClient();
    
    // Allow public access based on RLS (published budgets, though currently all are accessible via RLS schema if we didn't specify draft vs published) 
    const { data, error } = await supabase
        .from("financial_budgets")
        .select(`
            *,
            projects (id, title),
            initiatives (id, title),
            skills (id, name)
        `)
        .order("fiscal_year", { ascending: false })
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching financial budgets:", error);
        return [];
    }

    return data as DashboardBudget[];
}

export async function getFiscalYears() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("fiscal_years")
        .select("*")
        .order("label", { ascending: false });

    if (error) {
        console.error("Error fetching fiscal years:", error);
        return [];
    }
    return data;
}
