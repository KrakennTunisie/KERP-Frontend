"use client";

import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Eye,
  Settings,
  Trash2,
  Send,
  Edit,
} from "lucide-react";
import { InvoicePageItem } from "../../models/invoice";
import { formatDateLong } from "@/shared/utils/formatDate";
import { InvoiceStatus } from "../../types/invoiceStatus";
import { TableActionButton } from "./tableActionButton";



type BillingInvoicesTableProps<T extends InvoicePageItem> = {
  invoices: T[];

  partnerColumnLabel: string;

  currentPage: number;
  totalPages: number;
  totalElements: number;
  loading?: boolean;
  onPageChange: (page: number) => void;

  onView: (invoice: T) => void;

  onEdit?: (invoice: T) => void;
  onDelete?: (invoice: T) => void;
  onSend?: (invoice: T) => void;

  onUpdateStatus?: (invoice: T) => void;
  canUpdateStatus?: (invoice: T) => boolean;

  getStatusLabel: (status: InvoiceStatus) => string;
  getStatusColor: (status: InvoiceStatus) => string;

  emptyMessage?: string;
};

function AmountCell({
  value,
  currency,
}: {
  value?: number | null;
  currency: "EUR" | "TND";
}) {
  return (
    <p className="whitespace-nowrap text-xs font-semibold text-slate-700">
      {value != null ? value.toLocaleString("fr-FR") : "—"}
      <span className="ml-1 text-[11px] font-medium text-slate-400">
        {currency}
      </span>
    </p>
  );
}

function StatusPill({
  status,
  getStatusLabel,
  getStatusColor,
}: {
  status: InvoiceStatus;
  getStatusLabel: (status: InvoiceStatus) => string;
  getStatusColor: (status: InvoiceStatus) => string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusColor(
        status
      )}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}

function ComplianceIcon({ isCompliant }: { isCompliant?: boolean | null }) {
  return (
    <div className="flex justify-center">
      {isCompliant ? (
        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      ) : (
        <Circle className="h-4 w-4 text-slate-300" />
      )}
    </div>
  );
}



export function BillingInvoicesTable<T extends InvoicePageItem>({
  invoices,
  partnerColumnLabel,
  currentPage,
  totalPages,
  totalElements,
  loading = false,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  onSend,
  onUpdateStatus,
  canUpdateStatus,
  getStatusLabel,
  getStatusColor,
  emptyMessage = "Aucune facture trouvée.",
}: BillingInvoicesTableProps<T>) {
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white mt-5 shadow-sm font-[Inter,system-ui,sans-serif]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse">
          <thead className="bg-slate-50">
            <tr>
              {[
                "Référence",
                partnerColumnLabel,
                "Statut",
                "Montant TTC EUR",
                "Montant TTC TND",
                "Date",
                "Conforme",
                "Actions",
              ].map((column) => (
                <th
                  key={column}
                  className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-12">
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-6 text-center">
                    <p className="text-sm font-semibold text-slate-500">
                      {emptyMessage}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Essayez de modifier vos filtres ou votre recherche.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => {
                const statusUpdateDisabled =
                  !onUpdateStatus ||
                  (canUpdateStatus ? !canUpdateStatus(invoice) : false);

                return (
                  <tr
                    key={invoice.idInvoice}
                    className="transition-colors hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-3.5">
                      <button
                        type="button"
                        onClick={() => onView(invoice)}
                        className="text-xs font-bold text-blue-600 transition hover:text-blue-800 hover:underline underline-offset-4"
                      >
                        {invoice.invoiceNumber}
                      </button>
                    </td>

                    <td className="px-5 py-3.5">
                      <p className="max-w-[220px] truncate text-xs font-semibold text-slate-800">
                        {invoice.partner?.name ?? "—"}
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
                      <AmountCell
                        value={invoice.totalInclTaxEUR}
                        currency="EUR"
                      />
                    </td>

                    <td className="px-5 py-3.5">
                      <AmountCell
                        value={invoice.totalInclTaxTND}
                        currency="TND"
                      />
                    </td>

                    <td className="px-5 py-3.5">
                      <p className="whitespace-nowrap text-xs font-medium text-slate-600">
                        {formatDateLong(invoice.dueDate ?? invoice.issueDate)}
                      </p>
                    </td>

                    <td className="px-5 py-3.5 text-center">
                      <ComplianceIcon
                      //  isCompliant={invoice.invoiceComplianceStatus}
                      />
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <TableActionButton
                          title="Voir"
                          icon={Eye}
                          variant="blue"
                          onClick={() => onView(invoice)}
                        />

                    {onEdit && (
                        <TableActionButton
                            title="Modifier"
                            icon={Edit}
                            variant="amber"
                            onClick={() => onEdit(invoice)}
                        />
                    )}

                    {onSend && (
                        <TableActionButton
                            title="Envoyer"
                            icon={Send}
                            variant="emerald"
                            onClick={() => onSend(invoice)}
                        />
                    )}

                    {onUpdateStatus && (
                        <TableActionButton
                            title="Mettre à jour le statut"
                            icon={Settings}
                            variant="violet"
                            disabled={statusUpdateDisabled}
                            onClick={() => onUpdateStatus(invoice)}
                        />
                    )}

                    {onDelete && (
                        <TableActionButton
                            title="Supprimer"
                            icon={Trash2}
                            variant="danger"
                            onClick={() => onDelete(invoice)}
                        />
                    )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 0 && (
        <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={!canGoPrevious || loading}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, index) => {
                const page = index + 1;

                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => onPageChange(page)}
                    disabled={loading}
                    className={`h-8 min-w-8 rounded-lg px-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      currentPage === page
                        ? "bg-slate-900 text-white shadow-sm"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!canGoNext || loading}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {totalElements > 0 && (
            <p className="text-xs font-semibold text-slate-500">
              {totalElements} facture{totalElements > 1 ? "s" : ""}
            </p>
          )}
        </div>
      )}
    </div>
  );
}