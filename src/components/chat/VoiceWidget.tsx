"use client";

import { useState, useRef, useCallback } from "react";

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
    { label: "☁️ Cloud & AI", action: "scroll_initiatives" },
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
// Shared Function Call Handlers
// ═══════════════════════════════════════════════════════════════
function executeAction(actionName: string, args?: any) {
    switch (actionName) {
        case "set_sunset_theme":
            document.documentElement.setAttribute('data-theme', 'sunset-theme');
            document.documentElement.style.setProperty('--gradient-primary', 'linear-gradient(45deg, #ff512f, #dd2476)');
            document.documentElement.style.setProperty('--heading', '#fff');
            document.documentElement.style.setProperty('--foreground', '#fff');
            break;
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
        case "scroll_initiatives": {
            // Scroll to IT/Cloud/AI initiatives section
            const sec = document.getElementById('initiatives') || document.getElementById('projects') || document.querySelector('[data-section="initiatives"]') || document.querySelector('[data-section="projects"]');
            if (sec) {
                sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
                sec.classList.add('glow-effect');
                setTimeout(() => sec.classList.remove('glow-effect'), 4000);
            }
            break;
        }
        case "open_resume":
            window.open('https://cqtluudfmigefqphmfbb.supabase.co/storage/v1/object/public/project-assets/projects/documents/1770769244401-JyotirmoyBhowmikResume.pdf', '_blank');
            break;
        case "scroll_contact": {
            const s = document.getElementById('contact') || document.querySelector('[data-section="contact"]');
            if (s) {
                s.scrollIntoView({ behavior: 'smooth', block: 'start' });
                s.classList.add('glow-effect');
                setTimeout(() => s.classList.remove('glow-effect'), 4000);
            }
            break;
        }
    }
}

type VoiceStatus = "Idle" | "Connecting" | "Listening" | "Thinking" | "Speaking" | "Error" | "Disconnected";

