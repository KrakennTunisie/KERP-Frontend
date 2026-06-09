"use client";

import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import { InvoiceStatus } from "../../types/invoiceStatus";
import { InvoiceTableRow } from "./invoiceTableRow";

type BillingTableVariant = "invoice" | "payment" | "invoiceCreditNotes";

type BillingTableProps<T> = {
  items: T[];
  variant: BillingTableVariant;

  secondColumnLabel: string;

  currentPage: number;
  totalPages: number;
  totalElements: number;
  loading?: boolean;
  onPageChange: (page: number) => void;

  onView: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onSend?: (item: T) => void;

  onUpdateStatus?: (item: T) => void;
  canUpdateStatus?: (item: T) => boolean;

  getNumber: (item: T) => string;
  getDate: (item: T) =>  Date| undefined;

  getPartnerName?: (item: T) => string | null | undefined;
  getStatus?: (item: T) => InvoiceStatus | null | undefined;

  getAmountEUR?: (item: T) => number | null | undefined;
  getAmountTND?: (item: T) => number | null | undefined;

  getPaymentMethod?: (item: T) => string | null | undefined;
  getRelatedInvoiceNumber?: (item: T) => string | null | undefined;

  getStatusLabel?: (status: InvoiceStatus) => string;
  getStatusColor?: (status: InvoiceStatus) => string;

  emptyMessage?: string;
};

export function BillingTable<T>({
  items,
  variant,
  secondColumnLabel,
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
  getNumber,
  getDate,
  getPartnerName,
  getStatus,
  getAmountEUR,
  getAmountTND,
  getPaymentMethod,
  getRelatedInvoiceNumber,
  getStatusLabel,
  getStatusColor,
  emptyMessage,
}: BillingTableProps<T>) {
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const isPayment = variant === "payment";
  const isInvoiceCreditNote = variant === "invoiceCreditNotes";

  const columns = isPayment
    ? [
        "Référence",
        secondColumnLabel,
        "Méthode",
        "Montant EUR",
        "Montant TND",
        "Date",
        "Conforme",
        "Actions",
      ]
    : [
        "Référence",
        secondColumnLabel,
        "Statut",
        isInvoiceCreditNote ? "Montant avoir EUR" : "Montant TTC EUR",
        isInvoiceCreditNote ? "Montant avoir TND" : "Montant TTC TND",
        "Date",
        "Conforme",
        "Actions",
      ];

  const defaultEmptyMessage = isPayment
    ? "Aucun paiement trouvé."
    : isInvoiceCreditNote
      ? "Aucune facture d'avoir trouvée."
      : "Aucune facture trouvée.";

  const totalLabel = isPayment
    ? "paiement"
    : isInvoiceCreditNote
      ? "facture d'avoir"
      : "facture";

  return (
    <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white font-[Inter,system-ui,sans-serif] shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
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
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12">
                  <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                    <p className="text-sm font-semibold">
                      Chargement des données...
                    </p>
                  </div>
                </td>
              </tr>
            ): items.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-12">
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-6 text-center">
                    <p className="text-sm font-semibold text-slate-500">
                      {emptyMessage ?? defaultEmptyMessage}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Essayez de modifier vos filtres ou votre recherche.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <InvoiceTableRow<T>
                  key={getNumber(item)}
                  item={item}
                  variant={variant}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onSend={onSend}
                  onUpdateStatus={onUpdateStatus}
                  canUpdateStatus={canUpdateStatus}
                  getNumber={getNumber}
                  getPartnerName={getPartnerName}
                  getStatus={getStatus}
                  getAmountEUR={getAmountEUR}
                  getAmountTND={getAmountTND}
                  getDate={getDate}
                  getPaymentMethod={getPaymentMethod}
                  getRelatedInvoiceNumber={getRelatedInvoiceNumber}
                  getStatusLabel={getStatusLabel}
                  getStatusColor={getStatusColor}
                />
              ))
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
              {totalElements} {totalLabel}
              {totalElements > 1 ? "s" : ""}
            </p>
          )}
        </div>
      )}
    </div>
  );
}