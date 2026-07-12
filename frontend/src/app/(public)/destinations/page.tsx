/*
 * DESTİNASYONLAR — master doküman 3.2.5: şehir kartları + kategoriler.
 */
import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { Badge } from "@/components/ui";
import { getDestinations } from "@/services";

export const metadata = { title: "Destinations — Turmeet" };

const CATEGORY_LABELS: Record<string, string> = {
  congress: "Congress",
  incentive: "Incentive",
  cultural: "Cultural",
  wellness: "Wellness",
};

export default async function DestinationsPage() {
  const destinations = await getDestinations();

  return (
    <>
      <PublicHeader />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold text-ink">Destinations across Turkey</h1>
        <p className="mt-1 text-sm text-muted">
          34 cities, 329+ verified venues — from world-class congress hubs to boutique retreat towns.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((d) => (
            <Link key={d.slug} href={`/venues?city=${d.name}`} className="group overflow-hidden rounded-card border border-gray-200 bg-white transition-shadow hover:shadow-card">
              <div className="relative h-48 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={d.imageUrl} alt={d.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                <div className="absolute left-3 top-3">
                  <Badge tone="brand">{CATEGORY_LABELS[d.category]}</Badge>
                </div>
              </div>
              <div className="p-5">
                <h2 className="text-lg font-bold text-ink group-hover:text-brand">{d.name}</h2>
                <p className="mt-1 text-sm text-muted">{d.tagline}</p>
                <p className="mt-3 text-sm font-medium text-ink">
                  {d.venueCount} venues · {d.totalRooms.toLocaleString("en-US")} rooms
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
