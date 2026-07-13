/*
 * STAFF MESAJLARI — D Event personelinin müşteri/otel konuşmalarını
 * yönettiği ekran. Her gelen mesajın altında kompakt çeviri butonu
 * bulunur (bkz. TranslateMessage): panel diline tek tıkla çeviri.
 * Backend: GET /api/v1/admin/messages/threads, POST /api/v1/messages
 */
"use client";

import { useEffect, useState } from "react";
import { PageHeader, Card, Button, Input, Badge } from "@/components/ui";
import { FileTextIcon } from "@/components/ui/icons";
import { getThreads } from "@/services";
import { usePanelLang } from "@/lib/panel-i18n-client";
import { TranslateMessage } from "@/components/panel/TranslateMessage";
import type { MessageThread } from "@/types";

export default function AdminMessagesPage() {
  const lang = usePanelLang();
  const t = (en: string, tr: string) => (lang === "tr" ? tr : en);

  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    getThreads().then((list) => {
      setThreads(list);
      setActiveId(list[0]?.id ?? null);
    });
  }, []);

  const active = threads.find((th) => th.id === activeId);

  return (
    <>
      <PageHeader
        title={t("Messages", "Mesajlar")}
        description={t(
          "All customer and venue conversations — one-click translation on every message.",
          "Tüm müşteri ve mekan konuşmaları — her mesajda tek tıkla çeviri.",
        )}
      />

      <Card className="grid min-h-[560px] overflow-hidden lg:grid-cols-[320px_1fr]">
        {/* Konuşma listesi */}
        <div className="border-b border-gray-200 lg:border-b-0 lg:border-r">
          {threads.map((th) => (
            <button
              key={th.id}
              onClick={() => setActiveId(th.id)}
              className={`flex w-full items-start justify-between gap-2 border-b border-gray-100 p-4 text-left transition-colors ${
                th.id === activeId ? "bg-brand-light" : "hover:bg-surface"
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-ink">{th.title}</p>
                  {th.type === "coordinator" && <Badge tone="accent">{t("Coordinator", "Koordinatör")}</Badge>}
                  {th.type === "support" && <Badge tone="success">WhatsApp</Badge>}
                </div>
                <p className="mt-0.5 truncate text-xs text-muted">{th.lastMessage}</p>
              </div>
              {th.unreadCount > 0 && (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white">
                  {th.unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Konuşma */}
        <div className="flex flex-col">
          {active ? (
            <>
              <div className="flex items-center justify-between border-b border-gray-200 p-4">
                <p className="font-semibold text-ink">{active.title}</p>
                <p className="text-[11px] text-muted">
                  {t("Translation: powered by Google / DeepL", "Çeviri: Google / DeepL altyapısı")}
                </p>
              </div>
              <div className="flex-1 space-y-4 overflow-y-auto p-4">
                {active.messages.map((m) => {
                  const own = m.senderRole === "admin" || m.senderRole === "coordinator";
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
                        {/* Çeviri — yalnızca gelen mesajlarda, panel diline */}
                        {!own && <TranslateMessage text={m.body} target={lang} />}
                        <p className={`mt-1 text-[10px] ${own ? "text-white/70" : "text-muted"}`}>
                          {new Date(m.sentAt).toLocaleString(lang === "tr" ? "tr-TR" : "en-GB", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
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
