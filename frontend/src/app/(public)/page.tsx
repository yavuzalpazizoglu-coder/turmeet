/*
 * ANASAYFA — onaylı mockup: tam ekran fotoğraflı hero + pill arama çubuğu
 * + 3'lü değer önerisi + istatistikler + popüler mekanlar + destinasyonlar.
 * Kaynak: TURMEET_MASTER_Kurulum.md 3.2.1 + 15.8-A
 */
import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import HeroSlideshow from "@/components/home/HeroSlideshow";
import HeroSearch from "@/components/home/HeroSearch";
import { LinkButton } from "@/components/ui";
import {
  SearchIcon,
  MapPinIcon,
  CalendarIcon,
  UsersIcon,
  BuildingIcon,
  CheckIcon,
  ArrowRightIcon,
  GridIcon,
  FileTextIcon,
  ClockIcon,
  EuroIcon,
  TagIcon,
  PlaneIcon,
  MonitorIcon,
  StarIcon,
} from "@/components/ui/icons";
import { getVenues, getDestinations } from "@/services";
import { PLATFORM_STATS } from "@/mocks/venues";
import { EVENT_TYPES, BUDGET_SEGMENTS } from "@/lib/mice-criteria";
import { tagDef } from "@/lib/venue-tags";
import { Reveal } from "@/components/ui/Reveal";

