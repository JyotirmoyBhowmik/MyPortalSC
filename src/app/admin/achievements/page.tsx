import { getAllAchievements } from "@/lib/data/achievements";
import AchievementsManager from "@/components/admin/AchievementsManager";

export default async function AdminAchievementsPage() {
    const achievements = await getAllAchievements();
    return <AchievementsManager achievements={achievements} />;
}
