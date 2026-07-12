/*
 * HERO SLAYT GÖSTERİSİ — anasayfa arka planı.
 * Fotoğraflar müşterinin verdiği "Foto turmeet" setinden gelir
 * (başka görsel kullanılmaz). Her kare 2 dakika kalır, yumuşak
 * crossfade ile bir sonrakine döner.
 */
"use client";

import { useEffect, useState } from "react";

const SLIDE_DURATION_MS = 120_000; // her fotoğraf 2 dakika kalır

const SLIDES = [
  { src: "/images/hero-slide-1.jpg", alt: "Cappadocia — hot air balloons over the valley" },
  { src: "/images/hero-slide-2.jpg", alt: "Istanbul — colorful Bosphorus waterfront houses" },
  { src: "/images/hero-slide-3.jpg", alt: "Istanbul — Golden Horn and Galata Bridge panorama" },
  { src: "/images/hero-slide-4.jpg", alt: "Istanbul — Galata Tower" },
  { src: "/images/hero-slide-5.jpg", alt: "Istanbul — Bosphorus Bridge at night" },
  { src: "/images/hero-slide-6.jpg", alt: "Antalya — Kaputaş Beach turquoise coast" },
];

export default function HeroSlideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Tüm kareler üst üste render edilir; sadece aktif olan görünür.
          Böylece geçiş anında yükleme beklenmez (preload). */}
      {SLIDES.map((s, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={s.src}
          src={s.src}
          alt={s.alt}
          loading={i === 0 ? "eager" : "lazy"}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[2000ms] ease-in-out ${
            i === index ? "opacity-70" : "opacity-0"
          }`}
        />
      ))}
    </>
  );
}
