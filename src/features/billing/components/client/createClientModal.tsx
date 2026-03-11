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
  onCreated?: () => void; // refresh list, etc.
};

export default function ClientCreateModal({ open, onClose, onCreated }: Props) {
      
  const onSubmit: SubmitHandler<CreateClientPartner> = async (values) => {
        try {
          const createdClient = await partnersApi.createClient(values);

          if (createdClient) {
            appToast.success("Client créé avec succès");
            onClose();
          }
        } catch (e: any) {
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