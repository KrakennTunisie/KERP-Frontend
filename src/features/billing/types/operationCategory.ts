import { z } from "zod";


export const operationCategorySchema = z.enum(["OFFICE_SUPPLIES", "SERVICES", "IT_EQUIPMENT", "SOFTWARE", "PROFESSIONAL_SERVICE", "OTHER"]);
export type OperationCategory = z.infer<typeof operationCategorySchema>;