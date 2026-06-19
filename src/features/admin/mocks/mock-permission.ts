import { z } from "zod";

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

export type Permission = {
  key: string;
  label: string;
  description: string;
  category: PermissionCategory;
};

export const mockPermissions: Permission[] = [
  // USER
  {
    key: "USER_VIEW",
    label: "Voir utilisateurs",
    description: "Accéder à la liste et aux détails des utilisateurs",
    category: permissionCategorySchema.enum.USER,
  },
  {
    key: "USER_CREATE",
    label: "Créer utilisateurs",
    description: "Créer de nouveaux comptes utilisateurs",
    category: permissionCategorySchema.enum.USER,
  },
  {
    key: "USER_EDIT",
    label: "Modifier utilisateurs",
    description: "Modifier les informations des utilisateurs",
    category: permissionCategorySchema.enum.USER,
  },
  {
    key: "USER_DELETE",
    label: "Supprimer utilisateurs",
    description: "Supprimer des comptes utilisateurs",
    category: permissionCategorySchema.enum.USER,
  },

  // ROLES
  {
    key: "ROLE_VIEW",
    label: "Voir rôles",
    description: "Consulter la liste des rôles",
    category: permissionCategorySchema.enum.USER,
  },
  {
    key: "ROLE_MANAGE",
    label: "Gérer rôles",
    description: "Créer et modifier les rôles et permissions",
    category: permissionCategorySchema.enum.USER,
  },

  // BILLING
  {
    key: "INVOICE_VIEW",
    label: "Voir factures",
    description: "Accéder aux factures clients et fournisseurs",
    category: permissionCategorySchema.enum.BILLING,
  },
  {
    key: "INVOICE_EXPORT",
    label: "Exporter factures",
    description: "Télécharger les factures au format Excel ou PDF",
    category: permissionCategorySchema.enum.BILLING,
  },
  {
    key: "PAYMENT_VIEW",
    label: "Voir paiements",
    description: "Consulter l’historique des paiements",
    category: permissionCategorySchema.enum.BILLING,
  },

  // REPORTING
  {
    key: "REPORT_VIEW",
    label: "Voir rapports",
    description: "Accéder aux tableaux de bord et rapports",
    category: permissionCategorySchema.enum.REPORTING,
  },

  // SYSTEM
  {
    key: "SYSTEM_CONFIG",
    label: "Configuration système",
    description: "Modifier les paramètres globaux du système",
    category: permissionCategorySchema.enum.SYSTEM,
  },
  {
    key: "AUDIT_LOGS",
    label: "Logs d’audit",
    description: "Consulter les journaux d’activité du système",
    category: permissionCategorySchema.enum.SYSTEM,
  },
];