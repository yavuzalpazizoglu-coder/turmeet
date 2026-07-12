/*
 * PARTNER MESAJLARI — müşteri mesaj ekranının otel perspektifi.
 */
"use client";

import { useEffect, useState } from "react";
import { PageHeader, Card, Button, Input } from "@/components/ui";
import { getThreads } from "@/services";
import type { MessageThread } from "@/types";
import { usePanelLang } from "@/lib/panel-i18n-client";
import { makeT } from "@/lib/panel-i18n";

export default function PartnerMessagesPage() {
  const lang = usePanelLang();
  const t = makeT(lang);
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    getThreads().then((t) => {
      setThreads(t);
      setActiveId(t[0]?.id ?? null);
    });
  }, []);

  const active = threads.find((t) => t.id === activeId);

  return (
    <>
      <PageHeader
        title={t("Messages", "Mesajlar")}
        description={t("Conversations with organizers via the platform.", "Platform üzerinden organizatörlerle yazışmalar.")}
      />

      <Card className="grid min-h-[560px] overflow-hidden lg:grid-cols-[320px_1fr]">
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
                <p className="truncate text-sm font-semibold text-ink">Nordwind Capital GmbH</p>
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

        <div className="flex flex-col">
          {active ? (
            <>
              <div className="border-b border-gray-200 p-4">
                <p className="font-semibold text-ink">Nordwind Capital GmbH — Annual Sales Kick-off 2027</p>
              </div>
              <div className="flex-1 space-y-4 overflow-y-auto p-4">
                {active.messages.map((m) => {
                  const own = m.senderRole === "venue";
                  return (
                    <div key={m.id} className={`flex ${own ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] rounded-card p-3 text-sm ${own ? "bg-brand text-white" : "bg-surface text-ink"}`}>
                        <p>{m.body}</p>
                        <p className={`mt-1 text-[10px] ${own ? "text-white/70" : "text-muted"}`}>
                          {new Date(m.sentAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <form className="flex gap-2 border-t border-gray-200 p-4" onSubmit={(e) => e.preventDefault()}>
                <Input placeholder={t("Type your message...", "Mesajınızı yazın...")} className="flex-1" />
                <Button type="submit">{t("Send", "Gönder")}</Button>
              </form>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-muted">
              {t("Select a conversation", "Bir konuşma seçin")}
            </div>
          )}
        </div>
      </Card>
    </>
  );
}
