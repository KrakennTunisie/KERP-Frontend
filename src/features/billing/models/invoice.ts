import { z } from "zod";
import { partnerSchema } from "./partner";
import { documentSchema } from "./document";
import { invoiceTypeSchema } from "../types/invoiceType";
import { invoiceStatusSchema } from "../types/invoiceStatus";
import { invoiceComplianceStatusSchema } from "../types/invoiceComplianceStatus";
import { paymentMethodSchema } from "../types/paymentMethod";
import { exchangeRateSourceSchema } from "../types/exchangeRateSource";
import { purchaseOrderSchema } from "./purchaseOrder";
import { invoiceItemSchema } from "./invoiceItem";
import { tvaRateSchema } from "../types/tvaRate";
import { currencyTypeSchema } from "../types/currency";
import { PaymentConditionSchema } from "../types/paymentCondition";
import { fileSchema } from "../types/pdfSchema";


export const invoiceSchema = z.object({
    idInvoice : z.string(),
    invoiceNumber: z.string(),
    issueDate:  z.date(),
    dueDate:  z.date(),
    sentToTTNDate:  z.date().nullable(),
    sentToclientDate:  z.date().nullable(),
    creationDate: z.date().nullable(),
    invoiceType: invoiceTypeSchema,
    invoiceStatus: invoiceStatusSchema,
    invoiceComplianceStatus: invoiceComplianceStatusSchema.nullable(),
    currency: currencyTypeSchema,
    totalExclTax: z.number(),
    totalInclTax: z.number(),
    vatAmount: z.number(),
    paymentMethod: paymentMethodSchema,
    exchangeRateReferenceDate: z.date(),
    appliedExchangeRate: z.number(),
    exchangeRateSource : exchangeRateSourceSchema,
    complianceQRcode : z.string(),
    PaymentCondition: PaymentConditionSchema,
    purchaseOrder: z.lazy(() => purchaseOrderSchema).nullable(), // Null pour le momemnt , pour faciliter le test
    partner : z.lazy(()=>partnerSchema).nullable(),
    invoiceItems : z.array(invoiceItemSchema).nullable()
   .refine((items) => {
    if (!items) return true;
    const keys = items.map((item) =>
        `${item.description?.trim()}-${item.operationCategory}-${item.vatRate}`);
    return new Set(keys).size === keys.length;}, {
    message: "Les lignes de facture doivent être uniques",
    }),
    invoiceDocument : fileSchema.nullable(),    

}).superRefine((data, ctx) => {
  const { issueDate, dueDate, PaymentCondition } = data;

  if (!issueDate || !dueDate || !PaymentCondition) return;

  let minDueDate = new Date(issueDate);

  switch (PaymentCondition) {
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

export type Invoice = z.infer<typeof invoiceSchema>;