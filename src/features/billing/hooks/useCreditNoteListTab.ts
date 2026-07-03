"use client";

import { useEffect, useState } from "react";
import { InvoiceCreditNotePageItem } from "../models/creditNote";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { InvoiceStatus, invoiceStatusSchema } from "../types/invoiceStatus";
import { InvoicesCreditNoteAPI } from "../api/partners-api";
import { appToast } from "@/shared/lib/toast";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { useRouter } from "next/navigation";

type UsePaymentTabListParams = {
  invoiceId: string;
  type: "CLIENT" | "SUPPLIER";
};


export function useCreditNoteListTab({
  invoiceId,
  type,
}: UsePaymentTabListParams) {


    const [search, setSearch] = useState("");
    const [filtre, setFiltre] = useState<InvoiceStatus>("ALL");
    const [open, setOpen] = useState(false);
    const [loading, setLoading]= useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [updateStatusOpen, setUpdateStatusOpen] = useState(false);
    const [updateLoading, setUpdateLoading]= useState(false)
    const [nextStatus, setNextStatus]=useState("")

    const [invoiceRef ,setInvoiceRef] = useState(invoiceId);
    const [creditNoteRef ,setCreditNoteRef] = useState<string>();
    const [creditNotes, setCreditNotes]=useState<InvoiceCreditNotePageItem[]| []>([])
    const [deleteId, setDeleteId]= useState("")
    const [deleteLoading, setDeleteLoading]= useState(false)
    const [idInvoice,setIdInvoice]=useState("")
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCreditNote, setSelectedCreditNote]=useState<InvoiceCreditNotePageItem>();
    const [updateCreditNoteStatusOpen, setUpdateCreditNoteStatusOpen] = useState(false);

    const debouncedSearchQuery = useDebounce(search, 2000);


    const fetchCreditNotes = async () => {
        try {
        setLoading(true);
        const keyword =
            debouncedSearchQuery.trim().length >= 3
            ? debouncedSearchQuery.trim()
            : undefined;
        const response = await InvoicesCreditNoteAPI.getInvoiceCreditNotes(invoiceRef,{
        keyword: keyword,
        filter: filtre==invoiceStatusSchema.enum.ALL ? "": filtre?.toString(),
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
     }, [filtre, debouncedSearchQuery]);
     
     useEffect(() => {
       
       fetchCreditNotes();
     }, [invoiceRef, debouncedSearchQuery, currentPage, filtre]);




  const onDelete = async () => {
    try {
        setDeleteLoading(true);
        await InvoicesCreditNoteAPI.deleteInvoiceCreditNote(deleteId);
        appToast.success('Facture supprimée avec succès.')
        setDeleteId("")
        setDeleteOpen(false)
        await fetchCreditNotes()
     } catch (error) {
        appToast.error("Erreur de suppresion: ",getApiErrorMessage(error))
    } finally {
        setDeleteLoading(false);
        }
  };

    const updateStatus = async ()=>{
          try {
          setLoading(true)
          const formData = new FormData();
            
          formData.append("status",  nextStatus);
          if(selectedCreditNote){

            await InvoicesCreditNoteAPI.updateInvoiceCreditNoteStatus(selectedCreditNote?.invoiceCreditNoteNumber, formData);
            appToast.success('Statut mise à jour avec succès.')
            setUpdateStatusOpen(false)
            await fetchCreditNotes()
          }
        } catch (error) {
          appToast.error("Erreur Fetch du client:",getApiErrorMessage(error));
        }
        finally{
          setLoading(false)
        }
    }

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
     onDelete,
     creditNotes,
     currentPage,
     setCurrentPage,
     totalElements,
     totalPages,
     idInvoice,
     setIdInvoice,
     loading,
     deleteLoading,
     deleteId,
     setDeleteId,
     nextStatus, setNextStatus,
     updateLoading, setUpdateLoading,
     updateStatusOpen, setUpdateStatusOpen,
     selectedCreditNote, setSelectedCreditNote,
     updateStatus,

    refresh: () => fetchCreditNotes(),
  };
}