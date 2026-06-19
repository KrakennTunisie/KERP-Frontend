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
  className={`overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm ${containerClassName}`}
>
  {/* Count */}
  {typeof totalCount === "number" && (
    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2">
      <p className="text-[11px] font-semibold text-slate-500">
        {countLabel
          ? countLabel(totalCount)
          : `${totalCount} résultat(s)`}
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
              className={`px-4 py-2 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 ${
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
            <td colSpan={columns.length} className="px-4 py-10">
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <p className="text-xs font-semibold">
                  Chargement...
                </p>
              </div>
            </td>
          </tr>
        ) : rows.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="px-4 py-10">
              <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-center">
                <p className="text-xs font-semibold text-slate-500">
                  {emptyMessage}
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Ajustez vos filtres
                </p>
              </div>
            </td>
          </tr>
        ) : (
          rows.map((row) => (
            <tr
              key={getRowKey(row)}
              className="transition-colors hover:bg-slate-50/60"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`px-4 py-2.5 text-xs text-slate-700 ${
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
    <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

      <p className="text-[11px] font-medium text-slate-500">
        Page <span className="font-bold text-slate-800">{currentPage}</span> /{" "}
        <span className="font-bold text-slate-800">{totalPages}</span>
      </p>

      <div className="flex items-center gap-1">

        <button
          type="button"
          disabled={!canGoPrevious || isLoading}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>

        {pages.map((page) => (
          <button
            key={page}
            type="button"
            disabled={isLoading}
            onClick={() => onPageChange(page)}
            className={`h-7 min-w-7 rounded-md px-2 text-[11px] font-semibold transition ${
              currentPage === page
                ? "bg-slate-900 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          disabled={!canGoNext || isLoading}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>

      </div>
    </div>
  )}
</div>
  );
}