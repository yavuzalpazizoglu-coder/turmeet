/*
 * VİTRİN ETİKET EDİTÖRÜ — Staff paneli, mekan envanteri.
 * Her mekan için "Öne çıkan / Müşteri dostu / Son dönemde tercih edilen..."
 * etiketleri tıklanarak açılıp kapatılır. Anasayfa vitrini ve mekan
 * kartları bu etiketleri gösterir.
 *
 * Mock aşama: seçim yalnızca ekranda tutulur.
 * Backend: PATCH /api/v1/admin/venues/{id}/tags  body: { tags: [...] }
 */
"use client";

import { useState } from "react";
import type { VenueShowcaseTag } from "@/types";
import { SHOWCASE_TAG_DEFS } from "@/lib/venue-tags";
import { usePanelLang } from "@/lib/panel-i18n-client";

export function ShowcaseTagEditor({ initial }: { initial: VenueShowcaseTag[] }) {
  const lang = usePanelLang();
  const [selected, setSelected] = useState<VenueShowcaseTag[]>(initial);

  function toggle(tag: VenueShowcaseTag) {
    setSelected((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  return (
    <div className="flex max-w-[260px] flex-wrap gap-1">
      {SHOWCASE_TAG_DEFS.map((def) => {
        const active = selected.includes(def.value);
        return (
          <button
            key={def.value}
            type="button"
            onClick={() => toggle(def.value)}
            aria-pressed={active}
            title={lang === "tr" ? def.labelEn : def.labelTr}
            className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide transition-colors ${
              active
                ? `border-transparent ${def.chipClass}`
                : "border-gray-200 bg-white text-muted hover:border-gray-300 hover:text-ink"
            }`}
          >
            {lang === "tr" ? def.labelTr : def.labelEn}
          </button>
        );
      })}
    </div>
  );
}
