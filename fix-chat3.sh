sed -i 's/sendRealtimeInput: (params: any) => void, sendToolResponse: (params: any) => void/sendRealtimeInput: (params: unknown) => void, sendToolResponse: (params: unknown) => void/g' src/components/chat/VoiceWidget.tsx
sed -i 's/type: "OBJECT" as any,/type: "OBJECT" as "object",/g' src/components/chat/VoiceWidget.tsx
sed -i 's/type: "STRING" as any/type: "STRING" as "string"/g' src/components/chat/VoiceWidget.tsx
