sed -i 's/const sessionRef = useRef<unknown>(null);/const sessionRef = useRef<any>(null);/g' src/components/chat/VoiceWidget.tsx
sed -i 's/onmessage: (msg: unknown) => {/onmessage: (msg: any) => {/g' src/components/chat/VoiceWidget.tsx
sed -i 's/msg.serverContent.modelTurn.parts.forEach((p: unknown) => {/msg.serverContent.modelTurn.parts.forEach((p: any) => {/g' src/components/chat/VoiceWidget.tsx
sed -i 's/msg.toolCall.functionCalls.forEach((fc: unknown) => {/msg.toolCall.functionCalls.forEach((fc: any) => {/g' src/components/chat/VoiceWidget.tsx
sed -i 's/functionResponses: msg.toolCall.functionCalls.map((fc: unknown) => ({/functionResponses: msg.toolCall.functionCalls.map((fc: any) => ({/g' src/components/chat/VoiceWidget.tsx
