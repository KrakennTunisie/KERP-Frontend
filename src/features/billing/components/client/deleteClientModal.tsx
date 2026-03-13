"use client";

import { appToast } from "@/shared/lib/toast";
import { useState } from "react";
import ConfirmDeleteModal from "@/shared/components/ui/confirmDeleteModal";
import { partnersApi } from "../../api/partners-api";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";


type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void; // refresh list, etc. 
  confirmDeleteId: string;
};

export default function ClientDeleteModal({ open, onClose, /*onCreated*/ confirmDeleteId }: Props) {
    const [isDeleting, setIsDeleting] = useState<boolean>(false)
      const handleDelete = async ( ) => {
          try {
            setIsDeleting(true)
            await partnersApi.deleteClient(confirmDeleteId);
  
              appToast.success("Client supprimé avec succès");
              onClose();
          } catch (e: unknown) {
            const message = getApiErrorMessage(e);
            appToast.error('Échec de suppression , Veuillez réessayer.', message );
            
          }
          finally{
            setIsDeleting(false)

          }
      };


  return (
                <ConfirmDeleteModal
                    open={open}
                    message="Voulez-vous vraiment supprimer ce client ?"
                    dangerLabel="Cette action est irréversible."
                    isLoading={isDeleting}
                    onCancel={onClose}
                    onConfirm={handleDelete}
                />
  );
}