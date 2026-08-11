"use client";

import { useMemo, useState } from "react";
import { Modal } from "@/shared/components/ui/modal";
import { getCategoryLabel } from "../helpers/categoryHelper";
import { ClientPermissions, Permission } from "../models/permission";
import { CreateRole } from "../models/role";
import { UseFormReturn } from "react-hook-form";

export type RoleModalProps = {
  loading: boolean;
  mode: "create" | "edit";
  open: boolean;
  onClose: () => void;
  onSave: (role: CreateRole) => Promise<void>;
  permissions: ClientPermissions[];
  form : UseFormReturn<CreateRole>
};


const PERM_ICONS: Record<string, string> = {
  inv_read: "ti-file-invoice",
  inv_create: "ti-file-plus",
  inv_delete: "ti-trash",
  po_read: "ti-shopping-cart",
  po_create: "ti-cart-plus",
  user_manage: "ti-users",
  role_manage: "ti-shield",
  settings: "ti-settings",
};

export function RoleModalForm({
  loading,
  form,
  mode,
  open,
  onClose,
  onSave,
  permissions,
}: RoleModalProps) {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");


  const categories = useMemo(() => {
    const cats = Array.from(new Set(permissions.map((p) => p.clientId)));
    return ["ALL", ...cats];
  }, [permissions]);

  const filteredPermissions = useMemo(() => {
    if (activeCategory === "ALL") return permissions;
    return permissions.filter((p) => p.clientId === activeCategory);
  }, [permissions, activeCategory]);


    const {register,
      handleSubmit,
      setValue,
      watch,
      formState: { errors }
      } = form

const selectedPermissions = watch("permissions");

const togglePermission = (
  clientId: string,
  permission: Permission
) => {
  const selected = watch("permissions");

  const exists = selected.some(
    (p) =>
      p.clientId === clientId &&
      p.name === permission.name
  );

  if (exists) {
    setValue(
      "permissions",
      selected.filter(
        (p) =>
          !(
            p.clientId === clientId &&
            p.name === permission.name
          )
      ),
      { shouldValidate: true }
    );
  } else {
    setValue(
      "permissions",
      [
        ...selected,
        {
          clientId,
          name: permission.name,
          description: permission.description,
        },
      ],
      { shouldValidate: true }
    );
  }
};

const submit = async (data: CreateRole) => {
  await onSave(data);
  //reset();
 // onClose();
};


  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Créer un rôle" : "Modifier le rôle"}
      footer={
        <div className="flex justify-end gap-2">
          <button
            disabled={loading}
            onClick={onClose}
            className="h-[34px] px-4 cursor-pointer rounded-lg border border-blue-200 text-sm text-blue-500 
            hover:bg-blue-50 transition-colors
            disabled:cursor-not-allowed
            disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            disabled={loading}
            onClick={handleSubmit(submit)}
            className="h-[34px] px-4 cursor-pointer rounded-lg bg-blue-500 text-white text-sm font-medium 
            hover:bg-blue-800 transition-colors flex items-center gap-1.5
            disabled:cursor-not-allowed
            disabled:opacity-50"
          >
            <i className="ti ti-check text-sm" aria-hidden="true" />
            {loading ? "Chargement...": "Enregistrer"}
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">

        {/* Nom + Couleur */}
        <div className="grid grid-cols-[1fr_auto] gap-2.5 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">
              Nom du rôle
            </label>
            <input
              className="h-9 px-3 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100  transition-all"
              placeholder="ex. Comptable"
              {...register('name')}
            />
          </div>
          
        </div>
        {errors.name && (
            <p className="text-xs text-red-500 mt-1">
                {errors.name.message}
            </p>
        )}

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">
            Description{" "}
            <span className="font-normal text-gray-400">(optionnelle)</span>
          </label>
          <textarea
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 resize-none leading-relaxed focus:outline-none focus:ring-2 focus:ring-gray-100  transition-all"
            placeholder="Décrivez les responsabilités de ce rôle…"
            rows={2}
            {...register('description')}
          />
          {errors.description && (
              <p className="text-xs text-red-500 mt-1">
                  {errors.description.message}
              </p>
          )}
        </div>

        {/* Permissions */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-gray-500">
              Permissions
            </label>
            <span className="text-xs text-gray-400">
              {selectedPermissions.length} sélectionnée(s)
            </span>
          </div>

          {/* Onglets catégories */}
          <div className="flex gap-1.5 flex-wrap mb-2.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-0.5 rounded-full text-xs border transition-all ${
                  activeCategory === cat
                    ? "bg-gray-900 text-white border-transparent"
                    : "bg-transparent cursor-pointer text-gray-500 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {getCategoryLabel(cat)}
              </button>
            ))}
          </div>

          {/* Liste permissions */}
          <div className="border border-gray-100 rounded-lg max-h-[200px] overflow-y-auto bg-gray-50 divide-y divide-gray-100 scrollbar-thin">
          {filteredPermissions.map((client) => {
            const icon = PERM_ICONS[client.clientId] ?? "ti-lock";

            return (
              <div key={client.clientId} className="border-b border-gray-100 last:border-0">
                {/* Client header */}
                <div className="sticky top-0 z-10 flex items-center justify-between bg-gray-100 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <i className={`ti ${icon} text-blue-500`} />
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-700">
                      {getCategoryLabel(client.clientId)}
                    </span>
                  </div>

                  <span className="text-[11px] text-gray-400">
                    {client.permissions.length} permission
                    {client.permissions.length > 1 ? "s" : ""}
                  </span>
                </div>

                {/* Permissions */}
              {client.permissions && client.permissions.map((permission) => {
                  const key = `${client.clientId}:${permission.name}`;

                        const checked = selectedPermissions.some(
                            (p) =>
                              p.clientId === client.clientId &&
                              p.name === permission.name
                        );
                  return (
                    <label
                      key={key}
                      onClick={() => togglePermission(client.clientId, permission)}
                      className="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer hover:bg-white transition-colors"
                    >
                      {/* Checkbox */}
                      <span
                        className={`w-4 h-4 rounded-[4px] flex items-center justify-center flex-shrink-0 transition-all border ${
                          checked
                            ? "bg-blue-600 border-transparent"
                            : "bg-transparent border-blue-300"
                        }`}
                      >
                        {checked && (
                          <i
                            className="ti ti-check text-white text-xs"
                            aria-hidden="true"
                          />
                        )}
                      </span>

                      {/* Permission */}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {permission.name}
                        </p>

                        {permission.description && (
                          <p className="text-xs text-gray-500">
                            {permission.description}
                          </p>
                        )}
                      </div>

                      {/* Client badge */}
                      <span className="text-[11px] px-2 py-0.5 rounded-full border border-gray-200 bg-white text-gray-400">
                        {getCategoryLabel(client.clientId)}
                      </span>
                    </label>
                  );
                })}
              </div>
            );
          })}

            {filteredPermissions.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-6">
                Aucune permission dans cette catégorie
              </p>
            )}
          </div>
          {errors.permissions && (
              <p className="text-xs text-red-500 mt-1">
                  {errors.permissions.message}
              </p>
          )}        
          </div>
      </div>
    </Modal>
  );
}