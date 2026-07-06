import { Modal } from "@/shared/components/ui/modal";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

type ToggleSettingStatusModalProps = {
  open: boolean;
  loading?: boolean;
  itemName?: string;
  isActive: boolean;
  onClose: () => void;
  onSubmit: () => void;
};

export default function ToggleSettingStatusModal({
  open,
  loading = false,
  itemName,
  isActive,
  onClose,
  onSubmit,
}: ToggleSettingStatusModalProps) {
  const activate = !isActive;

  return (
    <Modal
      open={open}
      title={activate ? "Activer l'élément" : "Désactiver l'élément"}
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="
              inline-flex h-10 items-center justify-center
              rounded-xl border border-slate-200 bg-white
              px-5 text-sm font-semibold text-slate-700
              transition-all

              hover:bg-slate-50 hover:border-slate-300

              disabled:cursor-not-allowed
              disabled:bg-slate-100
              disabled:text-slate-400
            "
          >
            Annuler
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onSubmit}
            className={`
              inline-flex h-10 min-w-[140px]
              items-center justify-center gap-2
              rounded-xl px-5
              text-sm font-semibold text-white
              shadow-sm transition-all

              disabled:cursor-not-allowed
              disabled:shadow-none

              ${
                activate
                  ? `
                    bg-emerald-600
                    hover:bg-emerald-700
                    disabled:bg-emerald-400
                  `
                  : `
                    bg-rose-600
                    hover:bg-rose-700
                    disabled:bg-rose-400
                  `
              }
            `}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {activate ? "Activation..." : "Désactivation..."}
              </>
            ) : (
              <>
                {activate ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}

                {activate ? "Activer" : "Désactiver"}
              </>
            )}
          </button>
        </>
      }
    >
      <div className="space-y-4">

        <div
          className={`
            flex items-start gap-3 rounded-xl border p-4

            ${
              activate
                ? "border-emerald-200 bg-emerald-50"
                : "border-rose-200 bg-rose-50"
            }
          `}
        >
          <div
            className={`
              rounded-full p-2

              ${
                activate
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-rose-100 text-rose-600"
              }
            `}
          >
            {activate ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <XCircle className="h-5 w-5" />
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">
              {activate
                ? "Confirmation de l'activation"
                : "Confirmation de la désactivation"}
            </p>

            <p className="mt-1 text-sm text-slate-600">
              Voulez-vous vraiment{" "}
              <span className="font-semibold">
                {activate ? "activer" : "désactiver"}
              </span>{" "}
              <span className="font-semibold text-slate-900">
                "{itemName}"
              </span>{" "}
              ?
            </p>
          </div>
        </div>

        {!activate && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
            <p className="text-xs text-amber-800">
              Un élément désactivé ne pourra plus être utilisé lors de la création
              de nouveaux documents de facturation, mais restera disponible pour
              les documents existants.
            </p>
          </div>
        )}

      </div>
    </Modal>
  );
}