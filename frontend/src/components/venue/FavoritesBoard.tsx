/*
 * FAVORİ PANOSU — arama motoru üstte + segmentler + favori bölgeler.
 *
 * Yapı (yukarıdan aşağı):
 *  1. Arama çubuğu — favoriler içinde ada / şehre / ICCA sınıfına göre
 *     anlık filtreleme (yazdıkça daralır).
 *  2. Segment pilleri — All favorites · Quote received (teklif aldıklarım)
 *     · şehir çipleri (favori bölgeler, sayaçlı).
 *  3. Favori bölgeler şeridi — şehir başına foto kartı; tıklayınca o
 *     şehir filtrelenir, "Search more" linki panel aramasına gider.
 *  4. Kompakt satır kartları — arama sonuçlarıyla aynı yoğunluk dili.
 *
 * Kalp ikonu favoriden çıkarır (mock: UI state). Teklif alınan mekanlar
 * yeşil "Quote received" rozeti taşır ve ilgili talebe link verir.
 */
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Venue } from "@/types";
import { HeartIcon, UsersIcon, GridIcon, ArrowRightIcon, SearchIcon, MapPinIcon } from "@/components/ui/icons";
import { InspectionScoreLight } from "./InspectionScore";
import { venueTypeLabel } from "@/lib/mice-criteria";

type Segment = "all" | "quoted";

