import { z } from "zod";


export const paymentStatusTypeSchema = z.enum(["SENT", "NOT_SENT"]);
export type PaymentType = z.infer<typeof paymentStatusTypeSchema>;