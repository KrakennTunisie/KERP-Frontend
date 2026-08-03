"use client";

import { useEffect, useState } from "react";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { appToast } from "@/shared/lib/toast";
import { paymentsAPI } from "../api/partners-api";
import { PaymentDetails } from "../models/payment";
import { openDocumentInNewTab } from "@/shared/pdf/pdfGenerator";
import { useRouter } from "next/navigation";
import { DocumentOrFile } from "@/shared/components/ui/documentPreviewModal";


type UsePaymentDetailsProps = {
  paymentId?: string;
};

export default function usePaymentDetails({
  paymentId,
}: UsePaymentDetailsProps) {
    const router = useRouter();
  const [previewDocument, setPreviewDocument] =useState<DocumentOrFile>(null);
  
  const [payment, setPayment] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(false);

  const [sendOpen, setSendOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchPaymentDetails = async () => {
    if (!paymentId) return;

    try {
      setLoading(true);

      const response = await paymentsAPI.getPaymentDetails(paymentId);

      setPayment(response);
    } catch (error) {
      appToast.error(
        "Erreur lors du chargement du paiement",
        getApiErrorMessage(error)
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentDetails();
  }, [paymentId]);

  const telecharger = async ()=>{
    if(payment?.paymentDocument)
         await openDocumentInNewTab(payment.paymentDocument?.storageURL)
   }

  const deletePayment = async ()=>{
      try {
        if (!payment) return;
        setDeleteLoading(true);
        await paymentsAPI.deletePayment(payment?.idPayment);
        appToast.success('Paiement supprimé avec succès.')
        setDeleteOpen(false)
        router.back()
      } catch (error) {
        appToast.error("Erreur de suppresion: ",getApiErrorMessage(error))
      } finally {
        setDeleteLoading(false);
      }
  }

  return {
    payment,
    loading,
    sendOpen,
    setSendOpen,
    deleteLoading,
    setDeleteLoading,
    deleteOpen,
    setDeleteOpen,
    deletePayment,
    fetchPaymentDetails,
    telecharger,
    previewDocument, setPreviewDocument
  };
}