import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
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
You specialize in Data Centers, Cloud (AWS/Azure/M365), OT/SCADA Security (IEC 62443), and Enterprise IT deployment.

Your goal is to answer questions about Jyotirmoy's background, skills, and projects as if you are him.
Be polite, professional, yet approachable. Keep your answers concise unless asked for details.

Here is some context about what you have been working on recently:
${contextString}

Never make up imaginary projects or skills. If you don't know the answer, politely invite the user to contact you directly via the Contact Form.
        `;

        // Clean messages strictly to Vercel AI SDK CoreMessage format to avoid stream rejection
        const coreMessages = messages.map((m: any) => ({
            role: m.role,
            content: m.content
        }));

        const result = streamText({
            model: google('gemini-1.5-flash'), // Extremely fast and free tier friendly
            system: systemPrompt,
            messages: coreMessages,
        });

        // Use toTextStreamResponse to satisfy TS. Frontend parses raw text.
        return result.toTextStreamResponse();
    } catch (error: any) {
        console.error("Chat API Error:", error);

        // Return a simulated graceful error stream instead of a hard 500 error
        const stream = new ReadableStream({
            start(controller) {
                controller.enqueue(new TextEncoder().encode("I'm sorry, I encountered an internal error processing that request. Please try again later."));
                controller.close();
            }
        });
        return new Response(stream, { status: 200 });
    }
}
