/*
 * Mekan Kartı — onaylı mockup anatomisine birebir:
 * foto + "Popular Venue" rozeti + kalp + ad + ★ puan + kapasite
 * + "€ X total before taxes" + "Responds within X hr"
 */
"use client";

import Link from "next/link";
import { useState } from "react";
import type { Venue } from "@/types";
import { Badge, Stars } from "@/components/ui";
import { HeartIcon, UsersIcon, GridIcon } from "@/components/ui/icons";
import { HotelLogo } from "./HotelLogo";

export function VenueCard({ venue }: { venue: Venue }) {
  const [fav, setFav] = useState(false);

  return (
    <div className="group overflow-hidden rounded-card border border-gray-200 bg-white transition-shadow hover:shadow-card">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={venue.imageUrl}
          alt={venue.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          {venue.isPopular && <Badge tone="brand">Popular Venue</Badge>}
          {venue.isSponsored && (
            <span className="rounded bg-black/50 px-2 py-0.5 text-xs font-medium text-white">Sponsored</span>
          )}
        </div>
        <button
          aria-label="Add to favorites"
          onClick={(e) => {
            e.preventDefault();
            setFav(!fav);
          }}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 transition-colors ${fav ? "text-brand" : "text-ink hover:text-brand"}`}
        >
          <HeartIcon size={18} filled={fav} />
        </button>
      </div>

      <Link href={`/venues/${venue.slug}`} className="block p-4">
        <div className="flex items-center gap-2.5">
          <HotelLogo domain={venue.domain} name={venue.name} size={34} />
          <h3 className="line-clamp-1 font-semibold text-ink">{venue.name}</h3>
        </div>
        <div className="mt-1 flex items-center gap-2 text-sm text-muted">
          <Stars rating={venue.rating} count={venue.reviewCount} />
          <span>·</span>
          <span>
            {venue.city}, {venue.district}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-4 text-sm text-muted">
          <span className="inline-flex items-center gap-1">
            <UsersIcon size={14} /> {venue.maxTheatreCapacity.toLocaleString("en-US")} guests
          </span>
          <span className="inline-flex items-center gap-1">
            <GridIcon size={14} /> {venue.meetingRoomCount} meeting rooms
          </span>
        </div>
        {/* MICE Inspection göstergeleri: metro erişimi + D Event puanı */}
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          {venue.transitAccess === "metro" && venue.nearestMetro && (
            <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-1.5 py-0.5 font-medium text-blue-700">
              <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-blue-700 text-[8px] font-bold text-white">
                M
              </span>
              {venue.nearestMetro}
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded bg-brand-light px-1.5 py-0.5 font-medium text-brand">
            MICE score {venue.inspectionScore}/100
          </span>
          {venue.sustainabilityCertified && (
            <span className="rounded bg-green-50 px-1.5 py-0.5 font-medium text-green-700">Eco-certified</span>
          )}
        </div>
        {venue.referencePrice !== null ? (
          <p className="mt-3 text-[15px]">
            <span className="font-bold text-ink">€ {venue.referencePrice}</span>
            <span className="text-muted"> / night — reference price</span>
          </p>
        ) : (
          <p className="mt-3 text-[15px] font-medium text-brand">Request a quote for pricing</p>
        )}
        <p className="mt-1 text-xs text-muted">Responds within {venue.responseTimeHours} hr</p>
        {venue.specialOffer && (
          <p className="mt-2 line-clamp-1 text-xs font-medium text-accent">🏷 {venue.specialOffer}</p>
        )}
      </Link>
    </div>
  );
}
