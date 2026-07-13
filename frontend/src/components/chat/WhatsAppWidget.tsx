/*
 * DESTEK YUVASI — sağ altta yan yana iki sabit buton (MD 9.5 Chatbox):
 *
 *  1. AI ASİSTAN (marka pembesi, yıldız ikonu) — anlık mesajlaşma + SSS.
 *     Cevaplar /api/ai-chat endpoint'inden gelir: Gemini veya Claude
 *     (env: AI_PROVIDER + API anahtarı). Anahtar yoksa FAQ anahtar-kelime
 *     motoruna düşer — demo ortamında da çalışır.
 *
 *  2. WHATSAPP (yeşil) — SSS hızlı soruları + otomatik cevap, wa.me linki
 *     ve müşteri paneli Messages yönlendirmesi.
 *
 * Konuşmalar sessionStorage'da ayrı anahtarlarla saklanır.
 */
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FAQ_ITEMS, WELCOME_MESSAGE, autoReply, waLink } from "./faq";

interface ChatMessage {
  id: string;
  from: "bot" | "user";
  text: string;
  at: number;
}

const WA_STORAGE_KEY = "turmeet_wa_chat";
const AI_STORAGE_KEY = "turmeet_ai_chat";

/** Vitrinde gösterilen sağlayıcı adı — canlıda env'e göre backend seçer */
const AI_PROVIDER_LABEL = "Gemini · Claude ready";

const AI_WELCOME =
  "Hi! I'm the Turmeet AI Assistant. Ask me anything about planning meetings and events in Turkey — venues, quotes, coordinators, contracts. Pick a quick question below or type your own.";

function WhatsAppIcon({ size = 26 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="currentColor" aria-hidden>
      <path d="M16 3C9.4 3 4 8.3 4 14.9c0 2.6.8 5 2.3 7L4.6 28l6.3-1.6c1.9 1 4 1.6 6.1 1.6h.1c6.6 0 11.9-5.3 11.9-11.9C29 8.3 23.6 3 16 3zm0 22.7c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4 1 1.1-3.8-.3-.4c-1.1-1.7-1.7-3.7-1.7-5.8C5.3 9 10.1 4.3 16 4.3S26.7 9 26.7 14.9 21.9 25.7 16 25.7zm5.9-8.1c-.3-.2-1.9-1-2.2-1.1-.3-.1-.5-.2-.7.2-.2.3-.8 1.1-1 1.3-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.3-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.6.1-.2.1-.4 0-.6-.1-.2-.7-1.8-1-2.4-.3-.6-.5-.5-.7-.6h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.7s1.2 3.2 1.3 3.4c.2.2 2.3 3.5 5.5 4.9.8.3 1.4.5 1.9.7.8.2 1.5.2 2 .1.6-.1 1.9-.8 2.2-1.5.3-.8.3-1.4.2-1.5-.1-.2-.3-.3-.7-.3z" />
    </svg>
  );
}

function SparklesIcon({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
      <path d="M12 2l1.9 5.7L19.5 9.5l-5.6 1.8L12 17l-1.9-5.7L4.5 9.5l5.6-1.8L12 2z" />
      <path d="M19 14l.9 2.6 2.6.9-2.6.9L19 21l-.9-2.6-2.6-.9 2.6-.9L19 14z" opacity="0.8" />
      <path d="M5 15l.7 2 2 .7-2 .7L5 20.5l-.7-2.1-2-.7 2-.7L5 15z" opacity="0.6" />
    </svg>
  );
}

/** Konuşma balonu — buton bir mesaj kutusu gibi algılansın diye */
function ChatBubbleIcon({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
      <path d="M12 3C6.5 3 2 6.9 2 11.7c0 2.1.9 4 2.3 5.5-.2 1.2-.8 2.6-1.9 3.6-.2.2 0 .5.2.5 1.9-.1 3.6-.8 4.8-1.6 1.4.5 2.9.8 4.6.8 5.5 0 10-3.9 10-8.8S17.5 3 12 3z" />
      <circle cx="8" cy="11.7" r="1.2" fill="#fff" />
      <circle cx="12" cy="11.7" r="1.2" fill="#fff" />
      <circle cx="16" cy="11.7" r="1.2" fill="#fff" />
    </svg>
  );
}

function CloseIcon({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

let msgSeq = 0;
function makeMsg(from: "bot" | "user", text: string): ChatMessage {
  return { id: `wm${Date.now()}_${msgSeq++}`, from, text, at: Date.now() };
}

function loadChat(key: string, welcome: string): ChatMessage[] {
  try {
    const raw = sessionStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw) as ChatMessage[];
      if (parsed.length > 0) return parsed;
    }
  } catch {
    /* bozuk veri — yoksay */
  }
  return [makeMsg("bot", welcome)];
}

function saveChat(key: string, messages: ChatMessage[]) {
  if (messages.length === 0) return;
  try {
    sessionStorage.setItem(key, JSON.stringify(messages));
  } catch {
    /* quota — yoksay */
  }
}

