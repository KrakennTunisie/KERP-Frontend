"use client";

import PartnerForm from "../partnerForm";
import {  CreateSupplierPartner, createSupplierPartnerSchema } from "../../models/partner";
import { Modal } from "@/shared/components/ui/modal";


import { SubmitHandler } from "react-hook-form";
import { appToast } from "@/shared/lib/toast";

type SupplierCreateModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function SupplierCreateModal({ open, onClose }: SupplierCreateModalProps) {

    const onSubmit: SubmitHandler<CreateSupplierPartner> = async (values) => {
        const loadingId = appToast.loading("Création du fournisseur...", "Upload des documents en cours");

        setTimeout(()=>{
            console.log(values.email);
            console.log(values.rne); // File
            console.log(values.partnerType); // "SUPPLIER"
        },3000)
        await new Promise((resolve) => setTimeout(resolve, 2000));
        onClose();
        //appToast.success("Fournisseur créé avec succès");
        appToast.dismiss(loadingId);
        appToast.error("Échec de création", "Veuillez réessayer.");


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