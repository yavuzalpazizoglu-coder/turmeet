/*
 * /partner — OTEL/PARTNER PANELİ LAYOUT
 * Master doküman Bölüm 5 (Partner Panel). EN/TR iki dilli.
 */
import { PanelShell } from "@/components/layout/PanelShell";
import { getPanelLang } from "@/lib/panel-i18n-server";
import { makeT } from "@/lib/panel-i18n";
import {
  HomeIcon,
  FileTextIcon,
  CheckIcon,
  MessageIcon,
  BarChartIcon,
  BuildingIcon,
  TagIcon,
  SettingsIcon,
} from "@/components/ui/icons";

export default async function PartnerLayout({ children }: { children: React.ReactNode }) {
  const lang = await getPanelLang();
  const t = makeT(lang);

  const nav = [
    { href: "/partner", label: t("Dashboard", "Panel"), icon: <HomeIcon size={18} /> },
    { href: "/partner/requests", label: t("Quote Requests", "Teklif Talepleri"), icon: <FileTextIcon size={18} /> },
    { href: "/partner/contracts", label: t("Contracts", "Kontratlar"), icon: <CheckIcon size={18} /> },
    { href: "/partner/messages", label: t("Messages", "Mesajlar"), icon: <MessageIcon size={18} /> },
    { href: "/partner/reports", label: t("Reports", "Raporlar"), icon: <BarChartIcon size={18} /> },
    { href: "/partner/profile", label: t("Venue Profile", "Tesis Profili"), icon: <BuildingIcon size={18} /> },
    { href: "/partner/promotions", label: t("Promotions", "Promosyonlar"), icon: <TagIcon size={18} /> },
    { href: "/partner/settings", label: t("Settings", "Ayarlar"), icon: <SettingsIcon size={18} /> },
  ];

  return (
    <PanelShell
      title={t("Partner Panel", "Partner Paneli")}
      nav={nav}
      roleLabel={t("Swissôtel The Bosphorus — Sales", "Swissôtel The Bosphorus — Satış")}
      lang={lang}
    >
      {children}
    </PanelShell>
  );
}
