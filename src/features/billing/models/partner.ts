import {  z } from "zod";
import {  partnerTypeSchema } from "../types/partnerType";
import {  invoiceSchema } from "./invoice";
import { documentSchema } from "./document";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ACCEPTED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png"
];

const fileSchema = z
  .instanceof(File, { message: "Fichier obligatoire" })
  .refine((file) => file.size <= MAX_FILE_SIZE, "Le fichier doit être inférieur à 3MB")
  .refine(
    (file) => ACCEPTED_TYPES.includes(file.type),
    "Format accepté : PDF, JPG, PNG"
  );

export const partnerSchema = z.object({
  idPartner: z.uuid(),
  name: z.string().min(1, "Le nom est obligatoire").min(3, "Le nom doit contenir au moins 3 caractères"),
  email: z.email("Email invalide"),
  phoneNumber: z.string().min(1, "Le téléphone est obligatoire").min(8, "Le numéro de téléphone est invalide"),
  taxRegistrationNumber: z.string().min(1, "La matricule fiscale est obligatoire"),
  country: z.string().min(1, "Le pays est obligatoire"),
  address: z.string().min(1, "L'addresse est obligatoire"),
  iban: z.string().min(1, "IBAN est obligatoire"),

  rne: documentSchema,
  contract: documentSchema,
  patente: documentSchema,

  partnerType: partnerTypeSchema,

  invoices: z.array(z.lazy((): any => invoiceSchema)).optional(),
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
  patente: fileSchema,
});

export type Partner = z.infer<typeof partnerSchema>;

export const clientPartnerSchema = partnerSchema.extend({
  partnerType: z.literal("CLIENT"),
});

export const supplierPartnerSchema = partnerSchema.extend({
  partnerType: z.literal("SUPPLIER"),
});

export type ClientPartner = z.infer<typeof clientPartnerSchema>;
export type SupplierPartner = z.infer<typeof supplierPartnerSchema>;

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

export type CreateClientPartner = z.infer<typeof createClientPartnerSchema>;
export type CreateSupplierPartner = z.infer<typeof createSupplierPartnerSchema>;
export type UpdatePartner = z.infer<typeof updatePartnerSchema>;