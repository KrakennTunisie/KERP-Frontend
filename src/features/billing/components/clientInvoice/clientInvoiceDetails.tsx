"use client"

import { DocumentPreviewModal } from "@/shared/components/ui/documentPreviewModal"
import useClientInvoiceDetails, { InvoiceDetailsProps } from "../../hooks/useClientInvoiceDetails"
import { mockInvoiceItems } from "../../mocks/invoice-items-mocks"
import { InvoiceEventLabels } from "../../types/invoiceEventType"
import { invoiceStatusLabels, invoiceStatusSchema } from "../../types/invoiceStatus"
import Card from "../widgets/card"
import { SectionLabel } from "../widgets/sectionLabel"
import ShieldIcon from "../widgets/shieldIcon"
import { SendToTTNModal } from "../widgets/ttnConfirmationModal"
import { paymentMethodLabels } from "../../types/paymentMethod"
import { formatDateLong } from "@/shared/utils/formatDate"
import { OperationCategoryLabels } from "../../types/operationCategory"
import PageLoader from "@/shared/components/ui/pageLoader"

export default function ClientInvoiceDetails({ invoiceId, type }: InvoiceDetailsProps) {
    const {   client, invoice, previewDocument, setPreviewDocument, sendToTTN, TtnModalOpen, setTtnModalOpen,
        hasCreditInvoice,loading, sent, successMessage, router, updateStatus } = useClientInvoiceDetails({ invoiceId, type });

        if(loading){
            return(
                <PageLoader label="Chargement de facture ..."/>
            )
        }
    return (
        <div className="min-h-screen bg-gray-50 font-sans">

            {/* TOP BAR */}
            <div className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path d="M19 12H5M12 5l-7 7 7 7" />
                        </svg>
                    </button>
                    <div>
                        <div className="flex items-center gap-2.5">
                            <span className="text-[22px] font-extrabold tracking-tight text-gray-900">{invoice?.invoiceNumber}</span>
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide bg-amber-50 text-amber-600 border border-amber-200">
                                    {invoice?.invoiceStatus
                                    ? invoiceStatusLabels[invoice.invoiceStatus]
                                    : '-'}                            
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">Emise le {formatDateLong(invoice?.issueDate)} · Échéance le {formatDateLong(invoice?.dueDate)}</p>
                    </div>
                </div>
            </div>

            {/* MAIN */}
            <div className="max-w-[1200px] mx-auto px-6 py-6 grid grid-cols-[1fr_300px] gap-5">

                {/* LEFT */}
                <div className="flex flex-col gap-4">

                    {/* Fiscal status */}
                    <Card>
                        <div className="flex items-center gap-4">
                            <div className="w-13 h-13 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0 p-3">
                                <ShieldIcon />
                            </div>
                            <div className="flex-1">
                                {invoice?.invoiceComplianceStatus === "TTN_ACCEPTED" ? (
                                    <p className="text-sm text-green-600 mt-0.5">
                                        {"Ce document est validé par l'administration fiscale."}
                                    </p>
                                ) : invoice?.invoiceComplianceStatus === "TTN_REJECTED" ? (
                                    <p className="text-sm text-red-600 mt-0.5">
                                        {"Ce document est rejeté par l'administration fiscale."}
                                    </p>
                                ) : (
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        {"Ce document est en attente de validation."}
                                    </p>
                                )}
                            </div>
                            {/* Bouton envoi TTN — visible seulement si pas encore envoyée */}
                            {!invoice?.invoiceComplianceStatus && (
                                <button
                                    onClick={() => { setTtnModalOpen(true) }}
                                    className="shrink-0 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue transition-colors cursor-pointer inline-flex items-center gap-2" >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <line x1="22" y1="2" x2="11" y2="13" />
                                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                    </svg>
                                    {"Envoyer au TTN"}
                                </button>
                            )}
                        </div>
                    </Card>
                    {/* Modal pour demander au user s'il veut envoyer la Facture au TTN */}
                    <SendToTTNModal
                        open={TtnModalOpen}
                        onClose={() => setTtnModalOpen(false)}
                        onConfirm={() => { sendToTTN() }}
                        loading={loading}
                        invoiceSent={sent}
                        invoiceRef={invoice?.invoiceNumber}
                        successMessage={successMessage} />

                    {/* Actions */}
                    <Card>
                        <SectionLabel>Actions rapides</SectionLabel>
                        <div className="grid grid-cols-2 gap-3">
                            {hasCreditInvoice ?
                             <button
                                onClick={() => router.push(`/billing/invoices/clients/${invoiceId}/credit-note`)}
                                className="flex items-center justify-center gap-2 py-3.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 text-sm font-bold hover:brightness-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="9" y1="15" x2="15" y2="15" />
                                </svg>
                                {"Liste facture d'avoir"}
                            </button> :
                            <button
                                onClick={() => router.push(`/billing/invoices/clients/${invoiceId}/credit-note/create`)}
                                disabled={invoice?.invoiceStatus ===invoiceStatusSchema.enum.PAID || invoice?.invoiceStatus === invoiceStatusSchema.enum.DRAFT}
                                className="flex items-center justify-center gap-2 py-3.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 text-sm font-bold hover:brightness-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="9" y1="15" x2="15" y2="15" />
                                </svg>
                                {"Créer Avoir"}
                            </button>
                            }
                            <button
                                disabled={invoice?.invoiceStatus ===invoiceStatusSchema.enum.PAID || invoice?.invoiceStatus ===invoiceStatusSchema.enum.DRAFT}
                                onClick={updateStatus}
                                className={`flex items-center justify-center gap-2 py-3.5 rounded-xl border text-sm font-bold transition-all bg-blue-100 border-blue-300 hover:brightness-95 text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <polyline points="9 11 12 14 22 4" />
                                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                                </svg>
                                {invoice?.invoiceStatus == invoiceStatusSchema.enum.PAID ? 'Marqué Payé ✓' : 'Marquer Payé'}
                            </button>
                        </div>
                    </Card>

                    {/* Client + Admin */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card>
                            <SectionLabel>Informations client</SectionLabel>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                                    <svg width="18" height="18" fill="none" stroke="#3b82f6" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                        <polyline points="9 22 9 12 15 12 15 22" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">{client?.name}</p>
                                    <p className="text-xs text-gray-500 mt-1 leading-5">
                                        {invoice?.partner?.address}<br />{invoice?.partner?.country}
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Téléphone</p>
                                    <p className="text-xs font-bold text-gray-900 font-mono">{invoice?.partner?.phoneNumber}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Contact</p>
                                    <p className="text-sm font-bold text-gray-900">{invoice?.partner?.name}</p>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <SectionLabel>Détails administratifs</SectionLabel>
                            <div className="grid grid-cols-2 gap-3">

                               {invoice?.purchaseOrder &&
                                <div key="Bon du commande">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Bon du commande</p>
                                    <p className="text-sm font-bold text-gray-900">{invoice.purchaseOrder.purchaseOrderNumber}</p>
                                </div>}
                                <div key="Méthode de paiement">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Méthode de paiement</p>
                                    <p className="text-sm font-bold text-gray-900">{invoice?.paymentMethod ? paymentMethodLabels[invoice.paymentMethod] : '-'}</p>
                                </div>
                                <div key="Devise">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Devise</p>
                                    <p className="text-sm font-semibold text-gray-700">{invoice?.invoiceCurrency}</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Items table */}
                    <Card>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[15px] font-bold text-gray-900">{"Détails des prestations"}</span>
                        </div>

                        <div className="grid grid-cols-[1fr_70px_90px_100px] gap-2 pb-2.5 border-b border-gray-100">
                            {['Désignation', 'Qté', 'P.U HT', 'Total HT'].map((h) => (
                                <span key={h} className={`text-[10px] font-bold uppercase tracking-widest text-gray-400 ${h !== 'Désignation' ? 'text-right' : ''}`}>
                                    {h}
                                </span>
                            ))}
                        </div>

                        <div
                            className="max-h-[300px] overflow-y-auto pr-2"
                            style={{
                                scrollbarWidth: 'thin',
                                scrollbarColor: '#CBD5E1 transparent',
                            }}
                        >
                            {invoice?.invoiceItems?.map((item, index) => (
                                <div
                                    key={item.idInvoiceItem}
                                    className={`grid grid-cols-[1fr_70px_90px_100px] gap-2 py-3.5 items-center ${index < mockInvoiceItems.length - 1 ? 'border-b border-gray-50' : ''
                                        }`}
                                >
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{item.description}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{item.vatRate + '%'}</p>
                                         <p className="text-xs text-gray-400 mt-0.5">{OperationCategoryLabels[item.operationCategory]}</p>
                                    </div>
                                    <p className="text-sm text-gray-700 text-right">{item.quantity}</p>
                                    <p className="text-sm text-gray-700 text-right">{item.unityPriceEXclTax}</p>
                                    <p className="text-sm font-bold text-gray-900 text-right">{item.itemTotalExclTax}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 flex flex-col items-end gap-2">
                            {[
                                { label: 'Sous-total HT', value: invoice?.invoiceCurrency == "EUR" 
                                                                            ? invoice.totalExclTaxEUR 
                                                                            : invoice?.invoiceCurrency =="TND" 
                                                                                ? invoice.totalExclTaxTND
                                                                                :invoice?.totalExclTaxUSD},
                                { label: 'Total TVA', value: invoice?.invoiceCurrency == "EUR" 
                                                                            ? (invoice.totalInclTaxEUR - invoice.totalExclTaxEUR).toFixed(2)
                                                                            : invoice?.invoiceCurrency =="TND" 
                                                                                ? (invoice.totalInclTaxTND - invoice.totalExclTaxTND).toFixed(2)
                                                                                :
                                                                                 invoice?.invoiceCurrency =="USD" 
                                                                                 ? (invoice?.totalInclTaxUSD - invoice?.totalExclTaxUSD).toFixed(2)
                                                                                 :0},
                            ].map(({ label, value }) => (
                                <div key={label} className="flex justify-between w-64">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</span>
                                    <span className="text-sm font-semibold text-gray-900">{value}</span>
                                </div>
                            ))}
                            <div className="w-64 h-px bg-gray-200 my-1" />
                            <div className="flex justify-between w-64 items-center">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-700">Total TTC</span>
                                <span className="text-2xl font-extrabold text-blue-600 tracking-tight">
                                    {invoice?.invoiceCurrency == "EUR" 
                                                                            ? invoice.totalInclTaxEUR + " EUR"
                                                                            : invoice?.invoiceCurrency =="TND" 
                                                                                ? invoice.totalInclTaxTND +" TND" 
                                                                                :invoice?.totalInclTaxUSD +" USD"}
                                                                            </span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* RIGHT */}
                <div className="flex flex-col gap-4">

                    {/* QR Card */}
                    <Card>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                                <ShieldIcon size={18} />
                            </div>
                            <div>
                                <p className="text-xs font-extrabold tracking-wide text-gray-900">{"CONFORMITÉ E-FACTURE"}</p>
                                <p className="text-[11px] text-blue-600 font-semibold mt-0.5">Tunisie Trade Net</p>
                            </div>
                        </div>

                        <div className="bg-violet-50 rounded-xl p-4">
                            {invoice?.invoiceComplianceStatus == "TTN_ACCEPTED" ? (
                                <svg viewBox="0 0 200 200" className="w-full h-auto">
                                    {/* QR SVG */}
                                </svg>
                            ) : invoice?.invoiceComplianceStatus === "TTN_REJECTED" ? (
                                <p className="text-sm text-red-600 text-center">
                                    {"Facture rejetée par l'administration fiscale"}
                                </p>
                            ) : (
                                <p className="text-sm text-gray-500 text-center">
                                    {"QR CODE non fourni"} <br />
                                    ({"en attente de validation"})
                                </p>
                            )}
                        </div>

                        {invoice?.invoiceComplianceStatus == "TTN_ACCEPTED" ? (
                            <>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center mt-3">
                                    {"ID de validation"}
                                </p>

                                <p className="text-sm font-bold text-violet-600 text-center mt-1 font-mono tracking-wide">
                                    {invoice?.idInvoice ?? "ELF-XXXX"}
                                </p>

                                <div className="bg-violet-50 rounded-xl p-3 text-center mt-3">
                                    <p className="text-[11px] text-violet-600 font-semibold leading-relaxed">
                                        {"Scannez ce QR code pour vérifier l'authenticité de cette facture électronique"}
                                    </p>
                                </div>
                            </>
                        ) : invoice?.invoiceComplianceStatus === "TTN_REJECTED" ? (
                            <p className="text-sm text-red-600 text-center mt-3">
                                {"Aucun identifiant de validation (facture rejetée)"}
                            </p>
                        ) : (
                            <p className="text-sm text-gray-500 text-center mt-3">
                                {"ID de validation non disponible (en attente)"}
                            </p>
                        )}
                    </Card>
                    {/* Audit */}
                    <Card>
                        <div className="flex items-center justify-between mb-4">
                            <SectionLabel>{"Journal d'audit"}</SectionLabel>
                        </div>
                        <div
                            className="flex flex-col gap-3.5 max-h-[300px] overflow-y-auto pr-2"
                            style={{
                                scrollbarWidth: 'thin',
                                scrollbarColor: '#CBD5E1 transparent',
                            }}
                        >
                            {invoice?.invoiceEvents?.map((event, index) => (
                                <div key={event.idInvoiceEvent} className="flex items-start gap-2.5 relative">
                                    {/* Ligne verticale entre les points */}
                                    {index < (invoice?.invoiceEvents?.length || 0) - 1 && (
                                        <div className="absolute left-[4px] top-3.5 w-px h-full bg-blue-100" />
                                    )}
                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0 mt-1 z-10" />
                                    <div>
                                        <p className="text-sm font-semibold leading-snug text-black">
                                            {InvoiceEventLabels[event.invoiceEventType]}
                                        </p>
                                        <p className="text-[11px] font-semibold text-gray-400 mt-0.5">
                                            {formatDateLong(event.eventDate)} - {event.eventTrigger}
                                        </p>
                                        <p className="text-[11px] text-gray-400 mt-0.5">{event.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Documents */}
                    <Card>
                        <SectionLabel>{"Documents attachés"}</SectionLabel>
                        <div
                            onClick={() => { setPreviewDocument(invoice?.invoiceDocument)}}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
                                    <svg width="15" height="15" fill="none" stroke="#e11d48" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                        <polyline points="14 2 14 8 20 8" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">{invoice?.invoiceDocument?.fileName}</p>
                                    <p className="text-[11px] text-gray-400 mt-0.5">{"245 KB · 2025-01-15"}</p>
                                </div>
                            </div>
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-400 group-hover:text-gray-700 transition-colors">
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                            </svg>
                        </div>
                    </Card>

                </div>
            </div>
                <DocumentPreviewModal
                    open={!!previewDocument}
                    onClose={() => setPreviewDocument(null)}
                    document={previewDocument}
                  />
        </div>
    );
}