sed -i 's/} catch (err: { message?: string }) {/} catch (err: unknown) {/g' src/components/chat/VoiceWidget.tsx
sed -i 's/setErrorMsg(err.message || "Unknown error occurred.");/setErrorMsg(err instanceof Error ? err.message : "Unknown error occurred.");/g' src/components/chat/VoiceWidget.tsx
