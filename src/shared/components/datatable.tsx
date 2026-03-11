"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PageLoader from "./ui/pageLoader";

export type DataTableColumn<T> = {
  key: string;
  header: React.ReactNode;
  className?: string;
  cell: (row: T) => React.ReactNode;
  colSpan?: number;
};

type DataTableProps<T> = {
  rows: T[];
  columns: DataTableColumn<T>[];
  getRowKey: (row: T, index: number) => string;

  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;

  showPagination?: boolean;
  isLoading?: boolean;
  emptyMessage?: string;

  countLabel?: (count: number) => string;
  totalCount?: number;

  containerClassName?: string;
};

export function DataTable<T>({
  rows,
  columns,
  getRowKey,
  currentPage,
  totalPages,
  onPageChange,
  showPagination = true,
  isLoading = false,
  emptyMessage = "Aucun élément.",
  countLabel,
  totalCount,
  containerClassName,
}: DataTableProps<T>) {
  const colspan = columns.length;

  const goToPage = (page: number) => {
    const safePage = Math.max(1, Math.min(totalPages, page));
    if (safePage !== currentPage) {
      onPageChange(safePage);
    }
  };

  return (
    <div
      className={
        containerClassName ??
        "bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden"
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`text-left px-8 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest ${
                    col.className ?? ""
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr>
                <td
                  className="px-8 py-10 text-sm font-bold text-gray-500"
                  colSpan={colspan}
                >
                  <PageLoader label="Chargement..."/>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  className="px-8 py-10 text-sm font-bold text-gray-500"
                  colSpan={colspan}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => (
                <tr
                  key={getRowKey(row, idx)}
                  className="group hover:bg-gray-50/50 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-8 py-6 ${col.className ?? ""}`}
                      colSpan={col.colSpan}
                    >
                      {col.cell(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showPagination && totalPages > 0 && (
        <div className="px-8 py-8 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm"
            >
              <ChevronLeft className="w-4 h-4 text-gray-900" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => {
                const page = i + 1;

                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    disabled={isLoading}
                    className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${
                      currentPage === page
                        ? "bg-gray-900 text-white shadow-lg"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    } disabled:opacity-50`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
              className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm"
            >
              <ChevronRight className="w-4 h-4 text-gray-900" />
            </button>
          </div>

          {countLabel && (
            <p className="text-xs font-bold text-gray-500">
              {countLabel(totalCount ?? rows.length)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}