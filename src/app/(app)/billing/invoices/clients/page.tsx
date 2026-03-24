import lazyComponent from "@/shared/utils/lazyComponent";

const ClientsInvoiceList = lazyComponent(
    () => import("./invoicesList"),
    "chargement des factures  clients ..."
);
export default function Page(){
    return <ClientsInvoiceList/>
}