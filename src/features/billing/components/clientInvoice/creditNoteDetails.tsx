"use client"
import { Copy, Pencil, Send, Settings, ShieldIcon, Trash2 } from "lucide-react";
import useCreditNoteDetails, { PropsCreditNote } from "../../hooks/useCreditNoteDetails";
import Card from "../widgets/card";
import { SendToTTNModal } from "../widgets/ttnConfirmationModal";
import { SectionLabel } from "../widgets/sectionLabel";
import { InvoiceEventLabels } from "../../types/invoiceEventType";
import { OperationCategoryLabels } from "../../types/operationCategory";
import { invoiceStatusLabels, invoiceStatusSchema } from "../../types/invoiceStatus";
import { DocumentPreviewModal } from "@/shared/components/ui/documentPreviewModal";
import { creditNoteTypeLabels } from "../../types/creditNoteType";
import { formatDateLong, formatDateLongWithTime } from "@/shared/utils/formatDate";
import PageLoader from "@/shared/components/ui/pageLoader";
import { NotFound } from "@/shared/components/widgets/notFound";
import { invoiceComplianceStatusSchema } from "../../types/invoiceComplianceStatus";
import { DocumentTopBar } from "../widgets/documentTopBar";
import { SendDocumentModal } from "../widgets/sendInvoiceModal";
import { DeleteInvoiceModal } from "../widgets/deleteInvoiceModal";

