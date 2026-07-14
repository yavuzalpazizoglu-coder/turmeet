/*
 * ANASAYFA — onaylı mockup: tam ekran fotoğraflı hero + pill arama çubuğu
 * + 3'lü değer önerisi + istatistikler + popüler mekanlar + destinasyonlar.
 * Kaynak: TURMEET_MASTER_Kurulum.md 3.2.1 + 15.8-A
 */
import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { Footer } from "@/components/layout/Footer";
import HeroSlideshow from "@/components/home/HeroSlideshow";
import HeroSearch from "@/components/home/HeroSearch";
import FeaturedShowcase from "@/components/home/FeaturedShowcase";
import { LinkButton } from "@/components/ui";
import {
  SearchIcon,
  MapPinIcon,
  CalendarIcon,
  UsersIcon,
  BuildingIcon,
  CheckIcon,
  XIcon,
  ArrowRightIcon,
  GridIcon,
  FileTextIcon,
  ClockIcon,
  EuroIcon,
  TagIcon,
  PlaneIcon,
  MonitorIcon,
  StarIcon,
  HomeIcon,
  GlobeIcon,
  BarChartIcon,
} from "@/components/ui/icons";
import { CountUp } from "@/components/ui/CountUp";
import { getVenues, getDestinations } from "@/services";
import { PLATFORM_STATS } from "@/mocks/venues";
import { EVENT_TYPES, BUDGET_SEGMENTS } from "@/lib/mice-criteria";
import { Reveal } from "@/components/ui/Reveal";

