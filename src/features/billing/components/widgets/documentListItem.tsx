"use client";

import { LucideIcon } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import {
  ActionMenu,
  ActionMenuItem,
} from "@/shared/components/ui/actionMenuItem";
import { formatDateLong } from "@/shared/utils/formatDate";

type DocumentListItemVariant =
  | "invoice"
  | "purchaseOrder"
  | "creditNote"
  | "payment";

type DocumentListItemProps<T> = {
  item: T;

  variant: DocumentListItemVariant;

  icon: LucideIcon;

  title: string;
  menuTitle?: string;

  getNumber: (item: T) => string;
  getDate: (item: T) => Date |  undefined;
  getAmount: (item: T) => number | null | undefined;
  getCurrency?: (item: T) => string | null | undefined;

  getStatus?: (item: T) => string;
  statusLabels?: Record<string, string>;
  statusColors?: Record<string, string>;

  actions?: ActionMenuItem[];

  amountLabel?: string;
  secondaryLabel?: string;
  getSecondaryText?: (item: T) => string | null | undefined;
};

const variantStyles: Record<
  DocumentListItemVariant,
  {
    iconBg: string;
    iconText: string;
    iconRing: string;
  }
> = {
  invoice: {
    iconBg: "bg-blue-50",
    iconText: "text-blue-600",
    iconRing: "ring-blue-100",
  },
  purchaseOrder: {
    iconBg: "bg-violet-50",
    iconText: "text-violet-600",
    iconRing: "ring-violet-100",
  },
  creditNote: {
    iconBg: "bg-rose-50",
    iconText: "text-rose-600",
    iconRing: "ring-rose-100",
  },
  payment: {
    iconBg: "bg-emerald-50",
    iconText: "text-emerald-600",
    iconRing: "ring-emerald-100",
  },
};

export function DocumentListItem<T>({
  item,
  variant,
  icon: Icon,
  title,
  menuTitle,
  getNumber,
  getDate,
  getAmount,
  getCurrency,
  getStatus,
  statusLabels,
  statusColors,
  actions = [],
  amountLabel = "Total HT",
  secondaryLabel,
  getSecondaryText,
}: DocumentListItemProps<T>) {
  const styles = variantStyles[variant];

  const number = getNumber(item);
  const date = getDate(item);
  const amount = getAmount(item);
  const currency = getCurrency?.(item) ?? "TND";
  const status = getStatus?.(item);
  const secondaryText = getSecondaryText?.(item);

  return (
    <div
      className="
        group flex items-center justify-between gap-4
        rounded-2xl border border-slate-100 bg-white
        px-4 py-3.5 shadow-sm transition-all
        hover:border-slate-200 hover:bg-slate-50/80 hover:shadow-md
      "
    >
      {/* Left side */}
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`
            flex h-10 w-10 shrink-0 items-center justify-center
            rounded-2xl ring-1
            ${styles.iconBg}
            ${styles.iconText}
            ${styles.iconRing}
          `}
        >
          <Icon className="h-4.5 w-4.5" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-900">
            {number || "-"}
          </p>

          <p className="mt-0.5 text-xs font-medium text-slate-500">
            Date : {date ? formatDateLong(date) : "-"}
          </p>

          {secondaryText && (
            <p className="mt-0.5 truncate text-[11px] font-medium text-slate-400">
              {secondaryLabel ? `${secondaryLabel} : ` : ""}
              {secondaryText}
            </p>
          )}

          <p className="mt-0.5 text-[11px] text-slate-400 sm:hidden">
            {title}
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex shrink-0 items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-bold text-slate-900">
            {typeof amount === "number"
              ? amount.toLocaleString("fr-FR", {
                  minimumFractionDigits: 3,
                  maximumFractionDigits: 3,
                })
              : "—"}

            <span className="ml-1 text-xs font-semibold text-slate-400">
              {currency}
            </span>
          </p>

          <p className="mt-0.5 text-[11px] font-medium text-slate-400">
            {amountLabel}
          </p>
        </div>

        {status && (
          <Badge
            className={`
              shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold
              ${statusColors?.[status] ?? "bg-slate-100 text-slate-600"}
            `}
          >
            {statusLabels?.[status] ?? status}
          </Badge>
        )}

        {actions.length > 0 && (
          <ActionMenu
            title={menuTitle ?? `Actions ${title}`}
            orientation="horizontal"
            items={actions}
          />
        )}
      </div>
    </div>
  );
}