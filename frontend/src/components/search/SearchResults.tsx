/*
 * ARAMA SONUÇLARI — 2 BLOK: solda otel kolonu, sağda kaliteli harita.
 *
 * Etkileşim: otel kutusuna tıklanınca harita o otele uçar (flyTo) ve
 * önizleme baloncuğu açılır; satır pembe çerçeveyle vurgulanır.
 * Haritadaki pine tıklamak da aynı oteli listede vurgular.
 *
 * Harita altyapısı: Leaflet + CARTO Voyager (public SERP haritası ile aynı
 * dil). Tek şehir aramasında merkez / metro / yoğun bölge katmanları da
 * çizilir (lib/city-map-data.ts).
 */
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import "leaflet/dist/leaflet.css";
import type { Venue } from "@/types";
import { CITY_MAP_LAYERS } from "@/lib/city-map-data";
import { UsersIcon, GridIcon, ArrowRightIcon } from "@/components/ui/icons";
import { scoreParts } from "@/components/venue/InspectionScore";

export function SearchResults({ venues }: { venues: Venue[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markersRef = useRef<Record<string, import("leaflet").Marker>>({});
  const [selected, setSelected] = useState<string | null>(null);

  // Harita kurulumu — sonuç listesi değişince yeniden çizilir
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current || mapRef.current || venues.length === 0) return;

      const map = L.map(containerRef.current, {
        scrollWheelZoom: true,
        attributionControl: true,
      });
      mapRef.current = map;

      /*
       * Modern minimal altlık — CARTO Positron: çok açık, sade zemin.
       * Beyaz fiyat rozetleri ve pembe vurgular bu zeminde net okunur
       * (Airbnb / Google Maps görsel dili).
       */
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
      }).addTo(map);

      markersRef.current = {};
      /* Fiyatsız mekanlar için bina glifi — beyaz yuvarlak rozet içinde */
      const buildingGlyph =
        '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9.5 7h.01M9.5 11h.01M9.5 15h.01M14.5 7h.01M14.5 11h.01M14.5 15h.01"/></svg>';
      const markers = venues.map((v) => {
        const html =
          v.referencePrice !== null
            ? `<div class="tm-pin">€${v.referencePrice}</div>`
            : `<div class="tm-pin tm-pin--icon">${buildingGlyph}</div>`;
        const icon = L.divIcon({ className: "", html, iconSize: [0, 0] });

        const marker = L.marker([v.lat, v.lng], { icon }).addTo(map);
        marker.bindPopup(
          `<a href="/venues/${v.slug}" class="tm-pop">
             <img src="${v.imageUrl}" alt="" />
             <div class="tm-pop-body">
               <p class="tm-pop-name">${v.name}</p>
               <p class="tm-pop-meta">★ ${v.rating.toFixed(1)} · ${v.maxTheatreCapacity.toLocaleString("en-US")} guests · ${v.meetingRoomCount} halls</p>
               ${v.referencePrice !== null ? `<p class="tm-pop-price">€ ${v.referencePrice} <span>/ night ref.</span></p>` : ""}
             </div>
           </a>`,
          { closeButton: false, minWidth: 220, maxWidth: 220 },
        );
        marker.on("click", () => setSelected(v.id));
        markersRef.current[v.id] = marker;
        return marker;
      });

      // Tek şehir aramasında şehir katmanları (merkez / metro / yoğun bölge)
      const cities = new Set(venues.map((v) => v.city));
      if (cities.size === 1) {
        const layers = CITY_MAP_LAYERS[[...cities][0]];
        if (layers) {
          for (const h of layers.hotspots) {
            L.circle([h.lat, h.lng], {
              radius: h.radiusM,
              color: "#ef6c00",
              weight: 1,
              opacity: 0.5,
              fillColor: "#ef6c00",
              fillOpacity: 0.12,
            })
              .addTo(map)
              .bindTooltip(h.name, { direction: "top" });
          }
          for (const c of layers.centers) {
            L.marker([c.lat, c.lng], {
              icon: L.divIcon({ className: "", html: `<div class="tm-center">★</div>`, iconSize: [0, 0] }),
            })
              .addTo(map)
              .bindTooltip(c.name, { direction: "top" });
          }
          for (const m of layers.metro) {
            L.marker([m.lat, m.lng], {
              icon: L.divIcon({ className: "", html: `<div class="tm-metro">M</div>`, iconSize: [0, 0] }),
            })
              .addTo(map)
              .bindTooltip(m.name, { direction: "top" });
          }
        }
      }

      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.25), { maxZoom: 13 });
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
  }, [venues]);

  // Otel kutusuna tıklanınca: haritada o otele uç + baloncuğu aç.
  // Seçili rozet pembeye döner ve z-index ile öne alınır (üst üste binme çözümü).
  useEffect(() => {
    for (const [id, m] of Object.entries(markersRef.current)) {
      const el = m.getElement()?.querySelector(".tm-pin");
      el?.classList.toggle("tm-pin--active", id === selected);
      m.setZIndexOffset(id === selected ? 1000 : 0);
    }
    if (!selected) return;
    const map = mapRef.current;
    const marker = markersRef.current[selected];
    if (!map || !marker) return;
    map.flyTo(marker.getLatLng(), Math.max(map.getZoom(), 13), { duration: 0.8 });
    marker.openPopup();
  }, [selected]);

  return (
    <div className="grid gap-4 lg:grid-cols-[400px_1fr]">
      {/* ── BLOK 1: OTEL KOLONU ── */}
      <div className="max-h-[calc(100vh-220px)] min-h-[420px] space-y-2.5 overflow-y-auto pr-1">
        {venues.map((v) => {
          const active = selected === v.id;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => setSelected(v.id)}
              aria-pressed={active}
              className={`group flex w-full items-center gap-3 rounded-card border bg-white p-2.5 text-left shadow-sm transition-all ${
                active ? "border-brand shadow-card ring-1 ring-brand" : "border-gray-200 hover:border-brand/40 hover:shadow-card"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={v.imageUrl} alt={v.name} loading="lazy" className="h-[72px] w-24 shrink-0 rounded-lg object-cover" />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className={`truncate text-sm font-bold ${active ? "text-brand" : "text-ink group-hover:text-brand"}`}>
                    {v.name}
                  </p>
                  {v.isSponsored && (
                    <span className="shrink-0 rounded bg-ink px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">Sponsored</span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted">
                  {v.city}, {v.district} · {"★".repeat(v.stars)} · {v.rating}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted">
                  <span className="inline-flex items-center gap-1">
                    <UsersIcon size={11} /> {v.maxTheatreCapacity.toLocaleString("en-US")}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <GridIcon size={11} /> {v.meetingRoomCount} halls
                  </span>
                  {/* 10'luk denetim puanı — vitrindeki rozetle aynı dil */}
                  {(() => {
                    const s = scoreParts(v.inspectionScore);
                    return (
                      <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white py-px pl-px pr-1.5">
                        <span className={`rounded-full bg-gradient-to-br px-1 py-0.5 text-[10px] font-black leading-none text-white ${s.grad}`}>
                          {s.rating}
                        </span>
                        <span className="text-[9px] font-semibold leading-none text-ink/70">{s.label}</span>
                      </span>
                    );
                  })()}
                </div>
              </div>

              <div className="shrink-0 text-right">
                {v.referencePrice !== null ? (
                  <>
                    <p className="text-sm font-bold text-brand">€ {v.referencePrice}</p>
                    <p className="text-[10px] text-muted">/ night</p>
                  </>
                ) : (
                  <p className="text-[10px] font-medium text-muted">On request</p>
                )}
                <Link
                  href={`/venues/${v.slug}`}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1 inline-flex items-center gap-0.5 text-[11px] font-semibold text-brand hover:underline"
                >
                  View <ArrowRightIcon size={11} />
                </Link>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── BLOK 2: HARİTA ── */}
      <div className="sticky top-20 h-[calc(100vh-220px)] min-h-[420px] overflow-hidden rounded-card border border-gray-200 bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2.5">
          <p className="text-sm font-bold text-ink">Map view</p>
          <p className="text-xs text-muted">Click a hotel to locate it · {venues.length} venues</p>
        </div>
        <div ref={containerRef} className="h-[calc(100%-84px)] w-full" />
        {/* Lejant */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-gray-200 px-4 py-2 text-[11px] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-3.5 w-7 rounded-full bg-white shadow-sm ring-1 ring-gray-300" /> Venue
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#1d4ed8] text-[8px] font-bold text-white">M</span>{" "}
            Metro / tram
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-accent text-[8px] text-white">★</span> City center
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-full border border-warning bg-warning/20" /> Busy area
          </span>
        </div>
      </div>

      {/* Pin ve popup stilleri (Leaflet DOM'una global sızması gerekiyor) */}
      <style jsx global>{`
        /* Airbnb tarzı fiyat rozeti: beyaz chip + koyu yazı + yumuşak gölge */
        .tm-pin {
          transform: translate(-50%, -50%);
          background: #fff;
          color: #1f1f1f;
          font: 700 12px/1 var(--font-inter), sans-serif;
          padding: 7px 11px;
          border-radius: 999px;
          white-space: nowrap;
          box-shadow:
            0 2px 8px rgba(0, 0, 0, 0.18),
            0 0 0 1px rgba(0, 0, 0, 0.06);
          cursor: pointer;
          transition:
            transform 0.15s,
            background 0.15s,
            color 0.15s,
            box-shadow 0.15s;
        }
        .tm-pin:hover {
          transform: translate(-50%, -50%) scale(1.1);
          background: #cf2c73;
          color: #fff;
          box-shadow: 0 4px 14px rgba(207, 44, 115, 0.45);
        }
        /* Seçili otel — kalıcı pembe vurgu */
        .tm-pin--active {
          background: #cf2c73;
          color: #fff;
          box-shadow: 0 4px 14px rgba(207, 44, 115, 0.5);
        }
        /* Fiyatsız mekan — bina ikonlu yuvarlak rozet */
        .tm-pin--icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          padding: 0;
        }
        .tm-metro {
          transform: translate(-50%, -50%);
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #1d4ed8;
          color: #fff;
          font: 700 10px/18px var(--font-inter), sans-serif;
          text-align: center;
          border: 2px solid #fff;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
        }
        .tm-center {
          transform: translate(-50%, -50%);
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #8e24aa;
          color: #fff;
          font: 700 11px/20px var(--font-inter), sans-serif;
          text-align: center;
          border: 2px solid #fff;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          padding: 0;
          overflow: hidden;
        }
        .leaflet-popup-content {
          margin: 0;
          width: 220px !important;
        }
        .tm-pop {
          display: block;
          text-decoration: none;
          color: #2d2d2d;
        }
        .tm-pop img {
          width: 100%;
          height: 110px;
          object-fit: cover;
          display: block;
        }
        .tm-pop-body {
          padding: 10px 12px 12px;
        }
        .tm-pop-name {
          font: 600 13px/1.3 var(--font-inter), sans-serif;
          margin: 0 0 4px;
        }
        .tm-pop-meta {
          font-size: 11px;
          color: #9e9e9e;
          margin: 0 0 6px;
        }
        .tm-pop-price {
          font: 700 14px/1 var(--font-inter), sans-serif;
          color: #cf2c73;
          margin: 0;
        }
        .tm-pop-price span {
          font-weight: 400;
          font-size: 11px;
          color: #9e9e9e;
        }
      `}</style>
    </div>
  );
}
