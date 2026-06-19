import CreateInvoiceClient from "@/features/billing/components/clientInvoice/createInvoiceClient";
import { PropsClient } from "@/features/billing/hooks/useClientsInvoiveList";

export default async function Page({ params }: PropsClient) {
    const { invoiceId } = await params

  return <CreateInvoiceClient mode="clone" invoiceId={invoiceId} />
}