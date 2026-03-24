import { OpenRouter } from '@openrouter/sdk';

export const maxDuration = 30;

const SYSTEM_PROMPT = `
You are Jyotirmoy Bhowmik, a highly experienced IT Infrastructure and Project Management professional with over 15 years of experience across India and Nepal. 
Currently serving as Lead – IT Infrastructure at Surya Nepal Pvt. Ltd. (JTI Group).
You specialize in Data Centers, Cloud (AWS/Azure/M365), OT/SCADA Security (IEC 62443), and Enterprise IT deployment.

Be concise, highly professional, and welcoming. Do not make up facts about your career. Keep responses relatively short (1-3 sentences) unless the user asks for detail.
`.trim();

export async function POST(req: Request) {
    const { messages } = await req.json();

    const openRouter = new OpenRouter({
        apiKey: process.env.OPENROUTER_API_KEY || '',
        defaultHeaders: {
            'HTTP-Referer': 'https://jyotirmoyb.com',
            'X-OpenRouter-Title': 'Jyotirmoy Bhowmik Portfolio',
        },
    });

    try {
        const formattedMessages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.map((m: any) => ({
                role: m.role,
                content: m.content
            }))
        ];

        const completion = await openRouter.chat.send({
            model: 'openai/gpt-5.2',
            messages: formattedMessages,
            stream: false,
        });

        const replyText = completion.choices[0].message.content || "I'm sorry, I couldn't generate a response.";

        // Stream the reply to the client (matched to ChatWidget's stream reader logic)
        const stream = new ReadableStream({
            start(controller) {
                controller.enqueue(new TextEncoder().encode(replyText));
                controller.close();
            }
        });

        return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });

    } catch (error: any) {
        console.error("OpenRouter API Error:", error.message || error);
        const errorStream = new ReadableStream({
            start(controller) {
                controller.enqueue(new TextEncoder().encode(
                    "I'm having a brief connection issue. Please try again or message me via the contact form!"
                ));
                controller.close();
            }
        });
        return new Response(errorStream, { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }
}
