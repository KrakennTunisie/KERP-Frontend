"use client";

import { Modal } from "@/shared/components/ui/modal";
import { InvoiceStatus, invoiceStatusLabels } from "../../types/invoiceStatus";
import {
  purchaseOrderStatus,
  purchaseOrderStatusLabels,
} from "../../types/purchaseOrderStatus";
import { ArrowRight, CheckCircle2, FileText } from "lucide-react";

type DocumentType = "invoice" | "credit-note" | "purchase-order";

export type Status =
  | InvoiceStatus
  | purchaseOrderStatus;

type UpdateDocumentStatusModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  documentNumber?: string;

  currentStatus?: Status;
  nextStatus: Status | "";

  documentType: DocumentType;

  onNextStatusChange: (status: Status) => void;

  allowedStatuses: Status[];

  isSubmitting?: boolean;
};

export function UpdateDocumentStatusModal({
  open,
  onClose,
  onConfirm,
  documentNumber,
  currentStatus,
  nextStatus,
  documentType,
  onNextStatusChange,
  allowedStatuses,
  isSubmitting = false,
}: UpdateDocumentStatusModalProps) {

const isInvoice = documentType === "invoice";
const isCreditNote = documentType === "credit-note";
const isPurchaseOrder = documentType === "purchase-order";

  const documentLabel =
  isInvoice
    ? "facture"
    : isCreditNote
      ? "avoir"
      : "bon de commande";

const documentNumberLabel =
  isInvoice
    ? "Numéro de facture"
    : isCreditNote
      ? "Numéro de l'avoir"
      : "Numéro de bon de commande";

const getStatusLabel = (status: Status) => {
  if (isInvoice || isCreditNote) {
    return invoiceStatusLabels[status as InvoiceStatus];
  }

  return purchaseOrderStatusLabels[
    status as purchaseOrderStatus
  ];
};

const currentStatusLabel = currentStatus
  ? getStatusLabel(currentStatus)
  : "-";

  const hasAllowedStatuses = allowedStatuses.length > 0;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Mettre à jour le statut"
      footer={
        <div className="flex w-full items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="
              inline-flex items-center justify-center rounded-xl
              border border-slate-200 bg-white px-4 py-2
              text-sm font-medium text-slate-700
              transition-colors hover:bg-slate-50
              cursor-pointer
              disabled:cursor-not-allowed disabled:opacity-50
            "
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={!nextStatus || !hasAllowedStatuses || isSubmitting}
            className="
              inline-flex items-center justify-center gap-2 rounded-xl
              bg-blue-600 px-4 py-2
              text-sm font-semibold text-white shadow-sm
              transition-colors hover:bg-blue-700
              cursor-pointer
              disabled:cursor-not-allowed disabled:bg-blue-300
            "
          >
            <CheckCircle2 className="h-4 w-4" />
            {isSubmitting ? "Mise à jour..." : "Confirmer"}
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-white p-4">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-100">
              <FileText className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-semibold tracking-tight text-slate-900">
                Changement de statut
              </p>
              <p className="text-xs font-medium text-slate-500">
                Mise à jour du statut de la {documentLabel}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-blue-100 bg-white p-3 shadow-sm shadow-blue-50">
              <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.12em] text-blue-500">
                {documentNumberLabel}
              </p>
              <p className="truncate text-sm font-semibold text-slate-900">
                {documentNumber || "-"}
              </p>
            </div>

            <div className="rounded-xl border border-blue-100 bg-white p-3 shadow-sm shadow-blue-50">
              <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.12em] text-blue-500">
                Statut actuel
              </p>
              <p className="truncate text-sm font-semibold text-slate-900">
                {currentStatusLabel}
              </p>
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="nextStatus"
            className="mb-2 block text-sm font-semibold text-slate-800"
          >
            Nouveau statut
          </label>

          <div className="relative">
            <select
              id="nextStatus"
              value={nextStatus}
              disabled={!hasAllowedStatuses || isSubmitting}
              onChange={(e) =>
                onNextStatusChange(e.target.value as Status)
              }
              className="
                w-full appearance-none rounded-2xl
                border border-blue-100 bg-white px-4 py-3 pr-10
                text-sm font-medium text-slate-900 shadow-sm
                outline-none transition-all
                focus:border-blue-400 focus:ring-4 focus:ring-blue-100
                disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400
              "
            >
              <option value="">Sélectionner un statut</option>

              {allowedStatuses.map((status) => (
                <option key={status} value={status}>
                  {getStatusLabel(status)}
                </option>
              ))}
            </select>

            <ArrowRight className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-400" />
          </div>

          {hasAllowedStatuses && nextStatus && (
            <p className="mt-2 text-xs font-medium text-blue-600">
              Le nouveau statut sélectionné sera appliqué après confirmation.
            </p>
          )}

          {!hasAllowedStatuses && (
            <p className="mt-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
              Aucun changement de statut autorisé pour cette {documentLabel}.
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}