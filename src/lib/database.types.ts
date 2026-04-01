/**
 * Database Type Definitions — TypeScript interfaces mirroring the Supabase schema.
 * Provides Row/Insert/Update types for each table plus convenient type aliases.
 * Keep in sync with supabase/migrations/ when schema changes are made.
 */
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            admin_users: {
                Row: {
                    id: string;
                    user_id: string;
                    full_name: string;
                    role: "admin" | "super_admin";
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    full_name: string;
                    role?: "admin" | "super_admin";
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    full_name?: string;
                    role?: "admin" | "super_admin";
                    created_at?: string;
                    updated_at?: string;
                };
            };
            projects: {
                Row: {
                    id: string;
                    title: string;
                    slug: string;
                    short_description: string | null;
                    detailed_description: string | null;
                    status: "draft" | "published" | "archived";
                    domain: string[] | null;
                    technologies: string[] | null;
                    start_date: string | null;
                    end_date: string | null;
                    featured_image_url: string | null;
                    github_url: string | null;
                    duration: string | null;
                    is_published: boolean;
                    published_at: string | null;
                    sort_order: number;
                    live_url: string | null;
                    order_index: number;
                    created_at: string;
                    updated_at: string;
                    created_by: string | null;
                    challenge: string | null;
                    approach: string | null;
                    architecture_notes: string | null;
                    outcome: string | null;
                    key_metrics: Json | null;
                };
                Insert: {
                    id?: string;
                    title: string;
                    slug: string;
                    short_description?: string | null;
                    detailed_description?: string | null;
                    status?: "draft" | "published" | "archived";
                    domain?: string[] | null;
                    technologies?: string[] | null;
                    start_date?: string | null;
                    end_date?: string | null;
                    featured_image_url?: string | null;
                    github_url?: string | null;
                    live_url?: string | null;
                    order_index?: number;
                    created_at?: string;
                    updated_at?: string;
                    created_by?: string | null;
                };
                Update: {
                    id?: string;
                    title?: string;
                    slug?: string;
                    short_description?: string | null;
                    detailed_description?: string | null;
                    status?: "draft" | "published" | "archived";
                    domain?: string[] | null;
                    technologies?: string[] | null;
                    start_date?: string | null;
                    end_date?: string | null;
                    featured_image_url?: string | null;
                    github_url?: string | null;
                    live_url?: string | null;
                    order_index?: number;
                    created_at?: string;
                    updated_at?: string;
                    created_by?: string | null;
                };
            };
            skills: {
                Row: {
                    id: string;
                    name: string;
                    category: string;
                    proficiency_level: number | null;
                    years_of_experience: number | null;
                    icon_url: string | null;
                    order_index: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    category: string;
                    proficiency_level?: number | null;
                    years_of_experience?: number | null;
                    icon_url?: string | null;
                    order_index?: number;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    category?: string;
                    proficiency_level?: number | null;
                    years_of_experience?: number | null;
                    icon_url?: string | null;
                    order_index?: number;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            certifications: {
                Row: {
                    id: string;
                    title: string;
                    issuing_organization: string;
                    issue_date: string;
                    expiry_date: string | null;
                    credential_id: string | null;
                    credential_url: string | null;
                    badge_image_url: string | null;
                    status: "active" | "expired" | "archived";
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    title: string;
                    issuing_organization: string;
                    issue_date: string;
                    expiry_date?: string | null;
                    credential_id?: string | null;
                    credential_url?: string | null;
                    badge_image_url?: string | null;
                    status?: "active" | "expired" | "archived";
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    title?: string;
                    issuing_organization?: string;
                    issue_date?: string;
                    expiry_date?: string | null;
                    credential_id?: string | null;
                    credential_url?: string | null;
                    badge_image_url?: string | null;
                    status?: "active" | "expired" | "archived";
                    created_at?: string;
                    updated_at?: string;
                };
            };
            achievements: {
                Row: {
                    id: string;
                    title: string;
                    description: string | null;
                    achievement_date: string;
                    category: string | null;
                    icon_url: string | null;
                    order_index: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    title: string;
                    description?: string | null;
                    achievement_date: string;
                    category?: string | null;
                    icon_url?: string | null;
                    order_index?: number;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    title?: string;
                    description?: string | null;
                    achievement_date?: string;
                    category?: string | null;
                    icon_url?: string | null;
                    order_index?: number;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            content_pages: {
                Row: {
                    id: string;
                    page_key: string;
                    title: string;
                    content: Json | null;
                    meta_description: string | null;
                    updated_at: string;
                    updated_by: string | null;
                };
                Insert: {
                    id?: string;
                    page_key: string;
                    title: string;
                    content?: Json | null;
                    meta_description?: string | null;
                    updated_at?: string;
                    updated_by?: string | null;
                };
                Update: {
                    id?: string;
                    page_key?: string;
                    title?: string;
                    content?: Json | null;
                    meta_description?: string | null;
                    updated_at?: string;
                    updated_by?: string | null;
                };
            };
            page_analytics: {
                Row: {
                    id: string;
                    page_path: string;
                    view_count: number;
                    unique_visitors: number;
                    last_viewed: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    page_path: string;
                    view_count?: number;
                    unique_visitors?: number;
                    last_viewed?: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    page_path?: string;
                    view_count?: number;
                    unique_visitors?: number;
                    last_viewed?: string;
                    created_at?: string;
                };
            };
            audit_log: {
                Row: {
                    id: string;
                    table_name: string;
                    operation: "INSERT" | "UPDATE" | "DELETE";
                    record_id: string;
                    old_data: Json | null;
                    new_data: Json | null;
                    user_id: string | null;
                    timestamp: string;
                };
                Insert: {
                    id?: string;
                    table_name: string;
                    operation: "INSERT" | "UPDATE" | "DELETE";
                    record_id: string;
                    old_data?: Json | null;
                    new_data?: Json | null;
                    user_id?: string | null;
                    timestamp?: string;
                };
                Update: {
                    id?: string;
                    table_name?: string;
                    operation?: "INSERT" | "UPDATE" | "DELETE";
                    record_id?: string;
                    old_data?: Json | null;
                    new_data?: Json | null;
                    user_id?: string | null;
                    timestamp?: string;
                };
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
        Enums: Record<string, never>;
    };
}

// Convenient type aliases
export type Tables<T extends keyof Database["public"]["Tables"]> =
    Database["public"]["Tables"][T]["Row"];
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
    Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
    Database["public"]["Tables"][T]["Update"];

// Specific table types
export type Project = Tables<"projects">;
export type Skill = Tables<"skills">;
export type Certification = Tables<"certifications">;
export type Achievement = Tables<"achievements">;
export type ContentPage = Tables<"content_pages">;
export type PageAnalytic = Tables<"page_analytics">;
export type AuditLogEntry = Tables<"audit_log">;
export type AdminUser = Tables<"admin_users">;

// Programs & Initiatives types (DB-backed)
export type Program = {
    id: string;
    code: string;
    name: string;
    description: string | null;
    icon: string;
    order_index: number;
    created_at: string;
    updated_at: string;
};

export type Initiative = {
    id: string;
    title: string;
    slug: string;
    program_id: string | null;
    fiscal_year: string;
    strategic_area: string;
    criticality: "Critical" | "High" | "Medium" | "Low";
    delivery_focus: string | null;
    status: "draft" | "published" | "archived";
    order_index: number;
    created_at: string;
    updated_at: string;
};

export type InitiativeWithProgram = Initiative & {
    programs: Program | null;
};
