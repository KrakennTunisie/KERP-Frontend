'use client';

import StatClientInvoiceCard from "@/shared/components/ui/statClientInvoiceCard";
import {  getClientInvoiceAllowedNextStatuses, invoiceStatusColors, invoiceStatusLabels, invoiceStatusSchema } from "../../types/invoiceStatus";
import Link from "next/link";
import { useClientInvoiceList } from "../../hooks/useClientsInvoiveList";
import { SendInvoiceModal } from "../widgets/sendInvoiceModal";
import { invoiceComplianceStatusSchema } from "../../types/invoiceComplianceStatus";
import { DeleteInvoiceModal } from "../widgets/deleteInvoiceModal";
import PageLoader from "@/shared/components/ui/pageLoader";
import { ChevronLeft, ChevronRight, ColumnsSettingsIcon, LucideSettings, Settings, Settings2, Settings2Icon } from "lucide-react";
import { formatDateLong } from "@/shared/utils/formatDate";
import { UpdateInvoiceStatusModal } from "../widgets/updateStatusModal";

export default function ClientsInvoiceList() {

    const { router, search, setSearch, open, setOpen, deleteOpen, setDeleteOpen,
        filtre, setFiltre, invoiceRef, setInvoiceRef, clientsInvoices,
        currentPage,
        setCurrentPage,
        totalElements,
        totalPages,
        deleteLoading,
        invoiceId,
        setInvoiceId,
        deleteClientInvoice,
        setUpdateOpen,
        updateOpen,
        updateLoading,
        updateStatus,
        selectedInvoice, setSelectedInvoice,
        nextStatus, setNextStatus,
        loading } = useClientInvoiceList();
    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <SendInvoiceModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onSend={({ to }) => alert(`Envoyé à : ${to}`)}
            />
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        Factures Clients
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Gestion des factures de vente
                    </p>
                </div>
                <Link
                    href="/billing/invoices/clients/create"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-bold px-6 py-3 rounded-xl shadow-md text-sm"
                >
                    <span className="text-lg leading-none">+</span>
                    Nouvelle Facture Client
                </Link>
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
                    eur={0}
                    tnd={0}
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
                    eur={0}
                    tnd={0}
                    sub={`${0} factures`}
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
                    eur={0}
                    tnd={0}
                    sub={`${0} factures`}
                    variant="emerald"
                />
                <DeleteInvoiceModal
                    open={deleteOpen}
                    onClose={() => setDeleteOpen(false)}
                    invoiceRef={invoiceRef}
                    onConfirm={deleteClientInvoice} 
                    loading={deleteLoading}/>
            </div>

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
                        {invoiceStatusSchema.options
                        .filter(f => f !== invoiceStatusSchema.enum.REFUNDED && f !== invoiceStatusSchema.enum.NOT_REFUNDED && f!== invoiceStatusSchema.enum.IN_PROGRESS)
                        .map((f) => (
                            <button
                                key={f}
                                onClick={() => setFiltre(f)}
                                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${filtre === f
                                    ? "bg-slate-900 text-white shadow"
                                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                                    }`}
                            >
                                {invoiceStatusLabels[f]}
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
                            {["RÉFÉRENCE", "CLIENT", "STATUT", "MONTANT TTC", "TAUX CHANGE", "DATE ÉCHÉANCE", "CONFORME", "ACTIONS"].map((col) => (
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
                        {
                            loading ? 
                            (
                                        <tr>
                                            <td
                                            className="px-8 py-10 text-sm font-bold text-gray-500"
                                            >
                                            <PageLoader label="Chargement..."/>
                                            </td>
                                        </tr>
                                        )
                        :clientsInvoices.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="text-center py-12 text-slate-400 text-sm">
                                    Aucune facture trouvée.
                                </td>
                            </tr>
                        ) : (
                            clientsInvoices.map((f, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                    <td className="px-5 py-4 font-bold text-slate-800">
                                        {f.invoiceNumber}
                                    </td>
                                    <td className="px-5 py-4 text-slate-700">{f.partner.name}</td>
                                    <td className="px-5 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${f.invoiceStatus !== "ALL" ? invoiceStatusColors[f.invoiceStatus] : ""
                                            }}`}>
                                            {invoiceStatusLabels[f.invoiceStatus]}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-slate-700 font-medium">
                                        {f.invoiceCurrency=="EUR" 
                                            ? f.totalExclTaxEUR?.toLocaleString("fr-FR")+" €"
                                            : f.invoiceCurrency=="TND"
                                                ? f.totalInclTaxTND.toLocaleString("fr-FR")+" TND"
                                                : f.totalInclTaxUSD+" $"} 
                                    </td>

                                    <td className="px-5 py-4 text-slate-700">{f.appliedExchangeRate}</td>
                                    <td className="px-5 py-4 text-slate-600">{formatDateLong(f?.dueDate)}</td>
                                    <td className="px-5 py-4 text-center">
                                        {f.invoiceComplianceStatus == invoiceComplianceStatusSchema.enum.TTN_ACCEPTED ? (
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
                                                onClick={(e) => { e.stopPropagation(); console.log("view", f.idInvoice); router.push(`/billing/invoices/clients/${f.idInvoice}/details`) }}
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
                                                disabled={getClientInvoiceAllowedNextStatuses(f.invoiceStatus).length === 0}
                                                onClick={(e) => { e.stopPropagation(); console.log("edit", f.idInvoice); router.push(`/billing/invoices/clients/${f.idInvoice}/edit`); }}
                                                className="p-2 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Modifier"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={(e) => {setSelectedInvoice(f); setInvoiceId(f.idInvoice); setUpdateOpen(true)}}
                                                disabled={getClientInvoiceAllowedNextStatuses(f.invoiceStatus).length === 0}
                                                className="p-2 rounded-xl bg-violet-50 text-violet-600 hover:bg-violet-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Mettre à jour le statut"
                                                >
                                                <Settings className="w-4 h-4"/>
                                            </button>
                                            <button
                                                disabled={getClientInvoiceAllowedNextStatuses(f.invoiceStatus).length === 0}
                                                onClick={() => { setOpen(true); console.log("send", f.idInvoice); }}
                                                className="p-2 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Envoyer"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12zm0 0h7.5" />
                                                </svg>
                                            </button>

                                            {/* Supprimer */}
                                            <button
                                                disabled={getClientInvoiceAllowedNextStatuses(f.invoiceStatus).length === 0}
                                                onClick={(e) => { setDeleteOpen(true); setInvoiceRef(f.invoiceNumber); setInvoiceId(f.idInvoice); console.log("delete", f.idInvoice); }}
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
                nextStatus={nextStatus}
                onNextStatusChange={setNextStatus}
                allowedStatuses={
                    selectedInvoice
                    ? getClientInvoiceAllowedNextStatuses(selectedInvoice.invoiceStatus)
                    : []
                }
                isSubmitting={updateLoading}
                />
        </div>

    );
}