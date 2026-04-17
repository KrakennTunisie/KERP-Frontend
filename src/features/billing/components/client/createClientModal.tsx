"use client";

import PartnerForm from "../partner/partnerForm";
import { CreateClientPartner, createClientPartnerSchema } from "../../models/partner";
import { Modal } from "@/shared/components/ui/modal";
import { SubmitHandler } from "react-hook-form";
import { appToast } from "@/shared/lib/toast";
import { partnersApi } from "../../api/partners-api";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";


type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void; // refresh list, etc.
};

export default function ClientCreateModal({ open, onClose, onCreated}: Props) {
      
  const onSubmit: SubmitHandler<CreateClientPartner> = async (values) => {
        try {
          const formData = new FormData();

          formData.append("name", values.name);
          formData.append("email", values.email);
          formData.append("address", values.address);
          formData.append("country", values.country);
          formData.append("iban", values.iban);
          formData.append("partnerType", values.partnerType);
          formData.append("phoneNumber", values.phoneNumber);
          formData.append("taxRegistrationNumber", values.taxRegistrationNumber);

         
          if (values.rne) formData.append("rne", values.rne);
          if (values.patente) formData.append("patente", values.patente);
          if (values.contract) formData.append("contract", values.contract);

          console.log("form data: ", formData.getAll("rne"))

          const createdClient = await partnersApi.createClient(formData);

          if (createdClient) {
            appToast.success("Client créé avec succès");
            onClose();
            onCreated();
          }
        } catch (e:unknown) {
          const message = getApiErrorMessage(e);
          appToast.error('Échec de création , Veuillez réessayer.', message );
          
        }
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