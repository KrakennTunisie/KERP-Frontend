'use client'

import { useMemo, useState } from "react";
import { Plus, Key, FolderKanban, ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";

import { mockPermissions, Permission, PermissionCategory } from "../../mocks/mock-permission";
import { getCategoryLabel } from "../../helpers/categoryHelper";
import { PermissionDetailsModal } from "../../widgets/permissionDetailsModal";

export default function ListPermissions() {

const groupedPermissions = useMemo(() => {
  return Object.entries(
    mockPermissions.reduce((acc, permission) => {

      if (!acc[permission.category]) {
        acc[permission.category] = [];
      }

      acc[permission.category].push(permission);

      return acc;

    }, {} as Record<PermissionCategory, Permission[]>)
  );



}, []);

const ITEMS_PER_PAGE = 3;

const [currentPage, setCurrentPage] = useState(1);

const totalPages = Math.ceil(
  groupedPermissions.length / ITEMS_PER_PAGE
);

const paginatedCategories = useMemo(() => {

  const start = (currentPage - 1) * ITEMS_PER_PAGE;

  return groupedPermissions.slice(
    start,
    start + ITEMS_PER_PAGE
  );

}, [groupedPermissions, currentPage]);

const [detailsOpen, setDetailsOpen] = useState(false);
const [selectedPermission, setSelectedPermission] =
  useState<Permission | null>(null);

  return (
<div className="min-h-screen bg-gray-50">
  <div className="mx-auto px-6 py-6">

    {/* HEADER */}
    <div className="mb-6 flex items-center justify-between">

      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Gestion des permissions
        </h1>

        <p className="mt-1 text-xs text-slate-500">
          Gérez toutes les permissions du système.
        </p>
      </div>

      <button className="cursor-pointer inline-flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-4 text-xs font-semibold text-white hover:bg-slate-800">
        <Plus className="h-4 w-4" />
        Nouvelle permission
      </button>

    </div>

    {/* STATS */}
    <div className="mb-6 grid gap-3 md:grid-cols-2">

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50">
          <Key className="h-4 w-4 text-blue-600" />
        </div>

        <p className="text-xs text-slate-500">Total permissions</p>
        <h2 className="text-2xl font-bold text-slate-900">
          {mockPermissions.length}
        </h2>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
          <FolderKanban className="h-4 w-4 text-blue-600" />
        </div>

        <p className="text-xs text-slate-500">Catégories</p>
        <h2 className="text-2xl font-bold text-slate-900">
          {Object.keys(groupedPermissions).length}
        </h2>
      </div>

    </div>

    {/* GRID CATEGORIES */}
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

      {paginatedCategories.map(([category, permissions]) => (
        <div
          key={category}
          className="
            group rounded-2xl
            border border-slate-200
            bg-white
            p-5
            shadow-sm
            transition
            hover:shadow-md
          "
        >

          {/* HEADER */}
          <div className="mb-4 flex items-start justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
              </div>

              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  {getCategoryLabel(category)}
                </h2>

                <p className="text-xs text-slate-500">
                  {permissions.length} permissions
                </p>
              </div>

            </div>

            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
              {permissions.length}
            </span>

          </div>

          {/* PERMISSIONS */}
          <div className="flex flex-wrap gap-2">

            {permissions.map((permission) => (
              <div
                key={permission.key}
                onClick={() => {
                  setSelectedPermission(permission);
                  setDetailsOpen(true);
                }}
                className="
                  cursor-pointer
                  rounded-lg
                  border border-slate-200
                  bg-slate-50
                  px-2.5 py-1.5
                  transition
                  hover:border-blue-200
                  hover:bg-blue-50
                "
              >
                <p className="text-[11px] font-semibold text-slate-800">
                  {permission.label}
                </p>

                <p className="text-[10px] text-slate-400">
                  {permission.key}
                </p>
              </div>
            ))}

          </div>

        </div>
      ))}

    </div>

    {/* PAGINATION */}
    {totalPages > 0 && (
      <div className="mt-5 flex flex-col gap-2 border-t border-slate-100 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-1">

          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, index) => {
              const page = index + 1;

              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-7 min-w-7 rounded-lg px-2 text-[11px] font-semibold ${
                    currentPage === page
                      ? "bg-slate-900 text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>

        </div>

        <p className="text-[11px] font-medium text-slate-500">
          {paginatedCategories.length} catégorie(s)
        </p>

      </div>
    )}

  </div>

  <PermissionDetailsModal
    open={detailsOpen}
    permission={selectedPermission}
    onClose={() => setDetailsOpen(false)}
  />
</div>
  );
}