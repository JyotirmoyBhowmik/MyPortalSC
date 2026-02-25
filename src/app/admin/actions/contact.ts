"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { getFeatureFlag } from "@/lib/data/settings";

export async function submitContactForm(formData: FormData) {
    const isContactEnabled = await getFeatureFlag("feature_contact_crm");
    if (!isContactEnabled) {
        return { success: false, error: "Contact submissions are currently disabled." };
    }

    const supabase = await createClient();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;
    const turnstileToken = formData.get("token") as string | null;

    if (!name || !email || !message) {
        return { success: false, error: "Name, email, and message are required." };
    }

    // Server-side Turnstile CAPTCHA verification
    const requireCaptcha = await getFeatureFlag("feature_captcha");
    if (requireCaptcha) {
        if (!turnstileToken) {
            return { success: false, error: "CAPTCHA verification is required." };
        }
        const secretKey = process.env.TURNSTILE_SECRET_KEY;
        if (secretKey) {
            const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ secret: secretKey, response: turnstileToken }),
            });
            const verification = await verifyRes.json();
            if (!verification.success) {
                return { success: false, error: "CAPTCHA verification failed. Please try again." };
            }
        }
    }

    try {
        const { error } = await supabase.from("contact_submissions").insert({
            name,
            email,
            subject,
            message,
            // status default is usually 'new' or handled by db default
        });

        if (error) throw error;

        // --- EMAIL AUTOMATION ---
        if (process.env.RESEND_API_KEY) {
            const resend = new Resend(process.env.RESEND_API_KEY);
            const adminEmail = process.env.ADMIN_EMAIL || "admin@jyotirmoyb.com";

            // 1. Send Auto-Responder to User
            await resend.emails.send({
                from: 'Jyotirmoy <contact@jyotirmoyb.com>',
                to: email,
                subject: 'Thank you for your message',
                html: `<p>Hi ${name},</p><p>Thank you for reaching out! I have received your message regarding "<strong>${subject}</strong>" and will get back to you shortly.</p><br><p>Best,<br>Jyotirmoy Bhowmik</p>`,
            });

            // 2. Send Notification to Admin
            await resend.emails.send({
                from: 'Jyotirmoy <contact@jyotirmoyb.com>',
                to: adminEmail,
                subject: `New Contact Submission: ${subject}`,
                html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong></p><p>${message}</p>`,
            });
        }
        // ------------------------

        revalidatePath("/admin/contacts");
        return { success: true, message: "Message sent successfully!" };
    } catch (error: any) {
        console.error("Contact submission error:", error);
        return { success: false, error: "Failed to send message. Please try again." };
    }
}

export async function replyToContact(id: string, email: string, name: string, replyMessage: string) {
    const isContactEnabled = await getFeatureFlag("feature_contact_crm");
    if (!isContactEnabled) {
        return { success: false, error: "Contact CRM is currently disabled." };
    }

    const supabase = await createClient();

    try {
        if (process.env.RESEND_API_KEY) {
            const resend = new Resend(process.env.RESEND_API_KEY);
            const adminEmail = process.env.ADMIN_EMAIL || "admin@jyotirmoyb.com";

            await resend.emails.send({
                from: `Jyotirmoy Bhowmik <contact@jyotirmoyb.com>`,
                to: email,
                replyTo: adminEmail,
                subject: `Re: Your message to Jyotirmoy`,
                html: `<p>Hi ${name},</p><p>${replyMessage.replace(/\n/g, '<br/>')}</p><br><p>Best regards,<br>Jyotirmoy Bhowmik</p>`,
            });
        }

        // Update status in DB
        await supabase.from("contact_submissions").update({ status: 'replied' }).eq("id", id);

        revalidatePath("/admin/contacts");
        return { success: true };
    } catch (error: any) {
        console.error("Reply error:", error);
        return { success: false, error: "Failed to send reply." };
    }
}
