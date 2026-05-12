sed -i 's/const sessionRef = useRef<any>(null);/const sessionRef = useRef<unknown>(null);/g' src/components/chat/VoiceWidget.tsx
sed -i 's/onmessage: (msg: any) => {/onmessage: (msg: unknown) => {/g' src/components/chat/VoiceWidget.tsx
sed -i 's/msg.serverContent.modelTurn.parts.forEach((p: any) => {/msg.serverContent.modelTurn.parts.forEach((p: unknown) => {/g' src/components/chat/VoiceWidget.tsx
sed -i 's/msg.toolCall.functionCalls.forEach((fc: any) => {/msg.toolCall.functionCalls.forEach((fc: unknown) => {/g' src/components/chat/VoiceWidget.tsx
sed -i 's/const enhancedArgs = { ...(fc.args as any), _router: router };/const enhancedArgs = { ...(fc.args as Record<string, unknown>), _router: router };/g' src/components/chat/VoiceWidget.tsx
sed -i 's/functionResponses: msg.toolCall.functionCalls.map((fc: any) => ({/functionResponses: msg.toolCall.functionCalls.map((fc: unknown) => ({/g' src/components/chat/VoiceWidget.tsx
sed -i 's/import { GoogleGenAI, Modality, Type, LiveServerMessage } from "@google\/genai";/import { GoogleGenAI, Modality, Type } from "@google\/genai";/g' src/components/chat/VoiceWidget.tsx
