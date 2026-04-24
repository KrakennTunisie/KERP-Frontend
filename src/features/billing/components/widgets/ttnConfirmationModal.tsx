import { Modal } from "@/shared/components/ui/modal";


type SendToTTNModalProps = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
    invoiceRef?: string;
    loading?: boolean;
    invoiceSent?: boolean
    successMessage?: string
};

export function SendToTTNModal({
    open,
    onClose,
    onConfirm,
    invoiceRef,
    loading,
    invoiceSent,
    successMessage
}: SendToTTNModalProps) {
    const footer = (
        <>
            {/* Cancel */}
            <button
                onClick={onClose}
                disabled={loading || invoiceSent}
                className="
          px-5 py-2.5 rounded-xl border border-gray-300
          text-sm font-semibold text-gray-700
          hover:bg-gray-50 transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
          cursor-pointer">
                Annuler
            </button>

            {/* Confirm */}
            <button
                onClick={onConfirm}
                disabled={loading || invoiceSent}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semiboldhover:bg-blue-700 transition-colors
            disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer ">
                {loading ? (
                    <>
                        {/* Spinner */}
                        <svg
                            className="animate-spin h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                            />
                        </svg>
                        Envoi en cours…
                    </>
                ) : (
                    <>
                        {/* Send icon */}
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
                        Envoyer au TTN
                    </>
                )}
            </button>
        </>
    );

    return (
        <Modal
            open={open}
            title="Envoyer la facture aux autorités fiscales (TTN)"
            onClose={onClose}
            footer={footer}
        >
            {/* Warning banner */}
            {successMessage ? (
                <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-500 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <p className="text-sm font-semibold text-blue-800">{successMessage}</p>
                </div>
            ) : (
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4">
                    {/* Warning icon */}
                    <div className="flex-shrink-0 mt-0.5">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-amber-500"
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
                    <p className="text-sm text-amber-800 leading-relaxed">
                        Toute facture électronique doit obligatoirement être soumise aux autorités fiscales (TTN) pour validation technique et contrôle de conformité de son contenu.
                    </p>
                </div>
            )}

            {/* Detail row */}
            <div className="bg-gray-50 rounded-2xl px-4 py-3 flex flex-col gap-2 text-sm text-gray-700">
                {invoiceRef && (
                    <div className="flex items-center justify-between">
                        <span className="text-gray-500">Référence facture</span>
                        <span className="font-semibold text-gray-900 font-mono">
                            {invoiceRef}
                        </span>
                    </div>
                )}
                <div className="flex items-center justify-between">
                    <span className="text-gray-500">Destinataire</span>
                    <span className="font-semibold text-gray-900">
                        Autorités fiscales — TTN
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-gray-500">{"Date d'envoi"}</span>
                    <span className="font-semibold text-gray-900">
                        {new Date().toLocaleDateString("fr-TN", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                        })}
                    </span>
                </div>
            </div>

            {/* Confirmation question */}
            <p className="mt-4 text-sm text-gray-600">
                {"Souhaitez-vous confirmer l'envoi de cette facture aux autorités fiscales ?"}
            </p>
        </Modal>
    );
}

