"use client"

import { DocumentPreviewModal } from "@/shared/components/ui/documentPreviewModal"
import useClientInvoiceDetails, { InvoiceDetailsProps } from "../../hooks/useClientInvoiceDetails"
import { getClientInvoiceAllowedNextStatuses, getCreditNoteAllowedNextStatuses, invoiceStatusLabels, invoiceStatusSchema } from "../../types/invoiceStatus"
import { formatDateLong } from "@/shared/utils/formatDate"
import PageLoader from "@/shared/components/ui/pageLoader"
import { DocumentTopBar } from "../widgets/documentTopBar"
import {  Copy, CreditCard, Download,  FileText, Pencil, ReceiptText, Send, Settings, Trash2 } from "lucide-react"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { InvoiceDetailsTab } from "../widgets/invoiceDetailsTab"
import { InvoiceCreditNotesTab } from "../widgets/invoiceCreditNotesTab"
import { InvoicePaymentsTab } from "../widgets/invoicePaiementsTab"
import { Status, UpdateDocumentStatusModal } from "../widgets/updateStatusModal"
import { SendDocumentModal } from "../widgets/sendInvoiceModal"
import { DeleteInvoiceModal } from "../widgets/deleteInvoiceModal"
import { invoiceTypeSchema } from "../../types/invoiceType"

export default function ClientInvoiceDetails({ invoiceId, type }: InvoiceDetailsProps) {
    const {  invoice, previewDocument, setPreviewDocument, sendToTTN, TtnModalOpen, setTtnModalOpen,
        hasCreditInvoice,loading, sent, successMessage, router, updateStatus,deleteLoading,
        updateLoading,
        updateOpen,
        setUpdateOpen,
        setNextStatus,
        nextStatus,
        sendOpen,
        setSendOpen,
        setDeleteOpen,
        deleteOpen,
        telecharger,
        deleteClientInvoice } = useClientInvoiceDetails({ invoiceId, type });

    const [activeTab, setActiveTab] = useState("details");

    const [openSections, setOpenSections] = useState({
        creditNotes: true,
        payments: true,
    });

    const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
        ...prev,
        [section]: !prev[section],
    }));
    };

    const actions = [
  {
    label: "Cloner",
    icon: Copy,
    onClick: () =>
      router.push(`/billing/invoices/clients/${invoice?.idInvoice}/clone`),
    visible: invoice?.invoiceType === invoiceTypeSchema.enum.SALE,
  },
  {
    label: "Télécharger",
    icon: Download,
    onClick: () => telecharger(),
    visible: true,
  },
  {
    label: "Mettre à jour statut",
    icon: Settings,
    onClick: () => setUpdateOpen(true),
    disabled: invoice?.invoiceStatus === "CANCELLED",
    visible: true,
  },
  {
    label: "Envoyer",
    icon: Send,
    onClick: () => setSendOpen(true),
    disabled: invoice?.invoiceStatus === "CANCELLED",
    visible: invoice?.invoiceType === invoiceTypeSchema.enum.SALE,
  },
  {
    label: "Modifier",
    icon: Pencil,
    onClick: () =>
      router.push(`/billing/invoices/clients/${invoice?.idInvoice}/edit`),
    disabled:
      invoice?.invoiceStatus === "PAID" ||
      invoice?.invoiceStatus === "CANCELLED",
    visible: invoice?.invoiceType === invoiceTypeSchema.enum.SALE,
  },
  {
    label: "Supprimer",
    icon: Trash2,
    color: "text-rose-600",
    hover: "hover:bg-rose-50",
    onClick: () => setDeleteOpen(true),
    disabled: false,
    visible: true,
  },
];

