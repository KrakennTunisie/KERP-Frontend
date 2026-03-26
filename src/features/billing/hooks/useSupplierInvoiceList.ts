import { useRouter } from "next/navigation";
import { useState } from "react";
import { InvoiceStatus } from "../types/invoiceStatus";
import { CategoriesFacturesFournisseur } from "../types/invoiceSupplierCategory";
export type PropsSupplier = {
  params: {
    invoiceId: string
  }
}
export default function useSupplierInvoiceList ()
{
    const [search, setSearch] = useState("");
    const [filtre, setFiltre] = useState<InvoiceStatus>();
    const [categorie, setCategorie] = useState<CategoriesFacturesFournisseur>();
    const router = useRouter();
    return {
        router,
        search,
        setSearch,
        filtre,
        setFiltre,
        categorie,
        setCategorie
    }

}