import ClientInvoiceDetails from "@/features/billing/components/clientInvoice/clientInvoiceDetails";
import { PropsSupplier } from "@/features/billing/hooks/useSupplierInvoiceList";


export default async function invoiceDetail({ params }: PropsSupplier) {
    const { invoiceId } = await params
    return <ClientInvoiceDetails invoiceId={invoiceId}/>;
    
}