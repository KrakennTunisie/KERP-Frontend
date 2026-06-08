"use client";

import {
  Edit,
  Send,
  Settings,
  Trash2,
} from "lucide-react";

import { InvoiceStatus } from "../../types/invoiceStatus";
import { formatDateLong } from "@/shared/utils/formatDate";
import {
  AmountCell,
  ComplianceIcon,
  StatusPill,
} from "../../lib/invoiceTableRowHelpers";
import { ActionMenu } from "@/shared/components/ui/actionMenuItem";

export interface Payment {
  id: string;
  paymentNumber: string;
  date: string;
  amount: number;
  method: string;
  invoiceNumber: string;
}

type RowVariant = "invoice" | "payment" | "invoiceCreditNotes";

type InvoiceTableRowProps<T> = {
  item: T;
  variant: RowVariant;

  onView: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onSend?: (item: T) => void;

  onUpdateStatus?: (item: T) => void;
  canUpdateStatus?: (item: T) => boolean;

  getNumber: (item: T) => string;
  getPartnerName?: (item: T) => string | null | undefined;
  getStatus?: (item: T) => InvoiceStatus | null | undefined;
  getDate: (item: T) =>  Date  | undefined;

  getAmountEUR?: (item: T) => number | null | undefined;
  getAmountTND?: (item: T) => number | null | undefined;

  getPaymentMethod?: (item: T) => string | null | undefined;
  getRelatedInvoiceNumber?: (item: T) => string | null | undefined;

  getStatusLabel?: (status: InvoiceStatus) => string;
  getStatusColor?: (status: InvoiceStatus) => string;
};

export function InvoiceTableRow<T>({
  item,
  variant,
  onView,
  onEdit,
  onDelete,
  onSend,
  onUpdateStatus,
  canUpdateStatus,
  getNumber,
  getPartnerName,
  getStatus,
  getDate,
  getAmountEUR,
  getAmountTND,
  getPaymentMethod,
  getRelatedInvoiceNumber,
  getStatusLabel,
  getStatusColor,
}: InvoiceTableRowProps<T>) {
  const status = getStatus?.(item);

  const statusUpdateDisabled =
    !onUpdateStatus || (canUpdateStatus ? !canUpdateStatus(item) : false);

  const actions = [
    ...(onEdit
      ? [
          {
            label: "Modifier",
            icon: Edit,
            color: "text-amber-600",
            hover: "hover:bg-amber-50",
            onClick: () => onEdit(item),
          },
        ]
      : []),

    ...(onSend
      ? [
          {
            label: "Envoyer",
            icon: Send,
            color: "text-emerald-600",
            hover: "hover:bg-emerald-50",
            onClick: () => onSend(item),
          },
        ]
      : []),

    ...(onUpdateStatus
      ? [
          {
            label: "Mettre à jour le statut",
            icon: Settings,
            color: "text-violet-600",
            hover: "hover:bg-violet-50",
            disabled: statusUpdateDisabled,
            onClick: () => onUpdateStatus(item),
          },
        ]
      : []),

    ...(onDelete
      ? [
          {
            label: "Supprimer",
            icon: Trash2,
            color: "text-rose-600",
            hover: "hover:bg-rose-50",
            onClick: () => onDelete(item),
          },
        ]
      : []),
  ];

  return (
    <tr className="transition-colors hover:bg-slate-50/70">
      <td className="px-5 py-3.5">
        <button
          onClick={() => onView(item)}
          className="cursor-pointer text-xs font-bold text-blue-600 underline-offset-4 transition hover:text-blue-800 hover:underline"
        >
          {getNumber(item)}
        </button>
      </td>

      <td className="px-5 py-3.5">
        <p className="max-w-[220px] truncate text-xs font-semibold text-slate-800">
          {variant === "payment"
            ? getRelatedInvoiceNumber?.(item) ?? "—"
            : getPartnerName?.(item) ?? "—"}
        </p>
      </td>

      <td className="px-5 py-3.5">
        {variant === "payment" ? (
          <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700">
            {getPaymentMethod?.(item) ?? "—"}
          </span>
        ) : status && getStatusLabel && getStatusColor ? (
          <StatusPill
            status={status}
            getStatusLabel={getStatusLabel}
            getStatusColor={getStatusColor}
          />
        ) : (
          <span className="text-xs text-slate-400">—</span>
        )}
      </td>

      <td className="px-5 py-3.5">
        <AmountCell value={getAmountEUR?.(item)} currency="EUR" />
      </td>

      <td className="px-5 py-3.5">
        <AmountCell value={getAmountTND?.(item)} currency="TND" />
      </td>

      <td className="px-5 py-3.5">
        <p className="whitespace-nowrap text-xs font-medium text-slate-600">
          {formatDateLong(getDate(item))}
        </p>
      </td>

      <td className="px-5 py-3.5 text-center">
        {variant === "payment" ? (
          <span className="text-xs font-semibold text-slate-400">—</span>
        ) : (
          <ComplianceIcon />
        )}
      </td>

      <td className="px-5 py-3.5">
        <div className="flex items-center justify-end">
          <ActionMenu
            orientation="horizontal"
            title={variant === "payment" ? "Actions paiement" : "Actions facture"}
            items={actions}
          />
        </div>
      </td>
    </tr>
  );
}