import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import { purchaseOrderStatus, purchaseOrderStatusSchema } from "../types/purchaseOrderStatus";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { PurchaseOrderAPI } from "../api/partners-api";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { appToast } from "@/shared/lib/toast";
import { PurchaseOrderPageItem, purchaseOrderPageItemSchema } from "../models/purchaseOrder";
export type PropsClient = {
  params: {
    invoiceId: string
  }
}
export function usePurchaseOrderList() {
  const [search, setSearch] = useState("");
  const [filtre, setFiltre] = useState<purchaseOrderStatus>();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const [updateLoading, setUpdateLoading]= useState(false)
  const [invoiceRef, setInvoiceRef] = useState("");
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderPageItem[] | []>([])
  const [open, setOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [idPurchaseOrder, setIdPurchaseOrder] = useState("")
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [nextStatus, setNextStatus]=useState("")
  const [selectedPurchaseOrder, setSelectedPurchaseOrder]= useState<PurchaseOrderPageItem|null>(null)
  const debouncedSearchQuery = useDebounce(search, 2000);
  async function deletePurchaseOrder(idPurchaseOrder: string) {
    try {
      setDeleteLoading(true);
      await PurchaseOrderAPI.deleteClientPurchaseOrder(idPurchaseOrder);
      appToast.success('Bon de commande supprimée avec succès.')
      setDeleteOpen(false)
      await fetchClientsPurchaseOrders()
    } catch (error) {
      appToast.error("Erreur de suppresion: ", getApiErrorMessage(error))
    } finally {
      setDeleteLoading(false);
    }
    //setPurchaseOrder(idPurchaseOrder);
  }
  const fetchClientsPurchaseOrders = async () => {
    try {
      setLoading(true);
      const keyword =
        debouncedSearchQuery.trim().length >= 3
          ? debouncedSearchQuery.trim()
          : undefined;

      const response = await PurchaseOrderAPI.getClientsPurchaseOrders({
        keyword: keyword,
        filter: filtre?.toString() === purchaseOrderStatusSchema.enum.ALL ? "" : filtre?.toString(),
        page: currentPage - 1,
      });

      setPurchaseOrders(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      appToast.error("Erreur de fetch clients: ", getApiErrorMessage(error))
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery]);

  useEffect(() => {

    fetchClientsPurchaseOrders();
  }, [invoiceRef, debouncedSearchQuery, currentPage, filtre]);

  const updateStatus = async ()=>{
            try {
            setLoading(true)
            const formData = new FormData();
            formData.append("status",  nextStatus);
            console.log(idPurchaseOrder)
            await PurchaseOrderAPI.updatePurchaseOrderStatus(idPurchaseOrder, formData);
            appToast.success('Statut mise à jour avec succès avec succès.')
            setUpdateOpen(false)
            await fetchClientsPurchaseOrders()
          } catch (error) {
            appToast.error("Erreur Fetch du client:",getApiErrorMessage(error));
          }
          finally{
            setLoading(false)
            setIdPurchaseOrder("")
          }
  }


  const router = useRouter()
  return {
    router,
    search,
    setSearch,
    deleteOpen,
    setDeleteOpen,
    setInvoiceRef,
    invoiceRef,
    filtre,
    setFiltre,
    totalElements,
    totalPages,
    purchaseOrders,
    deletePurchaseOrder,
    setIdPurchaseOrder,
    idPurchaseOrder,
    open,
    setOpen,
    updateOpen,
    setUpdateOpen,
    selectedPurchaseOrder,
    setSelectedPurchaseOrder,
    nextStatus,
    setNextStatus,
    updateLoading,
    setUpdateLoading,
    updateStatus
  }
}

