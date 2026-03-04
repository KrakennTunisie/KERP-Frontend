import  { documentSchema } from "./document";
import {  z } from "zod";
import {  partnerTypeSchema } from "../types/partnerType";
import {  invoiceSchema } from "./invoice";

export const partnerSchema = z.object({
  idPartner: z.uuid(),
  name: z.string().min(3),
  email: z.email(),
  phoneNumber: z.string().min(1),
  taxRegistrationNumber: z.string().min(1),
  country: z.string().min(1),
  adress: z.string().min(1),
  iban: z.string().min(1),

  rne: documentSchema,
  contact: documentSchema,
  patente: documentSchema,

  partnerType: partnerTypeSchema,

  invoices: z.array(z.lazy((): any => invoiceSchema)).optional(),
});

export type Partner = z.infer<typeof partnerSchema>;

export type ClientPartner = Partner & { partnerType: "CLIENT" };

export type SupplierPartner = Partner & { partnerType: "SUPPLIER" };

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