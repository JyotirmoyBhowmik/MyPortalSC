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
            // Note: For Resend free tier, you can only send from a verified domain or 'onboarding@resend.dev'
            // Replace 'onboarding@resend.dev' with your own domain once verified
            from: 'Jyotirmoy.dev Portal <onboarding@resend.dev>',
            to,
            subject,
            html,
        });

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error("Failed to send email:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
