/*
 * UI Bileşen Kütüphanesi
 * Kaynak: TURMEET_MASTER_Kurulum.md Bölüm 15.5 + onaylı mockup görselleri
 * Kullanım: import { Button, Badge, StatCard } from "@/components/ui";
 */
import Link from "next/link";
import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { StarIcon } from "./icons";

// ── Button ─────────────────────────────────────────────────────
type ButtonVariant = "primary" | "secondary" | "accent" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const btnVariants: Record<ButtonVariant, string> = {
  primary: "bg-brand text-white hover:bg-brand-dark",
  secondary: "bg-white text-brand border border-brand hover:bg-brand-light",
  accent: "bg-accent text-white hover:opacity-90",
  ghost: "bg-transparent text-ink hover:bg-surface",
  danger: "bg-danger text-white hover:opacity-90",
};

const btnSizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-[15px]",
  lg: "h-12 px-6 text-[15px]",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-btn font-medium transition-colors disabled:bg-surface disabled:text-muted disabled:cursor-not-allowed cursor-pointer ${btnVariants[variant]} ${btnSizes[size]} ${className}`}
      {...props}
    />
  );
}

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
}: {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-btn font-medium transition-colors ${btnVariants[variant]} ${btnSizes[size]} ${className}`}
    >
      {children}
    </Link>
  );
}

// ── Badge ──────────────────────────────────────────────────────
type BadgeTone = "brand" | "success" | "warning" | "danger" | "neutral" | "accent";

const badgeTones: Record<BadgeTone, string> = {
  brand: "bg-brand text-white",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
  neutral: "bg-surface text-ink",
  accent: "bg-accent/10 text-accent",
};

export function Badge({ tone = "neutral", children, className = "" }: { tone?: BadgeTone; children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold ${badgeTones[tone]} ${className}`}>
      {children}
    </span>
  );
}

// ── Card ───────────────────────────────────────────────────────
export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-card border border-gray-200 bg-white ${className}`}>
      {children}
    </div>
  );
}

// ── StatCard (panel dashboard'ları) ────────────────────────────
export function StatCard({
  label,
  value,
  hint,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "neutral" | "brand" | "success" | "warning" | "danger";
}) {
  const valueColor =
    tone === "brand" ? "text-brand" : tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : tone === "danger" ? "text-danger" : "text-ink";
  return (
    <Card className="p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${valueColor}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </Card>
  );
}

// ── Form Elemanları ────────────────────────────────────────────
export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`h-11 w-full rounded-btn border border-gray-300 px-3 text-[15px] outline-none transition-colors placeholder:text-muted focus:border-brand ${className}`}
      {...props}
    />
  );
}

export function Select({ className = "", children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`h-11 w-full rounded-btn border border-gray-300 bg-white px-3 text-[15px] outline-none transition-colors focus:border-brand ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

export function Textarea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`min-h-[120px] w-full rounded-btn border border-gray-300 p-3 text-[15px] outline-none transition-colors placeholder:text-muted focus:border-brand ${className}`}
      {...props}
    />
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}

// ── Table ──────────────────────────────────────────────────────
export function Table({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-card border border-gray-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-surface">
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">{children}</tbody>
      </table>
    </div>
  );
}

// ── Star rating ────────────────────────────────────────────────
export function Stars({ rating, count }: { rating: number; count?: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm">
      <StarIcon size={14} className="text-brand" />
      <span className="font-semibold">{rating.toFixed(1)}</span>
      {count !== undefined && <span className="text-muted">({count})</span>}
    </span>
  );
}

export function StarRow({ stars }: { stars: number }) {
  return (
    <span className="inline-flex text-brand">
      {Array.from({ length: stars }).map((_, i) => (
        <StarIcon key={i} size={13} />
      ))}
    </span>
  );
}

// ── Durum badge eşlemeleri (master doküman durum renkleri) ────
// lang="tr" verilirse etiketler Türkçe gösterilir (partner + admin paneli).
export function StatusBadge({ status, lang = "en" }: { status: string; lang?: "en" | "tr" }) {
  const map: Record<string, { label: string; labelTr: string; tone: BadgeTone }> = {
    // QuoteRequest
    waiting: { label: "Waiting", labelTr: "Bekliyor", tone: "warning" },
    quotes_received: { label: "Quotes received", labelTr: "Teklifler alındı", tone: "success" },
    expired: { label: "Expired", labelTr: "Süresi doldu", tone: "neutral" },
    contracted: { label: "Contracted", labelTr: "Kontratlandı", tone: "brand" },
    // Quote
    pending: { label: "Pending", labelTr: "Beklemede", tone: "warning" },
    received: { label: "Received", labelTr: "Alındı", tone: "success" },
    declined: { label: "Declined", labelTr: "Reddedildi", tone: "danger" },
    // Contract
    draft: { label: "Draft", labelTr: "Taslak", tone: "neutral" },
    pending_signature: { label: "Pending signature", labelTr: "İmza bekliyor", tone: "warning" },
    active: { label: "Active", labelTr: "Aktif", tone: "success" },
    completed: { label: "Completed", labelTr: "Tamamlandı", tone: "brand" },
    cancelled: { label: "Cancelled", labelTr: "İptal edildi", tone: "danger" },
    // Commission
    accrued: { label: "Accrued", labelTr: "Tahakkuk etti", tone: "neutral" },
    invoiced: { label: "Invoiced", labelTr: "Faturalandı", tone: "warning" },
    paid: { label: "Paid", labelTr: "Ödendi", tone: "success" },
    overdue: { label: "Overdue", labelTr: "Gecikmiş", tone: "danger" },
    disputed: { label: "Disputed", labelTr: "İtirazlı", tone: "danger" },
    // Registration
    approved: { label: "Approved", labelTr: "Onaylandı", tone: "success" },
    rejected: { label: "Rejected", labelTr: "Reddedildi", tone: "danger" },
    on_hold: { label: "On hold", labelTr: "Beklemede", tone: "warning" },
  };
  const item = map[status] ?? { label: status, labelTr: status, tone: "neutral" as BadgeTone };
  return <Badge tone={item.tone}>{lang === "tr" ? item.labelTr : item.label}</Badge>;
}

// ── EmptyState ─────────────────────────────────────────────────
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-gray-300 bg-surface/50 px-6 py-16 text-center">
      <p className="text-lg font-semibold text-ink">{title}</p>
      {description && <p className="mt-1 max-w-md text-sm text-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ── PageHeader (panel sayfaları için) ──────────────────────────
export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-ink">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
