sed -i 's/useRef<{ close: () => void, sendRealtimeInput: (params: unknown) => void, sendToolResponse: (params: unknown) => void } | null>(null);/useRef<any>(null);/g' src/components/chat/VoiceWidget.tsx
sed -i 's/(msg: LiveServerMessage)/(msg: any)/g' src/components/chat/VoiceWidget.tsx
sed -i 's/msg.serverContent.modelTurn.parts.forEach((p) => {/msg.serverContent.modelTurn.parts.forEach((p: any) => {/g' src/components/chat/VoiceWidget.tsx
sed -i 's/msg.toolCall.functionCalls.forEach((fc) => {/msg.toolCall.functionCalls.forEach((fc: any) => {/g' src/components/chat/VoiceWidget.tsx
sed -i 's/functionResponses: msg.toolCall.functionCalls.map((fc) => ({/functionResponses: msg.toolCall.functionCalls.map((fc: any) => ({/g' src/components/chat/VoiceWidget.tsx
