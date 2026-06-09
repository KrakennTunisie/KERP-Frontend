'use client';

import Link from "next/link";
import { DeleteInvoiceModal } from "../widgets/deleteInvoiceModal";
import { getClientPurchaseOrderAllowedNextStatuses, purchaseOrderStatusColors, purchaseOrderStatusLabels, purchaseOrderStatusSchema } from "../../types/purchaseOrderStatus";
import { usePurchaseOrderList } from "../../hooks/usePurchaseOrderList";
import PurchaseOrderModal, { PurchaseOrderModalContent } from "./purchaseOrderDetails";
import { useSupplierPurchaseOrderList } from "../../hooks/useSupplierPurchaseOrderList";
import { currencyTypeSchema } from "../../types/currency";
import { UpdateInvoiceStatusModal } from "../widgets/updateStatusModal";
import { ChevronLeft, ChevronRight, Settings } from "lucide-react";
import SupplierPurchaseOrderModal, { SupplierPurchaseOrderModalContent } from "./supplierPurchaseOrderDetails";
import PageLoader from "@/shared/components/ui/pageLoader";
import { BillingPageHeader } from "../widgets/billingHeader";
import { PurchaseOrderTable } from "../widgets/purchaseOrderTable";
import { StatusFilterBar } from "../widgets/billingFilterBar";
import { SendDocumentModal } from "../widgets/sendInvoiceModal";

export default function SuppliersPurchaseOrderList() {

    const { router, search, setSearch, deleteOpen, setDeleteOpen, purchaseOrders, selectedPurchaseOrder, idPurchaseOrder, setUpdateOpen, updateLoading, updateOpen, setIdPurchaseOrder
        , updateStatus, nextStatus, setNextStatus, setSelectedPurchaseOrder, deletePurchaseOrder,
        filtre, setFiltre, invoiceRef, setInvoiceRef, open, setOpen,
        setCurrentPage, openSendMail, setOpenSendMail,
        currentPage,
        totalElements,
        totalPages,
        loading } = useSupplierPurchaseOrderList();


    const purchaseOrderStatus = purchaseOrderStatusSchema.options
        .map((status) => ({
            value: status,
            label: purchaseOrderStatusLabels[status],
        }));
    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            {/* Header */}
            <BillingPageHeader
                title="Bon de commande Fournisseurs"
                description="Consultation et suivi des bons de commandes d’achat"
                createHref="/billing/purchaseOrder/suppliers/create"
                createLabel="Nouvelle Commande"
            />

            <DeleteInvoiceModal
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                invoiceRef={invoiceRef}
                onConfirm={async () => {
                    deletePurchaseOrder(idPurchaseOrder)
                    setDeleteOpen(false);
                }} />
            <SendDocumentModal
                    document={selectedPurchaseOrder}
                    variant="purchaseOrder"
                    isOpen={openSendMail}
                    onClose={() => setOpenSendMail(false)}
                />
            <SupplierPurchaseOrderModal
                open={open}
                title={`Bon de commande ${invoiceRef}`}
                onClose={() => setOpen(false)}>
                <SupplierPurchaseOrderModalContent
                    purchaseOrderId={idPurchaseOrder}
                    onClose={() => setOpen(false)}
                />
            </SupplierPurchaseOrderModal>
            <UpdateInvoiceStatusModal
                open={updateOpen}
                onClose={() => setUpdateOpen(false)}
                onConfirm={updateStatus}
                invoiceNumber={selectedPurchaseOrder?.purchaseOrderNumber}
                currentStatus={selectedPurchaseOrder?.purchaseOrderStatus}
                nextStatus={nextStatus}
                type="purchaseOrder"
                onNextStatusChange={setNextStatus}
                allowedStatuses={
                    selectedPurchaseOrder
                        ? getClientPurchaseOrderAllowedNextStatuses(selectedPurchaseOrder.purchaseOrderStatus)
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
                defaultStatus={purchaseOrderStatusSchema.enum.ALL}
                statuses={purchaseOrderStatus}
                searchPlaceholder="Référence ou client..."
            />
            <PurchaseOrderTable
                type="SUPPLIER"
                loading={loading}
                purchaseOrders={purchaseOrders}
                currentPage={currentPage}
                totalPages={totalPages}
                totalElements={totalElements}
                onPageChange={setCurrentPage}
                getAllowedNextStatuses={getClientPurchaseOrderAllowedNextStatuses}
                onView={(purchaseOrder) => {
                    setOpen(true);
                    setIdPurchaseOrder(purchaseOrder.idPurchaseOrder);
                    setInvoiceRef(purchaseOrder.purchaseOrderNumber);
                }}
                onEdit={(purchaseOrder) => {
                    router.push(`/billing/purchaseOrder/suppliers/${purchaseOrder.idPurchaseOrder}/edit`);
                }}
                onSend={(purchaseOrder) => {
                    setSelectedPurchaseOrder(purchaseOrder);
                    setOpenSendMail(true);
                }}
                onUpdateStatus={(purchaseOrder) => {
                    setSelectedPurchaseOrder(purchaseOrder);
                    setIdPurchaseOrder(purchaseOrder.idPurchaseOrder);
                    setUpdateOpen(true);
                }}
                onDelete={(purchaseOrder) => {
                    setDeleteOpen(true);
                    setInvoiceRef(purchaseOrder.purchaseOrderNumber);
                    setIdPurchaseOrder(purchaseOrder.idPurchaseOrder);
                }}
            />
        </div>

    );
}