import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import { Invoice } from "../models/invoice";
import { Partner } from "../models/partner";
import { InvoiceItem } from "../models/invoiceItem";
export type InvoiceDetailsProps = {
  invoiceId?: String
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
    const router = useRouter()
    
  const setStatusPaiement = () => {
  setInvoice((prev) => {
    if (!prev) return prev;

    return {
      ...prev,
      invoiceStatus: "PAYÉE",
    };
  });
};

    useEffect(()=>{

    },[invoiceId])

    return ({
        marked,
        setMarked,
        setStatusPaiement,
        invoice,
        invoiceItems,
        client,
        router
    })
}