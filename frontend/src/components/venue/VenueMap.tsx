/*
 * ŞEHİR HARİTASI — tek şehir aramasında SERP'in sağında gösterilir.
 * Altyapı: Leaflet + CARTO Voyager tile'ları (ücretsiz, API key gerekmez).
 * Pinler: marka pembesi fiyat etiketleri; tıklanınca otel önizleme kartı açılır.
 */
"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import type { Venue } from "@/types";

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

      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.25), { maxZoom: 14 });
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [venues]);

  return (
    <div className="overflow-hidden rounded-card border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <p className="text-sm font-bold text-ink">{city} — venue map</p>
        <p className="text-xs text-muted">{venues.length} venues</p>
      </div>
      <div ref={containerRef} className="h-[calc(100vh-220px)] min-h-[420px] w-full" />

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
