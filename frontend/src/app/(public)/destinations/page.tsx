/*
 * DESTİNASYONLAR — master doküman 3.2.5.
 * Anasayfa görsel diliyle eşitlendi: PageHero (koyu foto + cam rozet)
 * + anasayfadaki bento mozaik kartların aynısı (buzlu cam kategori
 * rozeti, CountUp'lı istatistik chip'leri, hover ışıltı süpürmesi).
 */
import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { BuildingIcon, HomeIcon, ArrowRightIcon } from "@/components/ui/icons";
import { getDestinations } from "@/services";
import { PLATFORM_STATS } from "@/mocks/venues";

export const metadata = { title: "Destinations — Turmeet" };

/*
 * Kategori rozetleri — anasayfa destinasyon bandı ve Featured hotels
 * sekmeleriyle aynı ICCA sınıflandırma dili.
 */
const CATEGORY: Record<string, { label: string; dot: string }> = {
  congress: { label: "Congress & Exhibition Hub", dot: "bg-brand" },
  incentive: { label: "Resort Congress & Incentive", dot: "bg-orange-400" },
  cultural: { label: "Boutique & Retreat", dot: "bg-amber-300" },
  wellness: { label: "Thermal & Mountain Resort", dot: "bg-teal-300" },
};

export default async function DestinationsPage() {
  const destinations = await getDestinations();

  return (
    <>
      <PublicHeader />

      <PageHero
        image="/images/dest-cappadocia.jpg"
        badge="34 Cities · One Platform"
        title="Destinations across Turkey"
        subtitle="From world-class congress hubs to boutique retreat towns — every destination inspected, mapped and ready for your event."
        stats={[
          { value: PLATFORM_STATS.venues, label: "Verified Venues" },
          { value: PLATFORM_STATS.rooms, label: "Rooms" },
          { value: PLATFORM_STATS.cities, label: "Cities" },
          { value: PLATFORM_STATS.meetingHalls, label: "Meeting Halls" },
        ]}
      />

      <div className="bg-surface py-10">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6">
          {/* Bento mozaik — anasayfa 3. sayfa ile aynı düzen */}
          <div className="grid auto-rows-[190px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {destinations.map((d, i) => {
              const span =
                i === 0
                  ? "lg:col-span-2 lg:row-span-2 sm:col-span-2"
                  : i === 1
                    ? "lg:col-span-2"
                    : i >= 4
                      ? "lg:col-span-2"
                      : "";
              const cat = CATEGORY[d.category] ?? { label: d.category, dot: "bg-white" };
              return (
                <Reveal key={d.slug} delay={i * 80} className={span}>
                  <Link
                    href={`/venues?city=${d.name}`}
                    className="group relative block h-full overflow-hidden rounded-card"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={d.imageUrl}
                      alt={d.name}
                      className="h-full w-full object-cover brightness-[1.05] contrast-[1.06] saturate-[1.25] transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/5" />
                    <div className="pointer-events-none absolute inset-0 -translate-x-[130%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[130%]" />

                    <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-md border border-white/25 bg-black/35 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white shadow-sm backdrop-blur-md">
                      <span className={`h-1.5 w-1.5 rounded-full ${cat.dot}`} />
                      {cat.label}
                    </span>

                    <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                      <p className={`font-bold ${i === 0 ? "text-3xl" : "text-xl"}`}>{d.name}</p>
                      <p className={`mt-0.5 text-white/85 ${i === 0 ? "text-sm" : "text-xs"}`}>{d.tagline}</p>
                      <div className="mt-2.5 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-2.5 py-1 shadow-sm backdrop-blur-md transition-colors group-hover:bg-white/25">
                          <BuildingIcon size={12} className="text-brand-light" />
                          <span className={`font-extrabold leading-none ${i === 0 ? "text-sm" : "text-xs"}`}>
                            <CountUp value={d.venueCount} />
                          </span>
                          <span className="text-[10px] font-medium uppercase tracking-wide text-white/75">venues</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-2.5 py-1 shadow-sm backdrop-blur-md transition-colors group-hover:bg-white/25">
                          <HomeIcon size={12} className="text-brand-light" />
                          <span className={`font-extrabold leading-none ${i === 0 ? "text-sm" : "text-xs"}`}>
                            <CountUp value={d.totalRooms} />
                          </span>
                          <span className="text-[10px] font-medium uppercase tracking-wide text-white/75">rooms</span>
                        </span>
                        <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold opacity-0 transition-opacity group-hover:opacity-100">
                          Explore <ArrowRightIcon size={13} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
