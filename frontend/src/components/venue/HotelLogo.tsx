/*
 * Otel logosu — fallback zinciri: logo.dev/Clearbit → Google favicon → baş harf.
 */
"use client";

import { useState } from "react";
import { logoUrl, faviconUrl } from "@/lib/logo";

export function HotelLogo({
  domain,
  name,
  size = 40,
  className = "",
}: {
  domain: string;
  name: string;
  size?: number;
  className?: string;
}) {
  const [stage, setStage] = useState<0 | 1 | 2>(0);

  if (stage === 2) {
    // Hiçbir servis logo bulamadı → marka baş harfi
    return (
      <span
        className={`flex shrink-0 items-center justify-center rounded-full bg-brand-light font-bold text-brand ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.45 }}
        title={name}
      >
        {name.charAt(0)}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={stage === 0 ? logoUrl(domain, size * 2) : faviconUrl(domain, size * 2)}
      alt={`${name} logo`}
      width={size}
      height={size}
      loading="lazy"
      onError={() => setStage((s) => (s === 0 ? 1 : 2))}
      className={`shrink-0 rounded-full bg-white object-contain ring-1 ring-gray-200 ${className}`}
      style={{ width: size, height: size, padding: size * 0.1 }}
      title={name}
    />
  );
}
