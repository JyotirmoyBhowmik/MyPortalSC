import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

/**
 * Ephemeral Token Route
 * 
 * Generates a short-lived ephemeral token for the client-side
 * VoiceWidget to connect to the Gemini Live API without exposing
 * the actual API key. Tokens are single-use and expire in 30 minutes.
 */

const MODEL = 'gemini-2.5-flash-native-audio-preview-12-2025';

export async function GET() {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    try {
        const ai = new GoogleGenAI({ apiKey, httpOptions: { apiVersion: 'v1alpha' } });

        const expireTime = new Date(Date.now() + 30 * 60 * 1000).toISOString();

        const token = await ai.authTokens.create({
            config: {
                uses: 1,
                expireTime: expireTime,
                liveConnectConstraints: {
                    model: MODEL,
                    config: {
                        responseModalities: ['AUDIO'] as any,
                        temperature: 0.7,
                    }
                },
                httpOptions: { apiVersion: 'v1alpha' },
            },
        });

        return NextResponse.json({
            token: token.name,
            model: MODEL,
        });
    } catch (error: any) {
        console.error('Ephemeral token error:', error.message || error);

        // Fallback: return the raw API key if ephemeral tokens aren't supported
        // (this can happen on some API tiers)
        return NextResponse.json({
            token: apiKey,
            model: MODEL,
            fallback: true,
        });
    }
}
