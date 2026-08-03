"use client";

import { useState } from "react";
import { UserResponse } from "../../models/user";
import { Modal } from "@/shared/components/ui/modal";
import { usersAPI } from "../../services/api";
import { appToast } from "@/shared/lib/toast";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";

type UserStatusModalProps = {
  open: boolean;
  user: UserResponse;
  onClose: () => void;
  onSuccess?: () => void;
};

export function UserStatusModal({
  open,
  user,
  onClose,
  onSuccess,
}: UserStatusModalProps) {
  const [loading, setLoading] = useState(false);

  const isEnabled = user.status === "ACTIVE";

  const action = isEnabled ? "disable" : "enable";

  const handleStatusChange = async () => {
    try {
      setLoading(true);

      if (isEnabled) {
        await usersAPI.disableUser(user.keycloakUserId);

        appToast.success(
          "Utilisateur bloqué avec succès"
        );
      } else {
        await usersAPI.enableUser(user.keycloakUserId);

        appToast.success(
          "Utilisateur activé avec succès"
        );
      }

      onSuccess?.();
      onClose();

    } catch (err) {
      appToast.error(
        isEnabled
          ? "Erreur lors du blocage de l'utilisateur"
          : "Erreur lors de l'activation de l'utilisateur",
        getApiErrorMessage(err)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title={
        isEnabled
          ? `Bloquer l'utilisateur : ${user.firstName} ${user.lastName}`
          : `Activer l'utilisateur : ${user.firstName} ${user.lastName}`
      }
      onClose={onClose}
      footer={
        <>
          {/* CANCEL */}
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              h-9
              rounded-lg
              border border-slate-200
              bg-white
              px-4
              text-sm
              font-medium
              text-slate-600
              transition
              hover:bg-slate-50
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Annuler
          </button>

          {/* ACTION */}
          <button
            type="button"
            onClick={handleStatusChange}
            disabled={loading}
            className={`
              h-9
              rounded-lg
              px-4
              text-sm
              font-semibold
              text-white
              transition
              disabled:cursor-not-allowed
              disabled:opacity-50
              ${
                isEnabled
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }
            `}
          >
            {loading
              ? isEnabled
                ? "Blocage..."
                : "Activation..."
              : isEnabled
                ? "Bloquer"
                : "Activer"}
          </button>
        </>
      }
    >
      <div className="space-y-4">

        {/* CONFIRMATION */}
        <div
          className={`
            rounded-lg
            border
            p-4
            ${
              isEnabled
                ? "border-red-100 bg-red-50"
                : "border-green-100 bg-green-50"
            }
          `}
        >
          <p
            className={`
              text-sm
              font-medium
              ${
                isEnabled
                  ? "text-red-800"
                  : "text-green-800"
              }
            `}
          >
            {isEnabled
              ? "Êtes-vous sûr de vouloir bloquer cet utilisateur ?"
              : "Êtes-vous sûr de vouloir activer cet utilisateur ?"}
          </p>
        </div>

        {/* DESCRIPTION */}
        <p className="text-sm text-slate-500">
          {isEnabled
            ? "Cet utilisateur ne pourra plus accéder à l'application tant qu'il sera bloqué."
            : "Cet utilisateur pourra à nouveau accéder à l'application après son activation."}
        </p>
      </div>
    </Modal>
  );
}