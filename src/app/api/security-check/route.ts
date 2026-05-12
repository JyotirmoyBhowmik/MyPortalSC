import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const baseUrl = new URL(request.url).origin;

    try {
        // Self-fetch to inspect our own response headers
        const res = await fetch(baseUrl, {
            method: "HEAD",
            cache: "no-store",
            headers: { "User-Agent": "SecurityScorecard/1.0" },
        });

        const headers = Object.fromEntries(res.headers.entries());

        const checks = [
            {
                name: "Strict-Transport-Security (HSTS)",
                key: "strict-transport-security",
                present: !!headers["strict-transport-security"],
                value: headers["strict-transport-security"] || null,
                severity: "critical",
                description: "Enforces HTTPS connections and prevents protocol downgrade attacks.",
            },
            {
                name: "Content-Security-Policy (CSP)",
                key: "content-security-policy",
                present: !!headers["content-security-policy"],
                value: headers["content-security-policy"] || null,
                severity: "critical",
                description: "Controls which resources the browser is allowed to load.",
            },
            {
                name: "X-Frame-Options",
                key: "x-frame-options",
                present: !!headers["x-frame-options"],
                value: headers["x-frame-options"] || null,
                severity: "high",
                description: "Prevents clickjacking by restricting page framing.",
            },
            {
                name: "X-Content-Type-Options",
                key: "x-content-type-options",
                present: !!headers["x-content-type-options"],
                value: headers["x-content-type-options"] || null,
                severity: "medium",
                description: "Prevents MIME-type sniffing attacks.",
            },
            {
                name: "Referrer-Policy",
                key: "referrer-policy",
                present: !!headers["referrer-policy"],
                value: headers["referrer-policy"] || null,
                severity: "medium",
                description: "Controls how much referrer information is sent with requests.",
            },
            {
                name: "Permissions-Policy",
                key: "permissions-policy",
                present: !!headers["permissions-policy"],
                value: headers["permissions-policy"] || null,
                severity: "medium",
                description: "Restricts which browser features the page can use.",
            },
            {
                name: "X-XSS-Protection",
                key: "x-xss-protection",
                present: !!headers["x-xss-protection"],
                value: headers["x-xss-protection"] || null,
                severity: "low",
                description: "Legacy XSS filter (modern browsers rely on CSP instead).",
            },
            {
                name: "X-Powered-By Removed",
                key: "x-powered-by",
                present: !headers["x-powered-by"],
                value: headers["x-powered-by"] ? `LEAK: ${headers["x-powered-by"]}` : "Not exposed",
                severity: "low",
                description: "Technology fingerprint header should be suppressed.",
            },
        ];

        const passedCount = checks.filter((c) => c.present).length;
        const totalCount = checks.length;
        const score = Math.round((passedCount / totalCount) * 100);

        return NextResponse.json({
            score,
            passed: passedCount,
            total: totalCount,
            checks,
            scannedAt: new Date().toISOString(),
            targetUrl: baseUrl,
        });
    } catch {
        return NextResponse.json({ error: "Failed to perform security check" }, { status: 500 });
    }
}
