/**
 * Initiatives & Programs Data Access Layer — Supabase queries for IT initiatives.
 * The largest data module: handles programs, initiatives (with foreign key joins),
 * fiscal year filtering, strategic area grouping, and aggregate statistics.
 * Programs are parent categories; initiatives are individual deliverables.
 */
import { createClient } from "@/lib/supabase/server";
import type { Initiative, InitiativeWithProgram, Program } from "@/lib/database.types";
import { logDbError } from "@/lib/supabase/error";

export type { Initiative, InitiativeWithProgram, Program };

/* ─── Programs ─── */

export async function getAllPrograms(): Promise<Program[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("programs")
        .select("*")
        .order("order_index", { ascending: true });
    if (error) {
        logDbError("Error fetching programs", error);
        return [];
    }
    return (data ?? []) as Program[];
}

export async function getProgramByCode(code: string): Promise<Program | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("programs")
        .select("*")
        .eq("code", code)
        .single();
    if (error) return null;
    return data as Program;
}

/* ─── Initiatives ─── */

export async function getAllInitiatives(): Promise<InitiativeWithProgram[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("initiatives")
        .select("*, programs(*)")
        .eq("status", "published")
        .order("order_index", { ascending: true });
    if (error) {
        logDbError("Error fetching initiatives", error);
        return [];
    }
    return (data ?? []) as InitiativeWithProgram[];
}

export async function getAllInitiativesAdmin(): Promise<InitiativeWithProgram[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("initiatives")
        .select("*, programs(*)")
        .order("order_index", { ascending: true });
    if (error) {
        logDbError("Error fetching initiatives (admin)", error);
        return [];
    }
    return (data ?? []) as InitiativeWithProgram[];
}


export async function getInitiativeBySlug(slug: string): Promise<InitiativeWithProgram | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("initiatives")
        .select("*, programs(*)")
        .eq("slug", slug)
        .eq("status", "published")
        .single();
    if (error) return null;
    return data as InitiativeWithProgram;
}

export async function getInitiativesByProgram(programId: string): Promise<InitiativeWithProgram[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("initiatives")
        .select("*, programs(*)")
        .eq("program_id", programId)
        .eq("status", "published")
        .order("order_index", { ascending: true });
    if (error) return [];
    return (data ?? []) as InitiativeWithProgram[];
}

/* ─── Helpers (computed from DB data) ─── */

export async function getAllFiscalYears(): Promise<string[]> {
    const initiatives = await getAllInitiatives();
    const years = new Set(initiatives.map((i) => i.fiscal_year));
    return Array.from(years).sort().reverse();
}

export async function getAllStrategicAreas(): Promise<string[]> {
    const initiatives = await getAllInitiatives();
    const areas = new Set(initiatives.map((i) => i.strategic_area));
    return Array.from(areas).sort();
}

export async function getInitiativeStats() {
    const supabase = await createClient();
    const { count: total } = await supabase
        .from("initiatives")
        .select("id", { count: "exact", head: true })
        .eq("status", "published");
    const { count: critical } = await supabase
        .from("initiatives")
        .select("id", { count: "exact", head: true })
        .eq("status", "published")
        .eq("criticality", "Critical");
    const { count: high } = await supabase
        .from("initiatives")
        .select("id", { count: "exact", head: true })
        .eq("status", "published")
        .eq("criticality", "High");
    const { count: programCount } = await supabase
        .from("programs")
        .select("id", { count: "exact", head: true });

    const fyData = await getAllFiscalYears();

    return {
        total: total ?? 0,
        critical: critical ?? 0,
        high: high ?? 0,
        fyCount: fyData.length,
        programCount: programCount ?? 0,
    };
}