/* ── Ortak mesaj balonu ── */
function Bubble({ m, userClass }: { m: ChatMessage; userClass: string }) {
  return (
    <div className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-lg px-3 py-2 text-[13px] leading-relaxed shadow-sm ${
          m.from === "user" ? `rounded-br-none ${userClass}` : "rounded-bl-none bg-white text-ink"
        }`}
      >
        <p className="whitespace-pre-line">{m.text}</p>
        <p className="mt-0.5 text-right text-[10px] text-gray-400">
          {new Date(m.at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex justify-start">
      <div className="rounded-lg rounded-bl-none bg-white px-3 py-2 shadow-sm">
        <span className="inline-flex gap-1">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
        </span>
      </div>
    </div>
  );
}

export default function WhatsAppWidget() {
  // Hangi panel açık: null | "ai" | "wa" (aynı anda tek panel)
  const [panel, setPanel] = useState<null | "ai" | "wa">(null);
  const [seen, setSeen] = useState(false);

  // ── WhatsApp sohbeti ──
  const [waMessages, setWaMessages] = useState<ChatMessage[]>([]);
  const [waInput, setWaInput] = useState("");
  const [waTyping, setWaTyping] = useState(false);

  // ── AI sohbeti ──
  const [aiMessages, setAiMessages] = useState<ChatMessage[]>([]);
  const [aiInput, setAiInput] = useState("");
  const [aiTyping, setAiTyping] = useState(false);

  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setWaMessages(loadChat(WA_STORAGE_KEY, WELCOME_MESSAGE));
    setAiMessages(loadChat(AI_STORAGE_KEY, AI_WELCOME));
  }, []);

  useEffect(() => saveChat(WA_STORAGE_KEY, waMessages), [waMessages]);
  useEffect(() => saveChat(AI_STORAGE_KEY, aiMessages), [aiMessages]);

  // Yeni mesajda en alta kaydır
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [waMessages, aiMessages, waTyping, aiTyping, panel]);

  /* ── WhatsApp: yerel otomatik cevap ── */
  function waBotReply(text: string) {
    setWaTyping(true);
    setTimeout(() => {
      setWaTyping(false);
      setWaMessages((m) => [...m, makeMsg("bot", text)]);
    }, 900);
  }

  function waAskFaq(id: string) {
    const item = FAQ_ITEMS.find((f) => f.id === id);
    if (!item) return;
    setWaMessages((m) => [...m, makeMsg("user", item.question)]);
    waBotReply(item.answer);
  }

  function waSend() {
    const text = waInput.trim();
    if (!text) return;
    setWaInput("");
    setWaMessages((m) => [...m, makeMsg("user", text)]);
    waBotReply(autoReply(text));
  }

  /* ── AI: /api/ai-chat üzerinden Gemini/Claude (yoksa FAQ fallback) ── */
  async function aiAsk(question: string) {
    const history = [...aiMessages, makeMsg("user", question)];
    setAiMessages(history);
    setAiTyping(true);
    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map((m) => ({
            role: m.from === "user" ? "user" : "assistant",
            content: m.text,
          })),
        }),
      });
      const data = await res.json();
      setAiMessages((m) => [...m, makeMsg("bot", data.reply ?? "Sorry, something went wrong — please try again.")]);
    } catch {
      setAiMessages((m) => [...m, makeMsg("bot", autoReply(question))]);
    } finally {
      setAiTyping(false);
    }
  }

  function aiSend() {
    const text = aiInput.trim();
    if (!text || aiTyping) return;
    setAiInput("");
    aiAsk(text);
  }

  const lastWaUserMsg = [...waMessages].reverse().find((m) => m.from === "user")?.text;

  const panelCls =
    "flex h-[min(560px,calc(100dvh-7rem))] w-[min(370px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10";

  return (
    <div className="fixed bottom-5 right-5 z-[70] flex flex-col items-end gap-3 print:hidden">
      {/* ══ AI ASİSTAN PANELİ ══ */}
      {panel === "ai" && (
        <div className={panelCls}>
          {/* Başlık — marka pembesi + sağlayıcı rozeti */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-brand to-brand-dark p-4 text-white">
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
              <SparklesIcon size={20} />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-brand bg-green-400" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold leading-tight">Turmeet Chat</p>
              <p className="text-[11px] text-white/75">AI-powered instant answers · {AI_PROVIDER_LABEL}</p>
            </div>
            <button
              onClick={() => setPanel(null)}
              aria-label="Close AI chat"
              className="rounded p-1 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Mesaj gövdesi */}
          <div ref={bodyRef} className="flex-1 space-y-2 overflow-y-auto bg-brand-light/60 p-3">
            {aiMessages.map((m) => (
              <Bubble key={m.id} m={m} userClass="bg-brand text-white [&_p:last-child]:text-white/60" />
            ))}
            {aiTyping && <TypingDots />}

            {/* SSS hızlı soruları */}
            {!aiTyping && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {FAQ_ITEMS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => aiAsk(f.question)}
                    className="rounded-full border border-brand/30 bg-white px-3 py-1.5 text-xs font-medium text-brand shadow-sm transition-colors hover:bg-brand hover:text-white"
                  >
                    {f.question}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* AI bilgi notu + Mesajlar paneli */}
          <div className="flex items-center gap-2 border-t border-gray-200 bg-white px-3 pt-2">
            <p className="flex-1 text-[10px] leading-snug text-muted">
              AI answers may contain mistakes — for binding info use your coordinator.
            </p>
            <Link
              href="/app/messages?thread=th-support"
              className="shrink-0 rounded-lg border border-brand px-2.5 py-1.5 text-xs font-bold text-brand transition-colors hover:bg-brand hover:text-white"
            >
              Open Messages
            </Link>
          </div>

          {/* Girdi */}
          <form
            className="flex gap-2 bg-white p-3"
            onSubmit={(e) => {
              e.preventDefault();
              aiSend();
            }}
          >
            <input
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder="Ask the AI assistant..."
              className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm outline-none transition-colors focus:border-brand"
            />
            <button
              type="submit"
              aria-label="Send"
              disabled={aiTyping}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
            >
              <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden>
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* ══ WHATSAPP PANELİ ══ */}
      {panel === "wa" && (
        <div className={panelCls}>
          {/* Başlık */}
          <div className="flex items-center gap-3 bg-[#075E54] p-4 text-white">
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
              <WhatsAppIcon size={22} />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#075E54] bg-green-400" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold leading-tight">Turmeet Support</p>
              <p className="text-xs text-white/80">Online · Typically replies in minutes</p>
            </div>
            <button
              onClick={() => setPanel(null)}
              aria-label="Close chat"
              className="rounded p-1 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Mesaj gövdesi — WhatsApp arka plan tonu */}
          <div ref={bodyRef} className="flex-1 space-y-2 overflow-y-auto bg-[#ECE5DD] p-3">
            {waMessages.map((m) => (
              <Bubble key={m.id} m={m} userClass="bg-[#DCF8C6] text-ink" />
            ))}
            {waTyping && <TypingDots />}

            {/* SSS hızlı soruları */}
            {!waTyping && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {FAQ_ITEMS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => waAskFaq(f.id)}
                    className="rounded-full border border-[#25D366]/40 bg-white px-3 py-1.5 text-xs font-medium text-[#075E54] shadow-sm transition-colors hover:bg-[#25D366] hover:text-white"
                  >
                    {f.question}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Eylemler: WhatsApp'a devam + Mesajlar paneli */}
          <div className="flex gap-2 border-t border-gray-200 bg-white px-3 pt-2">
            <a
              href={waLink(lastWaUserMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#25D366] px-2 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#1DA851]"
            >
              <WhatsAppIcon size={14} /> Continue on WhatsApp
            </a>
            <Link
              href="/app/messages?thread=th-support"
              className="flex flex-1 items-center justify-center rounded-lg border border-brand px-2 py-1.5 text-xs font-bold text-brand transition-colors hover:bg-brand hover:text-white"
            >
              Open Messages
            </Link>
          </div>

          {/* Girdi */}
          <form
            className="flex gap-2 bg-white p-3"
            onSubmit={(e) => {
              e.preventDefault();
              waSend();
            }}
          >
            <input
              value={waInput}
              onChange={(e) => setWaInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm outline-none transition-colors focus:border-[#25D366]"
            />
            <button
              type="submit"
              aria-label="Send"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white transition-colors hover:bg-[#1DA851]"
            >
              <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden>
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* ══ YÜZEN BUTONLAR — AI solda, WhatsApp sağda ══ */}
      <div className="flex items-center gap-3">
        {/* Mesaj kutusu butonu — konuşma balonu, AI vurgusu panelin içinde kalır */}
        <button
          onClick={() => {
            setPanel((p) => (p === "ai" ? null : "ai"));
            setSeen(true);
          }}
          aria-label={panel === "ai" ? "Close chat" : "Open chat"}
          className="group relative flex h-14 items-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-dark px-4 text-white shadow-xl transition-transform hover:scale-105 active:scale-95"
        >
          {panel === "ai" ? <CloseIcon size={20} /> : <ChatBubbleIcon size={24} />}
          <span className="text-sm font-bold">Chat</span>
        </button>

        {/* WhatsApp butonu */}
        <button
          onClick={() => {
            setPanel((p) => (p === "wa" ? null : "wa"));
            setSeen(true);
          }}
          aria-label={panel === "wa" ? "Close WhatsApp chat" : "Open WhatsApp chat"}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-transform hover:scale-105 active:scale-95"
        >
          {panel === "wa" ? <CloseIcon size={22} /> : <WhatsAppIcon size={30} />}
          {panel === null && !seen && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white ring-2 ring-white">
              1
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
