import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import { Invoice } from "../models/invoice";
import { Partner } from "../models/partner";
import { InvoiceItem } from "../models/invoiceItem";
import { InvoicesAPI } from "../api/partners-api";
import { appToast } from "@/shared/lib/toast";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { DocumentOrFile } from "@/shared/components/ui/documentPreviewModal";
import { invoiceStatusSchema } from "../types/invoiceStatus";
export type InvoiceDetailsProps = {
  invoiceId: string,
  type: string
}



// à reformuler aprés
export const downloadFile = async (fileUrl: string, fileName: string): Promise<void> => {
    try {
        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error('Erreur lors du téléchargement');
        
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Téléchargement échoué :', error);
    }
};
export default function useClientInvoiceDetails ({invoiceId, type}:InvoiceDetailsProps){
    const [marked, setMarked] = useState(false)
    const [client,setClient]= useState<Partner>();
    const [previewDocument, setPreviewDocument] =useState<DocumentOrFile>(null);
    const [invoice , setInvoice]=useState<Invoice>();
    const [invoiceItems,setInvoiceItems]=useState<InvoiceItem>();
    const [TtnModalOpen, setTtnModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [hasCreditInvoice, setHasCreditInvoice] = useState(true);
    const router = useRouter()
   
  //modifier la statut de paiement
  const setStatusPaiement = () => {
  setInvoice((prev) => {
    if (!prev) return prev;

    return {
      ...prev,
      invoiceStatus: "PAID",
    };
  });
};

const updateStatus = async ()=>{
      try {
      setLoading(true)
      const formData = new FormData();
        
      formData.append("status",  invoiceStatusSchema.enum.PAID);
      if(type=="CLIENT"){

      const invoice = await InvoicesAPI.updateClientInvoiceStatus(invoiceId, formData);
      setInvoice(invoice);
      setHasCreditInvoice(invoice?.hasInvoiceCreditNotes ?? false)
      }
      else{
        
      const invoice = await InvoicesAPI.updateSupplierInvoiceStatus(invoiceId, formData);
      setInvoice(invoice);
      setHasCreditInvoice(invoice?.hasInvoiceCreditNotes ?? false)
      }
    } catch (error) {
      appToast.error("Erreur Fetch du client:",getApiErrorMessage(error));
    }
    finally{
      setLoading(false)
    }
}

  const fetchInvoice = async () => {
    try {
      setLoading(true)
      if(type=="CLIENT"){

      const invoice = await InvoicesAPI.getClientInvoiceById(invoiceId);
      setInvoice(invoice);
      setHasCreditInvoice(invoice?.hasInvoiceCreditNotes ?? false)
      }
      else{
        
      const invoice = await InvoicesAPI.getSupplierInvoiceById(invoiceId);
      setInvoice(invoice);
      setHasCreditInvoice(invoice?.hasInvoiceCreditNotes ?? false)
      }
      console.log(invoice);
    } catch (error) {
      appToast.error("Erreur Fetch du client:",getApiErrorMessage(error));
    }
    finally{
      setLoading(false)
    }
  };


  useEffect(() => {
  fetchInvoice();

}, [invoiceId]);
  // Envoyer la facture au TTN
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
        setStatusPaiement,
        invoice,
        invoiceItems,
        client,
        previewDocument,
        setPreviewDocument,
        sendToTTN,
        loading,
        successMessage,
        sent,
        TtnModalOpen,
        setTtnModalOpen,
        hasCreditInvoice,
        updateStatus,
        router
    })
}