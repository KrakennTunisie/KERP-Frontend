import { Modal } from "@/shared/components/ui/modal";
import { formatDateLongWithTime } from "@/shared/utils/formatDate";

type DocumentType = "invoice" | "credit-note" | "purchase-order"| "payment";

type DeleteDocumentModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  documentRef?: string;
  documentType: DocumentType;
  loading?: boolean;
};

const documentConfig = {
  "invoice": {
    title: "Supprimer la facture",
    label: "facture",
    referenceLabel: "Référence facture",
  },
  "credit-note": {
    title: "Supprimer l'avoir",
    label: "avoir",
    referenceLabel: "Référence avoir",
  },
  "purchase-order": {
    title: "Supprimer le bon de commande",
    label: "bon de commande",
    referenceLabel: "Référence bon de commande",
  },
  "payment": {
    title: "Supprimer le paiement",
    label: "paiement",
    referenceLabel: "Référence paiement",
  },
} as const;

export function DeleteInvoiceModal({
    open,
    onClose,
    onConfirm,
    documentRef,
    documentType,
    loading,
}: DeleteDocumentModalProps) {


const config = documentConfig[documentType];

    const handleConfirm = async () => {
        await onConfirm();
    };

    const footer = (
        <>
            {/* Cancel */}
            <button
                onClick={onClose}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl border border-gray-300
                    text-sm font-semibold text-gray-700
                    hover:bg-gray-50 transition-colors
                    disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
                Annuler
            </button>

            {/* Confirm Delete */}
            <button
                onClick={handleConfirm}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                    bg-red-600 text-white text-sm font-semibold
                    hover:bg-red-700 transition-colors
                    disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
                {loading ? (
                    <>
                        <svg
                            className="animate-spin h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                        </svg>
                        Suppression…
                    </>
                ) : (
                    <>
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
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                        </svg>
                        Supprimer
                    </>
                )}
            </button>
        </>
    );

    return (
        <Modal
            open={open}
            title={config.title ?? "Suppression"}
            onClose={onClose}
            footer={footer}
        >
            {/* Warning banner */}
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl p-4 mb-4">
                <div className="flex-shrink-0 mt-0.5">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-red-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                </div>
                <p className="text-sm text-red-800 leading-relaxed">
                        Cette action est <span className="font-semibold">irréversible</span>.{" "}
                        {`Le ${config.label} sera définitivement supprimé et ne pourra pas être récupéré.`}   
               </p>
            </div>

            {/* Detail row */}
            <div className="bg-gray-50 rounded-2xl px-4 py-3 flex flex-col gap-2 text-sm text-gray-700">
                {documentRef && (
                    <div className="flex items-center justify-between">
                        <span className="text-gray-500">{config.referenceLabel}</span>
                        <span className="font-semibold text-gray-900 font-mono">{documentRef}</span>
                    </div>
                )}
                <div className="flex items-center justify-between">
                    <span className="text-gray-500">Date de suppression</span>
                    <span className="font-semibold text-gray-900">
                    
                        {formatDateLongWithTime(new Date())}
                    </span>
                </div>
            </div>

            {/* Confirmation question */}
            <p className="mt-4 text-sm text-gray-600">
                Êtes-vous sûr de vouloir supprimer définitivement ce {config.label} ?
            </p>
        </Modal>
    );
}