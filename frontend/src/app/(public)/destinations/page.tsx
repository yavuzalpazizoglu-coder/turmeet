/*
 * DESTİNASYONLAR — master doküman 3.2.5. İki bölümlü yapı:
 *  1. "Find venues by destination" — kompakt kartlar; tıklanınca
 *     /venues?city=X arama motoruna yönlenir (işlev aynı, kutular küçük).
 *  2. "Destination guide" — Türkiye tanıtımı: her şehir için MICE ve
 *     ICCA & IAPCO kriterlerine göre yazılmış bilgi profili (erişim,
 *     altyapı, uygun etkinlik formatları).
 *
 * Rehber verileri güvenilir kaynaklardan derlenmiştir:
 *  - ICCA Country & City Rankings 2023 (Istanbul: 72 kongre, dünya #21 / Avrupa #16)
 *  - DHMİ havalimanı istatistikleri 2024 (Antalya 39,2M yolcu; Istanbul
 *    Havalimanı EUROCONTROL/ACI raporlarında Avrupa'nın en yoğunu)
 *  - UNESCO Dünya Mirası Listesi (Göreme/Kapadokya 1985, Bursa & Cumalıkızık 2014)
 *  - ICVB (Istanbul Convention & Visitors Bureau) kongre verileri
 */
import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import {
  BuildingIcon,
  HomeIcon,
  ArrowRightIcon,
  PlaneIcon,
  UsersIcon,
  SearchIcon,
} from "@/components/ui/icons";
import { getDestinations } from "@/services";
import { PLATFORM_STATS } from "@/mocks/venues";

export const metadata = { title: "Destinations — Turmeet" };

/* Kategori rozetleri — Featured hotels sekmeleriyle aynı ICCA dili */
const CATEGORY: Record<string, { label: string; dot: string }> = {
  congress: { label: "Congress & Exhibition Hub", dot: "bg-brand" },
  incentive: { label: "Resort Congress & Incentive", dot: "bg-orange-400" },
  cultural: { label: "Boutique & Retreat", dot: "bg-amber-300" },
  wellness: { label: "Thermal & Mountain Resort", dot: "bg-teal-300" },
};

/*
 * DESTİNASYON REHBERİ — MICE & ICCA/IAPCO kriterlerine göre şehir profilleri.
 * access  = C.2 ulaşım/erişilebilirlik kriteri (havalimanı + şehir içi ulaşım)
 * infra   = amaca yönelik kongre/fuar altyapısı (ICCA kategori B envanteri)
 * formats = B.3 uygun etkinlik tipleri (ICCA/IAPCO etkinlik sınıflandırması)
 */
