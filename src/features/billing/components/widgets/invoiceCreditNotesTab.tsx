import { ReceiptText, RefreshCw } from "lucide-react";

import Card from "./card";
import { BillingTable } from "./billingTable";
import { InvoiceCreditNotePageItem } from "../../models/creditNote";
import { getCreditNoteAllowedNextStatuses, InvoiceStatus, invoiceStatusColors, invoiceStatusLabels, invoiceStatusSchema } from "../../types/invoiceStatus";
import { useCreditNoteListTab } from "../../hooks/useCreditNoteListTab";
import Link from "next/link";
import { StatusFilterBar } from "./billingFilterBar";
import { DeleteInvoiceModal } from "./deleteInvoiceModal";
import { SendDocumentModal } from "./sendInvoiceModal";
import { Status, UpdateDocumentStatusModal } from "./updateStatusModal";
import { ArchiveInvoiceModal } from "./archiveModal";

type InvoiceCreditNotesTabProps = {
  invoiceId: string;
  type: "CLIENT" | "SUPPLIER";
  isDisabled: boolean,
};

export function InvoiceCreditNotesTab({
  invoiceId,
  type,
  isDisabled
}: InvoiceCreditNotesTabProps) {
  const { router,
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
    archiveOpen, setArchiveOpen,
    setDeleteId, updateLoading, updateStatus,
    selectedCreditNote, setSelectedCreditNote,
    nextStatus, setNextStatus, fetchCreditNotes,
    loadingArchive, setLoadingArchive, ArchiveInvoice,
    updateStatusOpen, setUpdateStatusOpen,
    refresh } = useCreditNoteListTab({ invoiceId, type })

  const invoiceStatuses = invoiceStatusSchema.options
    .filter(
      (status) =>
        status !== invoiceStatusSchema.enum.PARTIALLY_PAID &&
        status !== invoiceStatusSchema.enum.PAID &&
        status !== invoiceStatusSchema.enum.TO_COLLECT &&
        status !== invoiceStatusSchema.enum.TO_PAY &&
        status !== invoiceStatusSchema.enum.OVERDUE &&
        status !== invoiceStatusSchema.enum.DRAFT)
    .map((status) => ({
      value: status,
      label: invoiceStatusLabels[status],
    }));

  return (
    <Card>
      {/* Header */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <p className="text-sm font-semibold text-slate-900">
            Factures d’avoir liées
          </p>
          <p className="text-xs text-slate-500">
            Gérer les avoirs associés à cette facture
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">

          <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700 ring-1 ring-rose-100">
            <ReceiptText className="h-3 w-3" />
            {totalElements}
          </div>

          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>

          {type === "CLIENT" &&  (
            <Link
              href={`/billing/invoices/clients/${invoiceId}/credit-note/create`}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold text-white transition 
            ${isDisabled
                  ? "cursor-not-allowed bg-red-100 text-slate-500"
                  : "cursor-pointer bg-red-500 hover:bg-red-600"

                }
            
            `}
            >
              + Avoir
            </Link>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-3">
        <StatusFilterBar
          search={search}
          onSearchChange={setSearch}
          selectedStatus={filtre}
          onStatusChange={setFiltre}
          defaultStatus={invoiceStatusSchema.enum.ALL}
          statuses={invoiceStatuses}
          searchPlaceholder="Référence ou client..."
          onDownloadAll={() => console.log("DownloadALL")}
          onDownloadCurrentYear={() => console.log("onDownloadCurrentYear")}
          onDownloadFitered={() => console.log("onDownloadFitered")}
        />
      </div>
      <ArchiveInvoiceModal
        documentType="credit-note"
        open={archiveOpen}
        onClose={() => setArchiveOpen(false)}
        documentRef={selectedCreditNote?.invoiceCreditNoteNumber}
        onConfirm={async () => {
          await ArchiveInvoice()
          await fetchCreditNotes()
        }}
        loading={loadingArchive} />
      {/* Table */}
      <BillingTable<InvoiceCreditNotePageItem>
        items={creditNotes}
        variant="invoiceCreditNotes"
        secondColumnLabel="Facture"
        currentPage={currentPage}
        totalPages={totalPages}
        totalElements={totalElements}
        loading={loading}
        onPageChange={setCurrentPage}
        onView={(creditNote) =>
          type === "CLIENT"
            ? router.push(
              `/billing/invoices/clients/${invoiceId}/credit-note/${creditNote.invoiceCreditNoteNumber}`
            )
            : router.push(
              `/billing/invoices/suppliers/${invoiceId}/credit-note/${creditNote.invoiceCreditNoteNumber}`
            )
        }
        onSend={(creditNote) => {
          if (creditNote.invoiceCreditNoteStatus == invoiceStatusSchema.enum.DRAFT) {
            setOpen(true);
            setSelectedCreditNote(creditNote);
          }
        }}
        onArchive={(creditNote) => {
          if (creditNote.invoiceCreditNoteStatus == invoiceStatusSchema.enum.REFUNDED || creditNote.invoiceCreditNoteStatus == invoiceStatusSchema.enum.CANCELLED) {
            setArchiveOpen(true);
            setSelectedCreditNote(creditNote);
          }
        }}
        onDelete={(creditNote) => {
          setDeleteId(creditNote.idInvoiceCreditNote);
          setSelectedCreditNote(creditNote)
          setDeleteOpen(true);
        }}
        onUpdateStatus={(creditNote) => {
          setSelectedCreditNote(creditNote);
          setUpdateStatusOpen(true)
        }}
        getNumber={(creditNote) => creditNote.invoiceCreditNoteNumber}
        getDate={(creditNote) => creditNote.issueDate}
        getPartnerName={(creditNote) => creditNote.invoice.invoiceNumber}
        getStatus={(creditNote) => creditNote.invoiceCreditNoteStatus}
        getCurrency={(creditNote) => creditNote.invoice.invoiceCurrency}
        getAmountEUR={(creditNote) => creditNote.totalInclTaxEUR}
        getAmountTND={(creditNote) => creditNote.totalInclTaxTND}
        getStatusLabel={(status) => invoiceStatusLabels[status]}
        getStatusColor={(status: InvoiceStatus) =>
          status === "ALL"
            ? "bg-slate-100 text-slate-700"
            : invoiceStatusColors[status]
        }
        canUpdateStatus={(creditNote) =>
          creditNote.invoiceCreditNoteStatus !== invoiceStatusSchema.enum.CANCELLED
          && creditNote.invoiceCreditNoteStatus !== invoiceStatusSchema.enum.ARCHIVED
        }
        emptyMessage="Aucun avoir lié"
      />

      {/* Modals */}
      <DeleteInvoiceModal
        documentType={"credit-note"}
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        documentRef={selectedCreditNote?.invoiceCreditNoteNumber}
        onConfirm={() => onDelete()}
      />

      <SendDocumentModal
        document={selectedCreditNote ?? null}
        variant="invoiceCreditNote"
        isOpen={open}
        onClose={async () => { setOpen(false); await fetchCreditNotes() }}
      />

      <UpdateDocumentStatusModal
        documentType="credit-note"
        open={updateStatusOpen}
        onClose={() => setUpdateStatusOpen(false)}
        onConfirm={updateStatus}
        documentNumber={selectedCreditNote?.invoiceCreditNoteNumber}
        currentStatus={selectedCreditNote?.invoiceCreditNoteStatus}
        nextStatus={nextStatus as Status}
        onNextStatusChange={setNextStatus}
        allowedStatuses={
          selectedCreditNote
            ? getCreditNoteAllowedNextStatuses(selectedCreditNote.invoiceCreditNoteStatus)
            : []
        }
        isSubmitting={updateLoading}
      />

    </Card>
  );
}