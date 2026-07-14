/*
 * NASIL ÇALIŞIR — master doküman 3.2.6.
 * Anasayfa görsel diliyle eşitlendi: PageHero (koyu foto + cam rozet)
 * + Reveal animasyonlu adım kartları + anasayfadaki "Trust & advantages"
 * bandının aynısı + marka gradyanlı CTA bölümü.
 */
import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { LinkButton } from "@/components/ui";
import {
  SearchIcon,
  FileTextIcon,
  CheckIcon,
  BarChartIcon,
  EuroIcon,
  TagIcon,
  UsersIcon,
  BuildingIcon,
  ArrowRightIcon,
} from "@/components/ui/icons";

export const metadata = { title: "How It Works — Turmeet" };

const STEPS = [
  {
    icon: <SearchIcon size={22} />,
    title: "Search & discover",
    desc: "Enter your city, dates and group size. Filter 329+ verified venues by capacity, star rating, venue type and facilities. Every listing includes full meeting room specs and real photos.",
  },
  {
    icon: <FileTextIcon size={22} />,
    title: "Request quotes",
    desc: "Select up to 5 venues and send a single quote request. Hotels respond directly on the platform — typically within 24 hours. No emails, no phone calls, no lost threads.",
  },
  {
    icon: <BarChartIcon size={22} />,
    title: "Compare offers",
    desc: "See all offers side by side: room rates, meeting packages, F&B, cancellation terms and option deadlines. Your dedicated Turmeet coordinator helps you negotiate the best terms.",
  },
  {
    icon: <CheckIcon size={22} />,
    title: "Contract & organize",
    desc: "Sign digitally and manage rooming lists, cut-off dates and event details in one workspace. We stay with you until your event is successfully completed.",
  },
];

/* Anasayfa "Trust & advantages" bandıyla aynı içerik — stratejik tutarlılık */
const TRUST = [
  { icon: <EuroIcon size={20} />, title: "Free for organizers", desc: "Commission is paid by the venue after the event — never by you. The quoted price is the final price." },
  { icon: <TagIcon size={20} />, title: "Venues set their own prices", desc: "Turmeet never marks up or interferes with pricing. Hotels quote live — fair competition, real rates." },
  { icon: <FileTextIcon size={20} />, title: "You pay the venue directly", desc: "Turmeet reviews every detail of your contract against national regulations and international standards. Payments go directly to the venue you choose — never to Turmeet. Fully compliant and transparent." },
  { icon: <CheckIcon size={20} />, title: "Verified venues", desc: "Every hotel passes an on-site MICE inspection — capacity, transit access and service quality are checked in person." },
  { icon: <UsersIcon size={20} />, title: "Coordinator support", desc: "Large groups get a dedicated coordinator. 150+ room congresses are fully managed by our expert team." },
  { icon: <BuildingIcon size={20} />, title: "Backed by D Event", desc: "Operated by D Event Turizm — Est. 2012, Istanbul. TURSAB licensed travel agency (No. 7514)." },
];

export default function HowItWorksPage() {
  return (
    <>
      <PublicHeader />

      <PageHero
        image="/images/venue-icc-hall.jpg"
        badge="Turkey's First Meeting & Event Search Engine"
        title="How Turmeet works"
        subtitle="Compare. Choose. Organize. — Group hotel booking for meetings and events, completely free for organizers."
        stats={[
          { value: "24h", label: "Typical response" },
          { value: "5", label: "Venues per request" },
          { value: "0", label: "Cost to organizers" },
          { value: "1", label: "Digital workspace" },
        ]}
      />

      {/* 4 adım — Reveal animasyonlu, anasayfa kart dili */}
      <section className="relative overflow-hidden bg-brand-light py-14">
        <div className="animate-float-slow pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
        <div className="animate-float-slower pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <Reveal className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-brand">Step by step</p>
            <h2 className="mt-2 text-2xl font-bold text-ink">From search to signed contract</h2>
          </Reveal>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 110}>
                <div className="group flex h-full items-start gap-4 rounded-card border border-gray-100 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-lg">
                  <div className="relative shrink-0">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-brand/30 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110">
                      {s.icon}
                    </span>
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] font-bold text-white">
                      {i + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-ink">{s.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{s.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Güven bandı — anasayfa ile aynı kartlar */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-brand">Trust &amp; advantages</p>
            <h2 className="mt-2 text-2xl font-bold text-ink">Why organizers rely on Turmeet</h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TRUST.map((f, i) => (
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
      </section>

      {/* CTA — anasayfa otel bölümüyle aynı marka gradyanı */}
      <section className="animate-gradient-pan relative overflow-hidden bg-gradient-to-br from-brand via-brand-dark to-brand py-14">
        <div className="animate-float-slow pointer-events-none absolute -right-24 top-8 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Reveal>
            <h2 className="text-2xl font-bold text-white">Why is it free for organizers?</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/75">
              Turmeet charges venues a small success fee only when an event is realized — the lowest commission in the
              market. Organizers never pay anything: no subscription, no booking fee, no hidden costs.
            </p>
            <div className="mt-7 flex items-center justify-center gap-4">
              <LinkButton href="/register" variant="secondary" size="lg">
                Start planning — free
              </LinkButton>
              <Link
                href="/venues"
                className="group inline-flex items-center gap-1 text-sm font-semibold text-white/85 hover:text-white hover:underline"
              >
                Browse venues{" "}
                <ArrowRightIcon size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
