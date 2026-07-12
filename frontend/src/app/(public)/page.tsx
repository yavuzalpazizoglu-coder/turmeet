/*
 * ANASAYFA — onaylı mockup: tam ekran fotoğraflı hero + pill arama çubuğu
 * + 3'lü değer önerisi + istatistikler + popüler mekanlar + destinasyonlar.
 * Kaynak: TURMEET_MASTER_Kurulum.md 3.2.1 + 15.8-A
 */
import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import HeroSlideshow from "@/components/home/HeroSlideshow";
import { VenueCard } from "@/components/venue/VenueCard";
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

export default async function HomePage() {
  const [venues, destinations] = await Promise.all([getVenues(), getDestinations()]);
  const popular = venues.filter((v) => v.isPopular).slice(0, 4);

  return (
    <>
      <PublicHeader variant="transparent" />

      {/* ── HERO ── */}
      <section className="relative flex min-h-[640px] items-center justify-center overflow-hidden bg-ink">
        <HeroSlideshow />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/50" />

        <div className="relative z-10 mx-auto w-full max-w-4xl px-4 pb-12 pt-28 text-center">
          <h1 className="hero-text-shadow text-4xl font-bold uppercase tracking-wide text-white sm:text-5xl">
            Plan Your Meeting in Turkey
          </h1>
          <p className="hero-text-shadow mt-3 text-sm font-medium uppercase tracking-[0.15em] text-white/85 sm:text-base">
            Compare. Choose. Organize.
          </p>

          {/* Pill arama çubuğu */}
          <form
            action="/venues"
            className="mx-auto mt-8 flex max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl sm:flex-row sm:items-center sm:rounded-full"
          >
            <div className="flex flex-1 items-center gap-2 border-b border-gray-200 px-5 py-3.5 sm:border-b-0 sm:border-r">
              <MapPinIcon size={18} className="shrink-0 text-muted" />
              <input
                name="q"
                placeholder="Search for venues or cities"
                className="w-full text-[15px] outline-none placeholder:text-muted"
              />
            </div>
            <div className="flex flex-1 items-center gap-2 border-b border-gray-200 px-5 py-3.5 sm:border-b-0 sm:border-r">
              <CalendarIcon size={18} className="shrink-0 text-muted" />
              <input name="dates" placeholder="Add dates" className="w-full text-[15px] outline-none placeholder:text-muted" />
            </div>
            <div className="flex flex-1 items-center gap-2 px-5 py-3.5">
              <UsersIcon size={18} className="shrink-0 text-muted" />
              <input name="guests" placeholder="Attendees" className="w-full text-[15px] outline-none placeholder:text-muted" />
            </div>
            <div className="p-2">
              <button
                type="submit"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand px-8 text-[15px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-brand-dark sm:w-auto sm:rounded-full"
              >
                <SearchIcon size={17} /> Search
              </button>
            </div>
          </form>

          <p className="hero-text-shadow mt-5 text-[21px] text-white/70">
            Popular:{" "}
            {["Istanbul", "Antalya", "Ankara", "Cappadocia", "Izmir"].map((c, i) => (
              <Link key={c} href={`/venues?city=${c}`} className="font-medium text-white hover:underline">
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
        </div>
      </section>

      {/* ── 3'LÜ DEĞER ÖNERİSİ (mockup 1) ── */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto grid max-w-5xl gap-10 px-4 py-14 sm:grid-cols-3 sm:px-6">
          {[
            { icon: <MapPinIcon size={36} />, title: "Browse venues", desc: "Explore verified hotels and congress centers across 34 cities in Turkey" },
            { icon: <CalendarIcon size={36} />, title: "Streamline booking", desc: "Request and compare live group offers from multiple venues at once" },
            { icon: <CheckIcon size={36} />, title: "Zero commission", desc: "Completely free for organizers — no hidden fees, no subscription" },
          ].map((f) => (
            <div key={f.title} className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center text-brand">{f.icon}</div>
              <h3 className="mt-2 text-lg font-bold text-ink">{f.title}</h3>
              <p className="mt-1 text-sm text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── POPÜLER MEKANLAR ── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-ink">Popular venues</h2>
            <p className="mt-1 text-sm text-muted">Top-rated meeting hotels across Turkey</p>
          </div>
          <Link href="/venues" className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
            View all <ArrowRightIcon size={15} />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((v) => (
            <VenueCard key={v.id} venue={v} />
          ))}
        </div>
      </section>

      {/* ── DESTİNASYONLAR ── */}
      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
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

      {/* ── HOW IT WORKS ── */}
      <section className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6">
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
      </section>

      {/* ── OTEL CTA ── */}
      <section className="bg-ink">
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
    </>
  );
}
