import { getAllSettings } from "@/lib/data/settings";
import SettingsManager from "@/components/admin/SettingsManager";

export default async function AdminSettingsPage() {
    const settings = await getAllSettings();

    // Group by category
    const grouped: Record<string, typeof settings> = {};
    for (const s of settings) {
        if (!grouped[s.category]) grouped[s.category] = [];
        grouped[s.category].push(s);
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Settings & Feature Toggles</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Enable or disable platform features. Changes take effect immediately.
                </p>
            </div>
            <SettingsManager grouped={grouped} />
        </div>
    );
}
