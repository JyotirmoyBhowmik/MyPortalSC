# Fix AppearanceManager syntax
sed -i '/import Image/d' src/components/admin/AppearanceManager.tsx
sed -i '2i import Image from "next/image";' src/components/admin/AppearanceManager.tsx

# Fix contacts/page.tsx syntax error from aggressive delete
git restore src/app/admin/contacts/page.tsx
sed -i '/const statusColors/d' src/app/admin/contacts/page.tsx
sed -i '/new: "bg-blue-500\/15 text-blue-400"/d' src/app/admin/contacts/page.tsx
sed -i '/read: "bg-amber-500\/15 text-amber-400"/d' src/app/admin/contacts/page.tsx
sed -i '/replied: "bg-green-500\/15 text-green-400"/d' src/app/admin/contacts/page.tsx
sed -i '/archived: "bg-gray-500\/15 text-gray-400"/d' src/app/admin/contacts/page.tsx
sed -i '/};/d' src/app/admin/contacts/page.tsx
