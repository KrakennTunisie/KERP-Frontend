"use client";

import PartnerForm from "../partner/partnerForm";
import { ClientPartnerItem, UpdatePartner, updatePartnerSchema } from "../../models/partner";
import { Modal } from "@/shared/components/ui/modal";
import { SubmitHandler } from "react-hook-form";
import { appToast } from "@/shared/lib/toast";
import { partnersApi } from "../../api/partners-api";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";


type Props = {
  open: boolean;
  data: ClientPartnerItem;
  onClose: () => void;
  onCreated?: () => void; // refresh list, etc.
};

export default function ClientUpdateModal({ open, onClose, /*onCreated*/ data }: Props) {
      const onSubmit: SubmitHandler<UpdatePartner> = async (values) => {
        try {
          const updatedClient = await partnersApi.updateClient(data.idPartner, values);

          if (updatedClient) {
            appToast.success("Client modifié avec succès");
            onClose();
          }
        } catch (e: unknown) {
          const message = getApiErrorMessage(e);
          appToast.error(message);
          
        }
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