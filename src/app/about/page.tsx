import type { Metadata } from "next";
import {
    getPageContent,
    getContentField,
    getContentData,
} from "@/lib/data/content";
import { getSkillsByCategory } from "@/lib/data/skills";
import { getAllAchievements } from "@/lib/data/achievements";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "About",
    description:
        "Learn about Jyotirmoy Bhowmik — background, skills, and professional journey in software development.",
};

export default async function AboutPage() {
    const [pageContent, skillsByCategory, achievements] = await Promise.all([
        getPageContent("about"),
        getSkillsByCategory(),
        getAllAchievements(),
    ]);

    const biography = getContentField(pageContent?.content, "biography");
    const summary = getContentField(
        pageContent?.content,
        "professional_summary"
    );

    return (
        <>
            {/* Hero */}
            <section className="py-24 px-4 relative overflow-hidden">
                <div className="absolute inset-0 dot-pattern opacity-20" />
                <div
                    className="absolute inset-0"
                    style={{ background: "var(--gradient-hero)" }}
                />

                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-6 animate-slide-up">
                        About <span className="gradient-text">Me</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up stagger-1">
                        {summary ||
                            "Full-Stack Developer passionate about building impactful digital solutions."}
                    </p>
                </div>
            </section>

            {/* Biography */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="glass rounded-xl p-8 sm:p-12 mb-12">
                        <div className="flex items-start gap-6">
                            {/* Avatar placeholder */}
                            <div className="hidden sm:block w-20 h-20 rounded-xl gradient-bg flex-shrink-0 flex items-center justify-center text-white text-2xl font-bold">
                                JB
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-4">Jyotirmoy Bhowmik</h2>
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                    {biography ||
                                        "A passionate full-stack developer with expertise in modern web technologies."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Vision Statement */}
                    {getContentField(pageContent?.content, "vision_statement") && (
                        <div className="relative p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/20 mb-16">
                            <div className="absolute top-0 left-0 -translate-x-3 -translate-y-3 text-6xl text-primary/20 font-serif">
                                &ldquo;
                            </div>
                            <h3 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
                                <span className="w-8 h-[1px] bg-primary"></span>
                                Vision Statement
                            </h3>
                            <blockquote className="text-xl sm:text-2xl font-medium leading-relaxed text-foreground">
                                {getContentField(pageContent?.content, "vision_statement")}
                            </blockquote>
                        </div>
                    )}

                    {/* Professional Experience */}
                    {getContentData(pageContent?.content, "experience") && (
                        <div className="mb-16">
                            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                                <span className="w-2 h-8 bg-accent rounded-full" />
                                Professional <span className="gradient-text">Experience</span>
                            </h2>
                            <div className="space-y-8 pl-4 border-l-2 border-border/50">
                                {(getContentData(pageContent?.content, "experience") as any[]).map((exp, idx) => (
                                    <div key={idx} className="relative pl-8">
                                        <div className="absolute top-0 left-[-9px] w-4 h-4 rounded-full bg-background border-2 border-accent" />
                                        <div className="glass p-6 rounded-xl hover-lift">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                                <h3 className="text-xl font-bold text-foreground">
                                                    {exp.role}
                                                </h3>
                                                <span className="text-sm font-medium px-3 py-1 rounded-full bg-primary/10 text-primary self-start sm:self-auto">
                                                    {exp.period}
                                                </span>
                                            </div>
                                            <div className="mb-4">
                                                <p className="text-lg font-medium text-accent">
                                                    {exp.company}
                                                </p>
                                                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                    {exp.location}
                                                </p>
                                            </div>
                                            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                                {exp.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Skills Deep Dive */}
            <section className="py-16 px-4 bg-surface/50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold mb-12 text-center">
                        Core <span className="gradient-text">Competencies</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {Object.entries(skillsByCategory).map(([category, skills]) => (
                            <div key={category} className="glass rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-primary mb-6 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary" />
                                    {category}
                                </h3>
                                <div className="space-y-4">
                                    {skills.map((skill) => (
                                        <div key={skill.id} className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className="text-sm font-medium">
                                                        {skill.name}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {skill.proficiency_level && `${skill.proficiency_level}/5 · `}
                                                        {skill.years_of_experience}y exp
                                                    </span>
                                                </div>
                                                <div className="proficiency-bar">
                                                    <div
                                                        className="proficiency-bar-fill"
                                                        style={{
                                                            width: `${((skill.proficiency_level ?? 0) / 5) * 100}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Achievements */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-12 text-center">
                        <span className="gradient-text">Achievements</span>
                    </h2>

                    <div className="space-y-6">
                        {achievements.map((achievement, i) => (
                            <div
                                key={achievement.id}
                                className={`glass rounded-xl p-6 hover-lift stagger-${i + 1}`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center text-accent text-lg flex-shrink-0">
                                        🏅
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">
                                            {achievement.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {achievement.description}
                                        </p>
                                        <div className="flex items-center gap-3 mt-3">
                                            {achievement.category && (
                                                <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
                                                    {achievement.category}
                                                </span>
                                            )}
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(
                                                    achievement.achievement_date
                                                ).toLocaleDateString("en-US", {
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {achievements.length === 0 && (
                            <p className="text-center text-muted-foreground py-8">
                                Achievements coming soon…
                            </p>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}
