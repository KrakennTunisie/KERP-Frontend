"use client";

import PartnerForm from "../partnerForm";
import { CreateClientPartner, createClientPartnerSchema } from "../../models/partner";
import { Modal } from "@/shared/components/ui/modal";
import { SubmitHandler } from "react-hook-form";
import { appToast } from "@/shared/lib/toast";


type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void; // refresh list, etc.
};

export default function ClientCreateModal({ open, onClose, onCreated }: Props) {

      const onSubmit: SubmitHandler<CreateClientPartner> = async (values) => {
        //const loadingId = appToast.loading("Création du client...", "Upload des documents en cours");

        setTimeout(()=>{
            console.log(values.email);
            console.log(values.rne); // File
            console.log(values.partnerType); // "SUPPLIER"
        },3000)
        await new Promise((resolve) => setTimeout(resolve, 2000));
        onClose();
        appToast.success("client créé avec succès");
       // appToast.dismiss(loadingId);
        //appToast.error("Échec de création", "Veuillez réessayer.");
  
      };

  return (
    <Modal
      open={open}
      title="Ajouter un client"
      onClose={onClose}
    >
      <PartnerForm
        schema={createClientPartnerSchema}
        submitLabel="Ajouter"
        defaultValues={{
          partnerType: "CLIENT",
        }}
        onSubmit={onSubmit}
      />
    </Modal>
  );
}