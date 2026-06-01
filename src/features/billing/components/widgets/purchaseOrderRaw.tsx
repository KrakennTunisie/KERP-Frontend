"use client";

import { Eye, Pencil, Send, Settings, Trash2 } from "lucide-react";

import { formatDateLong } from "@/shared/utils/formatDate";
import { purchaseOrderStatusColors, purchaseOrderStatusLabels } from "../../types/purchaseOrderStatus";
import { PurchaseOrderPageItem } from "../../models/purchaseOrder";
import { ActionMenu, ActionMenuItem } from "@/shared/components/ui/actionMenuItem";


type PurchaseOrderRowProps<TPurchaseOrder extends PurchaseOrderPageItem> = {
  purchaseOrder: TPurchaseOrder;

  isClientPurchaseOrder?: boolean;

  onView: (purchaseOrder: TPurchaseOrder) => void;
  onEdit?: (purchaseOrder: TPurchaseOrder) => void;
  onSend?: (purchaseOrder: TPurchaseOrder) => void;
  onUpdateStatus: (purchaseOrder: TPurchaseOrder) => void;
  onDelete: (purchaseOrder: TPurchaseOrder) => void;

  getAllowedNextStatuses: (
    status: TPurchaseOrder["purchaseOrderStatus"]
  ) => unknown[];

  formatPurchaseOrderAmount: (purchaseOrder: TPurchaseOrder) => string;
};



export function PurchaseOrderRow<TPurchaseOrder extends PurchaseOrderPageItem>({
  purchaseOrder,
  isClientPurchaseOrder = false,
  onView,
  onEdit,
  onSend,
  onUpdateStatus,
  onDelete,
  getAllowedNextStatuses,
  formatPurchaseOrderAmount,
}: PurchaseOrderRowProps<TPurchaseOrder>) {
  const canUpdateStatus =
    getAllowedNextStatuses(purchaseOrder.purchaseOrderStatus).length > 0;

  const canDelete = purchaseOrder.purchaseOrderStatus === "DRAFT";

  const canSend = purchaseOrder.purchaseOrderStatus !== "DRAFT";

  const purchaseOrderActions: ActionMenuItem[] = [];

  if (isClientPurchaseOrder) {
    purchaseOrderActions.push({
      label: "Modifier",
      icon: Pencil,
      color: "text-amber-600",
      hover: "hover:bg-amber-50",
      onClick: () => onEdit?.(purchaseOrder),
    });
  }

  purchaseOrderActions.push({
    label: "Mettre à jour le statut",
    icon: Settings,
    color: "text-violet-600",
    hover: "hover:bg-violet-50",
    disabled: !canUpdateStatus,
    onClick: () => onUpdateStatus(purchaseOrder),
  });

  if (isClientPurchaseOrder) {
    purchaseOrderActions.push({
      label: "Envoyer",
      icon: Send,
      color: "text-emerald-600",
      hover: "hover:bg-emerald-50",
      disabled: !canSend,
      onClick: () => onSend?.(purchaseOrder),
    });
  }

  purchaseOrderActions.push({
    label: "Supprimer",
    icon: Trash2,
    color: "text-rose-600",
    hover: "hover:bg-rose-50",
    disabled: !canDelete,
    onClick: () => onDelete(purchaseOrder),
  });

  return (
    <tr
      key={purchaseOrder.idPurchaseOrder}
      className="transition-colors hover:bg-slate-50/70"
    >
      <td className="whitespace-nowrap px-5 py-4 text-center">
        <button
          type="button"
          onClick={() => onView(purchaseOrder)}
          className="font-semibold tracking-tight text-blue-600 underline-offset-4 transition hover:text-blue-800 hover:underline cursor-pointer"
        >
          {purchaseOrder.purchaseOrderNumber}
        </button>
      </td>

      <td className="px-5 py-4 text-center">
        <span className="font-medium text-slate-700">
          {purchaseOrder.partner?.name ?? "—"}
        </span>
      </td>

      <td className="px-5 py-4 text-center">
        <span className="font-medium text-slate-700">
          {formatDateLong(purchaseOrder.issueDate)}
        </span>
      </td>

      <td className="px-5 py-4 text-center">
        <span
          className={`
            inline-flex items-center justify-center rounded-full px-2.5 py-1
            text-xs font-medium ring-1 ring-inset
            ${purchaseOrderStatusColors[purchaseOrder.purchaseOrderStatus]}
          `}
        >
          {purchaseOrderStatusLabels[purchaseOrder.purchaseOrderStatus]}
        </span>
      </td>

      <td className="whitespace-nowrap px-5 py-4 text-center">
        <span className="font-semibold tabular-nums text-slate-900">
          {formatPurchaseOrderAmount(purchaseOrder)}
        </span>
      </td>

      <td className="px-5 py-4 text-center">
        <div className="flex items-center justify-center">
          <ActionMenu
            orientation="horizontal"
            title="Actions bon de commande"
            items={purchaseOrderActions}
          />
        </div>
      </td>
    </tr>
  );
}