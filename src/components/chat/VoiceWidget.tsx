"use client";

import { useState, useRef } from "react";

// ═══════════════════════════════════════════════════════════════
// AudioWorklet Processor — PCM16 conversion (runs in audio thread)
// ═══════════════════════════════════════════════════════════════
const audioWorkletCode = `
class PCMProcessor extends AudioWorkletProcessor {
  constructor() { super(); }
  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (input && input.length > 0 && input[0].length > 0) {
      const channelData = input[0];
      const pcm16 = new Int16Array(channelData.length);
      for (let i = 0; i < channelData.length; i++) {
        const s = Math.max(-1, Math.min(1, channelData[i]));
        pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }
      this.port.postMessage(pcm16.buffer, [pcm16.buffer]);
    }
    return true;
  }
}
registerProcessor('pcm-processor', PCMProcessor);
`;

// ═══════════════════════════════════════════════════════════════
// Quick Action Tasks — Fixed task panel (no need to speak these)
// ═══════════════════════════════════════════════════════════════
const QUICK_ACTIONS = [
    { label: "🌅 Sunset Theme", action: "set_sunset_theme" },
    { label: "🔧 Juniper Config", action: "highlight_juniper" },
    { label: "📄 View Resume", action: "open_resume" },
    { label: "📞 Contact", action: "scroll_contact" },
];

// ═══════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════
function base64ToUint8Array(base64: string) {
    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
}

function uint8ArrayToBase64(bytes: Uint8Array) {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return window.btoa(binary);
}

