import { z } from "zod";
import { partnerTypeSchema } from "../types/partnerType";
import { fileSchema } from "../types/pdfSchema";

import type { Invoice } from "./invoice";
import { documentSchema } from "./document";
import { PaymentConditionSchema } from "../types/paymentCondition";
import { tvaRateStringSchema } from "../types/tvaRate";
import { currencyTypeSchema } from "../types/currency";
import { addAddressSchema } from "./Address";

export const partnerSchema = z.object({
  idPartner: z.uuid(),
  active: z.boolean(),
  enablePortal: z.boolean,
  maritalStatus: z.string().min(1),
  partnerName: z.string().min(3, "Le nom doit contenir au moins 3 caractères").nullable(),
  companyName: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  displayName: z.string().min(3, "Le nom doit contenir au moins 3 caractères").nullable(),
  email: z.email("Email invalide").nullable(),
  professionnalPhoneNumber: z.number().min(8, "Le numéro de téléphone est invalide").nullable(),
  personnelPhoneNumber: z.number().min(8, "Le numéro de téléphone est invalide").nullable(),
  taxRegistrationNumber: z.string().min(1, "La matricule fiscale est obligatoire").nullable(),
  currency: currencyTypeSchema.nullable(),
  taxRate: tvaRateStringSchema.nullable(),
  paymentCondition: PaymentConditionSchema.nullable(),
  billingAddress: addAddressSchema.nullable(),
  shippingAddress: addAddressSchema.nullable(),
  language: z.string().nullable(),
  iban: z.string().nullable(),
  rne: z.array(documentSchema).default([]).nullable(),
  contract: z.array(documentSchema).default([]).nullable(),
  patente: fileSchema.nullable() || z.array(documentSchema).default([]).nullable(),
  partnerType: partnerTypeSchema,
  invoices: z.array(z.lazy(() => z.any())).optional(),
  logs: z.array(z.lazy(() => z.any())).optional(),
});
export const createPartnerSchema = z.object({
  idPartner: z.uuid(),
  active: z.boolean(),
  enablePortal: z.boolean,
  maritalStatus: z.string(),
  partnerName: z.string(),
  companyName: z.string(),
  displayName: z.string(),
  email: z.email("Email invalide"),
  professionnalPhoneNumber: z.number(),
  personnelPhoneNumber: z.number(),
  taxRegistrationNumber: z.string(),
  currency: currencyTypeSchema,
  taxRate: tvaRateStringSchema,
  paymentCondition: PaymentConditionSchema,
  billingAddress: addAddressSchema,
  shippingAddress: addAddressSchema,
  language: z.string().min(1, "Language est obligatoire"),
  iban: z.string().min(1, "IBAN est obligatoire"),
  rne: documentSchema.nullable(),
  contract: documentSchema.nullable(),
  patente: documentSchema.nullable(),
  partnerType: partnerTypeSchema,
});

export const partnerDetailsSchema = z.object({
  idPartner: z.uuid(),
  active: z.boolean(),
  enablePortal: z.boolean,
  maritalStatus: z.string(),
  partnerName: z.string(),
  companyName: z.string(),
  displayName: z.string(),
  email: z.email("Email invalide"),
  professionnalPhoneNumber: z.number(),
  personnelPhoneNumber: z.number(),
  taxRegistrationNumber: z.string(),
  currency: currencyTypeSchema,
  taxRate: tvaRateStringSchema,
  paymentCondition: PaymentConditionSchema,
  billingAddress: addAddressSchema,
  shippingAddress: addAddressSchema,
  language: z.string().min(1, "Language est obligatoire"),
  iban: z.string().min(1, "IBAN est obligatoire"),
  rne: z.array(documentSchema).default([]),
  contract: z.array(documentSchema).default([]),
  patente: documentSchema.nullable(),
  partnerType: partnerTypeSchema,
});




export type Partner = z.infer<typeof partnerSchema> & {
  invoices?: Invoice[];
};

export const clientPartnerSchema = partnerSchema.extend({
  partnerType: z.literal("CLIENT"),
});

export const supplierPartnerSchema = partnerSchema.extend({
  partnerType: z.literal("SUPPLIER"),
});


export type CreatePartner = z.infer<typeof partnerSchema>;


export const clientPartnerDetailsSchema = partnerSchema.extend({
  partnerType: z.literal("CLIENT"),
});

export const supplierPartnerDetailsSchema = partnerSchema.extend({
  partnerType: z.literal("SUPPLIER"),
});

