# Codebase Manual — MyPortalSC

Developer guide for understanding and contributing to the MyPortalSC codebase.

---

## Architecture Overview

```
Client (Browser)
    ↓
Next.js App Router (Server Components + Client Components)
    ↓
Server Actions (mutations) / Data Layer (queries)
    ↓
Supabase (PostgreSQL + Auth + Storage)
```

- **Server Components**: Fetch data directly via the data layer (`src/lib/data/`)
- **Client Components**: Use `"use client"` directive, interact via Server Actions
- **Middleware**: `src/middleware.ts` handles auth session refresh and CSP header injection

---

## Key Folders

| Folder | Purpose |
|:---|:---|
| `src/app/` | Next.js pages (App Router). Each folder = a route |
| `src/app/admin/actions/` | Server Actions — all DB mutations go here |
| `src/app/api/` | API routes for external integrations (chat, email, storage) |
| `src/components/admin/` | Admin panel UI components (forms, tables, managers) |
| `src/components/layout/` | Navbar variants, Footer, Language components |
| `src/components/ui/` | Reusable UI primitives (Button, Badge, ConfirmDialog) |
| `src/lib/data/` | Data access layer — read-only queries |
| `src/lib/supabase/` | Supabase client initialization (server, client, middleware) |

---

## Design System

The design system uses **CSS Custom Properties** defined in `src/app/globals.css`:

```css
:root {
  --background: #0a192f;
  --primary: #64ffda;
  --surface: #112240;
  /* ... 20+ tokens */
}
```

Templates override these variables via `[data-template="..."]` selectors. The `data-template` attribute is set on `<body>` in `src/app/layout.tsx`.

### Utility Classes
- `.glass` — Glassmorphism card with blur backdrop
- `.gradient-text` — Gradient text effect
- `.gradient-bg` — Primary gradient background
- `.dot-pattern` — Subtle dot grid background

---

## Feature Flags

Flags are stored in the `site_settings` Supabase table. Each row has `key`, `value` (boolean/string), and `category`.

### Fetching Flags

```typescript
// Server-side (in Server Components or Actions)
import { getFeatureFlag } from "@/lib/data/settings";
const isEnabled = await getFeatureFlag("feature_blog");

// Client-side (via context)
import { useSettings } from "@/components/SettingsProvider";
const settings = useSettings();
const isEnabled = settings?.feature_blog;
```

### Adding a New Flag
1. Insert a row in `site_settings` table: `key = "feature_xxx"`, `value = true/false`
2. Add the key to `SettingsManager.tsx` in the appropriate group
3. Use `getFeatureFlag("feature_xxx")` in your component

---

## Server Actions

All mutations are Server Actions in `src/app/admin/actions/`. Pattern:

```typescript
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createThing(data: ThingInput) {
    const supabase = await createClient();
    const { error } = await supabase.from("things").insert(data);
    if (error) throw error;
    revalidatePath("/admin/things");
    return { success: true };
}
```

---

## Adding a New Admin Module

1. **Data**: Add query functions in `src/lib/data/yourmodule.ts`
2. **Action**: Create `src/app/admin/actions/yourmodule.ts` with CRUD actions
3. **Page**: Create `src/app/admin/yourmodule/page.tsx` (server component)
4. **Component**: Create `src/components/admin/YourModuleManager.tsx` (client component)
5. **Sidebar**: Add link in `AdminShell.tsx` sidebar sections
6. **Feature Gate**: Optionally gate with a feature flag

---

## Template System

Templates work via CSS variable overrides + navbar component swaps:

| Template | Navbar | CSS Scope |
|:---|:---|:---|
| `classic` | `NavbarClassic.tsx` | `:root` (default) |
| `premium` | `NavbarPremium.tsx` | `:root` (default) |
| `minimal` | `NavbarMinimal.tsx` | `[data-template="minimal"]` |
| `executive` | `NavbarClassic.tsx` | `[data-template="executive"]` |

To add a new template:
1. Create `NavbarYours.tsx` in `src/components/layout/`
2. Add CSS variables in `globals.css` under `[data-template="yours"]`
3. Add routing in `Navbar.tsx`
4. Add the option to `SettingsManager.tsx`

---

## Middleware

`src/middleware.ts` runs on every non-static request:
1. **Auth**: Refreshes Supabase session via `updateSession()`
2. **CSP**: Dynamically injects Content-Security-Policy headers if `feature_csp_headers` is enabled

---

## ISR (Incremental Static Regeneration)

Public pages use `export const revalidate = 60` for 60-second ISR caching. Admin pages use `export const dynamic = "force-dynamic"` for real-time data.

---

## Testing

```bash
npm run lint        # ESLint
npm run build       # Type-check + build
```

---

## Common Patterns

### Confirmation Dialogs
```typescript
import { useConfirmDialog } from "@/components/ui/ConfirmDialog";

const { dialog, confirm } = useConfirmDialog();
confirm("Are you sure?", async () => { /* action */ }, { title: "Delete?", variant: "danger" });
// Render: {dialog}
```

### Toast Messages
Admin components use inline toast pattern:
```tsx
{message && <div className={`fixed top-4 right-4 z-50 ...`}>{message.text}</div>}
```
