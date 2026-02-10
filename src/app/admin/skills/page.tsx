import { getAllSkills } from "@/lib/data/skills";
import SkillsManager from "@/components/admin/SkillsManager";

export default async function AdminSkillsPage() {
    const skills = await getAllSkills();
    return <SkillsManager skills={skills} />;
}
