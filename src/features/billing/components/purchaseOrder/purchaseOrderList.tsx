'use client';

import Link from "next/link";
import { DeleteInvoiceModal } from "../widgets/deleteInvoiceModal";
import { getClientPurchaseOrderAllowedNextStatuses, purchaseOrderStatusColors, purchaseOrderStatusLabels, purchaseOrderStatusSchema } from "../../types/purchaseOrderStatus";
import { usePurchaseOrderList } from "../../hooks/usePurchaseOrderList";
import PurchaseOrderModal, { PurchaseOrderModalContent } from "./purchaseOrderDetails";
import { MOCK_PARTNERS } from "../../mocks/clients-mocks";
import { mockInvoiceItems } from "../../mocks/invoice-items-mocks";
import { ChevronLeft, ChevronRight, Settings } from "lucide-react";
import { UpdateInvoiceStatusModal } from "../widgets/updateStatusModal";
import PageLoader from "@/shared/components/ui/pageLoader";
import { SendInvoiceModal } from "../widgets/sendInvoiceModal";
import { BillingPageHeader } from "../widgets/billingHeader";
import { StatusFilterBar } from "../widgets/billingFilterBar";
import { invoiceStatusSchema } from "../../types/invoiceStatus";
import { PurchaseOrderTable } from "../widgets/purchaseOrderTable";

export default function PurchaseOrderList() {

    const { router, search, setSearch, deleteOpen, setDeleteOpen, purchaseOrders, totalElements, totalPages, deletePurchaseOrder, setIdPurchaseOrder, idPurchaseOrder,updateLoading,setNextStatus,setUpdateLoading,nextStatus
        , filtre, setFiltre, invoiceRef, setInvoiceRef, open, setOpen,updateOpen,setUpdateOpen,selectedPurchaseOrder,setSelectedPurchaseOrder,updateStatus,     setCurrentPage,
    currentPage, openSendMail, setOpenSendMail,
    loading } = usePurchaseOrderList();

            const purchaseOrderStatus = purchaseOrderStatusSchema.options
            .map((status) => ({
                value: status,
                label: purchaseOrderStatusLabels[status],
            }));
    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            {/* Header */}
            <BillingPageHeader
            title="Commande Clients"
            description="Gestion des Bons de commande"
            createHref="/billing/purchaseOrder/clients/create"
            createLabel="Nouvelle Commande"
            />

            <DeleteInvoiceModal
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                invoiceRef={invoiceRef}
                onConfirm={async () => {
                    deletePurchaseOrder(idPurchaseOrder);
                    setDeleteOpen(false);
                }} />
            <PurchaseOrderModal
                open={open}
                title={`Bon de commande ${invoiceRef}`}
                onClose={() => setOpen(false)}>
                <PurchaseOrderModalContent
                    client={MOCK_PARTNERS[1]}
                    items={mockInvoiceItems}
                    purchaseOrderId={idPurchaseOrder}
                    onClose={() => setOpen(false)}
                />
            </PurchaseOrderModal>
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

            <SendInvoiceModal
                invoice={selectedPurchaseOrder}
                isOpen={openSendMail}
                onClose={() => setOpenSendMail(false)}
            />

            {/* Table card */}
                {/* Search + Filters */}

                <StatusFilterBar
                    search={search}
                    onSearchChange={setSearch}
                    selectedStatus={filtre}
                    onStatusChange={setFiltre}
                    defaultStatus={purchaseOrderStatusSchema.enum.ALL}
                    statuses={purchaseOrderStatus}
                    searchPlaceholder="Référence ou client..."
                />
            {/* Table */}
            <PurchaseOrderTable
                type="CLIENT"
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
                    router.push(`/billing/purchaseOrder/${purchaseOrder.idPurchaseOrder}/edit`);
                }}
                onUpdateStatus={(purchaseOrder) => {
                    setSelectedPurchaseOrder(purchaseOrder);
                    setIdPurchaseOrder(purchaseOrder.idPurchaseOrder);
                    setUpdateOpen(true);
                }}
                onSend={(purchaseOrder) => {
                    setSelectedPurchaseOrder(purchaseOrder);
                    setOpenSendMail(true);
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