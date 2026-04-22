"use client";

import { Modal } from "@/shared/components/ui/modal";
import { InvoiceStatus, invoiceStatusLabels } from "../../types/invoiceStatus";


type UpdateInvoiceStatusModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  invoiceNumber?: string;
  currentStatus?: InvoiceStatus;
  nextStatus: string | "";
  onNextStatusChange: (status: InvoiceStatus) => void;
  allowedStatuses: InvoiceStatus[];
  isSubmitting?: boolean;
};


export function UpdateInvoiceStatusModal({
  open,
  onClose,
  onConfirm,
  invoiceNumber,
  currentStatus,
  nextStatus,
  onNextStatusChange,
  allowedStatuses,
  isSubmitting = false,
}: UpdateInvoiceStatusModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Mettre à jour le statut"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={!nextStatus || isSubmitting}
            className="px-4 py-2 rounded-xl bg-black text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? "Mise à jour..." : "Confirmer"}
          </button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm text-gray-500 mb-1">Numéro de facture</p>
            <p className="text-base font-bold text-gray-900">
              {invoiceNumber || "-"}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm text-gray-500 mb-1">Statut actuel</p>
            <p className="text-base font-bold text-gray-900">
              {currentStatus ? invoiceStatusLabels[currentStatus] : "-"}
            </p>
          </div>
        </div>

        <div>
          <label
            htmlFor="nextStatus"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Nouveau statut
          </label>

          <select
            id="nextStatus"
            value={nextStatus}
            onChange={(e) => onNextStatusChange(e.target.value as InvoiceStatus)}
            className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">Sélectionner un statut</option>
            {allowedStatuses.map((status) => (
              <option key={status} value={status}>
                {invoiceStatusLabels[status]}
              </option>
            ))}
          </select>

          {allowedStatuses.length === 0 && (
            <p className="mt-2 text-sm text-red-500">
              Aucun changement de statut autorisé pour cette facture.
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}