sed -i 's/if (msg.toolCall) {/if (msg.toolCall \&\& msg.toolCall.functionCalls) {/g' src/components/chat/VoiceWidget.tsx
sed -i 's/executeAction(fc.name, enhancedArgs);/executeAction(fc.name || "", enhancedArgs);/g' src/components/chat/VoiceWidget.tsx
