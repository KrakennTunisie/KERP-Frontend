import { FileText, Info, ReceiptText } from "lucide-react";
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
import { partnerTypeSchema } from "../../types/partnerType";
import { invoiceTypeSchema } from "../../types/invoiceType";

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
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_300px]">
  {/* LEFT */}
  <div className="flex flex-col gap-3">

    {/* Fiscal status */}
    <Card>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600">
          <ShieldIcon />
        </div>

        <div className="flex-1">
          {invoice?.invoiceComplianceStatus === "TTN_ACCEPTED" ? (
            <p className="text-xs font-medium text-green-600">
              {"Validé par l'administration fiscale"}
            </p>
          ) : invoice?.invoiceComplianceStatus === "TTN_REJECTED" ? (
            <p className="text-xs font-medium text-red-600">
              {"Rejeté par l'administration fiscale"}
            </p>
          ) : (
            <p className="text-xs font-medium text-gray-500">
              En attente de validation fiscale
            </p>
          )}
        </div>

        <button
          disabled={invoice?.invoiceStatus === invoiceStatusSchema.enum.DRAFT}
          onClick={() => setTtnModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          Envoyer TTN
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
      <SectionLabel>Actions</SectionLabel>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {hasCreditInvoice ? (
          <button
            onClick={() =>
              type === "CLIENT"
                ? router.push(`/billing/invoices/clients/${invoiceId}/credit-note`)
                : router.push(`/billing/invoices/suppliers/${invoiceId}/credit-note`)
            }
            className="flex items-center justify-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 py-2.5 text-xs font-semibold text-rose-600"
          >
            <ReceiptText className="h-3.5 w-3.5" />
            Avoirs
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
            className="flex items-center justify-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 py-2.5 text-xs font-semibold text-rose-600 disabled:opacity-50"
          >
            <ReceiptText className="h-3.5 w-3.5" />
            Créer avoir
          </button>
        )}

        <button
          disabled={
            invoice?.invoiceStatus === invoiceStatusSchema.enum.PAID ||
            invoice?.invoiceStatus === invoiceStatusSchema.enum.DRAFT
          }
          onClick={updateStatus}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-blue-300 bg-blue-100 py-2.5 text-xs font-semibold text-blue-700 disabled:opacity-50"
        >
          {invoice?.invoiceStatus === invoiceStatusSchema.enum.PAID
            ? "Payé ✓"
            : "Marquer payé"}
        </button>
      </div>
    </Card>

    {/* Client + Admin */}
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">

      {/* Client */}
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <SectionLabel>Client</SectionLabel>

          {invoice?.partner?.idPartner && (
            <button
                  type="button"
                  onClick={() =>
                    invoice?.partner?.partnerType === partnerTypeSchema.enum.CLIENT
                      ? router.push(`/billing/clients/${invoice.partner.idPartner}`)
                      : router.push(`/billing/suppliers/${invoice?.partner?.idPartner}`)
                  }
                  className="
                    inline-flex items-center gap-2
                    rounded-xl border border-blue-200
                    bg-white px-3 py-2
                    text-xs font-semibold text-blue-600
                    shadow-sm
                    transition-all
                    hover:border-blue-300
                    hover:bg-blue-50
                    hover:shadow
                    cursor-pointer
                  "
                >
                  <Info className="h-3.5 w-3.5" />
                  Consulter
              </button>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
            <FileText className="h-4 w-4 text-blue-600" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">
              {invoice?.partner?.partnerName ?? "—"}
            </p>
            <p className="truncate text-xs text-gray-500">
              {invoice?.partner?.billingAddress?.region ?? "—"}
            </p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-gray-100 pt-3 text-xs">
          <div>
            <p className="text-[10px] font-semibold uppercase text-gray-400">
              Tel
            </p>
            <p className="font-mono text-gray-900">
              {invoice?.partner?.professionnalPhoneNumber ?? "—"}
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase text-gray-400">
              Email
            </p>
            <p className="truncate text-gray-900">
              {invoice?.partner?.email ?? "—"}
            </p>
          </div>
        </div>
      </Card>

      {/* Admin */}
      <Card>
        <SectionLabel>Admin</SectionLabel>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {invoice?.purchaseOrder && (
            <div className="col-span-2 flex flex-col gap-1">
              <InfoBlock
                label="Bon commande"
                value={invoice.purchaseOrder.purchaseOrderNumber}
              />

              <button
                type="button"
                onClick={() =>
                  invoice.invoiceType == invoiceTypeSchema.enum.PURCHASE
                    ? router.push(`/purchase-orders/clients/${invoice.purchaseOrder?.idPurchaseOrder}`)
                    : router.push(`/purchase-orders/suppliers/${invoice.purchaseOrder?.idPurchaseOrder}`)
                }
                className="text-xs text-blue-600 hover:underline"
              >
                Voir BC
              </button>
            </div>
          )}

          <InfoBlock
            label="Paiement"
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

    {/* Items */}
    <InvoiceItemsCard invoice={invoice} />
  </div>

  {/* RIGHT */}
  <aside className="flex flex-col gap-3">
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