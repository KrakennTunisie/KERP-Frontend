import {  z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { discountTypeSchema } from "../types/discountType";
import { operationCategorySchema } from "../types/operationCategory";


// schema de base commun
export const baseItemSchema = z.object({
    description: z.string().min(1, "La description est obligatoire"),
    quantity: z.number().min(1, "La quantité est obligatoire"),
    unityPriceEXclTax: z.number().positive("Le prix unitaire est obligatoire"),
    vatRate: z.number().nullable(),
    itemTotalExclTax: z.number(),
    itemTaxAmount: z.number(),
    itemTotalInclTax: z.number(),
    operationCategory: z.string().nullable().optional(),
    
});


// invoice item
export const invoiceItemSchema = baseItemSchema.extend({
    idInvoiceItem: z.uuid(),
    invoice: z.string().nullable(),
    purchaseOrderItem :z.lazy(() => purchaseOrderItemSchema).nullable(),
    creditedQuantity: z.number(),
    
    discountType: discountTypeSchema.nullable(),
    discountValue: z.number().nullable(),
});
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
    invoicedQuantity : z.number(),
    discountType:  discountTypeSchema.nullable(),
    discountValue:  z.number().nullable(),
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
    idInvoiceItem: uuidv4(),
    purchaseOrderItem: null,
    description: "",
    quantity: 1,
    unityPriceEXclTax: 0,
    vatRate: 0,
    itemTotalExclTax: 0,
    itemTaxAmount: 0,
    itemTotalInclTax: 0,
    operationCategory: operationCategorySchema.enum.OTHER,
    invoice: null,
    creditedQuantity: 0,
    discountType: discountTypeSchema.enum.PERCENTAGE,
    discountValue: 0,
});

// models/purchaseOrderItem.ts
export const defaultPurchaseOrderItem = (): PurchaseOrderItem => ({
    idPurchaseOrderItem: uuidv4(),
    description: "",
    quantity: 1,
    invoicedQuantity: 0,
    unityPriceEXclTax: 0,
    vatRate: 0,
    itemTotalExclTax: 0,
    itemTaxAmount: 0,
    itemTotalInclTax: 0,
    operationCategory: operationCategorySchema.enum.BANK,
    purchaseOrder: null,
    discountType: discountTypeSchema.enum.PERCENTAGE,
    discountValue: 0,
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
    operationCategory:  operationCategorySchema.enum.DEPRECIABLE_EQUIPMENT,
    originalItem: null,
});





