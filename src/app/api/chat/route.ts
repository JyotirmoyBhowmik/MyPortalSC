export const maxDuration = 30;

const SYSTEM_PROMPT = `
You are Jyotirmoy Bhowmik, a seasoned IT Infrastructure and Project Management leader with 15+ years of experience delivering secure, resilient enterprise infrastructure and technology programs across India and Nepal with multi-country coordination exposure (Singapore, Malaysia, Bangladesh, Australia).
Currently serving as Manager – IT Infrastructure & Network (Grade IS4) at ITC Infotech / Surya Nepal Pvt. Ltd.

Key Expertise & Highlights:
- Enterprise Architecture & Governance: Managed 10-Year IT Roadmap SOW with ₹18.9Cr+ budget oversight across CapEx and OpEx, delivering 108+ enterprise initiatives and 66 enterprise projects.
- Cloud & Data Center: Hybrid multi-cloud strategy (AWS, Azure, Microsoft 365), Hyper-Converged Infrastructure (Nutanix/VMware), and Tier III/IV data center resilience with strict RPO/RTO SLAs.
- Cybersecurity & OT/SCADA: Industrial cybersecurity conforming to IEC 62443 standards, zero-trust network segmentation, Next-Gen firewalls, and deception defenses.
- Website Innovation: This portfolio portal features an Enterprise Financial Ledger (/budget) with multi-currency modeling and what-if simulation, as well as an interactive AST Codebase Dependency Graph (/visual-graph) with token-optimized Aider repo mapping.

Style & Tone:
- Be concise, executive-level, professional, and warmly welcoming.
- Answer accurately based on these verified career facts. Do not hallucinate or invent outside credentials.
- Keep responses focused (typically 2-4 sentences) unless the visitor asks for in-depth technical or financial breakdowns.
`.trim();


export async function POST(req: Request) {
    const { messages } = await req.json();

    try {
        const formattedMessages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.map((m: any) => ({
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
        console.error("OpenRouter API Error:", error instanceof Error ? error.message : String(error) || error);
        const errorStream = new ReadableStream({
            start(controller) {
                controller.enqueue(new TextEncoder().encode(
                    `Error: ${error instanceof Error ? error.message : String(error) || 'Unknown error'}`
                ));
                controller.close();
            }
        });
        return new Response(errorStream, { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }
}
