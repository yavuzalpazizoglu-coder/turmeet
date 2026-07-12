/*
 * ANASAYFA — onaylı mockup: tam ekran fotoğraflı hero + pill arama çubuğu
 * + 3'lü değer önerisi + istatistikler + popüler mekanlar + destinasyonlar.
 * Kaynak: TURMEET_MASTER_Kurulum.md 3.2.1 + 15.8-A
 */
import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import HeroSlideshow from "@/components/home/HeroSlideshow";
import { LinkButton } from "@/components/ui";
import {
  SearchIcon,
  MapPinIcon,
  CalendarIcon,
  UsersIcon,
  BuildingIcon,
  CheckIcon,
  ArrowRightIcon,
} from "@/components/ui/icons";
import { getVenues, getDestinations } from "@/services";
import { PLATFORM_STATS } from "@/mocks/venues";
import { EVENT_TYPES, BUDGET_SEGMENTS } from "@/lib/mice-criteria";

export default async function HomePage() {
  const [venues, destinations] = await Promise.all([getVenues(), getDestinations()]);

  /*
   * Vitrin kolonları — 3 ana başlık altında 3'er otel:
   *  1-2) Şehre göre (Istanbul, Antalya) — en yüksek puanlılar
   *  3)   Fiyata göre — Türkiye genelinde en uygun referans fiyatlar
   */
  const byCity = (city: string) =>
    venues
      .filter((v) => v.city === city)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
  const bestValue = [...venues]
    .filter((v) => v.referencePrice !== null)
    .sort((a, b) => (a.referencePrice ?? 0) - (b.referencePrice ?? 0))
    .slice(0, 3);
  const destInfo = (name: string) => destinations.find((d) => d.name === name);

  const showcase = [
    {
      title: "Istanbul",
      subtitle: `${destInfo("Istanbul")?.venueCount ?? 0} venues · ${destInfo("Istanbul")?.tagline ?? ""}`,
      href: "/venues?city=Istanbul",
      items: byCity("Istanbul"),
    },
    {
      title: "Antalya",
      subtitle: `${destInfo("Antalya")?.venueCount ?? 0} venues · ${destInfo("Antalya")?.tagline ?? ""}`,
      href: "/venues?city=Antalya",
      items: byCity("Antalya"),
    },
    {
      title: "Best Price Picks",
      subtitle: "Lowest reference prices across Turkey",
      href: "/venues",
      items: bestValue,
    },
  ];

  return (
    /*
     * Tam sayfa görünüm: her bölüm ekranı kaplar (100dvh) ve scroll-snap
     * ile tek tek görüntülenir. Kapsayıcı kendi scroll'unu yönetir;
     * son sayfadan sonra kaydırmaya devam edilince footer görünür.
     */
    <div className="relative h-[100dvh] snap-y snap-mandatory overflow-y-auto">
      <PublicHeader variant="transparent" />

      {/* ── SAYFA 1: HERO ── */}
      <section className="relative flex min-h-[100dvh] snap-start items-center justify-center overflow-hidden bg-ink">
        <HeroSlideshow />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/50" />

        <div className="relative z-10 mx-auto w-full max-w-4xl px-4 pb-12 pt-28 text-center">
          <h1 className="hero-text-shadow text-4xl font-bold uppercase tracking-wide text-white sm:text-5xl">
            Plan Your Meeting in Turkey
          </h1>
          {/* Slogan — 3x büyütüldü (24/27px), saf beyaz + bold */}
          <p className="hero-text-shadow mt-3 text-[24px] font-bold uppercase tracking-[0.15em] text-white sm:text-[27px]">
            Compare. Choose. Organize.
          </p>

          {/* Arama kutusu — ICCA/IAPCO toplantı kriterleri ile (MICE Inspection formu) */}
          <form action="/venues" className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl">
            {/* Satır 1: nerede · ne zaman · kaç kişi */}
            <div className="flex flex-col sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-2 border-b border-gray-200 px-5 py-3.5 sm:border-r">
                <MapPinIcon size={18} className="shrink-0 text-muted" />
                <input
                  name="q"
                  placeholder="Search for venues or cities"
                  className="w-full text-[15px] outline-none placeholder:text-muted"
                />
              </div>
              <div className="flex flex-1 items-center gap-2 border-b border-gray-200 px-5 py-3.5 sm:border-r">
                <CalendarIcon size={18} className="shrink-0 text-muted" />
                <input name="dates" placeholder="Add dates" className="w-full text-[15px] outline-none placeholder:text-muted" />
              </div>
              <div className="flex flex-1 items-center gap-2 border-b border-gray-200 px-5 py-3.5">
                <UsersIcon size={18} className="shrink-0 text-muted" />
                <input
                  name="capacity"
                  type="number"
                  min={1}
                  placeholder="Attendees (e.g. 50)"
                  className="w-full text-[15px] outline-none placeholder:text-muted"
                />
              </div>
            </div>

            {/* Satır 2: toplantı tipi (ICCA/IAPCO) · bütçe · metro · ara */}
            <div className="flex flex-col gap-2 p-2 sm:flex-row sm:items-center">
              <select
                name="eventType"
                defaultValue=""
                className="h-11 flex-1 rounded-xl border border-gray-200 bg-white px-3 text-sm text-ink outline-none focus:border-brand"
              >
                <option value="">Meeting type (ICCA / IAPCO)</option>
                {EVENT_TYPES.map((e) => (
                  <option key={e.value} value={e.value}>
                    {e.label}
                  </option>
                ))}
              </select>
              <select
                name="budget"
                defaultValue=""
                className="h-11 flex-1 rounded-xl border border-gray-200 bg-white px-3 text-sm text-ink outline-none focus:border-brand"
              >
                <option value="">Any budget</option>
                {BUDGET_SEGMENTS.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label} hotel
                  </option>
                ))}
              </select>
              <label className="flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-gray-200 px-3 text-sm text-ink">
                <input type="checkbox" name="metro" value="1" className="h-4 w-4 accent-brand" />
                Near metro
              </label>
              <button
                type="submit"
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-8 text-[15px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-brand-dark"
              >
                <SearchIcon size={17} /> Search
              </button>
            </div>
          </form>

          {/* Popüler şehirler — gövde metinleriyle eşit boyut (14px) */}
          <p className="hero-text-shadow mt-5 text-sm font-semibold text-white">
            Popular:{" "}
            {["Istanbul", "Antalya", "Ankara", "Cappadocia", "Izmir"].map((c, i) => (
              <Link key={c} href={`/venues?city=${c}`} className="font-bold text-white hover:underline">
                {c}
                {i < 4 ? " · " : ""}
              </Link>
            ))}
          </p>

          {/* İstatistikler — ilk ekranda görünür */}
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
            {[
              { value: PLATFORM_STATS.venues, label: "Verified Venues" },
              { value: PLATFORM_STATS.rooms, label: "Rooms" },
              { value: PLATFORM_STATS.cities, label: "Cities" },
              { value: PLATFORM_STATS.meetingHalls, label: "Meeting Halls" },
            ].map((s) => (
              <div key={s.label} className="hero-text-shadow">
                <p className="text-3xl font-extrabold text-white sm:text-4xl">{s.value}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-widest text-white/75">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Değer önerisi — hero'nun altında, fon rengi yok, %25 büyütülmüş */}
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-3">
            {[
              { icon: <MapPinIcon size={28} />, title: "Browse venues", desc: "Explore verified hotels and congress centers across 34 cities in Turkey" },
              { icon: <CalendarIcon size={28} />, title: "Streamline booking", desc: "Request and compare live group offers from multiple venues at once" },
              { icon: <CheckIcon size={28} />, title: "Zero commission", desc: "Completely free for organizers — no hidden fees, no subscription" },
            ].map((f) => (
              <div key={f.title} className="hero-text-shadow flex items-start gap-3 text-left">
                <span className="mt-0.5 shrink-0 text-white">{f.icon}</span>
                <div>
                  <h3 className="text-[19px] font-bold text-white">{f.title}</h3>
                  <p className="mt-0.5 text-[16px] leading-snug text-white/80">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SAYFA 2: ÖNE ÇIKAN OTELLER — 3 ana başlık × 3 otel ── */}
      <section className="flex min-h-[100dvh] snap-start flex-col justify-center bg-white py-10">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-ink">Featured hotels</h2>
              <p className="mt-1 text-sm text-muted">Hand-picked meeting hotels by destination and price</p>
            </div>
            <Link href="/venues" className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
              View all <ArrowRightIcon size={15} />
            </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {showcase.map((col) => (
              <div key={col.title}>
                {/* Kolon başlığı + destinasyon bilgisi */}
                <div className="mb-4 border-b-2 border-brand/20 pb-3">
                  <Link href={col.href} className="inline-flex items-center gap-1.5 text-lg font-bold text-ink hover:text-brand">
                    <MapPinIcon size={17} className="text-brand" /> {col.title}
                  </Link>
                  <p className="mt-0.5 text-sm text-muted">{col.subtitle}</p>
                </div>

                <div className="space-y-4">
                  {col.items.map((v) => (
                    <Link
                      key={v.id}
                      href={`/venues/${v.slug}`}
                      className="group flex gap-3 rounded-card border border-gray-100 bg-white p-3 shadow-card transition-shadow hover:shadow-lg"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={v.imageUrl}
                        alt={v.name}
                        className="h-24 w-28 shrink-0 rounded-lg object-cover"
                        loading="lazy"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-ink group-hover:text-brand">{v.name}</p>
                        <p className="mt-0.5 text-xs text-muted">
                          {v.city}, {v.district} · {"★".repeat(v.stars)}
                        </p>
                        <p className="mt-1 text-xs text-muted">
                          <span className="font-semibold text-ink">{v.rating}</span> ({v.reviewCount} reviews) ·{" "}
                          {v.maxTheatreCapacity.toLocaleString("en-US")} guests
                        </p>
                        {v.referencePrice !== null ? (
                          <p className="mt-1 text-sm font-bold text-brand">
                            € {v.referencePrice} <span className="text-xs font-normal text-muted">/ night — reference</span>
                          </p>
                        ) : (
                          <p className="mt-1 text-xs font-medium text-muted">Price on request</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SAYFA 3: DESTİNASYONLAR ── */}
      <section className="flex min-h-[100dvh] snap-start items-center bg-surface py-10">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-ink">Destinations across Turkey</h2>
          <p className="mt-1 text-sm text-muted">From congress cities to boutique retreats</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((d) => (
              <Link
                key={d.slug}
                href={`/destinations/${d.slug}`}
                className="group relative h-52 overflow-hidden rounded-card"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={d.imageUrl}
                  alt={d.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 p-5 text-white">
                  <p className="text-lg font-bold">{d.name}</p>
                  <p className="text-sm text-white/80">
                    {d.venueCount} venues · {d.tagline}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SAYFA 4: HOW IT WORKS ── */}
      <section className="flex min-h-[100dvh] snap-start flex-col justify-center py-10">
        <div className="mx-auto w-full max-w-5xl px-4 text-center sm:px-6">
        <h2 className="text-2xl font-bold text-ink">How it works</h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          {[
            { n: "1", title: "Search", desc: "Enter city, dates and group size — filter across 329+ venues" },
            { n: "2", title: "Compare", desc: "Receive live quotes from multiple venues and compare side by side" },
            { n: "3", title: "Organize", desc: "Sign digitally and manage your event — all on one platform" },
          ].map((s) => (
            <div key={s.n}>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand text-lg font-bold text-white">
                {s.n}
              </div>
              <h3 className="mt-3 font-bold text-ink">{s.title}</h3>
              <p className="mt-1 text-sm text-muted">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <LinkButton href="/register" size="lg">
            Get started — it&apos;s free
          </LinkButton>
        </div>
        </div>
      </section>

      {/* ── SAYFA 5: OTEL CTA ── */}
      <section className="flex min-h-[100dvh] snap-start items-center bg-ink">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-14 text-center sm:px-6">
          <BuildingIcon size={36} className="text-brand" />
          <h2 className="text-2xl font-bold text-white">List your venue on Turmeet</h2>
          <p className="max-w-xl text-sm text-white/70">
            Reach international event organizers with the lowest commission in the market. Pay only for realized events.
          </p>
          <LinkButton href="/register/hotel" variant="primary" size="lg">
            List Your Venue
          </LinkButton>
        </div>
      </section>
    </div>
  );
}
