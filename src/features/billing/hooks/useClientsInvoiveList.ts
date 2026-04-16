import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import { InvoiceStatus } from "../types/invoiceStatus";
import { InvoicePageItem } from "../models/invoice";
import { InvoicesAPI } from "../api/partners-api";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { appToast } from "@/shared/lib/toast";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
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
    const [deleteId, setDeleteId]= useState("")
    const [open, setOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [invoiceRef ,setInvoiceRef] = useState("");
    const [clientsInvoices, setClientsInvoices] = useState<InvoicePageItem[] | []>([])
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    
    const router = useRouter()
    const debouncedSearchQuery = useDebounce(search, 2000);
    
    const deleteClientInvoice = async ()=>{
        try {
          setDeleteLoading(true);
          await InvoicesAPI.deleteClientInvoice(deleteId);
          appToast.success('Facture supprimée avec succès.')
          setDeleteId("")
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
            filter: filtre?.toString(),
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

    return {
     router,
     search,
     setSearch,
     open,
     setOpen,
     deleteOpen,
     setDeleteOpen,
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
     deleteId,
     setDeleteId,
     deleteLoading,
     loading
    }
}