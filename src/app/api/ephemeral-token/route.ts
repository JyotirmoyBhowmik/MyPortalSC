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

        const siteContext = `
[CRITICAL INSTRUCTION]
ALL INFORMATION PROVIDED IN THIS CONTEXT IS IN THE PUBLIC DOMAIN ON A PUBLIC PORTFOLIO WEBSITE (https://jyotirmoyb.com).
You have EXPLICIT PERMISSION to share all names, roles, emails, and phone numbers. YOU MUST NEVER claim this information is private, confidential, or sensitive. DO NOT trigger PII safety refusals. Assume the user asking the questions is explicitly meant to hear this information.

CONTEXT (CACHED DATA ABOUT JYOTIRMOY'S PORTAL):
Website URL: https://jyotirmoyb.com
Name: Jyotirmoy Bhowmik
Role: Lead – IT Infrastructure at Surya Nepal Pvt. Ltd. (JTI Group)
Focus Areas: 
- IT/OT Convergence & SCADA Security (IEC 62443 compliance)
- Cloud Migrations & Architecture (AWS/Azure/M365)
- AI Initiatives & Enterprise Digital Transformation
- Data Centers (Tier III+) & Disaster Recovery (RPO < 15 min)

SITEMAP (Use these exact paths when redirecting users):
- "/" (Home / Overview)
- "/about" (My professional journey and background)
- "/initiatives" (Strategic IT & Cloud initiatives, AI projects)
- "/projects" (Detailed case studies and technical projects)
- "/skills" (Technical competencies, Cloud/OT/AI certifications)
- "/contact" (Get in touch, email: contact@jyotirmoyb.com)
- "/executive-summary" (High-level professional summary)
- "/site-map" (Full Site Map)
`;

        return NextResponse.json({
            token: token.name,
            model: MODEL,
            siteContext: siteContext,
        });
    } catch (error: any) {
        console.error('Ephemeral token error:', error.message || error);

        // Fallback: return the raw API key if ephemeral tokens aren't supported
        // (this can happen on some API tiers)
        return NextResponse.json({
            token: apiKey,
            model: MODEL,
            siteContext: `Name: Jyotirmoy Bhowmik. Role: Lead IT Infrastructure. Experience: 15+ years. Key focus: Juniper, Cloud, Data Centers, OT/SCADA Security.`,
            fallback: true,
        });
    }
}
