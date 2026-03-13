import { z } from "zod";


export const partnerTypeSchema = z.enum(["CLIENT", "SUPPLIER"]);
export type PartnerType = z.infer<typeof partnerTypeSchema>;