export default async function HomePage() {
  const [venues, destinations] = await Promise.all([getVenues(), getDestinations()]);

  /* Vitrin — tüm envanter FeaturedShowcase'e gider; sekme + sıralama orada yapılır */
  const featured = venues;

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
          {/* "Türkiye'nin ilki" rozeti — buzlu cam pill + periyodik ışık süpürmesi */}
          <div className="relative mx-auto mb-4 inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/30 bg-white/10 px-4 py-1.5 backdrop-blur-md">
            <span className="text-[13px] text-amber-300">★</span>
            <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-white sm:text-[13px]">
              Turkey&apos;s First Meeting &amp; Event Search Engine
            </span>
            <span className="animate-shimmer pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>

          <h1 className="hero-text-shadow text-4xl font-bold uppercase tracking-wide text-white sm:text-5xl">
            Plan Your Meeting in Turkey
          </h1>
          {/* Slogan — 3x büyütüldü (24/27px), saf beyaz + bold */}
          <p className="hero-text-shadow mt-3 text-[24px] font-bold uppercase tracking-[0.15em] text-white sm:text-[27px]">
            Compare. Choose. Organize.
          </p>

          {/* Arama kutusu + tıklanabilir Popular chip'leri (HeroSearch, client) */}
          <HeroSearch venues={venues.map((v) => ({ name: v.name, slug: v.slug, city: v.city }))} />

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
              { icon: <CheckIcon size={28} />, title: "Zero commission", desc: "Completely free for organizers\u00A0— no hidden fees, no subscription" },
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

      {/* ── SAYFA 2: ÖNE ÇIKAN MEKANLAR — sekmeli vitrin (FeaturedShowcase) ── */}
      <section id="featured" className="flex min-h-[100dvh] snap-start flex-col justify-center bg-white py-8">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-ink">Featured hotels</h2>
              {/* MD 1.10.1 platform istatistikleri + 1.4 doğrulanmış mekan vaadi */}
              <p className="mt-1 text-sm text-muted">
                329+ verified venues across 34 cities — every property inspected on site and ranked by score
              </p>
            </div>
            <Link href="/venues" className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
              View all <ArrowRightIcon size={15} />
            </Link>
          </div>

          {/* Sekmeler + spotlight + MICE odaklı kartlar (client bileşen) */}
          <FeaturedShowcase venues={featured} />
        </div>
      </section>

      {/* ── SAYFA 3: DESTİNASYONLAR — geniş bant, bento mozaik düzeni ── */}
      <section id="destinations" className="flex min-h-[100dvh] snap-start items-center bg-surface py-10">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-ink">Destinations across Turkey</h2>
              {/* Featured hotels vitriniyle aynı ICCA kategori dili */}
              <p className="mt-1 text-sm text-muted">
                City &amp; conference hotels, resort congress hotels and purpose-built centers — mapped by destination
              </p>
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
              /*
               * Kategori rozetleri — Featured hotels sekmeleriyle aynı ICCA
               * sınıflandırma dili (buzlu cam zemin + kategoriye özel renk noktası).
               */
              const category: Record<string, { label: string; dot: string }> = {
                congress: { label: "Congress & Exhibition Hub", dot: "bg-brand" },
                incentive: { label: "Resort Congress & Incentive", dot: "bg-orange-400" },
                cultural: { label: "Boutique & Retreat", dot: "bg-amber-300" },
                wellness: { label: "Thermal & Mountain Resort", dot: "bg-teal-300" },
              };
              const cat = category[d.category] ?? { label: d.category, dot: "bg-white" };
              return (
                <Link
                  key={d.slug}
                  href={`/venues?city=${encodeURIComponent(d.name)}`}
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
                    {/*
                     * İstatistik rozetleri — buzlu cam chip + sayaç animasyonu.
                     * Değerler MOCK_VENUES envanterinden otomatik hesaplanır;
                     * yeni mekan eklendikçe kendiliğinden artar.
                     */}
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
      {/* Tam sayfa kuralı: içerik 900px yüksekliğe sığacak şekilde sıkılaştırıldı */}
      <section id="why-turmeet" className="relative flex min-h-[100dvh] snap-start flex-col justify-center overflow-hidden py-3">
        {/*
         * AÇIK tema — sitenin iç sayfalarıyla aynı dil: beyazdan yumuşak
         * marka pembesine geçen gradyan + soluk pembe ışık lekeleri.
         */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-brand-light/40 to-white" />
        <div className="animate-float-slow pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
        <div className="animate-float-slower pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-brand/5 blur-3xl" />

        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6">
          {/* ── KUŞAK 1: BAŞLIK — büyük etiket + cümle başlığı ── */}
          <Reveal className="mx-auto max-w-5xl text-center">
            <p className="text-base font-bold uppercase tracking-widest text-brand sm:text-lg">
              Why Turmeet exists
            </p>
            <h2 className="mt-1.5 text-3xl font-bold leading-tight text-ink sm:text-[34px]">
              Getting group quotes from hotels used to take weeks of emails
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-ink/70">
              Turmeet is Turkey&apos;s first meeting &amp; event search engine — quotes made{" "}
              <span className="font-semibold text-ink">transparent</span>,{" "}
              <span className="font-semibold text-ink">fast</span> and{" "}
              <span className="font-semibold text-ink">impartial</span>.
            </p>
          </Reveal>

          {/*
           * ── KUŞAK 2: MÜŞTERİ HİKAYESİ — sayfanın ana gövdesi ──
           * Somut senaryo: 10 otelden grup teklifi. Solda eski yöntem
           * (pastel kırmızı), sağda Turmeet (pastel yeşil, 48h vurgusu).
           */}
          <div className="mx-auto mt-3 max-w-5xl">
            <Reveal delay={60}>
              <p className="text-center text-sm font-semibold text-ink/80">
                Say you need group offers from <span className="font-bold text-ink">10 hotels</span> in Istanbul or
                Antalya.
              </p>
            </Reveal>
            <div className="mt-2.5 grid gap-3 sm:grid-cols-2">
              {/* Eski yöntem — pastel kırmızı kart, kırmızı çarpı maddeler */}
              <Reveal delay={120}>
                <div className="h-full rounded-card border border-red-200 bg-red-50 p-3">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-red-600">The old way</p>
                  <p className="mt-0.5 text-[11px] font-semibold text-red-500">Calculate commission rates on top of it all.</p>
                  <ul className="mt-2 space-y-1.5">
                    {[
                      "Search the web for hotels, gather their details and try to judge their ratings",
                      "Hand the job over to a PCO / DMC and wait for the offers to be collected",
                      "Build your own hotel list, send emails, wait for replies — then manage it all yourself",
                    ].map((t) => (
                      <li key={t} className="flex items-start gap-2 text-[13px] leading-snug text-ink/60">
                        <XIcon size={14} className="mt-0.5 shrink-0 text-red-500" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
              {/* Turmeet — pastel yeşil kart, yeşil tik maddeler */}
              <Reveal delay={200}>
                <div className="relative h-full overflow-hidden rounded-card border border-emerald-300 bg-emerald-50 p-3 shadow-lg shadow-emerald-100">
                  {/* 48 saat vurgusu — kartın sağ üst köşesinde rozet */}
                  <span className="absolute right-3 top-3 rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-black uppercase tracking-wide text-white shadow-md">
                    48h
                  </span>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-700">With Turmeet</p>
                  <p className="mt-0.5 text-[11px] font-semibold text-emerald-600">Zero commission. No subscription.</p>
                  <ul className="mt-2 space-y-1.5">
                    {[
                      "Comparative offers from every hotel you choose — within 48 hours, direct from the hotels",
                      "Fast, reliable decisions based on real hotel budgets",
                      "Extra services and local needs delivered digitally, on request",
                    ].map((t) => (
                      <li key={t} className="flex items-start gap-2 text-[13px] font-medium leading-snug text-ink">
                        <CheckIcon size={14} className="mt-0.5 shrink-0 text-emerald-600" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>

          {/* ── KUŞAK 3: NASIL ÇALIŞIR — 5 adım tek yatay şerit (MD 2.4) ── */}
          <div className="mt-3 border-t border-ink/10 pt-2.5">
            <Reveal delay={100}>
              <p className="text-center text-sm font-bold uppercase tracking-widest text-brand">How it works</p>
            </Reveal>
            <div className="mt-2.5 grid gap-4 sm:grid-cols-5">
              {[
                { n: "1", icon: <SearchIcon size={18} />, title: "Search", desc: "City, dates, group size — filter 329+ venues by MICE criteria" },
                { n: "2", icon: <GridIcon size={18} />, title: "Compare", desc: "Review rooms, halls and reference prices side by side" },
                { n: "3", icon: <FileTextIcon size={18} />, title: "Request quotes", desc: "Send one request to multiple venues at once" },
                { n: "4", icon: <ClockIcon size={18} />, title: "Get live offers", desc: "Hotels reply with live prices — negotiate on platform" },
                { n: "5", icon: <CheckIcon size={18} />, title: "Contract digitally", desc: "E-sign the contract and manage your event online" },
              ].map((s, i) => (
                <Reveal key={s.n} delay={150 + i * 120} className="group relative text-center">
                  {i < 4 && <div className="absolute left-[60%] top-5 hidden h-px w-[80%] bg-ink/10 sm:block" />}
                  <div className="relative mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-brand/30 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110">
                    {s.icon}
                  </div>
                  <h3 className="mt-1.5 text-[14px] font-bold text-ink">
                    {s.n}. {s.title}
                  </h3>
                  <p className="mt-0.5 text-[11px] leading-snug text-ink/55">{s.desc}</p>
                </Reveal>
              ))}
            </div>
          </div>

          {/* ── KUŞAK 4: Güvenilirlik & avantajlar — iş modeli prensipleri (MD 2.2) ── */}
          <div className="mt-2.5 border-t border-ink/10 pt-2.5">
            <Reveal delay={100}>
              <p className="text-center text-sm font-bold uppercase tracking-widest text-brand">Trust &amp; advantages</p>
            </Reveal>
            <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: <EuroIcon size={16} />, title: "Free for organizers", desc: "Commission is paid by the venue after the event — never by you. The quoted price is the final price." },
                { icon: <TagIcon size={16} />, title: "Venues set their own prices", desc: "Turmeet never marks up or interferes with pricing. Hotels quote live — fair competition, real rates." },
                { icon: <FileTextIcon size={16} />, title: "You pay the venue directly", desc: "Turmeet reviews every detail of your contract against national regulations and international standards. Payments go directly to the venue you choose — never to Turmeet. Fully compliant and transparent." },
                { icon: <CheckIcon size={16} />, title: "Verified venues", desc: "Every hotel passes the D Event MICE inspection — capacity, transit access and service quality are checked on site." },
                { icon: <UsersIcon size={16} />, title: "Coordinator support", desc: "For events above 150 guests or rooms, a dedicated coordinator — or a full team, at your request — is assigned to you and follows your event end to end, just like a classic PCO." },
                { icon: <BuildingIcon size={16} />, title: "Backed by D Event", desc: "Operated by D Event Turizm — Est. 2012, Istanbul. TURSAB licensed travel agency (No. 7514), zero fault tolerance." },
              ].map((f, i) => (
                <Reveal key={f.title} delay={i * 90}>
                  <div className="group flex h-full items-start gap-2.5 rounded-card border border-gray-200 bg-white p-2 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-lg hover:shadow-brand/10">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                      {f.icon}
                    </span>
                    <div>
                      <h3 className="text-[13px] font-bold text-ink">{f.title}</h3>
                      <p className="mt-0.5 text-[10px] leading-snug text-ink/60">{f.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={200} className="mt-2.5 flex items-center justify-center gap-4">
            <LinkButton href="/register">
              Get started — it&apos;s free
            </LinkButton>
            <Link href="/how-it-works" className="group inline-flex items-center gap-1 text-sm font-semibold text-ink/70 hover:text-brand hover:underline">
              Learn more <ArrowRightIcon size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/*
       * ── SAYFA 5: OTEL CTA — "Neden bizimle çalışsın?" ──
       * Otel kimliği: SİNEMATİK fotoğraf zemin — dolu kongre salonu +
       * marka pembesi/koyu degrade overlay (hero ve PageHero diliyle aynı).
       * Açık temalı "Why Turmeet exists" bölümünden tamamen ayrışır.
       * Yapı: başlık → envanter istatistikleri (CountUp) → ortaklık adımları
       * → avantaj kartları (fuar katılımı dahil) → dijital pazarlama ağı
       * çağrısı. Komisyon oranı gösterilmez (MD 1046 kuralı).
       */}
      <section id="list-your-venue" className="relative flex min-h-[100dvh] snap-start flex-col justify-center overflow-hidden py-3">
        {/* Fotoğraf zemin: gala düzeninde otel balo salonu (avizeler + pembe
            ışıklandırma — marka rengiyle uyumlu) + okunabilirlik overlay'i */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/venue-grand-ballroom.jpg"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover brightness-[0.45]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/65" />
        <div className="absolute inset-0 bg-gradient-to-tr from-brand/25 via-transparent to-transparent" />

        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6">
          {/* ── KUŞAK 1: BAŞLIK — otele doğrudan hitap ── */}
          <Reveal className="mx-auto max-w-5xl text-center">
            <p className="inline-flex items-center justify-center gap-2 text-base font-bold uppercase tracking-widest text-brand-light sm:text-lg">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-white shadow-md shadow-brand/40 ring-1 ring-white/25">
                <BuildingIcon size={15} />
              </span>
              List your venue on Turmeet
            </p>
            <h2 className="mt-1.5 text-3xl font-bold leading-tight text-white sm:text-[34px]">
              Put your halls in front of the world&apos;s event buyers
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-white/75">
              Join Turkey&apos;s largest MICE inventory — international group demand,{" "}
              <span className="font-semibold text-white">zero upfront cost</span>, and you{" "}
              <span className="font-semibold text-white">pay only on success</span>.
            </p>
          </Reveal>

          {/* ── KUŞAK 2: ENVANTER İSTATİSTİKLERİ — CountUp'lı altın rakamlar ── */}
          <div className="mx-auto mt-3 grid max-w-5xl grid-cols-2 gap-2.5 sm:grid-cols-5">
            {[
              { value: 329, suffix: "+", label: "Partner venues" },
              { value: 89000, suffix: "+", label: "Rooms listed" },
              { value: 2500, suffix: "+", label: "Meeting halls" },
              { value: 34, suffix: "", label: "Cities in Turkey" },
              { value: 4, suffix: "", label: "Continents of demand" },
            ].map((s, i) => (
              <Reveal key={s.label} delay={80 + i * 90}>
                <div className="rounded-card border border-white/20 bg-white/10 px-3 py-2.5 text-center backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/50 hover:bg-white/15">
                  <p className="bg-gradient-to-r from-white to-brand-light bg-clip-text text-2xl font-black text-transparent">
                    <CountUp value={s.value} />
                    {s.suffix}
                  </p>
                  <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-white/60">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* ── KUŞAK 3: ORTAKLIK NASIL İŞLER — 5 adım tek yatay şerit ── */}
          <div className="mt-3 border-t border-white/10 pt-2.5">
            <Reveal delay={100}>
              <p className="text-center text-sm font-bold uppercase tracking-widest text-brand-light">How partnership works</p>
            </Reveal>
            <div className="mt-2.5 grid gap-4 sm:grid-cols-5">
              {[
                { n: "1", icon: <FileTextIcon size={18} />, title: "Apply", desc: "Submit your venue application — our team verifies it with you" },
                { n: "2", icon: <BuildingIcon size={18} />, title: "Create your profile", desc: "Photos, halls, room types and capacities" },
                { n: "3", icon: <UsersIcon size={18} />, title: "Receive requests", desc: "Structured quote requests matched to your capacity" },
                { n: "4", icon: <ClockIcon size={18} />, title: "Quote live prices", desc: "Reply with your group offer within your SLA" },
                { n: "5", icon: <CheckIcon size={18} />, title: "Win & host", desc: "Host the group — commission only after realization" },
              ].map((s, i) => (
                <Reveal key={s.n} delay={150 + i * 120} className="group relative text-center">
                  {i < 4 && <div className="absolute left-[60%] top-5 hidden h-px w-[80%] bg-white/15 sm:block" />}
                  {/* Otel kimliği: köşeli plaka, marka pembesi */}
                  <div className="relative mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white shadow-lg shadow-brand/40 ring-1 ring-white/25 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110">
                    {s.icon}
                  </div>
                  <h3 className="mt-1.5 text-[14px] font-bold text-white">
                    {s.n}. {s.title}
                  </h3>
                  <p className="mt-0.5 text-[11px] leading-snug text-white/60">{s.desc}</p>
                </Reveal>
              ))}
            </div>
          </div>

          {/* ── KUŞAK 4: Ortak avantajları — fuar katılımı dahil 8 kompakt kart ── */}
          <div className="mt-2.5 border-t border-white/10 pt-2.5">
            <Reveal delay={100}>
              <p className="text-center text-sm font-bold uppercase tracking-widest text-brand-light">Partner advantages</p>
            </Reveal>
            <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: <EuroIcon size={16} />, title: "Lowest commission", desc: "No listing fee, no subscription, no upfront cost. Invoiced only after the event is realized." },
                { icon: <PlaneIcon size={16} />, title: "International demand", desc: "B2B organizers from Europe, the UK, North America and the Middle East — congresses, incentives, meetings." },
                { icon: <TagIcon size={16} />, title: "You stay in control", desc: "Your own live prices, your own contract. The client pays you directly — Turmeet never holds the money." },
                { icon: <UsersIcon size={16} />, title: "Qualified corporate leads", desc: "Every quote request comes from a verified company, agency or PCO. No individual bookings." },
                { icon: <GlobeIcon size={16} />, title: "Global fair presence", desc: "Turmeet exhibits at international MICE fairs — partner venues are showcased to global buyers at no extra cost." },
                { icon: <MonitorIcon size={16} />, title: "Digital partner panel", desc: "Quote requests, live pricing, contracts, messaging, reports and promotions — all in one place." },
                { icon: <StarIcon size={16} />, title: "Sponsorship & visibility", desc: "Sponsored placement above organic results, showcase tags and ranking backed by your MICE inspection score." },
                { icon: <BarChartIcon size={16} />, title: "Market insights", desc: "Demand reports and performance analytics for your destination — see where your next group comes from." },
              ].map((f, i) => (
                <Reveal key={f.title} delay={i * 70}>
                  <div className="group flex h-full items-start gap-2.5 rounded-card border border-white/20 bg-white/10 p-2 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/50 hover:bg-white/15 hover:shadow-xl hover:shadow-black/20">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white text-brand transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                      {f.icon}
                    </span>
                    <div>
                      <h3 className="text-[13px] font-bold text-white">{f.title}</h3>
                      <p className="mt-0.5 text-[10px] leading-snug text-white/60">{f.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* ── KUŞAK 5: DİJİTAL PAZARLAMA AĞI ÇAĞRISI + CTA ── */}
          <Reveal delay={150}>
            <div className="mx-auto mt-2.5 flex max-w-5xl flex-col items-center gap-3 rounded-card border border-white/25 bg-gradient-to-r from-brand/40 via-brand/20 to-white/10 p-3 shadow-lg shadow-black/30 backdrop-blur-md sm:flex-row sm:justify-between">
              <div className="text-center sm:text-left">
                <p className="text-[15px] font-bold text-white">Join the Turmeet digital marketing network</p>
                <p className="mt-0.5 text-xs leading-snug text-white/65">
                  Destination campaigns, buyer newsletters, social showcases and international fair stands — your venue
                  promoted to thousands of corporate planners worldwide.
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                {/* Fotoğraf üzerinde en güçlü kontrast: beyaz zemin + pembe yazı */}
                <Link
                  href="/register/hotel"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-white px-5 py-2.5 text-sm font-bold text-brand shadow-lg shadow-black/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-light hover:shadow-xl"
                >
                  List Your Venue — Free
                </Link>
                <Link href="/login" className="group inline-flex items-center gap-1 whitespace-nowrap text-sm font-semibold text-white/85 hover:text-white hover:underline">
                  Partner Login <ArrowRightIcon size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/*
       * Footer — snap kapsayıcısının İÇİNDE, snap-end hedefi olarak durur.
       * Dışarıda (layout'ta) kalsaydı zorunlu snap yüzünden kaydırınca
       * erişilemiyordu; içeride son sayfadan sonra doğal olarak görünür.
       */}
      <div className="snap-end">
        <Footer />
      </div>
    </div>
  );
}
