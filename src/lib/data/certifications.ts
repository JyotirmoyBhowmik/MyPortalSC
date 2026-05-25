/**
 * Certifications Data Access Layer — Supabase queries for professional certs.
 * Active certifications are shown on the homepage; getAllCertifications
 * is used by the admin panel to manage all statuses (active/expired/archived).
 */
import { createClient } from "@/lib/supabase/server";
import type { Certification } from "@/lib/database.types";
import { logDbError } from "@/lib/supabase/error";

export async function getActiveCertifications(): Promise<Certification[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("certifications")
        .select("*")
        .eq("status", "active")
        .order("issue_date", { ascending: false });

    if (error) {
        logDbError("Error fetching certifications", error);
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
        logDbError("Error fetching all certifications", error);
        return [];
    }
    return data ?? [];
}

