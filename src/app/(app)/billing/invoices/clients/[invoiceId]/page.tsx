import CreateInvoiceClient from "@/features/billing/components/clientInvoice/createInvoiceClient";
import { Props } from "@/features/billing/hooks/useClientsInvoiveList";

export default async function Page({ params }: Props) {
    const { invoiceId } = await params

  return <CreateInvoiceClient mode="edit" invoiceId={invoiceId} />
}