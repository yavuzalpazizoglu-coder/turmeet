/*
 * ORTAK SAYFA HERO'SU — iç sayfaları anasayfa görsel diliyle eşitler:
 * karartılmış gerçek Türkiye fotoğrafı + buzlu cam rozet (ışık süpürmeli)
 * + hero-text-shadow başlık + opsiyonel istatistik satırı ve CTA alanı.
 * Anasayfadaki hero ile aynı ton (bkz. (home)/page.tsx) — böylece menüden
 * hangi sayfaya geçilirse geçilsin akış görsel olarak kopmaz.
 */
import type { ReactNode } from "react";

export function PageHero({
  image,
  imagePosition,
  badge,
  title,
  subtitle,
  stats,
  children,
  compact = false,
}: {
  /** /images/... yolu — karartılmış arka plan fotoğrafı */
  image: string;
  /** Fotoğraf kadrajı (ör. "object-[center_65%]") */
  imagePosition?: string;
  /** Buzlu cam pill rozet metni (yoksa rozet gösterilmez) */
  badge?: string;
  title: string;
  subtitle?: string;
  /** Hero altındaki istatistik satırı (anasayfadaki gibi) */
  stats?: { value: string; label: string }[];
  /** CTA butonları vb. */
  children?: ReactNode;
  /** SERP gibi araç sayfaları için alçak bant */
  compact?: boolean;
}) {
  return (
    <section className={`relative overflow-hidden bg-ink ${compact ? "" : "min-h-[380px]"}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt=""
        aria-hidden
        className={`absolute inset-0 h-full w-full object-cover brightness-[0.55] saturate-[1.1] ${imagePosition ?? ""}`}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/60" />

      <div
        className={`relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4 text-center sm:px-6 ${
          compact ? "py-10" : "py-16 sm:py-20"
        }`}
      >
        {badge && (
          <div className="relative mb-4 inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/30 bg-white/10 px-4 py-1.5 backdrop-blur-md">
            <span className="text-[13px] text-amber-300">★</span>
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-white sm:text-[12px]">{badge}</span>
            <span className="animate-shimmer pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>
        )}

        <h1 className={`hero-text-shadow font-bold uppercase tracking-wide text-white ${compact ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"}`}>
          {title}
        </h1>
        {subtitle && (
          <p className={`hero-text-shadow mt-3 max-w-2xl leading-relaxed text-white/85 ${compact ? "text-sm" : "text-[15px]"}`}>
            {subtitle}
          </p>
        )}

        {children && <div className="mt-6">{children}</div>}

        {stats && stats.length > 0 && (
          <div className={`grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4 ${compact ? "mt-6" : "mt-9"}`}>
            {stats.map((s) => (
              <div key={s.label} className="hero-text-shadow">
                <p className={`font-extrabold text-white ${compact ? "text-xl" : "text-2xl sm:text-3xl"}`}>{s.value}</p>
                <p className="mt-0.5 text-[10px] font-medium uppercase tracking-widest text-white/70">{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
