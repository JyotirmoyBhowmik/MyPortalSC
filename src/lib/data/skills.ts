/**
 * Skills Data Access Layer — Supabase queries for technology skills.
 * Skills are grouped by category for the radar chart and skill cards
 * on the homepage. Ordered by order_index for drag-sort from admin.
 */
import { createClient } from "@/lib/supabase/server";
import type { Skill } from "@/lib/database.types";
import { logDbError } from "@/lib/supabase/error";

export async function getAllSkills(): Promise<Skill[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("order_index", { ascending: true });

    if (error) {
        logDbError("Error fetching skills", error);
        return [];
    }
    return data ?? [];
}


export async function getSkillsByCategory(): Promise<
    Record<string, Skill[]>
> {
    const skills = await getAllSkills();
    return skills.reduce(
        (acc, skill) => {
            if (!acc[skill.category]) {
                acc[skill.category] = [];
            }
            acc[skill.category].push(skill);
            return acc;
        },
        {} as Record<string, Skill[]>
    );
}
