"use client";

import PartnerForm from "../partnerForm";
import { createClientPartnerSchema } from "../../models/partner";
import { Modal } from "@/shared/components/ui/modal";


type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void; // refresh list, etc.
};

export default function ClientCreateModal({ open, onClose, onCreated }: Props) {
  return (
    <Modal
      open={open}
      title="Ajouter un client"
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
        schema={createClientPartnerSchema}
        submitLabel="Ajouter"
        defaultValues={{
          partnerType: "CLIENT",
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