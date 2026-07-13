/*
 * Global Footer — master doküman 3.2.1b yapısına göre:
 * 4 bölüm: navigasyon sütunları / güven bandı / yasal linkler / copyright
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

export function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {/* Bölüm 1 — Navigasyon + D Event Ofis iletişim bilgileri */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div>
            <Image src="/brand-white.png" alt="TURMEET" width={1670} height={412} className="h-10 w-auto object-contain" />
            <p className="mt-3 text-sm text-white/60">
              Turkey&apos;s Meeting &amp; Event Search Engine.
              <br />
              Compare. Choose. Organize.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold uppercase tracking-wide text-white/80">{col.title}</p>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link href={l.href} className="text-sm text-white/60 transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* D Event Ofis — iletişim bilgileri (DDG §5 / Impressum uyumu) */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-white/80">D Event Office</p>
            <address className="mt-3 space-y-2 text-sm not-italic text-white/60">
              <p className="font-medium text-white/75">D Event Tourism Organization Services Inc.</p>
              <p>
                Icerenkoy Mah. Cayir Cad. No:5
                <br />
                Bay Plaza Floor:12
                <br />
                34752 Atasehir / Istanbul — TURKEY
              </p>
              <p>
                <a href="tel:+902165731836" className="transition-colors hover:text-white">
                  +90 216 573 18 36
                </a>
              </p>
            </address>
          </div>
        </div>

        {/* Bölüm 2 — Güven bandı (DDG §5 / Impressum uyumu) */}
        <div className="mt-10 rounded-card border border-white/10 bg-white/5 px-6 py-4 text-center text-xs text-white/60">
          <p>
            <span className="font-semibold text-white/80">TURSAB Licensed Travel Agency — License No: 7514</span>
            {" · "}Istanbul Convention &amp; Visitors Bureau Member
          </p>
          <p className="mt-1">
            Operated by D Event Turizm Organizasyon Hizmetleri A.Ş. · Est. 2012 · Istanbul, Turkey
          </p>
        </div>

        {/* Bölüm 3 — Yasal linkler */}
        <div className="mt-6 text-center text-xs text-white/50">
          <Link href="#" className="hover:text-white">Privacy Policy</Link>
          {" · "}
          <Link href="#" className="hover:text-white">Terms of Use</Link>
          {" · "}
          <Link href="#" className="hover:text-white">Cookie Policy</Link>
          {" · "}
          <Link href="#" className="hover:text-white">Data Protection (GDPR)</Link>
        </div>

        {/* Bölüm 4 — Copyright */}
        <p className="mt-4 text-center text-xs text-white/40">
          © {new Date().getFullYear()} Turmeet — Powered by D Event Turizm Organizasyon Hizmetleri A.Ş.
        </p>
      </div>
    </footer>
  );
}
