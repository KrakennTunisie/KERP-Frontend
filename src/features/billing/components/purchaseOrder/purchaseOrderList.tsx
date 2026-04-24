'use client';

import Link from "next/link";
import { DeleteInvoiceModal } from "../widgets/deleteInvoiceModal";
import { getClientPurchaseOrderAllowedNextStatuses, purchaseOrderStatusColors, purchaseOrderStatusLabels, purchaseOrderStatusSchema } from "../../types/purchaseOrderStatus";
import { usePurchaseOrderList } from "../../hooks/usePurchaseOrderList";
import PurchaseOrderModal, { PurchaseOrderModalContent } from "./purchaseOrderDetails";
import { MOCK_PARTNERS } from "../../mocks/clients-mocks";
import { mockInvoiceItems } from "../../mocks/invoice-items-mocks";
import { Settings } from "lucide-react";
import { UpdateInvoiceStatusModal } from "../widgets/updateStatusModal";

export default function PurchaseOrderList() {

    const { router, search, setSearch, deleteOpen, setDeleteOpen, purchaseOrders, totalElements, totalPages, deletePurchaseOrder, setIdPurchaseOrder, idPurchaseOrder,updateLoading,setNextStatus,setUpdateLoading,nextStatus
        , filtre, setFiltre, invoiceRef, setInvoiceRef, open, setOpen,updateOpen,setUpdateOpen,selectedPurchaseOrder,setSelectedPurchaseOrder,updateStatus } = usePurchaseOrderList();
    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        Commande Clients
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Gestion des Bons de commande
                    </p>
                </div>
                <Link
                    href="/billing/purchaseOrder/create"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-bold px-6 py-3 rounded-xl shadow-md text-sm"
                >
                    <span className="text-lg leading-none">+</span>
                    Nouvelle Commande
                </Link>
            </div>

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

            {/* Table card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Search + Filters */}
                <div className="flex items-center gap-4 p-5 border-b border-slate-100">
                    <div className="relative flex-1">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <circle cx="11" cy="11" r="8" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Rechercher par référence ou client..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                        />
                    </div>
                    <div className="flex gap-2">
                        {purchaseOrderStatusSchema.options
                            .map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFiltre(f)}
                                    className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${filtre === f
                                        ? "bg-slate-900 text-white shadow"
                                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                                        }`}
                                >
                                    {purchaseOrderStatusLabels[f]}
                                </button>
                            ))}
                    </div>
                </div>
            </div>
            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-100">
                            {["RÉFÉRENCE", "CLIENT", "STATUT", "MONTANT TTC", "ACTIONS"].map((col) => (
                                <th
                                    key={col}
                                    className="px-5 py-3 text-left text-xs font-bold text-slate-400 tracking-widest uppercase"
                                >
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {purchaseOrders.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="text-center py-12 text-slate-400 text-sm">
                                    Aucune facture trouvée.
                                </td>
                            </tr>
                        ) : (
                            purchaseOrders.map((f) => (
                                <tr
                                    key={1}
                                    className="border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                    <td className="px-5 py-4 font-bold text-slate-800">
                                        {f.purchaseOrderNumber}
                                    </td>
                                    <td className="px-5 py-4 text-slate-700">{f.partner.name}</td>
                                    <td className="px-5 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${f.purchaseOrderStatus !== "ALL" ? purchaseOrderStatusColors[f.purchaseOrderStatus] : ""
                                            }}`}>
                                            {purchaseOrderStatusLabels[f.purchaseOrderStatus]}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-slate-700 font-medium">
                                        {f.totalInclTaxTND} {f.currency}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">

                                            {/* Voir */}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setOpen(true); setIdPurchaseOrder(f.idPurchaseOrder); setInvoiceRef(f.purchaseOrderNumber) }}
                                                className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                                title="Voir"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                                </svg>
                                            </button>

                                            {/* Modifier */}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); console.log("edit", f.idPurchaseOrder); router.push(`/billing/purchaseOrder/${f.idPurchaseOrder}/edit`); }}
                                                className="p-2 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                                                title="Modifier"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                                                </svg>
                                            </button>
                                            {/* Modifier status */}
                                            <button
                                                onClick={(e) => { setSelectedPurchaseOrder(f); setIdPurchaseOrder(f.idPurchaseOrder); setUpdateOpen(true)}}
                                                disabled={getClientPurchaseOrderAllowedNextStatuses(f.purchaseOrderStatus).length === 0}
                                                className="p-2 rounded-xl bg-violet-50 text-violet-600 hover:bg-violet-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Mettre à jour le statut"
                                            >
                                                <Settings className="w-4 h-4" />
                                            </button>
                                            {/* Supprimer */}
                                            <button
                                                disabled={f.purchaseOrderStatus != purchaseOrderStatusSchema.enum.DRAFT}
                                                onClick={(e) => { setDeleteOpen(true); setInvoiceRef(f.purchaseOrderNumber); setIdPurchaseOrder(f.idPurchaseOrder); console.log("delete", f.idPurchaseOrder); }}
                                                className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Supprimer"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                            </button>

                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>

    );
}