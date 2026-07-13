/*
 * MESAJ ÇEVİRİSİ — staff panelindeki konuşmalarda tek tıkla çeviri.
 * Kompakt tasarım: balonun altında minik küre butonu; tıklanınca çeviri
 * aynı balonun içinde ince bir ayraçla gösterilir, tekrar tıklanınca
 * gizlenir. Hedef dil personelin panel diline göre otomatik seçilir
 * (panel TR ise TR'ye, EN ise EN'e çevirir).
 * Backend: POST /api/translate (DeepL / Google Cloud / anahtarsız gtx).
 */
"use client";

import { useState } from "react";
import { GlobeIcon } from "@/components/ui/icons";

export function TranslateMessage({ text, target }: { text: string; target: "tr" | "en" }) {
  const [translation, setTranslation] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (open) {
      setOpen(false);
      return;
    }
    setOpen(true);
    if (translation || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, target }),
      });
      const data = await res.json();
      setTranslation(data.translation ?? (target === "tr" ? "Çeviri alınamadı." : "Translation unavailable."));
    } catch {
      setTranslation(target === "tr" ? "Çeviri alınamadı." : "Translation unavailable.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={toggle}
        title={target === "tr" ? "Türkçeye çevir" : "Translate to English"}
        className={`mt-1 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold transition-colors ${
          open ? "bg-brand/10 text-brand" : "text-muted hover:text-brand"
        }`}
      >
        <GlobeIcon size={11} />
        {open ? (target === "tr" ? "Gizle" : "Hide") : target.toUpperCase()}
      </button>

      {open && (
        <div className="mt-1 border-t border-dashed border-gray-300 pt-1.5">
          <p className="text-sm italic text-ink/80">{loading ? "…" : translation}</p>
          <p className="mt-0.5 text-[9px] uppercase tracking-wide text-muted">
            {target === "tr" ? "Otomatik çeviri" : "Machine translation"}
          </p>
        </div>
      )}
    </>
  );
}
