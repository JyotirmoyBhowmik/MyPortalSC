import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jyotirmoy.dev";

    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/admin/", "/api/", "/debug/"],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
