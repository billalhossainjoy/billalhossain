"use client";

import { useEffect, useRef, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

type Role = "user" | "ai";

interface Message {
  id: string;
  role: Role;
  text: string;
}

// ── Config ────────────────────────────────────────────────────────────────────

const RAG_API_URL =
  process.env.NEXT_PUBLIC_RAG_API_URL ?? "http://localhost:8787";

const WELCOME: Message = {
  id: "welcome",
  role: "ai",
  text: "Hi! I'm Billal's AI assistant. Ask me anything about his skills, projects, or experience.",
};

const SUGGESTIONS = ["What are his skills?", "Tell me about his projects", "How to contact him?"];

// ── Sub-components ────────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 max-w-[80%]">
      <div className="size-7 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-xs font-bold text-green-400 shrink-0">
        B
      </div>
      <div className="bg-white/5 border border-white/10 rounded-xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-1.5 rounded-full bg-gray-400"
            style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
}

function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : ""} max-w-[85%] ${isUser ? "self-end" : "self-start"}`}>
      {!isUser && (
        <div className="size-7 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-xs font-bold text-green-400 shrink-0">
          B
        </div>
      )}
      <p
        className={`px-3 py-2.5 rounded-xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
          isUser
            ? "bg-green-500 text-white rounded-br-sm"
            : "bg-white/5 border border-white/10 text-gray-200 rounded-bl-sm"
        }`}
      >
        {message.text}
      </p>
    </div>
  );
}

// ── Close icon ────────────────────────────────────────────────────────────────

function IconX({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
  );
}

function IconSend({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.154.75.75 0 0 0 0-1.115A28.897 28.897 0 0 0 3.105 2.288Z" />
    </svg>
  );
}

function IconChat({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M10 2c-2.236 0-4.43.18-6.57.524C1.993 2.755 1 4.014 1 5.426v5.148c0 1.413.993 2.67 2.43 2.902.848.137 1.705.248 2.57.331v3.443a.75.75 0 0 0 1.28.53l3.58-3.579a.78.78 0 0 1 .527-.224 41.202 41.202 0 0 0 5.183-.5c1.437-.232 2.43-1.49 2.43-2.903V5.426c0-1.413-.993-2.67-2.43-2.902A41.289 41.289 0 0 0 10 2Zm0 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM8 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm5 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
    </svg>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ChatWidget() {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLInputElement>(null);

  // Lock body scroll when chat is open on mobile
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when chat opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  async function sendMessage() {
    const question = input.trim();
    if (!question || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", text: question };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${RAG_API_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = (await res.json()) as { answer?: string; error?: string };
      const text = data.answer ?? data.error ?? "Something went wrong. Please try again.";

      setMessages((prev) => [...prev, { id: `ai-${Date.now()}`, role: "ai", text }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: `err-${Date.now()}`, role: "ai", text: "Couldn't reach the AI. Make sure the rag-api is running." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  }

  function pickSuggestion(q: string) {
    setInput(q);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  return (
    <>
      <style>{`
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes chatSheetUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0);    }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40%           { transform: translateY(-6px); }
        }
        .chat-desktop { animation: chatSlideUp 0.25s cubic-bezier(0.34,1.56,0.64,1) both; }
        .chat-mobile  { animation: chatSheetUp 0.3s cubic-bezier(0.32,0.72,0,1) both; }
      `}</style>

      {/* ── Mobile full-screen overlay (< sm) ── */}
      {open && (
        <div className="sm:hidden fixed inset-0 z-[60] flex flex-col bg-gray-900">
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1 shrink-0">
            <div className="w-10 h-1 rounded-full bg-white/20" />
          </div>

          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 shrink-0">
            <div className="relative">
              <div className="size-9 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-sm font-bold text-green-400">
                B
              </div>
              <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-green-400 border-2 border-gray-900" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">Billal&apos;s AI</p>
              <p className="text-xs text-green-400">Active now</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="size-9 rounded-full flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition active:scale-90"
              aria-label="Close chat"
            >
              <IconX className="size-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {loading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length === 1 && !loading && (
            <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide shrink-0">
              {SUGGESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => pickSuggestion(q)}
                  className="shrink-0 text-xs px-3 py-2 rounded-full border border-green-500/30 text-green-400 hover:bg-green-500/10 active:scale-95 transition"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input — sits above virtual keyboard */}
          <div className="px-3 pb-safe-4 pt-2 border-t border-white/10 shrink-0" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
            <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 focus-within:border-green-500/50 transition">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about Billal…"
                maxLength={400}
                disabled={loading}
                className="flex-1 bg-transparent text-base text-white placeholder-gray-500 focus:outline-none disabled:opacity-50"
              />
              <button
                onClick={() => void sendMessage()}
                disabled={!input.trim() || loading}
                className="size-9 rounded-xl bg-green-500 flex items-center justify-center text-white hover:bg-green-400 disabled:opacity-40 disabled:cursor-not-allowed transition active:scale-90 shrink-0"
                aria-label="Send message"
              >
                <IconSend className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Desktop floating panel (sm+) ── */}
      <div className="fixed bottom-6 right-6 z-50 hidden sm:flex flex-col items-end gap-3">
        {open && (
          <div className="chat-desktop w-[360px] h-[520px] flex flex-col rounded-2xl border border-white/10 bg-gray-900/95 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-white/[0.03] shrink-0">
              <div className="relative">
                <div className="size-9 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-sm font-bold text-green-400">
                  B
                </div>
                <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-green-400 border-2 border-gray-900" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">Billal&apos;s AI</p>
                <p className="text-xs text-green-400">Active now</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="size-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition"
                aria-label="Close chat"
              >
                <IconX className="size-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 scroll-smooth">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {loading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length === 1 && !loading && (
              <div className="px-4 pb-2 flex flex-wrap gap-2 shrink-0">
                {SUGGESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => pickSuggestion(q)}
                    className="text-xs px-3 py-1.5 rounded-full border border-green-500/30 text-green-400 hover:bg-green-500/10 transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-3 pb-3 shrink-0">
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 focus-within:border-green-500/50 transition">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything about Billal…"
                  maxLength={400}
                  disabled={loading}
                  className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none disabled:opacity-50"
                />
                <button
                  onClick={() => void sendMessage()}
                  disabled={!input.trim() || loading}
                  className="size-7 rounded-lg bg-green-500 flex items-center justify-center text-white hover:bg-green-400 disabled:opacity-40 disabled:cursor-not-allowed transition shrink-0"
                  aria-label="Send message"
                >
                  <IconSend className="size-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toggle button */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="relative size-14 rounded-full bg-green-500 hover:bg-green-400 text-white shadow-lg shadow-green-500/30 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 animate-glow"
          aria-label={open ? "Close chat" : "Open chat"}
        >
          {!open && <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20" />}
          <span className={`absolute transition-all duration-200 ${open ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
            <IconX className="size-5" />
          </span>
          <span className={`absolute transition-all duration-200 ${open ? "opacity-0 scale-75" : "opacity-100 scale-100"}`}>
            <IconChat className="size-6" />
          </span>
        </button>
      </div>

      {/* ── Mobile toggle button (< sm) — only when chat is closed ── */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="sm:hidden fixed bottom-5 right-5 z-50 size-14 rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30 flex items-center justify-center transition-all duration-300 active:scale-95 animate-glow"
          aria-label="Open chat"
        >
          <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20" />
          <IconChat className="size-6" />
        </button>
      )}
    </>
  );
}
