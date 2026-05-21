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
import { useEffect, useState } from "react";

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
    const [template, setTemplate] = useState<string>("classic");

    useEffect(() => {
        const getTemplate = () => {
            const bodyTemplate = document.body.getAttribute("data-template");
            const htmlTemplate = document.documentElement.getAttribute("data-template");
            return bodyTemplate || htmlTemplate || "classic";
        };
        
        setTemplate(getTemplate());

        const observer = new MutationObserver(() => {
            setTemplate(getTemplate());
        });

        observer.observe(document.body, { attributes: true, attributeFilter: ["data-template"] });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-template"] });

        return () => observer.disconnect();
    }, []);

    // Color definitions based on the active template
    let chartColor = "#64ffda";
    let chartColorFill = "rgba(100, 255, 218, 0.15)";
    let gridColor = "rgba(255, 255, 255, 0.08)";
    let labelColor = "rgba(255, 255, 255, 0.7)";
    let tooltipBg = "rgba(10, 15, 25, 0.95)";
    let tooltipBorder = "rgba(100, 255, 218, 0.3)";
    let tooltipColor = "#fff";

    if (isRetro) {
        chartColor = "#00ff41";
        chartColorFill = "rgba(0, 255, 65, 0.2)";
        gridColor = "rgba(0, 255, 65, 0.15)";
        labelColor = "#00ff41";
        tooltipBg = "#0a0a0a";
        tooltipBorder = "#00ff41";
        tooltipColor = "#00ff41";
    } else {
        const isLight = ["ceramic-light", "light-modern", "minimal", "ceramic"].includes(template);
        if (isLight) {
            if (template === "ceramic-light") {
                chartColor = "#505f76"; // accent (slate blue)
                chartColorFill = "rgba(80, 95, 118, 0.12)";
                gridColor = "rgba(26, 28, 27, 0.1)";
                labelColor = "#1a1c1b"; // dark charcoal primary
                tooltipBg = "#ffffff";
                tooltipBorder = "#e5e5e1";
                tooltipColor = "#1a1c1b";
            } else if (template === "light-modern" || template === "ceramic") {
                chartColor = "#3b82f6"; // accent (blue)
                chartColorFill = "rgba(59, 130, 246, 0.12)";
                gridColor = "rgba(15, 23, 42, 0.1)";
                labelColor = "#1e293b"; // heading / slate-800
                tooltipBg = "#ffffff";
                tooltipBorder = "#e2e8f0";
                tooltipColor = "#1e293b";
            } else if (template === "minimal") {
                chartColor = "#2563eb"; // primary (blue)
                chartColorFill = "rgba(37, 99, 235, 0.12)";
                gridColor = "rgba(17, 24, 39, 0.1)";
                labelColor = "#111827"; // gray-900
                tooltipBg = "#ffffff";
                tooltipBorder = "#e5e7eb";
                tooltipColor = "#111827";
            }
        }
    }

    // Shorten long category names for mobile
    const chartData = data.map((d) => ({
        ...d,
        shortName: d.category.length > 18 ? d.category.substring(0, 16) + "…" : d.category,
    }));

    return (
        <div className="w-full h-[320px] sm:h-[350px] max-w-md mx-auto relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData}>
                    <PolarGrid stroke={gridColor} />
                    <PolarAngleAxis
                        dataKey="shortName"
                        tick={{
                            fill: labelColor,
                            fontSize: 10,
                            fontWeight: 500,
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
                            backgroundColor: tooltipBg,
                            border: `1px solid ${tooltipBorder}`,
                            borderRadius: isRetro ? "0px" : "8px",
                            color: tooltipColor,
                            fontFamily: isRetro ? "'Courier New', monospace" : "inherit",
                            fontSize: "13px",
                            padding: "8px 12px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        }}
                        itemStyle={{
                            color: tooltipColor
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

