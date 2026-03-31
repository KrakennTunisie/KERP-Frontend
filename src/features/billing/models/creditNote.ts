import { z } from "zod";
import { invoiceItemSchema } from "./invoiceItem";
import { invoiceSchema } from "./invoice";
import { CreditNoteTypeSchema } from "../types/creditNoteType";
export const CreditNoteSchema = invoiceSchema.merge(
  z.object({
    creditNoteReason: CreditNoteTypeSchema,
    refOriginalInvoice : z.uuid(),
  })
);
export type CreditNote = z.infer<typeof CreditNoteSchema>;