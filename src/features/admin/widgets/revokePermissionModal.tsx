import { Modal } from "@/shared/components/ui/modal";
import { Role } from "../mocks/mock-roles";
import { Permission } from "../mocks/mock-permission";
import { ShieldMinus } from "lucide-react";


type Revoke_Permission_Props = {
  revokeModalOpen: boolean;
  selectedPermission: Permission;
  selectedRole: Role;
  onClose: () => void;
  onSubmit: () => void;
};

export default function RevokePermissionModal({
  revokeModalOpen,
  selectedPermission,
  selectedRole,
  onClose,
  onSubmit,
}:Revoke_Permission_Props){

    return(
        <Modal
            open={revokeModalOpen}
            title="Révoquer la permission"
            onClose={onClose}
            footer={
            <>
                <button
                onClick={onClose}
                className="
                    inline-flex h-10 cursor-pointer items-center justify-center
                    rounded-xl border border-slate-200 bg-white
                    px-5 text-sm font-semibold text-slate-700
                    transition-all
                    hover:bg-slate-50 hover:border-slate-300
                    active:scale-[0.98]
                "
                >
                Annuler
                </button>

                <button
                onClick={onSubmit}
                className="
                    inline-flex h-10 cursor-pointer items-center gap-2
                    justify-center rounded-xl
                    bg-rose-600 px-5
                    text-sm font-semibold text-white
                    shadow-sm transition-all
                    hover:bg-rose-700 hover:shadow-md
                    active:scale-[0.98]
                "
                >
                <ShieldMinus className="h-4 w-4" />
                Révoquer la permission
                </button>
            </>
            }
            >
            <p className="text-sm text-slate-600">
                Voulez-vous vraiment révoquer la permission
                <span className="font-semibold">
                {" "}
                {selectedPermission?.label}
                </span>
                {" "}du rôle 
                <span className="font-semibold">
                {" "}
                {selectedRole?.name}
                </span>
            </p>
        </Modal>
    )
}