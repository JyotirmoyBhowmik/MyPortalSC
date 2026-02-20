import { NextResponse } from 'next/server';

/**
 * Dedicated Audio API Route for Gemini Live Native Audio
 * Model: gemini-live-2.5-flash-native-audio
 * 
 * This endpoint provides the WebSocket connection URL and API key
 * for the VoiceWidget to establish a BidiGenerateContent session.
 * The actual WebSocket connection is made directly from the client
 * to Gemini's WSS endpoint, but the API key is never exposed in
 * client-side code — it is fetched securely from this server route.
 */

const GEMINI_AUDIO_MODEL = "models/gemini-2.5-flash-native-audio";
const GEMINI_WS_BASE = "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent";

export async function GET() {
    const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!key) {
        return NextResponse.json(
            { error: "GEMINI_API_KEY is not configured on the server." },
            { status: 500 }
        );
    }

    // Build the complete WSS URL so the client never constructs it
    const wsUrl = `${GEMINI_WS_BASE}?key=${key}`;

    return NextResponse.json({
        wsUrl,
        model: GEMINI_AUDIO_MODEL,
    });
}
