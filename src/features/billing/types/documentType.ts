import { z } from "zod";


export const partnerDocumentType = z.enum([
  "RNE",
  "CONTRACT",
  "PATENTE"
]);


export type PartnerDocumentType = z.infer<typeof partnerDocumentType>;