export default async function HomePage() {
  const [venues, destinations] = await Promise.all([getVenues(), getDestinations()]);

  /* Vitrin — en az 15 otel, sade tek tip kart (sıralama: sponsor > MICE puanı > rating) */
  const featured = venues.slice(0, 15);

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

          {/* Arama kutusu — aktif öneri menüsü + tarih seçici (HeroSearch, client) */}
          <HeroSearch venues={venues.map((v) => ({ name: v.name, slug: v.slug, city: v.city }))} />

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
              <p className="mt-1 text-sm text-muted">Top meeting hotels across Turkey — ranked by MICE inspection score</p>
            </div>
            <Link href="/venues" className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
              View all <ArrowRightIcon size={15} />
            </Link>
          </div>

          {/*
           * Sade vitrin: 15 otel, tek tip kompakt kart — görsel + tek etiket
           * + isim + şehir/yıldız + fiyat. Etiketler Staff panelinden atanır.
           */}
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
            {featured.map((v) => {
              const tag = v.showcaseTags[0];
              const d = tag ? tagDef(tag) : null;
              return (
                <Link
                  key={v.id}
                  href={`/venues/${v.slug}`}
                  className="group overflow-hidden rounded-card border border-gray-100 bg-white shadow-card transition-shadow hover:shadow-lg"
                >
                  <div className="relative h-28 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={v.imageUrl}
                      alt={v.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {d && (
                      <span className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${d.chipClass}`}>
                        {d.labelEn}
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="truncate text-sm font-bold text-ink group-hover:text-brand">{v.name}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {v.city} · {"★".repeat(v.stars)}
                    </p>
                    {v.referencePrice !== null && (
                      <p className="mt-1 text-sm font-bold text-brand">
                        € {v.referencePrice} <span className="text-[10px] font-normal text-muted">/night</span>
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SAYFA 3: DESTİNASYONLAR — geniş bant, bento mozaik düzeni ── */}
      <section className="flex min-h-[100dvh] snap-start items-center bg-surface py-10">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-ink">Destinations across Turkey</h2>
              <p className="mt-1 text-sm text-muted">From congress cities to boutique retreats</p>
            </div>
            <Link href="/destinations" className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
              All destinations <ArrowRightIcon size={15} />
            </Link>
          </div>

          {/*
           * Bento düzeni: Istanbul 2x2 büyük kart, Antalya geniş, diğerleri
           * karışık boyut — çeşitlilik için her kart farklı ağırlıkta.
           */}
          <div className="grid auto-rows-[190px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {destinations.slice(0, 6).map((d, i) => {
              const span =
                i === 0
                  ? "lg:col-span-2 lg:row-span-2 sm:col-span-2"
                  : i === 1
                    ? "lg:col-span-2"
                    : i >= 4
                      ? "lg:col-span-2"
                      : "";
              /* Kategori rozetleri — buzlu cam zemin + kategoriye özel renk noktası */
              const category: Record<string, { label: string; dot: string }> = {
                congress: { label: "Congress City", dot: "bg-brand" },
                incentive: { label: "Incentive & Resort", dot: "bg-orange-400" },
                cultural: { label: "Cultural Retreat", dot: "bg-amber-300" },
                wellness: { label: "Thermal & Wellness", dot: "bg-teal-300" },
              };
              const cat = category[d.category] ?? { label: d.category, dot: "bg-white" };
              return (
                <Link
                  key={d.slug}
                  href={`/destinations/${d.slug}`}
                  className={`group relative overflow-hidden rounded-card ${span}`}
                >
                  {/* Fotoğraf — canlılık filtresi + hover'da yakınlaşma ve aydınlanma */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={d.imageUrl}
                    alt={d.name}
                    className="h-full w-full object-cover brightness-[1.05] contrast-[1.06] saturate-[1.25] transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/5" />
                  {/* Hover ışıltı süpürmesi — karta gelince soldan sağa parlama geçer */}
                  <div className="pointer-events-none absolute inset-0 -translate-x-[130%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[130%]" />

                  {/* Kategori rozeti — koyu buzlu cam + renk noktası + ince beyaz çerçeve */}
                  <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-md border border-white/25 bg-black/35 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white shadow-sm backdrop-blur-md">
                    <span className={`h-1.5 w-1.5 rounded-full ${cat.dot}`} />
                    {cat.label}
                  </span>

                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <p className={`font-bold ${i === 0 ? "text-3xl" : "text-xl"}`}>{d.name}</p>
                    <p className={`mt-0.5 text-white/85 ${i === 0 ? "text-sm" : "text-xs"}`}>{d.tagline}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-white/90">
                      <span className="inline-flex items-center gap-1">
                        <BuildingIcon size={13} /> {d.venueCount} venues
                      </span>
                      <span>{d.totalRooms.toLocaleString("en-US")} rooms</span>
                      <span className="ml-auto inline-flex items-center gap-1 font-semibold opacity-0 transition-opacity group-hover:opacity-100">
                        Explore <ArrowRightIcon size={13} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/*
       * ── SAYFA 4: HOW IT WORKS — MD kaynaklı zengin içerik ──
       * Kaynak: TURMEET_MASTER_Kurulum.md 1.1 (misyon/neden), 2.4 (ortak akış),
       * 2.2 (iş modeli prensipleri = güven), 1.4-1.5 (değerler & vaatler).
       * Komisyon oranı bilinçli olarak gösterilmez (MD 3.2 /pricing kuralı).
       */}
      <section className="relative flex min-h-[100dvh] snap-start flex-col justify-center overflow-hidden bg-brand-light py-12">
        {/* Dekoratif yüzen ışık lekeleri */}
        <div className="animate-float-slow pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
        <div className="animate-float-slower pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
          {/* Neden Turmeet var? */}
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-brand">Why Turmeet exists</p>
            <h2 className="mt-2 text-2xl font-bold text-ink">
              Getting group quotes from hotels used to take weeks of emails
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Turmeet is Turkey&apos;s first meeting &amp; event search engine. We digitalize the quote process for
              congresses, corporate meetings, incentives and retreats — making it{" "}
              <span className="font-semibold text-ink">transparent</span> (live prices, no hidden costs),{" "}
              <span className="font-semibold text-ink">fast</span> (instant comparative offers) and{" "}
              <span className="font-semibold text-ink">impartial</span> (venues compete, you choose).
            </p>

            {/*
             * Türkiye'nin ikonik kongre mekanları — 3 polaroid kart + isim etiketi.
             * Görseller: Wikimedia Commons (1400px'e küçültülmüş yerel kopya).
             */}
            <div className="mt-6 flex items-center justify-center gap-3">
              {[
                {
                  src: "/images/venue-lutfi-kirdar.jpg",
                  alt: "Istanbul Lütfi Kırdar Convention and Exhibition Centre",
                  label: "Lütfi Kırdar ICEC · Istanbul",
                  rotate: "-rotate-3",
                },
                {
                  src: "/images/venue-halic-congress.jpg",
                  alt: "Haliç Congress Center on the Golden Horn, Istanbul",
                  label: "Haliç Congress Center",
                  rotate: "rotate-2",
                },
                {
                  src: "/images/venue-regnum-carya.jpg",
                  alt: "Regnum Carya resort and convention venue, Antalya",
                  label: "Regnum Carya · Antalya",
                  rotate: "-rotate-2",
                },
              ].map((p) => (
                <figure
                  key={p.src}
                  className={`group relative overflow-hidden rounded-xl shadow-lg ring-4 ring-white transition-transform duration-300 hover:rotate-0 hover:scale-110 ${p.rotate}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.src} alt={p.alt} loading="lazy" className="h-20 w-28 object-cover sm:h-24 sm:w-32" />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-1.5 pb-1 pt-4 text-center text-[8px] font-semibold leading-tight text-white sm:text-[9px]">
                    {p.label}
                  </figcaption>
                </figure>
              ))}
            </div>
          </Reveal>

          {/* Nasıl çalışıyor? — 5 adımlı ortak akış (MD 2.4) */}
          <div className="mt-10">
            <Reveal delay={100}>
              <p className="text-center text-xs font-bold uppercase tracking-widest text-brand">How it works</p>
            </Reveal>
            <div className="mt-5 grid gap-6 sm:grid-cols-5">
              {[
                { n: "1", icon: <SearchIcon size={18} />, title: "Search", desc: "City, dates, group size — filter 329+ venues by MICE criteria" },
                { n: "2", icon: <GridIcon size={18} />, title: "Compare", desc: "Review rooms, halls and reference prices side by side" },
                { n: "3", icon: <FileTextIcon size={18} />, title: "Request quotes", desc: "Send one request to multiple venues at once" },
                { n: "4", icon: <ClockIcon size={18} />, title: "Get live offers", desc: "Hotels reply with live prices — negotiate on platform" },
                { n: "5", icon: <CheckIcon size={18} />, title: "Contract digitally", desc: "E-sign the contract and manage your event online" },
              ].map((s, i) => (
                <Reveal key={s.n} delay={150 + i * 120} className="group relative text-center">
                  {i < 4 && <div className="absolute left-[60%] top-6 hidden h-px w-[80%] bg-brand/15 sm:block" />}
                  <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-brand/30 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110">
                    {s.icon}
                  </div>
                  <h3 className="mt-3 text-[15px] font-bold text-ink">
                    {s.n}. {s.title}
                  </h3>
                  <p className="mt-1 text-xs leading-snug text-muted">{s.desc}</p>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Güvenilirlik & avantajlar — iş modeli prensipleri (MD 2.2) */}
          <div className="mt-10">
            <Reveal delay={100}>
              <p className="text-center text-xs font-bold uppercase tracking-widest text-brand">Trust &amp; advantages</p>
            </Reveal>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: <EuroIcon size={20} />, title: "Free for organizers", desc: "Commission is paid by the venue after the event — never by you. The quoted price is the final price." },
                { icon: <TagIcon size={20} />, title: "Venues set their own prices", desc: "Turmeet never marks up or interferes with pricing. Hotels quote live — fair competition, real rates." },
                { icon: <FileTextIcon size={20} />, title: "You pay the venue directly", desc: "Turmeet never holds your money and is not a party to your contract. We provide the digital infrastructure." },
                { icon: <CheckIcon size={20} />, title: "Verified venues", desc: "Every hotel passes the D Event MICE inspection — capacity, transit access and service quality are checked on site." },
                { icon: <UsersIcon size={20} />, title: "Coordinator support", desc: "Large groups get a dedicated coordinator. 150+ room congresses are fully managed by our expert team." },
                { icon: <BuildingIcon size={20} />, title: "Backed by D Event", desc: "Operated by D Event Turizm — Est. 2012, Istanbul. TURSAB licensed travel agency (No. 7514), zero fault tolerance." },
              ].map((f, i) => (
                <Reveal key={f.title} delay={i * 90}>
                  <div className="group flex h-full items-start gap-3 rounded-card border border-gray-100 bg-white p-4 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-lg">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-light text-brand transition-transform duration-300 group-hover:scale-110 group-hover:bg-brand group-hover:text-white">
                      {f.icon}
                    </span>
                    <div>
                      <h3 className="text-[15px] font-bold text-ink">{f.title}</h3>
                      <p className="mt-0.5 text-xs leading-snug text-muted">{f.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={200} className="mt-8 flex items-center justify-center gap-4">
            <LinkButton href="/register" size="lg">
              Get started — it&apos;s free
            </LinkButton>
            <Link href="/how-it-works" className="group inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
              Learn more <ArrowRightIcon size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/*
       * ── SAYFA 5: OTEL CTA — "Neden bizimle çalışsın?" ──
       * Kaynak: TURMEET_MASTER_Kurulum.md 1.5 (otele vaat), 2.2 (iş modeli),
       * 3.2 /for-hotels (avantajlar + 3 adım), 2.5/6.7 (sponsorluk).
       * Komisyon oranı gösterilmez (MD 1046 kuralı) — "lowest commission".
       */}
      <section className="relative flex min-h-[100dvh] snap-start items-center overflow-hidden bg-gradient-to-br from-brand via-brand-dark to-brand py-12 animate-gradient-pan">
        {/* Dekoratif yüzen ışık lekeleri */}
        <div className="animate-float-slow pointer-events-none absolute -right-24 top-12 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="animate-float-slower pointer-events-none absolute -left-20 bottom-8 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

        <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
          <Reveal className="mx-auto max-w-3xl text-center">
            <BuildingIcon size={34} className="mx-auto text-white" />
            <h2 className="mt-3 text-2xl font-bold text-white">List your venue on Turmeet</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              Why should a hotel or congress center work with us? Guaranteed international group bookings at the
              lowest commission in the market — zero upfront cost, pay only for realized events.
            </p>

          </Reveal>

          {/*
           * Kayda özendirici görsel şerit — otelin kazanacağı sonuçları gösterir:
           * dolu kongre salonu, uluslararası sahne, vitrine çıkan tesis.
           * Her kartta gradyan üzerine fayda mesajı yazılıdır.
           */}
          <Reveal delay={100}>
            <div className="mx-auto mt-8 grid max-w-4xl gap-4 sm:grid-cols-3">
              {[
                {
                  src: "/images/meeting-3.jpg",
                  alt: "Packed conference audience",
                  title: "Fill your halls",
                  desc: "Group bookings that occupy hundreds of rooms at once",
                },
                {
                  src: "/images/meeting-4.jpg",
                  alt: "International keynote on a large stage",
                  title: "Host global events",
                  desc: "Congresses and incentives from 4 continents",
                },
                {
                  src: "/images/hotel-1.jpg",
                  alt: "Prestigious hotel illuminated at dusk",
                  title: "Get discovered",
                  desc: "Your venue in front of verified corporate buyers",
                },
              ].map((p, i) => (
                <div
                  key={p.src}
                  className={`group relative h-44 overflow-hidden rounded-2xl shadow-lg shadow-black/25 ring-1 ring-white/25 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:ring-white/60 ${
                    i === 1 ? "sm:-mt-3 sm:h-[188px]" : ""
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.src}
                    alt={p.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-left">
                    <p className="text-[15px] font-bold text-white">{p.title}</p>
                    <p className="mt-0.5 text-xs leading-snug text-white/75">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Avantajlar — 6 kart */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <EuroIcon size={20} />,
                title: "Lowest commission in the market",
                desc: "No listing fee, no subscription, no upfront cost. You are invoiced only after the event is realized.",
              },
              {
                icon: <PlaneIcon size={20} />,
                title: "International group demand",
                desc: "B2B organizers from Europe, the UK, North America and the Middle East — congresses, incentives and corporate meetings.",
              },
              {
                icon: <TagIcon size={20} />,
                title: "You stay in control",
                desc: "You set your own live prices and use your own contract. The client pays you directly — Turmeet never holds the money.",
              },
              {
                icon: <UsersIcon size={20} />,
                title: "Qualified corporate leads",
                desc: "Corporate-only platform: every quote request comes from a verified company, agency or PCO. No individual bookings.",
              },
              {
                icon: <MonitorIcon size={20} />,
                title: "Digital partner panel",
                desc: "Quote requests, live pricing, contracts, messaging, reports and promotions — managed in one place at turmeet.com/partner.",
              },
              {
                icon: <StarIcon size={20} />,
                title: "Sponsorship & visibility",
                desc: "Sponsored placement above organic results, showcase tags and premium ranking backed by your MICE inspection score.",
              },
            ].map((f, i) => (
              <Reveal key={f.title} delay={i * 90}>
                <div className="group flex h-full items-start gap-3 rounded-card border border-white/15 bg-white/10 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-white/40 hover:bg-white/15 hover:shadow-xl hover:shadow-black/10">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-brand transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    {f.icon}
                  </span>
                  <div>
                    <h3 className="text-[15px] font-bold text-white">{f.title}</h3>
                    <p className="mt-0.5 text-xs leading-snug text-white/65">{f.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Nasıl başlanır — 3 adım (MD /for-hotels) */}
          <Reveal delay={200} className="mt-8 flex flex-col items-center gap-5 sm:flex-row sm:justify-center">
            {[
              { n: "1", label: "Apply", desc: "Submit your venue application" },
              { n: "2", label: "Create your profile", desc: "Photos, halls, room types, capacities" },
              { n: "3", label: "Receive quote requests", desc: "Reply with live prices, win events" },
            ].map((s, i) => (
              <div key={s.n} className="group flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white ring-1 ring-white/20 transition-all duration-300 group-hover:bg-white group-hover:text-brand">
                  {s.n}
                </span>
                <div>
                  <p className="text-sm font-bold text-white">{s.label}</p>
                  <p className="text-xs text-white/60">{s.desc}</p>
                </div>
                {i < 2 && <ArrowRightIcon size={16} className="ml-2 hidden text-white/40 sm:block" />}
              </div>
            ))}
          </Reveal>

          <Reveal delay={300} className="mt-8 flex items-center justify-center gap-4">
            <LinkButton href="/register/hotel" variant="secondary" size="lg">
              List Your Venue
            </LinkButton>
            <Link href="/login" className="text-sm font-semibold text-white/80 hover:text-white hover:underline">
              Partner Login
            </Link>
          </Reveal>

          {/*
           * Güven & sertifika bandı — sayfa güvenilirliği için küçük yazılı
           * rozetler. Kaynak: MD 3.2.1b footer güven bandı (TURSAB 7514, ICVB,
           * Est. 2012) + platform güvenlik prensipleri (e-sign, KVKK/GDPR).
           */}
          <Reveal delay={400}>
            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/15 pt-6 text-left sm:grid-cols-3 lg:grid-cols-5">
              {[
                { title: "TURSAB No. 7514", desc: "Licensed travel agency, Turkey" },
                { title: "ICVB Member", desc: "Istanbul Convention & Visitors Bureau" },
                { title: "ICCA / IAPCO Standards", desc: "Venues verified by on-site MICE inspection" },
                { title: "KVKK & GDPR", desc: "Your data is protected — B2B privacy, no public links" },
                { title: "Est. 2012 · Istanbul", desc: "Operated by D Event Tourism Organization Services Inc." },
              ].map((c) => (
                <div key={c.title} className="flex items-start gap-2">
                  <CheckIcon size={13} className="mt-0.5 shrink-0 text-white/80" />
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-white/90">{c.title}</p>
                    <p className="mt-0.5 text-[10px] leading-snug text-white/55">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
