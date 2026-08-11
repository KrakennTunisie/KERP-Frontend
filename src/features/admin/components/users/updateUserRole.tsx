"use client";

import  { useEffect, useState } from "react";
import { RoleDTO } from "../../models/role";
import { Modal } from "@/shared/components/ui/modal";
import {  rolesAPI, usersAPI } from "../../services/api";
import { appToast } from "@/shared/lib/toast";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";
import { UserResponse } from "../../models/user";



type ChangeUserRoleModalProps = {
  open: boolean;
  user: UserResponse;
  currentRole?: string;
  roles?:RoleDTO[];
  onClose: () => void;
  onSuccess: ()=>void;
};

export function ChangeUserRoleModal({
  open,
  user,
  roles,
  currentRole,
  onClose,
  onSuccess
}: ChangeUserRoleModalProps) {
  const [selectedRole, setSelectedRole] = useState(currentRole ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchedRoles, setRoles] = useState<RoleDTO[]|[]>([])

  const fetchRoles = async ()=>{
    try {
      const response = await rolesAPI.getRoles();
      setRoles(response)
        
    } catch (error) {
      appToast.error("Erreur de fetch roles", getApiErrorMessage(error))
    }
  }

    useEffect(()=>{
        if(!roles){
            fetchRoles()
        }
        else{
            setRoles(roles)
        }
    },[])

  useEffect(() => {
    if (open) {
      setSelectedRole(currentRole ?? "");
      setError(null);
    }
  }, [open, currentRole]);

  const handleChangeRole = async () => {
    if (!selectedRole) {
      setError("Veuillez sélectionner un rôle.");
      return;
    }

    if (selectedRole === currentRole) {
      setError("Le nouvel rôle doit être différent du rôle actuel.");
      return;
    }

    try {
      setLoading(true);
      await usersAPI.updateUserRole(user.keycloakUserId, selectedRole)
      appToast.success("Rôle modifié avec succèes");
      onSuccess();
      onClose();
    } catch (err) {
      appToast.error("Erreur modification d rôle", getApiErrorMessage(err))
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title={`Modifier le rôle de l'utilisateur: ${user.firstName+ " "+ user.lastName}`}
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              px-4 py-2
              rounded-lg
              border border-gray-200
              text-sm font-medium
              text-gray-700
              hover:bg-gray-50
              transition
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={handleChangeRole}
            disabled={loading || !selectedRole}
            className="
              px-4 py-2
              rounded-lg
              bg-blue-600
              text-sm font-medium
              text-white
              hover:bg-blue-700
              transition
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {loading ? "Modification..." : "Modifier le rôle"}
          </button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Current Role */}
        <div>
            

          <Input
                    readOnly
                    label="Rôle actuel"
                    placeholder={currentRole || "Aucun rôle"}
                    type="text"
                    className="bg-slate-100 text-slate-500 cursor-not-allowed"
                />

        </div>

        {/* New Role */}
        <div>


          <Label required>
                    Rôle
                    </Label>

                    <Select
                      disabled={loading}
                      onValueChange={(value) =>
                           setSelectedRole(value)
                      }
                  >
                      <SelectTrigger className="bg-slate-50">
                          <SelectValue placeholder="Sélectionner un nouveau rôle" />
                      </SelectTrigger>

                      <SelectContent>
                        
                          {fetchedRoles.map((role) => (
                              <SelectItem
                                  key={role.id}
                                  value={role.name}
                              >
                                  {role.name}
                              </SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}