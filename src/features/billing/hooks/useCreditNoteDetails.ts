import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { DocumentOrFile } from "@/shared/components/ui/documentPreviewModal";
import { appToast } from "@/shared/lib/toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { InvoicesCreditNoteAPI } from "../api/partners-api";
import { InvoiceCreditNoteDetails } from "../models/creditNote";
import { InvoiceItem } from "../models/invoiceItem";
import { Partner } from "../models/partner";
import { InvoiceStatus, invoiceStatusSchema } from "../types/invoiceStatus";


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

    const [deleteLoading, setDeleteLoading]= useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [sendOpen, setSendOpen] = useState(false);

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

  const updateStatus = async (status : InvoiceStatus)=>{
        try {
        setLoading(true)
        const formData = new FormData();
          
        formData.append("status",  status);
        const invoice = await InvoicesCreditNoteAPI.updateInvoiceCreditNoteStatus(creditNoteId, formData);
        setInvoice(invoice);
      } catch (error) {
        appToast.error("Erreur Fetch du client:",getApiErrorMessage(error));
      }
      finally{
        setLoading(false)
      }
  }


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

         const deleteCreditNote = async ()=>{
            try {
              if(invoice){

              setDeleteLoading(true);
              await InvoicesCreditNoteAPI.deleteInvoiceCreditNote(invoice?.idInvoiceCreditNote);
              appToast.success("Facture d'avoir supprimée avec succès.")
              setDeleteOpen(false)
              router.back()
              }
            } catch (error) {
              appToast.error("Erreur de suppresion: ",getApiErrorMessage(error))
            } finally {
              setDeleteLoading(false);
            }
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
        updateStatus,
        sendOpen,
        setSendOpen,
        deleteLoading,
        setDeleteLoading,
        deleteOpen,
        setDeleteOpen,
        deleteCreditNote,
previewDocument, setPreviewDocument,

    })
}