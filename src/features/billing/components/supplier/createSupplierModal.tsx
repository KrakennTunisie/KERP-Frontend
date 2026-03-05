"use client";

import PartnerForm from "../partnerForm";
import { createClientPartnerSchema, createSupplierPartnerSchema } from "../../models/partner";
import { Modal } from "@/shared/components/ui/modal";


type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void; // refresh list, etc.
};

export default function SupplierCreateModal({ open, onClose, onCreated }: Props) {
  return (
    <Modal
      open={open}
      title="Ajouter un fournisseur"
      onClose={onClose}
      footer={
        <button
          onClick={onClose}
          className="px-5 py-3 rounded-2xl border border-gray-200 font-black hover:bg-gray-50"
        >
          Fermer
        </button>
      }
    >
      <PartnerForm
        schema={createSupplierPartnerSchema}
        submitLabel="Ajouter"
        defaultValues={{
          partnerType: "SUPPLIER",
        }}
        onSubmit={async (data) => {
          // await billingPartnersApi.create(values);
          // onCreated?.();
          console.log(data)
          onClose();
        }}
      />
    </Modal>
  );
}