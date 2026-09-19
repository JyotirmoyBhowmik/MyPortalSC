"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "@/lib/i18n";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
}

export default function ChatWidget() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const sendMessage = async (text: string) => {
        if (!text.trim() || isLoading) return;

        const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        // Create a placeholder for the assistant's reply
        const assistantMsgId = (Date.now() + 1).toString();
        setMessages((prev) => [...prev, { id: assistantMsgId, role: "assistant", content: "" }]);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: newMessages }),
            });

            if (!res.ok) throw new Error("Network response was not ok");
            const reader = res.body?.getReader();
            const decoder = new TextDecoder();
            if (!reader) return;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                // Decode chunk and append as raw text (since we use toTextStreamResponse)
                const chunk = decoder.decode(value, { stream: true });
                setMessages((prev) => prev.map(m => m.id === assistantMsgId ? { ...m, content: m.content + chunk } : m));
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages((prev) => [...prev, { id: Date.now().toString(), role: "assistant", content: "Sorry, I am having trouble connecting right now." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await sendMessage(input);
    };


    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end print:hidden">
            {/* Chat Box */}
            <div
                className={`
                    bg-surface/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl w-[350px] sm:w-[400px] flex flex-col transition-all duration-300 transform origin-bottom-right mb-4
                    ${isOpen ? "opacity-100 scale-100 h-[500px]" : "opacity-0 scale-95 h-0 pointer-events-none"}
                `}
            >
                {/* Header */}
                <div className="px-5 py-4 border-b border-border flex justify-between items-center bg-background/50 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-xs shadow-md">
                            JB
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-foreground">Jyotirmoy AI</h3>
                            <p className="text-[10px] text-primary flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                Online (Gemini 2.5)
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-muted-foreground hover:text-foreground transition-colors p-1"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-5 pb-2 space-y-4 no-scrollbar">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
                            <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white mb-1 rotate-12 shadow-md">
                                🤖
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-foreground">Hi! I&apos;m Jyotirmoy&apos;s Digital Twin.</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Ask me about IT projects, architecture, or budgets!</p>
                            </div>
                            <div className="flex flex-col gap-1.5 w-full pt-2">
                                {[
                                    "Summarize 10-year IT roadmap & budget spend",
                                    "Explain OT & SCADA cybersecurity strategy",
                                    "How does the site's AST Codebase Graph work?",
                                    "What cloud and data center migrations did you lead?"
                                ].map((chip) => (
                                    <button
                                        key={chip}
                                        type="button"
                                        onClick={() => sendMessage(chip)}
                                        className="text-left px-3 py-1.5 rounded-xl border border-border/70 bg-surface/70 hover:bg-primary/10 hover:border-primary/40 text-[11px] text-foreground transition-all hover:scale-[1.01] active:scale-[0.99] shadow-xs cursor-pointer"
                                    >
                                        💡 {chip}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        messages.map((m) => (
                            <div
                                key={m.id}
                                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`
                                        max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm
                                        ${m.role === "user"
                                            ? "bg-primary text-primary-foreground rounded-br-none"
                                            : "bg-surface text-foreground border border-border rounded-bl-none"}
                                    `}
                                >
                                    {m.content}
                                </div>
                            </div>
                        ))
                    )}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-surface border border-border rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" />
                                <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                                <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-border bg-background/30 rounded-b-2xl">
                    <form onSubmit={handleFormSubmit} className="relative flex items-center">
                        <input
                            required
                            name="prompt"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything..."
                            className="w-full bg-surface border border-border rounded-full pl-4 pr-12 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all placeholder:text-muted-foreground"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="absolute right-1.5 w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground rounded-full hover:bg-primary-hover disabled:opacity-50 disabled:hover:bg-primary transition-all shadow-md"
                        >
                            <svg className="w-3.5 h-3.5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19V5m0 0l-7 7m7-7l7 7" />
                            </svg>
                        </button>
                    </form>
                    <p className="text-[9px] text-center text-muted-foreground mt-3 font-medium tracking-wide opacity-60">
                        AI can sometimes make mistakes.
                    </p>
                </div>
            </div>

            {/* Toggle Button */}
            <button
                onClick={(e) => { e.nativeEvent.stopImmediatePropagation(); setIsOpen(!isOpen) }}
                className={`
                    flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 z-50
                    ${isOpen ? "bg-surface border border-border text-foreground" : "gradient-bg text-white shadow-primary/30"}
                `}
                aria-label="Toggle Chat"
            >
                {isOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                )}
            </button>
        </div>
    );
}
