import { z } from "zod";
import { paymentMethodSchema } from "../types/paymentMethod";
import { currencyTypeSchema } from "../types/currency";
import { invoiceDetailedSummarySchema, invoicePageItemSchema, invoiceSummarySchema } from "./invoice";
import { fileSchema } from "../types/pdfSchema";
import { documentSchema } from "./document";
import { paymentStatusTypeSchema } from "../types/paymentStatus";


export const paymentSchema = z.object({
  idPayment: z.string().min(1, "L'identifiant est obligatoire"),

  reference: z
    .string()
    .min(1, "Le numéro de paiement est obligatoire"),

  currency: currencyTypeSchema,

  date: z
    .string()
    .min(1, "La date du paiement est obligatoire"),

  amount: z
    .number({
      error: "Le montant est obligatoire",
    })
    .positive("Le montant doit être supérieur à 0"),

  method: paymentMethodSchema,

  paymentStatus: paymentStatusTypeSchema,

  invoiceNumber: z
    .string()
    .min(1, "Le numéro de facture est obligatoire"),

  paymentDocument: fileSchema.nullable(),

  paymentNumber: z.string().nullable(),

  invoice: invoicePageItemSchema.nullable(),

  comment: z.string(),

});


export const paymentListItemSchema = z.object({
  idPayment: z.string().min(1, "L'identifiant est obligatoire"),

  reference: z
    .string()
    .min(1, "Le numéro de paiement est obligatoire"),

  currency: currencyTypeSchema,

  paymentDate: z
    .date()
    .min(1, "La date du paiement est obligatoire"),

  amount: z
    .number({
      error: "Le montant est obligatoire",
    })
    .positive("Le montant doit être supérieur à 0"),

  method: paymentMethodSchema,

  paymentStatus: paymentStatusTypeSchema,

  invoice: invoiceDetailedSummarySchema,

  paymentDocument: documentSchema.nullable(),

  comment: z.string(),


  createdAt: z.date(),
});

export const paymentDetailsSchema = z.object({
  idPayment: z.string().min(1, "L'identifiant est obligatoire"),

  reference: z
    .string()
    .min(1, "Le numéro de paiement est obligatoire"),

  currency: currencyTypeSchema,

  paymentDate: z
    .date(),

  amount: z
    .number({
      error: "Le montant est obligatoire",
    })
    .positive("Le montant doit être supérieur à 0"),

  method: paymentMethodSchema,

  paymentStatus: paymentStatusTypeSchema,

  invoice: invoiceDetailedSummarySchema,

  paymentDocument: documentSchema.nullable(),

  comment: z.string(),


  createdAt: z.date(),
});


export const createPaymentSchema = paymentSchema.omit({
  idPayment: true,
});

export const updatePaymentSchema = paymentSchema.partial().extend({
  idPayment: z.string().min(1, "L'identifiant est obligatoire"),
});

export type Payment = z.infer<typeof paymentSchema>;
export type PaymentDetails = z.infer<typeof paymentDetailsSchema>;
export type PaymentListItem = z.infer<typeof paymentListItemSchema>;
export type CreatePaymentFormValues = z.infer<typeof createPaymentSchema>;
export type CreatePaymentFormInput = z.input<typeof createPaymentSchema>;

export type UpdatePaymentFormValues = z.infer<typeof updatePaymentSchema>;