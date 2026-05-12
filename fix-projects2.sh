sed -i 's/useState<unknown\[\]>(\[\])/useState<any\[\]>(\[\])/g' src/app/admin/projects/new/page.tsx
sed -i 's/documents: documents as unknown\[\],/documents: documents as any,/g' src/app/admin/projects/new/page.tsx
