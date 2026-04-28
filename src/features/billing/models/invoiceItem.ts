import {  z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { operationCategorySchema } from "../types/operationCategory";


// schema de base commun
export const baseItemSchema = z.object({
    description: z.string(),
    quantity: z.number(),
    unityPriceEXclTax: z.number(),
    vatRate: z.number(),
    itemTotalExclTax: z.number(),
    itemTaxAmount: z.number(),
    itemTotalInclTax: z.number(),
    operationCategory: operationCategorySchema,
});

// invoice item
export const invoiceItemSchema = baseItemSchema.extend({
    idInvoiceItem: z.uuid(),
    invoice: z.string().nullable(),
}).strict();
// invoice item
export const creditNoteItemSchema = baseItemSchema.extend({
    idCreditNoteItem: z.uuid(),
    originalItem: z.string().nullable(),
}).strict();

export const baseInvoiceCreditNoteItemSchema= z.object({
    idInvoiceCreditNoteItem: z.string(),
    invoiceItem: invoiceItemSchema,
    quantity: z.number()
})
// purchase order item
export const purchaseOrderItemSchema = baseItemSchema.extend({
    idPurchaseOrderItem: z.uuid(),
    purchaseOrder: z.string().nullable(),
}).strict();

// type partagé pour les composants réutilisables
export const baseItemSchemaType = baseItemSchema.extend({
    id: z.uuid(),
});

export type BaseItem = z.infer<typeof baseItemSchema>;
export type InvoiceItem = z.infer<typeof invoiceItemSchema>;
export type CreditNoteItem = z.infer<typeof creditNoteItemSchema>;
export type PurchaseOrderItem = z.infer<typeof purchaseOrderItemSchema>;
export type BaseItemType = z.infer<typeof baseItemSchemaType>;
export type  baseInvoiceCreditNote =z.infer<typeof baseInvoiceCreditNoteItemSchema>

// models/invoiceItem.ts
export const defaultInvoiceItem = (): InvoiceItem => ({
    idInvoiceItem: "0",
    description: "",
    quantity: 1,
    unityPriceEXclTax: 0,
    vatRate: 0,
    itemTotalExclTax: 0,
    itemTaxAmount: 0,
    itemTotalInclTax: 0,
    operationCategory: "SERVICE_PROVISION",
    invoice: null,
});

// models/purchaseOrderItem.ts
export const defaultPurchaseOrderItem = (): PurchaseOrderItem => ({
    idPurchaseOrderItem: uuidv4(),
    description: "",
    quantity: 1,
    unityPriceEXclTax: 0,
    vatRate: 0,
    itemTotalExclTax: 0,
    itemTaxAmount: 0,
    itemTotalInclTax: 0,
    operationCategory: "SERVICE_PROVISION",
    purchaseOrder: null,
});

export const defaultCreditNoteItem = (): CreditNoteItem => ({
    idCreditNoteItem: uuidv4(),
    description: "",
    quantity: 1,
    unityPriceEXclTax: 0,
    vatRate: 0,
    itemTotalExclTax: 0,
    itemTaxAmount: 0,
    itemTotalInclTax: 0,
    operationCategory: "SERVICE_PROVISION",
    originalItem: null,
});





