"use client";

import {
  ArrowLeft,
  CalendarDays,
  Copy,
  CreditCard,
  Currency,
  DollarSign,
  Download,
  FileText,
  Hash,
  Pencil,
  ReceiptText,
  Send,
  Settings,
  Trash2,
  User,
  Wallet,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";

import Card from "../widgets/card";
import { SectionLabel } from "../widgets/sectionLabel";
import PageLoader from "@/shared/components/ui/pageLoader";
import { formatDateLong } from "@/shared/utils/formatDate";
import { BillingPageHeader } from "../widgets/billingHeader";
import { DocumentTopBar } from "../widgets/documentTopBar";
import usePaymentDetails from "../../hooks/usePaymentDetails";
import { invoiceStatusLabels } from "../../types/invoiceStatus";
import { openPdfInNewTab } from "@/shared/pdf/pdfGenerator";
import { paymentToPdfData } from "@/shared/pdf/documentAdapter";
import { AmountLine, InfoCard, MiniInfo, SummaryRow } from "@/shared/components/ui/amountRow";
import { DeleteInvoiceModal } from "../widgets/deleteInvoiceModal";
import { SendDocumentModal } from "../widgets/sendInvoiceModal";
import { InvoiceDocumentsCard } from "../widgets/invoiceDocumentCard";
import { DocumentPreviewModal } from "@/shared/components/ui/documentPreviewModal";

type Payment = {
  id: string;
  paymentNumber: string;
  date: Date;
  amount: number;
  method: string;
  invoiceNumber: string;
};

type RelatedInvoice = {
  id: string;
  invoiceNumber: string;
  invoiceStatus: string;
  issueDate: Date;
  dueDate?: Date | null;
  totalInclTaxEUR?: number | null;
  totalInclTaxTND?: number | null;
  paidAmount?: number | null;
  remainingAmount?: number | null;
  currency?: string | null;
  partner?: {
    id: string;
    partnerName: string;
    email?: string | null;
    professionnalPhoneNumber?: string | null;
    taxRegistrationNumber?: string | null;
    billingAddress?: {
      street?: string | null;
      city?: string | null;
      region?: string | null;
      country?: string | null;
    } | null;
  } | null;
};

type PaymentDetails = Payment & {
  invoice?: RelatedInvoice | null;
};

const paymentMethodLabels: Record<string, string> = {
  CASH: "Espèces",
  BANK_TRANSFER: "Virement bancaire",
  CHECK: "Chèque",
  CARD: "Carte bancaire",
  OTHER: "Autre",
};

export default function PaymentDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const paymentId = params.paymentId as string;

   const { payment, loading,     sendOpen,
    setSendOpen,
    deleteLoading,
    setDeleteLoading,
    deleteOpen,
    deletePayment,previewDocument, setPreviewDocument,
    setDeleteOpen, telecharger } = usePaymentDetails({ paymentId });




   
  if (loading) {
    return <PageLoader label="Chargement du paiement ..." />;
  }
  if (!payment) {
    return (
      <div className="p-6">
        <p className="text-sm font-semibold text-slate-500">
          Paiement introuvable.
        </p>
      </div>
    );
  }
  const relatedInvoice = payment.invoice;
  const partner = relatedInvoice?.partner;

  const paymentMethodLabel =
    paymentMethodLabels[payment.method] ?? payment.method ?? "—";

  const invoiceTotal =
    relatedInvoice?.invoiceCurrency === "TND"
      ? relatedInvoice?.totalInclTaxTND
      :relatedInvoice?.invoiceCurrency === "EUR"
        ? relatedInvoice?.totalInclTaxEUR
        : relatedInvoice?.totalInclTaxUSD;

return (
  <div className="min-h-screen bg-slate-50 font-[Inter,system-ui,sans-serif]">
    <DocumentTopBar
      documentTypeLabel="Paiement"
      documentNumber={payment?.reference ?? "—"}
      statusVariant="success"
      issueDate={formatDateLong(payment?.paymentDate)}
      onBack={() => router.back()}
      actionItems={[
        {
          label: "Modifier",
          icon: Pencil,
          onClick: () => router.push(`/billing/payments/update/${payment?.idPayment}`),
        },
        {
          label: "Voir la facture",
          icon: FileText,
          onClick: () =>
            router.push(`/billing/invoices/clients/${payment?.invoice?.idInvoice}/details`),
          disabled: !payment?.invoice?.idInvoice,
        },
        {
          label: "Cloner",
          icon: Copy,
          onClick: () =>
            router.push(`/billing/payments/clone/${payment?.idPayment}`),
          disabled: !payment?.invoice?.idInvoice,
        },
        {
          label: "Télécharger",
          icon: Download,
          onClick: () => telecharger(),
        },
        {
        label: "Envoyer",
        icon: Send,
        onClick: () => setSendOpen(true),
        },
        {
          label: "Supprimer",
          icon: Trash2,
          color: "text-rose-600",
          hover: "hover:bg-rose-50",
          onClick: () => setDeleteOpen(true),
        },
      ]}
    />

    <main className="mx-auto  px-6 py-6">
      {/* Résumé principal */}


      {/* Grille principale */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Colonne gauche */}
        <div className="space-y-6 xl:col-span-2">
          {/* Paiement */}
          <Card>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <SectionLabel>Informations paiement</SectionLabel>
                <p className="mt-1 text-xs font-medium text-slate-400">
                  Détails administratifs du règlement
                </p>
              </div>

              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 ring-1 ring-emerald-100">
                Validé
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoCard
                icon={<Hash className="h-4 w-4 text-emerald-600" />}
                label="Référence paiement"
                value={payment?.reference}
                tone="emerald"
              />

              <InfoCard
                icon={<CalendarDays className="h-4 w-4 text-emerald-600" />}
                label="Date de paiement"
                value={ formatDateLong(payment.paymentDate) }
                tone="emerald"
              />

              <InfoCard
                icon={<CreditCard className="h-4 w-4 text-emerald-600" />}
                label="Méthode"
                value={paymentMethodLabel}
                tone="emerald"
              />

              <InfoCard
                icon={<ReceiptText className="h-4 w-4 text-emerald-600" />}
                label="Facture liée"
                value={payment?.invoice.invoiceNumber ?? relatedInvoice?.invoiceNumber}
                tone="emerald"
              />
            </div>
          </Card>

          {/* Facture associée */}
          <Card>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <SectionLabel>Facture associée</SectionLabel>
                <p className="mt-1 text-xs font-medium text-slate-400">
                  Informations de la facture rattachée à ce paiement
                </p>
              </div>

              {relatedInvoice?.idInvoice && (
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/billing/invoices/clients/${relatedInvoice.idInvoice}/details`
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5 text-sm font-black text-blue-700 transition hover:bg-blue-100"
                >
                  <FileText className="h-4 w-4" />
                  Ouvrir la facture
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <InfoCard
                icon={<FileText className="h-4 w-4 text-blue-600" />}
                label="Numéro facture"
                value={relatedInvoice?.invoiceNumber}
                tone="blue"
              />

              <InfoCard
                icon={<CalendarDays className="h-4 w-4 text-blue-600" />}
                label="Date émission"
                value={
                  relatedInvoice?.issueDate
                    ? formatDateLong(relatedInvoice.issueDate)
                    : "—"
                }
                tone="blue"
              />

            

              <InfoCard
                icon={<Wallet className="h-4 w-4 text-blue-600" />}
                label="Total TTC"
                value={
                  invoiceTotal != null
                    ? invoiceTotal
                    : "—"
                }
                tone="blue"
              />
              <InfoCard
                icon={<DollarSign className="h-4 w-4 text-blue-600" />}
                label="Devise"
                value={
                  relatedInvoice.invoiceCurrency
                }
                tone="blue"
              />
            </div>
          </Card>

          {/* Client / fournisseur */}
          <Card>
            <div className="mb-5">
              <SectionLabel>Client / fournisseur</SectionLabel>
              <p className="mt-1 text-xs font-medium text-slate-400">
                Partie associée à la facture réglée
              </p>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-slate-50/80 p-5">
              <div className="flex flex-col gap-5 md:flex-row md:items-start">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
                  <User className="h-7 w-7 text-slate-700" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-lg font-black text-slate-950">
                    {partner?.partnerName ?? "—"}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    {partner?.email ?? "Email non renseigné"}
                  </p>

                  <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
                    <MiniInfo
                      label="Téléphone"
                      value={partner?.professionnalPhoneNumber}
                    />

                    <MiniInfo
                      label="Matricule fiscal"
                      value={partner?.taxRegistrationNumber}
                    />

                    <MiniInfo
                      label="Adresse"
                      value={[
                        partner?.billingAddress?.street1,
                        partner?.billingAddress?.city,
                        partner?.billingAddress?.region,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Colonne droite */}
        <aside className="space-y-6">
          {/* État de règlement */}
          <Card>
            <div className="mb-5">
              <SectionLabel>État de règlement</SectionLabel>
              <p className="mt-1 text-xs font-medium text-slate-400">
                Suivi financier de la facture
              </p>
            </div>

            <div className="space-y-3">
              <AmountLine
                label="Total facture"
                value={invoiceTotal}
                currency={relatedInvoice?.invoiceCurrency ?? "EUR"}
              />

              <AmountLine
                label="Montant payé"
                value={ payment?.amount}
                currency={relatedInvoice?.invoiceCurrency ?? "EUR"}
              />

              <AmountLine
                label="Reste à payer"
                value={Number((invoiceTotal - payment?.amount).toFixed(2))}
                currency={relatedInvoice?.invoiceCurrency ?? "EUR"}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                Statut facture
              </p>

              <p className="mt-2 text-sm font-black text-slate-950">
                {invoiceStatusLabels[relatedInvoice?.invoiceStatus] ?? "—"}
              </p>
            </div>
          </Card>

          {/* Résumé rapide */}
          <Card>
            <div className="mb-5">
              <SectionLabel>Résumé</SectionLabel>
            </div>

            <div className="space-y-3">
              <SummaryRow
                label="Paiement"
                value={payment?.reference}
              />

              <SummaryRow
                label="Facture"
                value={relatedInvoice?.invoiceNumber ?? payment?.invoice.invoiceNumber}
              />

              <SummaryRow
                label="Méthode"
                value={paymentMethodLabel}
              />

              <SummaryRow
                label="Date"
                value={payment?.paymentDate ? formatDateLong(payment.paymentDate) : "—"}
              />
            </div>
          </Card>
                  <InvoiceDocumentsCard
                    invoice={payment}
                    setPreviewDocument={setPreviewDocument}
                  />
        </aside>
      </section>
    </main>

                <DeleteInvoiceModal 
                    open={deleteOpen} 
                    onClose={()=> setDeleteOpen(false)} 
                    onConfirm={deletePayment}
                    loading={deleteLoading}      
                />

                <SendDocumentModal
                    document={payment}
                    variant="payment"
                    isOpen={sendOpen}
                    onClose={() => setSendOpen(false)}
                />
                        <DocumentPreviewModal
                        open={!!previewDocument}
                        onClose={() => setPreviewDocument(null)}
                        document={previewDocument}
                        />
  </div>
);
}


