import CreditNoteList from "@/features/billing/components/clientInvoice/creditNoteList";
import { PropsClient } from "@/features/billing/hooks/useClientsInvoiveList";

export default async  function ListCreditNote ({ params }:PropsClient ) {
   const { invoiceId } = await params

           return <CreditNoteList params={{ invoiceId }}/>;
}