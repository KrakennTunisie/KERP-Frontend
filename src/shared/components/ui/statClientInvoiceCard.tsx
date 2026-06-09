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
        flex-1 min-w-0 rounded-2xl border p-4
        font-[Inter,system-ui,sans-serif]
        transition-all duration-200
        hover:-translate-y-0.5 hover:shadow-sm
        ${styles.bg} ${styles.border}
      `}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`
            flex h-9 w-9 shrink-0 items-center justify-center
            rounded-xl shadow-sm
            ${styles.iconBg}
          `}
        >
          {icon}
        </div>

        <span
          className={`
            text-[10px] font-extrabold uppercase tracking-[0.14em]
            ${styles.labelColor}
          `}
        >
          {label}
        </span>
      </div>

      <div className="space-y-1">
        <p className="text-2xl font-extrabold tracking-tight text-slate-900">
          {formatAmount(eur)}
          <span className="ml-1 text-xs font-semibold text-slate-400">
            EUR
          </span>
        </p>

        <p className="text-sm font-semibold text-slate-500">
          {formatAmount(tnd)}
          <span className="ml-1 text-[11px] font-medium text-slate-400">
            TND
          </span>
        </p>
      </div>

      {sub && (
        <p className="mt-3 text-[11px] font-medium leading-4 text-slate-500">
          {sub}
        </p>
      )}
    </div>
  );
}