import { z } from "zod";


export const paymentMethodSchema = z.enum(["BANK_TRANSFER", "CHECK", "CASH"]);
export type paymentMethod = z.infer<typeof paymentMethodSchema>;