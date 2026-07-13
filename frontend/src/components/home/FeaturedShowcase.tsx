/*
 * ÖNE ÇIKAN MEKANLAR VİTRİNİ — anasayfa "Featured hotels" bölümü.
 * Sekmeler ICCA/IAPCO mekan sınıflandırmasını izler:
 *  - City & Conference Hotels  → ICCA kategori A: otel bünyesinde toplantı
 *    tesisi (Hilton Bomonti gibi "conference hotel"lar da buradadır —
 *    amaca yönelik kongre merkezi DEĞİLDİR).
 *  - Resort Congress Hotels    → kıyı/golf resortları; residential congress
 *    ve incentive formatının mekanı ("incentive" etkinlik tipidir, mekan
 *    tipi değildir — bu yüzden sekme adı mekan sınıfını söyler).
 *  - Congress & Exhibition Centers → ICCA kategori B: amaca yönelik inşa
 *    edilmiş kongre/fuar merkezleri (Lütfi Kırdar, Tüyap, Cam Piramit...).
 * Sıralama: sponsorlu önce, sonra MICE denetim puanı. Her sekmenin ilk
 * mekanı 2 sütunluk "spotlight" kartıdır (sponsor görünürlüğü — partner
 * teşviki). Vitrin etiketleri Staff panelinden atanır (showcaseTags).
 */
"use client";

import { useState } from "react";
import Link from "next/link";
import type { Venue } from "@/types";
import { tagDef } from "@/lib/venue-tags";
import { UsersIcon, GridIcon, ClockIcon, ArrowRightIcon } from "@/components/ui/icons";

type TabId = "city" | "resort" | "congress";

const TABS: { id: TabId; label: string; desc: string; match: (v: Venue) => boolean }[] = [
  {
    id: "city",
    label: "City & Conference Hotels",
    desc: "Urban hotels with in-house meeting facilities — ICCA venue category A",
    match: (v) => v.type === "city_hotel" || v.type === "airport_hotel",
  },
  {
    id: "resort",
    label: "Resort Congress Hotels",
    desc: "Coastal & golf resorts built for residential congresses and incentive programs",
    match: (v) => v.type === "resort" || v.type === "boutique" || v.type === "mountain_resort",
  },
  {
    id: "congress",
    label: "Congress & Exhibition Centers",
    desc: "Purpose-built congress and exhibition venues — ICCA venue category B",
    match: (v) => v.type === "congress_center",
  },
];

/** Mini yaprak ikonu — sürdürülebilirlik sertifikası rozeti */
function LeafIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

/**
 * Denetim puanı rozeti — 10'luk sisteme çevrilmiş şık skor: buzlu cam
 * pill içinde gradyan puan yuvarlağı + kalite etiketi (Booking tarzı).
 * 9.0+ Exceptional (yeşil) · 8.5+ Excellent (teal) · 8.0+ Very good
 * (mavi) · altı Good (amber). Kaynak: yerinde denetim (inspectionScore).
 */
function InspectionScore({ score }: { score: number }) {
  const rating = (score / 10).toFixed(1);
  const [grad, label] =
    score >= 90
      ? ["from-emerald-400 to-emerald-600", "Exceptional"]
      : score >= 85
        ? ["from-teal-400 to-teal-600", "Excellent"]
        : score >= 80
          ? ["from-sky-400 to-sky-600", "Very good"]
          : ["from-amber-400 to-amber-600", "Good"];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full bg-black/45 py-[3px] pl-[3px] pr-2.5 shadow-lg ring-1 ring-white/25 backdrop-blur-md"
      title="On-site inspection rating (0-10)"
    >
      <span className={`rounded-full bg-gradient-to-br px-1.5 py-0.5 text-[11px] font-black leading-none text-white shadow-sm ${grad}`}>
        {rating}
      </span>
      <span className="text-[10px] font-semibold leading-none text-white">{label}</span>
    </span>
  );
}

