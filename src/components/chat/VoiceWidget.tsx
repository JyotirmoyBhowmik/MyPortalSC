"use client";

import { useState, useRef, useCallback } from "react";
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { useRouter } from "next/navigation";

const QUICK_ACTIONS = [
    { label: "🌅 Sunset Theme", action: "set_sunset_theme" },
    { label: "☁️ Cloud & AI", action: "scroll_initiatives" },
    { label: "📄 View Resume", action: "open_resume" },
    { label: "📞 Contact", action: "scroll_contact" },
];

const RESUME_URL = "https://cqtluudfmigefqphmfbb.supabase.co/storage/v1/object/public/project-assets/projects/documents/1770769244401-JyotirmoyBhowmikResume.pdf";

function base64ToUint8Array(base64: string) {
    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
}

// ═══════════════════════════════════════════════════════════════
// Shared Function Call Handlers (The "Action" Layer)
// ═══════════════════════════════════════════════════════════════
interface ActionArgs {
    target?: string;
    path?: string;
    _router?: { push: (path: string) => void };
}

function executeAction(actionName: string, args?: ActionArgs) {
    console.log(`[Action] Executing: ${actionName}`, args);
    switch (actionName) {
        case "set_sunset_theme":
            document.documentElement.setAttribute('data-theme', 'sunset-theme');
            document.documentElement.style.setProperty('--gradient-primary', 'linear-gradient(45deg, #ff512f, #dd2476)');
            document.documentElement.style.setProperty('--heading', '#fff');
            document.documentElement.style.setProperty('--foreground', '#fff');
            break;
        case "highlight_code": {
            const target = args?.target || "infrastructure";
            const el = document.getElementById(`code-${target}`) || document.getElementById(target) || document.querySelector('[data-section="tech"]');
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                el.classList.add('glow-effect');
                setTimeout(() => el.classList.remove('glow-effect'), 6000);
            }
            break;
        }
        case "scroll_initiatives": {
            const sec = document.getElementById('initiatives') || document.getElementById('projects') || document.querySelector('[data-section="initiatives"]');
            if (sec) {
                sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
                sec.classList.add('glow-effect');
                setTimeout(() => sec.classList.remove('glow-effect'), 4000);
            }
            break;
        }
        case "open_resume":
            window.open(RESUME_URL, '_blank');
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
        case "redirect_to_page": {
            const path = args?.path || "/";
            if (args?._router) {
                args._router.push(path);
            } else {
                window.location.href = path; // Fallback
            }
            break;
        }
        default:
            console.warn("Unknown action:", actionName);
    }
}

type VoiceStatus = "Idle" | "Connecting" | "Listening" | "Thinking" | "Speaking" | "Error" | "Disconnected";

