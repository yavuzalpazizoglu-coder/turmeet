/*
 * Public Header — iki varyant:
 *  - transparent: anasayfa hero üstünde (beyaz logo, beyaz linkler)
 *  - solid: iç sayfalarda (beyaz zemin, magenta logo)
 * Mockup kararı: anasayfa magenta/şeffaf, iç sayfalar beyaz header.
 */
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { LinkButton } from "@/components/ui";
import { MenuIcon, XIcon, ChevronDownIcon } from "@/components/ui/icons";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/destinations", label: "Destinations" },
  { href: "/venues", label: "Venues" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/for-hotels", label: "For Hotels" },
];

export function PublicHeader({ variant = "solid" }: { variant?: "solid" | "transparent" }) {
  const [open, setOpen] = useState(false);
  const transparent = variant === "transparent";

  return (
    <header
      className={
        transparent
          ? "absolute inset-x-0 top-0 z-40 bg-transparent"
          : "sticky top-0 z-40 border-b border-gray-200 bg-white"
      }
    >
      <div className="flex h-28 w-full items-center justify-between pl-2 pr-4 sm:pl-3 sm:pr-6">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src={transparent ? "/brand-white.png" : "/brand-magenta.png"}
            alt="TURMEET — Meet in Turkey. Plan with Ease."
            width={1670}
            height={412}
            className="h-[70px] w-auto object-contain sm:h-[90px]"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors ${transparent ? "text-white/90 hover:text-white" : "text-ink hover:text-brand"}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            className={`inline-flex items-center gap-1 text-sm font-medium ${transparent ? "text-white/90" : "text-ink"}`}
          >
            EN <ChevronDownIcon size={14} />
          </button>
          <Link
            href="/login"
            className={`text-sm font-medium ${transparent ? "text-white/90 hover:text-white" : "text-ink hover:text-brand"}`}
          >
            Log In
          </Link>
          <LinkButton href="/register" size="sm" variant={transparent ? "secondary" : "primary"}>
            Sign Up
          </LinkButton>
        </div>

        {/* Mobile toggle */}
        <button
          className={`md:hidden ${transparent ? "text-white" : "text-ink"}`}
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <XIcon size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="py-1 text-sm font-medium text-ink" onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <Link href="/login" className="py-1 text-sm font-medium text-ink" onClick={() => setOpen(false)}>
              Log In
            </Link>
            <LinkButton href="/register" size="sm">
              Sign Up
            </LinkButton>
          </nav>
        </div>
      )}
    </header>
  );
}
