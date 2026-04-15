import { z } from "zod";

export const operationCategorySchema = z.enum([
    "OFFICE_SUPPLIES",
    "SOFTWARE",
    "TRANSPORT",
    "BANK",
    "INSURANCE",
    "ACCOUNTING",
    "EVENT",
    "MARKETING",
    "DEPRECIABLE_EQUIPMENT",
    "SERVICE_PROVISION",
    "RESTAURANT",
    "OTHER",
]);
export type OperationCategory = z.infer<typeof operationCategorySchema>;

export const OperationCategoryLabels: Record<OperationCategory, string> = {
    OFFICE_SUPPLIES: "Fourniture du bureau",
    SOFTWARE: "Logiciels",
    TRANSPORT: "Bureau Transport",
    BANK: "Banque",
    INSURANCE: "Assurance",
    ACCOUNTING: "Comptabilité",
    EVENT: "Event",
    MARKETING: "Marketing",
    DEPRECIABLE_EQUIPMENT: "Matériel amortissable",
    SERVICE_PROVISION: "Prestation de Service",
    RESTAURANT: "Restaurant",
    OTHER: "Autre",
};