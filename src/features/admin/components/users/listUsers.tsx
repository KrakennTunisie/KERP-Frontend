'use client'

import { useMemo } from "react";
import { Users, ShieldCheck, UserX, Plus } from "lucide-react";

import { UserTable } from "@/shared/components/widgets/usersDataTable";
import { UserFilterBar } from "@/shared/components/widgets/barFilter";

import { getUserRoleColor, getUserStatusColor, getUserStatusLabel } from "../../helpers/userHelpers";
import { useUsersList } from "../../hooks/useUsersList";
import {   USER_STATUS_OPTIONS, UserResponse } from "../../models/user";
import { ChangeUserRoleModal } from "./updateUserRole";
import {  UserStatusModal } from "./userStatusModal";
import PageLoader from "@/shared/components/ui/pageLoader";

export default function ListUsers() {


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

     fetchUsers,

     onCloseDeleteModal,
     onCloseUpdateModal,

     onOpenDeleteModal,
     onOpenUpdateModal,

     updateOpen,
     deleteOpen,
     selectedUser,

     roles,
     role, setRole
    }=useUsersList()



const activeUsers = useMemo(
  () => users.filter((u) => u.enabled === true).length,
  [users]
); 

 const blockedUsers = useMemo(
  () => users.filter((u) => u.enabled === false).length,
  [users]
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
              {totalElements}
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
            roleOptions={roles}
            selectedStatus={filtre}
            onStatusChange={setFiltre}
            statusOptions={USER_STATUS_OPTIONS}
            defaultRole="ALL"
            defaultStatus="ALL"
          />

        {/* TABLE */}
          <UserTable<UserResponse>
            items={users}
            variant="user"
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            totalElements={totalElements}
            onPageChange={setCurrentPage}
            onView={(u) => router.push(`/admin/users/${u.keycloakUserId}/details`)}
            onEdit={(u) =>router.push(`/admin/users/${u.keycloakUserId}/edit`)}
            onDelete={(u) => onOpenDeleteModal(u)}
            onManageRoles={(u) => onOpenUpdateModal(u)}
            getId={(u) => u.idUser}
            getFullName={(u) => `${u.firstName} ${u.lastName}`}
            getEmail={(u) => u.email}
            getRole={(u) => u.roles[0]}
            getStatus={(u) => getUserStatusLabel(u.status)}
            getRoleColor={(u) => getUserRoleColor(u.email)}
            getStatusColor={(u) => getUserStatusColor(u.status)}
            getCreatedAt={(u) => u.createdAt}
          />

          

      </div>
      {selectedUser && (
              <ChangeUserRoleModal
                open={updateOpen}
                user={selectedUser}
                roles={roles}
                currentRole={selectedUser.roles[0]}
                onClose={onCloseUpdateModal}
                onSuccess={() => {
                  // Refresh users
                  fetchUsers();
                }}
              />
            )}

        {selectedUser && (
          <UserStatusModal
            open={deleteOpen}
            user={selectedUser}
            onClose={onCloseDeleteModal}
            onSuccess={() => {
              fetchUsers();
            }}
          />
        )}
    </div>
  );
}