const GUIDES: {
  slug: string;
  headline: string;
  narrative: string;
  access: string;
  infra: string;
  formats: string[];
}[] = [
  {
    slug: "istanbul",
    headline: "Europe's transcontinental congress capital",
    narrative:
      "Istanbul hosted 72 international association meetings in 2023, ranking #21 worldwide and #16 in Europe (ICCA Country & City Rankings). The city pairs purpose-built centers — Lütfi Kırdar ICEC, Istanbul Congress Center and Haliç Congress Center, all within the Harbiye–Golden Horn congress valley — with one of Europe's largest five-star city hotel inventories.",
    access:
      "Istanbul Airport — Europe's busiest hub (EUROCONTROL/ACI 2024) with 300+ direct destinations; M2 metro serves the congress valley",
    infra: "3 purpose-built congress centers + Tüyap fairgrounds; halls up to 3,700 pax",
    formats: ["Congress", "Symposium", "Hybrid", "Corporate meeting"],
  },
  {
    slug: "antalya",
    headline: "The Mediterranean's resort congress powerhouse",
    narrative:
      "Antalya Airport handled a record 39.2 million passengers in 2024 (DHMİ), feeding the Belek–Lara resort corridor where five-star resort congress hotels operate plenaries for 2,000–5,000 pax under one roof. Host city of EXPO 2016, it is Turkey's benchmark for residential congresses and large incentives.",
    access: "Antalya Airport (AYT) — 39.2M passengers in 2024; resorts 20–35 min by transfer",
    infra: "Resort convention hotels + Cam Piramit Sabancı Center + ANFAŞ Expo (60,000 sqm)",
    formats: ["Incentive", "Congress", "Gala", "Exhibition"],
  },
  {
    slug: "ankara",
    headline: "The diplomatic meeting hub of the capital",
    narrative:
      "As the seat of government, ministries and 100+ embassies, Ankara is Turkey's natural stage for governmental summits, association congresses and defense-industry events. ATO Congresium — the capital's largest purpose-built venue with a 3,000-seat auditorium — anchors the Söğütözü business district alongside metro-connected conference hotels.",
    access: "Esenboğa Airport (ESB); Ankaray & M2 metro lines serve the hotel district",
    infra: "ATO Congresium (3,000 pax) + Beştepe congress facilities + conference hotels",
    formats: ["Congress", "Symposium", "Corporate meeting", "One-day"],
  },
  {
    slug: "izmir",
    headline: "The Aegean gateway for fairs & exhibitions",
    narrative:
      "Home of the International Izmir Fair since 1936 — Turkey's oldest trade fair tradition — Izmir combines historic Kültürpark fairgrounds in the city center with modern seafront conference hotels on the bay. A compact, walkable congress geography with strong metro and tram coverage.",
    access: "Adnan Menderes Airport (ADB); metro & tram reach the fair district in minutes",
    infra: "Kültürpark fairgrounds + bay-front conference hotels up to 1,400 pax",
    formats: ["Exhibition", "Congress", "Corporate meeting", "One-day"],
  },
  {
    slug: "cappadocia",
    headline: "UNESCO-listed boutique retreat destination",
    narrative:
      "Göreme National Park and the Rock Sites of Cappadocia have been UNESCO World Heritage since 1985. Boutique cave hotels host executive boards, leadership retreats and high-end incentive programs for groups of 20–200, with sunrise balloon flights as a signature incentive experience.",
    access: "Nevşehir (NAV) & Kayseri (ASR) airports — 45–75 min transfers",
    infra: "Boutique & cave hotels; meeting rooms for 20–200 pax, unique outdoor venues",
    formats: ["Incentive", "Workshop", "Corporate meeting"],
  },
  {
    slug: "bursa",
    headline: "Thermal heritage meets mountain incentives",
    narrative:
      "Bursa and Cumalıkızık joined the UNESCO World Heritage List in 2014. The city's Ottoman-era thermal spa tradition, the Merinos Atatürk Congress & Culture Center — a restored industrial campus with a 1,520-seat auditorium — and Uludağ ski resort make it a year-round wellness and retreat destination.",
    access: "45 min from Bursa Yenişehir (YEI); ~2h from Istanbul via ferry + highway",
    infra: "Merinos AKM (1,520 pax) + thermal convention hotels + Uludağ mountain resorts",
    formats: ["Incentive", "Corporate meeting", "Workshop", "Gala"],
  },
];

