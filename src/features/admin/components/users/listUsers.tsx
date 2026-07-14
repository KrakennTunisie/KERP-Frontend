'use client'

import { useMemo, useState } from "react";
import { Users, ShieldCheck, UserX, Plus } from "lucide-react";

import { UserTable } from "@/shared/components/widgets/usersDataTable";
import { UserFilterBar } from "@/shared/components/widgets/barFilter";

import {
  mockUsers,
  User,
  USER_ROLE_OPTIONS,
  USER_STATUS_OPTIONS,
} from "../../mocks/mock-users";
import { getUserRoleColor, getUserRoleLabel, getUserStatusColor, getUserStatusLabel } from "../../helpers/userHelpers";
import { useUsersList } from "../../hooks/useUsersList";

export default function ListUsers() {
  const [role, setRole] = useState("ALL");
  const [status, setStatus] = useState("ALL");

  const {
     router,
     search,
     setSearch,
     filtre,
     setFiltre,
     users,
     currentPage,
     setCurrentPage,
     totalElements,
     totalPages,
     loading,
  }=useUsersList()

  const totalUsers = mockUsers.length;

  const activeUsers = useMemo(
    () => mockUsers.filter((u) => u.status === "ACTIVE").length,
    []
  );

  const blockedUsers = useMemo(
    () => mockUsers.filter((u) => u.status === "BLOCKED").length,
    []
  );

  return (
<div className="min-h-screen">
  <div className="mx-auto px-5 py-6">

    {/* HEADER */}
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Gestion des utilisateurs
        </h1>

        <p className="mt-1 text-xs text-slate-500">
          Comptes, rôles et permissions utilisateurs.
        </p>
      </div>

      <button 
      onClick={()=> router.push(`/admin/users/new`)}
      className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white transition hover:bg-slate-800">
        <Plus className="h-4 w-4" />
        Ajouter un utilisateur
      </button>
    </div>

    {/* STATS */}
    <div className="mb-5 grid gap-3 md:grid-cols-3">

      {/* TOTAL */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
          <Users className="h-4 w-4 text-blue-600" />
        </div>

        <p className="text-xs text-slate-500">Total utilisateurs</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-900">
          {totalUsers}
        </h2>
      </div>

      {/* ACTIVE */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
        </div>

        <p className="text-xs text-slate-500">Utilisateurs actifs</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-900">
          {activeUsers}
        </h2>
      </div>

      {/* BLOCKED */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50">
          <UserX className="h-4 w-4 text-rose-600" />
        </div>

        <p className="text-xs text-slate-500">Comptes bloqués</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-900">
          {blockedUsers}
        </h2>
      </div>
    </div>

    {/* FILTERS */}
      <UserFilterBar
        search={search}
        onSearchChange={setSearch}
        selectedRole={role}
        onRoleChange={setRole}
        roleOptions={USER_ROLE_OPTIONS}
        selectedStatus={status}
        onStatusChange={setStatus}
        statusOptions={USER_STATUS_OPTIONS}
        defaultRole="ALL"
        defaultStatus="ALL"
      />

    {/* TABLE */}
      <UserTable<User>
        items={users}
        variant="user"
        currentPage={1}
        totalPages={1}
        totalElements={mockUsers.length}
        onPageChange={() => {}}
        onView={(u) => router.push(`/admin/users/${u.id}/details`)}
        onEdit={(u) =>router.push(`/admin/users/${u.id}/edit`)}
        onDelete={(u) => console.log(u)}
        onManageRoles={(u) => console.log(u)}
        getId={(u) => u.id}
        getFullName={(u) => `${u.firstName} ${u.lastName}`}
        getEmail={(u) => u.email}
        getRole={(u) => getUserRoleLabel(u.role)}
        getStatus={(u) => getUserStatusLabel(u.status)}
        getRoleColor={(u) => getUserRoleColor(u.role)}
        getStatusColor={(u) => getUserStatusColor(u.status)}
        getCreatedAt={(u) => u.createdAt}
      />

  </div>
</div>
  );
}