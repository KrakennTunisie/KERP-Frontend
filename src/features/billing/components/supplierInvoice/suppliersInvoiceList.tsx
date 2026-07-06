'use client';

import StatClientInvoiceCard from "@/shared/components/ui/statClientInvoiceCard";
import useSupplierInvoiceList from "../../hooks/useSupplierInvoiceList";
import { InvoicePageItem } from "../../models/invoice";
import { getSupplierInvoiceAllowedNextStatuses, invoiceStatusColors, invoiceStatusLabels, invoiceStatusSchema } from "../../types/invoiceStatus";
import { StatusFilterBar } from "../widgets/billingFilterBar";
import { BillingPageHeader } from "../widgets/billingHeader";
import { BillingTable } from "../widgets/billingTable";
import { Status, UpdateDocumentStatusModal } from "../widgets/updateStatusModal";
import { DeleteInvoiceModal } from "../widgets/deleteInvoiceModal";
import UploadInvoiceModal from "../widgets/uploadInvoiceModal";
import InvoiceFormModal from "./createSupplierInvoice";


export default function SuppliersInvoiceList() {

    const { router, search, setSearch, filtre, setFiltre, suppliersInvoices,
        currentPage, setCurrentPage, totalElements, totalPages,
        setInvoiceId,
        setUpdateOpen,
        updateOpen,
        updateLoading,
        updateStatus, invoiceRef, handleUpload,
        selectedInvoice, setSelectedInvoice, deleteSupplierInvoice,
        nextStatus, setNextStatus, deleteOpen, deleteLoading, setDeleteOpen,
        loading, suppliersInvoiceStats, isUploadInvoiceOpen, setIsUploadInvoiceOpen } = useSupplierInvoiceList();
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
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            {/* Header */}
            <BillingPageHeader
                title="Factures Fournisseurs"
                description="Consultation et suivi des factures d’achat"
                createLabel="Nouvelle facture fournisseur"
                onCreateClick={() => setIsUploadInvoiceOpen(true)}
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
                    eur={suppliersInvoiceStats.totalAmountEUR}
                    tnd={suppliersInvoiceStats.totalAmountTND}
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
                    eur={suppliersInvoiceStats.pendingAmountEUR}
                    tnd={suppliersInvoiceStats.pendingAmountTND}
                    sub={`${suppliersInvoiceStats.pendingInvoices} factures`}
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
                    eur={suppliersInvoiceStats.pendingAmountEUR}
                    tnd={suppliersInvoiceStats.pendingAmountTND}
                    sub={`${suppliersInvoiceStats.pendingInvoices} factures`}
                    variant="emerald"
                />
            </div>

            <DeleteInvoiceModal
                documentType="invoice"
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                documentRef={invoiceRef}
                onConfirm={deleteSupplierInvoice}
                loading={deleteLoading} />

            {/* Search + Filters */}
            <StatusFilterBar
                search={search}
                onSearchChange={setSearch}
                selectedStatus={filtre}
                onStatusChange={setFiltre}
                defaultStatus={invoiceStatusSchema.enum.TO_COLLECT}
                statuses={invoiceStatuses}
                searchPlaceholder="Référence ou client..."
                onDownloadAll={() => console.log("DownloadALL")}
                onDownloadCurrentYear={() => console.log("onDownloadCurrentYear")}
                onDownloadFitered={() => console.log("onDownloadFitered")}
            />

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
                        ? getSupplierInvoiceAllowedNextStatuses(selectedInvoice.invoiceStatus)
                        : []
                }
                isSubmitting={updateLoading}
            />

            {/* Table */}
            <BillingTable<InvoicePageItem>
                items={suppliersInvoices}
                variant="invoice"
                secondColumnLabel="Client"
                currentPage={currentPage}
                totalPages={totalPages}
                totalElements={totalElements}
                loading={loading}
                onPageChange={setCurrentPage}
                onView={(invoice) => {
                    router.push(`/billing/invoices/suppliers/details/${invoice.idInvoice}`);
                }}
                onUpdateStatus={(invoice) => {
                    setSelectedInvoice(invoice);
                    setInvoiceId(invoice.idInvoice);
                    setUpdateOpen(true);
                }}
                canUpdateStatus={(invoice) =>
                    getSupplierInvoiceAllowedNextStatuses(invoice.invoiceStatus).length > 0
                }
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


            <UpdateDocumentStatusModal
                open={updateOpen}
                onClose={() => setUpdateOpen(false)}
                onConfirm={updateStatus}
                documentNumber={selectedInvoice?.invoiceNumber}
                currentStatus={selectedInvoice?.invoiceStatus}
                documentType="invoice"
                nextStatus={nextStatus as Status}
                onNextStatusChange={setNextStatus}
                allowedStatuses={
                    selectedInvoice
                        ? getSupplierInvoiceAllowedNextStatuses(selectedInvoice.invoiceStatus)
                        : []
                }
                isSubmitting={updateLoading}
            />

            <UploadInvoiceModal
                open={isUploadInvoiceOpen}
                loading={loading}
                onClose={() => setIsUploadInvoiceOpen(false)}
                onUpload={handleUpload}
            />

        </div>

    );
}