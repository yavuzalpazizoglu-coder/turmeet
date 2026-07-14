/*
 * PANEL İKİ DİL DESTEĞİ — client tarafı.
 *  - usePanelLang(): "use client" sayfalarda dili okur ve dil
 *    değişikliğinde otomatik günceller.
 *  - LangSwitch: EN | TR anahtarı. Cookie'yi yazar, server
 *    component'leri router.refresh() ile, client component'leri
 *    window event'i ile yeniler.
 */
"use client";

import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { PANEL_LANG_COOKIE, type PanelLang } from "./panel-i18n";

const LANG_EVENT = "turmeet-panel-lang";

function readCookieLang(): PanelLang {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(new RegExp(`${PANEL_LANG_COOKIE}=(tr|en)`));
  return match?.[1] === "tr" ? "tr" : "en";
}

function subscribeLang(onChange: () => void) {
  window.addEventListener(LANG_EVENT, onChange);
  return () => window.removeEventListener(LANG_EVENT, onChange);
}

/* Cookie yazımı bileşen dışında — React Compiler global mutasyonuna izin verir */
function writeLangCookie(next: PanelLang) {
  document.cookie = `${PANEL_LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
  window.dispatchEvent(new Event(LANG_EVENT));
}

export function usePanelLang(): PanelLang {
  return useSyncExternalStore(subscribeLang, readCookieLang, () => "en");
}

export function LangSwitch({ current }: { current: PanelLang }) {
  const router = useRouter();

  function change(next: PanelLang) {
    if (next === current) return;
    writeLangCookie(next);
    router.refresh();
  }

  return (
    <div className="flex items-center overflow-hidden rounded-full border border-gray-200 text-xs font-semibold">
      {(["en", "tr"] as const).map((l) => (
        <button
          key={l}
          onClick={() => change(l)}
          aria-pressed={current === l}
          className={`px-2.5 py-1 uppercase transition-colors ${
            current === l ? "bg-brand text-white" : "bg-white text-muted hover:text-ink"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
