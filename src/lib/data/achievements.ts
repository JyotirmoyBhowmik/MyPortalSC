import { createClient } from "@/lib/supabase/server";
import type { Achievement } from "@/lib/database.types";

export async function getAllAchievements(): Promise<Achievement[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .order("order_index", { ascending: true });

    if (error) {
        console.error("Error fetching achievements:", error);
        return [];
    }
    return data ?? [];
}
