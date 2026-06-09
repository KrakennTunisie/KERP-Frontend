import {  ReceiptText, RefreshCw } from "lucide-react";

import Card from "./card";
import { BillingTable } from "./billingTable";
import { InvoiceCreditNotePageItem } from "../../models/creditNote";
import { InvoiceStatus, invoiceStatusColors, invoiceStatusLabels, invoiceStatusSchema } from "../../types/invoiceStatus";
import { useCreditNoteListTab } from "../../hooks/useCreditNoteListTab";
import Link from "next/link";
import { StatusFilterBar } from "./billingFilterBar";
import { DeleteInvoiceModal } from "./deleteInvoiceModal";
import { SendDocumentModal } from "./sendInvoiceModal";

type InvoiceCreditNotesTabProps = {
  invoiceId: string;
  type: "CLIENT" | "SUPPLIER";
};

export function InvoiceCreditNotesTab({
  invoiceId,
  type,
}: InvoiceCreditNotesTabProps) {
    const {   router,
     search,
     setSearch,
     open,
     setOpen,
     deleteOpen,
     setDeleteOpen,
     filtre,
     setFiltre,
     creditNoteRef,
     onDelete,
     creditNotes,
     currentPage,
     setCurrentPage,
     totalElements,
     totalPages,
     loading,
     setDeleteId,
     selectedCreditNote, setSelectedCreditNote,
    refresh}= useCreditNoteListTab({invoiceId, type})

            const invoiceStatuses = invoiceStatusSchema.options
            .filter(
                (status) =>
                status !== invoiceStatusSchema.enum.PARTIALLY_PAID &&
                status !== invoiceStatusSchema.enum.PAID &&
                status !== invoiceStatusSchema.enum.TO_COLLECT &&
                status !== invoiceStatusSchema.enum.TO_PAY &&
                status !== invoiceStatusSchema.enum.DRAFT            )
            .map((status) => ({
                value: status,
                label: invoiceStatusLabels[status],
            }));

  return (
    <Card>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
            <p className="text-base font-bold text-slate-900">
            Factures d’avoir liées
            </p>
            <p className="mt-1 text-sm text-slate-500">
            Consultez, modifiez ou envoyez les avoirs associés à cette facture.
            </p>
        </div>

        <div className="flex w-fit flex-wrap items-center gap-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 ring-1 ring-rose-100">
            <ReceiptText className="h-3.5 w-3.5" />
            {totalElements} avoir(s)
        </div>

        <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="
            inline-flex items-center gap-1.5
            rounded-lg border border-slate-200 bg-white
            px-3 py-2 text-xs font-semibold text-slate-600
            shadow-sm transition
            hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900
            disabled:cursor-not-allowed disabled:opacity-60
            "
        >
            <RefreshCw
            className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
            />
            Rafraîchir
        </button>

        {type === "CLIENT" && (
            <Link
            href={`/billing/invoices/clients/${invoiceId}/credit-note/create`}
            className="
                inline-flex items-center gap-1.5
                rounded-lg bg-red-500 px-3 py-2
                text-xs font-semibold text-white shadow-sm
                transition-colors hover:bg-red-700
            "
            >
            <span className="text-sm leading-none">+</span>
            {"Nouvelle Facture d'avoir"}
            </Link>
        )}
        </div>
        </div>

                    <StatusFilterBar
                        search={search}
                        onSearchChange={setSearch}
                        selectedStatus={filtre}
                        onStatusChange={setFiltre}
                        defaultStatus={invoiceStatusSchema.enum.ALL}
                        statuses={invoiceStatuses}
                        searchPlaceholder="Référence ou client..."
                    />

      <BillingTable<InvoiceCreditNotePageItem>
        items={creditNotes}
        variant="invoiceCreditNotes"
        secondColumnLabel={"Facture"}
        currentPage={currentPage}
        totalPages={totalPages}
        totalElements={totalElements}
        loading={loading}
        onPageChange={setCurrentPage}
        onView={(creditNote) =>
           type=="CLIENT" ?
                router.push(`/billing/invoices/clients/${invoiceId}/credit-note/${creditNote.invoiceCreditNoteNumber}`)
            :router.push(`/billing/invoices/suppliers/${invoiceId}/credit-note/${creditNote.invoiceCreditNoteNumber}`)
        }
        onSend={(creditNote) =>
          {  setOpen(true);  setSelectedCreditNote(creditNote) }
        }
        onDelete={(creditNote)=>{
            setDeleteId(creditNote.idInvoiceCreditNote);
            setDeleteOpen(true)
        }}
        getNumber={(creditNote) => creditNote.invoiceCreditNoteNumber}
        getDate={(creditNote) => creditNote.issueDate}
        getPartnerName={(creditNote) => creditNote.invoice.invoiceNumber}
        getStatus={(creditNote) => creditNote.invoiceCreditNoteStatus}
        getAmountEUR={(creditNote) => creditNote.totalInclTaxEUR}
        getAmountTND={(creditNote) => creditNote.totalInclTaxTND}
        getStatusLabel={(status) => invoiceStatusLabels[status]}
        getStatusColor={(status: InvoiceStatus) => status === "ALL" ? "bg-slate-100 text-slate-700" : invoiceStatusColors[status]}
        canUpdateStatus={(creditNote) =>
          creditNote.invoiceCreditNoteStatus !== "CANCELLED"
        }
        emptyMessage="Aucune facture d’avoir liée à cette facture."
      />

                  <DeleteInvoiceModal
                      open={deleteOpen}
                      onClose={() => setDeleteOpen(false)}
                      invoiceRef={creditNoteRef}
                      onConfirm={()=>onDelete()} />
                  
                  <SendDocumentModal
                      document={selectedCreditNote ?? null}
                      variant="invoiceCreditNote"
                      isOpen={open}
                      onClose={() => setOpen(false)}
                  />
    </Card>
  );
}