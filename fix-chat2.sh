sed -i 's/type: "OBJECT" as unknown,/type: "OBJECT" as any,/g' src/components/chat/VoiceWidget.tsx
sed -i 's/type: "STRING" as unknown/type: "STRING" as any/g' src/components/chat/VoiceWidget.tsx
