// src/shared/components/DataTable.tsx
"use client";

import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type DataTableColumn<T> = {
  key: string;
  header: React.ReactNode;
  className?: string; // th/td alignment (e.g. "text-center")
  cell: (row: T) => React.ReactNode;
  colSpan?: number; // rarely needed
};

type DataTableProps<T> = {
  rows: T[];
  columns: DataTableColumn<T>[];
  getRowKey: (row: T, index: number) => string;

  // Pagination
  pageSize?: number;
  initialPage?: number;
  showPagination?: boolean;

  // Empty state
  emptyMessage?: string;

  // Footer count label (optional)
  countLabel?: (count: number) => string;

  // Styling hooks (optional)
  containerClassName?: string;
};

export function DataTable<T>({
  rows,
  columns,
  getRowKey,
  pageSize = 3,
  initialPage = 1,
  showPagination = true,
  emptyMessage = "Aucun élément.",
  countLabel,
  containerClassName,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(rows.length / pageSize));
  }, [rows.length, pageSize]);

  // keep currentPage valid if data changes
  const safePage = Math.min(currentPage, totalPages);

  const paginatedRows = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, safePage, pageSize]);

  const colspan = columns.length;

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
            {paginatedRows.map((row, idx) => (
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
            ))}

            {paginatedRows.length === 0 && (
              <tr>
                <td
                  className="px-8 py-10 text-sm font-bold text-gray-500"
                  colSpan={colspan}
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <div className="px-8 py-8 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm"
            >
              <ChevronLeft className="w-4 h-4 text-gray-900" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${
                    safePage === i + 1
                      ? "bg-gray-900 text-white shadow-lg"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm"
            >
              <ChevronRight className="w-4 h-4 text-gray-900" />
            </button>
          </div>

          {countLabel && (
            <p className="text-xs font-bold text-gray-500">
              {countLabel(rows.length)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}