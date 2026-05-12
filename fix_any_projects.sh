sed -i 's/useState<any\[\]>/useState<{name: string, url: string}\[\]>/g' src/app/admin/projects/new/page.tsx
sed -i 's/documents: documents as any,/documents: documents as unknown,/g' src/app/admin/projects/new/page.tsx
sed -i 's/} as any);/} as unknown as import("@\/lib\/database.types").InsertTables<"projects">);/g' src/app/admin/projects/new/page.tsx
