import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import { purchaseOrderStatus, purchaseOrderStatusSchema } from "../types/purchaseOrderStatus";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { PurchaseOrderAPI } from "../api/partners-api";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { appToast } from "@/shared/lib/toast";
import { PurchaseOrderPageItem, purchaseOrderPageItemSchema } from "../models/purchaseOrder";
import { create } from "zustand";
export type PropsClient = {
  params: {
    invoiceId: string
  }
}
type Store = {
  file: File | null;
  fileUrl: string | null;

  setFile: (file: File | null) => void;
  setFileUrl: (url: string | null) => void;
};
export const usePurchaseOrderStore = create<Store>((set) => ({
  file: null,
  fileUrl: null,

  setFile: (file) => set({ file }),
  setFileUrl: (url) => set({ fileUrl: url }),
}));
export function usePurchaseOrderList() {
  const [search, setSearch] = useState("");
  const [filtre, setFiltre] = useState<purchaseOrderStatus>("ALL");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [loadingArchive, setLoadingArchive] = useState(false);
  const [loading, setLoading] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [invoiceRef, setInvoiceRef] = useState("");
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderPageItem[] | []>([])
  const [open, setOpen] = useState(false);
  const [openSendMail, setOpenSendMail] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [idPurchaseOrder, setIdPurchaseOrder] = useState("")
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [loadingInvoice, setLodingInvoice] = useState(false);
  const [nextStatus, setNextStatus] = useState("")
  const [isUploadInvoiceOpen, setIsUploadInvoiceOpen] = useState(false);
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState<PurchaseOrderPageItem | null>(null)
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
  }, [filtre, debouncedSearchQuery]);

  useEffect(() => {

    fetchClientsPurchaseOrders();
  }, [debouncedSearchQuery, currentPage, filtre]);

  const updateStatus = async () => {
    try {
      setLoading(true)
      const formData = new FormData();
      formData.append("status", nextStatus);
      console.log(idPurchaseOrder)
      await PurchaseOrderAPI.updatePurchaseOrderStatus(idPurchaseOrder, formData);
      appToast.success('Statut mise à jour avec succès avec succès.')
      setUpdateOpen(false)
      await fetchClientsPurchaseOrders()
    } catch (error) {
      appToast.error("Erreur Fetch du client:", getApiErrorMessage(error));
    }
    finally {
      setLoading(false)
      setIdPurchaseOrder("")
    }
  }

  const archivePurchaseOrder = async()=>{
         try {
            setLoadingArchive(true);
            const formData = new FormData();
            formData.append("status",  "ARCHIVED");
            await PurchaseOrderAPI.updatePurchaseOrderStatus(idPurchaseOrder, formData);
            appToast.success('Bon de commande archivée avec succés.')
            setArchiveOpen(false)
             await fetchClientsPurchaseOrders()
          } catch (error) {
            appToast.error("Erreur de mise à jour: ",getApiErrorMessage(error))
          } finally {
            setLoadingArchive(false);
          }
      }

  const setFile = usePurchaseOrderStore(state => state.setFile);
  const setFileUrl = usePurchaseOrderStore(state => state.setFileUrl);

 const handleUpload = async (file: File) => {
    setLodingInvoice(true);
    try {
      setFile(file);
      const url = URL.createObjectURL(file);
      setFileUrl(url);

      const extractedData = await extractInvoice(file);

      localStorage.setItem('extractedInvoiceData', JSON.stringify(extractedData));

      setIsUploadInvoiceOpen(false); 
      router.push(`/billing/purchaseOrder/clients/create`);
    } catch (error) {
      console.error('Extraction failed:', error);
      setIsUploadInvoiceOpen(false); 
      router.push(`/billing/purchaseOrder/clients/create`);
    } finally {
      setLodingInvoice(false);
    }
};

  async function extractInvoice(file: File) {
    const formData = new FormData();
    formData.append('data', file);

    const res = await fetch('http://localhost:5678/webhook/60171212-e903-450d-9027-25f7c7ef4754', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Extraction request failed with status ${res.status}`);
    }

    return res.json();
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
    setCurrentPage,
    currentPage,
    totalElements,
    totalPages,
    purchaseOrders,
    loading,
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
    loadingInvoice, setLodingInvoice,
    archiveOpen, setArchiveOpen,
    loadingArchive, setLoadingArchive,archivePurchaseOrder,
    updateStatus, handleUpload, isUploadInvoiceOpen, setIsUploadInvoiceOpen,
    openSendMail, setOpenSendMail
  }
}

