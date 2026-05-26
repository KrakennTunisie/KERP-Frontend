import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Send,
  Settings,
  Trash2,
} from "lucide-react";
import { PurchaseOrderPageItem } from "../../models/purchaseOrder";
import { purchaseOrderStatus, purchaseOrderStatusColors, purchaseOrderStatusLabels } from "../../types/purchaseOrderStatus";
import { formatDateLong } from "@/shared/utils/formatDate";
import { TableActionButton } from "./tableActionButton";

type PurchaseOrderType = "CLIENT" | "SUPPLIER";


type PurchaseOrderTableProps = {
  type: PurchaseOrderType;
  loading: boolean;
  purchaseOrders: PurchaseOrderPageItem[];

  currentPage: number;
  totalPages: number;
  totalElements: number;

  onPageChange: (page: number) => void;
  onView: (purchaseOrder: PurchaseOrderPageItem) => void;
  onEdit?: (purchaseOrder: PurchaseOrderPageItem) => void;
  onUpdateStatus: (purchaseOrder: PurchaseOrderPageItem) => void;
  onSend?: (purchaseOrder: PurchaseOrderPageItem) => void;
  onDelete: (purchaseOrder: PurchaseOrderPageItem) => void;

  getAllowedNextStatuses: (status: purchaseOrderStatus) => purchaseOrderStatus[];
};



function formatPurchaseOrderAmount(purchaseOrder: PurchaseOrderPageItem) {
  if (purchaseOrder.purchaseCurrency === "EUR") {
    return `${purchaseOrder.totalInclTaxEUR?.toLocaleString("fr-FR") ?? "0"} €`;
  }

  if (purchaseOrder.purchaseCurrency === "TND") {
    return `${purchaseOrder.totalInclTaxTND?.toLocaleString("fr-FR") ?? "0"} TND`;
  }

  return `${purchaseOrder.totalInclTaxUSD?.toLocaleString("fr-FR") ?? "0"} $`;
}


export function PurchaseOrderTable({
  type,
  loading,
  purchaseOrders,
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
  onView,
  onEdit,
  onUpdateStatus,
  onSend,
  onDelete,
  getAllowedNextStatuses,
}: PurchaseOrderTableProps) {
  const isClientPurchaseOrder = type === "CLIENT";

  const partnerColumnLabel =
    type === "CLIENT" ? "Client" : "Fournisseur";

  const emptyMessage =
    type === "CLIENT"
      ? "Aucun bon de commande client trouvé."
      : "Aucun bon de commande fournisseur trouvé.";

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;
  return (
    <div className="overflow-hidden rounded-2xl mt-5 border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="bg-slate-50">
            <tr>
              {[
                "Référence",
                partnerColumnLabel,
                "Date",
                "Statut",
                "Montant TTC EUR",
                "Actions",
              ].map((column) => (
                <th
                  key={column}
                  className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-sm font-medium text-slate-500">
                  Chargement...
                </td>
              </tr>
            ) : purchaseOrders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-sm font-medium text-slate-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
                purchaseOrders.map((purchaseOrder) => {
                const canUpdateStatus =
                    getAllowedNextStatuses(purchaseOrder.purchaseOrderStatus).length > 0;

                const canDelete = purchaseOrder.purchaseOrderStatus === "DRAFT";

                const canSend = purchaseOrder.purchaseOrderStatus !== "DRAFT";

                return (
                    <tr
                    key={purchaseOrder.idPurchaseOrder}
                    className="transition-colors hover:bg-slate-50/70"
                    >
                    <td className="whitespace-nowrap px-5 py-4 text-center">
                        <span className="font-semibold tracking-tight text-slate-900">
                        {purchaseOrder.purchaseOrderNumber}
                        </span>
                    </td>

                    <td className="px-5 py-4 text-center">
                        <span className="font-medium text-slate-700">
                        {purchaseOrder.partner.name}
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
                        <div className="flex items-center justify-center gap-1.5">
                        <TableActionButton
                            title="Voir"
                            variant="blue"
                            icon={Eye}
                            onClick={() => onView(purchaseOrder)}
                        />

                        {isClientPurchaseOrder && (
                            <TableActionButton
                            title="Modifier"
                            variant="amber"
                            icon={Pencil}
                            onClick={() => onEdit?.(purchaseOrder)}
                            />
                        )}

                        <TableActionButton
                            title="Mettre à jour le statut"
                            variant="violet"
                            disabled={!canUpdateStatus}
                            icon={Settings}
                            onClick={() => onUpdateStatus(purchaseOrder)}
                        />

                        {isClientPurchaseOrder && (
                            <TableActionButton
                            title="Envoyer"
                            variant="emerald"
                            disabled={!canSend}
                            icon={Send}
                            onClick={() => onSend?.(purchaseOrder)}
                            />
                        )}

                        <TableActionButton
                            title="Supprimer"
                            variant="danger"
                            disabled={!canDelete}
                            icon={Trash2}
                            onClick={() => onDelete(purchaseOrder)}
                        />
                        </div>
                    </td>
                    </tr>
                );
                })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 0 && (
        <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={!canGoPrevious || loading}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, index) => {
                const page = index + 1;

                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => onPageChange(page)}
                    disabled={loading}
                    className={`h-8 min-w-8 rounded-lg px-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      currentPage === page
                        ? "bg-slate-900 text-white shadow-sm"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!canGoNext || loading}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {totalElements > 0 && (
            <p className="text-xs font-semibold text-slate-500">
              {totalElements} facture{totalElements > 1 ? "s" : ""}
            </p>
          )}
        </div>
      )}
    </div>
  );
}