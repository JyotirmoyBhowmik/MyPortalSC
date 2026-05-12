sed -i 's/useRef<unknown>(null)/useRef<{ close: () => void, sendRealtimeInput: (params: any) => void, sendToolResponse: (params: any) => void } | null>(null)/g' src/components/chat/VoiceWidget.tsx