const menuItems = actions.filter((action) => action.visible)
        if(loading){
            return(
                <PageLoader label="Chargement de facture ..."/>
            )
        }
        if(!invoice){
                return (
                <div className="p-6">
                    <p className="text-sm font-semibold text-slate-500">
                    Facture introuvable.
                    </p>
                </div>
                );   
     }
    return (
    <div className="min-h-screen bg-gray-50 font-sans">
        {/* TOP BAR */}
        <DocumentTopBar
        documentTypeLabel="Facture"
        documentNumber={invoice?.invoiceNumber}
        statusLabel={
            invoice?.invoiceStatus
            ? invoiceStatusLabels[invoice.invoiceStatus]
            : "-"
        }
        statusVariant="pending"
        issueDate={formatDateLong(invoice?.issueDate)}
        dueDate={formatDateLong(invoice?.dueDate)}
        onBack={() => router.back()}
        actionItems={menuItems}
        />

        <main className="mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {/* Tabs Header */}
            <div className="w-full">
            <TabsList className="flex h-11 w-full rounded-xl bg-slate-100 p-1 gap-1">
                <TabsTrigger
                value="details"
                className="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold text-slate-500 transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm cursor-pointer"
                >
                <FileText className="h-4 w-4" />
                Détails
                </TabsTrigger>

                
                <TabsTrigger
                value="payments"
                className="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold text-slate-500 transition-all data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm cursor-pointer"
                >
                <CreditCard className="h-4 w-4" />
                Paiements
                </TabsTrigger>

                <TabsTrigger
                value="creditNotes"
                className="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold text-slate-500 transition-all data-[state=active]:bg-white data-[state=active]:text-rose-600 data-[state=active]:shadow-sm cursor-pointer"
                >
                <ReceiptText className="h-4 w-4" />
                Factures d’avoirs
                </TabsTrigger>

            </TabsList>
            </div>

            {/* Onglet Détails */}
            <TabsContent value="details" className="space-y-5">
            <InvoiceDetailsTab
                invoice={invoice}
                invoiceId={invoiceId}
                type={type}
                hasCreditInvoice={hasCreditInvoice}
                TtnModalOpen={TtnModalOpen}
                setTtnModalOpen={setTtnModalOpen}
                sendToTTN={sendToTTN}
                updateStatus={()=>updateStatus(invoiceStatusSchema.enum.PAID)}
                loading={loading}
                sent={sent}
                successMessage={successMessage}
                setPreviewDocument={setPreviewDocument}
            />
            </TabsContent>

            {/* Onglet Factures d'avoirs */}
            <TabsContent value="creditNotes" className="space-y-5">
            <InvoiceCreditNotesTab
                invoiceId={invoiceId}
                type={type}
                isDisabled={invoice.invoiceStatus === invoiceStatusSchema.enum.PAID || invoice.invoiceStatus === invoiceStatusSchema.enum.DRAFT ||
                    invoice.invoiceStatus === invoiceStatusSchema.enum.CANCELLED || invoice.invoiceStatus === invoiceStatusSchema.enum.ARCHIVED
                }
            />
            </TabsContent>

            {/* Onglet Paiements */}
            <TabsContent value="payments" className="space-y-5">
            <InvoicePaymentsTab
                invoiceId={invoiceId}
                open={openSections.payments}
                onToggle={() => toggleSection("payments")}
                isDisabled={invoice.invoiceStatus === invoiceStatusSchema.enum.PAID || invoice.invoiceStatus === invoiceStatusSchema.enum.DRAFT ||
                    invoice.invoiceStatus === invoiceStatusSchema.enum.CANCELLED || invoice.invoiceStatus === invoiceStatusSchema.enum.ARCHIVED
                }
            />
            </TabsContent>
        </Tabs>
        </main>

        <DocumentPreviewModal
        open={!!previewDocument}
        onClose={() => setPreviewDocument(null)}
        document={previewDocument}
        />
            <UpdateDocumentStatusModal
            documentType="invoice"
            open={updateOpen}
            onClose={()=> setUpdateOpen(false)}
            onConfirm={()=>updateStatus()}
            documentNumber={invoice?.invoiceNumber}
            currentStatus={invoice?.invoiceStatus}
            nextStatus={nextStatus as Status}
            onNextStatusChange={setNextStatus}
            allowedStatuses={
                invoice
                ? getClientInvoiceAllowedNextStatuses(invoice.invoiceStatus)
                : []
            }
            isSubmitting={updateLoading}
            />



            <SendDocumentModal
                document={invoice}
                variant="invoice"
                isOpen={sendOpen}
                onClose={() => setSendOpen(false)}
            />

            <DeleteInvoiceModal 
                documentType="invoice"
                documentRef={invoice.invoiceNumber}
                open={deleteOpen} 
                onClose={()=> setDeleteOpen(false)} 
                onConfirm={deleteClientInvoice}
                loading={deleteLoading}      
            />
    </div>
    );
}