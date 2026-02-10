import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/database.types";

export async function getPublishedProjects(): Promise<Project[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("status", "published")
        .order("order_index", { ascending: true });

    if (error) {
        console.error("Error fetching projects:", error);
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
        console.error("Error fetching featured projects:", error);
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
        console.error("Error fetching project:", error);
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
        console.error("Error fetching all projects:", error);
        return [];
    }
    return data ?? [];
}
