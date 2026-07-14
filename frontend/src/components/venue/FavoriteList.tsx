/*
 * FAVORİ LİSTESİ — kompakt yatay satır kartları, 2 sütun.
 * Tasarım kararı: /app/search sonuç satırlarıyla aynı yoğunlukta —
 * ekranda 8-10 mekan aynı anda görünür; büyük dikey kartlar yerine
 * küçük foto + ad + ICCA sınıfı + denetim puanı + fiyat + aksiyonlar.
 * Kalbe tıklayınca mekan listeden düşer (mock: sadece UI state).
 */
"use client";

import { useState } from "react";
import Link from "next/link";
import type { Venue } from "@/types";
import { HeartIcon, UsersIcon, GridIcon, ArrowRightIcon } from "@/components/ui/icons";
import { InspectionScoreLight } from "./InspectionScore";
import { venueTypeLabel } from "@/lib/mice-criteria";

export function FavoriteList({ venues }: { venues: Venue[] }) {
  const [removed, setRemoved] = useState<string[]>([]);
  const visible = venues.filter((v) => !removed.includes(v.id));

  if (visible.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-gray-300 bg-white p-10 text-center">
        <p className="font-semibold text-ink">No favorites left</p>
        <p className="mt-1 text-sm text-muted">Tap the heart icon on any venue to save it here.</p>
        <Link href="/app/search" className="mt-4 inline-block text-sm font-semibold text-brand hover:underline">
          Browse venues
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-2.5 xl:grid-cols-2">
      {visible.map((v) => (
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
            <Link
              href={`/app/quotes/new?venue=${v.id}`}
              className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-brand hover:underline"
            >
              Request quote <ArrowRightIcon size={11} />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
