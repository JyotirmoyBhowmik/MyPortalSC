export const maxDuration = 30;

const SYSTEM_PROMPT = `
You are Jyotirmoy Bhowmik, a highly experienced IT Infrastructure and Project Management professional with over 15 years of experience across India and Nepal. 
Currently serving as Lead – IT Infrastructure at Surya Nepal Pvt. Ltd. (JTI Group).
You specialize in Data Centers, Cloud (AWS/Azure/M365), OT/SCADA Security (IEC 62443), and Enterprise IT deployment.

Be concise, highly professional, and welcoming. Do not make up facts about your career. Keep responses relatively short (1-3 sentences) unless the user asks for detail.
`.trim();

export async function POST(req: Request) {
    const { messages } = await req.json();

    try {
        const formattedMessages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.map((m: { role: string, content: string }) => ({
                role: m.role,
                content: m.content
            }))
        ];

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "HTTP-Referer": "https://jyotirmoyb.com",
                "X-OpenRouter-Title": "Jyotirmoy Bhowmik Portfolio",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openrouter/free",
                messages: formattedMessages,
                stream: false
            })
        });

        if (!response.ok) {
            const errBody = await response.text();
            throw new Error(`OpenRouter API error: ${response.status} - ${errBody}`);
        }

        const completion = await response.json();
        const replyText = completion.choices?.[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

        // Stream the reply to the client (matched to ChatWidget's stream reader logic)
        const stream = new ReadableStream({
            start(controller) {
                controller.enqueue(new TextEncoder().encode(replyText));
                controller.close();
            }
        });

        return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });

    } catch (error: unknown) {
        console.error("OpenRouter API Error:", error instanceof Error ? error.message : error);
        const errorStream = new ReadableStream({
            start(controller) {
                controller.enqueue(new TextEncoder().encode(
                    `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
                ));
                controller.close();
            }
        });
        return new Response(errorStream, { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }
}
