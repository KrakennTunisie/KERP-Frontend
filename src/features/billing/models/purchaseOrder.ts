import { z } from "zod";
import { currencyTypeSchema } from "../types/currency";
import { exchangeRateSourceSchema } from "../types/exchangeRateSource";
import { paymentMethodSchema } from "../types/paymentMethod";
import { fileSchema } from "../types/pdfSchema";
import { purchaseOrderStatusWithoutAllSchema } from "../types/purchaseOrderStatus";
import { purchaseOrderTypeSchema } from "../types/PurchaseOrderType";
import { documentSchema } from "./document";
import { purchaseOrderItemSchema } from "./invoiceItem";
import { partnerSchema, partnerSummarySchema } from "./partner";


// champs de base partagés
const purchaseOrderBaseFields = {
    purchaseOrderNumber: z.string(),
    issueDate: z.date(),
    purchaseOrderStatus: purchaseOrderStatusWithoutAllSchema,
    purchaseOrderType: purchaseOrderTypeSchema,
    currency: currencyTypeSchema,
    vatAmount: z.number(),
    paymentMethod: paymentMethodSchema,
    paymentCondition: z.string(),
    exchangeRateReferenceDate: z.date(),
    appliedExchangeRate: z.number(),
    exchangeRateSource: exchangeRateSourceSchema,
};

export const basePurchaseOrderSchema = z.object({
    idPurchaseOrder: z.string(),
    ...purchaseOrderBaseFields,
    totalExclTax: z.number(),
    totalInclTax: z.number(),
    partner: z.lazy(() => partnerSummarySchema).nullable(),
    purchaseOrderDocument: fileSchema.nullable().optional(),
    purchaseOrderItems: z.array(purchaseOrderItemSchema).nullable()
        .refine((items) => {
            if (!items) return true;
            const keys = items.map(item =>
                `${item.description?.trim()}-${item.operationCategory}-${item.vatRate}`);
            return new Set(keys).size === keys.length;
        }, { message: "Les lignes du bon commande doivent être uniques" }),
}).superRefine((data, ctx) => {
      const isPurchase = data.purchaseOrderType === purchaseOrderTypeSchema.enum.PURCHASE;
      if (!data.partner) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["partner"],
          message: isPurchase ? "Le fournisseur est obligatoire" : "Le client est obligatoire",
        });
      }
    });

export const purchaseOrderCreateDTO = z.object({
    ...purchaseOrderBaseFields,
    partner: z.lazy(() => partnerSummarySchema).nullable(),
    purchaseOrderItems: z.array(purchaseOrderItemSchema).nullable(),
    purchaseOrderDocument: fileSchema.nullable(),
}).superRefine((data, ctx) => {
      const isPurchase = data.purchaseOrderType === purchaseOrderTypeSchema.enum.PURCHASE;
      if (!data.partner) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["partner"],
          message: isPurchase ? "Le fournisseur est obligatoire" : "Le client est obligatoire",
        });
      }
    });

export const purchaseOrderUpdateDTO = z.object({
    idPurchaseOrder: z.string(),
    ...purchaseOrderBaseFields,
    partner: z.string(),
    purchaseOrderItems: z.array(purchaseOrderItemSchema),
    purchaseOrderDocument: fileSchema.nullable(),
});

export const purchaseOrderSummaryDTO = z.object({
    idPurchaseOrder: z.string(),
    purchaseOrderNumber: z.string(),
    issueDate: z.date(),
    purchaseOrderStatus: purchaseOrderStatusWithoutAllSchema,
    currency: currencyTypeSchema,
})

export const purchaseOrderPageItemSchema = z.object({
    idPurchaseOrder: z.string(),
    purchaseOrderNumber: z.string(),
    issueDate: z.date(),
    purchaseOrderStatus: purchaseOrderStatusWithoutAllSchema,
    purchaseCurrency: currencyTypeSchema,
    totalExclTaxEUR: z.number(),
    totalInclTaxEUR: z.number(),
    totalExclTaxTND: z.number(),
    totalInclTaxTND: z.number(),
    totalExclTaxUSD: z.number(),
    totalInclTaxUSD: z.number(),
    partner: partnerSummarySchema,
});
export const purchaseOrderPartnerSummarySchema = z.object({
    idPurchaseOrder: z.string(),
    purchaseOrderNumber: z.string(),
    issueDate: z.date(),
    purchaseOrderStatus: purchaseOrderStatusWithoutAllSchema,
    purchaseCurrency: currencyTypeSchema,
    purchaseOrderType: z.string(),
    totalExclTaxEUR: z.number(),
    totalInclTaxEUR: z.number(),
    totalExclTaxTND: z.number(),
    totalInclTaxTND: z.number(),
    totalExclTaxUSD: z.number(),
    totalInclTaxUSD: z.number(),
    partner: partnerSummarySchema,
    purchaseOrderDocument: documentSchema.nullable(),
});

export const purchaseOrderDetailsSchema = z.object({
    idPurchaseOrder: z.string(),
    purchaseOrderNumber: z.string(),
    issueDate: z.date(),
    purchaseOrderStatus: purchaseOrderStatusWithoutAllSchema,
    purchaseOrderType :purchaseOrderTypeSchema,
    purchaseCurrency: currencyTypeSchema,
    vatRate: z.number(),
    totalExclTaxEUR: z.number(),
    totalInclTaxEUR: z.number(),
    totalExclTaxTND: z.number(),
    totalInclTaxTND: z.number(),
    totalExclTaxUSD: z.number(),
    totalInclTaxUSD: z.number(),
    paymentMethod: paymentMethodSchema,
    paymentCondition: z.string(),
    exchangeRateReferenceDate: z.date(),
    appliedExchangeRate: z.number(),
    exchangeRateSource: exchangeRateSourceSchema,
    partner: z.lazy(() => partnerSchema).nullable(),
    purchaseOrderDocument: documentSchema.nullable(),
    purchaseOrderItems: z.array(purchaseOrderItemSchema).nullable(),
});


export const SupplierExpenseStatsSchema = z.object({
  id: z.string(),
  supplier: z.string(),
  category: z.string(),
  amountEUR: z.number(),
  amountTND: z.number(),
  month: z.number().int().min(1).max(12),
});


export const CategoryAmountSchema = z.object({
  category: z.string(),
  montant: z.number(),
});

export type CategoryAmount = z.infer<typeof CategoryAmountSchema>;

export type SupplierExpenseStats = z.infer<typeof SupplierExpenseStatsSchema>;

// types
export type PurchaseOrder = z.infer<typeof basePurchaseOrderSchema>;
export type PurchaseOrderCreate = z.infer<typeof purchaseOrderCreateDTO>;
export type PurchaseOrderUpdate = z.infer<typeof purchaseOrderUpdateDTO>;
export type PurchaseOrderPageItem = z.infer<typeof purchaseOrderPageItemSchema>;
export type PurchaseOrderDetails = z.infer<typeof purchaseOrderDetailsSchema>;
export type PurchaseOrderSummary = z.infer<typeof purchaseOrderSummaryDTO>;
export type PurchaseOrderPartnerSummary = z.infer<typeof purchaseOrderPartnerSummarySchema>;