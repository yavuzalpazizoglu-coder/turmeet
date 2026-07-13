/*
 * DENETİM PUANI ROZETİ — 10'luk sisteme çevrilmiş şık skor (Booking tarzı):
 * gradyan puan yuvarlağı + kalite etiketi. TÜM sayfalarda aynı bileşen
 * kullanılır (vitrin, arama sonuçları, mekan kartı, mekan detay) —
 * böylece skor dili sitede tutarlı kalır.
 * 9.0+ Exceptional (yeşil) · 8.5+ Excellent (teal) · 8.0+ Very good
 * (mavi) · altı Good (amber). Kaynak: yerinde MICE denetimi (inspectionScore).
 */

export function scoreParts(score: number): { rating: string; grad: string; label: string } {
  const rating = (score / 10).toFixed(1);
  const [grad, label] =
    score >= 90
      ? ["from-emerald-400 to-emerald-600", "Exceptional"]
      : score >= 85
        ? ["from-teal-400 to-teal-600", "Excellent"]
        : score >= 80
          ? ["from-sky-400 to-sky-600", "Very good"]
          : ["from-amber-400 to-amber-600", "Good"];
  return { rating, grad, label };
}

/** Koyu buzlu cam pill — fotoğraf üzerinde kullanım (vitrin kartları) */
export function InspectionScore({ score }: { score: number }) {
  const { rating, grad, label } = scoreParts(score);
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full bg-black/45 py-[3px] pl-[3px] pr-2.5 shadow-lg ring-1 ring-white/25 backdrop-blur-md"
      title="On-site inspection rating (0-10)"
    >
      <span className={`rounded-full bg-gradient-to-br px-1.5 py-0.5 text-[11px] font-black leading-none text-white shadow-sm ${grad}`}>
        {rating}
      </span>
      <span className="text-[10px] font-semibold leading-none text-white">{label}</span>
    </span>
  );
}

/** Açık zemin varyantı — liste satırları ve detay sayfası için */
export function InspectionScoreLight({ score }: { score: number }) {
  const { rating, grad, label } = scoreParts(score);
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white py-[2px] pl-[2px] pr-2 shadow-sm"
      title="On-site inspection rating (0-10)"
    >
      <span className={`rounded-full bg-gradient-to-br px-1.5 py-0.5 text-[11px] font-black leading-none text-white ${grad}`}>
        {rating}
      </span>
      <span className="text-[10px] font-semibold leading-none text-ink/70">{label}</span>
    </span>
  );
}
