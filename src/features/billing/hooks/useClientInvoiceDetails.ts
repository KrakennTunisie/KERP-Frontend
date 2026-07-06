import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import { Invoice } from "../models/invoice";
import { Partner } from "../models/partner";
import { InvoiceItem } from "../models/invoiceItem";
import { InvoicesAPI } from "../api/partners-api";
import { appToast } from "@/shared/lib/toast";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { DocumentOrFile } from "@/shared/components/ui/documentPreviewModal";
import { openDocumentInNewTab } from "@/shared/pdf/pdfGenerator";
import { InvoiceStatus, invoiceStatusSchema, InvoiceStatusWithoutAll } from "../types/invoiceStatus";
import { InvoiceCreditNotePageItem } from "../models/creditNote";
export type InvoiceDetailsProps = {
  invoiceId: string,
  type: "CLIENT"|"SUPPLIER"
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
    
    const [deleteLoading, setDeleteLoading]= useState(false)
    const [updateLoading, setUpdateLoading]= useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [sendOpen, setSendOpen] = useState(false);
    const [updateOpen, setUpdateOpen] = useState(false);
    const [nextStatus, setNextStatus]=useState<InvoiceStatus | string>("")
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

  const updateStatus = async (status?: string)=>{
        try {
        setUpdateLoading(true)
        const formData = new FormData();
          
        const finalStatus = status ?? nextStatus;
        console.log("final status", status)
        formData.append("status",  String(finalStatus));
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
        setUpdateOpen(false)
      } catch (error) {
        appToast.error("Erreur Fetch du client:",getApiErrorMessage(error));
      }
      finally{
        setUpdateLoading(false)
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

     const deleteClientInvoice = async ()=>{
        try {
          setDeleteLoading(true);
          if(type=="CLIENT"){

            await InvoicesAPI.deleteClientInvoice(invoiceId);
            }
            else{
              
            await InvoicesAPI.deleteSupplierInvoice(invoiceId);
          }   
          appToast.success('Facture supprimée avec succès.')
          setDeleteOpen(false)
          type=="CLIENT" ? router.push('/billing/invoices/clients') : router.push('/billing/invoices/suppliers') 
        } catch (error) {
          appToast.error("Erreur de suppresion: ",getApiErrorMessage(error))
        } finally {
          setDeleteLoading(false);
        }
    }

      const telecharger = async ()=>{
        if(invoice && invoice.invoiceDocument)
            await openDocumentInNewTab(invoice.invoiceDocument?.storageURL)
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
        router,
        deleteOpen,
        setDeleteOpen,
        deleteLoading,
        setDeleteLoading,
        updateLoading,
        setUpdateLoading,
        updateOpen,
        setUpdateOpen,
        setNextStatus,
        nextStatus,
        sendOpen, setSendOpen,
        deleteClientInvoice,
        telecharger,
    })
}