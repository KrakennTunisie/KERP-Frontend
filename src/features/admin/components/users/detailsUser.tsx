"use client";

import { mockPermissions } from "../../mocks/mock-permission";
import { AuditLog, mockAuditLogs } from "@/features/billing/models/AuditLogs";
import { formatDateLong } from "@/shared/utils/formatDate";
import { mockUsers, User } from "../../mocks/mock-users";
import {
  Phone,
  Calendar,
  UserX,
  ShieldCheck,
  Pencil,
  Send,
  UserCog,
  UserCheck,
  UserMinus,
} from "lucide-react";
import { ActionMenu, ActionMenuItem } from "@/shared/components/ui/actionMenuItem";
import ActivityHeatmap, { HeatmapItem, mockHeatmap } from "../../widgets/activityHeatMap";
import PermissionsMatrix from "../../widgets/permissionsMatrix";
import AuditLogs from "../../widgets/auditLogs";
import PageLoader from "@/shared/components/ui/pageLoader";

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

export default function UserDetailsPage({
  user = mockUsers[0],
  logs = mockAuditLogs,
  heatmap = mockHeatmap,
  loading,
}: {
  user: User;
  logs: AuditLog[];
  heatmap: HeatmapItem[];
  loading?: boolean;
}) {
  if (loading) 
    return (
        <PageLoader label="Chargement..." />
  
      )

  const totalActions = heatmap.reduce((s, d) => s + d.count, 0);
  const activeDays = heatmap.filter((d) => d.count > 0).length;

    const actions: ActionMenuItem[] = [
            {
              label: "Modifier",
              icon: Pencil,
              color: "text-amber-600",
              hover: "hover:bg-amber-50",
              onClick: ()=> console.log('onUpdate'),
              visible: true
            },{
              label: "Envoyer email",
              icon: Send,
              color: "text-blue-600",
              hover: "hover:bg-blue-50",
              onClick: ()=> console.log('onSendEmail'),
              visible: true
            },
            {
              label: "Modifier rôle",
              icon: UserCog,
              color: "text-violet-600",
              hover: "hover:bg-violet-50",
              onClick: ()=> console.log('onUpdateRole'),
              visible: true
            },
            {
                  label: "Désactiver",
                  icon: UserX,
                  color: "text-rose-600",
                  hover: "hover:bg-rose-50",
                  onClick: ()=> console.log('onUpdateStatus'),
                  visible: true
              },
              {
                label: "Activer",
                icon: UserCheck,
                color: "text-emerald-600",
                hover: "hover:bg-emerald-50",
                onClick: ()=> console.log('onUpdateStatus'),
                visible: true
              },
            {
              label: "Supprimer",
              icon: UserMinus,
              color: "text-red-600",
              hover: "hover:bg-red-50",
              onClick: ()=> console.log('onDeelete'),
              visible: true
            },
          ]

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
                user.status === "ACTIVE"
                  ? "bg-green-50 text-green-700"
                  : user.status === "INACTIVE"
                  ? "bg-slate-100 text-slate-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${
                user.status === "ACTIVE" ? "bg-green-500" : "bg-slate-400"
              }`} />
              {user.status === "ACTIVE" ? "Actif" : user.status}
            </span>

            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700">
              <ShieldCheck className="h-3 w-3" />
              {user.role}
            </span>
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
                {user.phone}
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

          <ActivityHeatmap data={heatmap} />
          <PermissionsMatrix permissions={mockPermissions} />
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-8">
          <AuditLogs logs={logs} />
        </div>

      </div>
    </div>
  );
}