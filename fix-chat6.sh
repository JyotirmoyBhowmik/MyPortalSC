sed -i 's/if (p.inlineData) playAudioData(p.inlineData.data);/if (p.inlineData\&\& p.inlineData.data) playAudioData(p.inlineData.data);/g' src/components/chat/VoiceWidget.tsx
sed -i 's/const enhancedArgs = { ...fc.args, _router: router };/const enhancedArgs = { ...(fc.args as any), _router: router };/g' src/components/chat/VoiceWidget.tsx
