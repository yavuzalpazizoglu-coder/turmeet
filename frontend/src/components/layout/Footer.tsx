/*
 * Global Footer — master doküman 3.2.1b yapısı, kompakt sürüm.
 *
 * Tasarım: siyah zemin + marka pembesi hareket efektleri
 *  - Üstte akıp giden pembe gradyan çizgi (animate-gradient-pan)
 *  - Arkada süzülen pembe ışık lekeleri (animate-float-slow/slower)
 *  - Link hover rengi marka pembesi
 * Güven bandı + yasal linkler + copyright tek kompakt alt şeride indirildi.
 */
import Link from "next/link";
import Image from "next/image";

const COLUMNS = [
  {
    title: "Platform",
    links: [
      { href: "/venues", label: "Search Venues" },
      { href: "/destinations", label: "Destinations" },
      { href: "/how-it-works", label: "How It Works" },
      { href: "/event-types", label: "Event Types" },
    ],
  },
  {
    title: "For Hotels",
    links: [
      { href: "/register/hotel", label: "List Your Venue" },
      { href: "/for-hotels", label: "Partner Benefits" },
      { href: "/login", label: "Partner Login" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
];

const LEGAL = [
  { href: "#", label: "Privacy Policy" },
  { href: "#", label: "Terms of Use" },
  { href: "#", label: "Cookie Policy" },
  { href: "#", label: "Data Protection (GDPR)" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#0a0a0a] text-white">
      {/* Akan pembe gradyan çizgi — üst kenar */}
      <div className="animate-gradient-pan h-[3px] w-full bg-gradient-to-r from-brand via-fuchsia-500 to-brand" />

      {/* Süzülen pembe ışık lekeleri */}
      <div className="animate-float-slow pointer-events-none absolute -right-24 -top-16 h-72 w-72 rounded-full bg-brand/15 blur-3xl" />
      <div className="animate-float-slower pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-brand/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Bölüm 1 — Navigasyon + D Event Ofis iletişim bilgileri */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-5">
          <div>
            <Image src="/brand-white.png" alt="TURMEET" width={1670} height={412} className="h-8 w-auto object-contain" />
            <p className="mt-2.5 text-xs leading-relaxed text-white/55">
              Turkey&apos;s Meeting &amp; Event Search Engine.
              <br />
              Compare. Choose. Organize.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand">{col.title}</p>
              <ul className="mt-2.5 space-y-1.5">
                {col.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link href={l.href} className="text-[13px] text-white/60 transition-colors hover:text-brand">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* D Event Ofis — iletişim bilgileri (DDG §5 / Impressum uyumu) */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand">D Event Office</p>
            <address className="mt-2.5 space-y-1 text-[13px] not-italic leading-snug text-white/60">
              <p className="font-medium text-white/75">D Event Tourism Organization Services Inc.</p>
              <p>
                Icerenkoy Mah. Cayir Cad. No:5, Bay Plaza Floor:12
                <br />
                34752 Atasehir / Istanbul — TURKEY
              </p>
              <p>
                <a href="tel:+902165731836" className="transition-colors hover:text-brand">
                  +90 216 573 18 36
                </a>
              </p>
            </address>
          </div>
        </div>

        {/* Bölüm 2 — Güven + yasal + copyright: tek kompakt şerit */}
        <div className="mt-7 flex flex-col items-center gap-2 border-t border-white/10 pt-4 text-center text-[11px] text-white/45 md:flex-row md:justify-between md:text-left">
          <p>
            <span className="font-semibold text-white/65">TURSAB No. 7514</span> · ICVB Member · Est. 2012 · Istanbul
          </p>
          <p className="flex flex-wrap items-center justify-center gap-x-1.5">
            {LEGAL.map((l, i) => (
              <span key={l.label}>
                <Link href={l.href} className="transition-colors hover:text-brand">
                  {l.label}
                </Link>
                {i < LEGAL.length - 1 && <span className="ml-1.5 text-white/25">·</span>}
              </span>
            ))}
          </p>
          <p>© {new Date().getFullYear()} Turmeet — Powered by D Event Turizm Organizasyon Hizmetleri A.Ş.</p>
        </div>
      </div>
    </footer>
  );
}
