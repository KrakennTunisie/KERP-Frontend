"use client";

import { appToast } from "@/shared/lib/toast";
import { useState } from "react";
import ConfirmDeleteModal from "@/shared/components/ui/confirmDeleteModal";


type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void; // refresh list, etc. 
  confirmDeleteId: string| null;
};

export default function SupplierDeleteModal({ open, onClose, onCreated, confirmDeleteId }: Props) {
    console.log("data: ", confirmDeleteId)
    const [isDeleting, setIsDeleting] = useState<boolean>(false)
      const handleDelete = async ( ) => {
        setIsDeleting(true)
        //const loadingId = appToast.loading("Création du client...", "Upload des documents en cours");

        setTimeout(()=>{
            console.log(confirmDeleteId);
        },3000)
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsDeleting(false)
        onClose();
        appToast.success("fournisseur supprimé avec succès");
       // appToast.dismiss(loadingId);
        //appToast.error("Échec de création", "Veuillez réessayer.");
  
      };

  return (
                <ConfirmDeleteModal
                    open={open}
                    message="Voulez-vous vraiment supprimer ce fournisseur ?"
                    dangerLabel="Cette action est irréversible."
                    isLoading={isDeleting}
                    onCancel={onClose}
                    onConfirm={handleDelete}
                />
  );
}