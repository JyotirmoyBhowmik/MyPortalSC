import { getAllInitiatives } from "@/lib/data/initiatives";
import { getAllBudgets } from "@/lib/data/finances";
import CommandPalette from "./CommandPalette";

const pages = [
    { title: "Home", href: "/", category: "Pages", icon: "🏠" },
    { title: "About", href: "/about", category: "Pages", icon: "👤" },
    { title: "Skills", href: "/skills", category: "Pages", icon: "⚡" },
    { title: "Projects", href: "/projects", category: "Pages", icon: "📁" },
    { title: "Initiatives", href: "/initiatives", category: "Pages", icon: "🚀" },
    { title: "IT Budgets", href: "/budget", category: "Pages", icon: "💰" },
    { title: "Contact", href: "/contact", category: "Pages", icon: "✉️" },
    { title: "Timeline", href: "/timeline", category: "Pages", icon: "📅" },
];

export default async function SearchProvider() {
    const [initiatives, budgets] = await Promise.all([
        getAllInitiatives(),
        getAllBudgets(),
    ]);

    const initiativeItems = initiatives.slice(0, 40).map(i => ({
        title: i.title,
        href: `/initiatives/${i.slug}`,
        category: "Initiatives",
        icon: "🚀",
        meta: `FY ${i.fiscal_year} · ${i.strategic_area} · ${i.criticality}`,
    }));

    const budgetItems = budgets.slice(0, 20).map(b => ({
        title: b.title,
        href: "/budget",
        category: "Budgets",
        icon: b.investment_model === "CapEx" ? "📦" : "🔄",
        meta: `FY ${b.fiscal_year} · ${b.investment_model} · ${b.currency} ${Number(b.expense_amount).toLocaleString()}`,
    }));

    const allItems = [...pages, ...initiativeItems, ...budgetItems];

    return <CommandPalette items={allItems} />;
}
