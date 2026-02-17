"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitContactForm(formData: FormData) {
    const supabase = await createClient();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    if (!name || !email || !message) {
        return { success: false, error: "Name, email, and message are required." };
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

        revalidatePath("/admin/contacts");
        return { success: true, message: "Message sent successfully!" };
    } catch (error: any) {
        console.error("Contact submission error:", error);
        return { success: false, error: "Failed to send message. Please try again." };
    }
}