export const addPartnerSchema = z.object({
  partnerType: partnerTypeSchema,
  active: z.boolean(),
  maritalStatus: z.string().nullable().or(z.literal("")),
  firstName: z.string().min(3, "Le nom doit contenir au moins 3 caractères").nullable().or(z.literal("").transform(() => null)),
  lastName: z.string().min(3, "Le nom doit contenir au moins 3 caractères").nullable().or(z.literal("").transform(() => null)),

  companyName: z.string().min(1, "Le nom est obligatoire").min(3, "Le nom de l'entreprise doit contenir au moins 3 caractères"),
  shortName: z.string().min(3).nullable().or(z.literal("").transform(() => null)),

  currency: currencyTypeSchema.nullable().or(z.literal("").transform(() => null)),
  email: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val === "" || val === undefined ? null : val))
    .pipe(z.email("Email invalide").nullable()),
  workPhone: z
    .union([z.number(), z.nan(), z.literal("")])
    .nullable()
    .optional()
    .transform((val) => {
      if (val === "" || val === undefined || (typeof val === "number" && isNaN(val))) {
        return null;
      }
      return val;
    })
    .refine(
      (val) => val === null || /^\d{8,9}$/.test(val.toString()),
      { message: "Le numéro de téléphone doit contenir 8 ou 9 chiffres" }
    ),
  mobilePhone: z
    .union([z.number(), z.nan(), z.literal("")])
    .nullable()
    .optional()

    .transform((val) => {
      if (val === "" || val === undefined || (typeof val === "number" && isNaN(val))) {
        return null;
      }
      return val;
    }).refine(
      (val) => val === null || val === undefined || /^\d{8,9}$/.test(val.toString()),
      { message: "Le numéro de téléphone doit contenir 8 ou 9 chiffres" }
    ),
  language: z.string().nullable().or(z.literal("").transform(() => null)),

  taxId: z.string().min(1).nullable().or(z.literal("")),
  iban: z.string().nullable().or(z.literal("").transform(() => null)),
  taxRate: tvaRateStringSchema.nullable(),
  paymentTerms: PaymentConditionSchema.nullable().or(z.literal("").transform(() => null)),
  enablePortal: z.boolean(),
  billingAddress: addAddressSchema.nullable().optional(),
  shippingAddress: addAddressSchema.nullable().optional(),
  rne: fileSchema.nullable().optional(),
  contract: fileSchema.nullable().optional(),
  patente: fileSchema.nullable().optional(),
});

export type AddPartnerFormData = z.infer<typeof addPartnerSchema>;
export type PartnerAllDetails = z.infer<typeof partnerDetailsSchema>;
export type ClientPartnerDetails = z.infer<typeof clientPartnerDetailsSchema>;
export type SupplierPartnerDetails = z.infer<typeof supplierPartnerDetailsSchema>;

export const partnerItemSchema = partnerSchema.omit({
  displayName: true, currency: true, taxRate: true, logs: true, paymentCondition: true, shippingAddress: true,
  personnelPhoneNumber: true, enablePortal: true, language: true,
  rne: true, contract: true, invoices: true,
})

export type PartnerItem = z.infer<typeof partnerItemSchema>

export type ClientPartnerItem = PartnerItem & { partnerType: "CLIENT" };

export type SupplierPartnerItem = PartnerItem & { partnerType: "SUPPLIER" };



export const partnerSummarySchema = partnerSchema.pick({
  idPartner: true,
  maritalStatus: true,
  partnerName: true,
  companyName: true,
  email: true,
  billingAddress: true,
  professionnalPhoneNumber: true,
  taxRegistrationNumber: true,
  partnerType: true,
  currency: true,
  taxRate: true,
});
export const upadtePartnerSchema = addPartnerSchema.pick({
  partnerType: true,
  active: true,
  maritalStatus: true,
  firstName: true,
  lastName: true,
  companyName: true,
  shortName: true,
  currency: true,
  email: true,
  workPhone: true,
  mobilePhone: true,
  language: true,
  taxId: true,
  iban: true,
  taxRate: true,
  paymentTerms: true,
  enablePortal: true,
  billingAddress: true,
  shippingAddress: true,
  rne:true,
  contract:true,
  patente:true
});

export type UpdatePartner = z.infer<typeof upadtePartnerSchema>;

export type PartnerSummary = z.infer<typeof partnerSummarySchema>;
