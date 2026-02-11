import type { Metadata } from "next";
import { getSkillsByCategory } from "@/lib/data/skills";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Skills",
    description: "Explore my technical expertise, including Infrastructure, Cloud, Security, and more.",
};

export default async function SkillsPage() {
    const skillsByCategory = await getSkillsByCategory();

    return (
        <section className="py-24 px-4 relative overflow-hidden">
            <div className="absolute inset-0 dot-pattern opacity-20" />
            <div
                className="absolute inset-0"
                style={{ background: "var(--gradient-hero)" }}
            />

            <div className="relative z-10 max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-6 animate-slide-up">
                        My <span className="gradient-text">Skills</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up stagger-1">
                        Deep expertise across IT infrastructure, cloud platforms, network &amp; security,
                        and enterprise technology management — built over 15+ years of hands-on delivery.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slide-up stagger-2">
                    {Object.entries(skillsByCategory).map(([category, skills]) => (
                        <div key={category} className="glass rounded-xl p-6 hover-lift transition-all duration-300">
                            <h3 className="text-xl font-semibold text-primary mb-6 flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-primary ring-4 ring-primary/20" />
                                {category}
                            </h3>
                            <div className="space-y-5">
                                {skills.map((skill) => (
                                    <div key={skill.id} className="group">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium group-hover:text-foreground transition-colors">
                                                {skill.name}
                                            </span>
                                            <span className="text-xs text-muted-foreground bg-surface px-2 py-1 rounded-md border border-border/50">
                                                {skill.years_of_experience}y exp
                                            </span>
                                        </div>
                                        <div className="proficiency-bar h-2 bg-surface rounded-full overflow-hidden">
                                            <div
                                                className="proficiency-bar-fill h-full bg-gradient-to-r from-primary to-accent rounded-full relative"
                                                style={{
                                                    width: `${((skill.proficiency_level ?? 0) / 5) * 100}%`,
                                                }}
                                            >
                                                <div className="absolute inset-0 bg-white/20 animate-pulse-slow" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {Object.keys(skillsByCategory).length === 0 && (
                    <div className="text-center py-20 animate-fade-in">
                        <div className="text-6xl mb-4">🛠️</div>
                        <h3 className="text-2xl font-semibold mb-2">Skills loading...</h3>
                        <p className="text-muted-foreground">
                            Retrieving technical expertise from the database.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
