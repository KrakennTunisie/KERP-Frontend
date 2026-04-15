import { z } from "zod";


export const CreditNoteTypeSchema = z.enum(["Billing Error", "Return Of Goods","Price Adjustment","Quality Issue","Other Reason"]);
export type CreditNoteType= z.infer<typeof CreditNoteTypeSchema>;
export const creditNoteTypeLabels: Record<CreditNoteType, string> = {
   "Billing Error": "Erreur de facturation",
   "Return Of Goods" :"Retour de service",
   "Price Adjustment" :"Ajustement de prix",
   "Quality Issue":"Probléme de qualité",
   "Other Reason":"Autres raison"
}as const;