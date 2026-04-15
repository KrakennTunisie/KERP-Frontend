import { useState } from "react";
import { InvoiceStatus } from "../types/invoiceStatus";
import { useRouter } from "next/navigation";
import { PropsClient } from "./useClientsInvoiveList";


export default  function useCreditNoteList({params}:PropsClient){
const [search, setSearch] = useState("");
    const [filtre, setFiltre] = useState<InvoiceStatus>();
    const [open, setOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [invoiceRef ,setInvoiceRef] = useState(params.invoiceId);
    const [creditNoteRef ,setCreditNoteRef] = useState<string>();
    
    function deleteCreditNote(idCreditNote:string)
    {
      setDeleteOpen(true);
      setCreditNoteRef(idCreditNote);
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
     deleteCreditNote,
    }
}