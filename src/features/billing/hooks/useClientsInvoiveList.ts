import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { appToast } from "@/shared/lib/toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { InvoicesAPI } from "../api/partners-api";
import { InvoicePageItem } from "../models/invoice";
import { InvoiceStatus, invoiceStatusSchema } from "../types/invoiceStatus";
export type PropsClient = {
  params: {
    invoiceId: string
  }
}
export function useClientInvoiceList () {
    const [search, setSearch] = useState("");
    const [filtre, setFiltre] = useState<InvoiceStatus>();
    const [loading, setLoading]= useState(false)
    const [deleteLoading, setDeleteLoading]= useState(false)
    const [updateLoading, setUpdateLoading]= useState(false)
    const [invoiceId, setInvoiceId]= useState("")
    const [open, setOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [updateOpen, setUpdateOpen] = useState(false);
    const [invoiceRef ,setInvoiceRef] = useState("");
    const [clientsInvoices, setClientsInvoices] = useState<InvoicePageItem[] | []>([])
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedInvoice, setSelectedInvoice]= useState<InvoicePageItem|null>(null)
    const [nextStatus, setNextStatus]=useState("")
    const router = useRouter()
    const debouncedSearchQuery = useDebounce(search, 2000);
    
    const deleteClientInvoice = async ()=>{
        try {
          setDeleteLoading(true);
          await InvoicesAPI.deleteClientInvoice(invoiceId);
          appToast.success('Facture supprimée avec succès.')
          setInvoiceId("")
          setDeleteOpen(false)
          await fetchClientsInvoices()
        } catch (error) {
          appToast.error("Erreur de suppresion: ",getApiErrorMessage(error))
        } finally {
          setDeleteLoading(false);
        }
    }

    const fetchClientsInvoices = async () => {
        try {
          setLoading(true);
          const keyword =
            debouncedSearchQuery.trim().length >= 3
              ? debouncedSearchQuery.trim()
              : undefined;

          const response = await InvoicesAPI.getClientsInvoices({
            keyword: keyword,
            filter: filtre?.toString() === invoiceStatusSchema.enum.ALL ? "" : filtre?.toString(),
            page: currentPage - 1,
          });

          setClientsInvoices(response.content);
          setTotalPages(response.totalPages);
          setTotalElements(response.totalElements);
        } catch (error) {
          appToast.error("Erreur de fetch clients: ",getApiErrorMessage(error))
        } finally {
          setLoading(false);
        }
      };


    useEffect(() => {
      setCurrentPage(1);
    }, [debouncedSearchQuery]);

    useEffect(() => {
      
      fetchClientsInvoices();
    }, [debouncedSearchQuery, currentPage, filtre]);

    const updateStatus = async ()=>{
          try {
          setLoading(true)
          const formData = new FormData();
            
          formData.append("status",  nextStatus);
          await InvoicesAPI.updateClientInvoiceStatus(invoiceId, formData);
          appToast.success('Statut mise à jour avec succès avec succès.')
          setUpdateOpen(false)
          await fetchClientsInvoices()
        } catch (error) {
          appToast.error("Erreur Fetch du client:",getApiErrorMessage(error));
        }
        finally{
          setLoading(false)
          setInvoiceId("")
        }
    }

    return {
     router,
     search,
     setSearch,
     open,
     setOpen,
     deleteOpen,
     setDeleteOpen,
     updateOpen,
     setUpdateOpen,
     setInvoiceRef,
     invoiceRef,
     filtre,
     setFiltre,
     clientsInvoices,
     currentPage,
     setCurrentPage,
     totalElements,
     totalPages,
     deleteClientInvoice,
     invoiceId,
     setInvoiceId,
     deleteLoading,
     updateStatus,
     updateLoading,
     loading,
     nextStatus, setNextStatus,
     selectedInvoice, setSelectedInvoice
    }
}