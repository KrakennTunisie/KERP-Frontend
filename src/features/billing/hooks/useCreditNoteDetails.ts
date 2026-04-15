import { useRouter } from "next/navigation";
import { useState } from "react";
import { Partner } from "../models/partner";
import { InvoiceItem } from "../models/invoiceItem";
import { Invoice } from "../models/invoice";
import { invoiceStatusSchema } from "../types/invoiceStatus";


export type PropsCreditNote = {
    params: { creditNoteId: string }
}

export default function useCreditNoteDetails({ params }: PropsCreditNote) {
    const [marked, setMarked] = useState(false)
    const [client, setClient] = useState<Partner>();
    const [invoice, setInvoice] = useState<Invoice>();
    const [invoiceItems, setInvoiceItems] = useState<InvoiceItem>();
    const [TtnModalOpen, setTtnModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const router = useRouter()

    // modifier la statut de paiement
    const setStatusPaiement = () => {
        setInvoice((prev) => {
            if (!prev) return prev;

            return {
                ...prev,
                invoiceStatus: invoiceStatusSchema.enum.PAID,
            };
        });
    };
    // Envoyer au TTN
    function sendToTTN ()
 {
  setLoading(true);
  setTimeout(() => {
    setLoading(false)
    setSuccessMessage("La facture a été envoyée avec succès au TTN.")
    setSent(true)
  }, 10000);
 }
    return ({
        marked,
        setMarked,
        client,
        setClient,
        invoice,
        invoiceItems,
        TtnModalOpen,
        setTtnModalOpen,
        loading,
        sent,
        successMessage,
        router,
        sendToTTN,
        setStatusPaiement

    })
}