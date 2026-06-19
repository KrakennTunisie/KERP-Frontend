'use client'

import { useMemo, useState } from "react";
import { Plus, ShieldCheck, Key, ChevronLeft, ChevronRight } from "lucide-react";

import { mockRoles, Role } from "../../mocks/mock-roles";
import { RoleCard } from "../../widgets/roleCard";
import { AddPermissionModal } from "../../widgets/addPermissionModal";
import { mockPermissions, Permission } from "../../mocks/mock-permission";
import { appToast } from "@/shared/lib/toast";
import RevokePermissionModal from "../../widgets/revokePermissionModal";

export default function RolesPage() {

  const totalElements = mockRoles.length;

  const totalPermissions = useMemo(
    () => mockRoles.reduce((acc, r) => acc + r.permissions.length, 0),
    []
  );

  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 3;

  const totalPages = Math.ceil(mockRoles.length / ITEMS_PER_PAGE);

  const paginatedRoles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;

    return mockRoles.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage]);

  const [modalOpen, setModalOpen] =useState(false)
  const [selectedRole, setSelectedRole] =useState<Role>()
  const [revokeModalOpen, setRevokeModalOpen] = useState(false);

  const [selectedPermission, setSelectedPermission] =
    useState<Permission | null>(null);

  const handleAddPermission = ()=>{
    console.log("added Succesfully")
    appToast.success("added Succesfully")
  }

  const handleRevokePermission = ()=>{
    if(!selectedPermission || ! selectedRole) return;
    console.log("revoked Succesfully")
    appToast.success("revoked Succesfully")
    setRevokeModalOpen(false)
  }

  return (
<div className="min-h-screen">
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

      <button className="cursor-pointer inline-flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-4 text-xs font-semibold text-white hover:bg-slate-800">
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
          {totalPermissions}
        </h2>
      </div>
    </div>

    {/* GRID ROLES */}
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {paginatedRoles.map((role) => (
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
      open={modalOpen}
      rolePermissions={selectedRole.permissions}
      allPermissions={mockPermissions}
      onClose={() => setModalOpen(false)}
      onSubmit={handleAddPermission}
    />
  )}

  {selectedPermission && selectedRole && (
    <RevokePermissionModal
      revokeModalOpen={revokeModalOpen}
      selectedPermission={selectedPermission}
      selectedRole={selectedRole}
      onClose={() => setRevokeModalOpen(false)}
      onSubmit={handleRevokePermission}
    />
  )}
</div>
  );
}