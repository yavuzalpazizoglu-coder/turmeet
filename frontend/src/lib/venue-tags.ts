/*
 * VİTRİN ETİKET SÖZLÜĞÜ — mekan kartlarında görünen kısa taglar.
 * Etiketler Staff (admin) panelindeki mekan envanterinden işaretlenir;
 * anasayfa "Featured hotels" vitrini ve mekan kartları bu sözlükten
 * etiket adı + rengini okur.
 *
 * Backend: hotels.showcase_tags kolonu (json array).
 * Güncelleme: PATCH /api/v1/admin/venues/{id}/tags
 */
import type { VenueShowcaseTag } from "@/types";

export interface ShowcaseTagDef {
  value: VenueShowcaseTag;
  labelEn: string;
  labelTr: string;
  /** Kart üstü chip renkleri (Tailwind sınıfları) */
  chipClass: string;
}

export const SHOWCASE_TAG_DEFS: ShowcaseTagDef[] = [
  {
    value: "featured",
    labelEn: "Featured",
    labelTr: "Öne çıkan",
    chipClass: "bg-brand text-white",
  },
  {
    value: "customer_favorite",
    labelEn: "Customer favorite",
    labelTr: "Müşteri dostu",
    chipClass: "bg-emerald-500 text-white",
  },
  {
    value: "trending",
    labelEn: "Trending",
    labelTr: "Son dönemde tercih edilen",
    chipClass: "bg-amber-500 text-white",
  },
  {
    value: "fast_response",
    labelEn: "Fast response",
    labelTr: "Hızlı yanıt",
    chipClass: "bg-sky-500 text-white",
  },
  {
    value: "best_value",
    labelEn: "Best value",
    labelTr: "Fiyat / performans",
    chipClass: "bg-teal-600 text-white",
  },
];

export function tagDef(value: VenueShowcaseTag): ShowcaseTagDef {
  return SHOWCASE_TAG_DEFS.find((t) => t.value === value) ?? SHOWCASE_TAG_DEFS[0];
}
