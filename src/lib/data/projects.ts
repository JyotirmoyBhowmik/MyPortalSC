/**
 * Projects Data Access Layer — Supabase queries for portfolio projects.
 * Provides filtered reads (published, featured, by slug) used across
 * public pages and admin panel. All queries respect status filtering.
 */
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/database.types";
import { logDbError } from "@/lib/supabase/error";

export async function getPublishedProjects(): Promise<Project[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("status", "published")
        .order("order_index", { ascending: true });

    if (error) {
        logDbError("Error fetching projects", error);
        return [];
    }
    return data ?? [];
}

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("status", "published")
        .order("order_index", { ascending: true })
        .limit(limit);

    if (error) {
        logDbError("Error fetching featured projects", error);
        return [];
    }
    return data ?? [];
}

export async function getProjectBySlug(
    slug: string
): Promise<Project | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error) {
        logDbError("Error fetching project", error);
        return null;
    }
    return data;
}

export async function getAllProjects(): Promise<Project[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("order_index", { ascending: true });

    if (error) {
        logDbError("Error fetching all projects", error);
        return [];
    }
    return data ?? [];
}

