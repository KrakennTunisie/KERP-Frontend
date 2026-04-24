import { z } from "zod";


export const purchaseOrderStatusSchema = z.enum([
  "ALL",
  "DRAFT",
  "IN_DELIVERY",
  "CANCELLED",
  "CLOSED"
  
]);

export type purchaseOrderStatus = z.infer<typeof purchaseOrderStatusSchema>;


export const purchaseOrderStatusLabels: Record<purchaseOrderStatus, string> = {
  ALL: "TOUTES",
  DRAFT: "BROUILLON",
  IN_DELIVERY: "En cours de livraison",
  CANCELLED: "ANNULÉE",
  CLOSED : "CLOTURÉE"
 
};

export const purchaseOrderStatusColors: Record<
  Exclude<purchaseOrderStatus, "ALL">,
  string
> = {
  DRAFT: "bg-slate-100 text-slate-600 border border-slate-200",
  IN_DELIVERY: "bg-blue-100 text-blue-700 border border-blue-200",
  CANCELLED: "bg-red-100 text-red-700 border border-red-200",
  CLOSED: "bg-emerald-100 text-emerald-700 border border-emerald-200",
};
export const CLIENT_PURCHASEORDER_STATUS_PASSAGE_POLICY: Record<purchaseOrderStatus, purchaseOrderStatus[]> = {
  DRAFT: ["IN_DELIVERY","CANCELLED"],
  IN_DELIVERY :["CANCELLED","CLOSED"],
  CANCELLED: [],
  ALL: [],
  CLOSED: [],
};
export const getClientPurchaseOrderAllowedNextStatuses = (
  currentStatus: purchaseOrderStatus
): purchaseOrderStatus[] => {
  return CLIENT_PURCHASEORDER_STATUS_PASSAGE_POLICY[currentStatus] ?? [];
};
