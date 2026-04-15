import { z } from "zod";

export const purchaseOrderStatusSchema = z.enum(["TOUTES","BROULLION", "EN COURS DE LIVRAISON", "CLOTURÉ", "ANNULÉE"]);
export type purchaseOrderStatus = z.infer<typeof purchaseOrderStatusSchema>;
export const purchaseOrderStatusColors: Record<Exclude<purchaseOrderStatus, "TOUTES">, string> = {
     BROULLION:     "bg-slate-100 text-slate-600 border border-slate-200",
    "EN COURS DE LIVRAISON":  "bg-amber-100 text-amber-700 border border-amber-200",
     CLOTURÉ:   "bg-blue-100 text-blue-700 border border-blue-200",
     ANNULÉE:       "bg-red-100 text-red-700 border border-red-200",

};