import { z } from "zod";
import { currencyTypeSchema } from "../types/currency";
import { exchangeRateSourceSchema } from "../types/exchangeRateSource";
import { invoiceComplianceStatusSchema } from "../types/invoiceComplianceStatus";
import { invoiceStatusSchema, invoiceStatusSchemaWithoutAll } from "../types/invoiceStatus";
import { invoiceTypeSchema } from "../types/invoiceType";
import { PaymentConditionSchema } from "../types/paymentCondition";
import { paymentMethodSchema } from "../types/paymentMethod";
import { fileSchema } from "../types/pdfSchema";
import { documentSchema } from "./document";
import { InvoiceEventSchema } from "./invoiceEvent";
import { invoiceItemSchema } from "./invoiceItem";
import { partnerSchema, partnerSummarySchema } from "./partner";
import { basePurchaseOrderSchema, purchaseOrderSummaryDTO } from "./purchaseOrder";

const baseInvoiceSchema = z.object({
  invoiceNumber: z.string(),
  issueDate: z.date(),
  dueDate: z.date(),
  invoiceType: invoiceTypeSchema,
  invoiceCurrency: currencyTypeSchema,
  vatRate: z.number(),
  paymentMethod: paymentMethodSchema,
  paymentCondition: PaymentConditionSchema,
  exchangeRateReferenceDate: z.date(),
  appliedExchangeRate: z.number(),
  exchangeRateSource: exchangeRateSourceSchema,
  totalExclTax: z.number().optional(),
  totalInclTax: z.number().optional(),
  purchaseOrder: basePurchaseOrderSchema.nullable(),
  invoiceItems: z
    .array(invoiceItemSchema)
    .nullable()
    .refine((items) => {
      if (!items) return true;
      const keys = items.map(
        (item) =>
          `${item.description?.trim()}-${item.operationCategory}-${item.vatRate}`
      );
      return new Set(keys).size === keys.length;
    }, {
      message: "Les lignes de facture doivent être uniques",
    }),
});

const withDueDateValidation = <T extends z.ZodTypeAny>(schema: T) =>
  schema.superRefine((data: z.infer<T>, ctx) => {
    const { issueDate, dueDate, paymentCondition } = data as {
      issueDate: Date;
      dueDate: Date;
      paymentCondition: "NET_15" | "NET_30" | "IMMEDIATE";
    };

    if (!issueDate || !dueDate || !paymentCondition) return;

    const minDueDate = new Date(issueDate);

    switch (paymentCondition) {
      case "NET_15":
        minDueDate.setDate(minDueDate.getDate() + 15);
        break;
      case "NET_30":
        minDueDate.setDate(minDueDate.getDate() + 30);
        break;
      case "IMMEDIATE":
        break;
    }

    if (dueDate < minDueDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `La date d'échéance doit être ≥ ${minDueDate.toLocaleDateString()}`,
        path: ["dueDate"],
      });
    }
  });

const invoiceObjectSchema = baseInvoiceSchema.extend({
  idInvoice: z.string(),
  sentToTTNDate: z.date().nullable(),
  sentToclientDate: z.date().nullable(),
  creationDate: z.date().nullable(),
  invoiceStatus: invoiceStatusSchemaWithoutAll,
  invoiceComplianceStatus: invoiceComplianceStatusSchema.nullable(),
  complianceQRcode: z.string().nullable(),
  partner: z.lazy(() => partnerSchema).nullable(),
});

export const invoiceSchema = withDueDateValidation(
  invoiceObjectSchema.extend({
   invoiceDocument: documentSchema.nullable(), 
   totalExclTaxEUR: z.number(),
   totalInclTaxEUR: z.number(),
   totalExclTaxTND: z.number(),
   totalInclTaxTND: z.number(),
   totalExclTaxUSD: z.number(),
   totalInclTaxUSD: z.number(),
   remainingAmount: z.number(),
   invoiceEvents: z.array(z.lazy(()=> InvoiceEventSchema)).optional(),
   hasInvoiceCreditNotes: z.boolean().nullable(),
  })
);

export const invoicePageItemSchema = invoiceObjectSchema.pick({
  idInvoice: true,
  invoiceNumber: true,
  issueDate: true,
  dueDate: true,
  invoiceType: true,
  invoiceStatus: true,
  invoiceComplianceStatus: true,
  invoiceCurrency: true,
  vatRate: true,
  appliedExchangeRate: true,
  
}).extend({
  
  totalExclTaxEUR: z.number(),
  totalInclTaxEUR: z.number(),
  totalExclTaxTND: z.number(),
  totalInclTaxTND: z.number(),
  totalExclTaxUSD: z.number(),
  totalInclTaxUSD: z.number(),
  remainingAmount: z.number(),
  invoiceDocument: documentSchema.nullable(), 
  partner: z.lazy(() => partnerSummarySchema)
});

export const invoicePageItemSchema2 = invoiceObjectSchema.pick({
  idInvoice: true,
  invoiceNumber: true,
  issueDate: true,
  dueDate: true,
  invoiceType: true,
  invoiceStatus: true,
  invoiceCurrency: true,
  totalInclTax:true
});

export const invoiceCreateSchema = withDueDateValidation(
  baseInvoiceSchema.pick({
    invoiceNumber: true,
    issueDate: true,
    dueDate: true,
    invoiceType: true,
    invoiceCurrency: true,
    vatRate: true,
    paymentMethod: true,
    paymentCondition: true,
    exchangeRateReferenceDate: true,
    appliedExchangeRate: true,
    exchangeRateSource: true,
    purchaseOrder: true,
    invoiceItems: true,
    totalExclTax: true,
    totalInclTax: true,
  })
  .extend({
    invoiceDocument: fileSchema.nullable(),
    idInvoice: z.string(),
    sentToTTNDate: z.date().nullable(),
    sentToclientDate: z.date().nullable(),
    creationDate: z.date().nullable(),
    invoiceStatus: invoiceStatusSchema,
    complianceQRcode: z.string(),
    vatAmount: z.number().nullable(),
    invoiceComplianceStatus: invoiceComplianceStatusSchema.nullable(),
    partner: z.lazy(() => partnerSummarySchema).nullable(),
    purchaseOrder:z.lazy(() => purchaseOrderSummaryDTO).nullable()
  })
);

export const invoiceUpdateSchema = withDueDateValidation(
  baseInvoiceSchema.extend({
    idInvoice: z.string()
  })
);


export const invoiceSummarySchema = z.object({
  idInvoice: z.string(),
  invoiceNumber: z.string(),
  issueDate: z.date(),
  invoiceType: invoiceTypeSchema,
  invoiceStatus: invoiceStatusSchema,
  invoiceComplianceStatus:invoiceComplianceStatusSchema,
  invoiceCurrency: currencyTypeSchema,
  totalExclTaxEUR: z.number(),
  totalInclTaxEUR: z.number(),
  totalExclTaxTND: z.number(),
  totalInclTaxTND: z.number(),
  totalExclTaxUSD: z.number(),
  totalInclTaxUSD: z.number(),
  remainingAmount: z.number(),
})

export const invoiceDetailedSummarySchema = invoiceSummarySchema.extend({
  partner : partnerSummarySchema
})


export type Invoice = z.infer<typeof invoiceSchema>;
export type InvoicePageItem = z.infer<typeof invoicePageItemSchema>;
export type InvoicePageItemV2 = z.infer<typeof invoicePageItemSchema2>;
export type InvoiceCreate = z.infer<typeof invoiceCreateSchema>;
export type InvoiceUpdate = z.infer<typeof invoiceCreateSchema>;