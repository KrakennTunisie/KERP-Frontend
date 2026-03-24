import { useRouter } from "next/navigation"
import { useState } from "react";
import { InvoiceStatus } from "../types/invoiceStatus";
export type Props = {
  params: {
    invoiceId: string
  }
}
export function useClientInvoiceList () {
    const [search, setSearch] = useState("");
    const [filtre, setFiltre] = useState<InvoiceStatus>();
     const router = useRouter()
    return {
     router,
     search,
     setSearch,
     filtre,
     setFiltre
    }
}