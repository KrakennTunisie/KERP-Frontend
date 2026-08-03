"use client";

import { Archive, CircleSlash, Eye, Pencil, Send, Settings, Trash2 } from "lucide-react";

import { formatDateLong } from "@/shared/utils/formatDate";
import { purchaseOrderStatusColors, purchaseOrderStatusLabels, purchaseOrderStatusSchema } from "../../types/purchaseOrderStatus";
import { PurchaseOrderPageItem } from "../../models/purchaseOrder";
import { ActionMenu, ActionMenuItem } from "@/shared/components/ui/actionMenuItem";


type PurchaseOrderRowProps<TPurchaseOrder extends PurchaseOrderPageItem> = {
  purchaseOrder: TPurchaseOrder;

  isSupplierPurchaseOrder?: boolean;

  onView: (purchaseOrder: TPurchaseOrder) => void;
  onEdit?: (purchaseOrder: TPurchaseOrder) => void;
  onSend?: (purchaseOrder: TPurchaseOrder) => void;
  onUpdateStatus: (purchaseOrder: TPurchaseOrder) => void;
  onDelete: (purchaseOrder: TPurchaseOrder) => void;
  onArchive: (purchaseOrder: TPurchaseOrder) => void;

  getAllowedNextStatuses: (
    status: TPurchaseOrder["purchaseOrderStatus"]
  ) => unknown[];

  formatPurchaseOrderAmount: (purchaseOrder: TPurchaseOrder) => string;
};



export function PurchaseOrderRow<TPurchaseOrder extends PurchaseOrderPageItem>({
  purchaseOrder,
  isSupplierPurchaseOrder = true,
  onView,
  onEdit,
  onSend,
  onUpdateStatus,
  onDelete,
  onArchive,
  getAllowedNextStatuses,
  formatPurchaseOrderAmount,
}: PurchaseOrderRowProps<TPurchaseOrder>) {
  const canUpdateStatus =
    getAllowedNextStatuses(purchaseOrder.purchaseOrderStatus).length > 0;

  const canDelete = purchaseOrder.purchaseOrderStatus === "DRAFT" || purchaseOrder.purchaseOrderStatus === "CANCELLED" ;

const canSend = purchaseOrder.partner.email!="" &&
  purchaseOrder.purchaseOrderStatus !== purchaseOrderStatusSchema.enum.FULLY_INVOICED &&
  purchaseOrder.purchaseOrderStatus !== purchaseOrderStatusSchema.enum.ARCHIVED &&
  purchaseOrder.purchaseOrderStatus !== purchaseOrderStatusSchema.enum.CANCELLED;

  const purchaseOrderActions: ActionMenuItem[] = [];

  if (isSupplierPurchaseOrder && purchaseOrder.purchaseOrderStatus != purchaseOrderStatusSchema.enum.ARCHIVED && purchaseOrder.purchaseOrderStatus != purchaseOrderStatusSchema.enum.FULLY_INVOICED) {
    purchaseOrderActions.push({
      label: "Modifier",
      icon: Pencil,
      color: "text-amber-600",
      hover: "hover:bg-amber-50",
      onClick: () => onEdit?.(purchaseOrder),
      visible: canUpdateStatus
    });
  }
 if(purchaseOrder.purchaseOrderStatus != purchaseOrderStatusSchema.enum.ARCHIVED && purchaseOrder.purchaseOrderStatus != purchaseOrderStatusSchema.enum.FULLY_INVOICED)
  purchaseOrderActions.push({
    label: "Mettre à jour le statut",
    icon: Settings,
    color: "text-violet-600",
    hover: "hover:bg-violet-50",

    onClick: () => onUpdateStatus(purchaseOrder),
    visible: canUpdateStatus
  });

  if (isSupplierPurchaseOrder && canSend) {
    purchaseOrderActions.push({
      label: "Envoyer",
      icon: Send,
      color: "text-emerald-600",
      hover: "hover:bg-emerald-50",
      onClick: () => onSend?.(purchaseOrder),
      visible: canSend
    });
  }
  
 if(purchaseOrder.purchaseOrderStatus != purchaseOrderStatusSchema.enum.ARCHIVED)
  purchaseOrderActions.push({
    label: "Supprimer",
    icon: Trash2,
    color: "text-rose-600",
    hover: "hover:bg-rose-50",
    onClick: () => onDelete(purchaseOrder),
    visible: canDelete
  });

  if(purchaseOrder.purchaseOrderStatus != purchaseOrderStatusSchema.enum.ARCHIVED)
  purchaseOrderActions.push({
    label: "Archiver",
    icon: Archive,
    color: "text-rose-600",
    hover: "hover:bg-rose-50",
    onClick: () => onArchive(purchaseOrder),
    visible: purchaseOrder.purchaseOrderStatus == purchaseOrderStatusSchema.enum.FULLY_INVOICED || purchaseOrder.purchaseOrderStatus == purchaseOrderStatusSchema.enum.CANCELLED
  });
  console.log("1")
  console.log(purchaseOrderActions.length)
  return (
    <tr
      key={purchaseOrder.idPurchaseOrder}
      className="transition-colors hover:bg-slate-50/60"
    >

      {/* NUMBER */}
      <td className="whitespace-nowrap px-4 py-3 text-center">
        <button
          type="button"
          onClick={() => onView(purchaseOrder)}
          className="cursor-pointer text-[11px] font-semibold tracking-tight text-blue-600 underline-offset-4 transition hover:text-blue-700 hover:underline"
        >
          {purchaseOrder.purchaseOrderNumber}
        </button>
      </td>

      {/* PARTNER */}
      <td className="px-4 py-3 text-center">
        <span className="text-[11px] font-medium text-slate-700">
          {purchaseOrder.partner?.companyName ?? "—"}
        </span>
      </td>

      {/* DATE */}
      <td className="px-4 py-3 text-center">
        <span className="text-[11px] font-medium text-slate-600">
          {formatDateLong(purchaseOrder.issueDate)}
        </span>
      </td>

      {/* STATUS */}
      <td className="px-4 py-3 text-center">
        <span
          className={`
        inline-flex items-center rounded-full px-2 py-0.5
        text-[10px] font-semibold ring-1 ring-inset
        ${purchaseOrderStatusColors[purchaseOrder.purchaseOrderStatus]}
      `}
        >
          {purchaseOrderStatusLabels[purchaseOrder.purchaseOrderStatus]}
        </span>
      </td>

      {/* AMOUNT */}
      <td className="whitespace-nowrap px-4 py-3 text-center">
        <span className="text-[11px] font-semibold tabular-nums text-slate-900">
          {formatPurchaseOrderAmount(purchaseOrder)}
        </span>
      </td>

      {/* ACTIONS */}

      <td className="px-4 py-2.5">
        <div className="flex items-center justify-end">
          {
            purchaseOrderActions && purchaseOrderActions.length == 0 ?
              <span
                className="inline-flex h-8 w-8 items-center justify-center text-slate-300"
                title="Aucune action disponible"
              >
                <CircleSlash className="h-5 w-5" />
              </span>
              : (
                <ActionMenu
                  orientation="horizontal"
                  title="Actions bon de commande"
                  items={purchaseOrderActions}
                />)}
        </div>
      </td>

    </tr>
  );
}