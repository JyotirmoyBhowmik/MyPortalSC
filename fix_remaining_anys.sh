sed -i 's/m: any/m: { role: string; content: string }/g' src/app/api/chat/route.ts
sed -i 's/error: any/error: unknown/g' src/app/api/chat/route.ts
sed -i 's/error.message/(error as Error).message/g' src/app/api/chat/route.ts
sed -i 's/err: any/err: unknown/g' src/app/api/admin/quick-edit-hero/route.ts
sed -i 's/err.message/(err as Error).message/g' src/app/api/admin/quick-edit-hero/route.ts
