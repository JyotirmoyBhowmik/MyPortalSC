"use client";

import { useTheme } from "@/components/ThemeProvider";
import HomeLegacy from "./HomeLegacy";
import HomeCompactCeramic from "./HomeCompactCeramic";

interface HomeClientRouterProps {
    projects: any[];
    skillsByCategory: Record<string, any[]>;
    certifications: any[];
    featureParticleBg: boolean;
    budgets: any[];
    formattedSpend: string;
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
    template: string;
    availableForOpportunities?: boolean;
    location?: string;
    experienceYears?: string;
    initiativesCount?: number;
}

export default function HomeClientRouter(props: HomeClientRouterProps) {
    const { theme } = useTheme();
    const { template, ...rest } = props;

    // Render Compact Ceramic Light if the visitor's selected theme is compact-ceramic
    if (theme === "compact-ceramic") {
        return <HomeCompactCeramic {...rest} />;
    }

    // Default to the Legacy homepage layout for classic dark themes, passing the server template fallback
    return <HomeLegacy template={template} {...rest} />;
}
