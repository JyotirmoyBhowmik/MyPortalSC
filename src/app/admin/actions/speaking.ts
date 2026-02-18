"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createSpeakingEvent(formData: FormData) {
    const supabase = await createClient();
    const { error } = await supabase.from("speaking_events").insert({
        title: formData.get("title") as string,
        event_name: formData.get("event_name") as string,
        event_date: (formData.get("event_date") as string) || null,
        location: (formData.get("location") as string) || null,
        event_type: (formData.get("event_type") as string) || "conference",
        description: (formData.get("description") as string) || null,
        slides_url: (formData.get("slides_url") as string) || null,
        video_url: (formData.get("video_url") as string) || null,
        is_published: formData.get("is_published") === "true",
    });
    if (error) throw new Error(error.message);
    revalidatePath("/admin/speaking");
    revalidatePath("/speaking");
}

export async function updateSpeakingEvent(id: string, formData: FormData) {
    const supabase = await createClient();
    const { error } = await supabase.from("speaking_events").update({
        title: formData.get("title") as string,
        event_name: formData.get("event_name") as string,
        event_date: (formData.get("event_date") as string) || null,
        location: (formData.get("location") as string) || null,
        event_type: (formData.get("event_type") as string) || "conference",
        description: (formData.get("description") as string) || null,
        slides_url: (formData.get("slides_url") as string) || null,
        video_url: (formData.get("video_url") as string) || null,
        is_published: formData.get("is_published") === "true",
    }).eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/speaking");
    revalidatePath("/speaking");
}

export async function deleteSpeakingEvent(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("speaking_events").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/speaking");
    revalidatePath("/speaking");
}
