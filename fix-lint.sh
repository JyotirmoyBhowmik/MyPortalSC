sed -i 's/useState<any\[\]>(\[\])/useState<unknown\[\]>(\[\])/g' src/app/admin/projects/new/page.tsx
sed -i 's/documents: documents as any,/documents: documents as unknown\[\],/g' src/app/admin/projects/new/page.tsx
sed -i 's/} as any);/} as unknown);/g' src/app/admin/projects/new/page.tsx

sed -i 's/as Record<string, any>/as Record<string, unknown>/g' src/app/admin/pages/page.tsx
sed -i 's/(f: any)/(f: { label: string })/g' src/app/admin/finances/page.tsx
sed -i 's/(error: any)/(error: unknown)/g' src/app/admin/actions/users.ts
sed -i 's/Record<string, any>/Record<string, unknown>/g' src/app/admin/actions/pages.ts

sed -i 's/(displayExperience as any\[\]).map((exp: any, /(displayExperience as { title: string, company: string, period: string, description: string }\[\]).map((exp, /g' src/app/about/page.tsx
sed -i 's/(displayEducation as any\[\]).map((edu: any, /(displayEducation as { degree: string, institution: string, year: string, description: string }\[\]).map((edu, /g' src/app/about/page.tsx

sed -i 's/useRef<any>(null)/useRef<unknown>(null)/g' src/components/chat/VoiceWidget.tsx
sed -i 's/(window as any)/(window as unknown as { webkitAudioContext: typeof AudioContext })/g' src/components/chat/VoiceWidget.tsx
sed -i 's/as any/as unknown/g' src/components/chat/VoiceWidget.tsx
sed -i 's/(msg: any)/(msg: { serverContent?: { modelTurn?: { parts: { inlineData?: { data: string } }\[\] } }, toolCall?: { functionCalls: { id: string, name: string, args: Record<string, unknown> }\[\] } })/g' src/components/chat/VoiceWidget.tsx
sed -i 's/(p: any)/(p: { inlineData?: { data: string } })/g' src/components/chat/VoiceWidget.tsx
sed -i 's/(fc: any)/(fc: { id: string, name: string, args: Record<string, unknown> })/g' src/components/chat/VoiceWidget.tsx
sed -i 's/(e: any)/(e: { reason?: string, message?: string })/g' src/components/chat/VoiceWidget.tsx
sed -i 's/(err: any)/(err: { message?: string })/g' src/components/chat/VoiceWidget.tsx
