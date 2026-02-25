import InitiativesManager from "@/components/admin/InitiativesManager";
import { getAllInitiativesAdmin, getAllPrograms } from "@/lib/data/initiatives";
import { getFeatureFlag } from "@/lib/data/settings";

export default async function AdminInitiativesPage() {
    const [initiatives, programs, allowDragDrop, showHeatmap] = await Promise.all([
        getAllInitiativesAdmin(),
        getAllPrograms(),
        getFeatureFlag("feature_drag_drop"),
        getFeatureFlag("feature_initiative_heatmap"),
    ]);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Initiatives</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Manage enterprise initiatives and programs. {initiatives.length} total
                    initiatives across {programs.length} programs.
                </p>
            </div>
            <InitiativesManager initiatives={initiatives} programs={programs} allowDragDrop={allowDragDrop} showHeatmap={showHeatmap} />
        </div>
    );
}
