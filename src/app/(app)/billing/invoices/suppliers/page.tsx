import lazyComponent from "@/shared/utils/lazyComponent";

const SuppliersInvoiceList = lazyComponent(
    () => import("./suppliersList"),
    "chargement des factures  des fournisseurs ..."
);
export default function Page(){
    return <SuppliersInvoiceList/>
}