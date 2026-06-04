"use client";

import {
  Eye,
  Edit,
  Send,
  Settings,
  Trash2,
} from "lucide-react";

import { InvoicePageItem } from "../../models/invoice";
import { InvoiceStatus } from "../../types/invoiceStatus";
import { formatDateLong } from "@/shared/utils/formatDate";
import { AmountCell, ComplianceIcon, StatusPill } from "../../lib/invoiceTableRowHelpers";
import { ActionMenu } from "@/shared/components/ui/actionMenuItem";

type InvoiceTableRowProps<T extends InvoicePageItem> = {
  invoice: T;

  onView: (invoice: T) => void;
  onEdit?: (invoice: T) => void;
  onDelete?: (invoice: T) => void;
  onSend?: (invoice: T) => void;

  onUpdateStatus?: (invoice: T) => void;
  canUpdateStatus?: (invoice: T) => boolean;

  getStatusLabel: (status: InvoiceStatus) => string;
  getStatusColor: (status: InvoiceStatus) => string;
};

export function InvoiceTableRow<T extends InvoicePageItem>({
  invoice,
  onView,
  onEdit,
  onDelete,
  onSend,
  onUpdateStatus,
  canUpdateStatus,
  getStatusLabel,
  getStatusColor,
}: InvoiceTableRowProps<T>) {
  const statusUpdateDisabled =
    !onUpdateStatus || (canUpdateStatus ? !canUpdateStatus(invoice) : false);

  const invoiceActions = [

    ...(onEdit
      ? [
          {
            label: "Modifier",
            icon: Edit,
            color: "text-amber-600",
            hover: "hover:bg-amber-50",
            onClick: () => onEdit(invoice),
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
            onClick: () => onSend(invoice),
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
            onClick: () => onUpdateStatus(invoice),
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
            onClick: () => onDelete(invoice),
          },
        ]
      : []),
  ];

  return (
    <tr className="transition-colors hover:bg-slate-50/70">
      <td className="px-5 py-3.5">
        <button
          type="button"
          onClick={() => onView(invoice)}
          className="text-xs font-bold text-blue-600 underline-offset-4 transition hover:text-blue-800 hover:underline cursor-pointer"
        >
          {invoice.invoiceNumber}
        </button>
      </td>

      <td className="px-5 py-3.5">
        <p className="max-w-[220px] truncate text-xs font-semibold text-slate-800">
          {invoice.partner?.companyName ?? "—"}
        </p>
      </td>

      <td className="px-5 py-3.5">
        <StatusPill
          status={invoice.invoiceStatus}
          getStatusLabel={getStatusLabel}
          getStatusColor={getStatusColor}
        />
      </td>

      <td className="px-5 py-3.5">
        <AmountCell value={invoice.totalInclTaxEUR} currency="EUR" />
      </td>

      <td className="px-5 py-3.5">
        <AmountCell value={invoice.totalInclTaxTND} currency="TND" />
      </td>

      <td className="px-5 py-3.5">
        <p className="whitespace-nowrap text-xs font-medium text-slate-600">
          {formatDateLong(invoice.dueDate ?? invoice.issueDate)}
        </p>
      </td>

      <td className="px-5 py-3.5 text-center">
        <ComplianceIcon />
      </td>

      <td className="px-5 py-3.5">
        <div className="flex items-center justify-end">
          <ActionMenu
            orientation="horizontal"
            title="Actions facture"
            items={invoiceActions}
          />
        </div>
      </td>
    </tr>
  );
}