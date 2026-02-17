import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") || "Jyotirmoy Bhowmik";
    const subtitle = searchParams.get("subtitle") || "IT Infrastructure & Project Management Leader";

    // Simple design matching the site theme (dark mode)
    return new ImageResponse(
        (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#030712", // gray-950
                    backgroundImage: "radial-gradient(circle at 25px 25px, #1f2937 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1f2937 2%, transparent 0%)",
                    backgroundSize: "100px 100px",
                    color: "white",
                    fontFamily: "sans-serif",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "20px",
                        padding: "10px 20px",
                        borderRadius: "50px",
                        backgroundColor: "rgba(124, 58, 237, 0.1)", // primary/10
                        border: "1px solid rgba(124, 58, 237, 0.2)",
                        color: "#a78bfa", // primary-light
                        fontSize: "20px",
                        fontWeight: 600,
                    }}
                >
                    Jyotirmoy.dev
                </div>
                <div
                    style={{
                        fontSize: "60px",
                        fontWeight: 900,
                        textAlign: "center",
                        maxWidth: "80%",
                        lineHeight: 1.1,
                        background: "linear-gradient(to bottom right, #ffffff, #94a3b8)",
                        backgroundClip: "text",
                        color: "transparent",
                        marginBottom: "20px",
                    }}
                >
                    {title}
                </div>
                <div
                    style={{
                        fontSize: "30px",
                        color: "#9ca3af", // gray-400
                        textAlign: "center",
                        maxWidth: "70%",
                    }}
                >
                    {subtitle}
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    );
}
