import FinanceManager from "@/components/admin/FinanceManager";
import { getAllBudgets, getFiscalYears } from "@/lib/data/finances";
import { getAllProjects } from "@/lib/data/projects";
import { getAllInitiativesAdmin } from "@/lib/data/initiatives";
import { getAllSkills } from "@/lib/data/skills";
import { AVAILABLE_CURRENCIES } from "@/lib/utils/currency";

export default async function AdminFinancesPage() {
    const [budgets, projects, initiatives, skills, fiscalYears] = await Promise.all([
        getAllBudgets(),
        getAllProjects(),
        getAllInitiativesAdmin(),
        getAllSkills(),
        getFiscalYears()
    ]);

    const projectOptions = projects.map(p => ({ id: p.id, label: p.title }));
    const initOptions = initiatives.map(i => ({ id: i.id, label: i.title }));
    const skillOptions = skills.map(s => ({ id: s.id, label: s.name }));
    const fiscalYearOptions = fiscalYears.map((f: any) => ({ id: f.label, label: f.label }));

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Finance & Budget</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Manage financial entries, map investments to initiatives, specify OpEx vs CapEx models. 
                    Tracking {budgets.length} budget items.
                </p>
            </div>
            
            <FinanceManager 
                budgets={budgets} 
                projects={projectOptions} 
                initiatives={initOptions} 
                skills={skillOptions}
                fiscalYears={fiscalYearOptions}
                currencies={AVAILABLE_CURRENCIES}
            />
        </div>
    );
}
