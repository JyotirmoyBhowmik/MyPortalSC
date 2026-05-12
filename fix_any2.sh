sed -i 's/error: any/error: unknown/g' src/app/admin/actions/users.ts
sed -i 's/error.message/(error as Error).message/g' src/app/admin/actions/users.ts
