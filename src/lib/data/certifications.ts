import { createClient } from "@/lib/supabase/server";
import type { Certification } from "@/lib/database.types";

export async function getActiveCertifications(): Promise<Certification[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("certifications")
        .select("*")
        .eq("status", "active")
        .order("issue_date", { ascending: false });

    if (error) {
        console.error("Error fetching certifications:", error);
        return [];
    }
    return data ?? [];
}

export async function getAllCertifications(): Promise<Certification[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("certifications")
        .select("*")
        .order("issue_date", { ascending: false });

    if (error) {
        console.error("Error fetching all certifications:", error);
        return [];
    }
    return data ?? [];
}
