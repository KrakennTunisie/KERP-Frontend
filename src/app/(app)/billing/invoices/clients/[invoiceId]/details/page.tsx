import ClientInvoiceDetails from "@/features/billing/components/clientInvoice/clientInvoiceDetails";
import { PropsClient } from "@/features/billing/hooks/useClientsInvoiveList";

export default async function invoiceDetail({ params }: PropsClient) {
    const { invoiceId } = await params
    return <ClientInvoiceDetails invoiceId={invoiceId}/>;
    
}