"use client";


type ConfirmDeleteModalProps = {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  dangerLabel?: string; // optional small label like "Action irréversible"
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
};

export default function ConfirmDeleteModal({
  open,
  title = "Confirmer la suppression",
  message,
  confirmLabel = "Supprimer",
  cancelLabel = "Annuler",
  dangerLabel,
  onCancel,
  onConfirm,
  isLoading = false,
}: ConfirmDeleteModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-xl border border-gray-100">
        <p className="text-lg font-black text-gray-900">{title}</p>

        <p className="text-sm font-bold text-gray-600 mt-2">{message}</p>

        {dangerLabel && (
          <p className="text-xs font-black text-rose-700 mt-3">{dangerLabel}</p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-5 py-3 rounded-2xl border border-gray-200 font-black hover:bg-gray-50 disabled:opacity-60"
          >
            {cancelLabel}
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-5 py-3 rounded-2xl bg-rose-600 text-white font-black hover:bg-rose-700 disabled:opacity-60"
          >
            {isLoading ? "Suppression..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}