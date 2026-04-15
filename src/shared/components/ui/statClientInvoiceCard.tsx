// StatClientInvoiceCard.tsx
import { StatCardVariant,STAT_CARD_STYLES } from "@/shared/utils/statCardConfig";

export default function StatClientInvoiceCard({
  icon,
  label,
  eur,
  tnd,
  sub,
  variant,
}: {
  icon: React.ReactNode;
  label: string;
  eur: number;
  tnd: number;
  sub: string;
  variant: StatCardVariant; // "blue" | "amber" | "emerald"
}) {
  const styles = STAT_CARD_STYLES[variant];

  return (
    <div className={`rounded-2xl p-6 flex-1 min-w-0 ${styles.bg} ${styles.border}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${styles.iconBg}`}>
          {icon}
        </div>
        <span className={`text-xs font-bold tracking-widest uppercase ${styles.labelColor}`}>
          {label}
        </span>
      </div>
      <div className="text-3xl font-black text-slate-800">
        {eur.toLocaleString("fr-FR")}{" "}
        <span className="text-base font-semibold text-slate-500">EUR</span>
      </div>
      <div className="text-xl font-bold text-slate-600 mt-1">
        {tnd.toLocaleString("fr-FR")}{" "}
        <span className="text-sm font-semibold text-slate-400">TND</span>
      </div>
      <div className="mt-2 text-xs font-semibold tracking-widest uppercase text-slate-500">
        {sub}
      </div>
    </div>
  );
}