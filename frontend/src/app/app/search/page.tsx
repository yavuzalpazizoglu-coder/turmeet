/*
 * PANEL İÇİ MEKAN ARAMA — platformun EN DETAYLI araması (master 4.2).
 * Düzen: üstte kompakt yatay filtre çubuğu (detailed-filters.tsx),
 * altında az yer kaplayan sıra kartlar — müşteri kaydırmadan gezer.
 * Filtre kriterleri D Event MICE Inspection Formu'ndan gelir.
 */
import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { UsersIcon, GridIcon, ArrowRightIcon } from "@/components/ui/icons";
import { getVenues } from "@/services";
import { DetailedVenueFilters } from "./detailed-filters";

export const metadata = { title: "Venue Search — Turmeet" };

export default async function PanelSearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const venues = await getVenues({
    q: params.q,
    city: params.city,
    stars: params.stars ? Number(params.stars) : undefined,
    minCapacity: params.capacity ? Number(params.capacity) : undefined,
    type: params.type,
    eventType: params.eventType,
    budget: params.budget,
    metro: params.metro,
    sustainable: params.sustainable,
    groupSize: params.groupSize,
    maxAirport: params.maxAirport,
    maxCenter: params.maxCenter,
    minRooms: params.minRooms,
    minMeetingRooms: params.minMeetingRooms,
    hybrid: params.hybrid,
    accessible: params.accessible,
    minScore: params.minScore,
  });

  return (
    <>
      <PageHeader
        title="Venue search"
        description="The most detailed search on the platform — filter by MICE inspection criteria and add venues to a new quote request."
      />

      {/* Kompakt filtre çubuğu — arama motoru en üstte, tam genişlik */}
      <DetailedVenueFilters current={params} />

      <p className="mb-3 mt-4 text-sm text-muted">
        <span className="font-bold text-ink">{venues.length}</span> venues match your criteria
      </p>

      {venues.length === 0 ? (
        <div className="rounded-card border border-gray-200 bg-white p-10 text-center text-sm text-muted">
          No venues match these filters. Try relaxing the criteria.
        </div>
      ) : (
        /* Kompakt sonuç satırları — kart yerine düşük yükseklikli sıralar */
        <div className="space-y-2.5">
          {venues.map((v) => (
            <Link
              key={v.id}
              href={`/venues/${v.slug}`}
              className="group flex items-center gap-4 rounded-card border border-gray-200 bg-white p-2.5 transition-all hover:border-brand/40 hover:shadow-card"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={v.imageUrl}
                alt={v.name}
                loading="lazy"
                className="h-20 w-32 shrink-0 rounded-lg object-cover"
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-bold text-ink group-hover:text-brand">{v.name}</p>
                  {v.isSponsored && (
                    <span className="shrink-0 rounded bg-ink px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
                      Sponsored
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted">
                  {v.city}, {v.district} · {"★".repeat(v.stars)} ·{" "}
                  <span className="font-semibold text-ink">{v.rating}</span> ({v.reviewCount})
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted">
                  <span className="inline-flex items-center gap-1">
                    <UsersIcon size={12} /> {v.maxTheatreCapacity.toLocaleString("en-US")} pax
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <GridIcon size={12} /> {v.meetingRoomCount} halls
                  </span>
                  <span className="rounded bg-brand-light px-1.5 py-0.5 font-semibold text-brand">
                    MICE {v.inspectionScore}/100
                  </span>
                  {v.transitAccess === "metro" && (
                    <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-1.5 py-0.5 font-semibold text-blue-700">
                      M · metro
                    </span>
                  )}
                  {v.sustainabilityCertified && (
                    <span className="rounded bg-green-50 px-1.5 py-0.5 font-semibold text-green-700">Eco</span>
                  )}
                </div>
              </div>

              <div className="shrink-0 text-right">
                {v.referencePrice !== null ? (
                  <>
                    <p className="text-base font-bold text-brand">€ {v.referencePrice}</p>
                    <p className="text-[10px] text-muted">/ night — reference</p>
                  </>
                ) : (
                  <p className="text-xs font-medium text-muted">Price on request</p>
                )}
                <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-brand opacity-0 transition-opacity group-hover:opacity-100">
                  View <ArrowRightIcon size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
