import { z } from "zod";
import { invoiceStatusSchema } from "./invoiceStatus";

export const UpdateInvoiceCreditNoteStatusRequestSchema = z.object({
    value: invoiceStatusSchema
});

export type UpdateInvoiceCreditNoteStatusRequest = z.infer<typeof UpdateInvoiceCreditNoteStatusRequestSchema>;