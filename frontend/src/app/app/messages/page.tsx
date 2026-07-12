/*
 * MESAJLAR — master doküman 4.7: thread listesi + konuşma görünümü.
 * Backend: GET /api/v1/messages/threads, POST /api/v1/messages
 */
"use client";

import { useEffect, useState } from "react";
import { PageHeader, Card, Button, Input, Badge } from "@/components/ui";
import { FileTextIcon } from "@/components/ui/icons";
import { getThreads } from "@/services";
import type { MessageThread } from "@/types";

export default function MessagesPage() {
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    // WhatsApp widget'ı ?thread=th-support ile yönlendirir — varsa onu aç
    const requested = new URLSearchParams(window.location.search).get("thread");
    getThreads().then((t) => {
      setThreads(t);
      const match = requested && t.find((th) => th.id === requested);
      setActiveId(match ? match.id : (t[0]?.id ?? null));
    });
  }, []);

  const active = threads.find((t) => t.id === activeId);

  return (
    <>
      <PageHeader title="Messages" description="All conversations with venues and your Turmeet coordinator." />

      <Card className="grid min-h-[560px] overflow-hidden lg:grid-cols-[320px_1fr]">
        {/* Thread listesi */}
        <div className="border-b border-gray-200 lg:border-b-0 lg:border-r">
          {threads.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveId(t.id)}
              className={`flex w-full items-start justify-between gap-2 border-b border-gray-100 p-4 text-left transition-colors ${
                t.id === activeId ? "bg-brand-light" : "hover:bg-surface"
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-ink">{t.title}</p>
                  {t.type === "coordinator" && <Badge tone="accent">Coordinator</Badge>}
                  {t.type === "support" && <Badge tone="success">WhatsApp</Badge>}
                </div>
                <p className="mt-0.5 truncate text-xs text-muted">{t.lastMessage}</p>
              </div>
              {t.unreadCount > 0 && (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white">
                  {t.unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Konuşma */}
        <div className="flex flex-col">
          {active ? (
            <>
              <div className="border-b border-gray-200 p-4">
                <p className="font-semibold text-ink">{active.title}</p>
              </div>
              <div className="flex-1 space-y-4 overflow-y-auto p-4">
                {active.messages.map((m) => {
                  const own = m.senderRole === "customer";
                  return (
                    <div key={m.id} className={`flex ${own ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] rounded-card p-3 text-sm ${own ? "bg-brand text-white" : "bg-surface text-ink"}`}>
                        {!own && <p className="mb-1 text-xs font-semibold text-brand">{m.senderName}</p>}
                        <p>{m.body}</p>
                        {m.attachments.map((a) => (
                          <p key={a.name} className={`mt-2 inline-flex items-center gap-1 rounded px-2 py-1 text-xs ${own ? "bg-white/20" : "bg-white"}`}>
                            <FileTextIcon size={13} /> {a.name} ({Math.round(a.sizeKb / 100) / 10} MB)
                          </p>
                        ))}
                        <p className={`mt-1 text-[10px] ${own ? "text-white/70" : "text-muted"}`}>
                          {new Date(m.sentAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <form
                className="flex gap-2 border-t border-gray-200 p-4"
                onSubmit={(e) => e.preventDefault()}
              >
                <Input placeholder="Type your message..." className="flex-1" />
                <Button type="submit">Send</Button>
              </form>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-muted">Select a conversation</div>
          )}
        </div>
      </Card>
    </>
  );
}
