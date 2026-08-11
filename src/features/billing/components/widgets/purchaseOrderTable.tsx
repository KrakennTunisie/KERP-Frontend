import {
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { PurchaseOrderPageItem } from "../../models/purchaseOrder";
import { purchaseOrderStatus } from "../../types/purchaseOrderStatus";
import { PurchaseOrderRow } from "./purchaseOrderRaw";

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
  onArchive: (purchaseOrder: PurchaseOrderPageItem) => void;

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
  onArchive,
  getAllowedNextStatuses,
}: PurchaseOrderTableProps) {
  const isSupplierPurchaseOrder = type === "SUPPLIER";

  const partnerColumnLabel =
    type === "CLIENT" ? "Client" : "Fournisseur";

  const emptyMessage =
    type === "CLIENT"
      ? "Aucun bon de commande client trouvé."
      : "Aucun bon de commande fournisseur trouvé.";

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;
  return (
<div className="overflow-hidden rounded-2xl mt-4 border border-slate-200 bg-white shadow-sm">
     <div className="overflow-x-auto">
        <table className="w-full min-w-[780px] text-xs">
          <thead className="bg-slate-50">
            <tr>
              {[
                "Référence",
                partnerColumnLabel,
                "Date",
                "Statut",
                "Montant TTC",
                "Actions",
              ].map((column) => (
                <th
                  key={column}
                  className="px-4 py-2.5 text-center text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500"
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
                purchaseOrders.map((purchaseOrder) => (
                    <PurchaseOrderRow
                        key={purchaseOrder.idPurchaseOrder}
                        purchaseOrder={purchaseOrder}
                        isSupplierPurchaseOrder={isSupplierPurchaseOrder}
                        onView={onView}
                        onEdit={onEdit}
                        onSend={onSend}
                        onArchive={(purchaseOrder) => onArchive(purchaseOrder)}
                        onUpdateStatus={onUpdateStatus}
                        onDelete={onDelete}
                        getAllowedNextStatuses={getAllowedNextStatuses}
                        formatPurchaseOrderAmount={formatPurchaseOrderAmount}
                    />
                    ))
            )}
          </tbody>
        </table>
      </div>

       {/* PAGINATION */}
  {totalPages > 0 && (
    <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

      <div className="flex items-center gap-1">

        {/* PREV */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious || loading}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>

        {/* PAGES */}
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }).map((_, index) => {
            const page = index + 1;

            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                disabled={loading}
                className={`h-7 min-w-7 rounded-md px-2 text-[11px] font-bold transition ${
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

        {/* NEXT */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext || loading}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>

      </div>

      {/* TOTAL */}
      {totalElements > 0 && (
        <p className="text-[11px] font-semibold text-slate-500">
          {totalElements} Bon de commande{totalElements > 1 ? "s" : ""}
        </p>
      )}

    </div>
  )}
    </div>
  );
}