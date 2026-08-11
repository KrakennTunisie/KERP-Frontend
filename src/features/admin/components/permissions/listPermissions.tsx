'use client'

import { Key, FolderKanban, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import { PermissionDetailsModal } from "../../widgets/permissionDetailsModal";
import CategoryCard from "../../widgets/categoryCard";
import { usePermissionsList } from "../../hooks/usePermissionsList";

export default function ListPermissions() {

  const {
        loading,
        permissions,
        currentPage,
        setCurrentPage,
        totalElements,
        totalPages,
      detailsOpen, setDetailsOpen,
      selectedPermission, setSelectedPermission} = usePermissionsList()


  return (
      <div className="bg-gray-50">
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

          </div>

          {/* STATS */}
          <div className="mb-6 grid gap-3 md:grid-cols-2">

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50">
                <Key className="h-4 w-4 text-blue-600" />
              </div>

              <p className="text-xs text-slate-500">Total permissions</p>
              <h2 className="text-2xl font-bold text-slate-900">
                {totalElements}
              </h2>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
                <FolderKanban className="h-4 w-4 text-blue-600" />
              </div>

              <p className="text-xs text-slate-500">Catégories</p>
              <h2 className="text-2xl font-bold text-slate-900">
                {totalElements}
              </h2>
            </div>

          </div>

          {/* GRID CATEGORIES */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            {loading ? (
              <div className="col-span-full flex min-h-[300px] flex-col items-center justify-center gap-2 text-slate-400">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                <p className="text-xs font-medium">
                  Chargement...
                </p>
              </div>
            ) : permissions && permissions.length === 0 ? (
              /* EMPTY STATE */
              <div className="col-span-full flex min-h-[300px] items-center justify-center">
                <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/60 p-5 text-center">
                  <p className="text-xs font-medium text-slate-500">
                    Aucun rôle à afficher
                  </p>
                </div>
              </div>
            ) : (permissions.map((permission) => (
              <CategoryCard 
                key={permission.clientId}
                category={permission} 
                permissions={permission.permissions} 
                setSelectedPermission={setSelectedPermission} 
                setOpen={setDetailsOpen }   
              />
            )))}

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
                {permissions.length} catégorie(s)
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