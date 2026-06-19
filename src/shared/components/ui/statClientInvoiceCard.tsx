// StatClientInvoiceCard.tsx

import type { ReactNode } from "react";
import {
  StatCardVariant,
  STAT_CARD_STYLES,
} from "@/shared/utils/statCardConfig";

type StatClientInvoiceCardProps = {
  icon: ReactNode;
  label: string;
  eur: number;
  tnd: number;
  sub?: string;
  variant: StatCardVariant;
};

const formatAmount = (value: number) =>
  value.toLocaleString("fr-FR", {
    maximumFractionDigits: 2,
  });

export default function StatClientInvoiceCard({
  icon,
  label,
  eur,
  tnd,
  sub,
  variant,
}: StatClientInvoiceCardProps) {
  const styles = STAT_CARD_STYLES[variant];

  return (
<div
  className={`
    flex-1 min-w-0 rounded-2xl border p-3.5
    font-[Inter,system-ui,sans-serif]
    transition-all duration-200
    hover:-translate-y-0.5 hover:shadow-sm
    ${styles.bg} ${styles.border}
  `}
>
  {/* HEADER */}
  <div className="flex items-center gap-2.5 mb-2.5">

    <div
      className={`
        flex h-8.5 w-8.5 shrink-0 items-center justify-center
        rounded-xl shadow-sm
        ${styles.iconBg}
      `}
    >
      {icon}
    </div>

    <span
      className={`
        text-[9px] font-extrabold uppercase tracking-[0.16em]
        ${styles.labelColor}
      `}
    >
      {label}
    </span>

  </div>

  {/* VALUES */}
  <div className="space-y-0.5">

    <p className="text-xl font-extrabold tracking-tight text-slate-900">
      {formatAmount(eur)}
      <span className="ml-1 text-[10px] font-semibold text-slate-400">
        EUR
      </span>
    </p>

    <p className="text-xs font-semibold text-slate-500">
      {formatAmount(tnd)}
      <span className="ml-1 text-[10px] font-medium text-slate-400">
        TND
      </span>
    </p>

  </div>

  {/* SUB TEXT */}
  {sub && (
    <p className="mt-2 text-[10px] font-medium leading-4 text-slate-500">
      {sub}
    </p>
  )}
</div>
  );
}