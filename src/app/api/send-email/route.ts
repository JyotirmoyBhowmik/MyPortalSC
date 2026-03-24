import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
    try {
        const { to, subject, html } = await request.json();

        if (!process.env.RESEND_API_KEY) {
            console.warn("RESEND_API_KEY is not set. Skipping email send.");
            return NextResponse.json({ success: true, message: "Simulated Email (No Key Set)" });
        }

        const resend = new Resend(process.env.RESEND_API_KEY);

        const data = await resend.emails.send({
            from: 'Jyotirmoy Bhowmik <noreply@resend.jyotirmoyb.com>',
            to,
            subject,
            html,
        });

        return NextResponse.json({ success: true, data });
    } catch (error: unknown) {
        console.error("Failed to send email:", error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
