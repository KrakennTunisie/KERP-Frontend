'use client';
import { invoiceStatusColors, invoiceStatusLabels, invoiceStatusSchema } from "../../types/invoiceStatus";
import Link from "next/link";
import { PropsClient } from "../../hooks/useClientsInvoiveList";
import { SendInvoiceModal } from "../widgets/sendInvoiceModal";
import { invoiceComplianceStatusSchema } from "../../types/invoiceComplianceStatus";
import useCreditNoteList from "../../hooks/useCreditNoteList";

import { DeleteInvoiceModal } from "../widgets/deleteInvoiceModal";
import { creditNoteTypeLabels } from "../../types/creditNoteType";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatDateLong } from "@/shared/utils/formatDate";
import PageLoader from "@/shared/components/ui/pageLoader";

export default function CreditNoteList({ params }: PropsClient) {

    const { router, search, setSearch, open, setOpen, setDeleteOpen, deleteOpen, creditNoteRef,
        filtre, setFiltre, deleteCreditNote, creditNotes, totalElements, totalPages, idInvoice, setIdInvoice, deleteId, setDeleteId, deleteClientInvoice,  currentPage,
     setCurrentPage, loading,} = useCreditNoteList({ params });
    return (
        <div className="min-h-screen bg-gray-50 p font-sans">
            {/* TOP BAR */}
            {/* TOP BAR */}
            <div className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-start justify-between mb-8 sticky top-0 z-50 shadow-sm">

                {/* LEFT */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                        <svg
                            width="16"
                            height="16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            viewBox="0 0 24 24"
                        >
                            <path d="M19 12H5M12 5l-7 7 7 7" />
                        </svg>
                    </button>

                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            {"Factures d'avoir"}
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                         {"Référence de la facture origianle :"} {creditNotes[0]?.invoice?.invoiceNumber ?? ""}
                        </p>
                    </div>
                </div>

                {/* RIGHT */}
                <Link
                    href={`/billing/invoices/clients/${params.invoiceId}/credit-note/create`}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 transition-colors text-white font-bold px-6 py-3 rounded-xl shadow-md text-sm"
                >
                    <span className="text-lg leading-none">+</span>
                    {"Nouvelle Facture d'avoir"}
                </Link>
            </div>
            <DeleteInvoiceModal
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                invoiceRef={creditNoteRef}
                onConfirm={deleteClientInvoice} />

            <SendInvoiceModal
            invoice={null}
                isOpen={open}
                onClose={() => setOpen(false)}
            />
            <div className="px-8">
            {/* Table card */}
            <div className="bg-white rounded-2xl  shadow-sm border border-slate-100 overflow-hidden">
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
                            .filter((f) =>
                                f.includes(invoiceStatusSchema.enum.REFUNDED) ||
                                f.includes(invoiceStatusSchema.enum.NOT_REFUNDED) ||
                                f.includes(invoiceStatusSchema.enum.DRAFT)
                            )
                            .map((f) => (
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
            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-100">
                            {["RÉFÉRENCE", "Facture Originale", "STATUS", "MOTIF DE L'AVOIR", "MONTANT TTC", "DATE EMISSION", "CONFORME", "ACTIONS"].map((col) => (
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
                        {loading ? 
                          (
                            <tr>
                                <td
                                className="px-8 py-10 text-sm font-bold text-gray-500"
                                >
                                <PageLoader label="Chargement Liste des factures..."/>
                                </td>
                            </tr>
                            )
                                                            
                        :creditNotes.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="text-center py-12 text-slate-400 text-sm">
                                    {"Aucune facture trouvée."}
                                </td>
                            </tr>
                        ) : (
                            creditNotes.map((f) => (
                                <tr
                                    key={1}
                                    className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                                >
                                    <td className="px-5 py-4 font-bold text-slate-800">
                                        {f.invoiceCreditNoteNumber}
                                    </td>
                                    <td className="px-5 py-4 text-slate-700">{f.invoice.invoiceNumber}</td>
                                    <td className="px-5 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${f.invoiceCreditNoteStatus !== "ALL" ? invoiceStatusColors[f.invoiceCreditNoteStatus] : ""
                                            }}`}>
                                            {invoiceStatusLabels[f.invoiceCreditNoteStatus]}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-slate-700 font-medium">
                                        {creditNoteTypeLabels[f.motif]}
                                    </td>
                                    <td className="text-red-500 font-bold">
                                        - {f?.invoice.invoiceCurrency == "EUR" 
                                                                            ? f.totalInclTaxEUR 
                                                                            : f?.invoice.invoiceCurrency =="TND" 
                                                                                ? f.totalInclTaxTND  
                                                                                :f?.total} {f.invoice.invoiceCurrency}
                                    </td>
                                    <td className="px-5 py-4 text-slate-600">{formatDateLong(f.issueDate)}</td>
                                    <td className="px-5 py-4 text-center">
                                        {f.invoiceCreditNoteComplianceStatus == invoiceComplianceStatusSchema.enum.TTN_ACCEPTED ? (
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
                                                onClick={(e) => { e.stopPropagation(); console.log("view", f.invoiceCreditNoteNumber); router.push(`/billing/invoices/clients/${params.invoiceId}/credit-note/${f.invoiceCreditNoteNumber}`) }}
                                                className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                                title="Voir"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                                </svg>
                                            </button>
                                            {/** Send To TTn button */}
                                            <button
                                                disabled={([
                                                    invoiceComplianceStatusSchema.enum.RECEIVED,
                                                    invoiceComplianceStatusSchema.enum.COMPLETED,
                                                    invoiceComplianceStatusSchema.enum.SIGNING_PENDING,
                                                    invoiceComplianceStatusSchema.enum.SIGNING_SUCCEEDED,
                                                    invoiceComplianceStatusSchema.enum.TTN_ACCEPTED,
                                                    invoiceComplianceStatusSchema.enum.TTN_PENDING,
                                                    invoiceComplianceStatusSchema.enum.TTN_SUBMITTED
                                                ] as string[]).includes(f.invoiceCreditNoteComplianceStatus!)}
                                                onClick={(e) => { setOpen(true);  console.log("send", f.invoiceCreditNoteNumber); }}
                                                className="p-2 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-colors  cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Envoyer"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12zm0 0h7.5" />
                                                </svg>
                                            </button>
                                            {/* Supprimer */}
                                            <button
                                               // disabled={/* f.invoiceCreditNoteComplianceStatus != null */}
                                                onClick={(e) => { deleteCreditNote(f.invoiceCreditNoteNumber); setDeleteId(f.idInvoiceCreditNote) }}
                                                className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors disabled:opacity-50  cursor-pointer disabled:cursor-not-allowed"
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
        </div>
        </div>

    );
}