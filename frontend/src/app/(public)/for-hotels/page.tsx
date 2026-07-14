/*
 * OTELLER İÇİN — partner kazanım sayfası, master doküman 3.2.7.
 * Anasayfa "List your venue" bölümüyle aynı görsel dil: PageHero (gerçek
 * kongre salonu fotoğrafı) + marka gradyanlı gövde + buzlu cam avantaj
 * kartları + fayda odaklı fotoğraf şeridi + güven bandı.
 */
import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { LinkButton } from "@/components/ui";
import {
  CheckIcon,
  EuroIcon,
  UsersIcon,
  TagIcon,
  PlaneIcon,
  MonitorIcon,
  StarIcon,
  GlobeIcon,
  BarChartIcon,
  ArrowRightIcon,
} from "@/components/ui/icons";

export const metadata = { title: "For Hotels — Turmeet" };

/* Anasayfa "Partner advantages" kuşağıyla birebir aynı 8 avantaj */
const BENEFITS = [
  {
    icon: <EuroIcon size={20} />,
    title: "Lowest commission",
    desc: "No listing fee, no subscription, no upfront cost. Invoiced only after the event is realized.",
  },
  {
    icon: <PlaneIcon size={20} />,
    title: "International demand",
    desc: "B2B organizers from Europe, the UK, North America and the Middle East — congresses, incentives, meetings.",
  },
  {
    icon: <TagIcon size={20} />,
    title: "You stay in control",
    desc: "Your own live prices, your own contract. The client pays you directly — Turmeet never holds the money.",
  },
  {
    icon: <UsersIcon size={20} />,
    title: "Qualified corporate leads",
    desc: "Every quote request comes from a verified company, agency or PCO. No individual bookings.",
  },
  {
    icon: <GlobeIcon size={20} />,
    title: "Global fair presence",
    desc: "Turmeet exhibits at international MICE fairs — partner venues are showcased to global buyers at no extra cost.",
  },
  {
    icon: <MonitorIcon size={20} />,
    title: "Digital partner panel",
    desc: "Quote requests, live pricing, contracts, messaging, reports and promotions — all in one place.",
  },
  {
    icon: <StarIcon size={20} />,
    title: "Sponsorship & visibility",
    desc: "Sponsored placement above organic results, showcase tags and ranking backed by your MICE inspection score.",
  },
  {
    icon: <BarChartIcon size={20} />,
    title: "Market insights",
    desc: "Demand reports and performance analytics for your destination — see where your next group comes from.",
  },
];

export default function ForHotelsPage() {
  return (
    <>
      <PublicHeader />

      <PageHero
        image="/images/venue-icc-istanbul.jpg"
        badge="329+ Partner Venues · 34 Cities"
        title="Put your halls in front of the world's event buyers"
        subtitle="Join Turkey's largest MICE inventory — international group demand, zero upfront cost, and you pay only on success."
        stats={[
          { value: "89,600+", label: "Rooms listed" },
          { value: "2,580+", label: "Meeting halls" },
          { value: "4", label: "Continents of demand" },
          { value: "0", label: "Upfront cost" },
        ]}
      >
        <LinkButton href="/register/hotel" size="lg">
          List Your Venue — Free
        </LinkButton>
      </PageHero>

      {/* Marka gradyanlı gövde — anasayfa otel bölümüyle aynı zemin */}
      <section className="animate-gradient-pan relative overflow-hidden bg-gradient-to-br from-brand via-brand-dark to-brand py-14">
        <div className="animate-float-slow pointer-events-none absolute -right-24 top-12 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="animate-float-slower pointer-events-none absolute -left-20 bottom-8 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

        <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
          {/* Fayda odaklı fotoğraf şeridi — anasayfa ile aynı */}
          <Reveal>
            <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-3">
              {[
                {
                  src: "/images/venue-icc-hall.jpg",
                  alt: "Packed event at Istanbul Congress Hall",
                  title: "Fill your halls",
                  desc: "Group bookings that occupy hundreds of rooms at once — Istanbul Congress Center",
                },
                {
                  src: "/images/venue-lutfi-kirdar.jpg",
                  alt: "Lütfi Kırdar Convention Centre, Istanbul",
                  title: "Host global events",
                  desc: "Congresses and incentives from 4 continents — Lütfi Kırdar ICEC",
                },
                {
                  src: "/images/venue-ciragan-palace.jpg",
                  alt: "Çırağan Palace on the Bosphorus, Istanbul",
                  title: "Get discovered",
                  desc: "Your venue in front of verified corporate buyers — Çırağan Palace, Bosphorus",
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

          {/* Avantajlar — buzlu cam kartlar (anasayfa ile aynı) */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((f, i) => (
              <Reveal key={f.title} delay={i * 90}>
                <div className="group flex h-full items-start gap-3 rounded-card border border-white/15 bg-white/10 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-white/40 hover:bg-white/15 hover:shadow-xl hover:shadow-black/10">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-brand transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
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

          {/* Ortaklık nasıl işler — anasayfayla aynı 5 adım */}
          <Reveal delay={150}>
            <div className="mx-auto mt-10 max-w-3xl rounded-card border border-white/15 bg-white/10 p-6 backdrop-blur-sm">
              <h2 className="text-lg font-bold text-white">How partnership works</h2>
              <ul className="mt-4 space-y-3">
                {[
                  "Apply — submit your venue application; our team verifies it with you.",
                  "Create your profile — photos, halls, room types and capacities.",
                  "Receive requests — structured quote requests matched to your capacity.",
                  "Quote live prices — reply with your group offer within your SLA.",
                  "Win & host — host the group; commission only after realization.",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/85">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15 text-[11px] font-bold text-white ring-1 ring-white/25">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center gap-4">
                <LinkButton href="/register/hotel" variant="secondary">
                  Apply now
                </LinkButton>
                <Link
                  href="/login"
                  className="group inline-flex items-center gap-1 text-sm font-semibold text-white/80 hover:text-white hover:underline"
                >
                  Partner Login{" "}
                  <ArrowRightIcon size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Dijital pazarlama ağı çağrısı — anasayfa kuşağıyla aynı mesaj */}
          <Reveal delay={200}>
            <div className="mx-auto mt-6 flex max-w-3xl flex-col items-center gap-3 rounded-card border border-white/25 bg-white/10 p-4 backdrop-blur-sm sm:flex-row sm:justify-between">
              <div className="text-center sm:text-left">
                <p className="text-[15px] font-bold text-white">Join the Turmeet digital marketing network</p>
                <p className="mt-0.5 text-xs leading-snug text-white/65">
                  Destination campaigns, buyer newsletters, social showcases and international fair stands — your venue
                  promoted to thousands of corporate planners worldwide.
                </p>
              </div>
              <LinkButton href="/register/hotel" variant="secondary" className="shrink-0">
                List Your Venue — Free
              </LinkButton>
            </div>
          </Reveal>

          {/* Güven & sertifika bandı — anasayfa ile aynı */}
          <Reveal delay={250}>
            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/15 pt-6 text-left sm:grid-cols-3 lg:grid-cols-5">
              {[
                { title: "TURSAB No. 7514", desc: "Licensed travel agency, Turkey" },
                { title: "ICVB Member", desc: "Istanbul Convention & Visitors Bureau" },
                { title: "ICCA / IAPCO Standards", desc: "Venues verified by on-site MICE inspection" },
                { title: "GDPR & Data Protection", desc: "Your data is protected — B2B privacy, no public links" },
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
    </>
  );
}
