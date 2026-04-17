import {  z } from "zod";
import { partnerSchema, partnerSummarySchema } from "./partner";
import { purchaseOrderSchema } from "./purchaseOrder";
import { invoiceItemSchema } from "./invoiceItem";
import { invoiceTypeSchema } from "../types/invoiceType";
import { invoiceStatusSchema } from "../types/invoiceStatus";
import { invoiceComplianceStatusSchema } from "../types/invoiceComplianceStatus";
import { paymentMethodSchema } from "../types/paymentMethod";
import { exchangeRateSourceSchema } from "../types/exchangeRateSource";
import { tvaRateSchema } from "../types/tvaRate";
import { currencyTypeSchema } from "../types/currency";
import { PaymentConditionSchema } from "../types/paymentCondition";
import { fileSchema } from "../types/pdfSchema";
import { documentSchema } from "./document";
import { InvoiceEvent, InvoiceEventSchema } from "./invoiceEvent";

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
  purchaseOrder: purchaseOrderSchema.nullable(),
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
  invoiceStatus: invoiceStatusSchema,
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
  partner: z.lazy(() => partnerSummarySchema)
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
    purchaseOrder: z.string().nullable()
  })
);

export const invoiceUpdateSchema = withDueDateValidation(
  baseInvoiceSchema.extend({
    idInvoice: z.string()
  })
);


export const invoiceSummarySchema = z.object({
  "idInvoice": z.string(),
  "invoiceNumber": z.string(),
  "issueDate": z.date(),
  "invoiceType": invoiceTypeSchema,
  "invoiceStatus": invoiceStatusSchema,
  "invoiceComplianceStatus":invoiceComplianceStatusSchema,
  "invoiceCurrency": currencyTypeSchema,
  "totalExclTaxEUR": z.number(),
  "totalInclTaxEUR": z.number(),
  "totalExclTaxTND": z.number(),
  "totalInclTaxTND": z.number()
})



export type Invoice = z.infer<typeof invoiceSchema>;
export type InvoicePageItem = z.infer<typeof invoicePageItemSchema>;
export type InvoiceCreate = z.infer<typeof invoiceCreateSchema>;
export type InvoiceUpdate = z.infer<typeof invoiceCreateSchema>;