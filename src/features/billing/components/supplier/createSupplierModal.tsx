"use client";

import PartnerForm from "../partner/partnerForm";
import {  CreateSupplierPartner, createSupplierPartnerSchema } from "../../models/partner";
import { Modal } from "@/shared/components/ui/modal";


import { SubmitHandler } from "react-hook-form";
import { appToast } from "@/shared/lib/toast";
import { partnersApi } from "../../api/partners-api";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";

type SupplierCreateModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function SupplierCreateModal({ open, onClose }: SupplierCreateModalProps) {

      const onSubmit: SubmitHandler<CreateSupplierPartner> = async (values) => {
        try {
          const createdClient = await partnersApi.createSupplier(values);

          if (createdClient) {
            appToast.success("Fournisseur créé avec succès");
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
      title="Ajouter un fournisseur"
      onClose={onClose}
    >
      <PartnerForm
        schema={createSupplierPartnerSchema}
        submitLabel="Ajouter"
        defaultValues={{
          partnerType: "SUPPLIER",
        }}
        onSubmit={onSubmit}
      />
    </Modal>
  );
}