sed -i 's/error: error.message || "An unexpected error occurred."/error: error instanceof Error ? error.message : "An unexpected error occurred."/g' src/app/admin/actions/users.ts
