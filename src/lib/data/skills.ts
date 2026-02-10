import { createClient } from "@/lib/supabase/server";
import type { Skill } from "@/lib/database.types";

export async function getAllSkills(): Promise<Skill[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("order_index", { ascending: true });

    if (error) {
        console.error("Error fetching skills:", error);
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
