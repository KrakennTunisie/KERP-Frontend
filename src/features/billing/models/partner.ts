import {  z } from "zod";
import {  partnerTypeSchema } from "../types/partnerType";
import { fileSchema } from "../types/pdfSchema";

import type { Invoice } from "./invoice";
import { documentSchema } from "./document";
import { $ZodAny } from "node_modules/zod/v4/core/schemas.cjs";
import { PaymentConditionSchema } from "../types/paymentCondition";
import { tvaRateStringSchema } from "../types/tvaRate";
import { currencyTypeSchema } from "../types/currency";
import { addAddressSchema, addressSchema } from "./Address";

export const partnerSchema = z.object({
  idPartner: z.uuid(),
  active : z.boolean(),
  enablePortal : z.boolean,
  maritalStatus: z.string().min(1, "La salutation est obligatoire"),
  partnerName: z.string().min(1, "Le nom est obligatoire").min(3, "Le nom doit contenir au moins 3 caractères"),
  companyName: z.string().min(1, "Le nom est obligatoire").min(3, "Le nom doit contenir au moins 3 caractères"),
  displayName: z.string().min(1, "Le nom est obligatoire").min(3, "Le nom doit contenir au moins 3 caractères"),
  email: z.email("Email invalide"),
  professionnalPhoneNumber: z.string().min(1, "Le téléphone est obligatoire").min(8, "Le numéro de téléphone est invalide"),
  personnelPhoneNumber: z.string().min(1, "Le téléphone est obligatoire").min(8, "Le numéro de téléphone est invalide"),
  taxRegistrationNumber: z.string().min(1, "La matricule fiscale est obligatoire"),
  currency: currencyTypeSchema,
  taxRate: tvaRateStringSchema,
  paymentCondition: PaymentConditionSchema,
  billingAddress : addAddressSchema,
  shippingAddress : addAddressSchema,
  language: z.string().min(1, "Language est obligatoire"),
  iban: z.string().min(1, "IBAN est obligatoire"),
  rne: fileSchema.nullable(),
  contract: fileSchema.nullable(),
  patente: fileSchema.nullable() ,
  partnerType: partnerTypeSchema,
  invoices: z.array(z.lazy(() => z.any())).optional(),
  logs : z.array(z.lazy(() => z.any())).optional(),
});
export const createPartnerSchema = z.object({
  idPartner: z.uuid(),
  active : z.boolean(),
  enablePortal : z.boolean,
  maritalStatus: z.string(),
  partnerName: z.string(),
  companyName: z.string(),
  displayName: z.string(),
  email: z.email("Email invalide"),
  professionnalPhoneNumber: z.string(),
  personnelPhoneNumber: z.string(),
  taxRegistrationNumber: z.string(),
  currency: currencyTypeSchema,
  taxRate: tvaRateStringSchema,
  paymentCondition: PaymentConditionSchema,
  billingAddress : addAddressSchema,
  shippingAddress : addAddressSchema,
  language: z.string().min(1, "Language est obligatoire"),
  iban: z.string().min(1, "IBAN est obligatoire"),
  rne: documentSchema.nullable(),
  contract:  documentSchema.nullable(),
  patente:  documentSchema.nullable() ,
  partnerType: partnerTypeSchema,
});

export const partnerDetailsSchema = z.object({
  idPartner: z.uuid(),
  active : z.boolean(),
  enablePortal : z.boolean,
  maritalStatus: z.string(),
  partnerName: z.string(),
  companyName: z.string(),
  displayName: z.string(),
  email: z.email("Email invalide"),
  professionnalPhoneNumber: z.string(),
  personnelPhoneNumber: z.string(),
  taxRegistrationNumber: z.string(),
  currency: currencyTypeSchema,
  taxRate: tvaRateStringSchema,
  paymentCondition: PaymentConditionSchema,
  billingAddress : addAddressSchema,
  shippingAddress : addAddressSchema,
  language: z.string().min(1, "Language est obligatoire"),
  iban: z.string().min(1, "IBAN est obligatoire"),
  rne: documentSchema.nullable(),
  contract:  documentSchema.nullable(),
  patente:  documentSchema.nullable() ,
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
  active : z.boolean(),
  maritalStatus: z.string().min(1, "La salutation est obligatoire"),
  firstName: z.string().min(1, "Le nom est obligatoire").min(3, "Le nom doit contenir au moins 3 caractères"),
  lastName: z.string().min(1, "Le nom est obligatoire").min(3, "Le nom doit contenir au moins 3 caractères"),

  companyName: z.string().min(1, "Le nom est obligatoire").min(3, "Le nom doit contenir au moins 3 caractères"),
  shortName: z.string().min(1, "Le nom est obligatoire"),

  currency: currencyTypeSchema,
  email: z.email("Email invalide"),
  workPhone: z.string(),
  mobilePhone: z.string(),
  language: z.string(),

  taxId: z.string().min(1, "Le matricule fiscal est obligatoire"),
  iban: z.string(),
  taxRate: tvaRateStringSchema,
  paymentTerms: PaymentConditionSchema,
  enablePortal: z.boolean(),
  billingAddress : addAddressSchema,
  shippingAddress :addAddressSchema,
  rne: fileSchema || undefined,
  contract: fileSchema || undefined,
  patente: fileSchema.nullable(),
});

export type AddPartnerFormData = z.infer<typeof addPartnerSchema>;
export type PartnerAllDetails = z.infer<typeof partnerDetailsSchema>;
export type ClientPartnerDetails = z.infer<typeof clientPartnerDetailsSchema>;
export type SupplierPartnerDetails = z.infer<typeof supplierPartnerDetailsSchema>;

export const partnerItemSchema = partnerSchema.omit({
  maritalStatus: true,displayName: true,currency:true, taxRate:true,logs:true,paymentCondition:true,shippingAddress:true,
  personnelPhoneNumber : true,patente: true,enablePortal:true,active:true,language:true,
   rne: true, contract: true,  invoices: true})

export type PartnerItem = z.infer<typeof partnerItemSchema>

export type ClientPartnerItem = PartnerItem & { partnerType: "CLIENT" };

export type SupplierPartnerItem = PartnerItem & { partnerType: "SUPPLIER" };



export const partnerSummarySchema = partnerSchema.pick({
  idPartner: true,
  partnerName: true,
  companyName: true,
  email: true,
  billingAddress: true,
  professionnalPhoneNumber: true,
  partnerType: true,
});
export const upadtePartnerSchema = addPartnerSchema.pick({
  partnerType: true,
  active : true,
  maritalStatus: true,
  firstName: true,
  lastName:true,
  companyName: true,
  shortName: true,
  currency : true,
  email: true,
  workPhone: true,
  mobilePhone: true,
  language: true,
  taxId: true,
  iban: true,
  taxRate: true,
  paymentTerms: true,
  enablePortal: true,
  billingAddress : true,
  shippingAddress :true,
});

export type UpdatePartner = z.infer<typeof upadtePartnerSchema >;

export type PartnerSummary = z.infer<typeof partnerSummarySchema>;
