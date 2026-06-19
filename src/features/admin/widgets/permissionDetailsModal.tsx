"use client";

import { Modal } from "@/shared/components/ui/modal";
import { Permission } from "../mocks/mock-permission";
import { Shield, Tag, KeyRound } from "lucide-react";
import { getCategoryLabel } from "../helpers/categoryHelper";

type PermissionDetailsModalProps = {
  open: boolean;
  permission: Permission | null;
  onClose: () => void;
};

export function PermissionDetailsModal({
  open,
  permission,
  onClose,
}: PermissionDetailsModalProps) {
  if (!permission) return null;

  return (
    <Modal
      open={open}
      title="Détails de la permission"
      onClose={onClose}
      footer={
        <button
          onClick={onClose}
          className="
            cursor-pointer
            h-10 rounded-xl border px-5 text-sm font-semibold
            text-slate-700 hover:bg-slate-50
          "
        >
          Fermer
        </button>
      }
    >
      {/* HEADER CARD */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-lg font-bold text-slate-900">
              {permission.label}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {permission.description}
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
            <Shield className="h-5 w-5 text-blue-600" />
          </div>
        </div>
      </div>

      {/* DETAILS GRID */}
      <div className="grid gap-3 sm:grid-cols-2">

        {/* KEY */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-slate-500">
            <KeyRound className="h-4 w-4" />
            <span className="text-xs font-semibold">Clé</span>
          </div>

          <p className="mt-2 font-mono text-sm font-semibold text-slate-800">
            {permission.key}
          </p>
        </div>

        {/* CATEGORY */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-slate-500">
            <Tag className="h-4 w-4" />
            <span className="text-xs font-semibold">Catégorie</span>
          </div>

          <p className="mt-2 text-sm font-semibold text-slate-800">
            {getCategoryLabel(permission.category)}
          </p>
        </div>

      </div>

      {/* FOOT NOTE */}
      <div className="text-xs text-slate-400">
        Cette permission contrôle l’accès à des fonctionnalités du système.
      </div>
    </Modal>
  );
}