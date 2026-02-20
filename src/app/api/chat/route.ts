import { GoogleGenAI, Type } from '@google/genai';

export const maxDuration = 30;

// ═══════════════════════════════════════════════════════════════
// Pre-defined Reply Map — Token Sipper Architecture
// The AI only classifies the intent (~1-5 output tokens).
// The reply is served from this static map — zero hallucination.
// ═══════════════════════════════════════════════════════════════
const MY_REPLIES: Record<string, string> = {
    // GREETING — Highest Priority. Handles "hi", "Hi", "Hello", "Hey", etc.
    "GREETING":
        "👋 Hello! Welcome to my portfolio. I'm Jyotirmoy Bhowmik — Lead, IT Infrastructure at Surya Nepal (JTI Group). " +
        "I have 15+ years of experience delivering enterprise-grade data centers, secure networks, and cloud solutions across India and Nepal. " +
        "Feel free to ask me about my projects, skills, or just say hi!",

    // ABOUT — Career narrative
    "ABOUT":
        "I am Jyotirmoy Bhowmik, a highly experienced IT Infrastructure and Project Management professional with over 15 years of experience across India and Nepal. " +
        "Currently serving as Lead – IT Infrastructure at Surya Nepal Pvt. Ltd. (JTI Group), I specialize in Data Centers, Cloud (AWS/Azure/M365), " +
        "OT/SCADA Security (IEC 62443), and Enterprise IT deployment. I hold multiple certifications and have led critical programs from greenfield DC builds to SAP migrations.",

    // SKILLS — Technical competencies
    "SKILLS":
        "My core skills include:\n" +
        "• Data Center Design & Management (Tier III+)\n" +
        "• Network Architecture — Juniper EX/SRX, Cisco, Palo Alto\n" +
        "• Cloud Platforms — AWS, Azure, Microsoft 365\n" +
        "• OT/SCADA Security — IEC 62443 compliance\n" +
        "• Disaster Recovery & Business Continuity\n" +
        "• Project Management — PMP-aligned, Agile/Waterfall\n" +
        "• Virtualization — VMware, Hyper-V\n" +
        "• ERP Infrastructure — SAP Basis support",

    // EXPERIENCE — Work history highlights
    "EXPERIENCE":
        "Career Highlights:\n" +
        "🔹 Lead – IT Infrastructure, Surya Nepal Pvt. Ltd. (JTI Group) — Current\n" +
        "🔹 Senior IT Infrastructure Engineer — Previous roles across manufacturing and enterprise sectors\n" +
        "🔹 15+ years spanning India and Nepal\n" +
        "🔹 Led greenfield data center builds, network rollouts, and cloud migrations\n" +
        "🔹 Managed cross-functional teams of up to 25 members across multiple sites",

    // PROJECTS — Key initiatives
    "PROJECTS":
        "Key Projects:\n" +
        "🚀 Juniper EX2300 Network Rollout — Enterprise-wide L2/L3 switching deployment\n" +
        "🚀 SCADA/OT Security Implementation — IEC 62443 compliant segmentation\n" +
        "🚀 Azure Landing Zone — Cloud migration program for hybrid workloads\n" +
        "🚀 SAP Infrastructure Deployment — High-availability SAP Basis setup\n" +
        "🚀 Disaster Recovery — Multi-site DR architecture with RPO < 15 min",

    // TECH — Deep-dive Juniper / infrastructure specifics
    "TECH":
        "On the networking side, I specialize in Juniper EX2300/EX4300 configurations — from VLAN trunking, LACP aggregation, " +
        "to OSPF/BGP routing policies. I also design Palo Alto firewall rule sets for OT network segmentation (Purdue Model). " +
        "Ask me about specific CLI configs and I can walk you through them!",

    // CONTACT — How to reach me
    "CONTACT":
        "📬 You can reach me via the Contact Form on this site, or connect with me on LinkedIn. " +
        "I'm always happy to discuss professional opportunities, IT infrastructure challenges, and cloud architecture strategies.",

    // OTHER — Catch-all
    "OTHER":
        "I specialize in IT Infrastructure, Networking, Cloud, and Data Center management. " +
        "Could you provide a bit more detail? For example, you can ask about my skills, projects, experience, or how to get in touch."
};

// ═══════════════════════════════════════════════════════════════
// System Prompt — Implicit Context Caching
// Resume & project details placed at the TOP to trigger
// Google's automatic 24-hour cache hits for repeated visitors.
// ═══════════════════════════════════════════════════════════════
const SYSTEM_PROMPT = `
CONTEXT (CACHED):
Name: Jyotirmoy Bhowmik
Role: Lead – IT Infrastructure at Surya Nepal Pvt. Ltd. (JTI Group)
Experience: 15+ years across India and Nepal
Specialties: Data Centers, Cloud (AWS/Azure/M365), OT/SCADA Security (IEC 62443), Enterprise IT, Juniper networking, SAP infrastructure
Certifications: PMP-aligned, various cloud and networking certifications
Key Projects: Juniper EX2300 rollout, SCADA/OT security, Azure Landing Zones, SAP HA deployment, multi-site DR

TASK:
Analyze the user query. Classify it into exactly ONE of these categories:
GREETING, ABOUT, SKILLS, EXPERIENCE, PROJECTS, TECH, CONTACT, OTHER.

PRIORITY RULES:
1. If the message is a greeting like "hi", "Hi", "hello", "hey", "good morning", "namaste", or any casual salutation → GREETING
2. If asking about who Jyotirmoy is, bio, background → ABOUT
3. If asking about technical skills, certifications, competencies → SKILLS
4. If asking about work history, career, companies, years → EXPERIENCE
5. If asking about specific projects, initiatives, deployments → PROJECTS
6. If asking about Juniper configs, networking details, infrastructure specifics → TECH
7. If asking how to reach, contact, connect → CONTACT
8. Everything else → OTHER

Return ONLY the category name in JSON.
`.trim();

export async function POST(req: Request) {
    const { messages } = await req.json();
    const latestMessage = messages.length > 0 ? messages[messages.length - 1].content : "";

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY });

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite", // Token Sipper — cheapest model for classification
            config: {
                systemInstruction: SYSTEM_PROMPT,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        intent: {
                            type: Type.STRING,
                            enum: ["GREETING", "ABOUT", "SKILLS", "EXPERIENCE", "PROJECTS", "TECH", "CONTACT", "OTHER"]
                        }
                    },
                    required: ["intent"]
                }
            },
            contents: [{
                role: "user",
                parts: [{ text: latestMessage }]
            }]
        });

        // Parse the generated intent
        let intent = "OTHER";
        try {
            if (response.text) {
                const parsed = JSON.parse(response.text);
                if (parsed.intent && parsed.intent in MY_REPLIES) {
                    intent = parsed.intent;
                }
            }
        } catch (e) {
            console.error("Failed to parse intent JSON:", e);
        }

        const replyText = MY_REPLIES[intent];

        // Stream the predefined reply to the client (compatible with ChatWidget's reader)
        const stream = new ReadableStream({
            start(controller) {
                controller.enqueue(new TextEncoder().encode(replyText));
                controller.close();
            }
        });

        return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });

    } catch (error: any) {
        console.error("Chat API Error:", error.message || error);
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
