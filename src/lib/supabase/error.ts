/**
 * Safely logs database error messages cleanly, suppressing massive call stacks
 * when the database is unreachable (e.g. placeholder URL or offline build environment).
 */
export function logDbError(context: string, error: any): void {
    let message = "";
    if (error && typeof error === "object") {
        if (error.message && typeof error.message === "string" && error.message.trim() !== "" && error.message !== "[object Object]") {
            message = error.message;
        } else if (error.message && typeof error.message === "object") {
            message = JSON.stringify(error.message);
        } else if (error.statusText) {
            message = String(error.statusText);
        } else if (error.code) {
            message = `Error Code: ${error.code}`;
        } else if (error.details) {
            message = String(error.details);
        } else {
            const keys = Object.keys(error);
            if (keys.length === 0 || (keys.length === 1 && keys[0] === "message" && (!error.message || error.message === "[object Object]"))) {
                message = "Invalid API Key or Unauthorized";
            } else {
                message = JSON.stringify(error);
            }
        }
    } else {
        message = String(error);
    }

    const details = error?.details || "";

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
            code: error?.code,
            details,
            hint: error?.hint,
        });
    }
}
