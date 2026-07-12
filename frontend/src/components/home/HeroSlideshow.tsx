/*
 * HERO SLAYT GÖSTERİSİ — anasayfa arka planı.
 * Unsplash "turkey" aramasından seçilmiş, üzerindeki beyaz yazıların
 * okunabileceği fotoğraflar. Her kare 60 saniye kalır, yumuşak
 * crossfade ile bir sonrakine döner.
 */
"use client";

import { useEffect, useState } from "react";

const SLIDE_DURATION_MS = 60_000; // her fotoğraf 1 dakika kalır

const SLIDES = [
  { src: "/images/hero-istanbul.jpg", alt: "Istanbul — Blue Mosque at sunset" },
  { src: "/images/hero-cappadocia.jpg", alt: "Cappadocia — hot air balloons at sunrise" },
  { src: "/images/hero-galata.jpg", alt: "Istanbul — Galata Tower with seagulls" },
  { src: "/images/hero-sultanahmet.jpg", alt: "Istanbul — Sultanahmet at pink dusk" },
  { src: "/images/hero-bosphorus.jpg", alt: "Istanbul — Golden Horn skyline from the Bosphorus" },
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