export function FavoritesBoard({ venues, quotedIds }: { venues: Venue[]; quotedIds: string[] }) {
  const [q, setQ] = useState("");
  const [segment, setSegment] = useState<Segment>("all");
  const [city, setCity] = useState<string | null>(null);
  const [removed, setRemoved] = useState<string[]>([]);

  const favorites = venues.filter((v) => !removed.includes(v.id));
  const quoted = new Set(quotedIds);

  /* Favori bölgeler — şehir başına mekan sayısı + kapak fotoğrafı */
  const regions = useMemo(() => {
    const map = new Map<string, { count: number; imageUrl: string }>();
    for (const v of favorites) {
      const r = map.get(v.city);
      if (r) r.count += 1;
      else map.set(v.city, { count: 1, imageUrl: v.imageUrl });
    }
    return [...map.entries()].sort((a, b) => b[1].count - a[1].count);
  }, [favorites]);

  const filtered = favorites.filter((v) => {
    if (segment === "quoted" && !quoted.has(v.id)) return false;
    if (city && v.city !== city) return false;
    if (q) {
      const hay = `${v.name} ${v.city} ${v.district} ${venueTypeLabel(v.type)}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  const segPill = (active: boolean) =>
    `rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
      active ? "bg-brand text-white shadow-sm" : "border border-gray-200 bg-white text-muted hover:border-brand/40 hover:text-brand"
    }`;

  return (
    <div className="space-y-5">
      {/* ── 1. ARAMA MOTORU ── */}
      <div className="flex flex-wrap items-center gap-2 rounded-card border border-gray-200 bg-white p-2.5 shadow-card">
        <div className="relative min-w-[220px] flex-1">
          <SearchIcon size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search your favorites — name, city or category..."
            className="h-11 w-full rounded-lg border border-gray-200 bg-surface/50 pl-9 pr-3 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-brand focus:bg-white"
          />
        </div>
        <button type="button" onClick={() => setSegment("all")} className={segPill(segment === "all")}>
          All favorites · {favorites.length}
        </button>
        <button type="button" onClick={() => setSegment("quoted")} className={segPill(segment === "quoted")}>
          Quote received · {favorites.filter((v) => quoted.has(v.id)).length}
        </button>
      </div>

      {/* ── 2. FAVORİ BÖLGELER ── */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wide text-muted">Favorite regions</h2>
          <Link href="/app/search" className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline">
            Search more venues <ArrowRightIcon size={11} />
          </Link>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {regions.map(([name, r]) => {
            const active = city === name;
            return (
              <button
                key={name}
                type="button"
                onClick={() => setCity(active ? null : name)}
                aria-pressed={active}
                className={`group relative h-[74px] w-44 shrink-0 overflow-hidden rounded-card text-left transition-all hover:-translate-y-0.5 hover:shadow-card ${
                  active ? "ring-2 ring-brand ring-offset-2" : ""
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={r.imageUrl}
                  alt={name}
                  loading="lazy"
                  className="h-full w-full object-cover saturate-[1.15] transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-2.5 text-white">
                  <div>
                    <p className="inline-flex items-center gap-1 text-sm font-bold leading-none">
                      <MapPinIcon size={12} /> {name}
                    </p>
                    <p className="mt-0.5 text-[10px] text-white/80">
                      {r.count} favorite{r.count > 1 ? "s" : ""}
                    </p>
                  </div>
                  {active && (
                    <span className="rounded-full bg-brand px-1.5 py-0.5 text-[9px] font-bold uppercase">Filtered</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 3. SONUÇ SATIRLARI ── */}
      {filtered.length === 0 ? (
        <div className="rounded-card border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="font-semibold text-ink">No favorites match</p>
          <p className="mt-1 text-sm text-muted">
            {favorites.length === 0
              ? "Tap the heart icon on any venue to save it here."
              : "Try clearing the search or region filter."}
          </p>
          <Link href="/app/search" className="mt-4 inline-block text-sm font-semibold text-brand hover:underline">
            Browse venues
          </Link>
        </div>
      ) : (
        <div className="grid gap-2.5 xl:grid-cols-2">
          {filtered.map((v) => (
            <div
              key={v.id}
              className="group flex items-center gap-3 rounded-card border border-gray-200 bg-white p-2.5 transition-all hover:border-brand/40 hover:shadow-card"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={v.imageUrl} alt={v.name} loading="lazy" className="h-[84px] w-28 shrink-0 rounded-lg object-cover" />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/venues/${v.slug}`}
                    className="truncate text-sm font-bold text-ink transition-colors group-hover:text-brand"
                  >
                    {v.name}
                  </Link>
                  {quoted.has(v.id) && (
                    <span className="shrink-0 rounded bg-green-50 px-1.5 py-0.5 text-[9px] font-bold uppercase text-green-700">
                      Quote received
                    </span>
                  )}
                  {v.isSponsored && (
                    <span className="shrink-0 rounded bg-ink px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">Sponsored</span>
                  )}
                </div>
                <p className="mt-0.5 truncate text-xs text-muted">
                  {v.city}, {v.district} · {"★".repeat(v.stars)} · {v.rating}
                </p>
                {/* ICCA sınıfı — tüm sayfalarla aynı etiket sözlüğü */}
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand">{venueTypeLabel(v.type)}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted">
                  <span className="inline-flex items-center gap-1">
                    <UsersIcon size={11} /> {v.maxTheatreCapacity.toLocaleString("en-US")}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <GridIcon size={11} /> {v.meetingRoomCount} halls
                  </span>
                  <InspectionScoreLight score={v.inspectionScore} />
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <button
                  aria-label="Remove from favorites"
                  onClick={() => setRemoved((prev) => [...prev, v.id])}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-brand transition-colors hover:bg-brand-light"
                >
                  <HeartIcon size={16} filled />
                </button>
                {v.referencePrice !== null ? (
                  <p className="text-sm font-bold text-brand">
                    € {v.referencePrice}
                    <span className="ml-0.5 text-[10px] font-normal text-muted">/ night</span>
                  </p>
                ) : (
                  <p className="text-[10px] font-medium text-muted">On request</p>
                )}
                {quoted.has(v.id) ? (
                  <Link
                    href="/app/quotes"
                    className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-green-700 hover:underline"
                  >
                    View quotes <ArrowRightIcon size={11} />
                  </Link>
                ) : (
                  <Link
                    href={`/app/quotes/new?venue=${v.id}`}
                    className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-brand hover:underline"
                  >
                    Request quote <ArrowRightIcon size={11} />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
