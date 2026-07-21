'use client'


import { Plus, ShieldCheck, Key, ChevronLeft, ChevronRight } from "lucide-react";

import { RoleCard } from "../../widgets/roleCard";
import { AddPermissionModal } from "../../widgets/affectPermissionModal";

import RevokePermissionModal from "../../widgets/revokePermissionModal";
import AddRoleModal from "./addRoleModal";
import { usePermissionsList } from "../../hooks/usePermissionsList";

import { useRolesList } from "../../hooks/useRolesList";
import { useCreateRole } from "../../hooks/useCreateRole";

export default function RolesPage() {

    const {
        roles,
        currentPage,
        setCurrentPage,
        totalElements,
        totalPages,
      detailsOpen, setDetailsOpen,
      fetchRoles
      } = useRolesList()


  const {permissions}=usePermissionsList()
  
  const {
    affectForm,
    form,
    refreshRole,
    createModalOpen,
    setCreateModalOpen,
    selectedRole,
    setSelectedRole,
    selectedPermission,
    setSelectedPermission,
    revokeModalOpen,
    setRevokeModalOpen,
    handleAddPermission,
    handleRevokePermission,
    onSubmit,
    modalOpen,
    setModalOpen,
    loadingForm, loadingAddPermission, loadingRevokePermission,
  } = useCreateRole({fetchRoles})

  return (
      <div >
        <div className="mx-auto px-6 py-6">

          {/* HEADER */}
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Gestion des rôles
              </h1>

              <p className="mt-1 text-xs text-slate-500">
                Gérez les rôles et leurs permissions système.
              </p>
            </div>

            <button 
              onClick={()=>setCreateModalOpen(true)}
              className="cursor-pointer inline-flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-4 text-xs font-semibold text-white hover:bg-slate-800">
              <Plus className="h-4 w-4" />
              Nouveau rôle
            </button>
          </div>

          {/* STATS */}
          <div className="mb-5 grid gap-3 md:grid-cols-2">

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
              </div>

              <p className="text-xs text-slate-500">Total rôles</p>
              <h2 className="text-2xl font-bold text-slate-900">
                {totalElements}
              </h2>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50">
                <Key className="h-4 w-4 text-violet-600" />
              </div>

              <p className="text-xs text-slate-500">Permissions totales</p>
              <h2 className="text-2xl font-bold text-slate-900">
                {totalElements}
              </h2>
            </div>
          </div>

          {/* GRID ROLES */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {roles.map((role) => (
              <RoleCard
                key={role.id}
                role={role}
                setModalOpen={setModalOpen}
                setSelectedRole={setSelectedRole}
                setSelectedPermission={setSelectedPermission}
                seRevokePermissionModalOpen={setRevokeModalOpen}
              />
            ))}
          </div>

          {/* PAGINATION */}
          {totalPages > 0 && (
            <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between mt-4">

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
                        className={`h-7 min-w-7 rounded-lg px-2 text-[11px] font-semibold transition ${
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
                {totalElements} rôle{totalElements > 1 ? "s" : ""}
              </p>

            </div>
          )}

        </div>

        {selectedRole && (
          <AddPermissionModal
          form={affectForm}
            loading={loadingAddPermission}
            open={modalOpen}
            rolePermissions={selectedRole.permissions}
            allPermissions={permissions}
            onClose={() => setModalOpen(false)}
            onSubmit={handleAddPermission}
          />
        )}

        {selectedPermission && selectedRole && (
          <RevokePermissionModal
            loading={loadingRevokePermission}
            revokeModalOpen={revokeModalOpen}
            selectedPermission={selectedPermission}
            selectedRole={selectedRole}
            onClose={() => setRevokeModalOpen(false)}
            onSubmit={handleRevokePermission}
          />
        )}
        <AddRoleModal 
          loading={loadingForm}
          form={form}
          mode={"create"} 
          open={createModalOpen} 
          onClose={()=>{setCreateModalOpen(false); setSelectedRole(null)}} 
          onSave={onSubmit} 
          permissions={permissions}
          />
        
      </div>
  );
}