/** Kapasite / salon / yanıt hızı satırı — organizatörün ilk baktığı bilgiler */
function StatsRow({ v, light = false }: { v: Venue; light?: boolean }) {
  const base = light ? "text-white/85" : "text-muted";
  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium ${base}`}>
      <span className="inline-flex items-center gap-1">
        <UsersIcon size={12} /> {v.maxTheatreCapacity.toLocaleString("en-US")} pax
      </span>
      <span className="inline-flex items-center gap-1">
        <GridIcon size={12} /> {v.meetingRoomCount} halls
      </span>
      {v.responseTimeHours <= 6 ? (
        <span className={`inline-flex items-center gap-1 font-bold ${light ? "text-emerald-300" : "text-emerald-600"}`}>
          <ClockIcon size={12} /> Fast reply
        </span>
      ) : (
        <span className="inline-flex items-center gap-1">
          <ClockIcon size={12} /> ~{v.responseTimeHours}h reply
        </span>
      )}
    </div>
  );
}

/** Metro + sürdürülebilirlik mini rozetleri */
function MiniBadges({ v }: { v: Venue }) {
  if (!v.nearestMetro && !v.sustainabilityCertified) return null;
  return (
    <span className="inline-flex items-center gap-1">
      {v.nearestMetro && (
        <span
          className="flex h-4 w-4 items-center justify-center rounded-sm bg-sky-600 text-[9px] font-black text-white"
          title={`Nearest metro: ${v.nearestMetro}`}
        >
          M
        </span>
      )}
      {v.sustainabilityCertified && (
        <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-emerald-600 text-white" title="Sustainability certified">
          <LeafIcon size={10} />
        </span>
      )}
    </span>
  );
}

/** Fiyat (otel) veya kapasite (kongre merkezi) vurgusu */
function PriceOrCapacity({ v }: { v: Venue }) {
  if (v.type === "congress_center" || v.referencePrice === null) {
    return (
      <p className="text-[11px] font-bold text-ink">
        Up to {v.maxTheatreCapacity.toLocaleString("en-US")} <span className="font-normal text-muted">pax</span>
      </p>
    );
  }
  return (
    <p className="text-[11px] text-muted">
      from <span className="font-bold text-ink">€{v.referencePrice}</span> /night
    </p>
  );
}

export default function FeaturedShowcase({ venues }: { venues: Venue[] }) {
  const [tab, setTab] = useState<TabId>("city");

  const sorted = [...venues].sort(
    (a, b) => Number(b.isSponsored) - Number(a.isSponsored) || b.inspectionScore - a.inspectionScore,
  );

  const active = TABS.find((t) => t.id === tab)!;
  /* Spotlight (2x2 = 4 hücre) + 8 kompakt kart = 4 sütunlu grid'de 3 tam satır */
  const list = sorted.filter(active.match).slice(0, 9);
  const [spotlight, ...rest] = list;

  return (
    <div>
      {/* Sekmeler — mekan sayısı rozetli */}
      <div className="flex flex-wrap items-center gap-2">
        {TABS.map((t) => {
          const count = sorted.filter(t.match).length;
          const isActive = t.id === tab;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all ${
                isActive
                  ? "bg-brand text-white shadow-lg shadow-brand/25"
                  : "border border-gray-200 bg-white text-ink hover:border-brand/40 hover:text-brand"
              }`}
            >
              {t.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  isActive ? "bg-white/20 text-white" : "bg-gray-100 text-muted"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Aktif sekmenin ICCA kategori açıklaması — sınıflandırma şeffaflığı */}
      <p className="mt-2 text-xs text-muted">{active.desc}</p>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {/* ── SPOTLIGHT — sekmenin 1. mekanı, 2 sütun geniş kart ── */}
        {spotlight && (
          <Link
            href={`/venues/${spotlight.slug}`}
            className="group relative overflow-hidden rounded-card shadow-card transition-shadow hover:shadow-xl sm:col-span-2 sm:row-span-2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={spotlight.imageUrl}
              alt={spotlight.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

            {/* Hover ışıltı süpürmesi */}
            <div className="pointer-events-none absolute inset-0 z-10 -translate-x-[130%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[130%]" />

            <div className="absolute left-3 top-3 flex items-center gap-2">
              {spotlight.showcaseTags[0] && (
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide shadow-md ${tagDef(spotlight.showcaseTags[0]).chipClass}`}>
                  {tagDef(spotlight.showcaseTags[0]).labelEn}
                </span>
              )}
              <InspectionScore score={spotlight.inspectionScore} />
            </div>
            {spotlight.isSponsored && (
              <span className="absolute right-3 top-3 rounded-sm bg-black/40 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white/80 backdrop-blur-sm">
                Sponsored
              </span>
            )}

            <div className="absolute inset-x-0 bottom-0 flex min-h-[280px] flex-col justify-end p-5">
              <p className="text-xl font-bold text-white">{spotlight.name}</p>
              <p className="mt-0.5 text-xs text-white/80">
                {spotlight.city} · {spotlight.district} · <span className="text-amber-400">{"★".repeat(spotlight.stars)}</span>
              </p>
              <p className="mt-2 line-clamp-2 max-w-lg text-xs leading-relaxed text-white/75">{spotlight.description}</p>
              <div className="mt-3">
                <StatsRow v={spotlight} light />
              </div>
              <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-bold text-white transition-transform group-hover:scale-105">
                Request quote <ArrowRightIcon size={13} />
              </span>
            </div>
          </Link>
        )}

        {/* ── KOMPAKT KARTLAR — zengin görünüm: ışıltı süpürmesi + marka çerçevesi ── */}
        {rest.map((v) => {
          const tag = v.showcaseTags[0];
          const d = tag ? tagDef(tag) : null;
          return (
            <Link
              key={v.id}
              href={`/venues/${v.slug}`}
              className="group overflow-hidden rounded-card border border-gray-100 bg-white shadow-card ring-brand/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/10 hover:ring-2"
            >
              <div className="relative h-24 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={v.imageUrl}
                  alt={v.name}
                  loading="lazy"
                  className="h-full w-full object-cover saturate-[1.1] transition-transform duration-500 group-hover:scale-110"
                />
                {/* Alt gradyan — rozetlerin okunurluğu + derinlik */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
                {/* Hover ışıltı süpürmesi */}
                <div className="pointer-events-none absolute inset-0 -translate-x-[130%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[130%]" />
                {d && (
                  <span className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide shadow-md ${d.chipClass}`}>
                    {d.labelEn}
                  </span>
                )}
                <span className="absolute bottom-2 right-2">
                  <InspectionScore score={v.inspectionScore} />
                </span>
              </div>
              <div className="p-2.5">
                <p className="truncate text-sm font-bold text-ink transition-colors group-hover:text-brand">{v.name}</p>
                <p className="mt-0.5 text-[11px] text-muted">
                  {v.city} · {v.district} · <span className="text-amber-500">{"★".repeat(v.stars)}</span>
                </p>
                <div className="mt-1.5">
                  <StatsRow v={v} />
                </div>
                <div className="mt-1.5 flex items-center justify-between border-t border-gray-100 pt-1.5">
                  <PriceOrCapacity v={v} />
                  <span className="flex items-center gap-1.5">
                    <MiniBadges v={v} />
                    <ArrowRightIcon
                      size={13}
                      className="-translate-x-1 text-brand opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                    />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
