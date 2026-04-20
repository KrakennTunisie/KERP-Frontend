import { CreateCreditNote } from "@/features/billing/components/clientInvoice/createcreditNote";
import { PropsClient } from "@/features/billing/hooks/useClientsInvoiveList";

export default async function CreditNote({params}:PropsClient) {
        const { invoiceId } = await  params
        console.log('invoiceId: ', invoiceId)
    return (
        <div>
          <CreateCreditNote invoiceId={ invoiceId }/>
        </div>
    );
}