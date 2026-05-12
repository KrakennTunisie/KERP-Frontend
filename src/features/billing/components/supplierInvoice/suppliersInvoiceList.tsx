'use client';

import StatClientInvoiceCard from "@/shared/components/ui/statClientInvoiceCard";
import useSupplierInvoiceList from "../../hooks/useSupplierInvoiceList";
import {  getSupplierInvoiceAllowedNextStatuses, invoiceStatusColors, invoiceStatusLabels, invoiceStatusSchema } from "../../types/invoiceStatus";
import { formatDateLong } from "@/shared/utils/formatDate";
import { ChevronLeft, ChevronRight, Settings } from "lucide-react";
import { UpdateInvoiceStatusModal } from "../widgets/updateStatusModal";


export default function SuppliersInvoiceList() {

    const { router, search, setSearch, filtre, setFiltre, suppliersInvoices, 
        currentPage, setCurrentPage, totalElements, totalPages,
        setInvoiceId,
        setUpdateOpen,
        updateOpen,
        updateLoading,
        updateStatus,
        selectedInvoice, setSelectedInvoice,
        nextStatus, setNextStatus,
        loading, suppliersInvoiceStats } = useSupplierInvoiceList();

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        Factures Fournisseurs
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {"Gestion des factures d'achat"}
                    </p>
                </div>
            </div>
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

            {/* Table card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Search + Filters */}
                <div className="flex flex-col gap-3 p-5 border-b border-slate-100">

                    {/* Ligne 1 : Search + Statuts */}
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <circle cx="11" cy="11" r="8" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Rechercher par référence ou fournisseur..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                            />
                        </div>
                        <div className="flex gap-2">
                            {invoiceStatusSchema.options.filter((f) => f === "TO_PAY" || f === "PAID" || f === "ALL").map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFiltre(f)}
                                    className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${filtre === f
                                        ? "bg-slate-900 text-white shadow"
                                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                                        }`}
                                >
                                    { invoiceStatusLabels[f]}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-100">
                            {["RÉFÉRENCE", "Fournisseur", "STATUT", "MONTANT HT (EUR)", "MONTANT HT (TND)", "DATE ÉCHÉANCE", "CONFORME", "ACTIONS"].map((col) => (
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
                        {suppliersInvoices.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="text-center py-12 text-slate-400 text-sm">
                                    Aucune facture trouvée.
                                </td>
                            </tr>
                        ) : (
                            suppliersInvoices.map((f, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                                >
                                    <td className="px-5 py-4 font-bold text-slate-800">
                                        {f.invoiceNumber}
                                    </td>
                                    <td className="px-5 py-4 text-slate-700">{f.partner.name}</td>
                                    <td className="px-5 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${f.invoiceStatus !== "ALL" ? invoiceStatusColors[f.invoiceStatus] : ""
                                            }}`}>
                                            { invoiceStatusLabels[f.invoiceStatus]}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-slate-700 font-medium">
                                        {f.totalInclTaxEUR!.toLocaleString("fr-FR")} €
                                    </td>
                                    <td className="px-5 py-4 text-slate-700 font-medium">
                                        {f.totalInclTaxTND!.toLocaleString("fr-FR")} TND
                                    </td>
                                    <td className="px-5 py-4 text-slate-600">{formatDateLong(f.issueDate)}</td>
                                    <td className="px-5 py-4 text-center">
                                        {f.invoiceComplianceStatus ? (
                                            <svg className="w-5 h-5 text-emerald-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5 text-slate-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <circle cx="12" cy="12" r="9" />
                                            </svg>
                                        )}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">

                                            {/* Voir */}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); console.log("view", f.idInvoice); router.push(`/billing/invoices/suppliers/details/${f.idInvoice}`) }}
                                                className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer"
                                                title="Voir"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                                </svg>
                                            </button>

                                           <button
                                                onClick={(e) => {setSelectedInvoice(f); setInvoiceId(f.idInvoice); setUpdateOpen(true)}}
                                                disabled={getSupplierInvoiceAllowedNextStatuses(f.invoiceStatus).length === 0}
                                                className="p-2 rounded-xl bg-violet-50 text-violet-600 hover:bg-violet-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Mettre à jour le statut"
                                                >
                                                <Settings className="w-4 h-4"/>
                                            </button>

                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                            { totalPages > 0 && (
                                <div className="px-8 py-8 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <button
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    disabled={currentPage === 1 || loading}
                                    className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm"
                                    >
                                    <ChevronLeft className="w-4 h-4 text-gray-900" />
                                    </button>
                
                                    <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }).map((_, i) => {
                                        const page = i + 1;
                
                                        return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            disabled={loading}
                                            className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${
                                            currentPage === page
                                                ? "bg-gray-900 text-white shadow-lg"
                                                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                                            } disabled:opacity-50`}
                                        >
                                            {page}
                                        </button>
                                        );
                                    })}
                                    </div>
                
                                    <button
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    disabled={currentPage === totalPages || loading}
                                    className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm"
                                    >
                                    <ChevronRight className="w-4 h-4 text-gray-900" />
                                    </button>
                                </div>
                
                                {totalElements > 0 && (
                                    <p className="text-xs font-bold text-gray-500">
                                    {totalElements +" Facture"}
                                    </p>
                                )}
                                </div>
                            )}
                                <UpdateInvoiceStatusModal
                                open={updateOpen}
                                onClose={()=> setUpdateOpen(false)}
                                onConfirm={updateStatus}
                                invoiceNumber={selectedInvoice?.invoiceNumber}
                                currentStatus={selectedInvoice?.invoiceStatus}
                                type="invoice"
                                nextStatus={nextStatus}
                                onNextStatusChange={setNextStatus}
                                allowedStatuses={
                                    selectedInvoice
                                    ? getSupplierInvoiceAllowedNextStatuses(selectedInvoice.invoiceStatus)
                                    : []
                                }
                                isSubmitting={updateLoading}
                                />
            </div>
        </div>

    );
}