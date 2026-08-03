"use client";

import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import { InvoiceStatus } from "../../types/invoiceStatus";
import { InvoiceTableRow } from "./invoiceTableRow";
import { PaymentType } from "../../types/paymentStatus";

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
  onArchive?: (item: T) => void;
  onSend?: (item: T) => void;

  onUpdateStatus?: (item: T) => void;
  canUpdateStatus?: (item: T) => boolean;

  getNumber: (item: T) => string;
  getCurrency: (item: T) => string;
  getDate: (item: T) =>  Date| undefined;

  getPartnerName?: (item: T) => string | null | undefined;
  getPartnerEmail?: (item: T) => string | null | undefined;
  getStatus?: (item: T) => InvoiceStatus | null | undefined;
  getPaymentStatus?: (item: T) => PaymentType | null | undefined;

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
  onArchive,
  onSend,
  onUpdateStatus,
  canUpdateStatus,
  getNumber,
  getCurrency,
  getDate,
  getPartnerName,
  getPartnerEmail,
  getStatus,
  getPaymentStatus,
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
        "Montant",
       
        "Date",
      
        "Actions",
      ]
    : [
        "Référence",
        secondColumnLabel,
        "Statut",
        isInvoiceCreditNote ? "Montant avoir EUR" : "Montant TTC",
       
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

    <table className="w-full min-w-[950px] border-collapse">

      {/* HEADER */}
      <thead className="bg-slate-50">
        <tr>
          {columns.map((column) => (
            <th
              key={column}
              className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500"
            >
              {column}
            </th>
          ))}
        </tr>
      </thead>

      {/* BODY */}
      <tbody className="divide-y divide-slate-100">

        {loading ? (
          <tr>
            <td colSpan={columns.length} className="px-4 py-10">
              <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <p className="text-xs font-semibold">
                  Chargement des données...
                </p>
              </div>
            </td>
          </tr>

        ) : items.length === 0 ? (
          <tr>
            <td colSpan={8} className="px-4 py-10">
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-5 text-center">
                <p className="text-xs font-semibold text-slate-500">
                  {emptyMessage ?? defaultEmptyMessage}
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Ajustez vos filtres ou votre recherche.
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
              onArchive={onArchive}
              onSend={onSend}
              onUpdateStatus={onUpdateStatus}
              canUpdateStatus={canUpdateStatus}
              getNumber={getNumber}
              getCurrency={getCurrency}
              getPartnerName={getPartnerName}
              getPartnerEmail={getPartnerEmail}
              getStatus={getStatus}
              getPaymentStatus={getPaymentStatus}
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

  {/* PAGINATION */}
  {totalPages > 0 && (
    <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

      <div className="flex items-center gap-1">

        {/* PREV */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious || loading}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>

        {/* PAGES */}
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }).map((_, index) => {
            const page = index + 1;

            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                disabled={loading}
                className={`h-7 min-w-7 rounded-md px-2 text-[11px] font-bold transition ${
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

        {/* NEXT */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext || loading}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>

      </div>

      {/* TOTAL */}
      {totalElements > 0 && (
        <p className="text-[11px] font-semibold text-slate-500">
          {totalElements} {totalLabel}{totalElements > 1 ? "s" : ""}
        </p>
      )}

    </div>
  )}

</div>
  );
}