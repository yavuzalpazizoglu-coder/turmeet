/*
 * ŞEHİR HARİTASI — tek şehir aramasında SERP'in sağında gösterilir.
 * Altyapı: Leaflet + CARTO Voyager tile'ları (ücretsiz, API key gerekmez).
 * Pinler: marka pembesi fiyat etiketleri; tıklanınca otel önizleme kartı açılır.
 * Ek katmanlar (lib/city-map-data.ts): merkezi noktalar, metro istasyonları,
 * yoğun bölgeler (yarı saydam daire).
 */
"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import type { Venue } from "@/types";
import { CITY_MAP_LAYERS } from "@/lib/city-map-data";

export function VenueMap({ venues, city }: { venues: Venue[]; city: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // Leaflet'i tarayıcıda dinamik yükle (SSR'da window yok)
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        scrollWheelZoom: false,
        attributionControl: true,
      });
      mapRef.current = map;

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
      }).addTo(map);

      const markers = venues.map((v) => {
        const label = v.referencePrice !== null ? `€${v.referencePrice}` : "★";
        const icon = L.divIcon({
          className: "",
          html: `<div class="tm-pin">${label}</div>`,
          iconSize: [0, 0],
        });

        const marker = L.marker([v.lat, v.lng], { icon }).addTo(map);
        marker.bindPopup(
          `<a href="/venues/${v.slug}" class="tm-pop">
             <img src="${v.imageUrl}" alt="" />
             <div class="tm-pop-body">
               <p class="tm-pop-name">${v.name}</p>
               <p class="tm-pop-meta">★ ${v.rating.toFixed(1)} · ${v.maxTheatreCapacity.toLocaleString("en-US")} guests · ${v.meetingRoomCount} rooms</p>
               ${v.referencePrice !== null ? `<p class="tm-pop-price">€ ${v.referencePrice} <span>/ night ref.</span></p>` : ""}
             </div>
           </a>`,
          { closeButton: false, minWidth: 220, maxWidth: 220 }
        );
        return marker;
      });

      // ── Şehir katmanları: yoğun bölgeler, merkezler, metro ──
      const layers = CITY_MAP_LAYERS[city];
      if (layers) {
        // Yoğun bölgeler — yarı saydam turuncu daireler
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
        // Merkezi noktalar — mor yıldız rozet
        for (const c of layers.centers) {
          L.marker([c.lat, c.lng], {
            icon: L.divIcon({ className: "", html: `<div class="tm-center">★</div>`, iconSize: [0, 0] }),
          })
            .addTo(map)
            .bindTooltip(c.name, { direction: "top" });
        }
        // Metro / tramvay istasyonları — mavi "M" rozeti
        for (const m of layers.metro) {
          L.marker([m.lat, m.lng], {
            icon: L.divIcon({ className: "", html: `<div class="tm-metro">M</div>`, iconSize: [0, 0] }),
          })
            .addTo(map)
            .bindTooltip(m.name, { direction: "top" });
        }
      }

      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.25), { maxZoom: 14 });
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [venues, city]);

  return (
    <div className="overflow-hidden rounded-card border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <p className="text-sm font-bold text-ink">{city} — venue map</p>
        <p className="text-xs text-muted">{venues.length} venues</p>
      </div>
      <div ref={containerRef} className="h-[calc(100vh-260px)] min-h-[420px] w-full" />

      {/* Katman lejantı */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-gray-200 px-4 py-2 text-[11px] text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-brand ring-2 ring-white" /> Venue
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#1d4ed8] text-[8px] font-bold text-white">M</span>{" "}
          Metro / tram
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-accent text-[8px] text-white">★</span> City
          center
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full border border-warning bg-warning/20" /> Busy area
        </span>
      </div>

      {/* Pin ve popup stilleri (Leaflet DOM'una global sızması gerekiyor) */}
      <style jsx global>{`
        .tm-pin {
          transform: translate(-50%, -100%);
          background: #cf2c73;
          color: #fff;
          font: 700 12px/1 var(--font-inter), sans-serif;
          padding: 6px 10px;
          border-radius: 999px;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
          border: 2px solid #fff;
          cursor: pointer;
          transition: transform 0.15s;
        }
        .tm-pin:hover {
          transform: translate(-50%, -100%) scale(1.12);
          background: #a91f5c;
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
