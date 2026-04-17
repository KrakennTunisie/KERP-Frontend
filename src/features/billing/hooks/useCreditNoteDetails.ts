import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Partner } from "../models/partner";
import { InvoiceItem } from "../models/invoiceItem";
import { Invoice } from "../models/invoice";
import { invoiceStatusSchema } from "../types/invoiceStatus";
import { InvoicesCreditNoteAPI } from "../api/partners-api";
import { InvoiceCreditNote, InvoiceCreditNoteDetails } from "../models/creditNote";
import { appToast } from "@/shared/lib/toast";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { DocumentOrFile } from "@/shared/components/ui/documentPreviewModal";


export type PropsCreditNote = {
    params: { creditNoteId: string }
}

export default function useCreditNoteDetails({ params }: PropsCreditNote) {
    const [marked, setMarked] = useState(false)
    const [previewDocument, setPreviewDocument] =useState<DocumentOrFile>(null);
    
    const [client, setClient] = useState<Partner>();
    const [invoice, setInvoice] = useState<InvoiceCreditNoteDetails>();
    const [creditNoteId, setcreditNoteId]=useState(params.creditNoteId)
    const [invoiceItems, setInvoiceItems] = useState<InvoiceItem>();
    const [TtnModalOpen, setTtnModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const router = useRouter()
  const fetchInvoice = async () => {
    try {
      setLoading(true)
      const invoice = await InvoicesCreditNoteAPI.getCreditNoteById(creditNoteId);
      setInvoice(invoice);
    } catch (error) {
      appToast.error("Erreur Fetch du client:",getApiErrorMessage(error));
    }
    finally{
      setLoading(false)
    }
  };


  useEffect(() => {
  fetchInvoice();

}, [creditNoteId]);
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
        setStatusPaiement,
previewDocument, setPreviewDocument,
    })
}