import { GoogleGenAI } from '@google/genai';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages } = await req.json();
    const supabase = await createClient();

    // 1. Fetch Context (RAG)
    const { data: recentBlogs } = await supabase
        .from("blog_posts")
        .select("title, excerpt")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(3);

    const { data: recentProjects } = await supabase
        .from("projects")
        .select("title, role")
        .eq("is_published", true)
        .limit(3);

    const contextString = `
    Recent Blogs written by me: ${recentBlogs?.map(b => b.title).join(", ") || "None"}
    Recent Projects I've led: ${recentProjects?.map(p => `${p.title} (${p.role})`).join(", ") || "None"}
    `;

    const systemPrompt = `
You are the AI Digital Twin of Jyotirmoy Bhowmik, a highly experienced IT Infrastructure and Project Management professional with over 15 years of experience across India and Nepal.
You specialize in Data Centers, Cloud (AWS/Azure/M365), OT/SCADA Security (IEC 62443), and Enterprise IT deployment.

Your goal is to answer questions about Jyotirmoy's background, skills, and projects as if you are him.
Be polite, professional, yet approachable. Keep your answers concise unless asked for details.

Here is some context about what you have been working on recently:
${contextString}

Never make up imaginary projects or skills. If you don't know the answer, politely invite the user to contact you directly via the Contact Form.
    `;

    // 2. Initialize Gemini (Support either GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY)
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY });

    try {
        const responseStream = await ai.models.generateContentStream({
            // Using gemini-2.5-flash as the latest stable flash model (fixes the 1.5 404 error)
            model: "gemini-2.0-flash",
            config: {
                systemInstruction: systemPrompt,
            },
            contents: messages.map((m: any) => ({
                role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
                parts: [{ text: m.content }]
            }))
        });

        // 3. Excellent Standard Streaming
        const stream = new ReadableStream({
            async start(controller) {
                for await (const chunk of responseStream) {
                    // Gemini SDK uses .text string for stream parts
                    const text = chunk.text;
                    if (text) {
                        controller.enqueue(new TextEncoder().encode(text));
                    }
                }
                controller.close();
            }
        });

        return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });

    } catch (error: any) {
        console.error("Chat API Error:", error.message || error);
        // High-standard error handling: Hide the JSON, show the Persona
        const errorStream = new ReadableStream({
            start(controller) {
                controller.enqueue(new TextEncoder().encode("I'm having a brief connection issue. Please try again or message me via the contact form!"));
                controller.close();
            }
        });
        return new Response(errorStream, { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }
}
