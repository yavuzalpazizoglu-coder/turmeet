/*
 * PANEL İKİ DİL DESTEĞİ (EN/TR) — Partner ve Admin panelleri için.
 *
 * Tasarım: dil tercihi "panel_lang" cookie'sinde tutulur. Sunucu
 * bileşenleri getPanelLang() ile okur; dil değiştirici (LangSwitch)
 * cookie'yi yazıp router.refresh() çağırır, böylece tüm sayfa yeni
 * dille yeniden render edilir.
 *
 * t(en, tr) çifti bilinçli olarak sözlük dosyası yerine satır içi
 * kullanılır — mock aşamasında bakımı kolaydır. Backend entegrasyonunda
 * gerekirse next-intl'e taşınabilir.
 */

export type PanelLang = "en" | "tr";

export const PANEL_LANG_COOKIE = "panel_lang";

/** Verilen dile göre (en, tr) çiftinden doğru metni seçen fonksiyon üretir. */
export function makeT(lang: PanelLang) {
  return (en: string, tr: string) => (lang === "tr" ? tr : en);
}
