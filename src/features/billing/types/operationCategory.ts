import { z } from "zod";


export const operationCategorySchema = z.enum(["OFFICE_SUPPLIES", "SERVICES", "IT_EQUIPMENT", "SOFTWARE", "PROFESSIONAL_SERVICE", "OTHER"]);
export type OperationCategory = z.infer<typeof operationCategorySchema>;


export const OperationCategoryLabels: Record<OperationCategory, string> = {
   OFFICE_SUPPLIES :"Fourniture du bureau",
   SERVICES : "Services",
   IT_EQUIPMENT: "Equipement IT",
   SOFTWARE: "Logiciels",
   PROFESSIONAL_SERVICE : "Service professionnel",
   OTHER: "Autres"
};