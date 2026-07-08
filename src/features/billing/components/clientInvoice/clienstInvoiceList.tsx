'use client';

import StatClientInvoiceCard from "@/shared/components/ui/statClientInvoiceCard";
import { useClientInvoiceList } from "../../hooks/useClientsInvoiveList";
import { getClientInvoiceAllowedNextStatuses, invoiceStatusColors, invoiceStatusLabels, invoiceStatusSchema } from "../../types/invoiceStatus";
import { DeleteInvoiceModal } from "../widgets/deleteInvoiceModal";
import { SendDocumentModal } from "../widgets/sendInvoiceModal";
import { BillingPageHeader } from "../widgets/billingHeader";
import { StatusFilterBar } from "../widgets/billingFilterBar";
import { BillingTable } from "../widgets/billingTable";
import { InvoicePageItem } from "../../models/invoice";
import { Status, UpdateDocumentStatusModal } from "../widgets/updateStatusModal";

export default function ClientsInvoiceList() {

    const { router, search, setSearch, open, setOpen, deleteOpen, setDeleteOpen,
        filtre, setFiltre, invoiceRef, clientsInvoices,
        currentPage,
        setCurrentPage,
        totalElements,
        totalPages,
        deleteLoading,
        updateLoading,
        updateOpen,
        nextStatus,
        setNextStatus,
        updateStatus,
        setInvoiceId,
        deleteClientInvoice,
        setUpdateOpen,

        selectedInvoice, setSelectedInvoice,

        loading, clientInvoiceStats } = useClientInvoiceList();

    const invoiceStatuses = invoiceStatusSchema.options
        .filter(
            (status) =>
                status !== invoiceStatusSchema.enum.REFUNDED &&
                status !== invoiceStatusSchema.enum.NOT_REFUNDED &&
                status !== invoiceStatusSchema.enum.IN_PROGRESS &&
                status !== invoiceStatusSchema.enum.TO_PAY
        )
        .map((status) => ({
            value: status,
            label: invoiceStatusLabels[status],
        }));
    return (
        <div className="min-h-screen p-8 font-sans">
            <SendDocumentModal
                document={selectedInvoice}
                variant="invoice"
                isOpen={open}
                onClose={() => setOpen(false)}
            />
            {/* Header */}
            <BillingPageHeader
                title="Factures Clients"
                description="Gestion des factures de vente"
                createHref="/billing/invoices/clients/create"
                createLabel="Nouvelle facture client"
            />
            {/* Stats */}
            <div className="flex gap-4 mb-8">
                <StatClientInvoiceCard
                    icon={
                        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                        </svg>
                    }
                    label="Total Année 2026"
                    eur={clientInvoiceStats.totalAmountEUR}
                    tnd={clientInvoiceStats.totalAmountTND}
                    sub="Payé + À Encaisser"
                    variant="blue"
                />
                <StatClientInvoiceCard
                    icon={
                        <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <circle cx="12" cy="12" r="9" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
                        </svg>
                    }
                    label="À Encaisser 2026"
                    eur={clientInvoiceStats.pendingAmountEUR}
                    tnd={clientInvoiceStats.pendingAmountTND}
                    sub={`${clientInvoiceStats.pendingInvoices} factures`}
                    variant="amber"
                />
                <StatClientInvoiceCard
                    icon={
                        <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <rect x="3" y="4" width="18" height="18" rx="2" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4M3 10h18" />
                        </svg>
                    }
                    label="Mois en Cours"
                    eur={clientInvoiceStats.pendingAmountEUR}
                    tnd={clientInvoiceStats.pendingAmountTND}
                    sub={`${clientInvoiceStats.pendingInvoices} factures`}
                    variant="emerald"
                />
                <DeleteInvoiceModal
                    documentType="invoice"
                    open={deleteOpen}
                    onClose={() => setDeleteOpen(false)}
                    documentRef={selectedInvoice?.invoiceNumber}
                    onConfirm={deleteClientInvoice}
                    loading={deleteLoading} />

            </div>
            <UpdateDocumentStatusModal
                documentType="invoice"
                open={updateOpen}
                onClose={() => setUpdateOpen(false)}
                onConfirm={updateStatus}
                documentNumber={selectedInvoice?.invoiceNumber}
                currentStatus={selectedInvoice?.invoiceStatus}
                nextStatus={nextStatus as Status}
                onNextStatusChange={setNextStatus}
                allowedStatuses={
                    selectedInvoice
                        ? getClientInvoiceAllowedNextStatuses(selectedInvoice.invoiceStatus)
                        : []
                }
                isSubmitting={updateLoading}
            />

            {/* Table card */}
            <StatusFilterBar
                search={search}
                onSearchChange={setSearch}
                selectedStatus={filtre}
                onStatusChange={setFiltre}
                defaultStatus={invoiceStatusSchema.enum.ALL}
                statuses={invoiceStatuses}
                searchPlaceholder="Référence ou client..."
                onDownloadAll={()=>console.log("DownloadALL")}
                onDownloadCurrentYear={()=>console.log("onDownloadCurrentYear")}
                onDownloadFitered={()=>console.log("onDownloadFitered")}
            />
            {/* Table */}

                <BillingTable<InvoicePageItem>
                    items={clientsInvoices}
                    variant="invoice"
                    secondColumnLabel="Client"
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalElements={totalElements}
                    loading={loading}
                    onPageChange={setCurrentPage}
                    onView={(invoice) => {
                        router.push(`/billing/invoices/clients/${invoice.idInvoice}/details/`);
                    }}
                    onUpdateStatus={(invoice) => {
                        setSelectedInvoice(invoice);
                        setInvoiceId(invoice.idInvoice);
                        setUpdateOpen(true);
                    }}
                    canUpdateStatus={(invoice) =>
                        getClientInvoiceAllowedNextStatuses(invoice.invoiceStatus).length > 0
                    }
                    onEdit={(invoice) => {
                        router.push(`/billing/invoices/clients/${invoice.idInvoice}/edit`);
                    }}
                    onSend={(invoice) => {
                        
                        setSelectedInvoice(invoice);
                        setInvoiceId(invoice.idInvoice);
                        setOpen(true);
                    }}
                    onDelete={(invoice) => {
                        setSelectedInvoice(invoice);
                        setInvoiceId(invoice.idInvoice);
                        setDeleteOpen(true);
                    }}
                    getNumber={(invoice) => invoice.invoiceNumber}
                    getPartnerName={(invoice) => invoice.partner?.companyName}
                    getStatus={(invoice) => invoice.invoiceStatus}
                    getAmountEUR={(invoice) => invoice.totalInclTaxEUR}
                    getAmountTND={(invoice) => invoice.totalInclTaxTND}
                    getDate={(invoice) => invoice.dueDate ?? invoice.issueDate}
                    getStatusLabel={(status) => invoiceStatusLabels[status]}
                    getStatusColor={(status) =>
                        status !== "ALL" ? invoiceStatusColors[status] : ""
                    }
                />
        </div>


    );
}