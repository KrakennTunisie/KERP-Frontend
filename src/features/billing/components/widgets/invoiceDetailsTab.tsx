import { FileText, ReceiptText } from "lucide-react";
import { invoiceStatusSchema } from "../../types/invoiceStatus";
import Card from "./card";
import { SectionLabel } from "./sectionLabel";
import ShieldIcon from "./shieldIcon";
import { SendToTTNModal } from "./ttnConfirmationModal";
import { InfoBlock } from "@/shared/components/ui/infoBlock";
import { paymentMethodLabels } from "../../types/paymentMethod";
import { InvoiceDocumentsCard } from "./invoiceDocumentCard";
import { InvoiceAuditCard } from "./invoiceAuditCard";
import { InvoiceComplianceCard } from "./invoiceComplianceCard";
import { InvoiceItemsCard } from "./invoiceItemsCard";
import { Invoice } from "../../models/invoice";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { DocumentOrFile } from "@/shared/components/ui/documentPreviewModal";

type InvoiceDetailsTabProps = {
  invoice: Invoice | undefined;
  invoiceId: string;
  type: "CLIENT" | "SUPPLIER";
  hasCreditInvoice: boolean;

  TtnModalOpen: boolean;
  setTtnModalOpen: (value:boolean)=> void;

  sendToTTN: () => void | Promise<void>;
  updateStatus: () => void | Promise<void>;

  loading: boolean;
  sent: boolean;
  successMessage?: string;

  setPreviewDocument: Dispatch<SetStateAction<DocumentOrFile>>;
};
export function InvoiceDetailsTab({
  invoice,
  invoiceId,
  type,
  hasCreditInvoice,
  TtnModalOpen,
  setTtnModalOpen,
  sendToTTN,
  updateStatus,
  loading,
  sent,
  successMessage,
  setPreviewDocument,
}: InvoiceDetailsTabProps) {
    const router  = useRouter()
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_320px]">
      {/* LEFT */}
      <div className="flex flex-col gap-4">
        {/* Fiscal status */}
        <Card>
          <div className="flex items-center gap-4">
            <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-xl bg-blue-600 p-3">
              <ShieldIcon />
            </div>

            <div className="flex-1">
              {invoice?.invoiceComplianceStatus === "TTN_ACCEPTED" ? (
                <p className="mt-0.5 text-sm font-medium text-green-600">
                  {"Ce document est validé par l'administration fiscale"}.
                </p>
              ) : invoice?.invoiceComplianceStatus === "TTN_REJECTED" ? (
                <p className="mt-0.5 text-sm font-medium text-red-600">
                  {"Ce document est rejeté par l'administration fiscale."}
                </p>
              ) : (
                <p className="mt-0.5 text-sm font-medium text-gray-500">
                  Ce document est en attente de validation.
                </p>
              )}
            </div>

            <button
              disabled={invoice?.invoiceStatus === invoiceStatusSchema.enum.DRAFT}
              onClick={() => setTtnModalOpen(true)}
              className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Envoyer au TTN
            </button>
          </div>
        </Card>

        <SendToTTNModal
          open={TtnModalOpen}
          onClose={() => setTtnModalOpen(false)}
          onConfirm={sendToTTN}
          loading={loading}
          invoiceSent={sent}
          invoiceRef={invoice?.invoiceNumber}
          successMessage={successMessage}
        />

        {/* Actions rapides */}
        <Card>
          <SectionLabel>Actions rapides</SectionLabel>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {hasCreditInvoice ? (
              <button
                onClick={() =>
                  type === "CLIENT"
                    ? router.push(`/billing/invoices/clients/${invoiceId}/credit-note`)
                    : router.push(`/billing/invoices/suppliers/${invoiceId}/credit-note`)
                }
                className="flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 py-3.5 text-sm font-bold text-rose-600 transition-all hover:brightness-95"
              >
                <ReceiptText className="h-4 w-4" />
                Liste factures d’avoir
              </button>
            ) : (
              <button
                onClick={() =>
                  router.push(`/billing/invoices/clients/${invoiceId}/credit-note/create`)
                }
                disabled={
                  invoice?.invoiceStatus === invoiceStatusSchema.enum.PAID ||
                  invoice?.invoiceStatus === invoiceStatusSchema.enum.DRAFT
                }
                className="flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 py-3.5 text-sm font-bold text-rose-600 transition-all hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ReceiptText className="h-4 w-4" />
                Créer avoir
              </button>
            )}

            <button
              disabled={
                invoice?.invoiceStatus === invoiceStatusSchema.enum.PAID ||
                invoice?.invoiceStatus === invoiceStatusSchema.enum.DRAFT
              }
              onClick={updateStatus}
              className="flex items-center justify-center gap-2 rounded-xl border border-blue-300 bg-blue-100 py-3.5 text-sm font-bold text-blue-700 transition-all hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {invoice?.invoiceStatus === invoiceStatusSchema.enum.PAID
                ? "Marqué Payé ✓"
                : "Marquer Payé"}
            </button>
          </div>
        </Card>

        {/* Client + Admin */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <SectionLabel>Informations client</SectionLabel>

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>

              <div>
                <p className="text-sm font-bold text-gray-900">
                  {invoice?.partner?.partnerName ?? "—"}
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  {invoice?.partner?.billingAddress?.region ?? "—"}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Téléphone
                </p>
                <p className="font-mono text-xs font-bold text-gray-900">
                  {invoice?.partner?.professionnalPhoneNumber ?? "—"}
                </p>
              </div>

              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Contact
                </p>
                <p className="truncate text-sm font-bold text-gray-900">
                  {invoice?.partner?.email ?? "—"}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <SectionLabel>Détails administratifs</SectionLabel>

            <div className="grid grid-cols-2 gap-3">
              {invoice?.purchaseOrder && (
                <InfoBlock
                  label="Bon de commande"
                  value={invoice.purchaseOrder.purchaseOrderNumber}
                />
              )}

              <InfoBlock
                label="Méthode de paiement"
                value={
                  invoice?.paymentMethod
                    ? paymentMethodLabels[invoice.paymentMethod]
                    : "—"
                }
              />

              <InfoBlock
                label="Devise"
                value={invoice?.invoiceCurrency ?? "—"}
              />
            </div>
          </Card>
        </div>

        {/* Items table */}
        <InvoiceItemsCard invoice={invoice} />
      </div>

      {/* RIGHT */}
      <aside className="flex flex-col gap-4">
        <InvoiceComplianceCard invoice={invoice} />

        <InvoiceAuditCard invoice={invoice} />

        <InvoiceDocumentsCard
          invoice={invoice}
          setPreviewDocument={setPreviewDocument}
        />
      </aside>
    </div>
  );
}