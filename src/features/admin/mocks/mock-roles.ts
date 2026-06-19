import { mockPermissions, Permission } from "./mock-permission";



export type Role = {
  id: string;
  name: string;
  description: string;
  color: string;
  permissions: Permission[];
};


export const mockRoles: Role[] = [
  {
    id: "ROLE_ADMIN",
    name: "Administrateur",
    description: "Accès complet au système",
    color: "violet",
    permissions: mockPermissions, // full access
  },

  {
    id: "ROLE_MANAGER",
    name: "Manager",
    description: "Gestion des utilisateurs et reporting",
    color: "blue",
    permissions: mockPermissions.filter((p) =>
      [
        "USER_VIEW",
        "USER_EDIT",
        "ROLE_VIEW",
        "INVOICE_VIEW",
        "REPORT_VIEW",
      ].includes(p.key)
    ),
  },

  {
    id: "ROLE_ACCOUNTANT",
    name: "Comptable",
    description: "Gestion financière uniquement",
    color: "emerald",
    permissions: mockPermissions.filter((p) =>
      [
        "INVOICE_VIEW",
        "INVOICE_EXPORT",
        "PAYMENT_VIEW",
        "REPORT_VIEW",
      ].includes(p.key)
    ),
  },

  {
    id: "ROLE_USER",
    name: "Utilisateur",
    description: "Accès limité aux données personnelles",
    color: "slate",
    permissions: mockPermissions.filter((p) =>
      ["USER_VIEW"].includes(p.key)
    ),
  },

  {
    id: "ROLE_SUPPORT",
    name: "Support",
    description: "Support client et lecture système",
    color: "amber",
    permissions: mockPermissions.filter((p) =>
      ["USER_VIEW", "INVOICE_VIEW", "AUDIT_LOGS"].includes(p.key)
    ),
  },
];