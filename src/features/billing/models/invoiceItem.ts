import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { discountTypeSchema } from "../types/discountType";
import { operationCategorySchema } from "../types/operationCategory";

// ---- schema de remise, partagé uniquement par les items qui en ont besoin ----
export const discountableSchema = z.object({
    discountType: discountTypeSchema.nullable(),
    discountValue: z.number().nullable(),
});

// ---- schema de base commun (sans remise) ----
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

// ---- invoice item : base + remise + champs spécifiques facture ----
export const invoiceItemSchema = baseItemSchema
    .extend(discountableSchema.shape)
    .extend({
        idInvoiceItem: z.uuid(),
        invoice: z.string().nullable(),
        purchaseOrderItem: z.lazy(() => purchaseOrderItemSchema).nullable(),
        creditedQuantity: z.number(),
    });

// ---- credit note item : base SANS remise + champs spécifiques avoir ----
export const creditNoteItemSchema = baseItemSchema
    .extend({
        idCreditNoteItem: z.uuid(),
        originalItem: z.string().nullable(),
    })
    .strict();

export const baseInvoiceCreditNoteItemSchema = z.object({
    idInvoiceCreditNoteItem: z.string(),
    invoiceItem: invoiceItemSchema,
    quantity: z.number(),
});

// ---- purchase order item : base + remise + champs spécifiques commande ----
export const purchaseOrderItemSchema = baseItemSchema
    .extend(discountableSchema.shape)
    .extend({
        idPurchaseOrderItem: z.uuid(),
        purchaseOrder: z.string().nullable(),
        invoicedQuantity: z.number(),
    })
    .strict();

// ---- type partagé pour les composants réutilisables (ex: listes génériques) ----
export const baseItemSchemaType = baseItemSchema.extend({
    id: z.uuid(),
});

// ---- types dérivés ----
export type Discountable = z.infer<typeof discountableSchema>;
export type BaseItem = z.infer<typeof baseItemSchema>;
export type InvoiceItem = z.infer<typeof invoiceItemSchema>;
export type CreditNoteItem = z.infer<typeof creditNoteItemSchema>;
export type PurchaseOrderItem = z.infer<typeof purchaseOrderItemSchema>;
export type BaseItemType = z.infer<typeof baseItemSchemaType>;
export type baseInvoiceCreditNote = z.infer<typeof baseInvoiceCreditNoteItemSchema>;

// ---- type utilitaire pour les fonctions génériques de calcul (ex: getDiscountValue) ----
// accepte tout item du socle commun, avec remise optionnelle si présente
export type DiscountableBaseItem = BaseItem & Partial<Discountable>;

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

// models/creditNoteItem.ts
export const defaultCreditNoteItem = (): CreditNoteItem => ({
    idCreditNoteItem: uuidv4(),
    description: "",
    quantity: 1,
    unityPriceEXclTax: 0,
    vatRate: 0,
    itemTotalExclTax: 0,
    itemTaxAmount: 0,
    itemTotalInclTax: 0,
    operationCategory: operationCategorySchema.enum.DEPRECIABLE_EQUIPMENT,
    originalItem: null,
});