// ═══════════════════════════════════════════════════════════════
// VoiceWidget Component
// ═══════════════════════════════════════════════════════════════
export default function VoiceWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState<VoiceStatus>("Idle");
    const [errorMsg, setErrorMsg] = useState("");
    const [frequencies, setFrequencies] = useState<number[]>(new Array(16).fill(0));

    const wsRef = useRef<WebSocket | null>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const nextPlayTime = useRef<number>(0);
    // Guard against the race: only allow stopAll from ws.onclose if user requested it
    const userRequestedClose = useRef(false);

    // ───────────────────────────────────────────────────────────
    // Cleanup resources WITHOUT closing the UI panel
    // ───────────────────────────────────────────────────────────
    const cleanupResources = useCallback(() => {
        if (wsRef.current) {
            try { wsRef.current.close(); } catch (_) { }
            wsRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
        if (audioCtxRef.current) {
            try { audioCtxRef.current.close(); } catch (_) { }
            audioCtxRef.current = null;
        }
    }, []);

    // Full close (user-initiated): clean resources AND close panel
    const stopAll = useCallback(() => {
        userRequestedClose.current = true;
        cleanupResources();
        setStatus("Idle");
        setErrorMsg("");
        setIsOpen(false);
    }, [cleanupResources]);

    // ───────────────────────────────────────────────────────────
    // Setup: Mic → Fetch /api/audio → WebSocket → AudioWorklet
    // ───────────────────────────────────────────────────────────
    const setupAudioAndWS = useCallback(async () => {
        userRequestedClose.current = false;
        setErrorMsg("");

        try {
            setStatus("Connecting");

            // 1. Check BOTH microphone AND speaker/audio output permissions
            // Speaker test: try to create and resume an AudioContext (catches muted/blocked output)
            try {
                const testCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
                if (testCtx.state === 'suspended') {
                    await testCtx.resume();
                }
                // Quick oscillator beep to confirm speakers work (silent — just tests the pipeline)
                const osc = testCtx.createOscillator();
                const gain = testCtx.createGain();
                gain.gain.value = 0; // silent
                osc.connect(gain);
                gain.connect(testCtx.destination);
                osc.start();
                osc.stop(testCtx.currentTime + 0.01);
                await testCtx.close();
            } catch (speakerErr) {
                console.error("Speaker check failed:", speakerErr);
                setStatus("Error");
                setErrorMsg("Audio output (speakers) could not be initialized. Check your system audio settings.");
                return;
            }

            // Microphone permission
            let micStream: MediaStream;
            try {
                micStream = await navigator.mediaDevices.getUserMedia({
                    audio: { channelCount: 1, sampleRate: 16000, echoCancellation: true, noiseSuppression: true }
                });
            } catch (err) {
                console.error("Mic denied:", err);
                setStatus("Error");
                setErrorMsg("Microphone access denied. Please allow mic access in your browser settings.");
                return; // Keep widget open so user sees the error
            }
            streamRef.current = micStream;

            // 2. Fetch WSS URL from /api/audio
            const res = await fetch('/api/audio');
            if (!res.ok) {
                setStatus("Error");
                setErrorMsg("Failed to get audio config from server.");
                return;
            }
            const { wsUrl, model } = await res.json();
            if (!wsUrl) {
                setStatus("Error");
                setErrorMsg("Server returned no WebSocket URL. Check API key.");
                return;
            }

            console.log("[VoiceWidget] Connecting to:", model);

            // 3. Prepare AudioContext & Worklet BEFORE opening WebSocket
            //    (avoids async races inside ws.onopen)
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            audioCtxRef.current = audioCtx;
            nextPlayTime.current = audioCtx.currentTime;

            const blob = new Blob([audioWorkletCode], { type: 'application/javascript' });
            const workletUrl = URL.createObjectURL(blob);
            await audioCtx.audioWorklet.addModule(workletUrl);

            const source = audioCtx.createMediaStreamSource(micStream);
            const processor = new AudioWorkletNode(audioCtx, 'pcm-processor');
            source.connect(processor);
            // Don't connect processor to destination (prevents echo)

            // 4. Open WebSocket
            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log("[VoiceWidget] WebSocket connected, sending setup...");
                // Send setup (synchronous — no awaits in this handler)
                ws.send(JSON.stringify({
                    setup: {
                        model: model,
                        generationConfig: {
                            responseModalities: ["AUDIO"],
                        },
                        systemInstruction: {
                            parts: [{
                                text: "You are Jyotirmoy's Digital Voice Twin. Respond in high-fidelity audio. " +
                                    "If asked to change the theme, call the set_sunset_theme tool. " +
                                    "If discussing Juniper switches, call highlight_code with target 'juniper'. " +
                                    "Start by briefly introducing yourself as Jyotirmoy's AI representative."
                            }]
                        },
                        tools: [{
                            functionDeclarations: [
                                {
                                    name: "set_sunset_theme",
                                    description: "Changes the website theme to a warm sunset vibe.",
                                },
                                {
                                    name: "highlight_code",
                                    description: "Scrolls to and highlights a code snippet on screen.",
                                    parameters: {
                                        type: "OBJECT",
                                        properties: { target: { type: "STRING" } },
                                        required: ["target"]
                                    }
                                }
                            ]
                        }]
                    }
                }));

                setStatus("Listening");

                // Start sending mic audio
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

                        // Visualizer (throttled)
                        if (Math.random() > 0.8) {
                            const sum = pcm16.reduce((a, v) => a + Math.abs(v), 0);
                            const avg = sum / pcm16.length;
                            setFrequencies(prev => {
                                const n = [...prev];
                                n.shift();
                                n.push(Math.min(100, avg / 100));
                                return n;
                            });
                        }
                    }
                };
            };

            // ─── Handle server messages ───
            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

                    // Setup complete acknowledgment
                    if (data.setupComplete) {
                        console.log("[VoiceWidget] Setup acknowledged by server.");
                        setStatus("Listening");
                        return;
                    }

                    if (data.serverContent?.modelTurn) {
                        setStatus("Speaking");
                        const parts = data.serverContent.modelTurn.parts;

                        for (const part of parts) {
                            // Audio playback
                            if (part.inlineData?.data && audioCtxRef.current) {
                                const audioBytes = base64ToUint8Array(part.inlineData.data);
                                const pcm16 = new Int16Array(audioBytes.buffer);
                                const float32 = new Float32Array(pcm16.length);
                                for (let i = 0; i < pcm16.length; i++) float32[i] = pcm16[i] / 0x8000;

                                const buf = audioCtxRef.current.createBuffer(1, float32.length, 24000);
                                buf.getChannelData(0).set(float32);

                                const src = audioCtxRef.current.createBufferSource();
                                src.buffer = buf;
                                src.connect(audioCtxRef.current.destination);

                                const t = Math.max(audioCtxRef.current.currentTime, nextPlayTime.current);
                                src.start(t);
                                nextPlayTime.current = t + buf.duration;

                                setTimeout(() => {
                                    setStatus(prev => prev === "Speaking" ? "Listening" : prev);
                                }, buf.duration * 1000);
                            }

                            // Function calling
                            if (part.functionCall) {
                                const { name, args } = part.functionCall;
                                executeAction(name, args);
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
                } catch (parseErr) {
                    console.error("[VoiceWidget] Failed to parse server message:", parseErr);
                }
            };

            // ─── Handle close: DO NOT auto-close the UI ───
            ws.onclose = (ev) => {
                console.warn(`[VoiceWidget] WebSocket closed: code=${ev.code} reason="${ev.reason}" wasClean=${ev.wasClean}`);
                cleanupResources();
                if (!userRequestedClose.current) {
                    // Server-side disconnect → show error, keep panel open
                    setStatus("Disconnected");
                    setErrorMsg(
                        ev.code === 1000 ? "" :
                            ev.code === 1006 ? "Connection lost. The model may not be available on your plan." :
                                `Disconnected (code ${ev.code}). ${ev.reason || "Try again."}`
                    );
                }
            };

            ws.onerror = (e) => {
                console.error("[VoiceWidget] WebSocket error:", e);
                // onerror is always followed by onclose, so don't duplicate logic here
            };

        } catch (error: any) {
            console.error("[VoiceWidget] Setup Error:", error);
            cleanupResources();
            setStatus("Error");
            setErrorMsg(error.message || "Unexpected error during setup.");
        }
    }, [cleanupResources]);

    // ───────────────────────────────────────────────────────────
    // Toggle
    // ───────────────────────────────────────────────────────────
    const toggleAssistant = useCallback(() => {
        if (isOpen) {
            stopAll();
        } else {
            setIsOpen(true);
            setupAudioAndWS();
        }
    }, [isOpen, stopAll, setupAudioAndWS]);

    const handleRetry = useCallback(() => {
        cleanupResources();
        setStatus("Idle");
        setErrorMsg("");
        setupAudioAndWS();
    }, [cleanupResources, setupAudioAndWS]);

    // ───────────────────────────────────────────────────────────
    // Render
    // ───────────────────────────────────────────────────────────
    const isActive = status === "Listening" || status === "Speaking";
    const hasError = status === "Error" || status === "Disconnected";

    return (
        <div className="fixed bottom-[110px] right-6 z-50 flex flex-col items-end print:hidden">
            {/* ═══ Expanded Drawer ═══ */}
            <div
                className={`
                    bg-surface/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl w-[300px] flex flex-col transition-all duration-300 transform origin-bottom-right mb-4 overflow-hidden
                    ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 h-0 pointer-events-none"}
                `}
                style={isOpen ? { height: 'auto', maxHeight: '400px' } : {}}
            >
                {/* Status */}
                <div className="p-4 flex flex-col items-center justify-center relative">
                    <h3 className="text-sm font-bold gradient-text mb-1">Live Voice Assistant</h3>
                    <p className={`text-xs mb-3 ${hasError ? 'text-danger' : 'text-muted-foreground'}`}>
                        {status === "Connecting" && "🔗 Establishing connection..."}
                        {status === "Listening" && "🎙️ Listening to you..."}
                        {status === "Thinking" && "🧠 Analyzing..."}
                        {status === "Speaking" && "🔊 Jyotirmoy AI is speaking..."}
                        {status === "Idle" && "Ready to connect"}
                        {status === "Error" && `⚠️ ${errorMsg || "An error occurred."}`}
                        {status === "Disconnected" && `🔌 ${errorMsg || "Connection closed."}`}
                    </p>

                    {/* Retry button when disconnected/error */}
                    {hasError && (
                        <button
                            onClick={handleRetry}
                            className="text-xs px-4 py-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary-hover transition-all mb-2"
                        >
                            🔄 Retry Connection
                        </button>
                    )}

                    {/* Visualizer */}
                    {!hasError && (
                        <div className="flex items-end gap-1 h-10 w-full justify-center mb-3">
                            {frequencies.map((f, i) => (
                                <div
                                    key={i}
                                    className={`w-2 rounded-t-sm transition-all duration-100 ease-linear ${status === 'Speaking' ? 'bg-primary' :
                                        status === 'Listening' ? 'bg-accent/60' : 'bg-muted'
                                        }`}
                                    style={{ height: `${Math.max(8, status === 'Idle' || status === 'Connecting' ? 8 : (status === 'Speaking' ? Math.random() * 100 : f))}%` }}
                                />
                            ))}
                        </div>
                    )}

                    {/* Pulse */}
                    {status === "Listening" && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border border-primary/20 animate-ping opacity-30 pointer-events-none" />
                    )}
                </div>

                {/* ═══ Quick Actions ═══ */}
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

                <div className="border-t border-border px-3 py-2 text-center">
                    <p className="text-[9px] text-muted-foreground opacity-60">
                        Or just <span className="text-primary font-medium">ask me anything</span> by voice
                    </p>
                </div>
            </div>

            {/* ═══ Icon ═══ */}
            <button
                onClick={(e) => { e.nativeEvent.stopImmediatePropagation(); toggleAssistant(); }}
                className={`
                    relative flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 z-50
                    ${isActive ? "bg-surface border-2 border-primary animate-pulse" :
                        hasError ? "bg-surface border-2 border-danger" :
                            "bg-surface border border-border hover:border-primary/40"}
                `}
                aria-label="Toggle Voice Assistant"
            >
                <svg className={`w-6 h-6 ${isActive ? 'text-primary' : hasError ? 'text-danger' : 'text-foreground'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>

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