export default async function DestinationsPage() {
  const destinations = await getDestinations();

  return (
    <>
      <PublicHeader />

      <PageHero
        image="/images/dest-cappadocia.jpg"
        badge="34 Cities · One Platform"
        title="Destinations across Turkey"
        subtitle="City & conference hotels, resort congress hotels and purpose-built centers — every destination inspected, mapped and ready for your event."
        stats={[
          { value: PLATFORM_STATS.venues, label: "Verified Venues" },
          { value: PLATFORM_STATS.rooms, label: "Rooms" },
          { value: PLATFORM_STATS.cities, label: "Cities" },
          { value: PLATFORM_STATS.meetingHalls, label: "Meeting Halls" },
        ]}
      />

      {/* ── BÖLÜM 1: KOMPAKT ARAMA KARTLARI — /venues?city=X'e yönlenir ── */}
      <section className="bg-surface py-10">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold text-ink">Find venues by destination</h2>
              <p className="mt-1 text-sm text-muted">Pick a city to open the venue search engine with live filters</p>
            </div>
            <Link href="/venues" className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
              All venues <ArrowRightIcon size={15} />
            </Link>
          </div>

          {/* Küçültülmüş eşit kartlar — 3 sütun, sabit 170px yükseklik */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((d, i) => {
              const cat = CATEGORY[d.category] ?? { label: d.category, dot: "bg-white" };
              return (
                <Reveal key={d.slug} delay={i * 70}>
                  <Link
                    href={`/venues?city=${d.name}`}
                    className="group relative block h-[170px] overflow-hidden rounded-card"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={d.imageUrl}
                      alt={d.name}
                      className="h-full w-full object-cover brightness-[1.05] contrast-[1.06] saturate-[1.25] transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/5" />
                    <div className="pointer-events-none absolute inset-0 -translate-x-[130%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[130%]" />

                    <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md border border-white/25 bg-black/35 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white shadow-sm backdrop-blur-md">
                      <span className={`h-1.5 w-1.5 rounded-full ${cat.dot}`} />
                      {cat.label}
                    </span>

                    <div className="absolute inset-x-0 bottom-0 p-3.5 text-white">
                      <p className="text-lg font-bold">{d.name}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 rounded-full border border-white/25 bg-white/15 px-2 py-0.5 backdrop-blur-md">
                          <BuildingIcon size={11} className="text-brand-light" />
                          <span className="text-xs font-extrabold leading-none">
                            <CountUp value={d.venueCount} />
                          </span>
                          <span className="text-[9px] font-medium uppercase tracking-wide text-white/75">venues</span>
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-white/25 bg-white/15 px-2 py-0.5 backdrop-blur-md">
                          <HomeIcon size={11} className="text-brand-light" />
                          <span className="text-xs font-extrabold leading-none">
                            <CountUp value={d.totalRooms} />
                          </span>
                          <span className="text-[9px] font-medium uppercase tracking-wide text-white/75">rooms</span>
                        </span>
                        <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold opacity-0 transition-opacity group-hover:opacity-100">
                          <SearchIcon size={12} /> Search
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BÖLÜM 2: DESTİNASYON REHBERİ — MICE & ICCA/IAPCO profilleri ── */}
      <section className="bg-white py-12">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6">
          <Reveal className="mb-6 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-widest text-brand">Destination guide</p>
            <h2 className="mt-2 text-2xl font-bold text-ink">Turkey&apos;s MICE destinations, by the numbers</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Each profile follows ICCA &amp; IAPCO destination criteria: air access and city transit, purpose-built
              congress infrastructure, and the event formats the destination serves best.
            </p>
          </Reveal>

          <div className="grid gap-4 lg:grid-cols-2">
            {GUIDES.map((g, i) => {
              const d = destinations.find((x) => x.slug === g.slug);
              if (!d) return null;
              const cat = CATEGORY[d.category] ?? { label: d.category, dot: "bg-brand" };
              return (
                <Reveal key={g.slug} delay={i * 80}>
                  <article className="group flex h-full flex-col overflow-hidden rounded-card border border-gray-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-xl sm:flex-row">
                    {/* Fotoğraf — dar dikey şerit */}
                    <div className="relative h-36 shrink-0 overflow-hidden sm:h-auto sm:w-44">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={d.imageUrl}
                        alt={d.name}
                        loading="lazy"
                        className="h-full w-full object-cover saturate-[1.15] transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      <p className="absolute bottom-2 left-3 text-lg font-bold text-white">{d.name}</p>
                    </div>

                    <div className="flex flex-1 flex-col p-4">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-brand-light px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-brand">
                          <span className={`h-1.5 w-1.5 rounded-full ${cat.dot}`} />
                          {cat.label}
                        </span>
                      </div>
                      <h3 className="mt-1.5 text-[15px] font-bold text-ink">{g.headline}</h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-muted">{g.narrative}</p>

                      {/* ICCA/IAPCO kriter satırları — erişim + altyapı */}
                      <div className="mt-3 space-y-1.5 border-t border-gray-100 pt-3">
                        <p className="flex items-start gap-2 text-[11px] leading-snug text-ink/75">
                          <PlaneIcon size={13} className="mt-0.5 shrink-0 text-brand" />
                          {g.access}
                        </p>
                        <p className="flex items-start gap-2 text-[11px] leading-snug text-ink/75">
                          <BuildingIcon size={13} className="mt-0.5 shrink-0 text-brand" />
                          {g.infra}
                        </p>
                      </div>

                      {/* Uygun etkinlik formatları + arama linki */}
                      <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-3">
                        <UsersIcon size={13} className="text-muted" />
                        {g.formats.map((f) => (
                          <span
                            key={f}
                            className="rounded-full border border-gray-200 bg-surface px-2 py-0.5 text-[10px] font-semibold text-ink/80"
                          >
                            {f}
                          </span>
                        ))}
                        <Link
                          href={`/venues?city=${d.name}`}
                          className="ml-auto inline-flex items-center gap-1 text-[11px] font-bold text-brand hover:underline"
                        >
                          Search venues <ArrowRightIcon size={12} />
                        </Link>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>

          {/* Kaynak dipnotu — güvenilirlik */}
          <Reveal delay={200}>
            <p className="mt-6 text-center text-[10px] uppercase tracking-wide text-muted">
              Sources: ICCA Country &amp; City Rankings 2023 · DHMİ airport statistics 2024 · UNESCO World Heritage List
              · Istanbul Convention &amp; Visitors Bureau (ICVB)
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
