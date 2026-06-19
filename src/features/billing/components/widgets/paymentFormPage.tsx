"use client";

import {
  CalendarDays,
  CreditCard,
  FileText,
  Hash,
  ReceiptText,
  Save,
  Wallet,
} from "lucide-react";

import { formatDateLong } from "@/shared/utils/formatDate";
import { SectionLabel } from "../widgets/sectionLabel";
import Card from "../widgets/card";
import { AmountRow, SummaryRow } from "@/shared/components/ui/amountRow";
import { FormSelect } from "@/shared/components/ui/formSelect";
import { Input } from "@/shared/components/ui/input";
import { SearchableInvoiceSelect } from "@/shared/components/ui/searchableSelectForm";
import {
  paymentMethodLabels,
  paymentMethodSchema,
} from "../../types/paymentMethod";
import useCreatePayment from "../../hooks/useCreateUpdatePayment";
import { invoiceStatusLabels } from "../../types/invoiceStatus";
import { DocumentPreviewModal } from "@/shared/components/ui/documentPreviewModal";

type PaymentFormPageProps = {
  mode: "create" | "update" | "clone";
  paymentId?: string;
  invoiceId?:string | null ;
};

export default function PaymentFormPage({
  mode,
  paymentId,
  invoiceId
}: PaymentFormPageProps) {
  const {
    router,
    register,
    onSubmit,
    getError,
    invoices,
    selectedInvoice,
    selectedInvoiceNumber,
    handleInvoiceChange,
    createLoading,
    updateLoading,
    loadingPayment,
    search,
    setSearch,pdf,
    max, isModalOpen, setIsModalOpen,
    submitPayment,
    onCloseDocumentModal,
    total
  } = useCreatePayment({
    mode,
    paymentId,
    invoiceId
  });

const isUpdate = mode === "update";
const isClone = mode === "clone";
const isEditMode = isUpdate || isClone;

const submitLoading = createLoading || updateLoading;

  if (isUpdate && loadingPayment) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm font-semibold text-slate-500">
          Chargement du paiement...
        </p>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-slate-50 font-[Inter,system-ui,sans-serif]">
      <header className="sticky top-0 z-30 mb-5 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              {isUpdate
                ? "Modification du paiement"
                : isClone
                    ? "Clonage du paiement"
                    : "Création de paiement"}
            </h1>

            <p className="mt-0.5 text-xs font-medium text-slate-400">
              {isUpdate
                ? "Modifier les informations du paiement sélectionné."
                : isClone
                    ? "Créer un nouveau paiement à partir d’un paiement existant."
                    : "Créer un paiement et le rattacher à une facture."}
            </p>
          </div>
        </div>
      </header>

      <form className="mx-3 pb-8" onSubmit={onSubmit}>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <Card>
              <div className="mb-5">
                <SectionLabel>Facture à régler</SectionLabel>
                <p className="mt-1 text-xs font-medium text-slate-400">
                  Le paiement sera rattaché à la facture sélectionnée.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <SearchableInvoiceSelect
                  label="Facture"
                  error={getError("invoiceNumber")}
                  value={selectedInvoiceNumber}
                  invoices={invoices}
                  search={search}
                  setSearch={setSearch}
                  onChange={handleInvoiceChange}
                />
              </div>
            </Card>

            <Card>
              <div className="mb-5">
                <SectionLabel>Informations paiement</SectionLabel>
                <p className="mt-1 text-xs font-medium text-slate-400">
                  Renseignez les informations principales du paiement.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  id="reference"
                  required
                  label="Numéro paiement"
                  placeholder="Ex : PAY-2026-00001"
                  icon={<Hash className="h-4 w-4 text-emerald-600" />}
                  error={getError("reference")}
                  disabled={isUpdate}
                  {...register("reference")}
                />

                <Input
                  id="date"
                  required
                  type="date"
                  label="Date paiement"
                  icon={<CalendarDays className="h-4 w-4 text-emerald-600" />}
                  error={getError("date")}
                  {...register("date")}
                />

                <Input
                  id="amount"
                  required
                  type="number"
                  label="Montant"
                  step={"00.01"}
                  max={max}
                  min={0}
                  icon={<Wallet className="h-4 w-4 text-emerald-600" />}
                  error={getError("amount")}
                  {...register("amount",{
                                     valueAsNumber: true
                                })
                    }
                />

                <FormSelect
                  id="method"
                  label="Méthode de paiement"
                  icon={<CreditCard className="h-4 w-4 text-emerald-600" />}
                  error={getError("method")}
                  {...register("method")}
                >
                  {Object.values(paymentMethodSchema.enum).map((method) => (
                    <option key={method} value={method}>
                      {paymentMethodLabels[method]}
                    </option>
                  ))}
                </FormSelect>
              </div>
            </Card>
          </div>

          <aside className="space-y-6">
            <Card>
              <div className="mb-5">
                <SectionLabel>Résumé facture</SectionLabel>
                <p className="mt-1 text-xs font-medium text-slate-400">
                  Informations de la facture sélectionnée.
                </p>
              </div>

              {selectedInvoice ? (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                      <ReceiptText className="h-5 w-5 text-blue-600" />
                    </div>

                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-blue-600">
                      Facture sélectionnée
                    </p>

                    <p className="mt-1 text-base font-black text-slate-950">
                      {selectedInvoice.invoiceNumber}
                    </p>

                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      {selectedInvoice.partner?.partnerName ?? "—"}
                    </p>
                  </div>

                  <SummaryRow
                    label="Date émission"
                    value={formatDateLong(selectedInvoice.issueDate)}
                  />

                  <SummaryRow
                    label="Date échéance"
                    value={
                      selectedInvoice.dueDate
                        ? formatDateLong(selectedInvoice.dueDate)
                        : "—"
                    }
                  />

                  <SummaryRow
                    label="Statut"
                    value={invoiceStatusLabels[selectedInvoice.invoiceStatus]}
                  />

                  <div className="my-2 h-px bg-slate-100" />

                  <AmountRow
                    label="Total facture"
                    value={total}
                    currency={selectedInvoice.invoiceCurrency}
                  />

                  <AmountRow
                    label="Reste à payer"
                    value={Number(selectedInvoice.remainingAmount.toFixed(2))}
                    currency={selectedInvoice.invoiceCurrency}
                    strong
                  />
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
                  <FileText className="mx-auto h-8 w-8 text-slate-300" />

                  <p className="mt-3 text-sm font-bold text-slate-500">
                    Aucune facture sélectionnée
                  </p>

                  <p className="mt-1 text-xs font-medium text-slate-400">
                    Choisissez une facture pour afficher son résumé.
                  </p>
                </div>
              )}
            </Card>

            <Card>
              <div className="mb-5">
                <SectionLabel>Actions</SectionLabel>
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {isUpdate ? "Modifier le paiement" : "Enregistrer le paiement"}
                </button>

                <button
                  type="button"
                  onClick={() => router.back()}
                  className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  Annuler
                </button>
              </div>
            </Card>
          </aside>
        </div>
      </form>

              <DocumentPreviewModal
                open={isModalOpen}
                onClose={()=> setIsModalOpen(false)}
                onCreateInvoice={submitPayment}
                document={pdf}
                loading={submitLoading}
                type=""
            />
    </div>
  );
}