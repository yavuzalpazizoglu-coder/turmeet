/*
 * WHATSAPP İLETİŞİM WIDGET'I — sağ altta sabit duran, çalışır durumda
 * destek sohbet kutusu.
 *
 * Özellikler:
 *  - SSS hızlı soruları + anahtar kelimeye göre otomatik cevap (faq.ts)
 *  - "Continue on WhatsApp" → wa.me linki (konuşma geçmişi ön-doldurulur)
 *  - "Open Messages" → müşteri paneli /app/messages (support thread'i)
 *  - Konuşma sessionStorage'da saklanır (sayfa geçişlerinde kaybolmaz)
 *
 * Backend entegrasyonu: canlıda otomatik cevaplar yerine WhatsApp
 * Business Cloud API veya platform destek botu bağlanabilir.
 */
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  FAQ_ITEMS,
  WELCOME_MESSAGE,
  autoReply,
  waLink,
} from "./faq";

interface ChatMessage {
  id: string;
  from: "bot" | "user";
  text: string;
  at: number;
}

const STORAGE_KEY = "turmeet_wa_chat";

function WhatsAppIcon({ size = 26 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="currentColor" aria-hidden>
      <path d="M16 3C9.4 3 4 8.3 4 14.9c0 2.6.8 5 2.3 7L4.6 28l6.3-1.6c1.9 1 4 1.6 6.1 1.6h.1c6.6 0 11.9-5.3 11.9-11.9C29 8.3 23.6 3 16 3zm0 22.7c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4 1 1.1-3.8-.3-.4c-1.1-1.7-1.7-3.7-1.7-5.8C5.3 9 10.1 4.3 16 4.3S26.7 9 26.7 14.9 21.9 25.7 16 25.7zm5.9-8.1c-.3-.2-1.9-1-2.2-1.1-.3-.1-.5-.2-.7.2-.2.3-.8 1.1-1 1.3-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.3-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.6.1-.2.1-.4 0-.6-.1-.2-.7-1.8-1-2.4-.3-.6-.5-.5-.7-.6h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.7s1.2 3.2 1.3 3.4c.2.2 2.3 3.5 5.5 4.9.8.3 1.4.5 1.9.7.8.2 1.5.2 2 .1.6-.1 1.9-.8 2.2-1.5.3-.8.3-1.4.2-1.5-.1-.2-.3-.3-.7-.3z" />
    </svg>
  );
}

let msgSeq = 0;
function makeMsg(from: "bot" | "user", text: string): ChatMessage {
  return { id: `wm${Date.now()}_${msgSeq++}`, from, text, at: Date.now() };
}

export default function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [seen, setSeen] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Konuşmayı sessionStorage'dan yükle / ilk açılışta karşılama mesajı
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ChatMessage[];
        if (parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      }
    } catch {
      /* bozuk veri — yoksay */
    }
    setMessages([makeMsg("bot", WELCOME_MESSAGE)]);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch {
        /* quota — yoksay */
      }
    }
  }, [messages]);

  // Yeni mesajda en alta kaydır
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing, open]);

  function botReply(text: string) {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, makeMsg("bot", text)]);
    }, 900);
  }

  function askFaq(id: string) {
    const item = FAQ_ITEMS.find((f) => f.id === id);
    if (!item) return;
    setMessages((m) => [...m, makeMsg("user", item.question)]);
    botReply(item.answer);
  }

  function send() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages((m) => [...m, makeMsg("user", text)]);
    botReply(autoReply(text));
  }

  // wa.me linkine son kullanıcı mesajını taşı
  const lastUserMsg = [...messages].reverse().find((m) => m.from === "user")?.text;

  return (
    <div className="fixed bottom-5 right-5 z-[70] flex flex-col items-end gap-3 print:hidden">
      {/* Sohbet paneli */}
      {open && (
        <div className="flex h-[min(560px,calc(100dvh-7rem))] w-[min(370px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10">
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
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded p-1 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          {/* Mesaj gövdesi — WhatsApp arka plan tonu */}
          <div ref={bodyRef} className="flex-1 space-y-2 overflow-y-auto bg-[#ECE5DD] p-3">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-[13px] leading-relaxed shadow-sm ${
                    m.from === "user" ? "rounded-br-none bg-[#DCF8C6] text-ink" : "rounded-bl-none bg-white text-ink"
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                  <p className="mt-0.5 text-right text-[10px] text-gray-400">
                    {new Date(m.at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="rounded-lg rounded-bl-none bg-white px-3 py-2 shadow-sm">
                  <span className="inline-flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
                  </span>
                </div>
              </div>
            )}

            {/* SSS hızlı soruları */}
            {!typing && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {FAQ_ITEMS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => askFaq(f.id)}
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
              href={waLink(lastUserMsg)}
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
              send();
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
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

      {/* Yüzen buton */}
      <button
        onClick={() => {
          setOpen((o) => !o);
          setSeen(true);
        }}
        aria-label={open ? "Close WhatsApp chat" : "Open WhatsApp chat"}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-transform hover:scale-105 active:scale-95"
      >
        {open ? (
          <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <WhatsAppIcon size={30} />
        )}
        {!open && !seen && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white ring-2 ring-white">
            1
          </span>
        )}
      </button>
    </div>
  );
}
