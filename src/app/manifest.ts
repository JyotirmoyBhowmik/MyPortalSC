import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Jyotirmoy Bhowmik — IT Infrastructure & Project Management",
        short_name: "JB Portfolio",
        description: "IT Infrastructure & Project Management Leader delivering secure, resilient enterprise technology programs across South Asia.",
        start_url: "/",
        display: "standalone",
        background_color: "#0a0f1e",
        theme_color: "#63dca3",
        orientation: "portrait-primary",
        icons: [
            { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
        ],
        categories: ["portfolio", "business", "technology"],
    };
}
