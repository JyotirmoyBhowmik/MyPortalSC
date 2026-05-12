sed -i 's/import { GoogleGenAI, Modality } from "@google\/genai";/import { GoogleGenAI, Modality, Type } from "@google\/genai";/g' src/components/chat/VoiceWidget.tsx
sed -i 's/type: "OBJECT" as "object",/type: Type.OBJECT,/g' src/components/chat/VoiceWidget.tsx
sed -i 's/type: "STRING" as "string"/type: Type.STRING/g' src/components/chat/VoiceWidget.tsx
