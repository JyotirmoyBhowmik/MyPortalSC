import { getAllSkills } from "@/lib/data/skills";
import SkillsManager from "@/components/admin/SkillsManager";
import { getFeatureFlag } from "@/lib/data/settings";

export default async function AdminSkillsPage() {
    const [skills, allowDragDrop, allowBulkActions] = await Promise.all([
        getAllSkills(),
        getFeatureFlag("feature_drag_drop"),
        getFeatureFlag("feature_bulk_actions"),
    ]);
    return <SkillsManager skills={skills} allowDragDrop={allowDragDrop} allowBulkActions={allowBulkActions} />;
}
