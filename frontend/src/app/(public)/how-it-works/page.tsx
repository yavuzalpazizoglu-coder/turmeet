/*
 * NASIL ÇALIŞIR — statik sayfa, master doküman 3.2.6.
 */
import { PublicHeader } from "@/components/layout/PublicHeader";
import { LinkButton } from "@/components/ui";
import { SearchIcon, FileTextIcon, CheckIcon, BarChartIcon } from "@/components/ui/icons";

export const metadata = { title: "How It Works — Turmeet" };

const STEPS = [
  {
    icon: <SearchIcon size={28} />,
    title: "1. Search & discover",
    desc: "Enter your city, dates and group size. Filter 329+ verified venues by capacity, star rating, venue type and facilities. Every listing includes full meeting room specs and real photos.",
  },
  {
    icon: <FileTextIcon size={28} />,
    title: "2. Request quotes",
    desc: "Select up to 5 venues and send a single quote request. Hotels respond directly on the platform — typically within 24 hours. No emails, no phone calls, no lost threads.",
  },
  {
    icon: <BarChartIcon size={28} />,
    title: "3. Compare offers",
    desc: "See all offers side by side: room rates, meeting packages, F&B, cancellation terms and option deadlines. Your dedicated Turmeet coordinator helps you negotiate the best terms.",
  },
  {
    icon: <CheckIcon size={28} />,
    title: "4. Contract & organize",
    desc: "Sign digitally and manage rooming lists, cut-off dates and event details in one workspace. We stay with you until your event is successfully completed.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <PublicHeader />

      <section className="bg-brand">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">How Turmeet works</h1>
          <p className="mt-3 text-white/85">
            Compare. Choose. Organize. — Group hotel booking for meetings and events, completely free for organizers.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="space-y-10">
          {STEPS.map((s) => (
            <div key={s.title} className="flex gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-light text-brand">
                {s.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold text-ink">{s.title}</h2>
                <p className="mt-1 leading-relaxed text-ink/75">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-card bg-surface p-8 text-center">
          <h2 className="text-xl font-bold text-ink">Why is it free for organizers?</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted">
            Turmeet charges venues a small success fee only when an event is realized — the lowest commission in the
            market. Organizers never pay anything: no subscription, no booking fee, no hidden costs.
          </p>
          <LinkButton href="/register" size="lg" className="mt-6">
            Start planning — free
          </LinkButton>
        </div>
      </section>
    </>
  );
}
