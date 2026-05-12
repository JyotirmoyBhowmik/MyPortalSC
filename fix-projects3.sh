sed -i 's/useState<any\[\]>(\[\])/useState<{name: string, url: string, size?: number}\[\]>(\[\])/g' src/app/admin/projects/new/page.tsx
sed -i 's/documents: documents as any,/documents: documents as {name: string, url: string, size?: number}\[\],/g' src/app/admin/projects/new/page.tsx
