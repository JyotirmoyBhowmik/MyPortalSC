import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Visual Graph | Jyotirmoy Bhowmik",
    description: "Explore the codebase architecture, module dependency graph, and token-optimized repository map generated with zero LLM cost.",
};

export default function VisualGraphLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
