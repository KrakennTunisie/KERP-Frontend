import { z } from "zod";
import {  PermissionDTO } from "../models/permission";

export const permissionCategorySchema = z.enum([
  "USER",
  "BILLING",
  "SYSTEM",
  "REPORTING",
]);

export type PermissionCategory = z.infer<
  typeof permissionCategorySchema
>;
export const PERMISSION_CATEGORY_OPTIONS = Object.values(
  permissionCategorySchema.enum
).map((value) => ({
  value,
  label: value,
}));

export const mockPermissions: PermissionDTO[] = [
  // USER
  {
    name: "Voir utilisateurs",
    description: "Accéder à la liste et aux détails des utilisateurs",
    clientId: ""
  },
  {
    name: "Créer utilisateurs",
    description: "Créer de nouveaux comptes utilisateurs",
    clientId: ""
  },
  {
    name: "USER_EDIT",
    description: "Modifier les informations des utilisateurs",
    clientId: ""
  },
  {
    name: "USER_DELETE",
    description: "Supprimer des comptes utilisateurs",
    clientId: ""
  },

  // ROLES
  {
    name: "ROLE_VIEW",
    description: "Consulter la liste des rôles",
    clientId: ""
  },
  {
    name: "ROLE_MANAGE",
    description: "Créer et modifier les rôles et permissions",
    clientId: ""
  },

  // BILLING
  {
    name: "INVOICE_VIEW",
    description: "Accéder aux factures clients et fournisseurs",
    clientId: ""
  },
  {
    name: "INVOICE_EXPORT",
    description: "Télécharger les factures au format Excel ou PDF",
    clientId: ""
  },
  {
    name: "PAYMENT_VIEW",
    description: "Consulter l’historique des paiements",
    clientId: ""
  },

  // REPORTING
  {
    name: "REPORT_VIEW",
    description: "Accéder aux tableaux de bord et rapports",
    clientId: ""
  },

  // SYSTEM
  {
    name: "SYSTEM_CONFIG",
    description: "Modifier les paramètres globaux du système",
    clientId: ""
  },
  {
    name: "AUDIT_LOGS",
    description: "Consulter les journaux d’activité du système",
    clientId: ""
  },
];