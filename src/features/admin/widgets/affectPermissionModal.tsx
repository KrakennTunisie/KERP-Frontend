"use client";

import { useMemo, useState } from "react";
import { Modal } from "@/shared/components/ui/modal";
import { getCategoryLabel } from "../helpers/categoryHelper";
import PermissionFormWidget from "./permissionFormWidget";
import { AffectFormAttributes, ClientPermissions, Permission, PermissionDTO } from "../models/permission";
import { useForm, UseFormReturn } from "react-hook-form";

type Props = {
  loading: boolean;
  open: boolean;
  rolePermissions: PermissionDTO[];
  allPermissions: ClientPermissions[];
  onClose: () => void;
  onSubmit: (permissions: PermissionDTO[]) =>Promise<void>;
  form : UseFormReturn<AffectFormAttributes>
};

export function AddPermissionModal({
  loading,
  open,
  rolePermissions,
  allPermissions,
  onClose,
  onSubmit,
  form
}: Props) {
const [category, setCategory] = useState<string>("ALL");



const categories = useMemo(
  () => ["ALL", ...allPermissions.map(c => c.clientId)],
  [allPermissions]
);

const {
      watch,
      setValue,
      handleSubmit,
    } = form
const selected = watch("permissions");


const availablePermissions = useMemo(() => {

  return allPermissions
    .filter(client =>
      category === "ALL" || client.clientId === category
    )
    .map(client => ({
      ...client,
      permissions: client.permissions.filter(permission =>
        !rolePermissions.some(
          rp =>
            rp.clientId === client.clientId &&
            rp.name === permission.name
        )
      )
    }))
    .filter(client => client.permissions.length > 0);

}, [
  allPermissions,
  rolePermissions,
  category
]);


const togglePermission = (
  clientId: string,
  permission: Permission
) => {

  const exists = selected.some(
    p =>
      p.clientId === clientId &&
      p.name === permission.name
  );


  if (exists) {

    setValue(
      "permissions",
      selected.filter(
        p =>
          !(
            p.clientId === clientId &&
            p.name === permission.name
          )
      ),
      {
        shouldValidate: true
      }
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
        }
      ],
      {
        shouldValidate: true
      }
    );

  }
};

const submit = handleSubmit(async (data) =>  {

   await onSubmit(data.permissions);

  //reset();

  //setCategory("ALL");

  //onClose();

});

  return (
    <Modal
      open={open}
      title="Ajouter des permissions"
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <button
            disabled={loading}
            onClick={onClose}
            className="h-[34px] px-4 cursor-pointer rounded-lg border 
            border-blue-200 text-sm text-blue-500 hover:bg-blue-50 transition-colors
            disabled:cursor-not-allowed
            disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            disabled={loading}
            onClick={submit}
            className="h-[34px] px-4 cursor-pointer rounded-lg bg-blue-500 text-white text-sm font-medium 
            hover:bg-blue-700 transition-colors flex items-center gap-1.5
            disabled:cursor-not-allowed
            disabled:opacity-50"
          >
            <i className="ti ti-check text-sm" aria-hidden="true" />
            Enregistrer ({selected.length})
          </button>
        </div>
      }
    >
      <div className="space-y-4">

        {/* CATEGORY FILTER */}


        <div className="flex gap-1.5 flex-wrap mb-2.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-0.5 rounded-full text-xs border transition-all ${
                category === cat
                  ? "bg-gray-900 text-white border-transparent"
                  : "bg-transparent cursor-pointer text-gray-500 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {getCategoryLabel(cat)}
            </button>
          ))}
        </div>

        <div className="max-h-[420px] overflow-y-auto pr-2 space-y-5">
          {availablePermissions.map((client) => (
            <div key={client.clientId}>
              <p className="mb-2 text-xs font-semibold uppercase text-slate-500">
                {getCategoryLabel(client.clientId)}
              </p>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {client.permissions.map((permission) => (
                  <PermissionFormWidget
                    key={`${client.clientId}-${permission.name}`}
                    permission={permission}
                    selected={selected}
                    togglePermission={() =>
                      togglePermission(client.clientId, permission)
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}