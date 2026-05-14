import {  z } from "zod";
import {  partnerTypeSchema } from "../types/partnerType";
import { fileSchema } from "../types/pdfSchema";

import type { Invoice } from "./invoice";
import { documentSchema } from "./document";
import { $ZodAny } from "node_modules/zod/v4/core/schemas.cjs";

export const partnerSchema = z.object({
  idPartner: z.uuid(),
  name: z.string().min(1, "Le nom est obligatoire").min(3, "Le nom doit contenir au moins 3 caractères"),
  email: z.email("Email invalide"),
  phoneNumber: z.string().min(1, "Le téléphone est obligatoire").min(8, "Le numéro de téléphone est invalide"),
  taxRegistrationNumber: z.string().min(1, "La matricule fiscale est obligatoire"),
  country: z.string().min(1, "Le pays est obligatoire"),
  address: z.string().min(1, "L'addresse est obligatoire"),
  iban: z.string().min(1, "IBAN est obligatoire"),

  rne: fileSchema.nullable(),
  contract: fileSchema.nullable(),
  patente: fileSchema.nullable() ,

  partnerType: partnerTypeSchema,
  invoices: z.array(z.lazy(() => z.any())).optional(),
});

export const partnerDetailsSchema = z.object({
  idPartner: z.string(),

  name: z.string(),

  email: z.email().nullable().optional(),

  phoneNumber: z.string().nullable().optional(),

  taxRegistrationNumber: z.string().nullable().optional(),

  country: z.string().nullable().optional(),

  address: z.string().nullable().optional(),

  iban: z.string().nullable().optional(),

  partnerType: partnerTypeSchema,

  rne: documentSchema.nullable().optional(),

  contract: documentSchema.nullable().optional(),

  patente: documentSchema.nullable().optional(),

  createdAt: z.date(),

  updatedAt: z.date(),
});


export const createPartnerSchema = z.object({
  name: z.string().min(1, "Le nom est obligatoire").min(3, "Le nom doit contenir au moins 3 caractères"),
  email: z.email("Email invalide"),
  phoneNumber: z.string().min(1, "Le téléphone est obligatoire").min(8, "Le numéro de téléphone est invalide"),
  taxRegistrationNumber: z.string().min(1, "La matricule fiscale est obligatoire"),
  country: z.string().min(1, "Le pays est obligatoire"),
  address: z.string().min(1, "L'addresse est obligatoire"),
  iban: z.string().min(1, "IBAN est obligatoire"),

  partnerType: partnerTypeSchema,

  rne: fileSchema,
  contract: fileSchema,
  patente: fileSchema ,
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


export type ClientPartner = z.infer<typeof clientPartnerSchema>;
export type SupplierPartner = z.infer<typeof supplierPartnerSchema>;

export const clientPartnerDetailsSchema = partnerSchema.extend({
  partnerType: z.literal("CLIENT"),
});

export const supplierPartnerDetailsSchema = partnerSchema.extend({
  partnerType: z.literal("SUPPLIER"),
});


export type ClientPartnerDetails = z.infer<typeof clientPartnerDetailsSchema>;
export type SupplierPartnerDetails = z.infer<typeof supplierPartnerDetailsSchema>;

export const partnerItemSchema = partnerSchema.omit({patente: true, rne: true, contract: true,  invoices: true})

export type PartnerItem = z.infer<typeof partnerItemSchema>

export type ClientPartnerItem = PartnerItem & { partnerType: "CLIENT" };

export type SupplierPartnerItem = PartnerItem & { partnerType: "SUPPLIER" };


export const createClientPartnerSchema = createPartnerSchema.extend({
  partnerType: z.literal("CLIENT"),
});

export const createSupplierPartnerSchema = createPartnerSchema.extend({
  partnerType: z.literal("SUPPLIER"),
});

export const updatePartnerSchema = createPartnerSchema
  .omit({ taxRegistrationNumber: true, rne: true, contract: true, patente: true })
  .partial();

export const partnerSummarySchema = partnerSchema.pick({
  idPartner: true,
  name: true,
  email: true,
  address: true,
  phoneNumber: true,
  partnerType: true,
});

export type PartnerSummary = z.infer<typeof partnerSummarySchema>;
export type CreateClientPartner = z.infer<typeof createClientPartnerSchema>;
export type CreateSupplierPartner = z.infer<typeof createSupplierPartnerSchema>;
export type UpdatePartner = z.infer<typeof updatePartnerSchema>;