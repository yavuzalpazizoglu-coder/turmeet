/*
 * PANEL İKİ DİL DESTEĞİ — sunucu tarafı cookie okuma.
 * Sadece server component'lerden import edilmelidir.
 */
import { cookies } from "next/headers";
import { PANEL_LANG_COOKIE, type PanelLang } from "./panel-i18n";

export async function getPanelLang(): Promise<PanelLang> {
  const value = (await cookies()).get(PANEL_LANG_COOKIE)?.value;
  return value === "tr" ? "tr" : "en";
}
