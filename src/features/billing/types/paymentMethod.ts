import { z } from "zod";


export const paymentMethodSchema = z.enum(["BANK_TRANSFER", "CHECK", "CASH"]);
export type paymentMethod = z.infer<typeof paymentMethodSchema>;

export const paymentMethodLabels: Record<paymentMethod, string> = {
    CHECK:         "Chèque",
    BANK_TRANSFER: "Virement",
    CASH:          "Espèces",
};