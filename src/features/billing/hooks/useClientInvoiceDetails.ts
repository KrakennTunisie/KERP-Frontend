import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import { Invoice } from "../models/invoice";
import { Partner } from "../models/partner";
import { InvoiceItem } from "../models/invoiceItem";
export type InvoiceDetailsProps = {
  invoiceId?: string
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
export default function useClientInvoiceDetails ({invoiceId}:InvoiceDetailsProps){
    const [marked, setMarked] = useState(false)
    const [client,setClient]= useState<Partner>();
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

  useEffect(()=>{

    },[invoiceId]);

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
        sendToTTN,
        loading,
        successMessage,
        sent,
        TtnModalOpen,
        setTtnModalOpen,
        hasCreditInvoice,
        router
    })
}