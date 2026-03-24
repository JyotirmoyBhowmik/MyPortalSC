"use client";

import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import { useTheme as useRetroTheme } from "@/components/ThemeProvider";

interface SkillCategory {
    category: string;
    avgProficiency: number;
    skillCount: number;
}

interface SkillsRadarChartProps {
    data: SkillCategory[];
}

export default function SkillsRadarChart({ data }: SkillsRadarChartProps) {
    const { isRetro } = useRetroTheme();

    const chartColor = isRetro ? "#00ff41" : "#64ffda";
    const chartColorFill = isRetro ? "rgba(0, 255, 65, 0.2)" : "rgba(100, 255, 218, 0.15)";
    const gridColor = isRetro ? "rgba(0, 255, 65, 0.15)" : "rgba(255, 255, 255, 0.08)";
    const labelColor = isRetro ? "#00ff41" : "rgba(255, 255, 255, 0.7)";

    // Shorten long category names for mobile
    const chartData = data.map((d) => ({
        ...d,
        shortName: d.category.length > 18 ? d.category.substring(0, 16) + "…" : d.category,
    }));

    return (
        <div className="w-full aspect-square max-w-md mx-auto">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                    <PolarGrid stroke={gridColor} />
                    <PolarAngleAxis
                        dataKey="shortName"
                        tick={{
                            fill: labelColor,
                            fontSize: 11,
                            fontFamily: isRetro ? "'Courier New', monospace" : "inherit",
                        }}
                    />
                    <PolarRadiusAxis
                        angle={30}
                        domain={[0, 5]}
                        tick={{ fill: "transparent" }}
                        axisLine={false}
                    />
                    <Radar
                        name="Proficiency"
                        dataKey="avgProficiency"
                        stroke={chartColor}
                        fill={chartColorFill}
                        strokeWidth={2}
                        dot={{
                            r: 4,
                            fill: chartColor,
                            strokeWidth: 0,
                        }}
                        animationDuration={1200}
                        animationEasing="ease-out"
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: isRetro ? "#0a0a0a" : "rgba(10, 15, 25, 0.95)",
                            border: `1px solid ${isRetro ? "#00ff41" : "rgba(100, 255, 218, 0.3)"}`,
                            borderRadius: isRetro ? "0px" : "8px",
                            color: isRetro ? "#00ff41" : "#fff",
                            fontFamily: isRetro ? "'Courier New', monospace" : "inherit",
                            fontSize: "13px",
                            padding: "8px 12px",
                        }}
                        formatter={(value) => {
                            const numVal = typeof value === "number" ? value : 0;
                            return [`${numVal.toFixed(1)} / 5`, "Proficiency"];
                        }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}
