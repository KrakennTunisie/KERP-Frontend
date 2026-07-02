import { z } from "zod";


export const partnerDocumentType = z.enum([
  "RNE",
  "CONTRACT",
  "PATENT"
]);


export type PartnerDocumentType = z.infer<typeof partnerDocumentType>;