"use client";

import { useState, useRef, useEffect } from "react";

// Inline AudioWorklet Processor for PCM16 conversion
const audioWorkletCode = `
class PCMProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
  }
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

function base64ToUint8Array(base64: string) {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
}

function uint8ArrayToBase64(bytes: Uint8Array) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

export default function VoiceWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState<"Idle" | "Connecting" | "Listening" | "Thinking" | "Speaking">("Idle");
    const [frequencies, setFrequencies] = useState<number[]>(new Array(16).fill(0));

    const wsRef = useRef<WebSocket | null>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Playback
    let nextPlayTime = useRef<number>(0);

    const setupAudioAndWS = async () => {
        try {
            setStatus("Connecting");

            // 1. Fetch API Key securely
            const res = await fetch('/api/gemini-token');
            const { key } = await res.json();
            if (!key) throw new Error("No API Key");

            // 2. Setup WebSocket
            const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${key}`;
            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.onopen = async () => {
                // Send setup message
                ws.send(JSON.stringify({
                    setup: {
                        model: "models/gemini-2.5-flash",
                        // Note: gemini-live-2.5-flash-native-audio endpoint alias is not strictly publicly available for all WS, usually gemini-2.5-flash or gemini-2.0-flash-exp supports bidi
                        generationConfig: {
                            responseModalities: ["AUDIO"],
                        },
                        systemInstruction: {
                            parts: [{
                                text: "You are the Digital Representative for Jyotirmoy Bhowmik. You are an expert in IT Infrastructure and Cloud Architecture. Your voice is your primary interface—be articulate, professional, and helpful. You have control over the portfolio's UI. When discussing Juniper switches or SAP deployments, use your tools to highlight the code on the user's screen. If the user wants a 'vibe change,' trigger the Sunset Theme. Start by introducing yourself professionally as Jyotirmoy's AI Representative."
                            }]
                        },
                        tools: [{
                            functionDeclarations: [
                                {
                                    name: "change_site_theme",
                                    description: "Changes the website theme. Use 'sunset-theme' for a warm, sunset vibe.",
                                    parameters: {
                                        type: "OBJECT",
                                        properties: {
                                            theme_name: { type: "STRING" }
                                        },
                                        required: ["theme_name"]
                                    }
                                },
                                {
                                    name: "ui_scroll_and_highlight",
                                    description: "Scrolls to and highlights a specific UI element on the screen.",
                                    parameters: {
                                        type: "OBJECT",
                                        properties: {
                                            element_id: { type: "STRING" }
                                        },
                                        required: ["element_id"]
                                    }
                                },
                                {
                                    name: "open_technical_document",
                                    description: "Opens a technical document or PDF by name.",
                                    parameters: {
                                        type: "OBJECT",
                                        properties: {
                                            doc_name: { type: "STRING" }
                                        },
                                        required: ["doc_name"]
                                    }
                                }
                            ]
                        }]
                    }
                }));

                setStatus("Listening");

                // 3. Audio Capture Setup
                const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                audioCtxRef.current = audioCtx;
                nextPlayTime.current = audioCtx.currentTime;

                const blob = new Blob([audioWorkletCode], { type: 'application/javascript' });
                const workletUrl = URL.createObjectURL(blob);
                await audioCtx.audioWorklet.addModule(workletUrl);

                const stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, sampleRate: 16000 } });
                streamRef.current = stream;

                const source = audioCtx.createMediaStreamSource(stream);
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

                        // Simple Visualizer update from mic input
                        if (Math.random() > 0.8) {
                            const sum = pcm16.reduce((acc, val) => acc + Math.abs(val), 0);
                            const avg = sum / pcm16.length;
                            setFrequencies(prev => {
                                const next = [...prev];
                                next.shift();
                                next.push(Math.min(100, avg / 100)); // Normalize somewhat
                                return next;
                            });
                        }
                    }
                };

                source.connect(processor);
                // We don't connect processor to destination otherwise we hear ourselves
            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);

                if (data.serverContent?.modelTurn) {
                    setStatus("Speaking");
                    const parts = data.serverContent.modelTurn.parts;

                    for (const part of parts) {
                        // Handle Audio
                        if (part.inlineData && part.inlineData.data) {
                            const audioBytes = base64ToUint8Array(part.inlineData.data);
                            const pcm16 = new Int16Array(audioBytes.buffer);

                            if (audioCtxRef.current) {
                                const float32Array = new Float32Array(pcm16.length);
                                for (let i = 0; i < pcm16.length; i++) {
                                    float32Array[i] = pcm16[i] / 0x8000;
                                }

                                // Gemini Live Server audio is 24kHz
                                const audioBuffer = audioCtxRef.current.createBuffer(1, float32Array.length, 24000);
                                audioBuffer.getChannelData(0).set(float32Array);

                                const source = audioCtxRef.current.createBufferSource();
                                source.buffer = audioBuffer;
                                source.connect(audioCtxRef.current.destination);

                                const playTime = Math.max(audioCtxRef.current.currentTime, nextPlayTime.current);
                                source.start(playTime);
                                nextPlayTime.current = playTime + audioBuffer.duration;

                                // Reset status to listening after speaking duration
                                setTimeout(() => {
                                    // Make sure it doesn't overwrite if more audio is queueing
                                    setStatus(prev => prev === "Speaking" ? "Listening" : prev);
                                }, audioBuffer.duration * 1000);
                            }
                        }

                        // Handle Function Calling
                        if (part.functionCall) {
                            const { name, args } = part.functionCall;
                            handleFunctionCall(name, args);

                            // Send function response
                            ws.send(JSON.stringify({
                                clientContent: {
                                    turnComplete: true,
                                    functionResponse: {
                                        name: name,
                                        response: { result: "success" }
                                    }
                                }
                            }));
                        }
                    }
                }
            };

            ws.onclose = () => {
                stopAll();
            };

            ws.onerror = (e) => {
                console.error("WebSocket Error: ", e);
                stopAll();
            };

        } catch (error) {
            console.error("Setup Error:", error);
            stopAll();
        }
    };

    const handleFunctionCall = (name: string, args: any) => {
        if (name === "change_site_theme") {
            document.documentElement.setAttribute('data-theme', args.theme_name);
        } else if (name === "ui_scroll_and_highlight") {
            // Attempt to find something or just glow the body as a demo
            const el = document.getElementById(args.element_id) || document.querySelector('.card:first-of-type') || document.body;
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                el.classList.add('ui-highlight-glow');
                setTimeout(() => el.classList.remove('ui-highlight-glow'), 6000);
            }
        } else if (name === "open_technical_document") {
            window.open('/docs/architecture.pdf', '_blank'); // Placeholder path
        }
    };

    const stopAll = () => {
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
        if (audioCtxRef.current) {
            audioCtxRef.current.close();
            audioCtxRef.current = null;
        }
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

    return (
        <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end print:hidden">
            {/* Drawer */}
            <div
                className={`
                    bg-surface/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl w-[300px] flex flex-col transition-all duration-300 transform origin-bottom-right mb-4 overflow-hidden
                    ${isOpen ? "opacity-100 scale-100 h-[180px]" : "opacity-0 scale-95 h-0 pointer-events-none"}
                `}
            >
                <div className="p-4 flex-1 flex flex-col items-center justify-center relative">
                    <h3 className="text-sm font-bold gradient-text mb-1">Live Representation</h3>
                    <p className="text-xs text-muted-foreground mb-4">
                        {status === "Connecting" && "Establishing neural link..."}
                        {status === "Listening" && "Listening to you..."}
                        {status === "Thinking" && "Analyzing..."}
                        {status === "Speaking" && "Jyotirmoy AI is speaking..."}
                    </p>

                    {/* Visualizer */}
                    <div className="flex items-end gap-1 h-12 w-full justify-center">
                        {frequencies.map((f, i) => (
                            <div
                                key={i}
                                className={`w-2 rounded-t-sm transition-all duration-100 ease-linear ${status === 'Speaking' ? 'bg-primary' : 'bg-accent/50'}`}
                                style={{ height: `${Math.max(10, status === 'Idle' ? 10 : (status === 'Speaking' ? Math.random() * 100 : f))}%` }}
                            />
                        ))}
                    </div>

                    {/* Pulse Effect */}
                    {status === "Listening" && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-primary/30 animate-ping opacity-50" />
                    )}
                </div>
            </div>

            {/* Icon Stack (Placed above standard ChatWidget) */}
            <button
                onClick={toggleAssistant}
                className={`
                    relative flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 z-50
                    ${status === 'Listening' || status === 'Speaking' ? "bg-surface border-2 border-primary animate-pulse" : "bg-surface border border-border"}
                `}
                aria-label="Toggle Voice Assistant"
            >
                <svg className={`w-6 h-6 ${status !== 'Idle' ? 'text-primary' : 'text-foreground'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>

                {isOpen && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-danger flex items-center justify-center cursor-pointer pointer-events-auto shadow-md" onClick={(e) => { e.stopPropagation(); stopAll(); }}>
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                    </div>
                )}
            </button>
        </div>
    );
}
