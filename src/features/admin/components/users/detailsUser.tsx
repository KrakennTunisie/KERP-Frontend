"use client";

import { formatDateLong } from "@/shared/utils/formatDate";
import {
  Phone,
  Calendar,
  UserX,
  ShieldCheck,
  Pencil,
  Send,
  UserCog,
  UserCheck,
} from "lucide-react";
import { ActionMenu, ActionMenuItem } from "@/shared/components/ui/actionMenuItem";
import ActivityHeatmap from "../../widgets/activityHeatMap";
import PermissionsMatrix from "../../widgets/permissionsMatrix";
import AuditLogs from "../../widgets/auditLogs";
import PageLoader from "@/shared/components/ui/pageLoader";
import { userProps } from "./userForm";
import useUserDetails from "../../hooks/useUserDetails";
import { NotFound } from "@/shared/components/widgets/notFound";
import {  UserResponse, UserStatusSchema } from "../../models/user";
import { getUserStatusColor, getUserStatusLabel } from "../../helpers/userHelpers";
import { ChangeUserRoleModal } from "./updateUserRole";
import { UserStatusModal } from "./userStatusModal";
import { SendEmailModal } from "@/shared/components/widgets/sendEmailModal";
import { getActiveDuration } from "@/shared/utils/durationGap";

/* ================= SKELETON ================= */

function UserSkeleton() {
  return (
    <div className="p-6 animate-pulse space-y-4">
      <div className="h-5 w-36 bg-slate-200 rounded" />
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4 space-y-3">
          <div className="h-44 bg-slate-200 rounded-xl" />
          <div className="h-32 bg-slate-200 rounded-xl" />
          <div className="h-24 bg-slate-200 rounded-xl" />
        </div>
        <div className="col-span-8 h-80 bg-slate-200 rounded-xl" />
      </div>
    </div>
  );
}

/* ================= PAGE ================= */



export default  function UserDetailsPage({params}:userProps) {

  const {idUser} =  params

  const { 
      user, 
      totalActions,
      loading,
      router,
    
      updateStatusOpen, setUpdateStatusOpen,
      activeOpen, setActiveOpen,
      sendOpen, setSendOpen, getUserById
    } = useUserDetails({idUser})

   if (loading) 
    return (
        <PageLoader label="Chargement..." />
  
      ) 
   if(!user){
    return(
      <NotFound resource="Utilisateur" message="Utilisateur introuvable"/>
    )
   }

    const isActive = user.status === UserStatusSchema.enum.ACTIVE;
    const activeDays = getActiveDuration(user.createdAt)

    const actions: ActionMenuItem[] = [
            {
              label: "Modifier",
              icon: Pencil,
              color: "text-amber-600",
              hover: "hover:bg-amber-50",
              onClick: () =>router.push(`/admin/users/${user.keycloakUserId}/edit`),
              visible: true
            },{
              label: "Envoyer email",
              icon: Send,
              color: "text-blue-600",
              hover: "hover:bg-blue-50",
              onClick: ()=> setSendOpen(true),
              visible: true
            },
            {
              label: "Modifier rôle",
              icon: UserCog,
              color: "text-violet-600",
              hover: "hover:bg-violet-50",
              onClick: ()=> setUpdateStatusOpen(true),
              visible: true
            },
            {
              label: isActive ? "Désactiver" : "Activer",
              icon: isActive ? UserX : UserCheck,
              color: isActive
                ? "text-rose-600"
                : "text-emerald-600",
              hover: isActive
                ? "hover:bg-rose-50"
                : "hover:bg-emerald-50",
              onClick: () => setActiveOpen(true),
              visible: true,
        }]

  return (
    <div className="min-h-screen p-4 md:p-6">

      {/* HEADER */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Détails utilisateur
          </h1>
          <p className="text-[13px] text-slate-500 mt-0.5">
            Gestion complète du profil
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-1.5">
            <span
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                getUserStatusColor(user.status)
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${
                getUserStatusColor(user.status)
              }`} />
              {getUserStatusLabel(user.status) /* user.status === "ACTIVE" ? "Actif" : user.status */}
            </span>

            {user.roles.map((role)=>(
              <span
                  key={role.id} 
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700">
                <ShieldCheck className="h-3 w-3" />
                {role.name}
              </span>
            ))}
            <div className="flex gap-1.5">
            <ActionMenu
                    orientation="horizontal"
                    items={actions}
                  />
          </div>
          </div>

          
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* LEFT */}
        <div className="lg:col-span-4 space-y-3">

          {/* PROFILE CARD */}
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="h-11 w-11 rounded-xl bg-blue-50 flex items-center justify-center text-[13px] font-semibold text-blue-700 flex-shrink-0">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div className="min-w-0">
                <p className="text-[14px] font-medium text-slate-900 truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-[12px] text-slate-500 truncate">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="pt-4 space-y-2.5">
              <div className="flex items-center gap-2 text-[12px] text-slate-500">
                <Phone className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                {user.phoneNumber}
              </div>
              <div className="flex items-center gap-2 text-[12px] text-slate-500">
                <Calendar className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                Membre depuis {formatDateLong(user.createdAt)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-[10px] text-slate-400">Actions (30j)</p>
                <p className="text-lg font-semibold text-slate-900 mt-0.5">
                  {totalActions}
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-[10px] text-slate-400">Jours actifs</p>
                <p className="text-lg font-semibold text-slate-900 mt-0.5">
                  {activeDays}
                </p>
              </div>
            </div>
          </div>

          <ActivityHeatmap userId={idUser} />
          <PermissionsMatrix permissions={user.roles[0].permissions} />
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-8">
          <AuditLogs userId={idUser} />
        </div>

      </div>

      {user && (
        <ChangeUserRoleModal
          open={updateStatusOpen}
          user={user as unknown as UserResponse}
          currentRole={user.roles[0].name}
          onClose={()=>setUpdateStatusOpen(false)}
          onSuccess={() => {
            getUserById();
          }}
        />
      )}
      
      {user && (
        <UserStatusModal
          open={activeOpen}
          user={user as unknown as UserResponse}
          onClose={()=>setActiveOpen(false)}
          onSuccess={() => {
            getUserById();
          }}
        />
      )}

      {user && (
        <SendEmailModal
        isOpen={sendOpen}
        onClose={() => setSendOpen(false)}
        defaultTo={user.email}
        recipientName={user.firstName+" "+user.lastName}
        />
      )}
    </div>
  );
}