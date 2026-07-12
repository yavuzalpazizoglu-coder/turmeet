/*
 * Panel Kabuğu — /app, /partner ve /admin panellerinin ortak layout'u.
 * Sol sidebar + üst bar. Menü öğeleri her panelin layout.tsx'inden gelir.
 */
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { MenuIcon, XIcon, BellIcon } from "@/components/ui/icons";

export interface PanelNavItem {
  href: string;
  label: string;
  icon: ReactNode;
}

export function PanelShell({
  title,
  nav,
  children,
  roleLabel,
}: {
  title: string;
  nav: PanelNavItem[];
  children: ReactNode;
  roleLabel: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-20 items-center border-b border-white/10 px-5">
        <Link href="/">
          <Image src="/logo-white.png" alt="TURMEET" width={1670} height={412} className="h-8 w-auto object-contain" />
        </Link>
      </div>
      <p className="px-5 pt-4 text-[11px] font-semibold uppercase tracking-widest text-white/40">{title}</p>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-btn px-3 py-2.5 text-sm font-medium transition-colors ${
                active ? "bg-brand text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-4">
        <p className="text-xs text-white/50">{roleLabel}</p>
        <Link href="/login" className="mt-1 block text-xs font-medium text-white/70 hover:text-white">
          Switch role / Log out
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 bg-ink lg:block">{sidebar}</aside>

      {/* Mobile sidebar */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-ink">{sidebar}</aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
          <button className="text-ink lg:hidden" onClick={() => setOpen(true)} aria-label="Menu">
            <MenuIcon size={22} />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-4">
            <button className="relative text-muted hover:text-ink" aria-label="Notifications">
              <BellIcon size={20} />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-brand" />
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
              {roleLabel.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