// ═══════════════════════════════════════════════════════════════
// Shared Function Call Handlers (used by both Voice & Quick Actions)
// ═══════════════════════════════════════════════════════════════
function executeAction(actionName: string, args?: any) {
    switch (actionName) {
        case "set_sunset_theme":
            document.documentElement.setAttribute('data-theme', 'sunset-theme');
            document.documentElement.style.setProperty('--gradient-primary', 'linear-gradient(45deg, #ff512f, #dd2476)');
            document.documentElement.style.setProperty('--heading', '#fff');
            document.documentElement.style.setProperty('--foreground', '#fff');
            break;
        case "highlight_juniper":
        case "highlight_code": {
            const target = args?.target || "juniper";
            const el = document.getElementById(`code-${target}`) || document.getElementById(target) || document.querySelector('[data-section="tech"]') || document.querySelector('.card:first-of-type');
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                el.classList.add('glow-effect');
                setTimeout(() => el.classList.remove('glow-effect'), 6000);
            }
            break;
        }
        case "open_resume":
            window.open('/docs/resume.pdf', '_blank');
            break;
        case "scroll_contact": {
            const contactSection = document.getElementById('contact') || document.querySelector('[data-section="contact"]');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                contactSection.classList.add('glow-effect');
                setTimeout(() => contactSection.classList.remove('glow-effect'), 4000);
            }
            break;
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// VoiceWidget Component
// ═══════════════════════════════════════════════════════════════
export default function VoiceWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState<"Idle" | "Connecting" | "Listening" | "Thinking" | "Speaking">("Idle");
    const [frequencies, setFrequencies] = useState<number[]>(new Array(16).fill(0));

    const wsRef = useRef<WebSocket | null>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const nextPlayTime = useRef<number>(0);

    // ───────────────────────────────────────────────────────────
    // Setup: Mic Permission → Fetch WSS URL from /api/audio → Connect
    // ───────────────────────────────────────────────────────────
    const setupAudioAndWS = async () => {
        try {
            setStatus("Connecting");

            // 1. Check microphone permission explicitly
            let micStream: MediaStream;
            try {
                micStream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, sampleRate: 16000 } });
            } catch (err) {
                alert("Please allow microphone access to use the Voice Assistant.");
                setStatus("Idle");
                setIsOpen(false);
                return;
            }
            streamRef.current = micStream;

            // 2. Fetch WSS URL securely from /api/audio (API key never on client)
            const res = await fetch('/api/audio');
            const { wsUrl, model } = await res.json();
            if (!wsUrl) throw new Error("No WSS URL returned from /api/audio");

            // 3. Open WebSocket
            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.onopen = async () => {
                // Send setup JSON with model, audio modality, system instructions, and tools
                ws.send(JSON.stringify({
                    setup: {
                        model: model,
                        generationConfig: {
                            responseModalities: ["AUDIO"],
                        },
                        systemInstruction: {
                            parts: [{
                                text: "You are Jyotirmoy's Digital Voice Twin. Respond in high-fidelity audio. If asked to change the theme, call the set_sunset_theme tool. If discussing Juniper switches, call highlight_code('juniper'). Start by introducing yourself professionally."
                            }]
                        },
                        tools: [{
                            functionDeclarations: [
                                {
                                    name: "set_sunset_theme",
                                    description: "Changes the website theme to a warm sunset vibe with orange-pink gradients.",
                                },
                                {
                                    name: "highlight_code",
                                    description: "Scrolls to and highlights a specific code snippet on the portfolio screen.",
                                    parameters: {
                                        type: "OBJECT",
                                        properties: {
                                            target: { type: "STRING" }
                                        },
                                        required: ["target"]
                                    }
                                }
                            ]
                        }]
                    }
                }));

                setStatus("Listening");

                // 4. Audio Capture via AudioWorklet
                const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                audioCtxRef.current = audioCtx;
                nextPlayTime.current = audioCtx.currentTime;

                const blob = new Blob([audioWorkletCode], { type: 'application/javascript' });
                const workletUrl = URL.createObjectURL(blob);
                await audioCtx.audioWorklet.addModule(workletUrl);

                const source = audioCtx.createMediaStreamSource(micStream);
                const processor = new AudioWorkletNode(audioCtx, 'pcm-processor');

                processor.port.onmessage = (e) => {
                    if (ws.readyState === WebSocket.OPEN) {
                        const pcm16 = new Int16Array(e.data);
                        const base64 = uint8ArrayToBase64(new Uint8Array(pcm16.buffer));
                        ws.send(JSON.stringify({
                            realtimeInput: {
                                mediaChunks: [{
                                    mimeType: "audio/pcm;rate=16000",
                                    data: base64
                                }]
                            }
                        }));

                        // Visualizer update (throttled)
                        if (Math.random() > 0.8) {
                            const sum = pcm16.reduce((acc, val) => acc + Math.abs(val), 0);
                            const avg = sum / pcm16.length;
                            setFrequencies(prev => {
                                const next = [...prev];
                                next.shift();
                                next.push(Math.min(100, avg / 100));
                                return next;
                            });
                        }
                    }
                };

                source.connect(processor);
                // Don't connect to destination — prevents echo/feedback
            };

            // ───────────────────────────────────────────────────
            // Handle incoming messages from Gemini
            // ───────────────────────────────────────────────────
            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);

                if (data.serverContent?.modelTurn) {
                    setStatus("Speaking");
                    const parts = data.serverContent.modelTurn.parts;

                    for (const part of parts) {
                        // Audio playback
                        if (part.inlineData?.data) {
                            const audioBytes = base64ToUint8Array(part.inlineData.data);
                            const pcm16 = new Int16Array(audioBytes.buffer);

                            if (audioCtxRef.current) {
                                const float32 = new Float32Array(pcm16.length);
                                for (let i = 0; i < pcm16.length; i++) {
                                    float32[i] = pcm16[i] / 0x8000;
                                }

                                // Gemini Live audio is 24kHz
                                const audioBuffer = audioCtxRef.current.createBuffer(1, float32.length, 24000);
                                audioBuffer.getChannelData(0).set(float32);

                                const bufferSource = audioCtxRef.current.createBufferSource();
                                bufferSource.buffer = audioBuffer;
                                bufferSource.connect(audioCtxRef.current.destination);

                                const playTime = Math.max(audioCtxRef.current.currentTime, nextPlayTime.current);
                                bufferSource.start(playTime);
                                nextPlayTime.current = playTime + audioBuffer.duration;

                                setTimeout(() => {
                                    setStatus(prev => prev === "Speaking" ? "Listening" : prev);
                                }, audioBuffer.duration * 1000);
                            }
                        }

                        // Function calling
                        if (part.functionCall) {
                            const { name, args } = part.functionCall;
                            executeAction(name, args);

                            // Respond to the model
                            ws.send(JSON.stringify({
                                toolResponse: {
                                    functionResponses: [{
                                        name: name,
                                        response: { result: "success" }
                                    }]
                                }
                            }));
                        }
                    }
                }
            };

            ws.onclose = () => stopAll();
            ws.onerror = (e) => { console.error("WebSocket Error:", e); stopAll(); };

        } catch (error) {
            console.error("Voice Setup Error:", error);
            stopAll();
        }
    };

    // ───────────────────────────────────────────────────────────
    // Cleanup
    // ───────────────────────────────────────────────────────────
    const stopAll = () => {
        if (wsRef.current) { wsRef.current.close(); wsRef.current = null; }
        if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
        if (audioCtxRef.current) { audioCtxRef.current.close(); audioCtxRef.current = null; }
        setStatus("Idle");
        setIsOpen(false);
    };

    const toggleAssistant = () => {
        if (isOpen) {
            stopAll();
        } else {
            setIsOpen(true);
            setupAudioAndWS();
        }
    };

    // ───────────────────────────────────────────────────────────
    // Render
    // ───────────────────────────────────────────────────────────
    return (
        <div className="fixed bottom-[110px] right-6 z-50 flex flex-col items-end print:hidden">
            {/* ═══ Expanded Drawer ═══ */}
            <div
                className={`
                    bg-surface/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl w-[300px] flex flex-col transition-all duration-300 transform origin-bottom-right mb-4 overflow-hidden
                    ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 h-0 pointer-events-none"}
                `}
                style={isOpen ? { height: 'auto', maxHeight: '340px' } : {}}
            >
                {/* Header & Status */}
                <div className="p-4 flex flex-col items-center justify-center relative">
                    <h3 className="text-sm font-bold gradient-text mb-1">Live Voice Assistant</h3>
                    <p className="text-xs text-muted-foreground mb-3">
                        {status === "Connecting" && "🔗 Establishing neural link..."}
                        {status === "Listening" && "🎙️ Listening to you..."}
                        {status === "Thinking" && "🧠 Analyzing..."}
                        {status === "Speaking" && "🔊 Jyotirmoy AI is speaking..."}
                        {status === "Idle" && "Click to connect"}
                    </p>

                    {/* Visualizer */}
                    <div className="flex items-end gap-1 h-10 w-full justify-center mb-3">
                        {frequencies.map((f, i) => (
                            <div
                                key={i}
                                className={`w-2 rounded-t-sm transition-all duration-100 ease-linear ${status === 'Speaking' ? 'bg-primary' : status === 'Listening' ? 'bg-accent/60' : 'bg-muted'}`}
                                style={{ height: `${Math.max(8, status === 'Idle' ? 8 : (status === 'Speaking' ? Math.random() * 100 : f))}%` }}
                            />
                        ))}
                    </div>

                    {/* Pulse Effect */}
                    {status === "Listening" && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border border-primary/20 animate-ping opacity-30 pointer-events-none" />
                    )}
                </div>

                {/* ═══ Fixed Quick-Action Task Panel ═══ */}
                <div className="border-t border-border px-3 py-3">
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-2 text-center">Quick Actions</p>
                    <div className="grid grid-cols-2 gap-2">
                        {QUICK_ACTIONS.map((qa) => (
                            <button
                                key={qa.action}
                                onClick={(e) => { e.stopPropagation(); executeAction(qa.action); }}
                                className="text-xs px-3 py-2 rounded-lg bg-surface hover:bg-surface-hover border border-border hover:border-primary/30 text-foreground transition-all duration-200 hover:scale-[1.02] active:scale-95 text-center"
                            >
                                {qa.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Ask Option */}
                <div className="border-t border-border px-3 py-2 text-center">
                    <p className="text-[9px] text-muted-foreground opacity-60">
                        Or just <span className="text-primary font-medium">ask me anything</span> by voice
                    </p>
                </div>
            </div>

            {/* ═══ Icon (Stacked 30px above ChatWidget) ═══ */}
            <button
                onClick={(e) => { e.nativeEvent.stopImmediatePropagation(); toggleAssistant(); }}
                className={`
                    relative flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 z-50
                    ${status === 'Listening' || status === 'Speaking'
                        ? "bg-surface border-2 border-primary animate-pulse"
                        : "bg-surface border border-border hover:border-primary/40"}
                `}
                aria-label="Toggle Voice Assistant"
            >
                {/* Mic / Waves Icon */}
                <svg className={`w-6 h-6 ${status !== 'Idle' ? 'text-primary' : 'text-foreground'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>

                {/* Close badge */}
                {isOpen && (
                    <div
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-danger flex items-center justify-center cursor-pointer shadow-md"
                        onClick={(e) => { e.stopPropagation(); stopAll(); }}
                    >
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                )}
            </button>
        </div>
    );
}
