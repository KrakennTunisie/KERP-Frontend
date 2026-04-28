import { z } from "zod";


export const purchaseOrderTypeSchema = z.enum(["PURCHASE", "SALE",]);
export type PurchaseOrderType = z.infer<typeof purchaseOrderTypeSchema>;


export const purchaseOrderTypeLabels: Record<PurchaseOrderType, string> = {
  PURCHASE:"Achat",
  SALE:"Vente",

};