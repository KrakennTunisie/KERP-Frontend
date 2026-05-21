"use client";

import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { ReactNode } from "react";

export type DataTableColumn<T> = {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
};

type DataTableProps<T> = {
  rows: T[];
  columns: DataTableColumn<T>[];
  getRowKey: (row: T) => string;

  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;

  isLoading?: boolean;
  emptyMessage?: string;

  totalCount?: number;
  countLabel?: (count: number) => string;

  containerClassName?: string;
};

export function DataTable<T>({
  rows,
  columns,
  getRowKey,
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  emptyMessage = "Aucune donnée trouvée.",
  totalCount,
  countLabel,
  containerClassName = "",
}: DataTableProps<T>) {
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm font-[Inter,system-ui,sans-serif] ${containerClassName}`}
    >
      {/* Count */}
      {typeof totalCount === "number" && (
        <div className="flex items-center justify-between border-b border-slate-100 bg-white px-5 py-3">
          <p className="text-xs font-semibold text-slate-500">
            {countLabel ? countLabel(totalCount) : `${totalCount} résultat(s)`}
          </p>
        </div>
      )}

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 ${
                    column.className ?? ""
                  }`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12">
                  <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                    <p className="text-sm font-semibold">
                      Chargement des données...
                    </p>
                  </div>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12">
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-6 text-center">
                    <p className="text-sm font-bold text-slate-500">
                      {emptyMessage}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Essayez de modifier vos filtres ou votre recherche.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={getRowKey(row)}
                  className="group transition-colors hover:bg-slate-50/70"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-5 py-3.5 align-middle ${
                        column.className ?? ""
                      }`}
                    >
                      {column.cell(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-medium text-slate-500">
            Page{" "}
            <span className="font-bold text-slate-800">{currentPage}</span> sur{" "}
            <span className="font-bold text-slate-800">{totalPages}</span>
          </p>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={!canGoPrevious || isLoading}
              onClick={() => onPageChange(currentPage - 1)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              title="Page précédente"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-1">
              {pages.map((page) => (
                <button
                  key={page}
                  type="button"
                  disabled={isLoading}
                  onClick={() => onPageChange(page)}
                  className={`h-8 min-w-8 rounded-lg px-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    currentPage === page
                      ? "bg-slate-900 text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={!canGoNext || isLoading}
              onClick={() => onPageChange(currentPage + 1)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              title="Page suivante"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}