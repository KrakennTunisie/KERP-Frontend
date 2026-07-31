"use client";

import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { UserRowVariant, UserTableRow } from "./tableRow";


type UserTableProps<T> = {
  items: T[];

  variant: UserRowVariant;

  currentPage: number;
  totalPages: number;
  totalElements: number;

  loading?: boolean;

  onPageChange: (page: number) => void;

  onView: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onSendInvite?: (item: T) => void;
  onManageRoles?: (item: T) => void;

  getId: (item: T) => string;
  getFullName: (item: T) => string;
  getEmail: (item: T) => string;
  getRole?: (item: T) => string | null | undefined;
  getStatus?: (item: T) => string | null | undefined;
  getStatusColor?: (item: T) => string | null | undefined;
  getRoleColor?: (item: T) => string | null | undefined;
  getCreatedAt?: (item: T) => Date | undefined;

  emptyMessage?: string;
};

export function UserTable<T>({
  items,
  variant,

  currentPage,
  totalPages,
  totalElements,

  loading = false,

  onPageChange,

  onView,
  onEdit,
  onDelete,
  onSendInvite,
  onManageRoles,

  getId,
  getFullName,
  getEmail,
  getRole,
  getStatus,
  getStatusColor,
  getRoleColor,
  getCreatedAt,

  emptyMessage,
}: UserTableProps<T>) {

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const columns = [
    "Nom",
    "Email",
    "Rôle",
    "Statut",
    "Créé le",
    "Actions",
  ];

  const defaultEmptyMessage = "Aucun utilisateur trouvé.";

  return (
<div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm font-[Inter,system-ui,sans-serif]">

  {/* TABLE */}
  <div className="overflow-x-auto">
    <table className="w-full min-w-[900px] border-collapse">

      {/* HEADER */}
      <thead className="bg-slate-50/80">
        <tr>
          {columns.map((col) => (
            <th
              key={col}
              className="px-4 py-2.5 text-left text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-500"
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>

      {/* BODY */}
      <tbody className="divide-y divide-slate-100 text-sm">

        {/* LOADING */}
        {loading ? (
          <tr>
            <td colSpan={columns.length} className="px-4 py-10">
              <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <p className="text-xs font-medium">
                  Chargement...
                </p>
              </div>
            </td>
          </tr>

        ) :  items && items.length === 0 ? (

          /* EMPTY STATE */
          <tr>
            <td colSpan={columns.length} className="px-4 py-10">
              <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/60 p-5 text-center">
                <p className="text-xs font-medium text-slate-500">
                  {emptyMessage ?? defaultEmptyMessage}
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Ajustez vos filtres ou votre recherche.
                </p>
              </div>
            </td>
          </tr>

        ) : (
         items?.map((item) => (
            <UserTableRow<T>
              key={getId(item)}
              item={item}
              variant={variant}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              onSendInvite={onSendInvite}
              onManageRoles={onManageRoles}
              getId={getId}
              getFullName={getFullName}
              getEmail={getEmail}
              getRole={getRole}
              getStatus={getStatus}
              getStatusColor={getStatusColor}
              getRoleColor={getRoleColor}
              getCreatedAt={getCreatedAt}
            />
          ))
        )}

      </tbody>
    </table>
  </div>

  {/* PAGINATION */}
  {totalPages > 0 && (
    <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

      <div className="flex items-center gap-1">

        {/* PREV */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious || loading}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 disabled:opacity-40"
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
                onClick={() => onPageChange(page)}
                disabled={loading}
                className={`h-7 min-w-7 rounded-md px-2 text-[11px] font-semibold transition ${
                  currentPage === page
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-100"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* NEXT */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext || loading}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 disabled:opacity-40"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>

      </div>

      {/* TOTAL */}
      {totalElements > 0 && (
        <p className="text-[11px] font-medium text-slate-500">
          {totalElements} utilisateur{totalElements > 1 ? "s" : ""}
        </p>
      )}

    </div>
  )}
</div>
  );
}