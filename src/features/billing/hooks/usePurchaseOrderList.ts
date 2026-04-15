import { useRouter } from "next/navigation"
import { useState } from "react";
import { purchaseOrderStatus } from "../types/purchaseOrderStatus";
export type PropsClient = {
  params: {
    invoiceId: string
  }
}
export function usePurchaseOrderList () {
    const [search, setSearch] = useState("");
    const [filtre, setFiltre] = useState<purchaseOrderStatus>();
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [invoiceRef ,setInvoiceRef] = useState("");
     const [open, setOpen] = useState(false);
   
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
     open,
     setOpen
    }
}