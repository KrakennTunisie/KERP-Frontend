import { Modal } from "@/shared/components/ui/modal";
import Spinner from "@/shared/components/ui/spinner";
import { Trash2 } from "lucide-react";

type DeleteSettingModalProps = {
  open: boolean;
  itemName?: string;
  itemType: string;
  onClose: () => void;
  onSubmit: () => void;
  deleteLoading: boolean;
};

export default function DeleteSettingModal({
  open,
  itemName,
  itemType,
  onClose,
  onSubmit,
  deleteLoading
}: DeleteSettingModalProps) {
  return (
    <Modal
      open={open}
      title={`Supprimer ${itemType.toLowerCase()}`}
      onClose={onClose}
      footer={
        <>
            <button
            type="button"
            disabled={deleteLoading}
            onClick={onClose}
            className="
                inline-flex h-10 items-center justify-center
                rounded-xl border border-slate-200 bg-white
                px-5 text-sm font-semibold text-slate-700
                transition-all

                hover:border-slate-300 hover:bg-slate-50

                disabled:cursor-not-allowed
                disabled:border-slate-200
                disabled:bg-slate-100
                disabled:text-slate-400

                active:scale-[0.98]
            "
            >
            Annuler
            </button>

            <button
            type="button"
            disabled={deleteLoading}
            onClick={onSubmit}
            className="
                inline-flex h-10 min-w-[130px]
                items-center justify-center gap-2
                rounded-xl
                bg-rose-600 px-5
                text-sm font-semibold text-white
                shadow-sm
                transition-all

                hover:bg-rose-700 hover:shadow-md

                disabled:cursor-not-allowed
                disabled:bg-rose-400
                disabled:shadow-none

                active:scale-[0.98]
            "
            >
            {deleteLoading ? (
                <>
                <Spinner label="Chargement..."/>
                </>
            ) : (
                <>
                <Trash2 className="h-4 w-4" />
                Supprimer
                </>
            )}
            </button>
        </>
      }
    >
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Voulez-vous vraiment supprimer{" "}
          <span className="font-semibold">
            {itemType.toLowerCase()}
          </span>{" "}
          <span className="font-semibold text-slate-900">
            {itemName}
          </span>{" "}
          ?
        </p>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="text-xs text-amber-800">
            Cette action est irréversible. Si cet élément est utilisé dans des
            documents de facturation, la suppression pourra être refusée.
          </p>
        </div>
      </div>
    </Modal>
  );
}