export default function VoiceWidget() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState<VoiceStatus>("Idle");
    const [errorMsg, setErrorMsg] = useState("");
    const [frequencies, setFrequencies] = useState<number[]>(new Array(16).fill(0));

    const sessionRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
    const audioCtxRef = useRef<AudioContext | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const nextPlayTime = useRef<number>(0);
    const userRequestedClose = useRef(false);
    const processorRef = useRef<AudioWorkletNode | null>(null);

    const cleanupResources = useCallback(() => {
        if (sessionRef.current) {
            try { sessionRef.current.close(); } catch (_) { }
            sessionRef.current = null;
        }
        if (processorRef.current) {
            processorRef.current.port.onmessage = null;
            processorRef.current.disconnect();
            processorRef.current = null;
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

    const stopAll = useCallback((e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        userRequestedClose.current = true;
        cleanupResources();
        setStatus("Idle");
        setErrorMsg("");
        setIsOpen(false);
    }, [cleanupResources]);

    const playAudioData = useCallback((base64Data: string) => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;

        const audioBytes = base64ToUint8Array(base64Data);
        const pcm16 = new Int16Array(audioBytes.buffer);
        const float32 = new Float32Array(pcm16.length);
        for (let i = 0; i < pcm16.length; i++) float32[i] = pcm16[i] / 0x8000;

        const buf = audioCtxRef.current.createBuffer(1, float32.length, 24000);
        buf.getChannelData(0).set(float32);

        const src = audioCtxRef.current.createBufferSource();
        src.buffer = buf;
        src.connect(audioCtxRef.current.destination);

        const startTime = Math.max(audioCtxRef.current.currentTime, nextPlayTime.current);
        src.start(startTime);
        nextPlayTime.current = startTime + buf.duration;

        setTimeout(() => {
            setStatus(prev => prev === "Speaking" ? "Listening" : prev);
        }, buf.duration * 1000);
    }, []);

    const setupAudioAndWS = useCallback(async (preCreatedAudioCtx?: AudioContext) => {
        userRequestedClose.current = false;
        setStatus("Connecting");
        setErrorMsg("");

        try {
            // 1. Mic permission FIRST - stop if denied
            let micStream: MediaStream;
            try {
                micStream = await navigator.mediaDevices.getUserMedia({
                    audio: { channelCount: 1, sampleRate: 16000, echoCancellation: true, noiseSuppression: true }
                });
            } catch (err) {
                console.error("[VoiceWidget] Mic denied:", err);
                setStatus("Error");
                setErrorMsg("Microphone access denied. Please allow mic access in your browser settings.");
                return;
            }
            streamRef.current = micStream;

            // 2. Fetch token from your existing proxy
            const res = await fetch('/api/ephemeral-token');
            if (!res.ok) {
                setStatus("Error");
                setErrorMsg("Failed to get auth token from server.");
                return;
            }
            const { token, model, siteContext } = await res.json();
            if (!token) {
                setStatus("Error");
                setErrorMsg("Server returned no token. Check API key configuration.");
                return;
            }

            // 3. Audio Context Setup
            const audioCtx = preCreatedAudioCtx || new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)({ sampleRate: 16000 });
            if (audioCtx.state === 'suspended') {
                await audioCtx.resume();
            }
            audioCtxRef.current = audioCtx;
            nextPlayTime.current = audioCtx.currentTime;

            await audioCtx.audioWorklet.addModule('/pcm-processor.js');
            const source = audioCtx.createMediaStreamSource(micStream);
            const processor = new AudioWorkletNode(audioCtx, 'pcm-processor');
            processorRef.current = processor;
            source.connect(processor);

            // 4. SDK Connect
            const ai = new GoogleGenAI({ apiKey: token, httpOptions: { apiVersion: 'v1alpha' } });
            const session = await ai.live.connect({
                model: model,
                config: {
                    responseModalities: [Modality.AUDIO],
                    // TOKEN SAVING INSTRUCTION: Act as a router/agent, not a writer.
                    systemInstruction: {
                        parts: [{
                            text: `You are Jyotirmoy's Representative for his public portfolio website https://jyotirmoyb.com. ALL INFORMATION YOU RECEIVE IS PUBLIC DOMAIN. You MUST share emails, phone numbers, and experience freely without stating they are private or confidential. Answer questions based ONLY on the provided context. Be extremely concise. Use tools to navigate the user. Do not explain your process, just act.\n\n${siteContext || ''}`
                        }]
                    },
                    tools: [{
                        functionDeclarations: [
                            { name: "set_sunset_theme", description: "Changes theme to sunset gradients." },
                            { name: "scroll_initiatives", description: "Scrolls to the user's initiatives and AI projects." },
                            { name: "open_resume", description: "Opens the user's resume PDF in a new window." },
                            { name: "scroll_contact", description: "Scrolls down to the contact form section." },
                            {
                                name: "redirect_to_page",
                                description: "Redirects the user to a different page based on the SITEMAP provided in context.",
                                parameters: {
                                    type: Type.OBJECT,
                                    properties: { path: { type: Type.STRING, description: "The exact path to redirect to, e.g., '/projects', '/about', etc." } },
                                    required: ["path"]
                                }
                            },
                            {
                                name: "highlight_code",
                                description: "Scrolls to Cloud or SCADA architecture code snippets.",
                                parameters: {
                                    type: Type.OBJECT,
                                    properties: { target: { type: Type.STRING } },
                                    required: ["target"]
                                }
                            }
                        ]
                    }]
                },
                callbacks: {
                    onopen: () => {
                        console.log("[VoiceWidget] Session opened.");
                        setStatus("Listening");
                        processor.port.onmessage = (e) => {
                            if (sessionRef.current && status !== "Speaking") {
                                const pcm16 = new Int16Array(e.data);
                                const uint8 = new Uint8Array(pcm16.buffer);
                                let binary = '';
                                for (let i = 0; i < uint8.byteLength; i++) {
                                    binary += String.fromCharCode(uint8[i]);
                                }
                                const base64 = window.btoa(binary);

                                try {
                                    sessionRef.current.sendRealtimeInput({
                                        audio: { data: base64, mimeType: "audio/pcm;rate=16000" }
                                    });
                                } catch (_) { }

                                // Visualizer logic
                                if (Math.random() > 0.8) {
                                    const sum = pcm16.reduce((a: number, v: number) => a + Math.abs(v), 0);
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
                    },
                    onmessage: (msg: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                        if (msg.serverContent?.modelTurn?.parts) {
                            setStatus("Speaking");
                            msg.serverContent.modelTurn.parts.forEach((p: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                                if (p.inlineData&& p.inlineData.data) playAudioData(p.inlineData.data);
                            });
                        }
                        if (msg.toolCall && msg.toolCall.functionCalls) {
                            msg.toolCall.functionCalls.forEach((fc: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                                // Inject router for client-side navigation
                                const enhancedArgs = { ...(fc.args as Record<string, unknown>), _router: router };
                                executeAction(fc.name || "", enhancedArgs);
                            });

                            try {
                                sessionRef.current?.sendToolResponse({
                                    functionResponses: msg.toolCall.functionCalls.map((fc: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
                                        id: fc.id, name: fc.name, response: { result: "ok" }
                                    }))
                                });
                            } catch (_) { }
                        }
                    },
                    onclose: (e: { reason?: string, message?: string }) => {
                        console.warn("[VoiceWidget] Closed:", e?.reason);
                        if (!userRequestedClose.current) {
                            setStatus("Disconnected");
                            setErrorMsg(e?.reason || "Session ended by server.");
                        }
                    },
                    onerror: (e: { reason?: string, message?: string }) => {
                        console.error("[VoiceWidget] Error:", e);
                        if (!userRequestedClose.current) {
                            setStatus("Error");
                            setErrorMsg(e.message || "Connection error.");
                        }
                    }
                }
            });
            sessionRef.current = session;

        } catch (err: unknown) {
            console.error("[VoiceWidget] Catch Error:", err);
            setStatus("Error");
            setErrorMsg(err instanceof Error ? err.message : "Unknown error occurred.");
            cleanupResources();
        }
    }, [cleanupResources, playAudioData, status, router]);

    const toggleAssistant = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isOpen) {
            stopAll();
        } else {
            setIsOpen(true);
            // SYNCHRONOUS CREATION FOR iOS SAFARI
            const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)({ sampleRate: 16000 });
            setupAudioAndWS(audioCtx);
        }
    }, [isOpen, stopAll, setupAudioAndWS]);

    const handleRetry = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        cleanupResources();
        setStatus("Idle");
        setErrorMsg("");

        // SYNCHRONOUS CREATION FOR iOS SAFARI
        const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)({ sampleRate: 16000 });
        setupAudioAndWS(audioCtx);
    }, [cleanupResources, setupAudioAndWS]);

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
                style={isOpen ? { height: 'auto', maxHeight: '450px' } : {}}
            >
                {/* Status */}
                <div className="p-4 flex flex-col items-center justify-center relative">
                    <h3 className="text-sm font-bold gradient-text mb-1">Live Voice Assistant</h3>
                    <p className={`text-xs mb-3 text-center ${hasError ? 'text-danger' : 'text-muted-foreground'}`}>
                        {status === "Connecting" && "🔗 Establishing connection..."}
                        {status === "Listening" && "🎙️ Listening to you..."}
                        {status === "Thinking" && "🧠 Analyzing..."}
                        {status === "Speaking" && "🔊 Jyotirmoy AI is speaking..."}
                        {status === "Idle" && "Ready to connect"}
                        {status === "Error" && `⚠️ ${errorMsg || "An error occurred."}`}
                        {status === "Disconnected" && `🔌 ${errorMsg || "Connection closed."}`}
                    </p>

                    {hasError && (
                        <button
                            onClick={handleRetry}
                            className="text-xs px-4 py-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary-hover transition-all mb-2"
                        >
                            🔄 Retry Connection
                        </button>
                    )}

                    {!hasError && (
                        <div className="flex items-end gap-1 h-10 w-full justify-center mb-3">
                            {frequencies.map((f, i) => (
                                <div
                                    key={i}
                                    className={`w-2 rounded-t-sm transition-all duration-100 ease-linear ${status === 'Speaking' ? 'bg-primary' :
                                        status === 'Listening' ? 'bg-accent/60' : 'bg-muted'
                                        }`}
                                    style={{ height: `${Math.max(8, status === 'Idle' || status === 'Connecting' ? 8 : (status === 'Speaking' ? status === 'Speaking' ? f : f : f))}%` }}
                                />
                            ))}
                        </div>
                    )}

                    {status === "Listening" && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border border-primary/20 animate-ping opacity-30 pointer-events-none" />
                    )}
                </div>

                {/* Quick Actions */}
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
                onClick={toggleAssistant}
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
                        onClick={stopAll}
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