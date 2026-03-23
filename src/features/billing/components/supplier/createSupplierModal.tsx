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
          console.log("values", values)
          const formData = new FormData();

          formData.append("name", values.name);
          formData.append("email", values.email);
          formData.append("address", values.address);
          formData.append("country", values.country);
          formData.append("iban", values.iban);
          formData.append("partnerType", values.partnerType);
          formData.append("phoneNumber", values.phoneNumber);
          formData.append("taxRegistrationNumber", values.taxRegistrationNumber);

          // fichiers ⚠️ IMPORTANT
          if (values.rne) formData.append("rne", values.rne);
          if (values.patente) formData.append("patente", values.patente);
          if (values.contract) formData.append("contract", values.contract);

          console.log("form data: ", formData.getAll("rne"))

          const createdClient = await partnersApi.createSupplier(formData);

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