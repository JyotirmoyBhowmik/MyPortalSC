/**
 * Safely logs database error messages cleanly, suppressing massive call stacks
 * when the database is unreachable (e.g. placeholder URL or offline build environment).
 */
export function logDbError(context: string, error: any): void {
    if (!error) return;

    const message = error.message || String(error);
    const details = error.details || "";

    // Detect if this is an offline / connection error (e.g., DNS ENOTFOUND, fetch failed)
    const isUnreachable = 
        message.includes("fetch failed") || 
        details.includes("ENOTFOUND") || 
        details.includes("fetch failed");

    if (isUnreachable) {
        console.error(`[Supabase Unreachable] ${context}: ${message}`);
    } else {
        console.error(`${context}:`, {
            message,
            code: error.code,
            details,
            hint: error.hint,
        });
    }
}
