import { z } from "zod";


export const purchaseOrderStatusSchema = z.enum([
  "ALL",
  "DRAFT",
  "IN_DELIVERY",
  "CANCELLED",
  "PARTIALLY_INVOICED",
  "FULLY_INVOICED",
  "ARCHIVED",

  
]);

 export const purchaseOrderStatusWithoutAllSchema =
  purchaseOrderStatusSchema.exclude(["ALL"]);

export type purchaseOrderStatus = z.infer<typeof purchaseOrderStatusSchema>;


export const purchaseOrderStatusLabels: Record<purchaseOrderStatus, string> = {
  ALL: "TOUTES",
  DRAFT: "BROUILLON",
  IN_DELIVERY: "En cours de livraison",
  CANCELLED: "ANNULÉE",
  PARTIALLY_INVOICED : "Facturée partiellement",
  FULLY_INVOICED : "Facturée totalement",
  ARCHIVED : "Archivée"
 
};

export const purchaseOrderStatusColors: Record<
  Exclude<purchaseOrderStatus, "ALL">,
  string
> = {
  DRAFT: "bg-slate-100 text-slate-600 border border-slate-200",
  IN_DELIVERY: "bg-blue-100 text-blue-700 border border-blue-200",
  CANCELLED: "bg-red-100 text-red-700 border border-red-200",
  FULLY_INVOICED : "bg-green-100 text-green-700 border border-green-200",
  PARTIALLY_INVOICED: "bg-amber-100 text-amber-700 border border-amber-200",
  ARCHIVED :"bg-red-100 text-red-700 border border-red-200"
};
export const CLIENT_PURCHASEORDER_STATUS_PASSAGE_POLICY: Record<purchaseOrderStatus, purchaseOrderStatus[]> = {
  DRAFT: ["IN_DELIVERY","CANCELLED"],
  IN_DELIVERY :["CANCELLED","FULLY_INVOICED","PARTIALLY_INVOICED"],
  CANCELLED: [],
  PARTIALLY_INVOICED: ["FULLY_INVOICED","CANCELLED"],
  FULLY_INVOICED:["ARCHIVED"],
  ALL: [],
  ARCHIVED: [],
};
export const getClientPurchaseOrderAllowedNextStatuses = (
  currentStatus: purchaseOrderStatus
): purchaseOrderStatus[] => {
  return CLIENT_PURCHASEORDER_STATUS_PASSAGE_POLICY[currentStatus] ?? [];
};
