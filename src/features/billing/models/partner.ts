import  { documentSchema } from "./document";
import {  z } from "zod";
import {  partnerTypeSchema } from "../types/partnerType";
import {  invoiceSchema } from "./invoice";

export const partnerSchema = z.object({
  idPartner: z.uuid(),
  name: z.string().min(1, "Le nom est obligatoire").min(3, "Le nom doit contenir au moins 3 caractères"),
  email: z.email("Email invalide"),
  phoneNumber: z.string().min(1, "Le téléphone est obligatoire").min(8, "Le numéro de téléphone est invalide"),
  taxRegistrationNumber: z.string().min(1, "La matricule fiscale est obligatoire"),
  country: z.string().min(1, "Le pays est obligatoire"),
  adress: z.string().min(1, "L'addresse est obligatoire"),
  iban: z.string().min(1, "IBAN est obligatoire"),

  rne: documentSchema,
  contract: documentSchema,
  patente: documentSchema,

  partnerType: partnerTypeSchema,

  invoices: z.array(z.lazy((): any => invoiceSchema)).optional(),
});

export type Partner = z.infer<typeof partnerSchema>;

export type ClientPartner = Partner & { partnerType: "CLIENT" };

export type SupplierPartner = Partner & { partnerType: "SUPPLIER" };

export const partnerItemSchema = partnerSchema.omit({patente: true, rne: true, contract: true, iban:true, invoices: true})

export type PartnerItem = z.infer<typeof partnerItemSchema>

export type ClientPartnerItem = PartnerItem & { partnerType: "CLIENT" };

export type SupplierPartnerItem = PartnerItem & { partnerType: "SUPPLIER" };

export const createPartnerSchema = partnerSchema.omit({idPartner: true, invoices: true})

export const createClientPartnerSchema = createPartnerSchema.extend({
  partnerType: z.literal("CLIENT"),
});

export const createSupplierPartnerSchema = createPartnerSchema.extend({
  partnerType: z.literal("SUPPLIER"),
});

export const updatePartnerSchema = createPartnerSchema
  .omit({ partnerType: true })
  .partial();

export type CreateClientPartner = z.infer<typeof createClientPartnerSchema>;
export type CreateSupplierPartner = z.infer<typeof createSupplierPartnerSchema>;
export type UpdatePartner = z.infer<typeof updatePartnerSchema>;