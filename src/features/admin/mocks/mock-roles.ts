import { Role } from "../models/role";
import { mockPermissions } from "./mock-permission";




export const mockRoles: Role[] = [
  {
    id: "ROLE_ADMIN",
    name: "Administrateur",
    description: "Accès complet au système",
    permissions: mockPermissions, // full access
  },

  {
    id: "ROLE_MANAGER",
    name: "Manager",
    description: "Gestion des utilisateurs et reporting",
    permissions: mockPermissions.filter((p) =>
      [
        "USER_VIEW",
        "USER_EDIT",
        "ROLE_VIEW",
        "INVOICE_VIEW",
        "REPORT_VIEW",
      ].includes(p.name)
    ),
  },

  {
    id: "ROLE_ACCOUNTANT",
    name: "Comptable",
    description: "Gestion financière uniquement",
    permissions: mockPermissions.filter((p) =>
      [
        "INVOICE_VIEW",
        "INVOICE_EXPORT",
        "PAYMENT_VIEW",
        "REPORT_VIEW",
      ].includes(p.name)
    ),
  },

  {
    id: "ROLE_USER",
    name: "Utilisateur",
    description: "Accès limité aux données personnelles",
    permissions: mockPermissions.filter((p) =>
      ["USER_VIEW"].includes(p.name)
    ),
  },

  {
    id: "ROLE_SUPPORT",
    name: "Support",
    description: "Support client et lecture système",
    permissions: mockPermissions.filter((p) =>
      ["USER_VIEW", "INVOICE_VIEW", "AUDIT_LOGS"].includes(p.name)
    ),
  },
];