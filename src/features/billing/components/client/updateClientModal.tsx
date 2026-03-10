"use client";

import PartnerForm from "../partner/partnerForm";
import { UpdatePartner, updatePartnerSchema } from "../../models/partner";
import { Modal } from "@/shared/components/ui/modal";
import { SubmitHandler } from "react-hook-form";
import { appToast } from "@/shared/lib/toast";


type Props = {
  open: boolean;
  data: UpdatePartner;
  onClose: () => void;
  onCreated?: () => void; // refresh list, etc.
};

export default function ClientUpdateModal({ open, onClose, onCreated, data }: Props) {
    console.log("data: ", data)
      const onSubmit: SubmitHandler<UpdatePartner> = async (values) => {
        //const loadingId = appToast.loading("Création du client...", "Upload des documents en cours");

        setTimeout(()=>{
            console.log(values.email);
        },3000)
        await new Promise((resolve) => setTimeout(resolve, 2000));
        onClose();
        appToast.success("client modifié avec succès");
       // appToast.dismiss(loadingId);
        //appToast.error("Échec de création", "Veuillez réessayer.");
  
      };

  return (
    <Modal
      open={open}
      title="Modifier un client"
      onClose={onClose}
    >
      <PartnerForm
        schema={updatePartnerSchema}
        submitLabel="Modifier"
        defaultValues={
            data
        }
        onSubmit={onSubmit}
        type="update"
      />
    </Modal>
  );
}