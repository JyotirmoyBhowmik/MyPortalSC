import { GoogleGenAI } from '@google/genai';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY && !process.env.GEMINI_API_KEY) {
        const stream = new ReadableStream({
            async start(controller) {
                const text = "Hi! This is a simulated response. To activate the real AI Digital Twin, please configure GOOGLE_GENERATIVE_AI_API_KEY in your environment variables. It is completely free!";
                const chunks = text.split(" ");
                for (const chunk of chunks) {
                    controller.enqueue(new TextEncoder().encode(chunk + " "));
                    await new Promise(r => setTimeout(r, 50));
                }
                controller.close();
            }
        });
        return new Response(stream);
    }

    try {
        const { messages } = await req.json();
        const supabase = await createClient();

        // Fetch basic context from DB to inject into the system prompt
        // This makes the Digital Twin aware of recent projects and blogs
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
You specialize in Data Centers, Cloud(AWS / Azure / M365), OT / SCADA Security(IEC 62443), and Enterprise IT deployment.

Your goal is to answer questions about Jyotirmoy's background, skills, and projects as if you are him.
Be polite, professional, yet approachable.Keep your answers concise unless asked for details.

Here is some context about what you have been working on recently:
${contextString}

Never make up imaginary projects or skills.If you don't know the answer, politely invite the user to contact you directly via the Contact Form.
        `;

        // Either one could be set based on the user's environment naming
        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        const ai = new GoogleGenAI({ apiKey });

        // Map Chat messages into Google's specific nested formatting expectations.
        // Google GenAI expects roles to be either 'user' or 'model'.
        const historyContents = messages.map((m: any) => ({
            role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
            parts: [{ text: m.content }]
        }));

        const responseStream = await ai.models.generateContentStream({
            model: "gemini-1.5-flash",
            contents: historyContents,
            config: {
                systemInstruction: systemPrompt
            }
        });

        // Convert GoogleGenAI native streams into generic ReadableStream for standard Web API fetch 
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of responseStream) {
                        if (chunk.text) {
                            controller.enqueue(new TextEncoder().encode(chunk.text));
                        }
                    }
                    controller.close();
                } catch (apiErr: any) {
                    console.error("Generative AI streaming chunk error:", apiErr);
                    controller.enqueue(new TextEncoder().encode(`\n\n[API Error: ${apiErr?.message || "Internal Connection issue"} ]`));
                    controller.close();
                }
            }
        });

        return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
    } catch (error: any) {
        console.error("Chat API Error:", error);

        // Return a simulated graceful error stream instead of a hard 500 error
        const stream = new ReadableStream({
            start(controller) {
                controller.enqueue(new TextEncoder().encode(`I'm sorry, I encountered a backend error: ${error?.message || "Internal issue"}. Please verify your API Key and Model configuration.`));
                controller.close();
            }
        });
        return new Response(stream, { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }
}
