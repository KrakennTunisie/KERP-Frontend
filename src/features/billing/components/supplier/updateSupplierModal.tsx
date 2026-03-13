"use client";

import PartnerForm from "../partner/partnerForm";
import { SupplierPartnerItem, UpdatePartner, updatePartnerSchema } from "../../models/partner";
import { Modal } from "@/shared/components/ui/modal";
import { SubmitHandler } from "react-hook-form";
import { appToast } from "@/shared/lib/toast";
import { partnersApi } from "../../api/partners-api";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";


type Props = {
  open: boolean;
  data: SupplierPartnerItem;
  onClose: () => void;
  onCreated?: () => void; // refresh list, etc.
};

export default function SupplierUpdateModal({ open, onClose, onCreated, data }: Props) {
      const onSubmit: SubmitHandler<UpdatePartner> = async (values) => {
        try {
          const updatedSupplier = await partnersApi.updateSupplier(data.idPartner, values);

          if (updatedSupplier) {
            appToast.success("Fournisseur modifié avec succès");
            onClose();
          }
        } catch (e: any) {
          const message = getApiErrorMessage(e);
          appToast.error(message);
          
        }
      };

  return (
    <Modal
      open={open}
      title="Modifier un fournisseur"
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