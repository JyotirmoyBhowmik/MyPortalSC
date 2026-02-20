import { NextResponse } from 'next/server';

export async function GET() {
    const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!key) {
        return NextResponse.json({ error: "API Key not configured" }, { status: 500 });
    }

    // In a production scenario, you would want to use short-lived tokens, 
    // but the Gemini WebSocket API currently requires the API key directly.
    return NextResponse.json({ key });
}
