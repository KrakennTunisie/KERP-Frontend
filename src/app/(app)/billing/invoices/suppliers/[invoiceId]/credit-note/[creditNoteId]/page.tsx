import CreditNoteDetails from "@/features/billing/components/clientInvoice/creditNoteDetails";
import { PropsCreditNote } from "@/features/billing/hooks/useCreditNoteDetails";

export default async  function creditNoteDetails({ params }: PropsCreditNote) {
     const { creditNoteId } = await params
        return <CreditNoteDetails params={{ creditNoteId }}/>;
}