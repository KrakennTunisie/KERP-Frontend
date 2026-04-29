import { useEffect, useState } from "react";
import { Partner } from "../models/partner";
import { DocumentOrFile } from "@/shared/components/ui/documentPreviewModal";
import { PurchaseOrder, PurchaseOrderDetails } from "../models/purchaseOrder";
import { InvoiceItem } from "../models/invoiceItem";
import { useRouter } from "next/navigation";
import { PurchaseOrderAPI } from "../api/partners-api";
import { appToast } from "@/shared/lib/toast";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
export type PurchaseOrderDetailsProps = {
  purchaseOrderId: string
}
export default function usePurchaseOrderDetails({purchaseOrderId}:PurchaseOrderDetailsProps) {
        const [previewDocument, setPreviewDocument] =useState<DocumentOrFile>(null);
        const [purchaseOrder , setPurchaseOrder]=useState<PurchaseOrderDetails>();
        const [purchaseOrderItems,setpurchaseOrderItems]=useState<InvoiceItem>();
        const [loadingDetails, setLoadingDetails] = useState(false);
        const [successMessage, setSuccessMessage] = useState("");
        const router = useRouter()

    const fetchPurchaseOrder = async () => {
        try {
          setLoadingDetails(true)
          const purchaseOrder = await PurchaseOrderAPI.getClientPurchaseOrderById(purchaseOrderId);
          setPurchaseOrder(purchaseOrder);
        } catch (error) {
          appToast.error("Erreur Fetch du client:",getApiErrorMessage(error));
        }
        finally{
          setLoadingDetails(false)
        }
      };
    
    
      useEffect(() => {
      fetchPurchaseOrder();
    
    }, [purchaseOrderId]);
    return{
        router,
        purchaseOrder,
        successMessage,
        purchaseOrderItems,
        setPreviewDocument,
        previewDocument,
        loadingDetails
    }
}