export default function CreditNoteDetails({ params }: PropsCreditNote) {
    const { updateStatus, previewDocument, setPreviewDocument, setStatusPaiement, invoice, 
        sendToTTN, TtnModalOpen, setTtnModalOpen, loading, sent, successMessage, router,
            sendOpen,
        setSendOpen,
        deleteLoading,
        setDeleteLoading,
        deleteOpen,deleteCreditNote,
        setDeleteOpen } = useCreditNoteDetails({ params });
    
    
            if(loading){
                return(
                    <PageLoader label="Chargement de facture d'avoir ..."/>
                )
            }
            if(invoice==null){
                <NotFound
                    resource="Facture d'avoir"
                    message="Cette facture n'existe pas ou vous n'avez pas les droits pour y accéder."
                />
            }
    return (
        <div className="min-h-screen bg-gray-50 font-sans">

            {/* TOP BAR */}
            <DocumentTopBar
                documentTypeLabel="Facture d’avoir"
                documentNumber={invoice?.invoiceCreditNoteNumber}
                statusLabel={
                    invoice?.invoiceCreditNoteStatus
                    ? invoiceStatusLabels[invoice.invoiceCreditNoteStatus]
                    : "-"
                }
                statusVariant="danger"
                issueDateLabel="Émise le"
                issueDate={formatDateLong(invoice?.issueDate)}
                onBack={() => router.back()}
                actionItems={[
                        {
                        label: "Cloner",
                        icon: Copy,
                        onClick: () => console.log("Cloner", invoice?.idInvoiceCreditNote),
                        },
/*                         {
                        label: "Mettre à jour statut",
                        icon: Settings,
                        onClick: () => console.log("Mettre à jour statut", invoice?.idInvoiceCreditNote),
                        disabled: invoice?.invoiceCreditNoteStatus === "CANCELLED",
                        }, */
                        {
                        label: "Envoyer",
                        icon: Send,
                        onClick: () => setSendOpen(true),
                        disabled: invoice?.invoiceCreditNoteStatus === "CANCELLED",
                        },
/*                         {
                        label: "Modifier",
                        icon: Pencil,
                        onClick: () =>
                            router.push(`/billing/invoices/clients/${invoice?.idInvoiceCreditNote}/edit`),
                        disabled:
                            invoice?.invoiceCreditNoteStatus === "PAID" ||
                            invoice?.invoiceCreditNoteStatus === "CANCELLED",
                        }, */
                        {
                        label: "Supprimer",
                        icon: Trash2,
                        color: "text-rose-600",
                        hover: "hover:bg-rose-50",
                        onClick: () => setDeleteOpen(true),
                        disabled: invoice?.invoiceCreditNoteStatus !== "DRAFT",
                        },
                    ]}
            />

            {/* MAIN */}
            <div className=" mx-auto px-6 py-6 grid grid-cols-[1fr_300px] gap-5">

                {/* LEFT */}
                <div className="flex flex-col gap-4">

                    {/* Fiscal status */}
                    <Card>
                        <div className="flex items-center gap-4">
                            <div className="w-13 h-13 rounded-2xl bg-red-600 flex items-center justify-center shrink-0 p-3">
                                <ShieldIcon />
                            </div>
                            <div className="flex-1">
                                {invoice?.invoiceCreditNoteComplianceStatus === "TTN_ACCEPTED" ? (
                                    <p className="text-sm text-green-600 mt-0.5">
                                        {"Ce document est validé par l'administration fiscale."}
                                    </p>
                                ) : invoice?.invoiceCreditNoteComplianceStatus === "TTN_REJECTED" ? (
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
                                <button
                                    disabled={invoice?.invoiceCreditNoteStatus==invoiceStatusSchema.enum.DRAFT 
                                        || invoice?.invoiceCreditNoteComplianceStatus==invoiceComplianceStatusSchema.enum.TTN_ACCEPTED
                                    }
                                    onClick={() => { setTtnModalOpen(true) }}
                                    className="shrink-0 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-blue transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2" >
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
                        </div>
                    </Card>
                    {/* Modal pour demander au user s'il veut envoyer la Facture au TTN */}
                    <SendToTTNModal
                        open={TtnModalOpen}
                        onClose={() => setTtnModalOpen(false)}
                        onConfirm={() => { sendToTTN() }}
                        loading={loading}
                        invoiceSent={sent}
                        invoiceRef={invoice?.invoiceCreditNoteNumber}
                        successMessage={successMessage} />

                    {/* Actions */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "1rem 0" }}>
                        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl p-5 flex flex-col gap-4">
                            <p className="text-[11px] font-medium tracking-widest uppercase text-gray-400 m-0">
                                Détails administratifs
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-3">
                                    <p className="text-[11px] font-medium tracking-wide uppercase text-gray-400 mb-1">Client</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{invoice?.invoice.partner.partnerName}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-3">
                                    <p className="text-[11px] font-medium tracking-wide uppercase text-gray-400 mb-1">N° Facture originale</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {invoice?.invoice.invoiceNumber}
                                    </p>
                                </div>
                                <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-3">
                                    <p className="text-[11px] font-medium tracking-wide uppercase text-gray-400 mb-1">Montant à rembourser</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {invoice?.invoice.invoiceCurrency === "EUR"
                                            ? `${invoice.totalInclTaxEUR} EUR`
                                            : invoice?.invoice.invoiceCurrency === "TND"
                                                ? `${invoice.totalInclTaxTND} TND`
                                                : `${invoice?.totalInclTaxUSD} USD`}
                                    </p>
                                </div>
                                <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-3">
                                    <p className="text-[11px] font-medium tracking-wide uppercase text-gray-400 mb-1">{"Motif de l'avoir"}</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {invoice?.motif ? creditNoteTypeLabels[invoice.motif] : "—"}
                                    </p>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 dark:border-neutral-700 pt-4 flex justify-end gap-2">
                                <button
                                    disabled={invoice?.invoiceCreditNoteStatus !== invoiceStatusSchema.enum.DRAFT}
                                    onClick={() => updateStatus(invoiceStatusSchema.enum.IN_PROGRESS)}
                                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium border transition-all
          ${invoice?.invoiceCreditNoteStatus === invoiceStatusSchema.enum.DRAFT
                                            ? "bg-blue-50 border-blue-200 text-blue-800 hover:brightness-95 cursor-pointer"
                                            : "bg-blue-50 border-blue-200 text-blue-800 opacity-50 cursor-not-allowed"
                                        }`}
                                >
                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path d="M12 6v6l4 2" />
                                        <circle cx="12" cy="12" r="10" />
                                    </svg>
                                    {invoice?.invoiceCreditNoteStatus === invoiceStatusSchema.enum.IN_PROGRESS
                                        ? invoiceStatusLabels[invoiceStatusSchema.enum.IN_PROGRESS]
                                        : invoice?.invoiceCreditNoteStatus === invoiceStatusSchema.enum.DRAFT
                                            ? "Marquer en cours"
                                            : invoiceStatusLabels[invoiceStatusSchema.enum.REFUNDED]}
                                </button>

                                <button
                                    disabled={invoice?.invoiceCreditNoteStatus !== invoiceStatusSchema.enum.IN_PROGRESS}
                                    onClick={() => updateStatus(invoiceStatusSchema.enum.REFUNDED)}
                                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium border transition-all
                                        ${invoice?.invoiceCreditNoteStatus === invoiceStatusSchema.enum.IN_PROGRESS
                                            ? "bg-green-50 border-green-200 text-green-600 hover:brightness-95 cursor-pointer"
                                            : "bg-green-100 border-green-200 text-green-700 opacity-50 cursor-not-allowed"
                                        }`}
                                >
                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <polyline points="9 11 12 14 22 4" />
                                        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                                    </svg>
                                    {invoice?.invoiceCreditNoteStatus === invoiceStatusSchema.enum.REFUNDED
                                        ? invoiceStatusLabels[invoiceStatusSchema.enum.REFUNDED]
                                        : "Marquer payé"}
                                </button>
                            </div>
                        </div>
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
                            {invoice?.invoiceCreditNoteItems?.map((item, index) => (
                                <div
                                    key={item.idInvoiceCreditNoteItem}
                                    className={`grid grid-cols-[1fr_70px_90px_100px] gap-2 py-3.5 items-center ${index < (invoice?.invoiceCreditNoteItems?.length || 1) - 1 ? 'border-b border-gray-50' : ''
                                        }`}
                                >
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{item.invoiceItem.description}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{item.invoiceItem.vatRate + " %"}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{OperationCategoryLabels[item.invoiceItem.operationCategory]}</p>
                                    </div>
                                    <p className="text-sm text-gray-700 text-right">{item.quantity}</p>
                                    <p className="text-sm text-gray-700 text-right">{item.invoiceItem.unityPriceEXclTax}</p>
                                    <p className="text-sm font-bold text-gray-900 text-right">{item.quantity *item.invoiceItem.unityPriceEXclTax}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 flex flex-col items-end gap-2">
                            {[
                                {
                                    label: 'Sous-total HT', value: invoice?.invoice.invoiceCurrency == "EUR"
                                        ? invoice.totalExclTaxEUR
                                        : invoice?.invoice.invoiceCurrency == "TND"
                                            ? invoice.totalExclTaxTND
                                            : invoice?.totalExclTaxUSD
                                },
                                {
                                    label: 'Total TVA', value: invoice?.invoice.invoiceCurrency == "EUR"
                                        ? (invoice.totalInclTaxEUR - invoice.totalExclTaxEUR).toFixed(2)
                                        : invoice?.invoice.invoiceCurrency == "TND"
                                            ? (invoice.totalInclTaxTND - invoice.totalExclTaxTND).toFixed(2)
                                            :
                                            invoice?.invoice.invoiceCurrency == "USD"
                                                ? (invoice?.totalInclTaxUSD - invoice?.totalExclTaxUSD).toFixed(2)
                                                : 0
                                },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex justify-between w-64">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</span>
                                    <span className="text-sm font-semibold text-gray-900">{value}</span>
                                </div>
                            ))}
                            <div className="w-64 h-px bg-gray-200 my-1" />
                            <div className="flex justify-between w-64 items-center">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-700">Total TTC</span>
                                <span className="text-2xl font-extrabold text-red-600 tracking-tight">
                                    {invoice?.invoice.invoiceCurrency == "EUR"
                                        ? invoice.totalInclTaxEUR + " EUR"
                                        : invoice?.invoice.invoiceCurrency == "TND"
                                            ? invoice.totalInclTaxTND + " TND"
                                            : invoice?.totalInclTaxUSD + " USD"}</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* RIGHT */}
                <div className="flex flex-col gap-4">

                    {/* QR Card */}
                    <Card>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shrink-0">
                                <ShieldIcon size={18} />
                            </div>
                            <div>
                                <p className="text-xs font-extrabold tracking-wide text-gray-900">{"CONFORMITÉ E-FACTURE"}</p>
                                <p className="text-[11px] text-red-600 font-semibold mt-0.5">Tunisie Trade Net</p>
                            </div>
                        </div>

                        <div className="bg-violet-50 rounded-xl p-4">
                            {invoice?.invoiceCreditNoteComplianceStatus == "TTN_ACCEPTED" ? (
                                <svg viewBox="0 0 200 200" className="w-full h-auto">
                                    {/* QR SVG */}
                                </svg>
                            ) : invoice?.invoiceCreditNoteComplianceStatus === "TTN_REJECTED" ? (
                                <p className="text-sm text-red-600 text-center">
                                    {" Facture rejetée par l'administration fiscale"}
                                </p>
                            ) : (
                                <p className="text-sm text-gray-500 text-center">
                                    QR CODE non fourni <br />
                                    (en attente de validation)
                                </p>
                            )}
                        </div>

                        {invoice?.invoiceCreditNoteComplianceStatus == "TTN_ACCEPTED" ? (
                            <>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center mt-3">
                                    ID de validation
                                </p>

                                <p className="text-sm font-bold text-violet-600 text-center mt-1 font-mono tracking-wide">
                                    {invoice?.idInvoiceCreditNote ?? "ELF-XXXX"}
                                </p>

                                <div className="bg-violet-50 rounded-xl p-3 text-center mt-3">
                                    <p className="text-[11px] text-violet-600 font-semibold leading-relaxed">
                                        {"Scannez ce QR code pour vérifier l'authenticité de cette facture électronique"}
                                    </p>
                                </div>
                            </>
                        ) : invoice?.invoiceCreditNoteComplianceStatus === "TTN_REJECTED" ? (
                            <p className="text-sm text-red-600 text-center mt-3">
                                Aucun identifiant de validation (facture rejetée)
                            </p>
                        ) : (
                            <p className="text-sm text-gray-500 text-center mt-3">
                                ID de validation non disponible (en attente)
                            </p>
                        )}
                    </Card>
                    {/* Audit */}
                    <Card>
                        <div className="flex items-center justify-between mb-4">
                            <SectionLabel>{"Journal d'audit"}</SectionLabel>
                        </div>
                        <div
                            className="flex flex-col gap-3.5 max-h-[100px] overflow-y-auto pr-2"
                            style={{
                                scrollbarWidth: 'thin',
                                scrollbarColor: '#CBD5E1 transparent',
                            }}
                        >
                            {invoice?.invoiceCreditNoteEvents?.map((event, index) => (
                                <div key={event.idInvoiceEvent} className="flex items-start gap-2.5 relative">
                                    {/* Ligne verticale entre les points */}
                                    {index < (invoice?.invoiceCreditNoteEvents?.length || 0) - 1 && (
                                        <div className="absolute left-[4px] top-3.5 w-px h-full bg-red-100" />
                                    )}
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-200 shrink-0 mt-1 z-10" />
                                    <div>
                                        <p className="text-sm font-semibold leading-snug text-black">
                                            {InvoiceEventLabels[event?.invoiceCreditNoteEventType] ?? "créé"}
                                        </p>
                                        <p className="text-[11px] font-semibold text-gray-400 mt-0.5">
                                            {formatDateLongWithTime(event.eventDate)} - {event.eventTrigger}
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
                            onClick={() => { setPreviewDocument(invoice?.invoiceCreditNoteDocument) }}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
                                    <svg width="15" height="15" fill="none" stroke="#e11d48" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                        <polyline points="14 2 14 8 20 8" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">{invoice?.invoiceCreditNoteDocument.fileName}</p>
                                    <p className="text-[11px] text-gray-400 mt-0.5">245 KB · 2025-01-15</p>
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
            <SendDocumentModal
                document={invoice}
                variant="invoiceCreditNote"
                isOpen={sendOpen}
                onClose={() => setSendOpen(false)}
            />

            <DeleteInvoiceModal 
                open={deleteOpen} 
                onClose={()=> setDeleteOpen(false)} 
                onConfirm={deleteCreditNote}
                loading={deleteLoading}      
            />
        </div>
    );
}