sed -i 's/<img src={appearance.logo_url}/<Image src={appearance.logo_url} width={32} height={32}/g' src/components/admin/AppearanceManager.tsx
sed -i '1i import Image from "next/image";' src/components/admin/AppearanceManager.tsx
sed -i 's/DOMPurify/DOMPurify/g' src/app/case-studies/\[slug\]/page.tsx # dummy replace to check unused
sed -i '/import DOMPurify/d' src/app/case-studies/\[slug\]/page.tsx
sed -i '/import { fmtLakhs }/d' src/app/budget/cost-center/\[slug\]/page.tsx
sed -i '/const contentType/d' src/app/api/storage/sign-upload/route.ts
sed -i 's/error: error/error: "error"/g' src/app/api/security-check/route.ts
