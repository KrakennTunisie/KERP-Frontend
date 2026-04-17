import { useEffect, useState } from "react";
import { InvoiceStatus } from "../types/invoiceStatus";
import { useRouter } from "next/navigation";
import { PropsClient } from "./useClientsInvoiveList";
import { InvoiceCreditNotePageItem } from "../models/creditNote";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { InvoicesCreditNoteAPI } from "../api/partners-api";
import { appToast } from "@/shared/lib/toast";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";


export default  function useCreditNoteList({params}:PropsClient){
const [search, setSearch] = useState("");
    const [filtre, setFiltre] = useState<InvoiceStatus>();
    const [open, setOpen] = useState(false);
    const [loading, setLoading]= useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [invoiceRef ,setInvoiceRef] = useState(params.invoiceId);
    const [creditNoteRef ,setCreditNoteRef] = useState<string>();
    const [creditNotes, setCreditNotes]=useState<InvoiceCreditNotePageItem[]| []>([])
    const [deleteId, setDeleteId]= useState("")
    const [deleteLoading, setDeleteLoading]= useState(false)
    const [idInvoice,setIdInvoice]=useState("")
        const [totalPages, setTotalPages] = useState(1);
        const [totalElements, setTotalElements] = useState(0);
        const [currentPage, setCurrentPage] = useState(1);
    function deleteCreditNote(idCreditNote:string)
    {
      setDeleteOpen(true);
      setCreditNoteRef(idCreditNote);
    }

        const debouncedSearchQuery = useDebounce(search, 2000);
        
        const deleteClientInvoice = async ()=>{
            try {
              setDeleteLoading(true);
              await InvoicesCreditNoteAPI.deleteInvoiceCreditNote(deleteId);
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
    
              const response = await InvoicesCreditNoteAPI.getInvoiceCreditNotes(invoiceRef,{
            keyword: keyword,
            filter: filtre?.toString(),
            page: currentPage - 1,
          });
    
              setCreditNotes(response.content);
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
    }, [invoiceRef, debouncedSearchQuery, currentPage, filtre]);
    
     const router = useRouter()
    return {
     router,
     search,
     setSearch,
     open,
     setOpen,
     deleteOpen,
     setDeleteOpen,
     invoiceRef,
     setInvoiceRef,
     filtre,
     setFiltre,
     creditNoteRef,
     deleteCreditNote,
     creditNotes,
     totalElements,
     totalPages,
     idInvoice,
     setIdInvoice,
     loading,
     deleteLoading,
     deleteId,
     setDeleteId,
     deleteClientInvoice
    }
}