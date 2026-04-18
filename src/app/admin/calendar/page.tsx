import CalendarManager from "@/components/admin/CalendarManager";
import { getFiscalYears } from "@/lib/data/finances";

export default async function AdminCalendarPage() {
    const fiscalYears = await getFiscalYears();

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Master Calendar</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Define the formal 9-10 year timeline representing fiscal operational periods (April - March). These labels are used across the finance mapping framework.
                </p>
            </div>
            
            <CalendarManager fiscalYears={fiscalYears} />
        </div>
    );
}
