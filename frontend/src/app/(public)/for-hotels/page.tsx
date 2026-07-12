/*
 * OTELLER İÇİN — partner kazanım sayfası, master doküman 3.2.7.
 */
import { PublicHeader } from "@/components/layout/PublicHeader";
import { LinkButton } from "@/components/ui";
import { CheckIcon, EuroIcon, UsersIcon, BarChartIcon } from "@/components/ui/icons";

export const metadata = { title: "For Hotels — Turmeet" };

const BENEFITS = [
  {
    icon: <EuroIcon size={26} />,
    title: "Lowest commission in the market",
    desc: "Pay a success fee only for realized events — no listing fee, no subscription, no upfront cost.",
  },
  {
    icon: <UsersIcon size={26} />,
    title: "International demand",
    desc: "Receive qualified group requests from corporate buyers and agencies in Germany, UK, France and beyond.",
  },
  {
    icon: <BarChartIcon size={26} />,
    title: "MICE-grade tooling",
    desc: "Structured RFQs with full event specs, quote templates, option tracking and performance reports.",
  },
];

export default function ForHotelsPage() {
  return (
    <>
      <PublicHeader />

      <section className="bg-ink">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Fill your meeting rooms with international events</h1>
          <p className="mx-auto mt-3 max-w-2xl text-white/70">
            Join 329+ venues on Turkey&apos;s meeting &amp; event search engine. Qualified group requests, transparent
            terms, and payment only on success.
          </p>
          <LinkButton href="/register/hotel" size="lg" className="mt-8">
            List Your Venue — Free
          </LinkButton>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          {BENEFITS.map((b) => (
            <div key={b.title} className="rounded-card border border-gray-200 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-light text-brand">{b.icon}</div>
              <h2 className="mt-4 text-lg font-bold text-ink">{b.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted">{b.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-card bg-surface p-8">
          <h2 className="text-xl font-bold text-ink">How partnership works</h2>
          <ul className="mt-4 space-y-3">
            {[
              "Apply with your venue details — our team verifies and builds your profile with you.",
              "Receive structured quote requests matched to your capacity and availability.",
              "Respond with your group offer directly on the platform within your SLA.",
              "Win the event, host the group — commission is invoiced only after realization.",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-ink/80">
                <CheckIcon size={17} className="mt-0.5 shrink-0 text-success" />
                {step}
              </li>
            ))}
          </ul>
          <LinkButton href="/register/hotel" className="mt-6">
            Apply now
          </LinkButton>
        </div>
      </section>
    </>
  );
}
