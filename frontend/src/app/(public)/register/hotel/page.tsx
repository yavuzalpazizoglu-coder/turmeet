/*
 * OTEL BAŞVURU — form yerine D Event kanallarına yönlendirme:
 * web: https://devent-online.com · mail: info@devent-online.com
 * (Otel onboarding'i D Event operasyon ekibi tarafından yürütülür.)
 */
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui";
import { BuildingIcon, ArrowRightIcon, MessageIcon } from "@/components/ui/icons";

export const metadata = { title: "List Your Venue — Turmeet" };

export default function HotelRegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-lg">
        <Link href="/" className="mb-8 flex justify-center">
          <Image src="/logo-magenta.png" alt="TURMEET" width={260} height={68} className="h-16 w-auto object-contain" />
        </Link>

        <Card className="p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-light text-brand">
            <BuildingIcon size={28} />
          </div>
          <h1 className="mt-4 text-xl font-bold text-ink">List your venue</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Venue partnerships are managed by our operations team. Apply through our partner portal, or reach us
            directly by email — we&apos;ll verify your venue and build your profile together.
          </p>
          <p className="mt-2 text-sm text-muted">No listing fee — pay a success fee only for realized events.</p>

          <div className="mt-6 space-y-3">
            <a
              href="https://devent-online.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-btn bg-brand px-6 text-[15px] font-medium text-white transition-colors hover:bg-brand-dark"
            >
              Apply on devent-online.com <ArrowRightIcon size={16} />
            </a>
            <a
              href="mailto:info@devent-online.com?subject=Venue%20Application%20%E2%80%94%20Turmeet"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-btn border border-brand bg-white px-6 text-[15px] font-medium text-brand transition-colors hover:bg-brand-light"
            >
              <MessageIcon size={16} /> info@devent-online.com
            </a>
          </div>

          <p className="mt-6 text-sm text-muted">
            <Link href="/for-hotels" className="font-medium text-brand hover:underline">
              Learn more about partner benefits
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
