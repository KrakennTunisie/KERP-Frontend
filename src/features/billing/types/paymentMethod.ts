import { z } from "zod";


export const paymentMethodSchema = z.enum(["BANK_TRANSFER", "CHECK", "CASH"]);
export type paymentMethod = z.infer<typeof paymentMethodSchema>;

export const paymentMethodWithAllSchema = z.enum(["ALL","BANK_TRANSFER", "CHECK", "CASH"]);
export type paymentMethodWithAll = z.infer<typeof paymentMethodWithAllSchema>;

export const paymentMethodLabels: Record<paymentMethod, string> = {
    CHECK:         "Chèque",
    BANK_TRANSFER: "Virement",
    CASH:          "Espèces",
};

export const paymentMethodWithAllLabels: Record<paymentMethodWithAll, string> = {
    ALL: "Tous",
    CHECK:         "Chèque",
    BANK_TRANSFER: "Virement",
    CASH:          "Espèces",
};