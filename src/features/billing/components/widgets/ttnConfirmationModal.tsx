import { Modal } from "@/shared/components/ui/modal";
import { Loader2, Mail, Send } from "lucide-react";
import { useRouter } from "next/navigation";


type SendToTTNModalProps = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
    invoiceRef?: string;
    loading?: boolean;
    emailExist? :boolean;
    invoiceSent?: boolean
    successMessage?: string,
    onSendToClient?: ()=>void,
};

export function SendToTTNModal({
    open,
    onClose,
    onConfirm,
    invoiceRef,
    loading,
    emailExist,
    invoiceSent,
    successMessage,
    onSendToClient
}: SendToTTNModalProps) {
    const router = useRouter();
const footer = (
  <>
    {/* Cancel */}
    <button
      onClick={onClose}
      disabled={loading || invoiceSent}
      className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      Annuler
    </button>

    {/* Send to Client */}
    {onSendToClient && 
    <button
      onClick={onSendToClient}
      disabled={loading || invoiceSent || emailExist}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 text-sm font-semibold hover:bg-blue-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
    >
      <Mail className="h-4 w-4" />
      Envoyer au client
    </button>}

    {/* Send to TTN */}
    <button
      onClick={onConfirm}
      disabled={loading || invoiceSent}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Envoi en cours…
        </>
      ) : (
        <>
          <Send className="h-4 w-4" />
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
            onClose={()=> {onClose() ;router.back() ;}}
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

